import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { productsAPI } from '@/services/api'
import localProducts from '@/data/products.json'

// Reactive store with local data as immediate fallback
const products = ref([...localProducts.products])
const loading = ref(false)
const backendAvailable = ref(false)
const error = ref(null)

// Try to sync with the backend API, fall back to local data
async function syncWithBackend() {
  loading.value = true
  try {
    const response = await productsAPI.getAll()
    if (response?.products?.length > 0) {
      products.value = response.products
      backendAvailable.value = true
    }
  } catch (err) {
    // Backend is sleeping (Render cold start) - continue with local data
    console.log('Backend not available yet, using local product data')
    error.value = null // Don't show error - local data is sufficient
  } finally {
    loading.value = false
  }
}

// Initial sync
syncWithBackend()

// Re-sync every 30 seconds to detect when backend wakes up
setInterval(() => {
  if (!backendAvailable.value) {
    syncWithBackend()
  }
}, 30000)

export function useProducts() {
  const { locale } = useI18n()

  const currentLocale = computed(() => locale.value)

  const allProducts = computed(() => products.value)

  const featuredProducts = computed(() =>
    products.value.filter(p => p.featured)
  )

  const availableProducts = computed(() =>
    products.value.filter(p => p.available)
  )

  const comingSoonProducts = computed(() =>
    products.value.filter(p => !p.available)
  )

  function getProductBySlug(slug) {
    return products.value.find(p =>
      Object.values(p.slug).includes(slug)
    )
  }

  function getProductById(id) {
    return products.value.find(p => p.id === id)
  }

  return {
    products,
    allProducts,
    featuredProducts,
    availableProducts,
    comingSoonProducts,
    getProductBySlug,
    getProductById,
    loading,
    backendAvailable,
    error,
    syncWithBackend,
  }
}