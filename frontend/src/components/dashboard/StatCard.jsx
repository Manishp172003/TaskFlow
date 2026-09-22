import React from 'react';
import { cn } from '../../utils/helpers';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'blue',
  trend,
  className = '',
}) {
  const variantStyles = {
    blue: {
      iconBg: 'bg-blue-50 text-primary',
      borderAccent: 'hover:border-blue-200',
    },
    amber: {
      iconBg: 'bg-amber-50 text-status-warning',
      borderAccent: 'hover:border-amber-200',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-status-success',
      borderAccent: 'hover:border-emerald-200',
    },
    slate: {
      iconBg: 'bg-slate-100 text-slate-700',
      borderAccent: 'hover:border-slate-300',
    },
  };

  const style = variantStyles[variant] || variantStyles.blue;

  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-borderSubtle p-5 shadow-card transition-all',
        style.borderAccent,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-textSecondary">{title}</span>
        {Icon && (
          <div className={cn('p-2.5 rounded-lg flex items-center justify-center shrink-0', style.iconBg)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-textPrimary">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-medium text-status-success flex items-center">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-textSecondary">{subtitle}</p>
      )}
    </div>
  );
}
