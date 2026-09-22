import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const Input = forwardRef(function Input(
  {
    label,
    name,
    type = 'text',
    error,
    helperText,
    icon: Icon,
    className = '',
    required = false,
    ...props
  },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-textPrimary mb-1.5"
        >
          {label}
          {required && <span className="text-status-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textSecondary">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          className={cn(
            'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-textPrimary placeholder:text-slate-400',
            'transition-colors duration-150 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            Icon ? 'pl-9' : 'pl-3',
            error
              ? 'border-status-danger focus:ring-status-danger'
              : 'border-borderSubtle hover:border-slate-300',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-status-danger">{error}</p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-xs text-textSecondary">{helperText}</p>
      )}
    </div>
  );
});

export default Input;
