import axios from 'axios'

// In production (Vercel), API calls go to Render backend
// In development (localhost), Vite proxy handles it
const API_BASE = import.meta.env.PROD
  ? 'https://rosellaemulsy.onrender.com/api'
  : '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
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