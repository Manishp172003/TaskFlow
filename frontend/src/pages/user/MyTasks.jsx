import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Filter, RotateCcw, LayoutGrid, List, Columns } from 'lucide-react';
import TaskTable from '../../components/tasks/TaskTable';
import TaskCard from '../../components/tasks/TaskCard';
import TaskKanban from '../../components/tasks/TaskKanban';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import Loader from '../../components/common/Loader';
import taskService from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';

export default function MyTasks() {
  const { headerSearch } = useOutletContext() || {};
  const { user } = useAuth();
  const { success } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('taskflow_user_tasks_view_mode') || 'cards';
    } catch {
      return 'cards';
    }
  }); // 'cards' | 'table' | 'kanban'
  const [viewingTask, setViewingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [user]);

  useEffect(() => {
    if (headerSearch !== undefined) {
      setSearchTerm(headerSearch);
    }
  }, [headerSearch]);

  const setAndSaveViewMode = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('taskflow_user_tasks_view_mode', mode);
    } catch (e) {
      console.error(e);
    }
  };

  const loadTasks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const allTasks = await taskService.getTasks();
      const myTasks = allTasks.filter((t) => t.assignedToId === user.id);
      setTasks(myTasks);
    } catch (err) {
      console.error('Error fetching user tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const updated = await taskService.updateTaskStatus(taskId, newStatus);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    success(`Task status updated to "${newStatus}"`);
    if (viewingTask && viewingTask.id === taskId) {
      setViewingTask(updated);
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
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return <Loader text="Loading your tasks..." />;
  }

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            My Tasks
          </h1>
          <p className="text-sm text-textSecondary mt-0.5">
            View your sprint assignments, update deliverables status, and collaborate with your team.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-xl border border-borderSubtle bg-card p-1 shadow-2xs">
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
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card rounded-2xl border border-borderSubtle p-4 shadow-card">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-textSecondary">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your tasks..."
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
        </div>

        {(searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL') && (
          <div className="mt-3 pt-3 border-t border-borderSubtle flex items-center justify-between text-xs text-textSecondary">
            <span>
              Showing <strong className="text-textPrimary">{filteredTasks.length}</strong> of {tasks.length} tasks
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

      {/* Task List: Cards, Table, or Kanban with smooth transition */}
      <div key={viewMode} className="view-switch-transition">
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                assignee={user}
                isAdmin={false}
                onStatusChange={handleStatusChange}
                onViewDetails={(t) => setViewingTask(t)}
              />
            ))}
            {filteredTasks.length === 0 && (
              <div className="col-span-full bg-card rounded-2xl border border-borderSubtle p-12 text-center text-textSecondary shadow-card">
                No tasks match your filter criteria.
              </div>
            )}
          </div>
        )}

        {viewMode === 'table' && (
          <TaskTable
            tasks={filteredTasks}
            users={user ? [user] : []}
            isAdmin={false}
            onStatusChange={handleStatusChange}
            onViewDetails={(t) => setViewingTask(t)}
          />
        )}

        {viewMode === 'kanban' && (
          <TaskKanban
            tasks={filteredTasks}
            users={user ? [user] : []}
            isAdmin={false}
            onStatusChange={handleStatusChange}
            onViewDetails={(t) => setViewingTask(t)}
          />
        )}
      </div>

      {/* Task Details Modal with Comments */}
      {viewingTask && (
        <TaskDetailModal
          isOpen={!!viewingTask}
          onClose={() => setViewingTask(null)}
          task={viewingTask}
          assignee={user}
          onStatusChange={handleStatusChange}
          onAddComment={handleAddComment}
          currentUser={user}
        />
      )}
    </div>
  );
}
