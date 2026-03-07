export interface Quiz {
  question: string

  type: "single_choice" | "multiple_choice" | "true_false"

  options: QuizOption[]

  correctAnswer: string | string[]

  explanation?: string
}
export interface QuizOption {
  id: string
  text: string
}
