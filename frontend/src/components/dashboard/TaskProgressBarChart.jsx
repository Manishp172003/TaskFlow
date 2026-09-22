import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function TaskProgressBarChart({ stats }) {
  const [range, setRange] = useState('This Month');
  const [rangeOpen, setRangeOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);

  const ranges = ['This Month', 'This Sprint', 'Last 30 Days'];

  // 6 Days (Mon - Sat) velocity data matching reference image
  const daysData = [
    { day: 'Mon', completed: 8, inProgress: 14, pending: 6 },
    { day: 'Tue', completed: 12, inProgress: 18, pending: 5 },
    { day: 'Wed', completed: 11, inProgress: 22, pending: 8 },
    { day: 'Thu', completed: 14, inProgress: 21, pending: 7 },
    { day: 'Fri', completed: 12, inProgress: 24, pending: 6 },
    { day: 'Sat', completed: 3, inProgress: 6, pending: 2 },
  ];

  const maxVal = 26; // max scale height

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Task Progress</h3>
          <p className="text-xs text-slate-500 mt-0.5">Weekly completion velocity across engineering squads</p>
        </div>

        {/* Range Dropdown Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRangeOpen(!rangeOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/80 bg-slate-50/60 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="text-slate-400 font-normal uppercase text-[10px] tracking-wider">RANGE:</span>
            <span>{range}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {rangeOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setRangeOpen(false)} />
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-20 text-xs">
                {ranges.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRange(r);
                      setRangeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium ${
                      r === range ? 'text-primary font-bold' : 'text-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-700 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />
          <span>Completed ({stats?.completed || 12})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
          <span>In Progress ({stats?.inProgress || 7})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DBEAFE]" />
          <span>Pending ({stats?.pending || 5})</span>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="relative pt-4 pb-2">
        {/* Soft horizontal guide lines */}
        <div className="absolute inset-x-0 top-4 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-slate-200 w-full" />
          <div className="border-b border-dashed border-slate-200 w-full" />
          <div className="border-b border-dashed border-slate-200 w-full" />
        </div>

        {/* Grouped Bars Grid */}
        <div className="grid grid-cols-6 gap-2 sm:gap-6 items-end h-48 relative z-0">
          {daysData.map((d, index) => {
            const hPending = (d.pending / maxVal) * 100;
            const hInProgress = (d.inProgress / maxVal) * 100;
            const hCompleted = (d.completed / maxVal) * 100;

            return (
              <div
                key={d.day}
                className="flex flex-col items-center h-full justify-end group"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* 3 Grouped Vertical Bars */}
                <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full pb-2">
                  {/* Pending Bar */}
                  <div
                    style={{ height: `${hPending}%` }}
                    className="w-2 sm:w-3 bg-[#DBEAFE] hover:bg-blue-200 rounded-t-sm transition-all duration-300 relative group/bar cursor-pointer"
                    title={`${d.day} Pending: ${d.pending}`}
                  />
                  {/* In Progress Bar */}
                  <div
                    style={{ height: `${hInProgress}%` }}
                    className="w-2.5 sm:w-3.5 bg-[#2563EB] hover:bg-blue-600 rounded-t-sm transition-all duration-300 relative group/bar cursor-pointer"
                    title={`${d.day} In Progress: ${d.inProgress}`}
                  />
                  {/* Completed Bar */}
                  <div
                    style={{ height: `${hCompleted}%` }}
                    className="w-2 sm:w-3 bg-[#1D4ED8] hover:bg-blue-800 rounded-t-sm transition-all duration-300 relative group/bar cursor-pointer"
                    title={`${d.day} Completed: ${d.completed}`}
                  />
                </div>

                {/* Day Label */}
                <span className="text-[11px] font-medium text-slate-500 mt-1 transition-colors group-hover:text-primary group-hover:font-semibold">
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
