import React from 'react';
import { cn } from '../../utils/helpers';
import { TrendingUp } from 'lucide-react';

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
      iconBg: 'bg-blue-50 text-primary border border-blue-100',
      topLine: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      accentGlow: 'hover:border-blue-300',
    },
    amber: {
      iconBg: 'bg-amber-50 text-status-warning border border-amber-100',
      topLine: 'bg-gradient-to-r from-amber-400 to-orange-500',
      accentGlow: 'hover:border-amber-300',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-status-success border border-emerald-100',
      topLine: 'bg-gradient-to-r from-emerald-400 to-teal-500',
      accentGlow: 'hover:border-emerald-300',
    },
    slate: {
      iconBg: 'bg-slate-100 text-slate-700 border border-slate-200',
      topLine: 'bg-gradient-to-r from-slate-400 to-slate-600',
      accentGlow: 'hover:border-slate-300',
    },
  };

  const style = variantStyles[variant] || variantStyles.blue;

  return (
    <div
      className={cn(
        'bg-card rounded-2xl border border-borderSubtle p-5 shadow-card hover:shadow-premium',
        'transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden group',
        style.accentGlow,
        className
      )}
    >
      {/* Top accent gradient indicator */}
      <div className={cn('absolute top-0 left-0 right-0 h-1 transition-opacity', style.topLine)} />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-textSecondary">
          {title}
        </span>
        {Icon && (
          <div className={cn('p-2.5 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105', style.iconBg)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-textPrimary">
          {value}
        </span>
        {trend && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-status-success bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-textSecondary font-medium">{subtitle}</p>
      )}
    </div>
  );
}
