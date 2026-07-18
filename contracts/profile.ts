import { z } from 'zod'

export const profileSchema = z.object({
  firstName: z.string().min(1, 'Введите имя').max(64),
  lastName: z.string().min(1, 'Введите фамилию').max(64),
  email: z.string().email('Неверный формат email').max(255),
  phone: z.string().optional(),
})

export const passwordSchema = z
  .object({
    current: z.string().min(1, 'Введите текущий пароль'),
    next: z.string().min(8, 'Минимум 8 символов'),
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, { message: 'Пароли не совпадают', path: ['confirm'] })

export type ProfileForm = z.infer<typeof profileSchema>
export type PasswordForm = z.infer<typeof passwordSchema>
