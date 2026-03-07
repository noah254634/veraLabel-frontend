export interface Task {
  id: string
  projectId: string
  datasetId: string

  status: "pending" | "assigned" | "in_progress" | "completed"

  data: {
    type: "image" | "video" | "text" | "audio"
    url: string
    metadata?: Record<string, any>
  }

  instruction: string
  labelSchemaId: string

  assignedTo?: string
  assignedAt?: Date

  result?: any

  reviewStatus?: "pending" | "approved" | "rejected"
  qualityScore?: number

  priority?: "low" | "medium" | "high"
  difficulty?: "easy" | "medium" | "hard"

  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}
