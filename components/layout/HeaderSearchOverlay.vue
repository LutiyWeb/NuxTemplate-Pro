<script setup lang="ts">
import {
  Search, X, Clock, TrendingUp, ChevronRight, ShoppingCart,
  LayoutGrid, Laptop, Smartphone, Headphones, Monitor, Tablet,
  Camera, Watch, Gamepad2, Home, Package, Cpu, Tv,
} from 'lucide-vue-next'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css/navigation'
import type { Component } from 'vue'
import type { Product } from '~/types/product'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const config = useRuntimeConfig()
const router = useRouter()
const cartStore = useCartStore()
const toastStore = useToastStore()
const categoriesStore = useCategoriesStore()
const searchStore = useSearchStore()
const productsStore = useProductsStore()

// ─── Input ───────────────────────────────────────────────────────────────────
const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

// ─── Debounce ────────────────────────────────────────────────────────────────
const debouncedQuery = ref('')
let debounceTimer: ReturnType<typeof setTimeout>
watch(query, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { debouncedQuery.value = val.trim() }, 300)
})

// ─── Search results ──────────────────────────────────────────────────────────
const searchResults = ref<Product[]>([])
const isSearching = ref(false)

watch(debouncedQuery, async (q) => {
  if (!q) { searchResults.value = []; return }
  isSearching.value = true
  try {
    const res = await $fetch<{ data: Product[] }>(
      `${config.public.apiBase}/api/search?q=${encodeURIComponent(q)}&limit=4`,
    )
    searchResults.value = res.data
  } catch {
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
})

const isActive = computed(() => debouncedQuery.value.length > 0)

// ─── Category icons ───────────────────────────────────────────────────────────
const ICONS: Record<string, Component> = {
  smartphone: Smartphone, phone: Smartphone,
  laptop: Laptop, notebook: Laptop,
  tablet: Tablet,
  audio: Headphones, headphone: Headphones, speaker: Headphones,
  monitor: Monitor, display: Monitor, office: Monitor,
  camera: Camera, photo: Camera,
  watch: Watch, wearable: Watch,
  game: Gamepad2, gaming: Gamepad2,
  home: Home, furniture: Home,
  cpu: Cpu, pc: Cpu, computer: Cpu,
  tv: Tv, television: Tv,
}
function getCatIcon(slug: string): Component {
  const lower = slug.toLowerCase()
  for (const [key, icon] of Object.entries(ICONS)) {
    if (lower.includes(key)) return icon
  }
  return Package
}

// ─── Suggestions (active state) ───────────────────────────────────────────────
const historySuggestions = computed(() => {
  const q = debouncedQuery.value.toLowerCase()
  return searchStore.history.filter(h => h.toLowerCase().includes(q)).slice(0, 3)
})
const categorySuggestions = computed(() => {
  const q = debouncedQuery.value.toLowerCase()
  return categoriesStore.categories.filter(c => c.name.toLowerCase().includes(q)).slice(0, 4)
})

// ─── Trending products (empty state) ─────────────────────────────────────────
const trendingProducts = computed(() =>
  [...productsStore.products].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 10),
)

// ─── Keyboard navigation ──────────────────────────────────────────────────────
type NavItem =
  | { type: 'submit'; value: string }
  | { type: 'history'; value: string }
  | { type: 'category'; value: string }
  | { type: 'product'; value: number }

const allNavItems = computed<NavItem[]>(() => {
  if (!isActive.value) return []
  return [
    { type: 'submit', value: debouncedQuery.value },
    ...historySuggestions.value.map(v => ({ type: 'history' as const, value: v })),
    ...categorySuggestions.value.map(c => ({ type: 'category' as const, value: c.slug })),
    ...searchResults.value.map(p => ({ type: 'product' as const, value: p.id })),
  ]
})

const focusedIndex = ref(-1)
const focusedItem = computed<NavItem | null>(() =>
  focusedIndex.value >= 0 ? allNavItems.value[focusedIndex.value] ?? null : null,
)

function isFocused(item: NavItem): boolean {
  return !!focusedItem.value
    && focusedItem.value.type === item.type
    && focusedItem.value.value === item.value
}

