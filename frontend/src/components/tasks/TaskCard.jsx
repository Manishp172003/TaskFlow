import React from 'react';
import { Calendar, MessageSquare, AlertCircle, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import TaskStatusBadge from './TaskStatusBadge';
import { PRIORITY_COLORS, TASK_STATUS } from '../../utils/constants';
import { formatDate, isOverdue, getInitials, cn } from '../../utils/helpers';

export default function TaskCard({
  task,
  assignee,
  onEdit,
  onDelete,
  onStatusChange,
  onViewDetails,
  showActions = true,
  isAdmin = false,
}) {
  const priorityConfig = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium;
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="bg-card rounded-xl border border-borderSubtle p-5 shadow-card hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        {/* Top bar: ID, Priority, Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-textSecondary">
              {task.id}
            </span>
            <span
              className={cn(
                'text-[11px] font-medium px-2 py-0.5 rounded-full border',
                priorityConfig.bg,
                priorityConfig.text,
                priorityConfig.border
              )}
            >
              {task.priority}
            </span>
          </div>
          <TaskStatusBadge status={task.status} />
        </div>

        {/* Title */}
        <h4
          onClick={() => onViewDetails && onViewDetails(task)}
          className={cn(
            'text-base font-semibold text-textPrimary leading-snug mb-2',
            onViewDetails ? 'cursor-pointer hover:text-primary transition-colors' : ''
          )}
        >
          {task.title}
        </h4>

        {/* Description */}
        <p className="text-sm text-textSecondary line-clamp-2 mb-4 leading-relaxed">
          {task.description || 'No description provided.'}
        </p>
      </div>

      <div>
        {/* Due Date & Assignee */}
        <div className="pt-3 border-t border-borderSubtle flex items-center justify-between text-xs text-textSecondary">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-textSecondary shrink-0" />
            <span className={cn(overdue ? 'text-status-danger font-medium' : '')}>
              {formatDate(task.dueDate)}
            </span>
            {overdue && (
              <span className="inline-flex items-center text-[10px] text-status-danger font-semibold bg-red-50 px-1.5 py-0.5 rounded">
                Overdue
              </span>
            )}
          </div>

          {assignee && (
            <div className="flex items-center gap-2" title={`Assigned to ${assignee.name}`}>
              {assignee.avatar ? (
                <img
                  src={assignee.avatar}
                  alt={assignee.name}
                  className="w-6 h-6 rounded-full object-cover border border-white shadow-xs"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                  {getInitials(assignee.name)}
                </div>
              )}
              <span className="text-xs text-textPrimary font-medium truncate max-w-[100px]">
                {assignee.name.split(' ')[0]}
              </span>
            </div>
          )}
        </div>

        {/* Bottom controls: Comments & Quick Actions */}
        <div className="mt-3 pt-3 border-t border-dashed border-borderSubtle flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-textSecondary">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{task.comments ? task.comments.length : 0}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Status Select */}
            {onStatusChange && (
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value)}
                className="text-xs bg-slate-50 border border-borderSubtle rounded px-2 py-1 text-textPrimary focus:ring-1 focus:ring-primary focus:outline-none"
              >
                {Object.values(TASK_STATUS).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            )}

            {isAdmin && showActions && (
              <div className="flex items-center gap-1">
                {onEdit && (
                  <button
                    onClick={() => onEdit(task)}
                    className="p-1 text-textSecondary hover:text-primary rounded hover:bg-slate-100 transition-colors"
                    title="Edit Task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1 text-textSecondary hover:text-status-danger rounded hover:bg-red-50 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
