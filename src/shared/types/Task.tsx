export interface Task {
  taskId: string
  projectId: string
  unitId: string

  datasetType: DatasetType

  status: TaskStatus

  rawData: TaskData

  annotation?: Annotation

  review?: Review

  assignment?: Assignment

  metadata: TaskMetadata

  createdAt: string
  updatedAt: string
}
type DatasetType =
  | "image"
  | "audio"
  | "text"
  | "video"
  | "ai_response"
type TaskStatus =
  | "unassigned"
  | "assigned"
  | "in_progress"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
interface TaskData {
  storageUrl: string
  fileType: string

  image?: ImageData
  audio?: AudioData
  text?: TextData
  aiResponse?: AIResponseData
}
interface ImageData {
  width: number
  height: number
  format: string
}
interface AudioData {
  duration: number
  sampleRate?: number
  language?: string
}
interface TextData {
  content: string
  language?: string
}
interface AIResponseData {
  prompt: string
  response: string
  model?: string
}
interface Annotation {
  annotationId: string

  annotatorId: string

  labels: Label[]

  notes?: string

  submittedAt: string
}
interface Label {
  labelType: string

  value: string | number | boolean

  confidence?: number

  boundingBox?: BoundingBox
}
interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}
interface Review {
  reviewerId: string

  decision: ReviewDecision

  feedback?: string

  reviewedAt: string
}
type ReviewDecision = "approved" | "rejected" | "pending"
interface Assignment {
  annotatorId: string
  assignedAt: string
}
interface TaskMetadata {
  region?: string
  language?: string

  batchId?: string

  priority?: "low" | "medium" | "high"

  tags?: string[]

  datasetSource?: string
}
