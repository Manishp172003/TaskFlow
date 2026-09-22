import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Filter, RotateCcw, LayoutGrid, List } from 'lucide-react';
import TaskTable from '../../components/tasks/TaskTable';
import TaskCard from '../../components/tasks/TaskCard';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import Loader from '../../components/common/Loader';
import taskService from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';

export default function MyTasks() {
  const { headerSearch } = useOutletContext() || {};
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [viewingTask, setViewingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [user]);

  useEffect(() => {
    if (headerSearch !== undefined) {
      setSearchTerm(headerSearch);
    }
  }, [headerSearch]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            My Tasks
          </h1>
          <p className="text-sm text-textSecondary mt-0.5">
            View your sprint assignments, update deliverables status, and collaborate with your lead.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-lg border border-borderSubtle bg-card p-1 shadow-xs">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded ${
              viewMode === 'cards' ? 'bg-slate-100 text-textPrimary' : 'text-textSecondary hover:text-textPrimary'
            }`}
            title="Card Grid"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded ${
              viewMode === 'table' ? 'bg-slate-100 text-textPrimary' : 'text-textSecondary hover:text-textPrimary'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card rounded-xl border border-borderSubtle p-4 shadow-card">
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
              className="w-full rounded-lg border border-borderSubtle bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-textPrimary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-borderSubtle bg-white px-3 py-2 text-xs sm:text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
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
              className="w-full rounded-lg border border-borderSubtle bg-white px-3 py-2 text-xs sm:text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
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
              className="text-primary hover:text-primary-hover font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Task List: Cards or Table */}
      {viewMode === 'cards' ? (
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
            <div className="col-span-full bg-card rounded-xl border border-borderSubtle p-12 text-center text-textSecondary">
              No tasks match your filter criteria.
            </div>
          )}
        </div>
      ) : (
        <TaskTable
          tasks={filteredTasks}
          users={user ? [user] : []}
          isAdmin={false}
          onStatusChange={handleStatusChange}
          onViewDetails={(t) => setViewingTask(t)}
        />
      )}

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