watch(debouncedQuery, () => { focusedIndex.value = -1 })

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') { closeModal(); return }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    focusedIndex.value = Math.min(focusedIndex.value + 1, allNavItems.value.length - 1)
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (focusedIndex.value > 0) focusedIndex.value--
    else { focusedIndex.value = -1; inputRef.value?.focus() }
  }
  if (e.key === 'Enter') {
    e.preventDefault()
    const item = focusedItem.value
    if (!item) { submitSearch(); return }
    if (item.type === 'submit' || item.type === 'history') submitSearch(item.value)
    else if (item.type === 'category') { router.push(`/catalog?categorySlug=${item.value}`); closeModal() }
    else if (item.type === 'product') { router.push(`/product/${item.value}`); closeModal() }
  }
}

// ─── Actions ─────────────────────────────────────────────────────────────────
function submitSearch(q?: string) {
  const sq = (q ?? query.value).trim()
  if (!sq) return
  searchStore.push(sq)
  router.push(`/search?q=${encodeURIComponent(sq)}`)
  closeModal()
}

function closeModal() {
  emit('close')
}

function quickAdd(product: Product, e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  cartStore.add(product)
  toastStore.add('Товар добавлен в корзину', 'success')
}

function dismiss() {
  if (query.value) query.value = ''
  else closeModal()
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
watch(() => props.open, async (val) => {
  if (val) {
    searchStore.init()
    if (!productsStore.products.length) productsStore.fetchProducts({ limit: 40 })
    if (!categoriesStore.categories.length) categoriesStore.fetchCategories()
    await nextTick()
    inputRef.value?.focus()
    focusedIndex.value = -1
  } else {
    query.value = ''
    debouncedQuery.value = ''
    clearTimeout(debounceTimer)
  }
})

onBeforeUnmount(() => clearTimeout(debounceTimer))
</script>

<template>
  <Teleport to="body">
    <Transition name="search-modal">
      <div v-if="open" class="search-modal" @click.self="closeModal">
        <div class="search-modal__box" @keydown="onKeydown">

          <!-- Header -->
          <div class="search-modal__header">
            <Search :size="20" class="search-modal__icon" />
            <input
              ref="inputRef"
              v-model="query"
              class="search-modal__input"
              placeholder="Поиск товаров, категорий..."
              autocomplete="off"
              @keydown="onKeydown"
            />
            <button class="search-modal__dismiss" type="button" :aria-label="query ? 'Очистить' : 'Закрыть'" @click="dismiss">
              <X :size="18" />
            </button>
          </div>

          <div class="search-modal__divider" />

          <!-- Body -->
          <div class="search-modal__body">

            <!-- ── EMPTY STATE ─────────────────────────────────────── -->
            <template v-if="!isActive">

              <!-- Recent searches -->
              <section v-if="searchStore.history.length" class="search-modal__section">
                <div class="search-modal__section-head">
                  <span class="search-modal__section-title"><Clock :size="13" />Недавние</span>
                  <button class="search-modal__section-action" type="button" @click="searchStore.clear()">Очистить</button>
                </div>
                <div class="search-modal__history">
                  <button
                    v-for="item in searchStore.history"
                    :key="item"
                    class="search-modal__history-item"
                    type="button"
                    @click="submitSearch(item)"
                  >
                    <Clock :size="13" class="search-modal__history-clock" />
                    <span>{{ item }}</span>
                    <button class="search-modal__history-remove" type="button" @click.stop="searchStore.remove(item)">
                      <X :size="11" />
                    </button>
                  </button>
                </div>
              </section>

              <!-- Top categories -->
              <section class="search-modal__section">
                <div class="search-modal__section-head">
                  <span class="search-modal__section-title"><LayoutGrid :size="13" />Категории</span>
                </div>
                <div class="search-modal__chips">
                  <NuxtLink
                    v-for="cat in categoriesStore.categories.slice(0, 8)"
                    :key="cat.id"
                    :to="`/catalog?categorySlug=${cat.slug}`"
                    class="search-modal__chip"
                    @click="closeModal"
                  >
                    <component :is="getCatIcon(cat.slug)" :size="15" />
                    <span>{{ cat.name }}</span>
                  </NuxtLink>
                </div>
              </section>

              <!-- Trending Now -->
              <section v-if="trendingProducts.length" class="search-modal__section search-modal__section--last search-modal__section--trending">
                <div class="search-modal__section-head">
                  <span class="search-modal__section-title"><TrendingUp :size="13" />Trending Now</span>
                </div>
                <ClientOnly>
                  <Swiper
                    :modules="[Navigation]"
                    navigation
                    :slides-per-view="2"
                    :space-between="10"
                    :breakpoints="{ 480: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 5 } }"
                    class="search-modal__trending"
                  >
                    <SwiperSlide v-for="p in trendingProducts" :key="p.id">
                      <NuxtLink :to="`/product/${p.id}`" class="search-modal__trend-card" @click="closeModal">
                        <div class="search-modal__trend-img">
                          <img v-if="p.thumbnail" :src="p.thumbnail" :alt="p.title" />
                        </div>
                        <p class="search-modal__trend-title">{{ p.title }}</p>
                        <p class="search-modal__trend-price">${{ p.price }}</p>
                      </NuxtLink>
                    </SwiperSlide>
                  </Swiper>
                </ClientOnly>
              </section>

            </template>

            <!-- ── ACTIVE STATE ────────────────────────────────────── -->
            <template v-else>
              <div class="search-modal__results">

                <!-- Left: suggestions -->
                <div class="search-modal__suggestions">
                  <!-- Submit query -->
                  <button
                    :class="['search-modal__suggestion', { 'search-modal__suggestion--focused': isFocused({ type: 'submit', value: debouncedQuery }) }]"
                    type="button"
                    @click="submitSearch()"
                  >
                    <Search :size="14" />
                    <span>Найти <strong>{{ debouncedQuery }}</strong></span>
                  </button>

                  <!-- History matches -->
                  <template v-if="historySuggestions.length">
                    <p class="search-modal__suggestions-label">История</p>
                    <button
                      v-for="item in historySuggestions"
                      :key="item"
                      :class="['search-modal__suggestion', { 'search-modal__suggestion--focused': isFocused({ type: 'history', value: item }) }]"
                      type="button"
                      @click="submitSearch(item)"
                    >
                      <Clock :size="14" />
                      <span>{{ item }}</span>
                    </button>
                  </template>

                  <!-- Category matches -->
                  <template v-if="categorySuggestions.length">
                    <p class="search-modal__suggestions-label">Категории</p>
                    <NuxtLink
                      v-for="cat in categorySuggestions"
                      :key="cat.id"
                      :class="['search-modal__suggestion', { 'search-modal__suggestion--focused': isFocused({ type: 'category', value: cat.slug }) }]"
                      :to="`/catalog?categorySlug=${cat.slug}`"
                      @click="closeModal"
                    >
                      <component :is="getCatIcon(cat.slug)" :size="14" />
                      <span>{{ cat.name }}</span>
                      <ChevronRight :size="13" class="search-modal__suggestion-arrow" />
                    </NuxtLink>
                  </template>
                </div>

                <!-- Right: products -->
                <div class="search-modal__products">
                  <!-- Skeleton -->
                  <template v-if="isSearching">
                    <div v-for="n in 4" :key="n" class="search-modal__product-skeleton" />
                  </template>

                  <!-- Results -->
                  <template v-else-if="searchResults.length">
                    <NuxtLink
                      v-for="p in searchResults"
                      :key="p.id"
                      :class="['search-modal__product-card', { 'search-modal__product-card--focused': isFocused({ type: 'product', value: p.id }) }]"
                      :to="`/product/${p.id}`"
                      @click="closeModal"
                    >
                      <div class="search-modal__product-img">
                        <img v-if="p.thumbnail" :src="p.thumbnail" :alt="p.title" loading="lazy" />
                      </div>
                      <div class="search-modal__product-info">
                        <span class="search-modal__product-cat">{{ p.category }}</span>
                        <p class="search-modal__product-title">{{ p.title }}</p>
                        <span class="search-modal__product-price">${{ p.price }}</span>
                      </div>
                      <button
                        class="search-modal__product-add"
                        type="button"
                        title="Добавить в корзину"
                        @click.prevent="quickAdd(p, $event)"
                      >
                        <ShoppingCart :size="14" />
                      </button>
                    </NuxtLink>
                  </template>

                  <!-- No results -->
                  <p v-else class="search-modal__no-results">Ничего не найдено</p>
                </div>

              </div>
            </template>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
// ─── Positioning wrapper (backdrop provided by AppBackdrop in layout) ─────────
.search-modal {
  position: fixed;
  inset: 0;
  z-index: $z-modal-overlay;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 72px 16px 24px;
}

// ─── Box ───────────────────────────────────────────────────────────────────────
.search-modal__box {
  width: 100%;
  max-width: 720px;
  background: $color-white;
  border-radius: $radius-xl;
  box-shadow: 0 24px 64px -12px rgb(0 0 0 / 28%), 0 4px 16px rgb(0 0 0 / 10%);
  overflow: hidden;
  min-height: 500px;
  max-height: calc(100vh - 96px);
  display: flex;
  flex-direction: column;
}

// ─── Header ───────────────────────────────────────────────────────────────────
.search-modal__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  flex-shrink: 0;
}

