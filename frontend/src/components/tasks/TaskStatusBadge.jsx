import React from 'react';
import { TASK_STATUS, STATUS_COLORS } from '../../utils/constants';
import { cn } from '../../utils/helpers';

export default function TaskStatusBadge({ status, className = '' }) {
  const currentStatus = status || TASK_STATUS.PENDING;
  const config = STATUS_COLORS[currentStatus] || STATUS_COLORS[TASK_STATUS.PENDING];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dot)} />
      <span>{currentStatus}</span>
    </span>
  );
}
