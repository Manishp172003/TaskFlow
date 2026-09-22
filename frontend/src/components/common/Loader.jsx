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
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizes[size] || sizes.md)} />
      {text && <p className="text-sm font-medium text-textSecondary">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-page/80 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return <div className="py-12 flex justify-center items-center w-full">{content}</div>;
}
