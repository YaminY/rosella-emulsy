import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Approximate exchange rates (can be updated periodically)
const EXCHANGE_RATES = {
  JOD: { symbol: 'JOD', rate: 1, decimals: 2 },
  USD: { symbol: '$', rate: 1.41, decimals: 2 },
  EUR: { symbol: '€', rate: 1.30, decimals: 2 },
  GBP: { symbol: '£', rate: 1.11, decimals: 2 },
  AED: { symbol: 'د.إ', rate: 5.18, decimals: 2 },
  SAR: { symbol: '﷼', rate: 5.29, decimals: 2 },
}

const DISPLAY_CURRENCIES = ['USD', 'EUR', 'GBP']

export function useCurrency() {
  function formatJOD(amount) {
    return `${amount.toFixed(2)} JOD`
  }

  function getApproximate(amount, targetCurrency) {
    const rate = EXCHANGE_RATES[targetCurrency]
    if (!rate) return null
    const converted = amount * rate.rate
    return `${rate.symbol}${converted.toFixed(rate.decimals)}`
  }

  function getAllApproximates(amount) {
    return DISPLAY_CURRENCIES.map(curr => ({
      currency: curr,
      display: getApproximate(amount, curr),
    }))
  }

  return {
    formatJOD,
    getApproximate,
    getAllApproximates,
    EXCHANGE_RATES,
  }
}