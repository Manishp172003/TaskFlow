import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  ListTodo,
  Clock,
  TrendingUp,
  CheckCircle2,
  Calendar,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import TaskCard from '../../components/tasks/TaskCard';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import Loader from '../../components/common/Loader';
import taskService from '../../services/taskService';
import userService from '../../services/userService';
import { calculateTaskStats, formatDate, isOverdue } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { TASK_STATUS } from '../../utils/constants';

export default function UserDashboard() {
  const { headerSearch } = useOutletContext() || {};
  const { user } = useAuth();
  const { success } = useToast();

  const [myTasks, setMyTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [allTasks, allUsers] = await Promise.all([
        taskService.getTasks(),
        userService.getUsers(),
      ]);
      const assigned = allTasks.filter((t) => t.assignedToId === user.id);
      setMyTasks(assigned);
      setUsers(allUsers);
    } catch (err) {
      console.error('Failed to load user dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const updated = await taskService.updateTaskStatus(taskId, newStatus);
    setMyTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    success(`Task status updated to "${newStatus}"`);
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(updated);
    }
  };

  const handleAddComment = async (taskId, comment) => {
    const newComment = await taskService.addComment(taskId, comment);
    setMyTasks((prev) =>
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

  if (loading) {
    return <Loader text="Loading your task workspace..." />;
  }

  const displayedTasks = headerSearch
    ? myTasks.filter(
        (t) =>
          t.title.toLowerCase().includes(headerSearch.toLowerCase()) ||
          t.id.toLowerCase().includes(headerSearch.toLowerCase())
      )
    : myTasks;

  const stats = calculateTaskStats(displayedTasks);

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Individual Contributor
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            My Workspace
          </h1>
          <p className="text-sm text-textSecondary mt-0.5">
            Welcome back, <span className="font-semibold text-textPrimary">{user?.name}</span>. Here is your current task workload.
          </p>
        </div>

        <Link
          to="/user/tasks"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-borderSubtle bg-white text-xs font-semibold text-textPrimary hover:bg-slate-50 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <span>Open Task Board</span>
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
        </Link>
      </div>

      {/* 4 User Stat Cards: My Tasks, Pending, In Progress, Completed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned to Me"
          value={stats.total}
          subtitle="Total tasks in sprint backlog"
          icon={ListTodo}
          variant="blue"
        />
        <StatCard
          title="To Do / Pending"
          value={stats.pending}
          subtitle="Waiting for pickup"
          icon={Clock}
          variant="amber"
        />
        <StatCard
          title="In Development"
          value={stats.inProgress}
          subtitle="Currently active tasks"
          icon={TrendingUp}
          variant="blue"
        />
        <StatCard
          title="Delivered"
          value={stats.completed}
          subtitle={`${stats.completionRate}% throughput rate`}
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* Active Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-textPrimary">
              Active Task Queue
            </h2>
            <p className="text-xs text-textSecondary">
              Update task progress or add comments for your team lead
            </p>
          </div>
          <Link
            to="/user/tasks"
            className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
          >
            Manage all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {displayedTasks.length === 0 ? (
          <div className="bg-card rounded-2xl border border-borderSubtle p-12 text-center shadow-card">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-textPrimary">All Caught Up!</h3>
            <p className="text-sm text-textSecondary mt-1">
              You currently have no tasks assigned to you. Enjoy your day or claim a task from the backlog.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                assignee={user}
                isAdmin={false}
                onStatusChange={handleStatusChange}
                onViewDetails={(t) => setSelectedTask(t)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Details & Comments Modal */}
      {selectedTask && (
        <TaskDetailModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          assignee={user}
          onStatusChange={handleStatusChange}
          onAddComment={handleAddComment}
          currentUser={user}
        />
      )}
    </div>
  );
}
