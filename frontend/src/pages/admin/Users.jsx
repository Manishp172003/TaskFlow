import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Search,
  Mail,
  Shield,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Briefcase,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import userService from '../../services/userService';
import taskService from '../../services/taskService';
import { ROLES } from '../../utils/constants';
import { getInitials, cn } from '../../utils/helpers';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ROLES.USER,
    department: 'Engineering',
    status: 'Active',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedUsers, fetchedTasks] = await Promise.all([
        userService.getUsers(),
        taskService.getTasks(),
      ]);
      setUsers(fetchedUsers);
      setTasks(fetchedTasks);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAssignedCount = (userId) => {
    return tasks.filter((t) => t.assignedToId === userId).length;
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: ROLES.USER,
      department: 'Engineering',
      status: 'Active',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || 'Engineering',
      status: user.status || 'Active',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editingUser) {
        const updated = await userService.updateUser(editingUser.id, formData);
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? updated : u)));
      } else {
        const created = await userService.createUser(formData);
        setUsers((prev) => [...prev, created]);
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    setIsSubmitting(true);
    try {
      await userService.deleteUser(deleteUserId);
      setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
      setDeleteUserId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    const updated = await userService.updateUser(user.id, { status: nextStatus });
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.department && u.department.toLowerCase().includes(q)) ||
      u.role.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <Loader text="Loading team members..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            Users
          </h1>
          <p className="text-sm text-textSecondary mt-0.5">
            Manage organization members, assign role authorizations, and audit task ownership.
          </p>
        </div>

        <Button
          variant="primary"
          icon={UserPlus}
          onClick={openCreateModal}
        >
          Add User
        </Button>
      </div>

      {/* Search Header */}
      <div className="bg-card rounded-xl border border-borderSubtle p-4 shadow-card flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-textSecondary">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, department, or role..."
            className="w-full rounded-lg border border-borderSubtle bg-white py-2 pl-9 pr-3 text-sm text-textPrimary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <span className="text-xs text-textSecondary hidden sm:block">
          Total Users: <strong className="text-textPrimary">{users.length}</strong>
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl border border-borderSubtle shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-textPrimary">
            <thead className="bg-slate-50 border-b border-borderSubtle text-xs font-semibold uppercase tracking-wider text-textSecondary">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  Name
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Email
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Role
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Assigned Tasks
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle">
              {filteredUsers.map((user) => {
                const assignedCount = getAssignedCount(user.id);
                const isActive = user.status === 'Active';

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* User Name + Avatar */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-borderSubtle"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold text-xs">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-textPrimary text-sm">
                            {user.name}
                          </p>
                          <p className="text-xs text-textSecondary flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {user.department || 'General'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                          user.role === ROLES.ADMIN
                            ? 'bg-blue-50 text-primary border-blue-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        )}
                      >
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>

                    {/* Assigned Tasks */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-xs bg-slate-100 text-slate-700">
                        {assignedCount} Tasks
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        )}
                        title="Click to toggle status"
                      >
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            isActive ? 'bg-emerald-500' : 'bg-slate-400'
                          )}
                        />
                        <span>{user.status || 'Active'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 text-textSecondary hover:text-primary rounded-lg hover:bg-slate-100 transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteUserId(user.id)}
                          className="p-1.5 text-textSecondary hover:text-status-danger rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User Member' : 'Add New Team Member'}
        description="Configure account details and access roles in TaskFlow."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Jordan Hayes"
            error={formErrors.name}
            required
          />

          <Input
            label="Work Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jordan.hayes@taskflow.com"
            error={formErrors.email}
            required
          />

          <Input
            label="Department"
            name="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="e.g. Platform Engineering"
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: ROLES.USER, label: 'User' },
                { value: ROLES.ADMIN, label: 'Admin' },
              ]}
            />

            <Select
              label="Account Status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-borderSubtle">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              {editingUser ? 'Save Member' : 'Add Member'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete User Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleDeleteUser}
        title="Remove User Member"
        message="Are you sure you want to remove this user from the organization? Assigned tasks will remain intact."
        confirmText="Remove User"
        isLoading={isSubmitting}
      />
    </div>
  );
}
