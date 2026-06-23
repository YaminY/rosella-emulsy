<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
    <div v-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Product Image -->
      <div class="aspect-square bg-gradient-to-br from-primary/10 to-primary-light/20 rounded-3xl overflow-hidden">
        <img
          v-if="product.image && !imageError"
          :src="product.image"
          :alt="product.name[currentLocale]"
          class="w-full h-full object-cover"
          @error="imageError = true"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <div class="text-center p-8">
            <svg class="w-32 h-32 mx-auto text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-gray-400 mt-4">{{ product.name[currentLocale] }}</p>
          </div>
        </div>
      </div>

      <!-- Product Info -->
      <div>
        <span v-if="!product.available" class="badge-coming-soon mb-4 inline-block">{{ $t('products.comingSoon') }}</span>
        <span v-else class="badge-available mb-4 inline-block">{{ $t('products.available') }}</span>

        <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{{ product.name[currentLocale] }}</h1>
        <p class="text-lg text-gray-600 mb-6 leading-relaxed">{{ product.description[currentLocale] }}</p>

        <!-- Details -->
        <div class="space-y-4 mb-8">
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-500 min-w-[100px]">{{ $t('products.size') }}:</span>
            <span class="text-gray-900 font-medium">{{ product.size }}</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-sm font-medium text-gray-500 min-w-[100px]">{{ $t('products.ingredients') }}:</span>
            <span class="text-gray-700">{{ product.ingredients[currentLocale] }}</span>
          </div>
        </div>

        <!-- Price -->
        <div class="mb-8">
          <span class="text-3xl font-bold text-primary">{{ primaryPrice.display }}</span>
          <div class="flex flex-wrap gap-3 mt-2">
            <span v-if="showBasePrice" class="text-sm text-gray-500">{{ basePrice }}</span>
            <span v-for="secondaryPrice in secondaryPrices" :key="secondaryPrice.currency" class="text-sm text-gray-400">
              {{ secondaryPrice.display }}
            </span>
          </div>
        </div>

        <!-- Add to Cart -->
        <button
          v-if="product.available"
          @click="handleAddToCart"
          class="btn-primary text-lg px-10 py-4 w-full sm:w-auto"
        >
          {{ $t('products.addToCart') }}
        </button>
        <button v-else disabled class="bg-gray-200 text-gray-400 px-10 py-4 rounded-lg text-lg font-medium cursor-not-allowed w-full sm:w-auto">
          {{ $t('products.outOfStock') }}
        </button>

        <!-- Collapsible Details Section -->
        <div v-if="hasDetails" class="mt-10 pt-8 border-t border-gray-200">
          <button
            @click="expanded = !expanded"
            class="flex items-center justify-between w-full text-left"
          >
            <span class="text-base font-semibold text-gray-800">{{ expanded ? $t('products.showLess') : $t('products.showMore') }}</span>
            <svg
              class="w-5 h-5 text-gray-500 transition-transform duration-200"
              :class="{ 'rotate-180': expanded }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="expanded"
            class="mt-6 space-y-8"
          >
            <!-- Long Description -->
            <div v-if="product.longDescription?.[currentLocale]">
              <h4 class="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3">{{ $t('products.description') }}</h4>
              <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ product.longDescription[currentLocale] }}</p>
            </div>

            <!-- How to Use -->
            <div v-if="product.howToUse?.[currentLocale]">
              <h4 class="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3">{{ $t('products.howToUse') }}</h4>
              <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ product.howToUse[currentLocale] }}</p>
            </div>

            <!-- Key Ingredients -->
            <div v-if="product.keyIngredients?.length">
              <h4 class="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3">{{ $t('products.keyIngredients') }}</h4>
              <ul class="space-y-3">
                <li
                  v-for="(item, index) in product.keyIngredients"
                  :key="index"
                  class="text-base"
                >
                  <span class="font-medium text-gray-800">{{ item.name[currentLocale] }}</span>
                  <span class="text-gray-500"> — {{ item.benefit[currentLocale] }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-20">
      <h2 class="text-2xl font-bold text-gray-400">Product not found</h2>
      <router-link to="/products" class="btn-primary mt-6 inline-block">View all products</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useCart } from '@/composables/useCart'
import { useCurrency } from '@/composables/useCurrency'
import { useProducts } from '@/composables/useProducts'

const route = useRoute()
const { locale } = useI18n()
const { addToCart } = useCart()
const { getPrimaryPrice, getBasePrice, getSecondaryPrices } = useCurrency()
const { getProductBySlug } = useProducts()

const currentLocale = computed(() => locale.value)
const imageError = ref(false)
const expanded = ref(false)

const product = computed(() => {
  const slug = route.params.slug
  return getProductBySlug(slug)
})

watch(product, () => {
  imageError.value = false
  expanded.value = false
})

const primaryPrice = computed(() => {
  if (!product.value) return { display: '' }
  return getPrimaryPrice(product.value.price, locale.value)
})

const basePrice = computed(() => {
  if (!product.value) return ''
  return getBasePrice(product.value.price)
})

const showBasePrice = computed(() => primaryPrice.value.currency !== 'JOD')

const secondaryPrices = computed(() => {
  if (!product.value) return []
  return getSecondaryPrices(product.value.price, locale.value)
})

const hasDetails = computed(() => {
  if (!product.value) return false
  return !!(
    product.value.longDescription?.[locale.value] ||
    product.value.howToUse?.[locale.value] ||
    product.value.keyIngredients?.length
  )
})

// Dynamic SEO meta tags from product data
const productName = computed(() => product.value?.name?.[locale.value] || product.value?.name?.en || '')
const productDescription = computed(() => product.value?.description?.[locale.value] || '')

useHead({
  title: computed(() => productName.value ? `${productName.value} - Rosella Emulsy` : 'Product - Rosella Emulsy'),
  meta: [
    { name: 'description', content: computed(() => productDescription.value) },
    { property: 'og:title', content: computed(() => `${productName.value} - Rosella Emulsy`) },
    { property: 'og:description', content: computed(() => productDescription.value) },
    { property: 'og:type', content: 'product' },
  ],
})

function handleAddToCart() {
  if (product.value) {
    addToCart(product.value)
  }
}
</script>