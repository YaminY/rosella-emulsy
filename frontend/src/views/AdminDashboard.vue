<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
    <!-- Login Screen -->
    <div v-if="!isAuthenticated" class="max-w-md mx-auto mt-20">
      <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">{{ $t('admin.loginTitle') }}</h1>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('admin.password') }}</label>
            <input v-model="password" type="password" class="input-field" required />
          </div>
          <p v-if="loginError" class="text-red-500 text-sm">{{ loginError }}</p>
          <button type="submit" class="btn-primary w-full py-3">{{ $t('admin.login') }}</button>
        </form>
      </div>
    </div>

    <!-- Dashboard -->
    <div v-else>
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('admin.title') }}</h1>
        <div class="flex items-center gap-4">
          <button @click="startAddProduct" class="btn-primary flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {{ $t('admin.addProduct') }}
          </button>
          <button @click="handleLogout" class="text-gray-500 hover:text-red-600 transition-colors text-sm">{{ $t('admin.logout') }}</button>
        </div>
      </div>

      <!-- Backend sync status -->
      <div v-if="!backendAvailable" class="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        Backend server is starting up (Render cold start). Changes will sync when connected. 
        Local product data is shown. Retrying every 30 seconds...
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50">
                <th class="text-left px-4 py-3 font-semibold text-gray-600">{{ $t('admin.id') }}</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">{{ $t('admin.name') }}</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">{{ $t('admin.price') }}</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">{{ $t('admin.status') }}</th>
                <th class="text-right px-4 py-3 font-semibold text-gray-600">{{ $t('admin.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in allProducts" :key="product.id" class="border-t border-gray-100 hover:bg-gray-50">
                <td class="px-4 py-3 text-gray-500">{{ product.id }}</td>
                <td class="px-4 py-3 font-medium text-gray-900">{{ product.name[currentLocale] }}</td>
                <td class="px-4 py-3">{{ product.price.toFixed(2) }} JOD</td>
                <td class="px-4 py-3">
                  <span v-if="product.available" class="badge-available">{{ $t('admin.available') }}</span>
                  <span v-else class="badge-coming-soon">{{ $t('admin.comingSoonStatus') }}</span>
                </td>
                <td class="px-4 py-3 text-right">
                  <button @click="startEditProduct(product)" class="text-primary hover:text-primary/70 transition-colors mr-3">{{ $t('admin.editProduct') }}</button>
                  <button @click="confirmDelete(product)" class="text-red-500 hover:text-red-700 transition-colors">{{ $t('admin.deleteProduct') }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="allProducts.length === 0" class="text-center py-12 text-gray-400">
          {{ $t('admin.products') }}
        </div>
      </div>

      <!-- Product Form Modal -->
      <Teleport to="body">
        <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto" @click="cancelForm">
          <div @click.stop class="bg-white rounded-2xl p-6 lg:p-8 max-w-2xl w-full mt-10 mb-10 shadow-2xl">
            <h2 class="text-xl font-bold text-gray-900 mb-6">{{ editingProduct ? $t('admin.editProduct') : $t('admin.addProduct') }}</h2>

            <form @submit.prevent="saveProduct" class="space-y-5">
              <!-- ===== SECTION 1: Basic Info ===== -->
              <div class="bg-gray-50 rounded-xl p-4 space-y-4">
                <h3 class="font-semibold text-sm text-gray-800 border-b border-gray-200 pb-2">📋 Basic Info</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">💰 Price (JOD)</label>
                    <input v-model="form.price" type="number" step="0.01" class="input-field" required />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">📦 Size</label>
                    <input v-model="form.size" class="input-field" required />
                  </div>
                </div>

                <!-- Multiple Images -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">🖼️ Product Images</label>
                  <div v-for="(img, idx) in form.images" :key="idx" class="flex items-start gap-2 mb-2">
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <input v-model="form.images[idx]" class="input-field flex-1" placeholder="Paste URL or upload below" />
                        <button type="button" @click="removeImage(idx)" class="text-red-400 hover:text-red-600 text-xs mt-1">✕</button>
                      </div>
                      <div class="flex items-center gap-2 mt-1">
                        <label class="text-xs text-primary hover:text-primary/70 font-medium cursor-pointer">
                          📁 Upload File
                          <input type="file" accept="image/*" class="hidden" @change="uploadImage($event, idx)" />
                        </label>
                      </div>
                      <img v-if="form.images[idx]" :src="form.images[idx]" class="mt-1 w-20 h-20 object-cover rounded border" @error="$event.target.style.display='none'" />
                    </div>
                  </div>
                  <button type="button" @click="addImage" class="text-xs text-primary hover:text-primary/70 font-medium">+ Add Image</button>
                </div>

                <div class="flex items-center gap-6">
                  <div class="flex items-center gap-3">
                    <input v-model="form.available" type="checkbox" id="available" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <label for="available" class="text-sm font-medium text-gray-700">{{ $t('admin.available') }}</label>
                  </div>
                  <div class="flex items-center gap-3">
                    <input v-model="form.featured" type="checkbox" id="featured" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <label for="featured" class="text-sm font-medium text-gray-700">⭐ Featured</label>
                  </div>
                </div>
              </div>

              <!-- ===== SECTION 2: Per-Language Content (Collapsible Cards) ===== -->
              <div v-for="lang in languages" :key="lang.code" class="border border-gray-200 rounded-xl overflow-hidden">
                <!-- Card Header (clickable) -->
                <button
                  type="button"
                  @click="toggleLang(lang.code)"
                  class="flex items-center justify-between w-full bg-gray-50 px-4 py-3 border-b border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <h3 class="font-semibold text-sm text-gray-800">{{ lang.flag }} {{ lang.label }}</h3>
                  <svg
                    class="w-4 h-4 text-gray-400 transition-transform duration-200"
                    :class="{ 'rotate-180': openLangs[lang.code] }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <!-- Card Body (collapsible) -->
                <div v-if="openLangs[lang.code]" class="p-4 space-y-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">📝 Product Name</label>
                    <input v-model="form.name[lang.code]" :placeholder="`e.g. Rosella Body Cream (${lang.label})`" class="input-field" required />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">🔗 URL Slug</label>
                    <input v-model="form.slug[lang.code]" :placeholder="`e.g. rosella-body-cream (${lang.code})`" class="input-field text-xs" required />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">📄 Short Description (shown on product cards)</label>
                    <textarea v-model="form.description[lang.code]" :placeholder="`Brief description for product cards (${lang.label})`" class="input-field min-h-[60px]" required></textarea>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">📖 Long Description (expandable detail section)</label>
                    <textarea v-model="form.longDescription[lang.code]" :placeholder="`Detailed description shown in expandable section (${lang.label})`" class="input-field min-h-[80px]"></textarea>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">🖐️ How to Use</label>
                    <textarea v-model="form.howToUse[lang.code]" :placeholder="`Usage instructions shown in expandable section (${lang.label})`" class="input-field min-h-[60px]"></textarea>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">🏷️ Category</label>
                    <input v-model="form.category[lang.code]" :placeholder="`e.g. Body Care (${lang.label})`" class="input-field" required />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">🧪 Full Ingredients List</label>
                    <textarea v-model="form.ingredients[lang.code]" :placeholder="`Complete list of ingredients (${lang.label})`" class="input-field min-h-[60px]" required></textarea>
                  </div>

                  <!-- Key Ingredients for this language -->
                  <div class="border-t border-gray-100 pt-3 mt-2">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-medium text-gray-500">🌿 Key Ingredients ({{ lang.label }})</span>
                      <button type="button" @click="addIngredient(lang.code)" class="text-xs text-primary hover:text-primary/70 font-medium">+ Add</button>
                    </div>
                    <div v-if="form.keyIngredients.length === 0" class="text-xs text-gray-400 italic">No key ingredients defined. Click "+ Add" above to add one.</div>
                    <div v-for="(ing, idx) in form.keyIngredients" :key="idx" class="flex items-start gap-2 mb-1.5 pb-1.5 border-b border-gray-50 last:border-b-0">
                      <div class="flex-1 grid grid-cols-1 gap-1">
                        <input :value="ing.name[lang.code]" @input="ing.name[lang.code] = $event.target.value" :placeholder="`Ingredient name (${lang.label})`" class="input-field text-xs" />
                        <textarea :value="ing.benefit[lang.code]" @input="ing.benefit[lang.code] = $event.target.value" :placeholder="`Benefit (${lang.label})`" class="input-field text-xs min-h-[36px]"></textarea>
                      </div>
                      <button type="button" @click="removeIngredient(idx)" class="text-red-400 hover:text-red-600 text-xs mt-1">✕</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex gap-3 pt-4">
                <button type="submit" class="btn-primary flex-1 py-3">{{ $t('admin.save') }}</button>
                <button type="button" @click="cancelForm" class="btn-outline flex-1 py-3">{{ $t('admin.cancel') }}</button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- Delete Confirmation Modal -->
      <Teleport to="body">
        <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="showDeleteConfirm = false">
          <div @click.stop class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ $t('admin.confirmDelete') }}</h3>
            <p class="text-gray-500 text-sm mb-6">{{ deletingProduct?.name?.[currentLocale] }}</p>
            <div class="flex gap-3">
              <button @click="performDelete" class="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors flex-1">{{ $t('admin.deleteProduct') }}</button>
              <button @click="showDeleteConfirm = false" class="btn-outline flex-1">{{ $t('admin.cancel') }}</button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Success Toast -->
      <Teleport to="body">
        <div v-if="toast" class="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce">
          {{ toast }}
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useProducts } from '@/composables/useProducts'
import { productsAPI, adminAPI, setAdminToken } from '@/services/api'

const { locale } = useI18n()

const currentLocale = computed(() => locale.value)
const { allProducts, syncWithBackend, backendAvailable } = useProducts()

useHead({
  title: 'Admin Dashboard - Rosella Emulsy',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

const isAuthenticated = ref(false)
const password = ref('')
const loginError = ref('')
const showForm = ref(false)
const showDeleteConfirm = ref(false)
const editingProduct = ref(null)
const deletingProduct = ref(null)
const toast = ref('')

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
]

// Track which language cards are expanded (all start collapsed)
const openLangs = reactive({})
languages.forEach(l => { openLangs[l.code] = false })

function toggleLang(code) {
  openLangs[code] = !openLangs[code]
}

function resetOpenLangs() {
  languages.forEach(l => { openLangs[l.code] = false })
}

const emptyForm = () => ({
  price: 0,
  size: '30ml',
  available: true,
  featured: false,
  images: [],
  name: { en: '', ar: '', de: '', fr: '', ja: '', zh: '', ko: '' },
  description: { en: '', ar: '', de: '', fr: '', ja: '', zh: '', ko: '' },
  slug: { en: '', ar: '', de: '', fr: '', ja: '', zh: '', ko: '' },
  category: { en: '', ar: '', de: '', fr: '', ja: '', zh: '', ko: '' },
  ingredients: { en: '', ar: '', de: '', fr: '', ja: '', zh: '', ko: '' },
  longDescription: { en: '', ar: '', de: '', fr: '', ja: '', zh: '', ko: '' },
  howToUse: { en: '', ar: '', de: '', fr: '', ja: '', zh: '', ko: '' },
  keyIngredients: [],
})

const form = reactive(emptyForm())

async function handleLogin() {
  try {
    const response = await adminAPI.login(password.value)
    if (response?.token) {
      setAdminToken(response.token)
      isAuthenticated.value = true
      loginError.value = ''
    } else {
      loginError.value = 'Incorrect password'
    }
  } catch (err) {
    loginError.value = 'Login failed. Is the backend running?'
  }
}

function handleLogout() {
  isAuthenticated.value = false
  password.value = ''
}

function startAddProduct() {
  editingProduct.value = null
  Object.assign(form, emptyForm())
  resetOpenLangs()
  showForm.value = true
}

function startEditProduct(product) {
  editingProduct.value = product
  // Build images array from product
  let images = []
  if (product.images && Array.isArray(product.images)) {
    images = [...product.images]
  } else if (product.image) {
    images = [product.image]
  }

  Object.assign(form, {
    price: product.price,
    size: product.size,
    available: product.available,
    featured: product.featured,
    images,
    name: { ...product.name },
    description: { ...product.description },
    slug: { ...product.slug },
    category: { ...product.category },
    ingredients: { ...product.ingredients },
    longDescription: product.longDescription
      ? { ...product.longDescription }
      : { en: '', ar: '', de: '', fr: '', ja: '', zh: '', ko: '' },
    howToUse: product.howToUse
      ? { ...product.howToUse }
      : { en: '', ar: '', de: '', fr: '', ja: '', zh: '', ko: '' },
    keyIngredients: product.keyIngredients
      ? product.keyIngredients.map(ing => ({
          name: { ...ing.name },
          benefit: { ...ing.benefit },
        }))
      : [],
  })
  resetOpenLangs()
  showForm.value = true
}

async function saveProduct() {
  const productData = {
    name: { ...form.name },
    description: { ...form.description },
    slug: { ...form.slug },
    category: { ...form.category },
    ingredients: { ...form.ingredients },
    longDescription: { ...form.longDescription },
    howToUse: { ...form.howToUse },
    keyIngredients: form.keyIngredients.map(ing => ({
      name: { ...ing.name },
      benefit: { ...ing.benefit },
    })),
    price: parseFloat(form.price),
    size: form.size,
    available: form.available,
    featured: form.featured,
    images: [...form.images],
    image: form.images.length > 0 ? form.images[0] : '/images/placeholder.jpg',
    currency: 'JOD',
  }

  try {
    if (editingProduct.value) {
      productData.id = editingProduct.value.id
      // Update on backend
      const response = await productsAPI.update(productData.id, productData)
      if (response?.product) {
        // Update local state with backend response
        const index = allProducts.value.findIndex(p => p.id === editingProduct.value.id)
        if (index !== -1) {
          allProducts.value[index] = response.product
        }
      }
      showToast('Product updated successfully')
    } else {
      // Create on backend
      const response = await productsAPI.create(productData)
      if (response?.product) {
        // Add the backend-returned product (has real ID from backend)
        allProducts.value.push(response.product)
      }
      showToast('Product added successfully')
    }
  } catch (err) {
    showToast('Failed to save to backend. Please try again.')
    console.error('Failed to save product:', err)
  }

  showForm.value = false
}

function confirmDelete(product) {
  deletingProduct.value = product
  showDeleteConfirm.value = true
}

async function performDelete() {
  if (deletingProduct.value) {
    try {
      // Delete from backend
      await productsAPI.delete(deletingProduct.value.id)
      // Remove from local state
      const index = allProducts.value.findIndex(p => p.id === deletingProduct.value.id)
      if (index !== -1) {
        allProducts.value.splice(index, 1)
      }
      showToast('Product deleted successfully')
    } catch (err) {
      showToast('Failed to delete from backend. Please try again.')
      console.error('Failed to delete product:', err)
    }
  }
  showDeleteConfirm.value = false
  deletingProduct.value = null
}

function addImage() {
  form.images.push('')
}

function removeImage(idx) {
  form.images.splice(idx, 1)
}

function uploadImage(event, idx) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    form.images[idx] = e.target.result
  }
  reader.readAsDataURL(file)
  // Reset input so same file can be re-selected
  event.target.value = ''
}

function addIngredient() {
  const emptyLocale = () => ({ en: '', ar: '', de: '', fr: '', ja: '', zh: '', ko: '' })
  form.keyIngredients.push({
    name: emptyLocale(),
    benefit: emptyLocale(),
  })
}

function removeIngredient(idx) {
  form.keyIngredients.splice(idx, 1)
}

function cancelForm() {
  showForm.value = false
  editingProduct.value = null
}

function showToast(message) {
  toast.value = message
  setTimeout(() => { toast.value = '' }, 3000)
}
</script>