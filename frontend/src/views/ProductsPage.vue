<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
    <h1 class="section-title">{{ $t('products.title') }}</h1>
    <p class="section-subtitle">{{ $t('products.subtitle') }}</p>

    <!-- Filter Tabs -->
    <div class="flex flex-wrap justify-center gap-3 mb-10">
      <button
        @click="filter = 'all'"
        class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
        :class="filter === 'all' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        {{ $t('products.all') }}
      </button>
      <button
        @click="filter = 'available'"
        class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
        :class="filter === 'available' ? 'bg-primary-light text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        {{ $t('products.available') }}
      </button>
      <button
        @click="filter = 'coming-soon'"
        class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
        :class="filter === 'coming-soon' ? 'bg-secondary-amber text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        {{ $t('products.comingSoon') }}
      </button>
    </div>

    <!-- Products Grid -->
    <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <p class="text-gray-500 text-lg">{{ $t('products.title') }}</p>
    </div>
  </div>

  <!-- Coming Soon Section -->
  <div v-if="comingSoonProducts.length > 0" class="bg-gradient-to-r from-secondary-amber/10 to-secondary-gold/10 py-16 mt-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-title text-secondary-amber">{{ $t('products.comingSoon') }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        <ProductCard v-for="product in comingSoonProducts" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import ProductCard from '@/components/ProductCard.vue'
import { useProducts } from '@/composables/useProducts'

const { t, locale } = useI18n()
const { allProducts, comingSoonProducts } = useProducts()

// SEO meta tags
useHead({
  title: 'All Products - Rosella Emulsy',
  meta: [
    { name: 'description', content: 'Explore our range of natural skincare products. 100% natural, handcrafted in Jordan.' },
    { property: 'og:title', content: 'Natural Skincare Products - Rosella Emulsy' },
    { property: 'og:description', content: 'Shop our handcrafted natural skincare collection.' },
  ],
})

const filter = ref('all')

const filteredProducts = computed(() => {
  let list = allProducts.value
  if (filter.value === 'available') {
    list = list.filter(p => p.available)
  } else if (filter.value === 'coming-soon') {
    list = list.filter(p => !p.available)
  }
  return list
})
</script>