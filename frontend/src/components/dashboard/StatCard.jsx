import React from 'react';
import { cn } from '../../utils/helpers';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'blue',
  trendText,
  trendType = 'positive', // 'positive' | 'neutral' | 'blue'
  className = '',
}) {
  const accentBars = {
    blue: 'bg-[#2563EB]',
    amber: 'bg-slate-400',
    emerald: 'bg-[#2563EB]',
    slate: 'bg-slate-300',
  };

  const trendStyles = {
    positive: 'text-blue-600 font-bold',
    neutral: 'text-slate-500 font-medium',
    blue: 'text-blue-600 font-bold',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden flex flex-col justify-between group',
        className
      )}
    >
      {/* Top row: Title + Light Blue Icon Badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 tracking-normal">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="my-2">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </span>
      </div>

      {/* Bottom row: Subtitle + Trend */}
      <div className="flex items-center justify-between text-xs pt-1">
        {subtitle && (
          <span className="text-[11px] text-slate-400 font-medium truncate max-w-[130px]">
            {subtitle}
          </span>
        )}
        {trendText && (
          <span className={cn('text-[11px] tracking-tight ml-auto', trendStyles[trendType] || trendStyles.positive)}>
            {trendText}
          </span>
        )}
      </div>

      {/* Bottom Accent Bar */}
      <div
        className={cn(
          'absolute bottom-0 left-6 right-6 h-[2.5px] rounded-full opacity-90',
          accentBars[variant] || 'bg-[#2563EB]'
        )}
      />
    </div>
  );
}