.search-modal__icon { color: $color-gray-400; flex-shrink: 0; }

.search-modal__input {
  flex: 1;
  font-size: $font-size-lg;
  font-family: $font-family-base;
  color: $color-gray-900;
  border: none;
  outline: none;
  background: transparent;
  min-width: 0;

  &::placeholder { color: $color-gray-400; }
}

.search-modal__dismiss {
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-gray-400;
  cursor: pointer;
  flex-shrink: 0;
  transition: color $transition-fast;
  padding: 4px;
  border-radius: $radius-md;

  &:hover { color: $color-gray-700; background: $color-gray-100; }
}

.search-modal__divider { height: 1px; background: $color-gray-100; flex-shrink: 0; }

// ─── Body ─────────────────────────────────────────────────────────────────────
.search-modal__body {
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

// ─── Sections ─────────────────────────────────────────────────────────────────
.search-modal__section {
  padding: 16px 20px 0;

  &--last     { padding-bottom: 16px; }
  &--trending { margin-top: auto; border-top: 1px solid $color-gray-100; }
}

.search-modal__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.search-modal__section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: $color-gray-400;
}

.search-modal__section-action {
  font-size: $font-size-xs;
  color: $color-primary;
  cursor: pointer;
  transition: opacity $transition-fast;
  &:hover { opacity: 0.75; }
}

