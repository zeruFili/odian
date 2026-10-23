import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Currency, Product } from '../data/products'
import { formatPrice as formatPriceUtil } from '../data/products'

interface CurrencyContextValue {
  currency: Currency
  setCurrency: (currency: Currency) => void
  toggleCurrency: () => void
  format: (product: Product, value?: number) => string
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

  const format = (product: Product, value?: number) => {
    return formatPriceUtil(product, value, currency)
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
