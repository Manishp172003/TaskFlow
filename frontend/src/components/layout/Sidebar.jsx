import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  BarChart2,
  Settings,
  LogOut,
  User,
  X,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import { cn } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) {
  const { user, role, logout, switchRole, isAdmin } = useAuth();
  const { success, info } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    info('Signed out of TaskFlow');
    navigate('/login');
  };

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/admin/tasks', icon: CheckSquare },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Reports', path: '/admin/reports', icon: BarChart2 },
  ];

  const adminBottomNav = [
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const userNavItems = [
    { name: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/user/tasks', icon: CheckSquare },
  ];

  const userBottomNav = [
    { name: 'Profile', path: '/user/profile', icon: User },
  ];

  const mainItems = isAdmin ? adminNavItems : userNavItems;
  const bottomItems = isAdmin ? adminBottomNav : userBottomNav;

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    return (
      <NavLink
        to={item.path}
        onClick={() => {
          if (window.innerWidth < 1024) onClose();
        }}
        className={({ isActive }) =>
          cn(
            'relative flex items-center rounded-lg text-sm font-medium transition-all group select-none',
            isCollapsed
              ? 'justify-center w-11 h-11 mx-auto'
              : 'gap-3 px-3.5 py-2.5',
            isActive
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          )
        }
      >
        <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />

        {/* Text label when expanded */}
        {!isCollapsed && <span className="flex-1 truncate">{item.name}</span>}

        {/* Floating Tooltip when collapsed on desktop */}
        {isCollapsed && (
          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            {item.name}
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'lg:w-20 w-64' : 'w-64'
        )}
      >
        {/* Brand Header */}
        <div>
          <div
            className={cn(
              'flex items-center border-b border-slate-800 transition-all duration-300',
              isCollapsed
                ? 'px-3 py-5 justify-center flex-col gap-2'
                : 'px-5 py-5 justify-between'
            )}
          >
            {/* Logo and Brand Name */}
            <div className={cn('flex items-center gap-2.5', isCollapsed ? 'justify-center' : '')}>
              <div
                className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                onClick={onToggleCollapse}
                title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                <Layers className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="animate-in fade-in duration-200">
                  <span className="text-base font-bold tracking-tight text-white block leading-none">
                    TASKFLOW
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                    {isAdmin ? 'Admin Console' : 'Workspace'}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle Button */}
            {!isCollapsed && onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation Links */}
          <div className={cn('py-4 space-y-1', isCollapsed ? 'px-2' : 'px-3.5')}>
            {!isCollapsed && (
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Menu
              </p>
            )}
            {mainItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div>
          {/* Collapse toggle in collapsed state */}
          {isCollapsed && onToggleCollapse && (
            <div className="px-2 mb-2 hidden lg:flex justify-center">
              <button
                type="button"
                onClick={onToggleCollapse}
                className="w-11 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Expand sidebar"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Quick Role-Switch Demo Box */}
          <div className={cn('mb-3', isCollapsed ? 'px-2' : 'mx-3.5')}>
            {!isCollapsed ? (
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="font-medium text-[11px] uppercase tracking-wider">Demo Switcher</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                    {role}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={async () => {
                      await switchRole(ROLES.ADMIN);
                      success('Switched to Admin Console');
                      navigate('/admin/dashboard');
                    }}
                    className={cn(
                      'px-2 py-1.5 rounded-lg text-center text-[11px] font-medium transition-colors flex items-center justify-center gap-1',
                      isAdmin
                        ? 'bg-primary text-white'
                        : 'bg-slate-700/70 text-slate-300 hover:bg-slate-700'
                    )}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await switchRole(ROLES.USER);
                      success('Switched to User Workspace');
                      navigate('/user/dashboard');
                    }}
                    className={cn(
                      'px-2 py-1.5 rounded-lg text-center text-[11px] font-medium transition-colors flex items-center justify-center gap-1',
                      !isAdmin
                        ? 'bg-primary text-white'
                        : 'bg-slate-700/70 text-slate-300 hover:bg-slate-700'
                    )}
                  >
                    <UserCheck className="w-3 h-3" />
                    User
                  </button>
                </div>
              </div>
            ) : (
              /* Compact role switch in collapsed mode */
              <div className="relative group flex justify-center">
                <button
                  type="button"
                  onClick={async () => {
                    const next = isAdmin ? ROLES.USER : ROLES.ADMIN;
                    await switchRole(next);
                    success(`Switched to ${next === ROLES.ADMIN ? 'Admin' : 'User'} Role`);
                    navigate(isAdmin ? '/user/dashboard' : '/admin/dashboard');
                  }}
                  className={cn(
                    'w-11 h-11 rounded-lg flex items-center justify-center transition-colors shadow-sm',
                    isAdmin
                      ? 'bg-primary/20 text-blue-400 hover:bg-primary/30'
                      : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  )}
                  title={`Switch to ${isAdmin ? 'User' : 'Admin'}`}
                >
                  {isAdmin ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <UserCheck className="w-5 h-5" />
                  )}
                </button>
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Role: {role} (Click to toggle)
                </div>
              </div>
            )}
          </div>

          {/* Bottom links divider */}
          <div
            className={cn(
              'border-t border-slate-800 pt-3 pb-4 space-y-1',
              isCollapsed ? 'px-2' : 'px-3.5'
            )}
          >
            {bottomItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}

            <button
              onClick={handleLogout}
              className={cn(
                'relative flex items-center rounded-lg text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors group select-none',
                isCollapsed
                  ? 'justify-center w-11 h-11 mx-auto'
                  : 'w-full gap-3 px-3.5 py-2.5'
              )}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Logout</span>}

              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-rose-950 border border-rose-800 text-rose-200 text-xs font-semibold rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
