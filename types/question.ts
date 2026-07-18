export interface Question {
  id: number
  author: string
  initials: string
  text: string
  createdAt: string
  answer?: string
  answeredAt?: string
}
