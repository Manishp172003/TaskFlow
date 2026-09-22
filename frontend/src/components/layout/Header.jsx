import React, { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  User,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../utils/constants';
import { getInitials } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

export default function Header({
  onMenuClick,
  onSearchChange,
  searchValue = '',
  isCollapsed = false,
  onToggleCollapse,
  onOpenCommandPalette,
}) {
  const { user, role, logout } = useAuth();
  const { info } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    info('Signed out of TaskFlow');
    navigate('/login');
  };

  const isAdmin = role === ROLES.ADMIN;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white px-4 sm:px-8 shadow-xs">
      {/* Left side: Mobile toggle + Collapse toggle + Clean Search Input */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeft className="w-4 h-4 text-primary" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Clean Search Input matching reference */}
        <div
          onClick={onOpenCommandPalette}
          className="relative w-full max-w-md cursor-pointer group"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-hover:text-primary transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            readOnly
            placeholder="Search tasks, users..."
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/70 py-2 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 group-hover:border-slate-300 group-hover:bg-white focus:outline-none transition-all cursor-pointer select-none"
          />
        </div>
      </div>

      {/* Right side: Notification + Help + User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell with red dot */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setDropdownOpen(false);
            }}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
          </button>

          {/* Popover */}
          <NotificationDropdown
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
        </div>

        {/* Help Circle Icon */}
        <button
          type="button"
          onClick={() => info('TaskFlow Documentation: All features active.')}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors focus:outline-none hidden sm:flex"
          title="Help & Support"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* User Profile dropdown */}
        <div className="relative pl-1 sm:pl-2">
          <button
            type="button"
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none group"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {getInitials(user?.name || 'Admin')}
              </div>
            )}

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {user?.name?.split(' ')[0] || 'Admin'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-tight capitalize">
                {isAdmin ? 'Administrator' : 'Team Member'}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block" />
          </button>

          {/* User Popover menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 bg-white shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(isAdmin ? '/admin/settings' : '/user/profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile & Settings</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
