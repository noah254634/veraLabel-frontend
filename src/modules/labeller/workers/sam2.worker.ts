// ⚡ MUST import the webgpu sub-path — regular 'onnxruntime-web' does NOT include
// the WebGPU backend shaders. This is the same approach Meta's SAM2 demo uses.
import * as ort from "onnxruntime-web/webgpu";
import JSZip from "jszip";
import { contours } from "d3-contour";

// Point ORT at the JSEP WASM files hosted on jsDelivr.
ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.26.0/dist/";

// Single-threaded mode — avoids the SharedArrayBuffer / COOP-COEP requirement
// while still using SIMD. WebGPU offloads the heavy lifting anyway.
ort.env.wasm.numThreads = 1;

let session: ort.InferenceSession | null = null;

// Cache parsed embedding tensors (keyed by URL)
const embeddingCache: Record<string, EmbeddingTensors> = {};
const fetchingPromises: Record<string, Promise<EmbeddingTensors>> = {};

interface EmbeddingTensors {
  image_embed: ort.Tensor;
  high_res_feat_0: ort.Tensor;
  high_res_feat_1: ort.Tensor;
  origH: number;
  origW: number;
}

// ─── NPY parser ───────────────────────────────────────────────────────────────
// Handles both N-dim and 0-dim (scalar) arrays, and both float32 (<f4)
// and float64 (<f8) dtypes. numpy saves plain Python floats as float64.
function parseNpy(buffer: ArrayBuffer): { data: Float32Array; shape: number[]; dtype: string } {
  const view = new DataView(buffer);

  if (
    view.getUint8(0) !== 0x93 ||
    String.fromCharCode(view.getUint8(1), view.getUint8(2), view.getUint8(3), view.getUint8(4), view.getUint8(5)) !== "NUMPY"
  ) {
    throw new Error("Not a valid .npy file (bad magic bytes)");
  }

  const major = view.getUint8(6);
  let headerLen: number;
  let headerStart: number;
  let dataOffset: number;
  if (major === 1) {
    headerLen = view.getUint16(8, true);
    headerStart = 10;
    dataOffset = 10 + headerLen;
  } else {
    headerLen = view.getUint32(8, true);
    headerStart = 12;
    dataOffset = 12 + headerLen;
  }

  const headerStr = new TextDecoder().decode(new Uint8Array(buffer, headerStart, headerLen));

  // Shape — handles "()" for 0-dim scalars
  const shapeMatch = headerStr.match(/'shape':\s*\(([^)]*)\)/);
  let shape: number[] = [];
  if (shapeMatch && shapeMatch[1].trim() !== "") {
    shape = shapeMatch[1]
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
  }

  // Dtype — distinguish float32 (<f4) from float64 (<f8)
  const descrMatch = headerStr.match(/'descr':\s*'([^']+)'/);
  const dtype = descrMatch ? descrMatch[1] : "<f4";

  let data: Float32Array;
  if (dtype === "<f8" || dtype === ">f8" || dtype === "=f8") {
    // float64: read as Float64Array, then downcast to Float32Array so the rest
    // of the pipeline stays uniform (precision loss is fine for H/W scalars)
    const f64 = new Float64Array(buffer, dataOffset);
    data = new Float32Array(f64.length);
    for (let i = 0; i < f64.length; i++) data[i] = f64[i];
  } else {
    data = new Float32Array(buffer, dataOffset);
  }

  return { data, shape, dtype };
}

// ─── IndexedDB Cache ─────────────────────────────────────────────────────────
const DB_NAME = "SAM2CacheDB";
const STORE_NAME = "embeddings";

function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getFromDB(key: string): Promise<ArrayBuffer | null> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("[SAM2 Worker] IndexedDB get failed:", err);
    return null;
  }
}

async function saveToDB(key: string, buffer: ArrayBuffer): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(buffer, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("[SAM2 Worker] IndexedDB save failed:", err);
  }
}

