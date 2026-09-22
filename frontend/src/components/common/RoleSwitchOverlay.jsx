import React from 'react';
import { ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

export default function RoleSwitchOverlay() {
  const { isSwitchingRole, switchingTargetRole } = useAuth();

  if (!isSwitchingRole) return null;

  const isAdmin = switchingTargetRole === ROLES.ADMIN;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
    >
      <div className="relative bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center overflow-hidden">
        {/* Ambient background glow */}
        <div
          className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-40 ${
            isAdmin ? 'bg-blue-500' : 'bg-emerald-500'
          }`}
        />
        <div
          className={`absolute -bottom-16 -left-16 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-30 ${
            isAdmin ? 'bg-indigo-500' : 'bg-teal-500'
          }`}
        />

        {/* Central Icon Ring with rotating glow */}
        <div className="relative flex justify-center mb-5">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg transition-transform duration-500 animate-pulse ${
              isAdmin
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 ring-4 ring-blue-500/10 shadow-blue-500/20'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 ring-4 ring-emerald-500/10 shadow-emerald-500/20'
            }`}
          >
            {isAdmin ? (
              <ShieldCheck className="w-8 h-8 animate-in zoom-in-50 duration-300" />
            ) : (
              <UserCheck className="w-8 h-8 animate-in zoom-in-50 duration-300" />
            )}
          </div>

          <div className="absolute -top-1 -right-1">
            <span className="flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isAdmin ? 'bg-blue-400' : 'bg-emerald-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isAdmin ? 'bg-blue-500' : 'bg-emerald-500'
                }`}
              />
            </span>
          </div>
        </div>

        {/* Text Header */}
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center justify-center gap-1.5 mb-1.5">
          {isAdmin ? 'Switching to Admin Console' : 'Switching to User Workspace'}
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        </h3>

        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed mb-6">
          {isAdmin
            ? 'Configuring administrative privileges, system metrics, and team management...'
            : 'Personalizing your workspace, task boards, and assigned workflows...'}
        </p>

        {/* Sleek dynamic progress bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className={`h-full rounded-full animate-pulse transition-all duration-500 ${
              isAdmin
                ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 w-full'
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 w-full'
            }`}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>TaskFlow Security Gateway</span>
          <span className="text-slate-400 font-mono">Syncing...</span>
        </div>
      </div>
    </div>
  );
}
