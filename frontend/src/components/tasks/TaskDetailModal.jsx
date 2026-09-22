import React, { useState } from 'react';
import Modal from '../common/Modal';
import TaskStatusBadge from './TaskStatusBadge';
import Button from '../common/Button';
import { Calendar, User, Clock, Send, MessageSquare } from 'lucide-react';
import { formatDate, getInitials, cn } from '../../utils/helpers';
import { TASK_STATUS, PRIORITY_COLORS } from '../../utils/constants';

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  assignee,
  onStatusChange,
  onAddComment,
  currentUser,
}) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) return null;

  const priorityConfig = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium;

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(task.id, {
        authorName: currentUser ? currentUser.name : 'Current User',
        authorAvatar: currentUser ? currentUser.avatar : '',
        content: commentText.trim(),
      });
      setCommentText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task.title}
      description={`Task ID: ${task.id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Metadata grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-borderSubtle">
          <div>
            <span className="text-xs text-textSecondary font-medium">Status</span>
            <div className="mt-1">
              {onStatusChange ? (
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                  className="text-xs bg-white border border-borderSubtle rounded px-2 py-1 text-textPrimary font-medium focus:ring-1 focus:ring-primary focus:outline-none"
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
            </div>
          </div>

          <div>
            <span className="text-xs text-textSecondary font-medium">Priority</span>
            <div className="mt-1">
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
            </div>
          </div>

          <div>
            <span className="text-xs text-textSecondary font-medium">Assigned To</span>
            <div className="mt-1 flex items-center gap-1.5">
              {assignee?.avatar ? (
                <img
                  src={assignee.avatar}
                  alt={assignee.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[9px]">
                  {getInitials(assignee?.name || 'U')}
                </div>
              )}
              <span className="text-xs text-textPrimary font-medium truncate">
                {assignee?.name || 'Unassigned'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs text-textSecondary font-medium">Due Date</span>
            <div className="mt-1 text-xs text-textPrimary font-medium">
              {formatDate(task.dueDate)}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h5 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">
            Description
          </h5>
          <div className="text-sm text-textPrimary leading-relaxed bg-white p-4 rounded-lg border border-borderSubtle">
            {task.description || 'No description provided.'}
          </div>
        </div>

        {/* Comments Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-textSecondary" />
            <h5 className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
              Discussion ({task.comments ? task.comments.length : 0})
            </h5>
          </div>

          {/* Comment list */}
          <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
            {(!task.comments || task.comments.length === 0) ? (
              <p className="text-xs text-textSecondary italic py-2">
                No comments yet. Start the conversation below.
              </p>
            ) : (
              task.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 bg-slate-50 rounded-lg border border-borderSubtle text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {comment.authorAvatar ? (
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-primary flex items-center justify-center font-semibold text-[9px]">
                          {getInitials(comment.authorName)}
                        </div>
                      )}
                      <span className="font-semibold text-textPrimary">
                        {comment.authorName}
                      </span>
                    </div>
                    <span className="text-[11px] text-textSecondary">
                      {comment.createdAt}
                    </span>
                  </div>
                  <p className="text-textPrimary leading-relaxed pl-7">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add comment input */}
          {onAddComment && (
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Type a comment or status update..."
                className="flex-1 rounded-lg border border-borderSubtle bg-white px-3 py-2 text-xs text-textPrimary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={!commentText.trim() || isSubmitting}
                isLoading={isSubmitting}
                icon={Send}
              >
                Post
              </Button>
            </form>
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-borderSubtle">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
