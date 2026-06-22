<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
    <h1 class="section-title">{{ $t('checkout.title') }}</h1>

    <div v-if="cartItems.length === 0" class="text-center py-20">
      <svg class="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
      <h2 class="text-2xl font-bold text-gray-600 mb-2">{{ $t('cart.empty') }}</h2>
      <p class="text-gray-400 mb-8">{{ $t('cart.emptyHint') }}</p>
      <router-link to="/products" class="btn-primary inline-block">{{ $t('cart.continueShopping') }}</router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
      <!-- Cart Items & Checkout Form -->
      <div class="lg:col-span-3 space-y-8">
        <!-- Cart Items -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 mb-6">{{ $t('cart.title') }}</h2>
          <div class="space-y-4">
            <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary-light/20 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  v-if="item.image && !imageErrors[item.id]"
                  :src="item.image"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                  @error="setImageError(item.id)"
                />
                <svg v-else class="w-8 h-8 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-gray-900 truncate">{{ item.name }}</h3>
                <p class="text-sm text-gray-500">{{ item.size }}</p>
                <p class="text-sm font-semibold text-primary">{{ formatPrimaryPrice(item.price * item.quantity) }}</p>
                <p v-if="showBasePrice" class="text-xs text-gray-500">{{ formatBasePrice(item.price * item.quantity) }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button @click="updateQuantity(item.id, item.quantity - 1)" class="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                </button>
                <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                <button @click="updateQuantity(item.id, item.quantity + 1)" class="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
              </div>
              <button @click="removeFromCart(item.id)" class="p-2 text-red-400 hover:text-red-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Checkout Form -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 mb-6">{{ $t('checkout.contactInfo') }}</h2>
          <form @submit.prevent="handlePayment" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('checkout.fullName') }}</label>
              <input v-model="form.fullName" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('checkout.email') }}</label>
              <input v-model="form.email" type="email" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('checkout.phone') }}</label>
              <input v-model="form.phone" type="tel" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('checkout.shippingAddress') }}</label>
              <input v-model="form.address" class="input-field" required />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('checkout.city') }}</label>
                <input v-model="form.city" class="input-field" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('checkout.country') }}</label>
                <input v-model="form.country" class="input-field" required />
              </div>
            </div>

            <button
              type="submit"
              :disabled="processing"
              class="btn-secondary text-lg w-full py-4 mt-4"
            >
              <span v-if="!processing">{{ $t('checkout.payNow', { amount: cartTotal.toFixed(2) }) }}</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('checkout.processing') }}
              </span>
            </button>
          </form>
        </div>
      </div>

      <!-- Order Summary Sidebar -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
          <h2 class="text-xl font-bold text-gray-900 mb-6">{{ $t('checkout.orderSummary') }}</h2>
          <div class="space-y-3 mb-6">
            <div v-for="item in cartItems" :key="item.id" class="flex justify-between text-sm">
              <span class="text-gray-600">{{ item.name }} × {{ item.quantity }}</span>
              <span class="text-gray-900 font-medium">{{ formatPrimaryPrice(item.price * item.quantity) }}</span>
            </div>
          </div>
          <div class="border-t border-gray-100 pt-4">
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-gray-900">{{ $t('cart.total') }}</span>
              <span class="text-2xl font-bold text-primary">{{ formatPrimaryPrice(cartTotal) }}</span>
            </div>
            <div class="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
              <span v-if="showBasePrice" class="text-gray-500">{{ formatBasePrice(cartTotal) }}</span>
              <span v-for="secondaryPrice in secondaryPrices" :key="secondaryPrice.currency">
                {{ secondaryPrice.display }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Result Modal -->
    <Teleport to="body">
      <div v-if="showResult" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="closeResult">
        <div @click.stop class="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div v-if="paymentSuccess" class="text-green-500 mb-4">
            <svg class="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <h3 class="text-2xl font-bold text-gray-900 mt-2">{{ $t('checkout.successTitle') }}</h3>
          </div>
          <div v-else class="text-red-500 mb-4">
            <svg class="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <h3 class="text-2xl font-bold text-gray-900 mt-2">{{ $t('checkout.errorTitle') }}</h3>
          </div>
          <p class="text-gray-600 mb-6">
            {{ paymentSuccess ? $t('checkout.successMessage') : $t('checkout.errorMessage') }}
          </p>
          <button v-if="paymentSuccess" @click="closeResult" class="btn-primary w-full">
            {{ $t('cart.continueShopping') }}
          </button>
          <button v-else @click="showResult = false" class="btn-primary w-full">
            {{ $t('checkout.errorMessage').includes('try again') ? $t('checkout.errorMessage') : 'Close' }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCart } from '@/composables/useCart'
import { useCurrency } from '@/composables/useCurrency'
import { paymentAPI } from '@/services/api'

const router = useRouter()
const { locale } = useI18n()
const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart()
const { getPrimaryPrice, getBasePrice, getSecondaryPrices } = useCurrency()

const processing = ref(false)
const showResult = ref(false)
const paymentSuccess = ref(false)
const imageErrors = ref({})

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
})

const secondaryPrices = computed(() => getSecondaryPrices(cartTotal.value, locale.value))
const showBasePrice = computed(() => getPrimaryPrice(cartTotal.value, locale.value).currency !== 'JOD')

function formatPrimaryPrice(amount) {
  const value = typeof amount === 'number' ? amount : amount.value
  return getPrimaryPrice(value, locale.value).display
}

function formatBasePrice(amount) {
  const value = typeof amount === 'number' ? amount : amount.value
  return getBasePrice(value)
}

function setImageError(itemId) {
  imageErrors.value = {
    ...imageErrors.value,
    [itemId]: true,
  }
}

async function handlePayment() {
  if (cartItems.value.length === 0) return
  processing.value = true

  try {
    const order = {
      items: cartItems.value.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
      })),
      total: cartTotal.value,
      currency: 'JOD',
      customer: {
        name: form.fullName,
        email: form.email,
        phone: form.phone,
      },
      shipping: {
        address: form.address,
        city: form.city,
        country: form.country,
      },
    }

    // TODO: Replace with actual Tap Payments integration
    // const response = await paymentAPI.createPaymentIntent(order)
    // Tap will redirect to their hosted payment page
    // On success webhook, we'll clear cart and show success

    // For testing - simulate success
    await new Promise(resolve => setTimeout(resolve, 1500))
    paymentSuccess.value = true
    showResult.value = true
    clearCart()
  } catch (error) {
    paymentSuccess.value = false
    showResult.value = true
  } finally {
    processing.value = false
  }
}

function closeResult() {
  showResult.value = false
  if (paymentSuccess.value) {
    router.push('/products')
  }
}
</script>
