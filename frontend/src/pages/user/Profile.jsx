import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Briefcase, Shield, Calendar, CheckCircle2, ListTodo, User } from 'lucide-react';
import { getInitials } from '../../utils/helpers';
import taskService from '../../services/taskService';
import Loader from '../../components/common/Loader';

export default function Profile() {
  const { user } = useAuth();
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, inProgress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      try {
        const allTasks = await taskService.getTasks();
        const userTasks = allTasks.filter((t) => t.assignedToId === user.id);
        const completed = userTasks.filter((t) => t.status === 'Completed').length;
        const inProgress = userTasks.filter((t) => t.status === 'In Progress').length;
        setTaskStats({
          total: userTasks.length,
          completed,
          inProgress,
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user]);

  if (loading) {
    return <Loader text="Loading profile..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
          My Profile
        </h1>
        <p className="text-sm text-textSecondary mt-0.5">
          Personal profile details, team department, and operational activity.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-card rounded-2xl border border-borderSubtle p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-primary/20 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center font-bold text-3xl shadow-md">
              {getInitials(user?.name)}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-textPrimary">{user?.name}</h2>
                <p className="text-sm text-textSecondary flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <Mail className="w-4 h-4" /> {user?.email}
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 self-center sm:self-start px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-primary border border-blue-200">
                <Shield className="w-3.5 h-3.5" />
                {user?.role} Role
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-borderSubtle grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-textSecondary">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>Department:</span>
                <strong className="text-textPrimary font-medium">
                  {user?.department || 'Engineering'}
                </strong>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Member Since:</span>
                <strong className="text-textPrimary font-medium">September 2026</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Performance Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-borderSubtle p-5 shadow-card text-center">
          <ListTodo className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-textPrimary">{taskStats.total}</div>
          <p className="text-xs text-textSecondary mt-0.5">Total Tasks Assigned</p>
        </div>

        <div className="bg-card rounded-xl border border-borderSubtle p-5 shadow-card text-center">
          <CheckCircle2 className="w-6 h-6 text-status-success mx-auto mb-2" />
          <div className="text-2xl font-bold text-textPrimary">{taskStats.completed}</div>
          <p className="text-xs text-textSecondary mt-0.5">Completed Tasks</p>
        </div>

        <div className="bg-card rounded-xl border border-borderSubtle p-5 shadow-card text-center">
          <User className="w-6 h-6 text-status-warning mx-auto mb-2" />
          <div className="text-2xl font-bold text-textPrimary">{taskStats.inProgress}</div>
          <p className="text-xs text-textSecondary mt-0.5">Currently In Progress</p>
        </div>
      </div>
    </div>
  );
}
