import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const cartItems = ref([])

// Load cart from localStorage on init
const savedCart = localStorage.getItem('cart')
if (savedCart) {
  try {
    cartItems.value = JSON.parse(savedCart)
  } catch {
    cartItems.value = []
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

export function useCart() {
  const { locale } = useI18n()

  const cartCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  function addToCart(product, quantity = 1) {
    const existing = cartItems.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      const localeVal = locale.value
      cartItems.value.push({
        id: product.id,
        slug: product.slug,
        name: product.name[localeVal] || product.name.en,
        price: product.price,
        image: product.image,
        size: product.size,
        quantity,
      })
    }
    saveCart()
  }

  function removeFromCart(productId) {
    cartItems.value = cartItems.value.filter(item => item.id !== productId)
    saveCart()
  }

  function updateQuantity(productId, quantity) {
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveCart()
      }
    }
  }

  function clearCart() {
    cartItems.value = []
    saveCart()
  }

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
}