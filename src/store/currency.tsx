import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Currency, Product } from '../data/products'
import { formatPrice as formatPriceUtil, ETB_PER_USD } from '../data/products'

interface CurrencyContextValue {
  currency: Currency
  setCurrency: (currency: Currency) => void
  toggleCurrency: () => void
  format: (productOrAmount: Product | number, value?: number) => string
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

const CURRENCY_KEY = 'odilia_currency_pref'

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_KEY)
      return saved === 'ETB' || saved === 'USD' ? saved : 'USD'
    } catch {
      return 'USD'
    }
  })

  const setCurrency = (c: Currency) => {
    setCurrencyState(c)
    try {
      localStorage.setItem(CURRENCY_KEY, c)
    } catch {
      // ignore
    }
  }

  const toggleCurrency = () => {
    setCurrency(currency === 'USD' ? 'ETB' : 'USD')
  }

  const format = (productOrAmount: Product | number, value?: number): string => {
    if (typeof productOrAmount === 'number') {
      if (currency === 'ETB') {
        const etb = Math.round(productOrAmount * ETB_PER_USD)
        return `ETB ${etb.toLocaleString('en-US')}`
      }
      return `$${productOrAmount.toFixed(2)}`
    }
    return formatPriceUtil(productOrAmount, value, currency)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
