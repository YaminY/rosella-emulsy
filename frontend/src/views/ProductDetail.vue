<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
    <div v-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Product Image -->
      <div class="aspect-square bg-gradient-to-br from-primary/10 to-primary-light/20 rounded-3xl overflow-hidden">
        <img v-if="product.image" :src="product.image" :alt="product.name[currentLocale]" class="w-full h-full object-cover" />
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
          <span class="text-3xl font-bold text-primary">{{ product.price.toFixed(2) }} {{ $t('products.currency') }}</span>
          <div class="flex gap-3 mt-2">
            <span v-for="approx in approximates" :key="approx.currency" class="text-sm text-gray-400">
              {{ $t('products.approx', { amount: approx.display, currency: approx.currency }) }}
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useCart } from '@/composables/useCart'
import { useCurrency } from '@/composables/useCurrency'
import { useProducts } from '@/composables/useProducts'

const route = useRoute()
const { locale } = useI18n()
const { addToCart } = useCart()
const { getAllApproximates } = useCurrency()
const { getProductBySlug } = useProducts()

const currentLocale = computed(() => locale.value)

const product = computed(() => {
  const slug = route.params.slug
  return getProductBySlug(slug)
})

const approximates = computed(() => {
  if (!product.value) return []
  return getAllApproximates(product.value.price)
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