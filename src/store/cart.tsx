import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import { priceInUsd, products, type Product } from '../data/products'

export interface CartLine {
  product: Product
  quantity: number
}

interface CartState {
  lines: CartLine[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD'; productId: string; quantity?: number }
  | { type: 'REMOVE'; productId: string }
  | { type: 'SET_QTY'; productId: string; quantity: number }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }

const initialState: CartState = { lines: [], isOpen: false }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const product = products.find((p) => p.id === action.productId)
      if (!product) return state
      const existing = state.lines.find((l) => l.product.id === product.id)
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.product.id === product.id
              ? { ...l, quantity: l.quantity + (action.quantity ?? 1) }
              : l,
          ),
          isOpen: true,
        }
      }
      return {
        ...state,
        lines: [...state.lines, { product, quantity: action.quantity ?? 1 }],
        isOpen: true,
      }
    }
    case 'REMOVE':
      return {
        ...state,
        lines: state.lines.filter((l) => l.product.id !== action.productId),
      }
    case 'SET_QTY':
      if (action.quantity <= 0) {
        return {
          ...state,
          lines: state.lines.filter((l) => l.product.id !== action.productId),
        }
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.product.id === action.productId ? { ...l, quantity: action.quantity } : l,
        ),
      }
    case 'OPEN':
      return { ...state, isOpen: true }
    case 'CLOSE':
      return { ...state, isOpen: false }
    default:
      return state
  }
}

interface CartContextValue {
  lines: CartLine[]
  isOpen: boolean
  count: number
  subtotal: number
  addToCart: (productId: string, quantity?: number) => void
  removeFromCart: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((sum, l) => sum + l.quantity, 0)
    const subtotal = state.lines.reduce((sum, l) => sum + priceInUsd(l.product) * l.quantity, 0)
    return {
      lines: state.lines,
      isOpen: state.isOpen,
      count,
      subtotal,
      addToCart: (productId, quantity) => dispatch({ type: 'ADD', productId, quantity }),
      removeFromCart: (productId) => dispatch({ type: 'REMOVE', productId }),
      setQuantity: (productId, quantity) => dispatch({ type: 'SET_QTY', productId, quantity }),
      openCart: () => dispatch({ type: 'OPEN' }),
      closeCart: () => dispatch({ type: 'CLOSE' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
