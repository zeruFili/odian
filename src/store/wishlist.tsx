import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { products, type Product } from '../data/products'

interface WishlistContextValue {
  wishlistIds: string[]
  wishlistProducts: Product[]
  count: number
  isWishlisted: (id: string) => boolean
  toggleWishlist: (id: string) => void
  removeFromWishlist: (id: string) => void
  isOpen: boolean
  openWishlist: () => void
  closeWishlist: () => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

const STORAGE_KEY = 'odilia_wishlist_ids'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds))
    } catch {
      // ignore
    }
  }, [wishlistIds])

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const removeFromWishlist = (id: string) => {
    setWishlistIds((prev) => prev.filter((item) => item !== id))
  }

  const isWishlisted = (id: string) => wishlistIds.includes(id)

  const wishlistProducts = useMemo(() => {
    return wishlistIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p))
  }, [wishlistIds])

  const value = useMemo(
    () => ({
      wishlistIds,
      wishlistProducts,
      count: wishlistIds.length,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      isOpen,
      openWishlist: () => setIsOpen(true),
      closeWishlist: () => setIsOpen(false),
    }),
    [wishlistIds, wishlistProducts, isOpen],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
