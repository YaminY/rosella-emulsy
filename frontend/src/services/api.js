import axios from 'axios'

// Use a relative API path by default so local dev can use the Vite proxy
// and production can use a platform rewrite without browser-side CORS issues.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  // Longer timeout for Render cold starts (up to 30s)
  timeout: 30000,
})

export const productsAPI = {
  async getAll() {
    const { data } = await api.get('/products')
    return data
  },

  async getById(id) {
    const { data } = await api.get(`/products/${id}`)
    return data
  },

  async create(product) {
    const { data } = await api.post('/products', product)
    return data
  },

  async update(id, product) {
    const { data } = await api.put(`/products/${id}`, product)
    return data
  },

  async delete(id) {
    const { data } = await api.delete(`/products/${id}`)
    return data
  },
}

export const paymentAPI = {
  async createPaymentIntent(order) {
    const { data } = await api.post('/payment/create', order)
    return data
  },
}

export const adminAPI = {
  async login(password) {
    const { data } = await api.post('/admin/login', { password })
    return data
  },

  async verify() {
    const { data } = await api.get('/admin/verify')
    return data
  },
}

export default api
