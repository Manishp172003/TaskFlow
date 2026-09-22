import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { TASK_PRIORITY, TASK_STATUS } from '../../utils/constants';

export default function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  users = [],
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedToId: '',
    priority: TASK_PRIORITY.MEDIUM,
    status: TASK_STATUS.PENDING,
    dueDate: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        assignedToId: initialData.assignedToId || '',
        priority: initialData.priority || TASK_PRIORITY.MEDIUM,
        status: initialData.status || TASK_STATUS.PENDING,
        dueDate: initialData.dueDate || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assignedToId: users.length > 0 ? users[0].id : '',
        priority: TASK_PRIORITY.MEDIUM,
        status: TASK_STATUS.PENDING,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }
    setErrors({});
  }, [initialData, isOpen, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (!formData.assignedToId) {
      newErrors.assignedToId = 'Please assign to a team member';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.role})`,
  }));

  const priorityOptions = Object.values(TASK_PRIORITY).map((p) => ({
    value: p,
    label: p,
  }));

  const statusOptions = Object.values(TASK_STATUS).map((s) => ({
    value: s,
    label: s,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Task' : 'Create New Task'}
      description={
        initialData
          ? 'Update the task details, priority, or assignee.'
          : 'Fill in the information to dispatch a new task to your team.'
      }
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Implement OAuth2 Refresh Token Rotation"
          error={errors.title}
          required
        />

        <div>
          <label className="block text-sm font-medium text-textPrimary mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed requirements or acceptance criteria..."
            className="block w-full rounded-lg border border-borderSubtle bg-white px-3 py-2 text-sm text-textPrimary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-slate-300 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assigned To"
            name="assignedToId"
            value={formData.assignedToId}
            onChange={handleChange}
            options={userOptions}
            placeholder="Select assignee"
            error={errors.assignedToId}
            required
          />

          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={priorityOptions}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            error={errors.dueDate}
            required
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-borderSubtle">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {initialData ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
