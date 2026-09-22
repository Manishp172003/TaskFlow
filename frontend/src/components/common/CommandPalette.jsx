import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  Users,
  BarChart2,
  Settings,
  User,
  Plus,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../utils/constants';
import { cn } from '../../utils/helpers';

export default function CommandPalette({ isOpen, onClose, onOpenCreateTask }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { role, switchRole, isAdmin } = useAuth();
  const { success } = useToast();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global key listener for Ctrl+K / Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // will be handled by caller
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const items = [
    // Navigation
    {
      id: 'nav_admin_dash',
      title: 'Go to Admin Dashboard',
      category: 'Navigation',
      icon: LayoutDashboard,
      roleRequired: ROLES.ADMIN,
      action: () => navigate('/admin/dashboard'),
    },
    {
      id: 'nav_admin_tasks',
      title: 'Go to Tasks Management',
      category: 'Navigation',
      icon: CheckSquare,
      roleRequired: ROLES.ADMIN,
      action: () => navigate('/admin/tasks'),
    },
    {
      id: 'nav_admin_users',
      title: 'Go to Users Directory',
      category: 'Navigation',
      icon: Users,
      roleRequired: ROLES.ADMIN,
      action: () => navigate('/admin/users'),
    },
    {
      id: 'nav_admin_reports',
      title: 'Go to Reports & Analytics',
      category: 'Navigation',
      icon: BarChart2,
      roleRequired: ROLES.ADMIN,
      action: () => navigate('/admin/reports'),
    },
    {
      id: 'nav_user_dash',
      title: 'Go to My Workspace',
      category: 'Navigation',
      icon: LayoutDashboard,
      action: () => navigate('/user/dashboard'),
    },
    {
      id: 'nav_user_tasks',
      title: 'Go to My Tasks',
      category: 'Navigation',
      icon: CheckSquare,
      action: () => navigate('/user/tasks'),
    },
    {
      id: 'nav_profile',
      title: 'View My Profile',
      category: 'Navigation',
      icon: User,
      action: () => navigate('/user/profile'),
    },
    {
      id: 'nav_settings',
      title: 'Open Settings',
      category: 'Navigation',
      icon: Settings,
      action: () => navigate(isAdmin ? '/admin/settings' : '/user/profile'),
    },

    // Quick Actions
    {
      id: 'act_create_task',
      title: 'Create New Task',
      category: 'Actions',
      icon: Plus,
      badge: 'Quick action',
      action: () => {
        if (onOpenCreateTask) {
          onOpenCreateTask();
        } else {
          navigate('/admin/tasks');
        }
      },
    },
    {
      id: 'act_switch_admin',
      title: 'Switch Role to Admin',
      category: 'Role Switcher',
      icon: ShieldCheck,
      badge: 'Demo helper',
      action: async () => {
        await switchRole(ROLES.ADMIN);
        success('Switched to Admin Role Console');
        navigate('/admin/dashboard');
      },
    },
    {
      id: 'act_switch_user',
      title: 'Switch Role to User (Sarah Jenkins)',
      category: 'Role Switcher',
      icon: UserCheck,
      badge: 'Demo helper',
      action: async () => {
        await switchRole(ROLES.USER);
        success('Switched to User Role Workspace');
        navigate('/user/dashboard');
      },
    },
  ];

  const filteredItems = items.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) ||
                         item.category.toLowerCase().includes(query.toLowerCase());
    return matchesQuery;
  });

  const handleSelect = (item) => {
    onClose();
    item.action();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Palette Modal */}
      <div className="relative mx-auto max-w-xl rounded-2xl border border-borderSubtle bg-card shadow-2xl overflow-hidden animate-fade-in-scale">
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-borderSubtle bg-slate-50/50">
          <Search className="w-5 h-5 text-textSecondary shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, search tasks, or switch roles..."
            className="w-full bg-transparent py-4 text-sm text-textPrimary placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-borderSubtle rounded shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-borderSubtle/50">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-textSecondary text-xs">
              No matching commands or pages found.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-xs transition-colors',
                    isSelected
                      ? 'bg-primary text-white'
                      : 'hover:bg-slate-100 text-textPrimary'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'p-2 rounded-lg shrink-0',
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-textSecondary'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate leading-tight">
                        {item.title}
                      </p>
                      <span
                        className={cn(
                          'text-[10px] block mt-0.5',
                          isSelected ? 'text-blue-100' : 'text-textSecondary'
                        )}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span
                        className={cn(
                          'text-[10px] px-2 py-0.5 rounded-full font-medium',
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight
                      className={cn(
                        'w-3.5 h-3.5 transition-transform',
                        isSelected ? 'translate-x-0.5 opacity-100' : 'opacity-0'
                      )}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Instructions */}
        <div className="p-3 bg-slate-50/70 border-t border-borderSubtle flex items-center justify-between text-[11px] text-textSecondary">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-white border border-slate-200 px-1 py-0.2 rounded">↑</kbd> <kbd className="font-mono bg-white border border-slate-200 px-1 py-0.2 rounded">↓</kbd> to navigate</span>
            <span><kbd className="font-mono bg-white border border-slate-200 px-1 py-0.2 rounded">↵</kbd> to execute</span>
          </div>
          <span className="flex items-center gap-1 text-primary font-medium">
            <Sparkles className="w-3 h-3" />
            TaskFlow Spotlight
          </span>
        </div>
      </div>
    </div>
  );
}
