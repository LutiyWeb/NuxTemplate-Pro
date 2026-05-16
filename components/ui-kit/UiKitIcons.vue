<script setup lang="ts">
import {
  ShoppingCart, Heart, User, Search, Menu, LayoutGrid, Package, Truck,
  Star, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  X, Check, Plus, Minus, Trash2, Edit, Eye, EyeOff,
  Home, Phone, MapPin, Mail, Lock, Unlock,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Smartphone, Laptop, Headphones, Gamepad2, Tablet, Watch, Tv, Camera,
  CheckCircle2, XCircle, AlertTriangle, Info,
  Loader2, RefreshCw, Settings, FileText,
  ExternalLink, Upload, Download, Copy, Bookmark,
} from 'lucide-vue-next'

const ICONS = [
  { name: 'ShoppingCart', component: ShoppingCart },
  { name: 'Heart', component: Heart },
  { name: 'User', component: User },
  { name: 'Search', component: Search },
  { name: 'Menu', component: Menu },
  { name: 'LayoutGrid', component: LayoutGrid },
  { name: 'Package', component: Package },
  { name: 'Truck', component: Truck },
  { name: 'Star', component: Star },
  { name: 'ChevronRight', component: ChevronRight },
  { name: 'ChevronLeft', component: ChevronLeft },
  { name: 'ChevronDown', component: ChevronDown },
  { name: 'ChevronUp', component: ChevronUp },
  { name: 'X', component: X },
  { name: 'Check', component: Check },
  { name: 'Plus', component: Plus },
  { name: 'Minus', component: Minus },
  { name: 'Trash2', component: Trash2 },
  { name: 'Edit', component: Edit },
  { name: 'Eye', component: Eye },
  { name: 'EyeOff', component: EyeOff },
  { name: 'Home', component: Home },
  { name: 'Phone', component: Phone },
  { name: 'MapPin', component: MapPin },
  { name: 'Mail', component: Mail },
  { name: 'Lock', component: Lock },
  { name: 'Unlock', component: Unlock },
  { name: 'ArrowRight', component: ArrowRight },
  { name: 'ArrowLeft', component: ArrowLeft },
  { name: 'ArrowUp', component: ArrowUp },
  { name: 'ArrowDown', component: ArrowDown },
  { name: 'Smartphone', component: Smartphone },
  { name: 'Laptop', component: Laptop },
  { name: 'Headphones', component: Headphones },
  { name: 'Gamepad2', component: Gamepad2 },
  { name: 'Tablet', component: Tablet },
  { name: 'Watch', component: Watch },
  { name: 'Tv', component: Tv },
  { name: 'Camera', component: Camera },
  { name: 'CheckCircle2', component: CheckCircle2 },
  { name: 'XCircle', component: XCircle },
  { name: 'AlertTriangle', component: AlertTriangle },
  { name: 'Info', component: Info },
  { name: 'Loader2', component: Loader2 },
  { name: 'RefreshCw', component: RefreshCw },
  { name: 'Settings', component: Settings },
  { name: 'FileText', component: FileText },
  { name: 'ExternalLink', component: ExternalLink },
  { name: 'Upload', component: Upload },
  { name: 'Download', component: Download },
  { name: 'Copy', component: Copy },
  { name: 'Bookmark', component: Bookmark },
]

const copied = ref('')
async function copyName(name: string) {
  await navigator.clipboard.writeText(name)
  copied.value = name
  setTimeout(() => { copied.value = '' }, 1200)
}

const iconSize = ref(24)

const USAGE_CODE = `import { ShoppingCart, Heart } from 'lucide-vue-next'

// Напрямую
<ShoppingCart :size="20" />

// Через AppIcon (обёртка с flex-центрированием)
<AppIcon name="cart" :size="24">
  <ShoppingCart />
</AppIcon>`
</script>

<template>
  <div class="uikit-icons">

    <UiKitSection title="Галерея иконок" description="Нажми на иконку чтобы скопировать её название">
      <template #preview>
        <div style="width: 100%; display: flex; flex-direction: column; gap: 16px">
          <div style="display: flex; align-items: center; gap: 12px">
            <span style="font-size: 13px; color: #6b7280">Размер:</span>
            <input v-model="iconSize" type="range" min="16" max="40" style="width: 120px" />
            <span style="font-size: 13px; font-weight: 600; color: #374151">{{ iconSize }}px</span>
          </div>
          <div class="uikit-icons__grid">
            <button
              v-for="icon in ICONS"
              :key="icon.name"
              :class="['uikit-icons__item', { 'uikit-icons__item--copied': copied === icon.name }]"
              type="button"
              :title="icon.name"
              @click="copyName(icon.name)"
            >
              <component :is="icon.component" :size="iconSize" />
              <span class="uikit-icons__name">{{ copied === icon.name ? '✓' : icon.name }}</span>
            </button>
          </div>
        </div>
      </template>
    </UiKitSection>

    <UiKitSection title="AppIcon — обёртка" description="Flex-контейнер для иконок с фиксированным размером">
      <template #preview>
        <div style="display: flex; gap: 16px; align-items: center">
          <AppIcon name="cart" :size="40" style="background: rgb(99 102 241 / 8%); border-radius: 8px; color: #6366f1">
            <ShoppingCart />
          </AppIcon>
          <AppIcon name="heart" :size="40" style="background: rgb(239 68 68 / 8%); border-radius: 8px; color: #ef4444">
            <Heart />
          </AppIcon>
          <AppIcon name="check" :size="40" style="background: rgb(34 197 94 / 8%); border-radius: 8px; color: #22c55e">
            <CheckCircle2 />
          </AppIcon>
        </div>
      </template>
      <template #code>
        <UiKitCodeBlock :code="USAGE_CODE" />
      </template>
      <template #props>
        <UiKitPropsTable :rows="[
          { name: 'name', type: 'string', required: true, description: 'Идентификатор иконки (для семантики)' },
          { name: 'size', type: 'number', default: '24', description: 'Размер контейнера в пикселях' },
        ]" />
      </template>
    </UiKitSection>

  </div>
</template>

<style lang="scss">
.uikit-icons {
  display: flex;
  flex-direction: column;
  gap: 40px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
    gap: 8px;
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 8px;
    background: $color-white;
    border: 1px solid $color-gray-100;
    border-radius: $radius-lg;
    cursor: pointer;
    color: $color-gray-700;
    transition: background $transition-fast, border-color $transition-fast, color $transition-fast;

    &:hover { background: rgb(99 102 241 / 6%); border-color: $color-primary; color: $color-primary; }

    &--copied { background: rgb(34 197 94 / 8%); border-color: $color-success; color: $color-success; }
  }

  &__name {
    font-size: 10px;
    font-family: monospace;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 80px;
  }
}
</style>