// ─── Recent history ───────────────────────────────────────────────────────────
.search-modal__history {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 4px;
}

.search-modal__history-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: $radius-full;
  background: $color-gray-100;
  font-size: $font-size-sm;
  color: $color-gray-700;
  cursor: pointer;
  transition: background $transition-fast;

  &:hover { background: $color-gray-200; }
}

.search-modal__history-clock { color: $color-gray-400; flex-shrink: 0; }

.search-modal__history-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: $radius-full;
  color: $color-gray-400;
  flex-shrink: 0;
  transition: color $transition-fast, background $transition-fast;

  &:hover { color: $color-danger; background: rgb(239 68 68 / 10%); }
}

// ─── Category chips ───────────────────────────────────────────────────────────
.search-modal__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
}

.search-modal__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: $radius-full;
  border: 1px solid $color-gray-200;
  font-size: $font-size-sm;
  color: $color-gray-700;
  text-decoration: none;
  transition: border-color $transition-fast, color $transition-fast, background $transition-fast;

  svg { color: $color-primary; flex-shrink: 0; }

  &:hover {
    border-color: $color-primary;
    color: $color-primary;
    background: rgb(99 102 241 / 4%);
  }
}

// ─── Trending Swiper ──────────────────────────────────────────────────────────
.search-modal__trending {
  overflow: hidden;

  --swiper-navigation-color: #{$color-gray-500};
  --swiper-navigation-size: 16px;

  .swiper-button-prev,
  .swiper-button-next {
    width: 28px;
    height: 28px;
    background: $color-white;
    border: 1px solid $color-gray-200;
    border-radius: $radius-full;
    box-shadow: 0 2px 6px rgb(0 0 0 / 8%);
    top: 30%;

    &::after { font-size: 10px; font-weight: 700; }
    &:hover { background: $color-gray-50; }
    &.swiper-button-disabled { opacity: 0.3; }
  }
}

