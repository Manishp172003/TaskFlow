import React from 'react';
import { TASK_STATUS, PRIORITY_COLORS } from '../../utils/constants';
import { formatDate, isOverdue, getInitials, cn } from '../../utils/helpers';
import { Calendar, MessageSquare, ArrowRight, CheckCircle2, Play, Check } from 'lucide-react';

export default function TaskKanban({
  tasks = [],
  users = [],
  onStatusChange,
  onViewDetails,
  isAdmin = false,
}) {
  const getUser = (userId) => users.find((u) => u.id === userId);

  const columns = [
    {
      status: TASK_STATUS.PENDING,
      title: 'Pending',
      headerBg: 'bg-amber-500/10 text-amber-800 border-amber-200',
      dotColor: 'bg-amber-500',
      countColor: 'bg-amber-100 text-amber-800',
      nextStatus: TASK_STATUS.IN_PROGRESS,
      nextLabel: 'Start',
      nextIcon: Play,
    },
    {
      status: TASK_STATUS.IN_PROGRESS,
      title: 'In Progress',
      headerBg: 'bg-blue-500/10 text-blue-800 border-blue-200',
      dotColor: 'bg-blue-500',
      countColor: 'bg-blue-100 text-blue-800',
      nextStatus: TASK_STATUS.COMPLETED,
      nextLabel: 'Complete',
      nextIcon: Check,
    },
    {
      status: TASK_STATUS.COMPLETED,
      title: 'Completed',
      headerBg: 'bg-emerald-500/10 text-emerald-800 border-emerald-200',
      dotColor: 'bg-emerald-500',
      countColor: 'bg-emerald-100 text-emerald-800',
      nextStatus: null,
      nextLabel: null,
    },
    {
      status: TASK_STATUS.CANCELLED,
      title: 'Cancelled',
      headerBg: 'bg-slate-200 text-slate-700 border-slate-300',
      dotColor: 'bg-slate-400',
      countColor: 'bg-slate-300 text-slate-800',
      nextStatus: TASK_STATUS.PENDING,
      nextLabel: 'Reopen',
      nextIcon: Play,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);
        const NextIcon = col.nextIcon;

        return (
          <div
            key={col.status}
            className="rounded-2xl border border-borderSubtle bg-slate-50/50 p-3.5 flex flex-col min-h-[480px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-borderSubtle mb-3">
              <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full', col.dotColor)} />
                <h4 className="text-xs font-bold uppercase tracking-wider text-textPrimary">
                  {col.title}
                </h4>
              </div>
              <span
                className={cn(
                  'text-xs font-semibold px-2 py-0.5 rounded-full',
                  col.countColor
                )}
              >
                {columnTasks.length}
              </span>
            </div>

            {/* Column Card Stack */}
            <div className="space-y-3 flex-1">
              {columnTasks.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-borderSubtle rounded-xl flex items-center justify-center text-xs text-textSecondary italic">
                  No {col.title.toLowerCase()} tasks
                </div>
              ) : (
                columnTasks.map((task) => {
                  const assignee = getUser(task.assignedToId);
                  const priorityConfig = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium;
                  const overdue = isOverdue(task.dueDate, task.status);

                  return (
                    <div
                      key={task.id}
                      className="bg-card rounded-xl border border-borderSubtle p-4 shadow-card hover:shadow-md hover:border-slate-300 transition-all card-hover group"
                    >
                      {/* ID and Priority */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono font-semibold text-textSecondary">
                          {task.id}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                            priorityConfig.bg,
                            priorityConfig.text,
                            priorityConfig.border
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {/* Title */}
                      <h5
                        onClick={() => onViewDetails && onViewDetails(task)}
                        className="text-sm font-semibold text-textPrimary leading-snug cursor-pointer hover:text-primary transition-colors mb-1.5"
                      >
                        {task.title}
                      </h5>

                      {/* Description preview */}
                      {task.description && (
                        <p className="text-xs text-textSecondary line-clamp-2 mb-3 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Due Date & Assignee */}
                      <div className="pt-2.5 border-t border-borderSubtle flex items-center justify-between text-xs text-textSecondary">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span className={cn(overdue ? 'text-status-danger font-semibold' : '')}>
                            {formatDate(task.dueDate)}
                          </span>
                        </div>

                        {assignee && (
                          <div className="flex items-center gap-1.5" title={assignee.name}>
                            {assignee.avatar ? (
                              <img
                                src={assignee.avatar}
                                alt={assignee.name}
                                className="w-5 h-5 rounded-full object-cover border border-white"
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[9px]">
                                {getInitials(assignee.name)}
                              </div>
                            )}
                            <span className="text-[11px] font-medium text-textPrimary truncate max-w-[80px]">
                              {assignee.name.split(' ')[0]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Footer: Quick status advancement action */}
                      <div className="mt-2.5 pt-2 border-t border-dashed border-borderSubtle flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[11px] text-textSecondary">
                          <MessageSquare className="w-3 h-3" />
                          <span>{task.comments?.length || 0}</span>
                        </div>

                        {col.nextStatus && onStatusChange && (
                          <button
                            type="button"
                            onClick={() => onStatusChange(task.id, col.nextStatus)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-hover hover:underline transition-colors"
                          >
                            <span>{col.nextLabel}</span>
                            {NextIcon && <NextIcon className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
