import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Select = forwardRef(function Select(
  {
    label,
    name,
    options = [],
    placeholder = 'Select an option',
    error,
    helperText,
    required = false,
    className = '',
    value,
    onChange,
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
        <select
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={cn(
            'block w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-9 text-sm text-textPrimary',
            'transition-colors duration-150 ease-in-out cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            error
              ? 'border-status-danger focus:ring-status-danger'
              : 'border-borderSubtle hover:border-slate-300',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => {
            const optVal = typeof option === 'object' ? option.value : option;
            const optLabel = typeof option === 'object' ? option.label : option;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-textSecondary">
          <ChevronDown className="w-4 h-4" />
        </div>
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

export default Select;
