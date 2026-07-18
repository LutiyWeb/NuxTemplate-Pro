import { z } from 'zod'

export const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Выберите оценку').max(5),
  text: z.string().trim().min(10, 'Минимум 10 символов').max(1000, 'Максимум 1000 символов'),
})

export type ReviewForm = z.infer<typeof reviewSchema>
