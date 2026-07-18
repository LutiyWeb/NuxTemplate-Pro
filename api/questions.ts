import { z } from 'zod'

export const questionSchema = z.object({
  text: z.string().trim().min(10, 'Мінімум 10 символів').max(1000, 'Максимум 1000 символів'),
  name: z.string().trim().min(2, 'Мінімум 2 символи'),
  email: z.string().trim().min(1, 'Введіть email').email('Некоректний email'),
})

export type QuestionForm = z.infer<typeof questionSchema>

export const QUESTION_MAX_FILES = 5
export const QUESTION_MAX_FILE_SIZE = 5 * 1024 * 1024
