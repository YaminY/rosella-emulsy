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

// Store admin token (resets on page load — user must re-login)
let adminToken = null

export function setAdminToken(token) {
  adminToken = token
}

export function getAdminToken() {
  return adminToken
}

// For admin-protected API calls, add the token header
function adminHeaders() {
  const headers = {}
  if (adminToken) {
    headers['x-admin-token'] = adminToken
  }
  return headers
}

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
    const { data } = await api.post('/products', product, { headers: adminHeaders() })
    return data
  },

  async update(id, product) {
    const { data } = await api.put(`/products/${id}`, product, { headers: adminHeaders() })
    return data
  },

  async delete(id) {
    const { data } = await api.delete(`/products/${id}`, { headers: adminHeaders() })
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
    const { data } = await api.get('/admin/verify', { headers: adminHeaders() })
    return data
  },
}

export default api