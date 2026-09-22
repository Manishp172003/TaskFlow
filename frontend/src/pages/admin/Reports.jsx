import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  PieChart,
  Users,
  CheckCircle,
  Clock,
  Download,
  Calendar,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import taskService from '../../services/taskService';
import userService from '../../services/userService';
import { calculateTaskStats } from '../../utils/helpers';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';

export default function AdminReports() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [t, u] = await Promise.all([
          taskService.getTasks(),
          userService.getUsers(),
        ]);
        setTasks(t);
        setUsers(u);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <Loader text="Generating system reports..." />;
  }

  const stats = calculateTaskStats(tasks);

  // Workload by user
  const userWorkloads = users.map((u) => {
    const userTasks = tasks.filter((t) => t.assignedToId === u.id);
    const completed = userTasks.filter((t) => t.status === TASK_STATUS.COMPLETED).length;
    const inProgress = userTasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length;
    const pending = userTasks.filter((t) => t.status === TASK_STATUS.PENDING).length;

    return {
      user: u,
      total: userTasks.length,
      completed,
      inProgress,
      pending,
      rate: userTasks.length > 0 ? Math.round((completed / userTasks.length) * 100) : 0,
    };
  });

  // Priority distribution
  const highCount = tasks.filter((t) => t.priority === TASK_PRIORITY.HIGH).length;
  const mediumCount = tasks.filter((t) => t.priority === TASK_PRIORITY.MEDIUM).length;
  const lowCount = tasks.filter((t) => t.priority === TASK_PRIORITY.LOW).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            Reports & Analytics
          </h1>
          <p className="text-sm text-textSecondary mt-0.5">
            Overview of project throughput, team capacity, and sprint velocity.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={Download}
          onClick={() => alert('Report export functionality will be connected with Spring Boot CSV/PDF export endpoints.')}
        >
          Export Report
        </Button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-borderSubtle p-5 shadow-card">
          <div className="flex items-center justify-between text-textSecondary mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Overall Velocity</span>
            <CheckCircle className="w-4 h-4 text-status-success" />
          </div>
          <div className="text-2xl font-bold text-textPrimary">
            {stats.completionRate}%
          </div>
          <p className="text-xs text-textSecondary mt-1">
            {stats.completed} of {stats.total} total tasks resolved
          </p>
        </div>

        <div className="bg-card rounded-xl border border-borderSubtle p-5 shadow-card">
          <div className="flex items-center justify-between text-textSecondary mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Pipeline</span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-textPrimary">
            {stats.inProgress + stats.pending}
          </div>
          <p className="text-xs text-textSecondary mt-1">
            Tasks currently in progress or waiting
          </p>
        </div>

        <div className="bg-card rounded-xl border border-borderSubtle p-5 shadow-card">
          <div className="flex items-center justify-between text-textSecondary mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">High Priority Load</span>
            <PieChart className="w-4 h-4 text-status-danger" />
          </div>
          <div className="text-2xl font-bold text-textPrimary">
            {highCount} Tasks
          </div>
          <p className="text-xs text-textSecondary mt-1">
            {stats.total > 0 ? Math.round((highCount / stats.total) * 100) : 0}% of all tasks
          </p>
        </div>
      </div>

      {/* Team Workload Distribution */}
      <div className="bg-card rounded-xl border border-borderSubtle p-6 shadow-card">
        <h3 className="text-base font-semibold text-textPrimary mb-1">
          Team Workload Distribution
        </h3>
        <p className="text-xs text-textSecondary mb-6">
          Allocation and completion breakdown by individual team member.
        </p>

        <div className="space-y-5">
          {userWorkloads.map(({ user, total, completed, inProgress, pending, rate }) => (
            <div key={user.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-textPrimary">{user.name}</span>
                  <span className="text-xs text-textSecondary">({user.department})</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-700 font-medium">{completed} Done</span>
                  <span className="text-blue-700 font-medium">{inProgress} In Dev</span>
                  <span className="text-amber-700 font-medium">{pending} Pending</span>
                  <span className="font-bold text-textPrimary ml-2">{total} Total</span>
                </div>
              </div>

              {/* Stacked bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                  className="bg-emerald-500 h-full"
                  title={`Completed: ${completed}`}
                />
                <div
                  style={{ width: `${total > 0 ? (inProgress / total) * 100 : 0}%` }}
                  className="bg-blue-500 h-full"
                  title={`In Progress: ${inProgress}`}
                />
                <div
                  style={{ width: `${total > 0 ? (pending / total) * 100 : 0}%` }}
                  className="bg-amber-500 h-full"
                  title={`Pending: ${pending}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Breakdown Card */}
      <div className="bg-card rounded-xl border border-borderSubtle p-6 shadow-card">
        <h3 className="text-base font-semibold text-textPrimary mb-1">
          Priority Composition
        </h3>
        <p className="text-xs text-textSecondary mb-4">
          Distribution of workload risk and priority levels.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
              High Priority
            </span>
            <div className="text-2xl font-bold text-rose-900 mt-1">{highCount}</div>
            <p className="text-xs text-rose-600 mt-1">Requires immediate attention</p>
          </div>

          <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
              Medium Priority
            </span>
            <div className="text-2xl font-bold text-indigo-900 mt-1">{mediumCount}</div>
            <p className="text-xs text-indigo-600 mt-1">Standard sprint velocity</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Low Priority
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{lowCount}</div>
            <p className="text-xs text-slate-600 mt-1">Enhancements and tech debt</p>
          </div>
        </div>
      </div>
    </div>
  );
}
