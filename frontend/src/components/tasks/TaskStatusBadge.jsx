import React from 'react';
import { TASK_STATUS, STATUS_COLORS } from '../../utils/constants';
import { cn } from '../../utils/helpers';

export default function TaskStatusBadge({ status, className = '', showPulse = true }) {
  const currentStatus = status || TASK_STATUS.PENDING;
  const config = STATUS_COLORS[currentStatus] || STATUS_COLORS[TASK_STATUS.PENDING];

  const isLive = currentStatus === TASK_STATUS.IN_PROGRESS;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {isLive && showPulse && (
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.dot)} />
        )}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', config.dot)} />
      </span>
      <span>{currentStatus}</span>
    </span>
  );
}
