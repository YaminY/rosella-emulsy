const EXCHANGE_RATES = {
  JOD: { rate: 1, decimals: 2, locale: 'en-JO' },
  USD: { rate: 1.41, decimals: 2, locale: 'en-US' },
  EUR: { rate: 1.30, decimals: 2, locale: 'de-DE' },
  GBP: { rate: 1.11, decimals: 2, locale: 'en-GB' },
  AED: { rate: 5.18, decimals: 2, locale: 'ar-AE' },
  SAR: { rate: 5.29, decimals: 2, locale: 'ar-SA' },
}

const DISPLAY_CURRENCIES = ['USD', 'EUR', 'GBP']
const LOCALE_CURRENCIES = {
  ar: 'JOD',
  de: 'EUR',
  fr: 'EUR',
  en: 'USD',
  ja: 'USD',
  ko: 'USD',
  zh: 'USD',
}

export function useCurrency() {
  function resolveCurrency(locale) {
    const shortLocale = locale?.split('-')[0]
    return LOCALE_CURRENCIES[shortLocale] || 'USD'
  }

  function convertFromJOD(amount, targetCurrency) {
    const config = EXCHANGE_RATES[targetCurrency]
    if (!config) return amount
    return amount * config.rate
  }

  function formatCurrency(amount, currency) {
    const config = EXCHANGE_RATES[currency]
    if (!config) return `${amount.toFixed(2)} ${currency}`

    const convertedAmount = convertFromJOD(amount, currency)

    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(convertedAmount)
  }

  function getPrimaryPrice(amount, locale) {
    const currency = resolveCurrency(locale)

    return {
      currency,
      display: formatCurrency(amount, currency),
    }
  }

  function getBasePrice(amount) {
    return formatCurrency(amount, 'JOD')
  }

  function getSecondaryPrices(amount, locale) {
    const primaryCurrency = resolveCurrency(locale)
    const currencies = DISPLAY_CURRENCIES.filter(
      currency => currency !== primaryCurrency
    )

    return currencies.map(currency => ({
      currency,
      display: formatCurrency(amount, currency),
    }))
  }

  return {
    getPrimaryPrice,
    getBasePrice,
    getSecondaryPrices,
    EXCHANGE_RATES,
  }
}
