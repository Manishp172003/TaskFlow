import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white focus:ring-primary/40 shadow-sm',
    secondary: 'bg-white border border-borderSubtle text-textPrimary hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-300 shadow-sm',
    danger: 'bg-status-danger hover:bg-red-700 text-white focus:ring-red-300 shadow-sm',
    dangerOutline: 'bg-white border border-red-200 text-status-danger hover:bg-red-50 focus:ring-red-200',
    ghost: 'text-textSecondary hover:text-textPrimary hover:bg-slate-100 focus:ring-slate-200',
    outline: 'border border-primary text-primary hover:bg-blue-50 focus:ring-primary/30',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant] || variants.primary, sizes[size] || sizes.md, className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
