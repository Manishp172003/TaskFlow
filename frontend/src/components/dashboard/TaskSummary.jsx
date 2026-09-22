import React from 'react';
import { TASK_STATUS } from '../../utils/constants';

export default function TaskSummary({ stats }) {
  const { total = 0, pending = 0, inProgress = 0, completed = 0, cancelled = 0, completionRate = 0 } = stats || {};

  const items = [
    {
      label: TASK_STATUS.COMPLETED,
      count: completed,
      pct: total > 0 ? Math.round((completed / total) * 100) : 0,
      barColor: 'bg-emerald-500',
      badgeColor: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: TASK_STATUS.IN_PROGRESS,
      count: inProgress,
      pct: total > 0 ? Math.round((inProgress / total) * 100) : 0,
      barColor: 'bg-blue-500',
      badgeColor: 'bg-blue-50 text-blue-700',
    },
    {
      label: TASK_STATUS.PENDING,
      count: pending,
      pct: total > 0 ? Math.round((pending / total) * 100) : 0,
      barColor: 'bg-amber-500',
      badgeColor: 'bg-amber-50 text-amber-700',
    },
    {
      label: TASK_STATUS.CANCELLED,
      count: cancelled,
      pct: total > 0 ? Math.round((cancelled / total) * 100) : 0,
      barColor: 'bg-slate-400',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-borderSubtle p-6 shadow-card h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-textPrimary">Task Status Summary</h3>
            <p className="text-xs text-textSecondary mt-0.5">Distribution across all ongoing workflows</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-primary border border-blue-100">
            {completionRate}% Completed
          </span>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex my-4">
          <div
            style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
            className="bg-emerald-500 h-full transition-all duration-300"
            title={`Completed: ${completed}`}
          />
          <div
            style={{ width: `${total > 0 ? (inProgress / total) * 100 : 0}%` }}
            className="bg-blue-500 h-full transition-all duration-300"
            title={`In Progress: ${inProgress}`}
          />
          <div
            style={{ width: `${total > 0 ? (pending / total) * 100 : 0}%` }}
            className="bg-amber-500 h-full transition-all duration-300"
            title={`Pending: ${pending}`}
          />
          <div
            style={{ width: `${total > 0 ? (cancelled / total) * 100 : 0}%` }}
            className="bg-slate-400 h-full transition-all duration-300"
            title={`Cancelled: ${cancelled}`}
          />
        </div>

        {/* Breakdown List */}
        <div className="space-y-3 mt-6">
          {items.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-textPrimary">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-textPrimary">{item.count}</span>
                  <span className="text-textSecondary">({item.pct}%)</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.barColor} transition-all duration-300`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-borderSubtle flex items-center justify-between text-xs text-textSecondary">
        <span>Total Tracked Tasks</span>
        <span className="font-bold text-textPrimary text-sm">{total}</span>
      </div>
    </div>
  );
}
