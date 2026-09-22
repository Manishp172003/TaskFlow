import React from 'react';
import { MoreHorizontal } from 'lucide-react';

export default function TaskStatusDonutChart({ stats }) {
  const total = stats?.total || 24;
  const completed = stats?.completed || 12;
  const inProgress = stats?.inProgress || 7;
  const pending = stats?.pending || 5;
  const overdue = 0;

  const pctCompleted = total > 0 ? Math.round((completed / total) * 100) : 50;
  const pctInProgress = total > 0 ? Math.round((inProgress / total) * 100) : 29;
  const pctPending = total > 0 ? Math.round((pending / total) * 100) : 21;
  const pctOverdue = 0;

  // SVG Donut calculation: Circumference = 2 * PI * r = 2 * 3.14159 * 42 ~= 263.89
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const strokeCompleted = (pctCompleted / 100) * circumference;
  const strokeInProgress = (pctInProgress / 100) * circumference;
  const strokePending = (pctPending / 100) * circumference;

  const offsetCompleted = 0;
  const offsetInProgress = -strokeCompleted;
  const offsetPending = -(strokeCompleted + strokeInProgress);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Task Status</h3>
          <p className="text-xs text-slate-500 mt-0.5">Breakdown by lifecycle state</p>
        </div>
        <button
          type="button"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          title="More options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Donut Chart Visual */}
      <div className="relative flex items-center justify-center py-5">
        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
          {/* Base circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth="11"
          />

          {/* Pending segment */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#E2E8F0"
            strokeWidth="11"
            strokeDasharray={`${strokePending} ${circumference - strokePending}`}
            strokeDashoffset={offsetPending}
            className="transition-all duration-700 ease-out"
          />

          {/* In Progress segment */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#38BDF8"
            strokeWidth="11"
            strokeDasharray={`${strokeInProgress} ${circumference - strokeInProgress}`}
            strokeDashoffset={offsetInProgress}
            className="transition-all duration-700 ease-out"
          />

          {/* Completed segment */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#2563EB"
            strokeWidth="11"
            strokeDasharray={`${strokeCompleted} ${circumference - strokeCompleted}`}
            strokeDashoffset={offsetCompleted}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span className="text-2xl font-black text-slate-900 leading-none">
            {total}
          </span>
          <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase mt-1">
            TOTAL TASKS
          </span>
        </div>
      </div>

      {/* 2x2 Legend Grid */}
      <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span className="text-slate-600 text-[11px] font-medium">Completed</span>
          </div>
          <span className="font-bold text-slate-800 text-[11px] font-mono">
            {completed} ({pctCompleted}%)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            <span className="text-slate-600 text-[11px] font-medium">In Progress</span>
          </div>
          <span className="font-bold text-slate-800 text-[11px] font-mono">
            {inProgress} ({pctInProgress}%)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
            <span className="text-slate-600 text-[11px] font-medium">Pending</span>
          </div>
          <span className="font-bold text-slate-800 text-[11px] font-mono">
            {pending} ({pctPending}%)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            <span className="text-slate-600 text-[11px] font-medium">Overdue</span>
          </div>
          <span className="font-bold text-slate-800 text-[11px] font-mono">
            {overdue} ({pctOverdue}%)
          </span>
        </div>
      </div>
    </div>
  );
}