export async function clearDB(): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => {
        console.log("[SAM2 Worker] IndexedDB cache cleared.");
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("[SAM2 Worker] IndexedDB clear failed:", err);
  }
}

async function getEmbedding(embeddingUrl: string): Promise<EmbeddingTensors> {
  // Use the pathname as a unique key to ignore rotating AWS signature query params
  const cacheKey = new URL(embeddingUrl).pathname;
  
  if (embeddingCache[cacheKey]) return embeddingCache[cacheKey];
  if (cacheKey in fetchingPromises) return fetchingPromises[cacheKey] as Promise<EmbeddingTensors>;

  fetchingPromises[cacheKey] = (async () => {
    let arrayBuffer = await getFromDB(cacheKey);

    if (arrayBuffer) {
      console.log("[SAM2 Worker] Loaded embedding from IndexedDB:", cacheKey);
    } else {
      console.log("[SAM2 Worker] Fetching embedding from Network:", embeddingUrl);
      const t0 = performance.now();
      const res = await fetch(embeddingUrl);
      if (!res.ok) throw new Error(`Embedding fetch failed: ${res.status} ${res.statusText}`);
      arrayBuffer = await res.arrayBuffer();
      console.log(`[SAM2 Worker] Fetched ${(arrayBuffer.byteLength / 1024).toFixed(1)} KB in ${(performance.now() - t0).toFixed(0)}ms`);
      
      // Fire-and-forget save to IndexedDB
      saveToDB(cacheKey, arrayBuffer).catch(e => console.error("IDB save error:", e));
    }

    // The backend saves with np.savez_compressed → it's a ZIP regardless of the .npy extension
    const zip = await JSZip.loadAsync(arrayBuffer);

    const fileNames = Object.keys(zip.files);
    console.log("[SAM2 Worker] NPZ contents:", fileNames);

    const getFile = (key: string) => zip.file(`${key}.npy`) || zip.file(key);

    const imgEmbedFile = getFile("image_embed");
    const hr0File = getFile("high_res_feat_0");
    const hr1File = getFile("high_res_feat_1");

    if (!imgEmbedFile || !hr0File || !hr1File) {
      throw new Error(`Invalid NPZ — missing required arrays. Found: [${fileNames.join(", ")}]. Need: image_embed, high_res_feat_0, high_res_feat_1`);
    }

    const parsedEmbed = parseNpy(await imgEmbedFile.async("arraybuffer"));
    const parsedHr0 = parseNpy(await hr0File.async("arraybuffer"));
    const parsedHr1 = parseNpy(await hr1File.async("arraybuffer"));

    let origH = 0, origW = 0;
    const origHFile = getFile("orig_h");
    const origWFile = getFile("orig_w");
    if (origHFile && origWFile) {
      const ph = parseNpy(await origHFile.async("arraybuffer"));
      const pw = parseNpy(await origWFile.async("arraybuffer"));
      origH = ph.data[0];
      origW = pw.data[0];
    } else {
      console.warn("[SAM2 Worker] orig_h / orig_w not found in NPZ — defaulting to 1024×1024");
      origH = 1024; origW = 1024;
    }

    if (!origH || !origW || !isFinite(origH) || !isFinite(origW)) {
      throw new Error(`origH/origW invalid after parsing: H=${origH} W=${origW}.`);
    }

    const expectedEmbedSize = 1 * 256 * 64 * 64;
    if (parsedEmbed.data.length !== expectedEmbedSize) {
      throw new Error(`image_embed size mismatch: got ${parsedEmbed.data.length}, expected ${expectedEmbedSize}`);
    }

    const tensors: EmbeddingTensors = {
      image_embed: new ort.Tensor("float32", parsedEmbed.data, parsedEmbed.shape.length > 0 ? parsedEmbed.shape : [1, 256, 64, 64]),
      high_res_feat_0: new ort.Tensor("float32", parsedHr0.data, parsedHr0.shape.length > 0 ? parsedHr0.shape : [1, 32, 256, 256]),
      high_res_feat_1: new ort.Tensor("float32", parsedHr1.data, parsedHr1.shape.length > 0 ? parsedHr1.shape : [1, 64, 128, 128]),
      origH,
      origW,
    };

    // Evict oldest entry from memory cache when exceeds 15
    const cacheKeys = Object.keys(embeddingCache);
    if (cacheKeys.length >= 15) delete embeddingCache[cacheKeys[0]];
    embeddingCache[cacheKey] = tensors;

    delete fetchingPromises[cacheKey];
    return tensors;
  })().catch(err => {
    delete fetchingPromises[cacheKey];
    throw err;
  });

  return fetchingPromises[cacheKey];
}

