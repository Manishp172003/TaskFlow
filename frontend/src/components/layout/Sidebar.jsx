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
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import { cn, getInitials } from '../../utils/helpers';
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
    { name: 'Tasks', path: '/user/tasks', icon: CheckSquare },
  ];

  const userBottomNav = [
    { name: 'Settings', path: '/user/profile', icon: Settings },
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
            'relative flex items-center rounded-xl text-sm font-medium transition-all group select-none',
            isCollapsed
              ? 'justify-center w-11 h-11 mx-auto'
              : 'gap-3 px-3.5 py-3',
            isActive
              ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          )
        }
      >
        <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />

        {/* Text label when expanded */}
        {!isCollapsed && <span className="flex-1 truncate tracking-tight">{item.name}</span>}

        {/* Tooltip when collapsed */}
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
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 bg-[#0B132B] border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'lg:w-20 w-64' : 'w-64'
        )}
      >
        {/* Top Brand Header */}
        <div>
          <div
            className={cn(
              'flex items-center transition-all duration-300',
              isCollapsed
                ? 'px-3 py-6 justify-center flex-col gap-2'
                : 'px-6 py-6 justify-between'
            )}
          >
            {/* Logo and Brand Name */}
            <div className={cn('flex items-center gap-3', isCollapsed ? 'justify-center' : '')}>
              <div
                className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-600/30 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                onClick={onToggleCollapse}
                title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>

              {!isCollapsed && (
                <span className="text-lg font-bold tracking-tight text-white block leading-none">
                  TaskFlow
                </span>
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
          <nav className={cn('space-y-1.5 pt-2', isCollapsed ? 'px-2' : 'px-4')}>
            {mainItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="pb-5">
          {/* Settings and Logout */}
          <div className={cn('space-y-1.5 pb-4', isCollapsed ? 'px-2' : 'px-4')}>
            {bottomItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}

            <button
              onClick={handleLogout}
              className={cn(
                'relative flex items-center rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors group select-none',
                isCollapsed
                  ? 'justify-center w-11 h-11 mx-auto'
                  : 'w-full gap-3 px-3.5 py-3'
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

          {/* Bottom Elevated User Card matching reference */}
          <div className={cn('pt-2 border-t border-slate-800/80', isCollapsed ? 'px-2' : 'px-4')}>
            {!isCollapsed ? (
              <div
                onClick={async () => {
                  const nextRole = isAdmin ? ROLES.USER : ROLES.ADMIN;
                  await switchRole(nextRole);
                  success(`Switched role to ${nextRole === ROLES.ADMIN ? 'Admin' : 'User'}`);
                  navigate(nextRole === ROLES.ADMIN ? '/admin/dashboard' : '/user/dashboard');
                }}
                className="p-3 rounded-2xl bg-[#141E34] border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 hover:bg-[#18233C] transition-all group"
                title="Click to switch role (Admin <-> User)"
              >
                <div className="flex items-center gap-3">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                      {getInitials(user?.name || 'Admin')}
                    </div>
                  )}

                  <div className="text-left">
                    <span className="text-xs font-bold text-white block leading-tight">
                      {user?.name || 'Admin'}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block leading-tight mt-0.5">
                      {isAdmin ? 'ADMINISTRATOR' : 'TEAM MEMBER'}
                    </span>
                  </div>
                </div>

                <div className="p-1 rounded-md bg-slate-800/60 text-slate-400 group-hover:text-blue-400 transition-colors">
                  {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={async () => {
                    const nextRole = isAdmin ? ROLES.USER : ROLES.ADMIN;
                    await switchRole(nextRole);
                    success(`Switched role to ${nextRole === ROLES.ADMIN ? 'Admin' : 'User'}`);
                    navigate(nextRole === ROLES.ADMIN ? '/admin/dashboard' : '/user/dashboard');
                  }}
                  className="w-11 h-11 rounded-xl bg-[#141E34] border border-slate-800 flex items-center justify-center hover:border-slate-700 hover:bg-[#18233C] text-slate-300 transition-all"
                  title={`Role: ${role} (Click to toggle)`}
                >
                  {isAdmin ? (
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                  ) : (
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
