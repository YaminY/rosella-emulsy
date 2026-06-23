import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { productsAPI } from '@/services/api'
import localProducts from '@/data/products.json'

// Reactive store with local data as immediate fallback
const products = ref([...localProducts.products])
const loading = ref(false)
const backendAvailable = ref(false)
const error = ref(null)

// Merge backend product into local product to preserve rich fields (longDescription, howToUse, keyIngredients)
function mergeProduct(backendProduct) {
  const localProduct = localProducts.products.find(p => p.id === backendProduct.id)
  if (!localProduct) return backendProduct // no local match, use backend as-is
  return {
    ...backendProduct,
    // Preserve rich content fields from local data that backend may not have
    longDescription: localProduct.longDescription,
    howToUse: localProduct.howToUse,
    keyIngredients: localProduct.keyIngredients,
    // Also ensure the description text is the richer local version
    description: localProduct.description,
    // Keep the full ingredients list from local data
    ingredients: localProduct.ingredients,
    // Keep local locale fields that backend may truncate
    name: localProduct.name,
    category: localProduct.category,
  }
}

// Try to sync with the backend API, fall back to local data
async function syncWithBackend() {
  loading.value = true
  try {
    const response = await productsAPI.getAll()
    if (response?.products?.length > 0) {
      // Merge each backend product with local rich data
      products.value = response.products.map(mergeProduct)
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