import { Router } from 'express'
import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { requireAdmin } from '../middleware/adminAuth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DATA_FILE = join(__dirname, '..', 'data', 'products.json')

const router = Router()

async function loadProducts() {
  const data = await readFile(DATA_FILE, 'utf-8')
  return JSON.parse(data)
}

async function saveProducts(products) {
  await writeFile(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8')
}

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const data = await loadProducts()
    res.json(data)
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load products' })
  }
})

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const data = await loadProducts()
    const product = data.products.find(p => p.id === parseInt(req.params.id))
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    res.json({ success: true, product })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load product' })
  }
})

// POST /api/products - Create product (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const data = await loadProducts()
    const maxId = data.products.reduce((max, p) => Math.max(max, p.id), 0)
    const newProduct = {
      id: maxId + 1,
      ...req.body,
    }
    data.products.push(newProduct)
    await saveProducts(data)
    res.status(201).json({ success: true, product: newProduct })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product' })
  }
})

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const data = await loadProducts()
    const index = data.products.findIndex(p => p.id === parseInt(req.params.id))
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    data.products[index] = { ...data.products[index], ...req.body, id: parseInt(req.params.id) }
    await saveProducts(data)
    res.json({ success: true, product: data.products[index] })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product' })
  }
})

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const data = await loadProducts()
    const index = data.products.findIndex(p => p.id === parseInt(req.params.id))
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    data.products.splice(index, 1)
    await saveProducts(data)
    res.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' })
  }
})

export default router