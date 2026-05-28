import type { ContentType } from "./labellingProtocol";

export type LabellingMethod = "rlhf" | "classification" | "annotation" | "transcription";

export const resolveContentType = (
  task?: { contentType?: string; taskType?: string } | null,
  batch?: { datasetContentType?: string; batchType?: string } | null
): ContentType => {
  const raw = String(
    task?.contentType || batch?.datasetContentType || batch?.batchType || task?.taskType || "text"
  ).toLowerCase();

  if (["text", "audio", "video", "image", "code", "document"].includes(raw)) {
    return raw as ContentType;
  }
  if (["rfhlearning", "rlhf", "rflhf"].includes(raw)) {
    return (batch?.datasetContentType as ContentType) || "text";
  }
  return "text";
};

export const resolveLabellingMethod = (
  batch?: { labellingMethod?: string } | null,
  task?: { labellingMethod?: string; taskType?: string } | null
): LabellingMethod => {
  const fromBatch = batch?.labellingMethod;
  if (fromBatch && ["rlhf", "classification", "annotation", "transcription"].includes(fromBatch)) {
    return fromBatch as LabellingMethod;
  }
  const fromTask = task?.labellingMethod;
  if (fromTask && ["rlhf", "classification", "annotation", "transcription"].includes(fromTask)) {
    return fromTask as LabellingMethod;
  }
  if (["rfhlearning", "rlhf", "rflhf"].includes(String(task?.taskType || "").toLowerCase())) {
    return "rlhf";
  }
  return "annotation";
};

export const isRlhfTask = (
  batch?: { labellingMethod?: string } | null,
  task?: { labellingMethod?: string; taskType?: string } | null
) => resolveLabellingMethod(batch, task) === "rlhf";
