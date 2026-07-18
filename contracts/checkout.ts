import { z } from 'zod'

export const checkoutSchema = z.object({
  recipientName: z.string().trim().min(2, 'Введите имя получателя'),
  phone: z.string().trim().min(10, 'Введите корректный номер телефона'),
  city: z.string().trim().min(1, 'Введите город'),
  street: z.string().trim().min(1, 'Введите улицу'),
  house: z.string().trim().min(1, 'Введите номер дома'),
  apartment: z.string().optional(),
  notes: z.string().optional(),
})

export type CheckoutForm = z.infer<typeof checkoutSchema>

export const CHECKOUT_ERROR_MESSAGES: Record<string, string> = {
  ADDRESS_NOT_FOUND: 'Адрес не найден. Выберите другой.',
  CART_EMPTY: 'Корзина пуста.',
  CART_ITEM_UNAVAILABLE: 'Один из товаров больше недоступен.',
  NOT_ENOUGH_STOCK: 'Недостаточно товара на складе.',
}
