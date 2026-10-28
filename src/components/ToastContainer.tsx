import React from "react";
import { useToast } from "../store/toast";
import Icon, { CloseIcon, CheckIcon } from "./Icons";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#123d32] text-white rounded-2xl p-3.5 shadow-2xl border border-emerald-800/60 flex items-center gap-3 animate-scale-up"
        >
          {toast.image ? (
            <img
              src={toast.image}
              alt=""
              className="w-10 h-10 rounded-xl object-cover bg-gray-100 shrink-0 border border-emerald-700/50"
              aria-hidden="true"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 font-bold">
              <CheckIcon size={16} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <strong className="text-xs font-bold text-white block truncate font-display">
              {toast.title}
            </strong>
            <p className="text-[11px] text-emerald-200/80 truncate">
              {toast.message}
            </p>
          </div>

          {toast.actionLabel && toast.onAction && (
            <button
              onClick={() => {
                toast.onAction?.();
                removeToast(toast.id);
              }}
              className="px-2.5 py-1 bg-amber-400 text-emerald-950 rounded-lg text-[10px] font-black uppercase hover:bg-amber-300 transition-colors shrink-0"
            >
              {toast.actionLabel}
            </button>
          )}

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-emerald-300/60 hover:text-white transition-colors"
            aria-label="Dismiss notification"
          >
            <CloseIcon size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
