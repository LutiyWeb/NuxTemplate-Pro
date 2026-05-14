export interface LandingCard {
  id: number
  title: string
  description: string
  badge: string
  imageRight?: boolean
}

export const POPULAR_CARDS: LandingCard[] = [
  { id: 1, title: 'Vue 3 Starter Kit', description: 'Production-ready boilerplate с TypeScript, Pinia и Vue Router. Стартуй за минуты без лишней настройки.', badge: 'Free' },
  { id: 2, title: 'Admin Dashboard', description: 'Полноценный шаблон панели администратора: таблицы, графики, аналитика — всё готово к работе.', badge: 'Pro', imageRight: true },
  { id: 3, title: 'E-Commerce Template', description: 'Полноценный интернет-магазин: каталог товаров, корзина и оформление заказа.', badge: 'Pro' },
  { id: 4, title: 'Blog Starter', description: 'Минималистичный блог с горизонтальными карточками для листинга статей.', badge: 'Free', imageRight: true },
]

export const ARTICLES_CARDS: LandingCard[] = [
  { id: 1, title: 'Как начать с Vue 3', description: 'Полное руководство по старту проекта на Vue 3 с нуля: настройка, структура, первые компоненты.', badge: 'Гайд' },
  { id: 2, title: 'Pinia vs Vuex', description: 'Сравниваем два подхода к управлению состоянием и выбираем подходящий для твоего проекта.', badge: 'Статья', imageRight: true },
  { id: 3, title: 'TypeScript в Vue 3', description: 'Типизация пропсов, эмитов и стора — практические примеры из реальных проектов.', badge: 'Гайд' },
  { id: 4, title: 'Оптимизация сборки', description: 'Vite, code splitting и lazy loading: как ускорить загрузку в продакшене.', badge: 'Статья', imageRight: true },
]
