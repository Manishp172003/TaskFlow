import { TASK_STATUS } from './constants';

/**
 * Combines class names conditionally
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats standard date strings to human-readable format
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Checks if a task due date is past and not completed
 */
export function isOverdue(dueDate, status) {
  if (!dueDate || status === TASK_STATUS.COMPLETED || status === TASK_STATUS.CANCELLED) {
    return false;
  }
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

/**
 * Calculates dashboard statistics from a task list
 */
export function calculateTaskStats(tasks = []) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === TASK_STATUS.PENDING).length;
  const inProgress = tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length;
  const completed = tasks.filter((t) => t.status === TASK_STATUS.COMPLETED).length;
  const cancelled = tasks.filter((t) => t.status === TASK_STATUS.CANCELLED).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    pending,
    inProgress,
    completed,
    cancelled,
    completionRate,
  };
}

/**
 * Get user initials from full name
 */
export function getInitials(name = '') {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Truncate long strings with ellipsis
 */
export function truncate(str, length = 60) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}