.search-modal__trend-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.search-modal__trend-img {
  aspect-ratio: 4 / 3;
  border-radius: $radius-lg;
  background: $color-gray-100;
  overflow: hidden;
  box-shadow:
    -3px 0 8px -3px rgb(0 0 0 / 8%),
    3px 0 8px -3px rgb(0 0 0 / 8%),
    0 4px 12px -3px rgb(0 0 0 / 10%);

  img { width: 100%; height: 100%; object-fit: cover; }
}

.search-modal__trend-title {
  font-size: $font-size-xs;
  color: $color-gray-700;
  font-weight: $font-weight-medium;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
  line-height: 1.4;
}

.search-modal__trend-price {
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  color: $color-primary;
  margin: 0;
}

// ─── Active state: two-column layout ─────────────────────────────────────────
.search-modal__results {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 240px;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
}

// ─── Left: suggestions ────────────────────────────────────────────────────────
.search-modal__suggestions {
  border-right: 1px solid $color-gray-100;
  padding: 8px 0;
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) { border-right: none; border-bottom: 1px solid $color-gray-100; }
}

.search-modal__suggestions-label {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: $color-gray-400;
  padding: 8px 16px 4px;
  margin: 0;
}

.search-modal__suggestion {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  font-size: $font-size-sm;
  color: $color-gray-700;
  text-decoration: none;
  cursor: pointer;
  transition: background $transition-fast, color $transition-fast;
  text-align: left;
  line-height: 1.3;

  svg { color: $color-gray-400; flex-shrink: 0; }

  strong { font-weight: $font-weight-semibold; color: $color-gray-900; }

  &:hover,
  &--focused { background: $color-gray-50; color: $color-primary; svg { color: $color-primary; } }
}

.search-modal__suggestion-arrow { color: $color-gray-300; margin-left: auto; flex-shrink: 0; }

// ─── Right: product mini-cards ────────────────────────────────────────────────
.search-modal__products {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.search-modal__product-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: $radius-lg;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: background $transition-fast;
  box-shadow:
    -3px 0 8px -3px rgb(0 0 0 / 5%),
    3px 0 8px -3px rgb(0 0 0 / 5%),
    0 4px 10px -3px rgb(0 0 0 / 7%);
  background: $color-white;

  &:hover,
  &--focused { background: $color-gray-50; }
}

.search-modal__product-img {
  width: 56px;
  height: 56px;
  border-radius: $radius-md;
  background: $color-gray-100;
  overflow: hidden;
  flex-shrink: 0;

  img { width: 100%; height: 100%; object-fit: cover; }
}

.search-modal__product-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.search-modal__product-cat {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: $color-primary;
}

.search-modal__product-title {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-gray-900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.search-modal__product-price {
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $color-gray-800;
}

.search-modal__product-add {
  width: 34px;
  height: 34px;
  border-radius: $radius-md;
  background: $color-gray-100;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  color: $color-gray-600;
  transition: background $transition-fast, color $transition-fast;

  &:hover { background: $color-primary; color: $color-white; }
}

.search-modal__product-skeleton {
  height: 72px;
  border-radius: $radius-lg;
  @include mixins.shimmer;
}

.search-modal__no-results {
  color: $color-gray-400;
  font-size: $font-size-sm;
  padding: 24px 10px;
  text-align: center;
  margin: 0;
}

// ─── Transitions ──────────────────────────────────────────────────────────────
.search-modal-enter-active {
  transition: opacity 0.2s ease;

  .search-modal__box {
    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
  }
}

.search-modal-leave-active {
  transition: opacity 0.15s ease;

  .search-modal__box { transition: transform 0.15s ease, opacity 0.15s ease; }
}

.search-modal-enter-from,
.search-modal-leave-to {
  opacity: 0;

  .search-modal__box { transform: translateY(-14px); opacity: 0; }
}
</style>
