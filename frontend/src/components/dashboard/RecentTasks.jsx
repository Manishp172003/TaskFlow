import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import TaskStatusBadge from '../tasks/TaskStatusBadge';
import { formatDate, getInitials } from '../../utils/helpers';

export default function RecentTasks({ tasks = [], users = [], onViewDetails, viewAllLink = '/admin/tasks' }) {
  const getUser = (userId) => users.find((u) => u.id === userId);

  return (
    <div className="bg-card rounded-xl border border-borderSubtle p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-textPrimary">Recent Tasks</h3>
          <p className="text-xs text-textSecondary mt-0.5">Latest tasks assigned across teams</p>
        </div>
        <Link
          to={viewAllLink}
          className="text-xs font-medium text-primary hover:text-primary-hover inline-flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-borderSubtle">
        {tasks.slice(0, 5).map((task) => {
          const assignee = getUser(task.assignedToId);
          return (
            <div
              key={task.id}
              className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 rounded-lg px-2 -mx-2 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-textSecondary">
                    {task.id}
                  </span>
                  <button
                    onClick={() => onViewDetails && onViewDetails(task)}
                    className="text-sm font-medium text-textPrimary hover:text-primary truncate transition-colors text-left"
                  >
                    {task.title}
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-textSecondary">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(task.dueDate)}
                  </span>
                  {assignee && (
                    <span className="truncate max-w-[120px]">
                      {assignee.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <TaskStatusBadge status={task.status} />
                {assignee && (
                  assignee.avatar ? (
                    <img
                      src={assignee.avatar}
                      alt={assignee.name}
                      className="w-7 h-7 rounded-full object-cover border border-borderSubtle hidden sm:block"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 hidden sm:flex items-center justify-center font-bold text-xs">
                      {getInitials(assignee.name)}
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
