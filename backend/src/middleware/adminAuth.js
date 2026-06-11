import dotenv from 'dotenv'
dotenv.config()

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

// Simple token-based auth stored in-memory (use sessions/JWT for production)
let adminToken = null

export function adminLogin(req, res) {
  const { password } = req.body
  if (password === ADMIN_PASSWORD) {
    // Generate a simple token
    adminToken = Math.random().toString(36).substring(2) + Date.now().toString(36)
    res.json({ success: true, token: adminToken })
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' })
  }
}

export function adminVerify(req, res) {
  const token = req.headers['x-admin-token']
  if (token === adminToken) {
    res.json({ success: true, authenticated: true })
  } else {
    res.status(401).json({ success: false, authenticated: false })
  }
}

export function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token']
  if (token === adminToken) {
    next()
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' })
  }
}