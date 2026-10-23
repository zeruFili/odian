import { useToast } from '../store/toast'
import { CloseIcon } from './Icons'

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-item">
          {toast.image && (
            <img src={toast.image} alt="" className="toast-thumb" aria-hidden="true" />
          )}
          <div className="toast-content">
            <div className="toast-title">{toast.title}</div>
            <div className="toast-message">{toast.message}</div>
          </div>
          {toast.actionLabel && toast.onAction && (
            <button
              className="toast-action"
              onClick={() => {
                toast.onAction?.()
                removeToast(toast.id)
              }}
            >
              {toast.actionLabel}
            </button>
          )}
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <CloseIcon size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
