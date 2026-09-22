import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  Calendar,
  ArrowRight,
  TrendingUp,
  Plus,
  Sparkles,
  Command,
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import TaskSummary from '../../components/dashboard/TaskSummary';
import RecentTasks from '../../components/dashboard/RecentTasks';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import TaskForm from '../../components/tasks/TaskForm';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import taskService from '../../services/taskService';
import userService from '../../services/userService';
import { calculateTaskStats, formatDate, isOverdue } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboard() {
  const { headerSearch, openCommandPalette } = useOutletContext() || {};
  const { user } = useAuth();
  const { success } = useToast();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedTasks, fetchedUsers] = await Promise.all([
        taskService.getTasks(),
        userService.getUsers(),
      ]);
      setTasks(fetchedTasks);
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const updated = await taskService.updateTaskStatus(taskId, newStatus);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    success(`Task status changed to ${newStatus}`);
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(updated);
    }
  };

  const handleAddComment = async (taskId, comment) => {
    const newComment = await taskService.addComment(taskId, comment);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, comments: [...(t.comments || []), newComment] }
          : t
      )
    );
    success('Comment posted to discussion');
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));
    }
  };

  const handleCreateTask = async (taskData) => {
    const created = await taskService.createTask(taskData);
    setTasks((prev) => [created, ...prev]);
    success(`New task "${created.id}" created successfully`);
    setIsCreateModalOpen(false);
  };

  if (loading) {
    return <Loader text="Loading dashboard statistics..." />;
  }

  // Filter tasks if header search is typed
  const displayedTasks = headerSearch
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(headerSearch.toLowerCase()) ||
          t.id.toLowerCase().includes(headerSearch.toLowerCase())
      )
    : tasks;

  const stats = calculateTaskStats(displayedTasks);

  // Upcoming deadlines (tasks not completed, sorted by due date)
  const upcomingTasks = displayedTasks
    .filter((t) => t.status !== 'Completed' && t.status !== 'Cancelled')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Workspace Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            Executive Dashboard
          </h1>
          <p className="text-sm text-textSecondary mt-0.5">
            Welcome back, <span className="font-semibold text-textPrimary">{user?.name || 'Admin'}</span>. Here is the operational summary across all active projects.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {openCommandPalette && (
            <button
              type="button"
              onClick={openCommandPalette}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-borderSubtle bg-white text-xs font-semibold text-textPrimary hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Command className="w-3.5 h-3.5 text-textSecondary" />
              <span>Spotlight</span>
              <kbd className="text-[10px] bg-slate-100 text-slate-500 px-1 rounded border border-slate-200 font-mono">⌘K</kbd>
            </button>
          )}

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards with visual indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          subtitle="All active and closed tasks"
          icon={ListTodo}
          variant="blue"
          trend="+12% velocity"
        />
        <StatCard
          title="Pending Pickup"
          value={stats.pending}
          subtitle="Waiting for team allocation"
          icon={Clock}
          variant="amber"
        />
        <StatCard
          title="In Development"
          value={stats.inProgress}
          subtitle="Actively being worked on"
          icon={TrendingUp}
          variant="blue"
        />
        <StatCard
          title="Sprint Completed"
          value={stats.completed}
          subtitle={`${stats.completionRate}% throughput rate`}
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* Middle section: Task Summary & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task status summary */}
        <div className="lg:col-span-1">
          <TaskSummary stats={stats} />
        </div>

        {/* Upcoming Deadlines Section */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-borderSubtle p-6 shadow-card hover:shadow-premium transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-textPrimary">
                  Upcoming Deadlines
                </h3>
                <p className="text-xs text-textSecondary mt-0.5">
                  Critical milestones due in the upcoming days
                </p>
              </div>
              <Link
                to="/admin/tasks"
                className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
              >
                View tasks <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingTasks.length === 0 ? (
                <div className="h-44 border-2 border-dashed border-borderSubtle rounded-xl flex items-center justify-center text-xs text-textSecondary italic">
                  No upcoming deadlines found. All clear!
                </div>
              ) : (
                upcomingTasks.map((t) => {
                  const assignee = users.find((u) => u.id === t.assignedToId);
                  const overdue = isOverdue(t.dueDate, t.status);
                  return (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-xl border border-borderSubtle bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 card-hover"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-textSecondary">
                            {t.id}
                          </span>
                          <span
                            onClick={() => setSelectedTask(t)}
                            className="text-sm font-semibold text-textPrimary hover:text-primary cursor-pointer truncate transition-colors"
                          >
                            {t.title}
                          </span>
                        </div>
                        <p className="text-xs text-textSecondary mt-1">
                          Assigned: <strong className="text-textPrimary font-medium">{assignee?.name || 'Unassigned'}</strong>
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2 text-xs">
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold ${
                            overdue
                              ? 'bg-rose-50 text-status-danger border border-rose-200'
                              : 'bg-white text-textPrimary border border-borderSubtle shadow-2xs'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(t.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-borderSubtle flex items-center justify-between text-xs text-textSecondary">
            <span className="flex items-center gap-1 text-primary font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Sprint Goal Delivery
            </span>
            <span className="font-bold text-textPrimary">Sprint 42 (Q3 Active)</span>
          </div>
        </div>
      </div>

      {/* Recent tasks table */}
      <div>
        <RecentTasks
          tasks={displayedTasks}
          users={users}
          onViewDetails={(task) => setSelectedTask(task)}
          viewAllLink="/admin/tasks"
        />
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          assignee={users.find((u) => u.id === selectedTask.assignedToId)}
          onStatusChange={handleStatusChange}
          onAddComment={handleAddComment}
          currentUser={user}
        />
      )}

      {/* Create Task Modal */}
      <TaskForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        users={users}
      />
    </div>
  );
}
