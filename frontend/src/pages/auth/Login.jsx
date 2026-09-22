import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Layers,
  Mail,
  Lock,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Sparkles,
  Check,
  Database,
  Shield,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Login() {
  const [email, setEmail] = useState('admin@taskflow.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else if (res.user.role === ROLES.ADMIN) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    } catch (err) {
      setError('Invalid email or password. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    if (role === ROLES.ADMIN) {
      setEmail('admin@taskflow.com');
      setPassword('password123');
    } else {
      setEmail('sarah.jenkins@taskflow.com');
      setPassword('password123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#EEF4FF] via-[#F8FAFC] to-[#E8F0FE] overflow-hidden">
      {/* Background ambient glowing gradient orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle background tech dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header Branding with vibrant icon */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white shadow-xl shadow-blue-500/30 mb-4 transform hover:scale-105 transition-transform">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            TaskFlow
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Role-Based Task Management & Engineering Operations
          </p>
        </div>

        {/* Main Login Glassmorphism Card */}
        <div className="relative bg-white/90 backdrop-blur-xl py-9 px-6 sm:px-10 rounded-3xl border border-white/80 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.12),0_1px_3px_rgba(0,0,0,0.05)] animate-in fade-in zoom-in-95 duration-400">
          {/* Subtle top card gradient highlight */}
          <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80" />

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-xs font-semibold text-rose-600 flex items-center gap-2 animate-in fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Work Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@taskflow.com"
                icon={Mail}
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                icon={Lock}
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] w-4 h-4 cursor-pointer accent-[#2563EB]"
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => alert('Demo Mode: Use the one-click presets below to sign in instantly as Admin or User.')}
                className="text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Gradient Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#2563EB] via-blue-600 to-[#4F46E5] hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer active:scale-[0.99]"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>TECHNICAL INTERVIEW QUICK ACCESS</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin(ROLES.ADMIN)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/80 hover:border-blue-200 text-xs font-semibold text-slate-700 hover:text-[#2563EB] transition-all shadow-2xs group"
              >
                <ShieldCheck className="w-4 h-4 text-[#2563EB] group-hover:scale-110 transition-transform" />
                <span>Fill Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(ROLES.USER)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-emerald-50/80 hover:border-emerald-200 text-xs font-semibold text-slate-700 hover:text-emerald-600 transition-all shadow-2xs group"
              >
                <UserCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Fill User</span>
              </button>
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 flex flex-col gap-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Admin:</span>
                <span className="text-slate-700 font-medium">admin@taskflow.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">User:</span>
                <span className="text-slate-700 font-medium">sarah.jenkins@taskflow.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Badges Footer */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            Spring Security 6
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
            Stateless JWT
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-500" />
            MySQL DB
          </span>
        </div>
      </div>
    </div>
  );
}
