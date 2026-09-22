import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { cn } from '../utils/helpers';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3200) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((msg) => showToast(msg, 'success'), [showToast]);
  const info = useCallback((msg) => showToast(msg, 'info'), [showToast]);
  const error = useCallback((msg) => showToast(msg, 'error'), [showToast]);
  const warning = useCallback((msg) => showToast(msg, 'warning'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, info, error, warning, removeToast }}>
      {children}

      {/* Floating Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const config = {
            success: {
              icon: CheckCircle2,
              bg: 'bg-white',
              border: 'border-emerald-200',
              iconColor: 'text-emerald-600',
              barColor: 'bg-emerald-500',
            },
            info: {
              icon: Info,
              bg: 'bg-white',
              border: 'border-blue-200',
              iconColor: 'text-primary',
              barColor: 'bg-primary',
            },
            warning: {
              icon: AlertTriangle,
              bg: 'bg-white',
              border: 'border-amber-200',
              iconColor: 'text-status-warning',
              barColor: 'bg-status-warning',
            },
            error: {
              icon: AlertCircle,
              bg: 'bg-white',
              border: 'border-rose-200',
              iconColor: 'text-status-danger',
              barColor: 'bg-status-danger',
            },
          }[toast.type] || {
            icon: Info,
            bg: 'bg-white',
            border: 'border-borderSubtle',
            iconColor: 'text-primary',
            barColor: 'bg-primary',
          };

          const Icon = config.icon;

          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto rounded-xl border p-3.5 shadow-premium flex items-start gap-3 transition-all transform animate-slide-in-right overflow-hidden relative',
                config.bg,
                config.border
              )}
            >
              {/* Left accent bar */}
              <div className={cn('absolute left-0 top-0 bottom-0 w-1', config.barColor)} />

              <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', config.iconColor)} />

              <div className="flex-1 text-xs font-medium text-textPrimary leading-relaxed">
                {toast.message}
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 text-slate-400 hover:text-textPrimary rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;
