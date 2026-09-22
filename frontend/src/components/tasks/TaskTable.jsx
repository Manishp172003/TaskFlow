import React from 'react';
import { Edit2, Trash2, Eye, Calendar, UserCheck } from 'lucide-react';
import TaskStatusBadge from './TaskStatusBadge';
import { PRIORITY_COLORS, TASK_STATUS } from '../../utils/constants';
import { formatDate, isOverdue, getInitials, cn } from '../../utils/helpers';

export default function TaskTable({
  tasks = [],
  users = [],
  onEdit,
  onDelete,
  onStatusChange,
  onViewDetails,
  isAdmin = false,
  emptyMessage = 'No tasks found.',
}) {
  const getUser = (userId) => users.find((u) => u.id === userId);

  if (tasks.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-borderSubtle p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-primary flex items-center justify-center mx-auto mb-3">
          <UserCheck className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-textPrimary">{emptyMessage}</h4>
        <p className="text-sm text-textSecondary mt-1">
          Try clearing your filters or create a new task.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-borderSubtle shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-textPrimary">
          <thead className="bg-slate-50 border-b border-borderSubtle text-xs font-semibold uppercase tracking-wider text-textSecondary">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                Task
              </th>
              <th scope="col" className="px-6 py-3.5">
                Assigned To
              </th>
              <th scope="col" className="px-6 py-3.5">
                Priority
              </th>
              <th scope="col" className="px-6 py-3.5">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3.5">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderSubtle">
            {tasks.map((task) => {
              const assignee = getUser(task.assignedToId);
              const priorityConfig = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium;
              const overdue = isOverdue(task.dueDate, task.status);

              return (
                <tr
                  key={task.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Task Title & Code */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-textSecondary font-semibold">
                          {task.id}
                        </span>
                        <button
                          onClick={() => onViewDetails && onViewDetails(task)}
                          className="font-medium text-textPrimary hover:text-primary transition-colors text-left"
                        >
                          {task.title}
                        </button>
                      </div>
                      {task.description && (
                        <p className="text-xs text-textSecondary line-clamp-1 mt-0.5 max-w-md">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Assigned User */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assignee ? (
                      <div className="flex items-center gap-2.5">
                        {assignee.avatar ? (
                          <img
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="w-7 h-7 rounded-full object-cover border border-borderSubtle"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                            {getInitials(assignee.name)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-xs text-textPrimary leading-tight">
                            {assignee.name}
                          </p>
                          <p className="text-[11px] text-textSecondary">
                            {assignee.department || 'User'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-textSecondary italic">Unassigned</span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                        priorityConfig.bg,
                        priorityConfig.text,
                        priorityConfig.border
                      )}
                    >
                      {task.priority}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-textSecondary" />
                      <span className={cn(overdue ? 'text-status-danger font-semibold' : 'text-textSecondary')}>
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                    {overdue && (
                      <span className="inline-block mt-0.5 text-[10px] text-status-danger font-semibold bg-red-50 px-1.5 py-0.2 rounded">
                        Overdue
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {onStatusChange ? (
                      <select
                        value={task.status}
                        onChange={(e) => onStatusChange(task.id, e.target.value)}
                        className="text-xs bg-slate-50 border border-borderSubtle rounded-md px-2.5 py-1 text-textPrimary font-medium focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
                      >
                        {Object.values(TASK_STATUS).map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <TaskStatusBadge status={task.status} />
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                    <div className="flex items-center justify-end gap-1">
                      {onViewDetails && (
                        <button
                          type="button"
                          onClick={() => onViewDetails(task)}
                          className="p-1.5 text-textSecondary hover:text-primary rounded-lg hover:bg-slate-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {isAdmin && onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(task)}
                          className="p-1.5 text-textSecondary hover:text-primary rounded-lg hover:bg-slate-100 transition-colors"
                          title="Edit Task"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}

                      {isAdmin && onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(task.id)}
                          className="p-1.5 text-textSecondary hover:text-status-danger rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
