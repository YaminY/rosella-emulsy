import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import productsRouter from './routes/products.js'
import paymentRouter from './routes/payment.js'
import { adminLogin, adminVerify } from './middleware/adminAuth.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Serve built frontend as static files
const frontendDistPath = join(__dirname, '..', '..', 'frontend', 'dist')
const hasFrontendDist = existsSync(frontendDistPath)

if (hasFrontendDist) {
  app.use(express.static(frontendDistPath))
}

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://rosellaemulsy.com',
  'https://www.rosellaemulsy.com',
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(express.json())

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`)
  next()
})

// API Routes (must come before the catch-all for SPA)
app.use('/api/products', productsRouter)
app.use('/api/payment', paymentRouter)

// Admin auth routes
app.post('/api/admin/login', adminLogin)
app.get('/api/admin/verify', adminVerify)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// When the frontend build is bundled with the backend, serve the SPA.
// Otherwise return a simple backend status response for the service root.
app.get('*', (req, res) => {
  if (hasFrontendDist) {
    return res.sendFile(join(frontendDistPath, 'index.html'))
  }

  res.status(404).json({
    success: false,
    message: 'API service only',
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════════╗`)
  console.log(`║        🚀 Rosella Emulsy is RUNNING        ║`)
  console.log(`╠══════════════════════════════════════════════╣`)
  console.log(`║  🌐 Open in your browser:                   ║`)
  console.log(`║  →  http://localhost:${PORT}                  ║`)
  console.log(`║                                              ║`)
  console.log(`║  🔧 Admin Panel:                            ║`)
  console.log(`║  →  http://localhost:${PORT}/admin            ║`)
  console.log(`║  →  Password: admin123                      ║`)
  console.log(`║                                              ║`)
  console.log(`║  📋 API:                                    ║`)
  console.log(`║  →  http://localhost:${PORT}/api/health      ║`)
  console.log(`╚══════════════════════════════════════════════╝\n`)
})
