export interface Dataset {
  datasetId: string

  name: string

  description?: string

  ownerId: string

  datasetType: DatasetType

  source?: string

  storageLocation: string

  totalFiles: number

  totalUnits?: number

  status: DatasetStatus

  metadata?: DatasetMetadata

  createdAt: string

  updatedAt: string
}
type DatasetStatus =
  | "uploaded"
  | "processing"
  | "splitting"
  | "ready"
  | "failed"
  | "archived"
interface DatasetMetadata {
  region?: string

  language?: string

  license?: string

  tags?: string[]

  contributor?: string

  description?: string
}
type DatasetType="image" | "audio" | "text" | "video" | "ai_response"
