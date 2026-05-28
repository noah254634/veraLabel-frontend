export interface datasetRequest {
  domain: Domain;
  labellingMethod: LabellingMethod;
  contentType: ContentType;
  specifications: string;
  volume: string;
  format: string;
  budget: string;
  uploadedFile: File | null;
  sourceLink: string;
  intent?: string;
  timelineDays?: number;
}

export type Domain = "NLP" | "Code" | "Legal" | "Audio" | "Tabular" | "Medical";
export type LabellingMethod = "rlhf" | "classification" | "annotation" | "transcription";
export type ContentType = "text" | "audio" | "video" | "image" | "code" | "document";

export const INTENT_TYPES = {
  LABELING: "labeling",
  SOURCING: "sourcing",
};
