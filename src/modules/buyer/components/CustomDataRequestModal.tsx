import React, { useState, useRef, useEffect } from "react";
import useBuyerStore from "../store/buyerStore";
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
} from "lucide-react";
import { toast } from "react-hot-toast";
import type { Domain } from "../types/datasetRequest";

const initialFormData = {
  domain: "",
  specifications: "",
  volume: "",
  format: "",
  timeline: "",
  qualityMetrics: "",
  uploadedFile: null as File | null,
};

// Domain-specific timeline options (in days)
const DOMAIN_TIMELINES: Record<string, Array<{ label: string; days: number; description: string }>> = {
  RLHF: [
    { label: "Expedited", days: 7, description: "72-hour turnaround per 1K samples" },
    { label: "Standard", days: 14, description: "2-week delivery with multi-reviewer consensus" },
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
};

const CustomDataRequestModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { datasetRequest, generateUploadUrl, uploadFileToS3 } = useBuyerStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<"labeling" | "sourcing" | null>(null);
  const [validationLog, setValidationLog] = useState<
    { msg: string; type: "error" | "success" }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState(initialFormData);
  const [budget, setBudget] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState<number | null>(null);

  const resetModalState = () => {
    setLoading(false);
    setStep(0);
    setIntent(null);
    setValidationLog([]);
    setFormData(initialFormData);
    setBudget("");
    setSelectedTimeline(null);
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

  if (!isOpen) return null;

  // Technical Validator: Checks structure before hitting the Worker
  const validateFileStructure = async (file: File) => {
    const log: { msg: string; type: "error" | "success" }[] = [];
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
    } else if (formData.domain === "RLHF") {
      const text = await file.slice(0, 5000).text(); // Sample first ~5KB
      try {
        // Simple check for JSON/JSONL format
        const lines = text.split("\n").filter((l) => l.trim());
        const firstEntry = JSON.parse(
          lines[0].startsWith("[")
            ? text.slice(1, text.indexOf("}")) + "}"
            : lines[0],
        );

        if (!firstEntry.prompt)
          throw new Error("Missing mandatory key: 'prompt'");
        if (!firstEntry.responses && !firstEntry.response)
          throw new Error("Missing mandatory key: 'responses' or 'response'");

        log.push({
          msg: "Structure Validated: RLHF Protocol detected.",
          type: "success",
        });
      } catch (e: any) {
        log.push({ msg: `Technical Error: ${e.message}`, type: "error" });
      }
    } else if (formData.domain === "Audio") {
      const result = await isAudioFile(file);
      if (!result.isAudio) {
        log.push({ msg: `Technical Error: ${result.reason}`, type: "error" });
      } else {
        log.push({
          msg: `Audio Verified: ${result.type} protocol detected.`,
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
    if (!budget) {
      return toast.error("Budget is required");
    }

    setLoading(true);
    try {
      // Map domain to fileType
      const fileTypeMap: Record<string, string> = {
        NLP: "general",
        RLHF: "rlhf",
        Audio: "media",
        Tabular: "general",
      };
      const fileType = fileTypeMap[formData.domain] || "general";

      // Step 1: Generate presigned upload URL
      toast.loading("Generating upload URL...");
      const { uploadUrl, key } = await generateUploadUrl(fileType);

      // Step 2: Upload file directly to S3/R2
      if (formData.uploadedFile) {
        toast.loading("Uploading file to cloud storage...");
        await uploadFileToS3(formData.uploadedFile, uploadUrl);
      }

      // Step 3: Create dataset request with fileUrl
      toast.loading("Creating dataset request...");
      await datasetRequest({
        domain: formData.domain,
        specifications: formData.specifications,
        volume: formData.volume,
        format: formData.format,
        budget,
        fileUrl: key,
        timeline: formData.timeline,
        qualityMetrics: formData.qualityMetrics,
      });

      toast.success("Dataset request created successfully!");
      handleModalClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Request failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={handleModalClose}
      />

      <div className="relative bg-[#0A0A0A] w-full max-w-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-zinc-900">
          <div
            className="h-full bg-indigo-500 transition-all shadow-[0_0_15px_#6366f1]"
            style={{ width: `${((step + 1) / 5) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12">
          {/* STEP 0: INTENT */}
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

          {/* STEP 1: DOMAIN */}
          {step === 1 && (
            <div className="space-y-8">
              <header>
                <div className="flex items-center gap-2 text-indigo-500 mb-2 font-mono text-[9px] uppercase tracking-widest">
                  <Terminal size={14} /> Phase_01 // Classification
                </div>
                <h2 className="text-3xl font-bold text-white italic">
                  System Domain
                </h2>
              </header>
              <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
                {[
                  {
                    id: "NLP",
                    icon: MessageSquareText,
                    label: "Natural Language",
                  },
                  { id: "RLHF", icon: FileJson, label: "RLHF / Alignment" },
                  { id: "Audio", icon: Headphones, label: "Audio / Speech" },
                  {
                    id: "Tabular",
                    icon: TableProperties,
                    label: "Tabular / Finance",
                  },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, domain: d.id as Domain });
                      setSelectedTimeline(null);
                      setStep(2);
                    }}
                    className={`p-6 text-left group bg-[#050505] hover:bg-zinc-950 transition-all ${formData.domain === d.id ? "border-l-2 border-indigo-500" : ""}`}
                  >
                    <d.icon
                      size={18}
                      className="text-zinc-600 mb-2 group-hover:text-indigo-400"
                    />
                    <span className="block text-xs font-bold text-zinc-300 tracking-widest uppercase">
                      {d.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY TIMELINE & SLA */}
          {step === 2 && (
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

              {/* Quality Metrics for Domain */}
              {formData.domain && (
                <div className="space-y-2 border-t border-zinc-900 pt-6">
                  <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest ml-1">
                    // Quality Acceptance Criteria
                  </label>
                  <textarea
                    value={formData.qualityMetrics}
                    onChange={(e) =>
                      setFormData({ ...formData, qualityMetrics: e.target.value })
                    }
                    rows={2}
                    placeholder={
                      formData.domain === "RLHF"
                        ? "e.g., >95% inter-rater agreement, min 3 reviewers per sample"
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
                  onClick={() => setStep(1)}
                  className="flex-1 text-zinc-600 font-bold text-[10px] uppercase tracking-widest"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedTimeline) {
                      toast.error("Please select a timeline");
                      return;
                    }
                    setStep(3);
                  }}
                  className="flex-[2] py-4 bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-100 flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TECHNICALS & LOG */}
          {step === 3 && (
            <div className="space-y-6">
              <header>
                <div className="flex items-center gap-2 text-indigo-500 mb-2 font-mono text-[9px] uppercase tracking-widest">
                  <Terminal size={14} /> Phase_02 // Technicals
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

              {/* TECHNICAL ERROR LOG */}
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
                <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest ml-1">
                  // Project Specifications
                </label>
                <textarea
                  name="specifications"
                  value={formData.specifications}
                  onChange={(e) =>
                    setFormData({ ...formData, specifications: e.target.value })
                  }
                  rows={3}
                  placeholder={
                    formData.domain === "RLHF"
                      ? "Prompt structure, ranking criteria..."
                      : "Data constraints..."
                  }
                  className="w-full bg-zinc-950 border border-zinc-900 p-4 text-white text-xs outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 text-zinc-600 font-bold text-[10px] uppercase tracking-widest"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-[2] py-4 bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-100 flex items-center justify-center gap-2"
                >
                  Logistics <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: LOGISTICS */}
          {step === 4 && (
            <div className="space-y-8">
              <header className="mb-10">
                <div className="flex items-center gap-2 text-indigo-500 mb-2 font-mono text-[9px] uppercase tracking-widest">
                  <Terminal size={14} /> Phase_04 // Finalization
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
                    Budget_USD
                  </label>
                  <input
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    type="number"
                    placeholder="e.g. 500"
                    className="w-full bg-zinc-950 border border-zinc-900 p-4 text-white text-xs outline-none"
                  />
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
                onClick={() => setStep(3)}
                className="w-full text-zinc-600 font-bold text-[10px] uppercase tracking-widest"
              >
                Back to Technicals
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CustomDataRequestModal;
