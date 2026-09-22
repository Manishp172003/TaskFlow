import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function Loader({
  size = 'md',
  text = 'Loading...',
  fullPage = false,
  className = '',
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3.5 animate-fade-in-scale', className)}>
      <div className="relative flex items-center justify-center">
        <div className="absolute w-8 h-8 rounded-full bg-blue-500/15 blur-sm animate-pulse" />
        <Loader2 className={cn('animate-spin text-primary', sizes[size] || sizes.md)} />
      </div>
      {text && (
        <p className="text-xs sm:text-sm font-medium text-slate-500 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-page/80 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return <div className="py-14 flex justify-center items-center w-full">{content}</div>;
}

