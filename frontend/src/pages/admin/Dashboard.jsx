import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  PlayCircle,
  CheckCircle2,
  Download,
  Plus,
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import TaskProgressBarChart from '../../components/dashboard/TaskProgressBarChart';
import TaskStatusDonutChart from '../../components/dashboard/TaskStatusDonutChart';
import RecentTasks from '../../components/dashboard/RecentTasks';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import TaskForm from '../../components/tasks/TaskForm';
import Loader from '../../components/common/Loader';
import taskService from '../../services/taskService';
import userService from '../../services/userService';
import { calculateTaskStats } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboard() {
  const { headerSearch } = useOutletContext() || {};
  const { user } = useAuth();
  const { success, info } = useToast();

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

  const handleExportReport = () => {
    const csvContent = [
      ['Task ID', 'Title', 'Priority', 'Status', 'Due Date'].join(','),
      ...tasks.map((t) =>
        [t.id, `"${t.title.replace(/"/g, '""')}"`, t.priority, t.status, t.dueDate].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TaskFlow_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    info('Exporting task velocity report (CSV)');
  };

  if (loading) {
    return <Loader text="Loading dashboard metrics..." />;
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

  return (
    <div className="space-y-6">
      {/* Top Header Row matching reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <span className="bg-blue-100/80 text-[#2563EB] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider uppercase border border-blue-200/50">
              WORKSPACE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Overview of your team's task activity and engineering velocity.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Report
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </button>
        </div>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Tasks"
          value={stats.total || 24}
          subtitle="All assigned tasks"
          icon={CheckSquare}
          variant="blue"
          trendText="↑ +5.4%"
          trendType="positive"
        />
        <StatCard
          title="Pending"
          value={stats.pending || 5}
          subtitle="Waiting to start"
          icon={Clock}
          variant="amber"
          trendText="= Unchanged"
          trendType="neutral"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress || 7}
          subtitle="Currently active"
          icon={PlayCircle}
          variant="blue"
          trendText="↑ +2 sprint"
          trendType="blue"
        />
        <StatCard
          title="Completed"
          value={stats.completed || 12}
          subtitle="Successfully closed"
          icon={CheckCircle2}
          variant="emerald"
          trendText="↗ 50.0% done"
          trendType="positive"
        />
      </div>

      {/* Middle Row: Two Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <TaskProgressBarChart stats={stats} />
        </div>
        <div className="lg:col-span-1">
          <TaskStatusDonutChart stats={stats} />
        </div>
      </div>

      {/* Bottom Row: Recent Tasks Table */}
      <RecentTasks
        tasks={displayedTasks}
        users={users}
        onViewDetails={(t) => setSelectedTask(t)}
        viewAllLink="/admin/tasks"
      />

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
