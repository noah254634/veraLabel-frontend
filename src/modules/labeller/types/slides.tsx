import type { Quiz } from "./quiz"

export interface Slide {
  id: string
  type: "intro" | "content" | "quiz" | "success"

  title?: string
  description?: string

  media?: {
    type: "image" | "video" | "gif"
    url: string
  }

  order: number

  action?: {
    label: string
    type: "next" | "submit" | "finish"
  }

  quiz?: Quiz

  createdAt?: Date
}

