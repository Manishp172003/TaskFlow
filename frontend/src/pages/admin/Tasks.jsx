import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Columns,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Button from '../../components/common/Button';
import TaskTable from '../../components/tasks/TaskTable';
import TaskCard from '../../components/tasks/TaskCard';
import TaskKanban from '../../components/tasks/TaskKanban';
import TaskForm from '../../components/tasks/TaskForm';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import taskService from '../../services/taskService';
import userService from '../../services/userService';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminTasks() {
  const { headerSearch } = useOutletContext() || {};
  const { user } = useAuth();
  const { success, info } = useToast();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [userFilter, setUserFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('taskflow_tasks_view_mode') || 'table';
    } catch {
      return 'table';
    }
  }); // 'table' | 'cards' | 'kanban'

  // Modals & Dialogs
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Sync header search if used
  useEffect(() => {
    if (headerSearch !== undefined) {
      setSearchTerm(headerSearch);
    }
  }, [headerSearch]);

  const setAndSaveViewMode = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('taskflow_tasks_view_mode', mode);
    } catch (e) {
      console.error(e);
    }
  };

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
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    if (editingTask) {
      const updated = await taskService.updateTask(editingTask.id, formData);
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)));
      success(`Task "${updated.id}" updated successfully`);
    } else {
      const created = await taskService.createTask(formData);
      setTasks((prev) => [created, ...prev]);
      success(`New task "${created.id}" created and assigned`);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const updated = await taskService.updateTaskStatus(taskId, newStatus);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    success(`Task status changed to ${newStatus}`);
    if (viewingTask && viewingTask.id === taskId) {
      setViewingTask(updated);
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTaskId) return;
    setIsDeleting(true);
    try {
      await taskService.deleteTask(deleteTaskId);
      setTasks((prev) => prev.filter((t) => t.id !== deleteTaskId));
      info('Task deleted from workspace');
      setDeleteTaskId(null);
    } finally {
      setIsDeleting(false);
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
    if (viewingTask && viewingTask.id === taskId) {
      setViewingTask((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setUserFilter('ALL');
  };

  // Filter pipeline
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    const matchesUser = userFilter === 'ALL' || task.assignedToId === userFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesUser;
  });

  if (loading) {
    return <Loader text="Loading tasks list..." />;
  }

  return (
    <div className="space-y-6 page-enter">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Sprint Backlog
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            Tasks Management
          </h1>
          <p className="text-sm text-textSecondary mt-0.5">
            Manage, assign, and track engineering tasks across sprints and boards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle table / cards / kanban */}
          <div className="flex items-center rounded-xl border border-borderSubtle bg-card p-1 shadow-2xs">
            <button
              onClick={() => setAndSaveViewMode('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-primary text-white shadow-sm' : 'text-textSecondary hover:text-textPrimary'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setAndSaveViewMode('cards')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'cards' ? 'bg-primary text-white shadow-sm' : 'text-textSecondary hover:text-textPrimary'
              }`}
              title="Card Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setAndSaveViewMode('kanban')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-primary text-white shadow-sm' : 'text-textSecondary hover:text-textPrimary'
              }`}
              title="Kanban Board View"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>
          </div>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card rounded-2xl border border-borderSubtle p-4 shadow-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-textSecondary">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, description, or ID..."
              className="w-full rounded-xl border border-borderSubtle bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-textPrimary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-borderSubtle bg-white px-3 py-2 text-xs sm:text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-all"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(TASK_STATUS).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-xl border border-borderSubtle bg-white px-3 py-2 text-xs sm:text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-all"
            >
              <option value="ALL">All Priorities</option>
              {Object.values(TASK_PRIORITY).map((pr) => (
                <option key={pr} value={pr}>
                  {pr} Priority
                </option>
              ))}
            </select>
          </div>

          {/* Assigned User Filter */}
          <div>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full rounded-xl border border-borderSubtle bg-white px-3 py-2 text-xs sm:text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-all"
            >
              <option value="ALL">All Assignees</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter stats & Reset */}
        {(searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || userFilter !== 'ALL') && (
          <div className="mt-3 pt-3 border-t border-borderSubtle flex items-center justify-between text-xs text-textSecondary">
            <span>
              Found <strong className="text-textPrimary">{filteredTasks.length}</strong> of {tasks.length} tasks
            </span>
            <button
              onClick={resetFilters}
              className="text-primary hover:text-primary-hover font-semibold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Dynamic View rendering: Table / Cards / Kanban */}
      {viewMode === 'table' && (
        <TaskTable
          tasks={filteredTasks}
          users={users}
          isAdmin={true}
          onEdit={(task) => {
            setEditingTask(task);
            setIsFormOpen(true);
          }}
          onDelete={(id) => setDeleteTaskId(id)}
          onStatusChange={handleStatusChange}
          onViewDetails={(task) => setViewingTask(task)}
        />
      )}

      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              assignee={users.find((u) => u.id === task.assignedToId)}
              isAdmin={true}
              onEdit={(t) => {
                setEditingTask(t);
                setIsFormOpen(true);
              }}
              onDelete={(id) => setDeleteTaskId(id)}
              onStatusChange={handleStatusChange}
              onViewDetails={(t) => setViewingTask(t)}
            />
          ))}
          {filteredTasks.length === 0 && (
            <div className="col-span-full bg-card rounded-2xl border border-borderSubtle p-12 text-center text-textSecondary shadow-card">
              No tasks found matching your filter criteria.
            </div>
          )}
        </div>
      )}

      {viewMode === 'kanban' && (
        <TaskKanban
          tasks={filteredTasks}
          users={users}
          isAdmin={true}
          onStatusChange={handleStatusChange}
          onViewDetails={(t) => setViewingTask(t)}
        />
      )}

      {/* Task Create / Edit Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingTask}
        users={users}
      />

      {/* Task Details Modal */}
      {viewingTask && (
        <TaskDetailModal
          isOpen={!!viewingTask}
          onClose={() => setViewingTask(null)}
          task={viewingTask}
          assignee={users.find((u) => u.id === viewingTask.assignedToId)}
          onStatusChange={handleStatusChange}
          onAddComment={handleAddComment}
          currentUser={user}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTaskId}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
        confirmText="Delete Task"
        isLoading={isDeleting}
      />
    </div>
  );
}
