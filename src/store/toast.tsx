import { createContext, useContext, useState, type ReactNode } from 'react'

export interface ToastItem {
  id: string
  title: string
  message: string
  image?: string
  actionLabel?: string
  onAction?: () => void
}

interface ToastContextValue {
  toasts: ToastItem[]
  showToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const showToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastItem = { ...toast, id }
    setToasts((prev) => [...prev.slice(-2), newToast])

    setTimeout(() => {
      removeToast(id)
    }, 4000)
  }

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
