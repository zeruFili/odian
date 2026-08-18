import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface MobileFiltersContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
}

const MobileFiltersContext = createContext<MobileFiltersContextValue | null>(null)

export function MobileFiltersProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const value = useMemo<MobileFiltersContextValue>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen],
  )

  return <MobileFiltersContext.Provider value={value}>{children}</MobileFiltersContext.Provider>
}

export function useMobileFilters() {
  const ctx = useContext(MobileFiltersContext)
  if (!ctx) throw new Error('useMobileFilters must be used within MobileFiltersProvider')
  return ctx
}
