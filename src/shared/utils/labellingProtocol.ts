export type LabellingMethod = "rlhf" | "classification" | "annotation" | "transcription";
export type ContentType = "text" | "audio" | "video" | "image" | "code" | "document";

export const isRlhfProtocol = (template: {
  scoringConfig?: { taskTypes?: string[]; requireRationale?: boolean };
}) => {
  const sc = template?.scoringConfig || {};
  const taskTypes = sc.taskTypes || [];
  return taskTypes.length > 0 || Boolean(sc.requireRationale);
};

export const protocolMatchesLabellingMethod = (
  template: { scoringConfig?: { taskTypes?: string[]; requireRationale?: boolean } },
  labellingMethod: LabellingMethod
) => {
  const isRlhf = isRlhfProtocol(template);
  if (labellingMethod === "rlhf") return isRlhf;
  return !isRlhf;
};

export const inferContentTypeFromDomain = (domain: string): ContentType => {
  const map: Record<string, ContentType> = {
    NLP: "text",
    Code: "code",
    Legal: "document",
    Audio: "audio",
    Tabular: "text",
    Medical: "image",
  };
  return map[domain] || "text";
};

export const inferContentTypeFromFileName = (fileName: string): ContentType | null => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (["mp3", "wav", "flac", "ogg", "m4a", "aac"].includes(ext)) return "audio";
  if (["mp4", "webm", "mov", "mkv"].includes(ext)) return "video";
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "dcm", "dicom"].includes(ext)) return "image";
  if (["pdf", "docx", "doc"].includes(ext)) return "document";
  if (["py", "js", "ts", "java", "go", "rs"].includes(ext)) return "code";
  if (["json", "jsonl", "csv", "txt", "xml", "parquet"].includes(ext)) return "text";
  return null;
};

export const fileMatchesContentType = (fileName: string, contentType: ContentType): boolean => {
  const inferred = inferContentTypeFromFileName(fileName);
  if (!inferred) return true;
  if (contentType === inferred) return true;
  if (contentType === "text" && ["code", "document"].includes(inferred)) return true;
  if (contentType === "code" && inferred === "text") return true;
  if (contentType === "document" && inferred === "text") return true;
  return false;
};
