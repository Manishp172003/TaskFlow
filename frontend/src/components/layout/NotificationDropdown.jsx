import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  UserPlus,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { cn } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'assignment',
    title: 'New Task Assignment',
    message: 'Sarah Jenkins assigned you to TSK-103: Design Modal Dialog System',
    timestamp: '12m ago',
    read: false,
    taskId: 'TSK-103',
    icon: Check,
    iconColor: 'bg-blue-50 text-primary border-blue-200',
  },
  {
    id: 'n2',
    type: 'status',
    title: 'Status Updated',
    message: 'Alex Rivera changed TSK-101: JWT Security Filter to In Progress',
    timestamp: '45m ago',
    read: false,
    taskId: 'TSK-101',
    icon: TrendingUp,
    iconColor: 'bg-emerald-50 text-status-success border-emerald-200',
  },
  {
    id: 'n3',
    type: 'comment',
    title: 'New Comment Added',
    message: 'Alexander Wright commented: "Ensure token expiration is set to 24h"',
    timestamp: '2h ago',
    read: false,
    taskId: 'TSK-101',
    icon: MessageSquare,
    iconColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    id: 'n4',
    type: 'deadline',
    title: 'Upcoming Deadline',
    message: 'TSK-102: Build Responsive Shell is due in 24 hours',
    timestamp: '5h ago',
    read: true,
    taskId: 'TSK-102',
    icon: AlertCircle,
    iconColor: 'bg-amber-50 text-status-warning border-amber-200',
  },
  {
    id: 'n5',
    type: 'user',
    title: 'New Member Joined',
    message: 'Elena Rostova joined the Product Design team',
    timestamp: '1d ago',
    read: true,
    taskId: null,
    icon: UserPlus,
    iconColor: 'bg-purple-50 text-purple-600 border-purple-200',
  },
];

export default function NotificationDropdown({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const { role } = useAuth();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = (e, id) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (item) => {
    markAsRead(item.id);
    onClose();
    if (item.taskId) {
      navigate(role === ROLES.ADMIN ? '/admin/tasks' : '/user/tasks');
    }
  };

  const displayedNotifications = notifications.filter((n) =>
    filter === 'all' ? true : !n.read
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for closing */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Popover Card */}
      <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-borderSubtle bg-card shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
        {/* Header */}
        <div className="p-4 border-b border-borderSubtle bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-textPrimary">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary text-white">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2 bg-white border-b border-borderSubtle flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={cn(
              'px-3 py-1 rounded-md font-medium transition-colors',
              filter === 'all'
                ? 'bg-slate-100 text-textPrimary'
                : 'text-textSecondary hover:text-textPrimary'
            )}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={cn(
              'px-3 py-1 rounded-md font-medium transition-colors',
              filter === 'unread'
                ? 'bg-slate-100 text-textPrimary'
                : 'text-textSecondary hover:text-textPrimary'
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-borderSubtle">
          {displayedNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-textPrimary">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </p>
              <p className="text-[11px] text-textSecondary mt-0.5">
                You're completely caught up with team tasks.
              </p>
            </div>
          ) : (
            displayedNotifications.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={cn(
                    'p-3.5 flex items-start gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer group relative',
                    !item.read ? 'bg-blue-50/30' : ''
                  )}
                >
                  {/* Icon Indicator */}
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5',
                      item.iconColor
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-semibold text-textPrimary truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-textSecondary shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-textSecondary line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  {/* Right side: unread dot or delete */}
                  <div className="flex items-center gap-1.5 shrink-0 self-center">
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                    <button
                      type="button"
                      onClick={(e) => removeNotification(e, item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-status-danger rounded transition-all"
                      title="Dismiss"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-borderSubtle bg-slate-50/50 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={clearAll}
              className="text-textSecondary hover:text-status-danger font-medium transition-colors"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(role === ROLES.ADMIN ? '/admin/tasks' : '/user/tasks');
              }}
              className="text-primary hover:text-primary-hover font-semibold flex items-center gap-1 transition-colors"
            >
              View task activity
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
