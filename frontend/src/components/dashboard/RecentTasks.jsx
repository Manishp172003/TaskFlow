import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Code2,
  Layout,
  Server,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { formatDate, getInitials } from '../../utils/helpers';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';

export default function RecentTasks({
  tasks = [],
  users = [],
  onViewDetails,
  viewAllLink = '/admin/tasks',
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const totalTasks = tasks.length || 24;
  const totalPages = Math.ceil(totalTasks / pageSize) || 6;

  const getUser = (userId) => users.find((u) => u.id === userId);

  // Default mock items for display if tasks are empty
  const displayTasks = tasks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getTaskIcon = (index, title = '') => {
    const t = title.toLowerCase();
    if (t.includes('auth') || t.includes('jwt')) return Code2;
    if (t.includes('login') || t.includes('design') || t.includes('ui')) return Layout;
    if (t.includes('api') || t.includes('endpoint')) return Server;
    return Database;
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || '').toUpperCase();
    if (p === 'HIGH') {
      return 'bg-rose-50 text-rose-600 border border-rose-100';
    }
    if (p === 'MEDIUM') {
      return 'bg-blue-50 text-blue-600 border border-blue-100';
    }
    return 'bg-slate-100 text-slate-600 border border-slate-200';
  };

  const getStatusPill = (status) => {
    if (status === TASK_STATUS.COMPLETED || status === 'Completed') {
      return {
        pill: 'bg-blue-50/80 text-blue-700',
        dot: 'bg-blue-600',
        text: 'Completed',
      };
    }
    if (status === TASK_STATUS.IN_PROGRESS || status === 'In Progress') {
      return {
        pill: 'bg-blue-50/80 text-blue-700',
        dot: 'bg-blue-600',
        text: 'In Progress',
      };
    }
    return {
      pill: 'bg-slate-100 text-slate-700',
      dot: 'bg-slate-400',
      text: 'Pending',
    };
  };

  return (
    <div className="space-y-3.5">
      {/* Table Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Tasks</h2>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
            Sprint 42
          </span>
        </div>

        <Link
          to={viewAllLink}
          className="text-xs font-semibold text-[#2563EB] hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Clean Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6 font-bold">TASK</th>
                <th className="py-3.5 px-6 font-bold">ASSIGNED TO</th>
                <th className="py-3.5 px-6 font-bold">PRIORITY</th>
                <th className="py-3.5 px-6 font-bold">DUE DATE</th>
                <th className="py-3.5 px-6 font-bold">STATUS</th>
                <th className="py-3.5 px-6 font-bold text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {displayTasks.map((task, idx) => {
                const assignee = getUser(task.assignedToId);
                const IconComponent = getTaskIcon(idx, task.title);
                const statusInfo = getStatusPill(task.status);
                const initials = getInitials(assignee?.name || 'Admin');

                return (
                  <tr
                    key={task.id}
                    onClick={() => onViewDetails && onViewDetails(task)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Task Title & Subtitle */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 group-hover:text-primary transition-colors block leading-snug">
                            {task.title}
                          </span>
                          <span className="text-xs text-slate-400 block mt-0.5 truncate max-w-xs sm:max-w-sm">
                            {task.description || 'System task specification'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Assigned To */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {assignee?.avatar ? (
                          <img
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-[10px]">
                            {initials}
                          </div>
                        )}
                        <span className="text-xs font-semibold text-slate-700">
                          {assignee?.name || 'Admin'}
                        </span>
                      </div>
                    </td>

                    {/* Priority Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getPriorityBadge(
                          task.priority
                        )}`}
                      >
                        {task.priority || 'MEDIUM'}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500 font-medium">
                      {formatDate(task.dueDate)}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.pill}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                        {statusInfo.text}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewDetails) onViewDetails(task);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Task details"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{displayTasks.length}</strong> of{' '}
            <strong className="text-slate-800">{totalTasks}</strong> tasks
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 disabled:opacity-40 disabled:hover:text-slate-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 disabled:opacity-40 disabled:hover:text-slate-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
