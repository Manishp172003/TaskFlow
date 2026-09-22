import React, { useState } from 'react';
import { Search, Bell, Menu, Shield, User, LogOut, PanelLeftClose, PanelLeft } from 'lucide-react';
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-borderSubtle bg-card px-4 sm:px-6 shadow-subtle backdrop-blur-md bg-white/95">
      {/* Left side: Mobile menu toggle + Desktop Collapse toggle + Global Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-lg">
        {/* Mobile menu drawer trigger */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-textSecondary hover:bg-slate-100 hover:text-textPrimary"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 rounded-lg text-textSecondary hover:bg-slate-100 hover:text-textPrimary transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeft className="w-5 h-5 text-primary" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Global Search Bar with Command Palette trigger */}
        <div
          onClick={onOpenCommandPalette}
          className="relative w-full max-w-xs sm:max-w-sm cursor-pointer group"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-textSecondary group-hover:text-primary transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            readOnly
            placeholder="Search or jump to... (⌘K)"
            className="w-full rounded-xl border border-borderSubtle bg-slate-50 py-1.5 pl-9 pr-14 text-sm text-textPrimary placeholder:text-slate-400 group-hover:border-slate-300 group-hover:bg-white focus:outline-none transition-all cursor-pointer select-none"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-borderSubtle rounded shadow-2xs group-hover:border-primary/40 group-hover:text-primary transition-colors">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right side: Notifications + User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell with interactive Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setDropdownOpen(false);
            }}
            className="relative p-2 rounded-xl text-textSecondary hover:bg-slate-100 hover:text-textPrimary transition-colors focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-status-danger ring-2 ring-white animate-pulse" />
          </button>

          {/* Interactive Notifications Popover */}
          <NotificationDropdown
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
        </div>

        <div className="h-6 w-px bg-borderSubtle hidden sm:block" />

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-borderSubtle ring-2 ring-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                {getInitials(user?.name || 'User')}
              </div>
            )}

            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-textPrimary leading-none">
                {user?.name || 'User'}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                    isAdmin ? 'bg-blue-100 text-primary' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {user?.role || 'USER'}
                </span>
                <span className="text-[11px] text-textSecondary truncate max-w-[110px]">
                  {user?.department || 'TaskFlow'}
                </span>
              </div>
            </div>
          </button>

          {/* User Popover menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-borderSubtle bg-card shadow-premium z-50 py-1.5 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2.5 border-b border-borderSubtle">
                  <p className="text-xs font-semibold text-textPrimary truncate">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-textSecondary truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(isAdmin ? '/admin/settings' : '/user/profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-textPrimary hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-textSecondary" />
                    <span>My Profile & Settings</span>
                  </button>
                </div>

                <div className="border-t border-borderSubtle pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-status-danger hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-status-danger" />
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
