import { Router } from 'express'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const router = Router()

// Tap Payments API keys are loaded from environment variables
// TODO: Set these in your .env file or hosting platform dashboard
// TAP_API_KEY=tap_YOUR_LIVE_API_KEY
// TAP_SECRET_KEY=sk_YOUR_LIVE_SECRET_KEY

// POST /api/payment/create - Create a Tap payment intent
router.post('/create', async (req, res) => {
  try {
    const { items, total, currency, customer, shipping } = req.body

    // TODO: Implement actual Tap Payments API integration
    // Tap API endpoint: https://api.tap.company/v2/charges
    //
    // const tapResponse = await axios.post(
    //   'https://api.tap.company/v2/charges',
    //   {
    //     amount: total,
    //     currency: currency || 'JOD',
    //     customer: {
    //       first_name: customer.name.split(' ')[0],
    //       last_name: customer.name.split(' ').slice(1).join(' '),
    //       email: customer.email,
    //       phone: { country_code: '962', number: customer.phone.replace(/[^0-9]/g, '') },
    //     },
    //     source: { id: 'src_all' }, // Tap's hosted payment page
    //     redirect: { url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/checkout` },
    //     reference: { transaction: `order_${Date.now()}` },
    //     metadata: { items: JSON.stringify(items) },
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // )
    //
    // res.json({
    //   success: true,
    //   paymentUrl: tapResponse.data.transaction.url,
    //   transactionId: tapResponse.data.id,
    // })

    // For testing - return mock success
    console.log('Payment order received:', { items, total, currency, customer, shipping })
    res.json({
      success: true,
      message: 'Payment intent created (TEST MODE)',
      paymentUrl: null, // In production, this would be Tap's hosted payment page URL
      transactionId: `test_${Date.now()}`,
    })
  } catch (error) {
    console.error('Payment creation error:', error.response?.data || error.message)
    res.status(500).json({
      success: false,
      message: 'Failed to create payment',
      error: error.response?.data || error.message,
    })
  }
})

// POST /api/payment/webhook - Tap payment webhook
// TODO: Register this URL in Tap dashboard: https://api.tap.company/v2/charges/webhook
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body

    // TODO: Verify webhook signature
    // Tap sends a signature in the header: x-tap-signature
    // Verify using your webhook secret key

    console.log('Payment webhook received:', event)

    // Handle different event types
    switch (event.type) {
      case 'CHARGE_CAPTURED':
        // Payment successful - fulfill order
        console.log('Payment captured:', event.id)
        // TODO: Send order confirmation email
        break
      case 'CHARGE_FAILED':
        // Payment failed
        console.log('Payment failed:', event.id)
        break
      default:
        console.log('Unhandled event type:', event.type)
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error.message)
    res.status(500).json({ success: false, message: 'Webhook processing failed' })
  }
})

export default router