// ─── Worker message handler ───────────────────────────────────────────────────

let warmupPromise: Promise<void> | null = null;

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  try {
    // ── INIT ──────────────────────────────────────────────────────────────────
    if (type === "INIT") {
      if (!session) {
        console.log("[SAM2 Worker] Loading ONNX model (WebGPU build)...");
        const t0 = performance.now();

        // Primary: WebGPU — requires 'onnxruntime-web/webgpu' import and Chrome 113+
        // Fallback: wasm with numThreads=1 (no SharedArrayBuffer needed, ~2-5s)
        try {
          session = await ort.InferenceSession.create("/models/sam2_hiera_tiny.onnx", {
            executionProviders: ["webgpu"],
            graphOptimizationLevel: "all",
          });
          console.log(`[SAM2 Worker] ✅ WebGPU session ready in ${(performance.now() - t0).toFixed(0)}ms`);
        } catch (gpuErr) {
          console.warn("[SAM2 Worker] WebGPU failed, using single-threaded WASM:", (gpuErr as Error).message);
          const t1 = performance.now();
          session = await ort.InferenceSession.create("/models/sam2_hiera_tiny.onnx", {
            executionProviders: ["wasm"],
            graphOptimizationLevel: "all",
          });
          console.log(`[SAM2 Worker] ✅ WASM session ready in ${(performance.now() - t1).toFixed(0)}ms`);
        }

        warmupPromise = (async () => {
          try {
            self.postMessage({ type: "WARMUP_START" });
            console.log("[SAM2 Worker] Warming up WebGPU shaders during initialization...");
            const tWarmup = performance.now();
            const dummyInputs = {
              image_embed: new ort.Tensor("float32", new Float32Array(256 * 64 * 64).fill(0), [1, 256, 64, 64]),
              high_res_feats_0: new ort.Tensor("float32", new Float32Array(32 * 256 * 256).fill(0), [1, 32, 256, 256]),
              high_res_feats_1: new ort.Tensor("float32", new Float32Array(64 * 128 * 128).fill(0), [1, 64, 128, 128]),
              point_coords: new ort.Tensor("float32", new Float32Array([0, 0]), [1, 1, 2]),
              point_labels: new ort.Tensor("float32", new Float32Array([-1]), [1, 1]),
              mask_input: new ort.Tensor("float32", new Float32Array(256 * 256).fill(0), [1, 1, 256, 256]),
              has_mask_input: new ort.Tensor("float32", new Float32Array([0]), [1]),
            };
            await session.run(dummyInputs);
            console.log(`[SAM2 Worker] Shader warmup complete in ${(performance.now() - tWarmup).toFixed(0)}ms.`);
          } catch (warmupErr) {
            console.warn("[SAM2 Worker] Shader warmup failed, but continuing:", warmupErr);
          } finally {
            self.postMessage({ type: "WARMUP_COMPLETE" });
          }
        })();

        console.log("[SAM2 Worker] Inputs :", session.inputNames);
        console.log("[SAM2 Worker] Outputs:", session.outputNames);
      }
      self.postMessage({ type: "INIT_SUCCESS" });
    }


    // ── PREFETCH_BATCH ────────────────────────────────────────────────────────
    else if (type === "PREFETCH_BATCH") {
      const { urls } = payload;
      console.log(`[SAM2 Worker] PREFETCH_BATCH received with ${urls.length} urls`);
      // We don't await here because we want it to run in the background without blocking the message loop
      (async () => {
        for (const url of urls) {
          try {
            await getEmbedding(url);
            self.postMessage({ type: "PREFETCH_PROGRESS", payload: { url } });
          } catch (err) {
            console.warn(`[SAM2 Worker] Failed to prefetch ${url}:`, err);
          }
        }
        console.log(`[SAM2 Worker] PREFETCH_BATCH complete.`);
      })();
    }

    // ── CLEAR_CACHE ───────────────────────────────────────────────────────────
    else if (type === "CLEAR_CACHE") {
      console.log(`[SAM2 Worker] CLEAR_CACHE received. Wiping IndexedDB...`);
      clearDB();
    }

    // ── DECODE ────────────────────────────────────────────────────────────────
    else if (type === "DECODE") {
      if (!session) throw new Error("ONNX Session not initialized.");
      if (warmupPromise) {
        console.log("[SAM2 Worker] Waiting for shader warmup to complete...");
        await warmupPromise;
      }

      const { embeddingUrl, prompts } = payload;
      console.log(`[SAM2 Worker] DECODE request — url: ${embeddingUrl}, prompts: ${prompts.length}`);

      // ── 1. Load & parse embeddings ─────────────────────────────────────────
      let tensors = await getEmbedding(embeddingUrl);

      // ── 2. Run inference for each prompt ───────────────────────────────────
      const SAM2_SIZE = 1024; // SAM2 always operates at 1024×1024 internally
      const results: { box_index: number; polygon: number[][] }[] = [];

      for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];
        console.log(`[SAM2 Worker] Processing prompt ${i}:`, JSON.stringify(prompt));

        let pointCoords: number[] = [];
        let pointLabels: number[] = [];

        const sx = SAM2_SIZE / tensors.origW;
        const sy = SAM2_SIZE / tensors.origH;

        if (prompt.box) {
          // box coords are in original image pixels — scale to SAM2's 1024×1024 space
          const [x1, y1, x2, y2] = prompt.box as number[];
          pointCoords.push(x1 * sx, y1 * sy, x2 * sx, y2 * sy);
          pointLabels.push(2, 3); // 2=top-left corner, 3=bottom-right corner (SAM2 bbox encoding)
        } else if (prompt.points) {
          (prompt.points as number[][]).forEach((pt, idx) => {
            pointCoords.push(pt[0] * sx, pt[1] * sy);
            pointLabels.push((prompt.point_labels as number[])[idx]);
          });
          // SAM2 requires padding point for point-only prompts
          pointCoords.push(0, 0);
          pointLabels.push(-1);
        }

        const numPoints = pointLabels.length;
        console.log(`[SAM2 Worker] numPoints=${numPoints}, coords=[${pointCoords.map(v => v.toFixed(1)).join(",")}], labels=[${pointLabels.join(",")}]`);

        const inputs = {
          image_embed: tensors.image_embed,
          high_res_feats_0: tensors.high_res_feat_0,
          high_res_feats_1: tensors.high_res_feat_1,
          point_coords: new ort.Tensor("float32", new Float32Array(pointCoords), [1, numPoints, 2]),
          // SAM2 decoder expects float32 for point_labels (not int64)
          point_labels: new ort.Tensor("float32", new Float32Array(pointLabels), [1, numPoints]),
          mask_input: new ort.Tensor("float32", new Float32Array(256 * 256).fill(0), [1, 1, 256, 256]),
          has_mask_input: new ort.Tensor("float32", new Float32Array([0]), [1]),
        };

        const t0 = performance.now();
        const output = await session.run(inputs);
        console.log(`[SAM2 Worker] Inference done in ${(performance.now() - t0).toFixed(0)}ms`);
        console.log("[SAM2 Worker] Output keys:", Object.keys(output));

        // ── 3. Extract best mask ─────────────────────────────────────────────
        const masksTensor = output.masks ?? output[session.outputNames[0]];
        const iouTensor = output.iou_predictions ?? output[session.outputNames[1]];

        if (!masksTensor) throw new Error("Model did not produce a 'masks' output");

        const maskDims = Array.from(masksTensor.dims) as number[];
        console.log(`[SAM2 Worker] masks dims: [${maskDims}]`);
        // Expected: [1, N, H, W] where H=W=256 (post-processed) or H=W=1024
        const numCandidates = maskDims[1];
        const maskH = maskDims[2];
        const maskW = maskDims[3];

        // Pick candidate with highest IoU score
        const iouData = iouTensor ? (iouTensor.data as Float32Array) : new Float32Array(numCandidates).fill(1);
        console.log(`[SAM2 Worker] IoU scores: [${Array.from(iouData).map(v => (v as number).toFixed(4)).join(", ")}]`);
        let bestIdx = 0;
        for (let k = 1; k < numCandidates; k++) {
          if (iouData[k] > iouData[bestIdx]) bestIdx = k;
        }
        console.log(`[SAM2 Worker] Best mask index: ${bestIdx}`);

        const maskData = masksTensor.data as Float32Array;
        const sliceOffset = bestIdx * maskH * maskW;

        // ── 4. Threshold → binary grid ────────────────────────────────────────
        const grid = new Float32Array(maskH * maskW);
        let positivePixels = 0;
        for (let j = 0; j < grid.length; j++) {
          grid[j] = maskData[sliceOffset + j] > 0.0 ? 1 : 0;
          if (grid[j] === 1) positivePixels++;
        }
        console.log(`[SAM2 Worker] Positive pixels: ${positivePixels} / ${grid.length} (${(positivePixels / grid.length * 100).toFixed(1)}%)`);

        if (positivePixels === 0) {
          console.warn(`[SAM2 Worker] Prompt ${i} produced empty mask — skipping contour`);
          results.push({ box_index: i, polygon: [] });
          continue;
        }

        // ── 5. Extract contour ────────────────────────────────────────────────
        const contourGen = contours().size([maskW, maskH]).thresholds([0.5]);
        const multiPolygon = contourGen(Array.from(grid));
        console.log(`[SAM2 Worker] Contour polygons: ${multiPolygon.length}`);

        // ── 6. Scale back to original image pixel coords ───────────────────────
        const scaleX = tensors.origW / maskW;
        const scaleY = tensors.origH / maskH;

        let poly: number[][] = [];
        if (multiPolygon.length > 0) {
          let largestRing: [number, number][] | null = null;
          let maxPts = 0;
          for (const polyObj of multiPolygon) {
            for (const polygon of polyObj.coordinates) {
              const ring = polygon[0];
              if (ring && ring.length > maxPts) {
                maxPts = ring.length;
                largestRing = ring as [number, number][];
              }
            }
          }
          if (largestRing) {
            poly = largestRing.map(([px, py]) => [px * scaleX, py * scaleY]);
            const nanCount = poly.filter(([x, y]) => isNaN(x) || isNaN(y)).length;
            if (nanCount > 0) console.error(`[SAM2 Worker] ${nanCount} NaN coords in polygon!`);
            console.log(`[SAM2 Worker] Polygon: ${poly.length} pts | first=[${poly[0]?.map(v => v.toFixed(1)).join(",")}]`);
          }
        }

        results.push({ box_index: i, polygon: poly });
      }

      self.postMessage({ type: "DECODE_SUCCESS", results });
    }
  } catch (err: any) {
    console.error("[SAM2 Worker] Exception:", err);
    self.postMessage({ type: "ERROR", error: err.message });
  }
};
