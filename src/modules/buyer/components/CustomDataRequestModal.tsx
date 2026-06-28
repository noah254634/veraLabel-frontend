import React, { useState, useRef, useEffect } from "react";
import { useBuyerStore } from "../store/buyerStore";
import { isAudioFile } from "../constants/checkAudio";
import {
  Database,
  Cpu,
  ChevronRight,
  Loader2,
  ShieldCheck,
  Upload,
  Terminal,
  AlertCircle,
  FileJson,
  MessageSquareText,
  Headphones,
  TableProperties,
  Activity,
} from "lucide-react";
import { toast } from "react-hot-toast";
import type { Domain, LabellingMethod, ContentType } from "../types/datasetRequest";
import {
  protocolMatchesLabellingMethod,
  inferContentTypeFromDomain,
  fileMatchesContentType,
} from "../../../shared/utils/labellingProtocol";
import { buildApiUrl } from "../../../shared/utils/apiUrl";

const CONTENT_TYPE_OPTIONS: { id: ContentType; label: string }[] = [
  { id: "text", label: "Text" },
  { id: "audio", label: "Audio" },
  { id: "video", label: "Video" },
  { id: "image", label: "Image" },
  { id: "code", label: "Code" },
  { id: "document", label: "Document" },
];

const LABELLING_METHOD_OPTIONS: { id: LabellingMethod; label: string; description: string }[] = [
  { id: "rlhf", label: "RLHF", description: "Preference ranking, dimensional scoring, rationale" },
  { id: "classification", label: "Classification", description: "Category labels and single-choice decisions" },
  { id: "annotation", label: "Annotation", description: "Spans, entities, bounding boxes, tags" },
  { id: "transcription", label: "Transcription", description: "Speech-to-text or timed alignment" },
];

const TOTAL_STEPS = 8;

const initialFormData = {
  name: "",
  domain: "",
  labellingMethod: "" as LabellingMethod | "",
  contentType: "" as ContentType | "",
  specifications: "",
  volume: "",
  format: "",
  timeline: "",
  qualityMetrics: "",
  uploadedFile: null as File | null,
  instructionId: "",
};

// Domain-specific timeline options (in days)
const DOMAIN_TIMELINES: Record<string, Array<{ label: string; days: number; description: string }>> = {
  Code: [
    { label: "Expedited", days: 7, description: "Senior reviewers, fast turnaround on code tasks" },
    { label: "Standard", days: 14, description: "Balanced delivery with multi-reviewer consensus" },
    { label: "Relaxed", days: 30, description: "30-day delivery, optimized for cost" },
  ],
  Legal: [
    { label: "Expedited", days: 7, description: "Rapid legal review with prioritized handling" },
    { label: "Standard", days: 14, description: "Balanced delivery with multi-reviewer consensus" },
    { label: "Relaxed", days: 30, description: "30-day delivery, optimized for cost" },
  ],
  NLP: [
    { label: "Express", days: 5, description: "Native speakers, domain expertise included" },
    { label: "Standard", days: 14, description: "Verified annotators, quality assurance" },
    { label: "Budget", days: 21, description: "Community annotators, standard QA" },
  ],
  Audio: [
    { label: "Premium", days: 10, description: "Native speakers, accent diversity guaranteed" },
    { label: "Standard", days: 21, description: "Balanced native/non-native speakers" },
    { label: "Standard", days: 30, description: "High-volume, cost-optimized" },
  ],
  Tabular: [
    { label: "Fast", days: 7, description: "Expedited validation and normalization" },
    { label: "Standard", days: 14, description: "Full schema validation, duplicate removal" },
    { label: "Comprehensive", days: 21, description: "Deep analysis, anomaly detection" },
  ],
  Medical: [
    { label: "Premium", days: 10, description: "MD-verified annotators, expedited turnaround" },
    { label: "Standard", days: 21, description: "Standard clinical consensus review" },
    { label: "Budget", days: 30, description: "Medical student annotators, standard QA" },
  ],
};

const CustomDataRequestModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { datasetRequest, generateUploadUrl, uploadFileToS3, confirmUpload, loading, getProtocols, buyerProfile } = useBuyerStore();
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<"labeling" | "sourcing" | null>(null);
  const [protocols, setProtocols] = useState<any[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<any>(null);
  const [buyerAnswers, setBuyerAnswers] = useState<any[]>([]);
  const [validationLog, setValidationLog] = useState<
    { msg: string; type: "error" | "success" }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState(initialFormData);
  const [maxLabellers, setMaxLabellers] = useState<number>(1);
  const [selectedTimeline, setSelectedTimeline] = useState<number | null>(null);
  const [submissionStep, setSubmissionStep] = useState<"idle" | "generating_url" | "uploading_file" | "creating_request" | "initiating_split" | "splitting_dataset">("idle");
  const [createdDatasetId, setCreatedDatasetId] = useState<string | null>(null);
  const [telemetryLogs, setTelemetryLogs] = useState<{ time: string; type: string; message: string }[]>([]);
  const [telemetryProgress, setTelemetryProgress] = useState<number>(0);
  const [telemetryStatus, setTelemetryStatus] = useState<"active" | "completed" | "failed">("active");

  const resetModalState = () => {
    setStep(0);
    setIntent(null);
    setValidationLog([]);
    setFormData(initialFormData);
    setMaxLabellers(1);
    setSelectedTimeline(null);
    setProtocols([]);
    setSelectedProtocol(null);
    setBuyerAnswers([]);
    setSubmissionStep("idle");
    setCreatedDatasetId(null);
    setTelemetryLogs([]);
    setTelemetryProgress(0);
    setTelemetryStatus("active");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleModalClose = () => {
    if (loading) return;
    resetModalState();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      resetModalState();
    }
  }, [isOpen]);

  useEffect(() => {
    if (submissionStep !== "splitting_dataset" || !createdDatasetId) return;

    const projectId = buyerProfile?._id || "unknown";
    const datasetId = createdDatasetId;

    setTelemetryLogs([
      {
        time: new Date().toLocaleTimeString(),
        type: "system",
        message: "Establishing secure link to splitting telemetry..."
      }
    ]);
    setTelemetryProgress(0);
    setTelemetryStatus("active");

    const sseUrl = buildApiUrl(`/tasks/progress/${projectId}/${datasetId}/stream`);
    const eventSource = new EventSource(sseUrl, { withCredentials: true });

    const appendLog = (type: string, message: string) => {
      setTelemetryLogs(prev => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          type,
          message
        }
      ]);
    };

    let fallbackInterval: any = null;
    const startFallbackPolling = () => {
      if (fallbackInterval) return;
      appendLog("system", "SSE connection degraded. Initializing HTTP telemetry polling...");
      
      fallbackInterval = setInterval(async () => {
        try {
          const response = await fetch(buildApiUrl(`/tasks/progress/${projectId}/${datasetId}`));
          if (!response.ok) throw new Error("Status poll failed");
          const resJson = await response.json();
          const summary = resJson.data || resJson;
          
          if (summary) {
            if (summary.lastProgressUpdate) {
              const targetVol = parseInt(formData.volume) || 1;
              const percent = Math.min(Math.round((summary.lastProgressUpdate / targetVol) * 100), 100);
              setTelemetryProgress(percent);
            }
            
            if (summary.errors && Array.isArray(summary.errors)) {
              summary.errors.forEach((err: any) => {
                appendLog("error", `[Failure] ${err.message}`);
              });
            }

            if (summary.status === "completed" || summary.status === "failed") {
              setTelemetryStatus(summary.status);
              appendLog("system", `Telemetry session finalized with status: ${summary.status.toUpperCase()}`);
              clearInterval(fallbackInterval);
            }
          }
        } catch (err: any) {
          console.error("Telemetry fallback error:", err);
        }
      }, 2000);
    };

    const connTimeout = setTimeout(() => {
      if (eventSource.readyState !== EventSource.OPEN) {
        eventSource.close();
        startFallbackPolling();
      }
    }, 3500);

    eventSource.onopen = () => {
      clearTimeout(connTimeout);
      appendLog("system", "Secure telemetry stream established. Monitoring splitter node...");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data) return;

        switch (data.type) {
          case "connected":
            appendLog("system", "Worker handshaking successful.");
            break;
          case "progress":
            appendLog("progress", data.message);
            if (data.metadata?.count) {
              const targetVol = parseInt(formData.volume) || 1;
              const percent = Math.min(Math.round((data.metadata.count / targetVol) * 100), 100);
              setTelemetryProgress(percent);
            }
            break;
          case "checkpoint":
            appendLog("checkpoint", `[Checkpoint] ${data.label} (Elapsed: ${data.metrics?.elapsedMs || 0}ms)`);
            break;
          case "error":
            appendLog("error", `[Failure] (${data.severity || 'error'}) ${data.message}`);
            break;
          case "session_complete":
            setTelemetryStatus(data.status);
            if (data.status === "completed") {
              setTelemetryProgress(100);
              appendLog("complete", "All dataset shards registered. Invoice calculated.");
            } else {
              appendLog("error", "Worker process crashed. Refer to failure metrics.");
            }
            eventSource.close();
            break;
          case "complete":
            setTelemetryProgress(100);
            appendLog("complete", `Data ingestion complete: ${data.summary?.totalCount || 'All'} elements parsed successfully.`);
            break;
        }
      } catch (err) {
        console.error("Error parsing telemetry stream message:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn("EventSource encountered connection error. Triggering fallback...", err);
      eventSource.close();
      clearTimeout(connTimeout);
      startFallbackPolling();
    };

    return () => {
      eventSource.close();
      clearTimeout(connTimeout);
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [submissionStep, createdDatasetId, buyerProfile]);

  if (!isOpen) return null;

  // Validate file structure
  const validateFileStructure = async (file: File) => {
    const log: { msg: string; type: "error" | "success" }[] = [];

    if (formData.contentType && !fileMatchesContentType(file.name, formData.contentType as ContentType)) {
      log.push({
        msg: `File extension does not match content type "${formData.contentType}".`,
        type: "error",
      });
      setValidationLog(log);
      return;
    }

    if (formData.domain === "NLP") {
      const text = await file.slice(0, 1000).text();
      const isJson = text.trim().startsWith("{") || text.trim().startsWith("[");

      if (isJson) {
        try {
          JSON.parse(text.split("\n")[0]);
          log.push({
            msg: "Structured NLP detected (JSONL). Validating keys...",
            type: "success",
          });
        } catch (e) {
          log.push({
            msg: "Warning: File looks like JSON but is malformed.",
            type: "error",
          });
        }
      } else {
        log.push({
          msg: "Raw Text Protocol: Processing as line-by-line dataset.",
          type: "success",
        });
      }
    } else if (formData.domain === "Code" || formData.domain === "Legal") {
      const text = await file.slice(0, 5000).text(); // Sample first ~5KB
      try {
        if (!text.trim()) throw new Error("File appears to be empty");
        log.push({
          msg: `${formData.domain} staged successfully for review.`,
          type: "success",
        });
      } catch (e: any) {
        log.push({ msg: `Technical Error: ${e.message}`, type: "error" });
      }
    } else if (formData.domain === "Audio" || formData.domain === "Medical") {
      // Check for ZIP magic bytes (PK header) to avoid false-rejecting zipped media.
      const zipBuffer = await file.slice(0, 4).arrayBuffer();
      const zipBytes = new Uint8Array(zipBuffer);
      const isZip =
        zipBytes[0] === 0x50 &&
        zipBytes[1] === 0x4b &&
        zipBytes[2] === 0x03 &&
        zipBytes[3] === 0x04;

      if (isZip) {
        log.push({
          msg: `Archive detected: ZIP package will be extracted by the processing worker. Ensure it contains only ${formData.domain === "Audio" ? "audio" : "image/video"} files.`,
          type: "success",
        });
      } else if (formData.domain === "Audio") {
        // Single audio file upload — validate magic bytes
        const result = await isAudioFile(file);
        if (!result.isAudio) {
          log.push({ msg: `Technical Error: ${result.reason}`, type: "error" });
        } else {
          log.push({
            msg: `Audio Verified: ${result.type} protocol detected.`,
            type: "success",
          });
        }
      } else {
        // Medical single file — accept and let the backend validate further
        log.push({
          msg: `Medical file staged for processing.`,
          type: "success",
        });
      }
    }  else {
      log.push({
        msg: `File staged for ${formData.domain} processing.`,
        type: "success",
      });
    }
    setValidationLog(log);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, uploadedFile: file }));
      validateFileStructure(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validationLog.some((l) => l.type === "error")) {
      return toast.error("Rectify technical errors before transmission.");
    }
    if (intent === "labeling" && !formData.uploadedFile) {
      return toast.error("Attach a file before transmission.");
    }
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      return toast.error("Dataset name is required.");
    }
    if (trimmedName.length < 8) {
      return toast.error("Dataset name must be at least 8 characters long to be descriptive.");
    }
    const lowerName = trimmedName.toLowerCase();
    const genericWords = ["xyz", "abc", "test", "dataset", "data", "custom", "my dataset", "untitled", "temp", "placeholder"];
    if (genericWords.includes(lowerName) || genericWords.some(word => lowerName === word || lowerName.match(new RegExp(`^[\\s_\\-*]*${word}[\\s_\\-*]*\\d*$`)))) {
      return toast.error("Please enter a specific, descriptive name (e.g. 'German Medical Audio Transcriptions v1.0') instead of a generic title.");
    }
    if (!maxLabellers) {
      return toast.error("Number of annotators per task is required");
    }
    if (!formData.labellingMethod) {
      return toast.error("Labelling method is required");
    }
    if (!formData.contentType) {
      return toast.error("Content type is required");
    }
    if (formData.labellingMethod === "rlhf" && !selectedProtocol) {
      return toast.error("RLHF requires a compatible evaluation protocol");
    }
    if (selectedProtocol && !protocolMatchesLabellingMethod(selectedProtocol, formData.labellingMethod as LabellingMethod)) {
      return toast.error("Selected protocol does not match the labelling method");
    }

    try {
      // Determine worker route
      let workerRoute = "text";
      let uploadMime = "application/octet-stream"; // actual MIME for the R2 presigned PUT

      if (formData.labellingMethod === "rlhf") {
        workerRoute = "rlhf";
        uploadMime = "application/json";
      } else if (formData.domain === "Audio" || formData.domain === "Medical") {
        const isZip = formData.uploadedFile
          ? await (async () => {
              const buf = await formData.uploadedFile!.slice(0, 4).arrayBuffer();
              const b = new Uint8Array(buf);
              return b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04;
            })()
          : false;
        workerRoute = isZip ? (formData.domain === "Audio" ? "audio" : "media") : "text";
        uploadMime = isZip ? "application/zip" : (formData.uploadedFile?.type || "audio/mpeg");
      } else {
        // Text/code/document/NLP domains
        workerRoute = "text";
        uploadMime = formData.uploadedFile?.type || "application/json";
      }

      // Generate presigned upload URL
      setSubmissionStep("generating_url");
      toast.loading("Generating upload URL...");
      const { uploadUrl, key } = await generateUploadUrl(uploadMime);

      // Upload file directly to cloud storage
      if (formData.uploadedFile) {
        setSubmissionStep("uploading_file");
        toast.loading("Uploading file to cloud storage...");
        await uploadFileToS3(formData.uploadedFile, uploadUrl, uploadMime);
      }

      // Create dataset request
      setSubmissionStep("creating_request");
      toast.loading("Creating dataset request...");
      const timelineOption = selectedTimeline !== null
        ? DOMAIN_TIMELINES[formData.domain]?.[selectedTimeline]
        : null;
      const requestResult = await datasetRequest({
        name: formData.name,
        domain: formData.domain,
        specifications: formData.specifications,
        volume: formData.volume,
        format: formData.format,
        budget: 0,
        maxLabellers,
        fileUrl: key,
        timeline: formData.timeline,
        timelineDays: timelineOption?.days,
        intent: intent || undefined,
        qualityMetrics: formData.qualityMetrics,
        labellingMethod: formData.labellingMethod as LabellingMethod,
        contentType: formData.contentType as ContentType,
        instructionId: selectedProtocol?._id,
        buyerAnswers: buyerAnswers
      });

      // Confirm upload and trigger worker
      setSubmissionStep("initiating_split");
      toast.loading("Confirming upload with backend...");
      // Backend returns { response: { datasetId, datasetRequest } }
      const datasetId = requestResult?.response?.datasetId || requestResult?.datasetId || key;
      setCreatedDatasetId(datasetId);
      await confirmUpload(key, datasetId, workerRoute);

      toast.success("Dataset request registered! Processing splitting stream...");
      setSubmissionStep("splitting_dataset");
    } catch (err) {
      setSubmissionStep("idle");
      const errorMessage = err instanceof Error ? err.message : "Request failed";
      toast.error(errorMessage);
    }
  };

  const SUBMISSION_STEPS = [
    { id: "generating_url", label: "Generating secure presigned upload URL" },
    { id: "uploading_file", label: "Uploading dataset archive to Cloudflare R2" },
    { id: "creating_request", label: "Registering dataset metadata on Node.js server" },
    { id: "initiating_split", label: "Initiating high-performance splitting worker" },
    { id: "splitting_dataset", label: "Splitting, indexing, and generating batches" }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={handleModalClose}
      />

      <div className="relative bg-[#0A0A0A] w-full max-w-2xl max-h-[90vh] flex flex-col border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        {submissionStep === "idle" ? (
          <>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-zinc-900">
              <div
                className="h-full bg-indigo-500 transition-all shadow-[0_0_15px_#6366f1]"
                style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              />
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-12 overflow-y-auto flex-1">
          {step === 0 && (
            <div className="space-y-10">
              <header>
                <div className="flex items-center gap-2 text-indigo-500 mb-2 font-mono text-[9px] uppercase tracking-widest">
                  <Terminal size={14} /> Phase_00 // Intent
                </div>
                <h2 className="text-3xl font-bold text-white italic">
                  Operational Intent
                </h2>
              </header>
              <div className="grid gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIntent("labeling");
                    setStep(1);
                  }}
                  className="p-8 bg-zinc-950 border border-zinc-900 hover:border-indigo-500/50 transition-all text-left group"
                >
                  <Database className="text-indigo-500 mb-4" size={24} />
                  <h3 className="text-xl font-bold text-white italic">
                    Data Labeling
                  </h3>
                  <p className="text-zinc-500 text-xs mt-1">
                    Transmit existing assets for high-precision annotation and
                    alignment.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIntent("sourcing");
                    setStep(1);
                  }}
                  className="p-8 bg-zinc-950 border border-zinc-900 hover:border-emerald-500/50 transition-all text-left group"
                >
                  <Cpu className="text-emerald-500 mb-4" size={24} />
                  <h3 className="text-xl font-bold text-white italic">
                    Bespoke Sourcing
                  </h3>
                  <p className="text-zinc-500 text-xs mt-1">
                    Commission nodes to curate or generate custom synthetic
                    datasets.
                  </p>
                </button>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-8">
              <header>
                <div className="flex items-center gap-2 text-indigo-500 mb-2 font-mono text-[9px] uppercase tracking-widest">
                  <Terminal size={14} /> Phase_01 // Labelling Method
                </div>
                <h2 className="text-3xl font-bold text-white italic">
                  How should this be labelled?
                </h2>
                <p className="text-zinc-500 text-xs mt-2">
                  This defines the annotation workflow. It is separate from what the data is (text, audio, image, etc.).
                </p>
              </header>
              <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
                {LABELLING_METHOD_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, labellingMethod: m.id });
                      setSelectedProtocol(null);
                      setProtocols([]);
                      setStep(2);
                    }}
                    className={`p-6 text-left bg-[#050505] hover:bg-zinc-950 transition-all ${formData.labellingMethod === m.id ? "border-l-2 border-indigo-500" : ""}`}
                  >
                    <span className="block text-xs font-bold text-zinc-200 tracking-widest uppercase">
                      {m.label}
                    </span>
                    <span className="block text-[10px] text-zinc-500 mt-2 font-light">{m.description}</span>
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setStep(0)} className="text-zinc-600 font-bold text-[10px] uppercase tracking-widest">
                Back
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-8">
              <header>
                <div className="flex items-center gap-2 text-indigo-500 mb-2 font-mono text-[9px] uppercase tracking-widest">
                  <Terminal size={14} /> Phase_02 // Content Modality
                </div>
                <h2 className="text-3xl font-bold text-white italic">
                  What is the primary content?
                </h2>
                <p className="text-zinc-500 text-xs mt-2">
                  RLHF and other methods can apply to any modality — this selects how responses are rendered in the workbench.
                </p>
              </header>
              <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
                {CONTENT_TYPE_OPTIONS.map((ct) => (
                  <button
                    key={ct.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, contentType: ct.id });
                      setStep(3);
                    }}
                    className={`p-6 text-left bg-[#050505] hover:bg-zinc-950 transition-all ${formData.contentType === ct.id ? "border-l-2 border-indigo-500" : ""}`}
                  >
                    <span className="block text-xs font-bold text-zinc-300 tracking-widest uppercase">
                      {ct.label}
                    </span>
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setStep(1)} className="text-zinc-600 font-bold text-[10px] uppercase tracking-widest">
                Back
              </button>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-8">
              <header>
                <div className="flex items-center gap-2 text-indigo-500 mb-2 font-mono text-[9px] uppercase tracking-widest">
                  <Terminal size={14} /> Phase_03 // Vertical Domain
                </div>
                <h2 className="text-3xl font-bold text-white italic">
                  System Domain
                </h2>
                <p className="text-zinc-500 text-xs mt-2">
                  Industry or use-case vertical — not the labelling method.
                </p>
              </header>
              {formData.contentType && formData.domain && inferContentTypeFromDomain(formData.domain) !== formData.contentType && (
                <p className="text-[10px] font-mono text-amber-500/90 border border-amber-900/40 bg-amber-950/20 p-3">
                  Domain &quot;{formData.domain}&quot; often uses {inferContentTypeFromDomain(formData.domain)} content; you selected {formData.contentType}. That is allowed if your file matches {formData.contentType}.
                </p>
              )}
              <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
                {[
                  { id: "NLP", icon: MessageSquareText, label: "Natural Language" },
                  { id: "Code", icon: FileJson, label: "Code / Review" },
                  { id: "Legal", icon: FileJson, label: "Legal / Review" },
                  { id: "Audio", icon: Headphones, label: "Audio / Speech" },
                  { id: "Tabular", icon: TableProperties, label: "Tabular / Finance" },
                  { id: "Medical", icon: Activity, label: "Medical / Imaging" },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={async () => {
                      if (!formData.labellingMethod) {
                        return toast.error("Select a labelling method first");
                      }
                      setFormData({ ...formData, domain: d.id as Domain });
                      setSelectedTimeline(null);
                      setSelectedProtocol(null);
                      const availableProtocols = await getProtocols(d.id, formData.labellingMethod);
                      setProtocols(availableProtocols);
                      setStep(4);
                    }}
                    className={`p-6 text-left group bg-[#050505] hover:bg-zinc-950 transition-all ${formData.domain === d.id ? "border-l-2 border-indigo-500" : ""}`}
                  >
                    <d.icon size={18} className="text-zinc-600 mb-2 group-hover:text-indigo-400" />
                    <span className="block text-xs font-bold text-zinc-300 tracking-widest uppercase">{d.label}</span>
                    {formData.contentType && inferContentTypeFromDomain(d.id) === formData.contentType && (
                      <span className="block text-[9px] text-indigo-400/80 mt-1 font-mono">Typical for {formData.contentType}</span>
                    )}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setStep(2)} className="text-zinc-600 font-bold text-[10px] uppercase tracking-widest">
                Back
              </button>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-8">
              <header className="mb-8">
                <div className="flex items-center gap-2 text-indigo-500 mb-2 font-mono text-[9px] uppercase tracking-widest">
                  <Terminal size={14} /> Phase_04 // Evaluation Protocol
                </div>
                <h2 className="text-3xl font-bold text-white italic">
                  Select Protocol
                </h2>
                <p className="text-zinc-500 text-xs mt-3">
                  Choose a predefined set of evaluation rubrics and instructions for labellers.
                </p>
              </header>

              {protocols.length === 0 ? (
                <div className="p-8 border border-dashed border-zinc-800 text-center bg-[#050505]">
                  <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                    No protocols match {formData.labellingMethod} for {formData.domain}.
                  </p>
                  {formData.labellingMethod === "rlhf" ? (
                    <p className="text-red-400/90 text-[10px] mt-3 font-mono">
                      RLHF requires a protocol with preference ranking or dimensional scoring. Contact support or choose another method.
                    </p>
                  ) : (
                    <>
                      <p className="text-zinc-600 text-[10px] mt-2">You can continue and provide specifications manually.</p>
                      <button type="button" onClick={() => setStep(5)} className="mt-6 bg-indigo-600 text-white px-6 py-2 font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-500">
                        Continue without Protocol
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {!selectedProtocol ? (
                    <div className="grid gap-4">
                      {protocols.map(p => (
                        <button key={p._id} type="button" onClick={() => {
                          if (!protocolMatchesLabellingMethod(p, formData.labellingMethod as LabellingMethod)) {
                            toast.error("This protocol does not match your labelling method");
                            return;
                          }
                          setSelectedProtocol(p);
                          setBuyerAnswers(p.buyerQuestions?.map((q: any) => ({ question: q.question, answer: '' })) || []);
                        }} className="text-left p-6 bg-[#050505] border border-zinc-800 hover:border-indigo-500 transition-all group">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400">{p.name}</h3>
                            <span className="text-[9px] font-mono bg-zinc-900 px-2 py-1 text-zinc-400 uppercase">v{p.version}</span>
                          </div>
                          <p className="text-xs text-zinc-500 mb-4">{p.buyerVisibleSummary}</p>
                          <div className="flex gap-4 text-[10px] font-mono text-zinc-600 uppercase">
                            <span>{p.rubrics?.length || 0} Rubrics</span>
                            <span>{p.goldenExamples?.length || 0} Examples</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center p-4 bg-indigo-950/20 border border-indigo-500/30">
                        <div>
                          <h3 className="text-sm font-bold text-indigo-400">Selected: {selectedProtocol.name}</h3>
                          <p className="text-[10px] font-mono text-indigo-300/70 mt-1">{selectedProtocol.buyerQuestions?.length || 0} configuration questions required</p>
                        </div>
                        <button type="button" onClick={() => setSelectedProtocol(null)} className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest">Change</button>
                      </div>

                      {selectedProtocol.buyerQuestions?.length > 0 && (
                        <div className="space-y-6 pt-4">
                          {selectedProtocol.buyerQuestions.map((q: any, i: number) => (
                            <div key={i} className="space-y-2">
                              <label className="text-[10px] font-mono text-zinc-400 uppercase">{q.question}</label>
                              {q.type === 'select' || q.type === 'multiselect' ? (
                                <select value={buyerAnswers[i]?.answer || ''} onChange={e => {
                                  const ans = [...buyerAnswers];
                                  ans[i] = { question: q.question, answer: e.target.value };
                                  setBuyerAnswers(ans);
                                }} className="w-full bg-black border border-zinc-800 p-3 text-white text-sm outline-none focus:border-indigo-500">
                                  <option value="">Select an option...</option>
                                  {q.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                              ) : q.type === 'textarea' ? (
                                <textarea value={buyerAnswers[i]?.answer || ''} onChange={e => {
                                  const ans = [...buyerAnswers];
                                  ans[i] = { question: q.question, answer: e.target.value };
                                  setBuyerAnswers(ans);
                                }} className="w-full bg-black border border-zinc-800 p-3 text-white text-sm outline-none focus:border-indigo-500" rows={3} />
                              ) : (
                                <input type="text" value={buyerAnswers[i]?.answer || ''} onChange={e => {
                                  const ans = [...buyerAnswers];
                                  ans[i] = { question: q.question, answer: e.target.value };
                                  setBuyerAnswers(ans);
                                }} className="w-full bg-black border border-zinc-800 p-3 text-white text-sm outline-none focus:border-indigo-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-4 pt-4 border-t border-zinc-900">
                        <button type="button" onClick={() => setStep(3)} className="flex-1 text-zinc-600 font-bold text-[10px] uppercase tracking-widest">Back</button>
                        <button type="button" onClick={() => {
                          if (!protocolMatchesLabellingMethod(selectedProtocol, formData.labellingMethod as LabellingMethod)) {
                            return toast.error("Selected protocol does not match your labelling method");
                          }
                          if (selectedProtocol.buyerQuestions?.length > 0 && buyerAnswers.some(a => !a.answer)) {
                            return toast.error("Please answer all protocol questions");
                          }
                          setStep(5);
                        }} className="flex-[2] py-4 bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-100 flex justify-center items-center gap-2">
                          Continue <ChevronRight size={14}/>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {step === 5 && (
            <div className="space-y-8">
              <header className="mb-10">
                <div className="flex items-center gap-2 text-indigo-500 mb-2 font-mono text-[9px] uppercase tracking-widest">
                  <Terminal size={14} /> Phase_02 // Delivery SLA
                </div>
                <h2 className="text-3xl font-bold text-white italic">
                  Timeline & Quality Expectations
                </h2>
                <p className="text-zinc-500 text-xs mt-3">
                  Select your preferred delivery timeline. Faster turnaround includes enhanced quality assurance and expertise.
                </p>
              </header>

              <div className="space-y-3">
                {DOMAIN_TIMELINES[formData.domain]?.map((timeline, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedTimeline(idx);
                      setFormData({ ...formData, timeline: timeline.label });
                    }}
                    className={`w-full p-4 text-left border transition-all ${
                      selectedTimeline === idx
                        ? "border-indigo-500 bg-indigo-950/30"
                        : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-bold text-white">{timeline.label}</p>
                        <p className="text-[9px] font-mono text-zinc-400 mt-1">{timeline.days}-Day Turnaround</p>
                      </div>
                      <span className="text-[9px] font-mono bg-zinc-900 px-2 py-1 rounded text-zinc-300">
                        EST. {timeline.days}d
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 font-light">{timeline.description}</p>
                  </button>
                ))}
              </div>
              {formData.domain && (
                <div className="space-y-2 border-t border-zinc-900 pt-6">
                  <div className="flex gap-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
                    <span>Method: {formData.labellingMethod}</span>
                    <span>Content: {formData.contentType}</span>
                  </div>
                  <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest ml-1">

                  </label>
                  <textarea
                    value={formData.qualityMetrics}
                    onChange={(e) =>
                      setFormData({ ...formData, qualityMetrics: e.target.value })
                    }
                    rows={2}
                    placeholder={
                      formData.domain === "Code"
                        ? "e.g., syntax correctness, security review, function coverage"
                        : formData.domain === "Legal"
                        ? "e.g., clause accuracy, citation consistency, risk spotting"
                        : formData.domain === "NLP"
                        ? "e.g., >90% accuracy, native speakers preferred"
                        : formData.domain === "Audio"
                        ? "e.g., Clear audio, SNR >20dB, accent diversity"
                        : "e.g., No duplicates, schema validation passed"
                    }
                    className="w-full bg-zinc-950 border border-zinc-900 p-4 text-white text-xs outline-none focus:border-indigo-500/50"
                  />
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 text-zinc-600 font-bold text-[10px] uppercase tracking-widest"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedTimeline === null) {
                      toast.error("Please select a timeline");
                      return;
                    }
                    setStep(6);
                  }}
                  className="flex-[2] py-4 bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-100 flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
          {step === 6 && (
            <div className="space-y-6">
              <header>
                <div className="flex items-center gap-2 text-indigo-500 mb-2 font-mono text-[9px] uppercase tracking-widest">
                  <Terminal size={14} /> Phase_04 // Assets & Specs
                </div>
                <h2 className="text-3xl font-bold text-white italic">
                  Technical Brief
                </h2>
              </header>

              {intent === "labeling" && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-800 bg-zinc-950 p-10 flex flex-col items-center cursor-pointer hover:border-indigo-500/40 transition-all"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Upload className="text-zinc-700 mb-2" size={32} />
                  <p className="text-[10px] font-mono text-zinc-500 uppercase">
                    {formData.uploadedFile
                      ? formData.uploadedFile.name
                      : "Initialize_Transmission"}
                  </p>
                </div>
              )}
              {validationLog.length > 0 && (
                <div className="bg-black border border-zinc-900 p-4 font-mono text-[10px]">
                  {validationLog.map((log, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 ${log.type === "error" ? "text-red-500" : "text-emerald-500"}`}
                    >
                      {log.type === "error" ? (
                        <AlertCircle size={12} />
                      ) : (
                        <ShieldCheck size={12} />
                      )}
                      <span>{log.msg}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest ml-1">
                    Dataset_Name / Identity
                  </label>
                  <span className="text-[10px] text-zinc-500 ml-1">
                    Provide a descriptive identifier. Avoid generic titles like &quot;xyz&quot;, &quot;test&quot; or &quot;dataset&quot;. E.g., &quot;German Medical Audio Transcriptions v1.0&quot;
                  </span>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., German Medical Audio Transcriptions v1.0"
                  className="w-full bg-zinc-950 border border-zinc-900 p-4 text-white text-xs outline-none focus:border-indigo-500/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest ml-1">

                </label>
                <textarea
                  name="specifications"
                  value={formData.specifications}
                  onChange={(e) =>
                    setFormData({ ...formData, specifications: e.target.value })
                  }
                  rows={3}
                  placeholder={
                    formData.domain === "Code"
                      ? "Code review rubric, bug detection criteria..."
                      : formData.domain === "Legal"
                      ? "Clause review, red-flag detection, citation checks..."
                      : "Data constraints..."
                  }
                  className="w-full bg-zinc-950 border border-zinc-900 p-4 text-white text-xs outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="flex-1 text-zinc-600 font-bold text-[10px] uppercase tracking-widest"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(7)}
                  className="flex-[2] py-4 bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-100 flex items-center justify-center gap-2"
                >
                  Logistics <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
          {step === 7 && (
            <div className="space-y-8">
              <header className="mb-10">
                <div className="flex items-center gap-2 text-indigo-500 mb-2 font-mono text-[9px] uppercase tracking-widest">
                  <Terminal size={14} /> Phase_05 // Finalization
                </div>
                <h2 className="text-3xl font-bold text-white italic">
                  System Logistics
                </h2>
              </header>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest ml-1">
                    Volume_Target
                  </label>
                  <input
                    value={formData.volume}
                    onChange={(e) =>
                      setFormData({ ...formData, volume: e.target.value })
                    }
                    type="text"
                    placeholder="e.g. 100k Pairs"
                    className="w-full bg-zinc-950 border border-zinc-900 p-4 text-white text-xs outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest ml-1">
                    Asset_Format
                  </label>
                  <input
                    value={formData.format}
                    onChange={(e) =>
                      setFormData({ ...formData, format: e.target.value })
                    }
                    type="text"
                    placeholder="JSONL, TXT, WAV"
                    className="w-full bg-zinc-950 border border-zinc-900 p-4 text-white text-xs outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest ml-1">
                    Annotators per Task
                  </label>
                  <select
                    value={maxLabellers}
                    onChange={(e) => setMaxLabellers(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-900 p-4 text-white text-xs outline-none focus:border-indigo-500"
                  >
                    <option value={1}>1 (Standard Annotation)</option>
                    <option value={2}>2 (Dual Consensus)</option>
                    <option value={3}>3 (Triple Consensus)</option>
                    <option value={4}>4 (Quad Consensus)</option>
                    <option value={5}>5 (High-Precision Consensus)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Transmit_Protocol"
                )}
              </button>
              <button
                type="button"
                onClick={() => setStep(6)}
                className="w-full text-zinc-600 font-bold text-[10px] uppercase tracking-widest"
              >
                Back to Technicals
              </button>
            </div>
          )}
        </form>
          </>
        ) : submissionStep !== "splitting_dataset" ? (
          <div className="p-8 md:p-12 flex flex-col items-center justify-center space-y-8 min-h-[450px]">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <Cpu className="absolute text-indigo-500 animate-pulse" size={24} />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-white italic tracking-wide">
                Transmission in Progress...
              </h3>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Do not close this window or refresh the page
              </p>
            </div>

            <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-6 space-y-4 rounded-sm font-mono text-xs">
              {SUBMISSION_STEPS.map((s, idx) => {
                const currentIdx = SUBMISSION_STEPS.findIndex(x => x.id === submissionStep);
                const isCompleted = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                const isPending = idx > currentIdx;

                return (
                  <div key={s.id} className="flex items-center gap-3">
                    {isCompleted && (
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center text-emerald-400 text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                    {isCurrent && (
                      <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" size={14} />
                    )}
                    {isPending && (
                      <div className="w-4 h-4 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-700 text-[8px]">
                        •
                      </div>
                    )}
                    <span className={isCompleted ? "text-zinc-500 line-through" : isCurrent ? "text-indigo-400 font-bold animate-pulse" : "text-zinc-600"}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-8 md:p-12 flex flex-col space-y-8 min-h-[500px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  {telemetryStatus === "active" ? (
                    <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                  ) : telemetryStatus === "completed" ? (
                    <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                      <ShieldCheck className="text-emerald-400" size={18} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                      <AlertCircle className="text-red-400" size={18} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white italic tracking-wide">
                    {telemetryStatus === "active"
                      ? "Decompressing & Splitting..."
                      : telemetryStatus === "completed"
                      ? "Splitting Complete!"
                      : "Splitting Failed"}
                  </h3>
                  <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    Telemetry Stream // ID: {createdDatasetId?.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-white tabular-nums">
                  {telemetryProgress}%
                </span>
                <p className="text-[8px] font-mono text-zinc-500 uppercase">SYNCHRONIZED</p>
              </div>
            </div>

            {/* Ingestion Steps Checklist */}
            <div className="w-full bg-zinc-950 border border-zinc-900 p-5 space-y-3 font-mono text-xs rounded-sm">
              {SUBMISSION_STEPS.map((s, idx) => {
                const isCompleted = idx < 4;
                const isCurrent = idx === 4 && telemetryStatus === "active";
                const isFinalComplete = telemetryStatus === "completed" && idx === 4;
                const isFinalFailed = telemetryStatus === "failed" && idx === 4;

                return (
                  <div key={s.id} className="flex items-center gap-3">
                    {(isCompleted || isFinalComplete) ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center text-emerald-400 text-[10px] font-bold">
                        ✓
                      </div>
                    ) : isFinalFailed ? (
                      <div className="w-4 h-4 rounded-full bg-red-500/10 border border-red-500/50 flex items-center justify-center text-red-400 text-[10px] font-bold">
                        ✕
                      </div>
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" size={14} />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-700 text-[8px]">
                        •
                      </div>
                    )}
                    <span className={(isCompleted || isFinalComplete) ? "text-zinc-500 line-through" : isCurrent ? "text-indigo-400 font-bold animate-pulse" : isFinalFailed ? "text-red-400" : "text-zinc-600"}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Telemetry Console (Developer Terminal) */}
            <div className="flex-1 flex flex-col min-h-[160px] bg-black border border-zinc-900 font-mono text-[10px] text-zinc-400 p-4 relative overflow-hidden rounded-sm">
              <div className="absolute top-0 left-0 w-full h-5 bg-zinc-950 border-b border-zinc-900 px-3 flex items-center justify-between text-[9px] text-zinc-500">
                <span>TERMINAL_OUTPUT // TELEMETRY</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  LIVE_FEED
                </span>
              </div>
              <div className="flex-1 overflow-y-auto mt-4 pt-2 space-y-1 select-all pr-2 max-h-[180px] custom-scrollbar">
                {telemetryLogs.map((log, idx) => {
                  let color = "text-zinc-500";
                  if (log.type === "system") color = "text-indigo-400";
                  if (log.type === "checkpoint") color = "text-amber-500/90";
                  if (log.type === "error") color = "text-red-500 font-bold";
                  if (log.type === "complete") color = "text-emerald-400 font-bold";

                  return (
                    <div key={idx} className="flex gap-2 leading-relaxed">
                      <span className="text-zinc-700 select-none">[{log.time}]</span>
                      <span className={color}>{log.message}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleModalClose}
                className="flex-1 py-4 bg-zinc-950 border border-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-white font-bold text-[10px] uppercase tracking-widest transition-all rounded-sm"
              >
                Run in Background
              </button>
              
              {telemetryStatus === "completed" && (
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 py-4 bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-100 transition-all rounded-sm"
                >
                  Proceed to Payment
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDataRequestModal;
