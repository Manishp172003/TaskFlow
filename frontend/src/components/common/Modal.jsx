import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
  showClose = true,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal dialog wrapper */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div
          className={cn(
            'relative transform rounded-2xl bg-card text-left shadow-2xl transition-all',
            'w-full border border-borderSubtle my-auto flex flex-col',
            'max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] overflow-hidden',
            'animate-in fade-in zoom-in-95 duration-200',
            maxWidth
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Fixed at the top */}
          {(title || showClose) && (
            <div
              className={cn(
                'flex items-center justify-between border-b border-borderSubtle px-6 py-4 shrink-0 bg-card rounded-t-2xl z-10',
                !title && 'border-b-0 pb-0'
              )}
            >
              <div className="pr-4">
                {title && (
                  <h3 className="text-lg font-bold text-textPrimary leading-tight">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-1 text-xs sm:text-sm text-textSecondary leading-normal">
                    {description}
                  </p>
                )}
              </div>
              {showClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl p-1.5 text-textSecondary hover:bg-slate-100 hover:text-textPrimary transition-colors ml-auto shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Body - Scrollable if content exceeds viewport */}
          <div className="px-6 py-5 overflow-y-auto flex-1 overscroll-contain">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
