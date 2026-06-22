<template>
  <div class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
    <!-- Image -->
    <div class="aspect-square bg-gradient-to-br from-primary/5 to-primary-light/10 relative overflow-hidden">
      <img
        v-if="product.image && !imageError"
        :src="product.image"
        :alt="product.name[currentLocale]"
        class="w-full h-full object-cover"
        @error="imageError = true"
      />
      <div class="absolute inset-0 flex items-center justify-center" v-if="!product.image || imageError">
        <div class="w-full h-full bg-gradient-to-br from-primary/10 to-primary-light/20 flex items-center justify-center">
          <div class="text-center p-4">
            <svg class="w-16 h-16 mx-auto text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-xs text-gray-400 mt-2">{{ product.name[currentLocale] }}</p>
          </div>
        </div>
      </div>

      <!-- Badge -->
      <div class="absolute top-3 left-3">
        <span v-if="!product.available" class="badge-coming-soon">{{ $t('products.comingSoon') }}</span>
        <span v-else class="badge-available">{{ $t('products.available') }}</span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <p class="text-xs text-gray-500 mb-1">{{ product.category[currentLocale] }}</p>
      <h3 class="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{{ product.name[currentLocale] }}</h3>
      <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ product.description[currentLocale] }}</p>

      <!-- Size tag -->
      <div class="flex items-center gap-2 mb-4">
        <span class="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{{ product.size }}</span>
      </div>

      <!-- Price and Action -->
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xl font-bold text-primary">{{ primaryPrice.display }}</span>
          <div class="flex flex-wrap gap-2 mt-1">
            <span v-if="showBasePrice" class="text-xs text-gray-500">{{ basePrice }}</span>
            <span v-for="secondaryPrice in secondaryPrices" :key="secondaryPrice.currency" class="text-xs text-gray-400">
              {{ secondaryPrice.display }}
            </span>
          </div>
        </div>

        <button
          v-if="product.available"
          @click="handleAddToCart"
          class="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {{ $t('products.addToCart') }}
        </button>
        <button v-else disabled class="bg-gray-200 text-gray-400 px-4 py-2.5 rounded-xl text-sm font-medium cursor-not-allowed">
          {{ $t('products.outOfStock') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCart } from '@/composables/useCart'
import { useCurrency } from '@/composables/useCurrency'

const props = defineProps({
  product: { type: Object, required: true },
})

const { locale } = useI18n()
const { addToCart } = useCart()
const { getPrimaryPrice, getBasePrice, getSecondaryPrices } = useCurrency()

const currentLocale = computed(() => locale.value)
const imageError = ref(false)

const primaryPrice = computed(() => getPrimaryPrice(props.product.price, locale.value))
const basePrice = computed(() => getBasePrice(props.product.price))
const showBasePrice = computed(() => primaryPrice.value.currency !== 'JOD')
const secondaryPrices = computed(() => getSecondaryPrices(props.product.price, locale.value))

function handleAddToCart() {
  addToCart(props.product)
}
</script>
