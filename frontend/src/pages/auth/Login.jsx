import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layers, Mail, Lock, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, INITIAL_MOCK_USERS } from '../../utils/constants';
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
      setError('Invalid email or credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    if (role === ROLES.ADMIN) {
      setEmail('admin@taskflow.com');
      setPassword('adminPass123');
    } else {
      setEmail('sarah.jenkins@taskflow.com');
      setPassword('userPass123');
    }
  };

  return (
    <div className="min-h-screen bg-page flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white shadow-md shadow-blue-500/20 mb-3">
          <Layers className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">
          TaskFlow
        </h2>
        <p className="mt-1 text-sm text-textSecondary font-medium">
          Task Management System
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-card py-8 px-6 sm:px-10 rounded-2xl border border-borderSubtle shadow-card">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-status-danger">
                {error}
              </div>
            )}

            <Input
              label="Work Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@taskflow.com"
              icon={Mail}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-textSecondary cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-borderSubtle text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => alert('Password reset will be available once the backend mail service is connected.')}
                className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center"
              isLoading={isLoading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials for Reviewers */}
          <div className="mt-6 pt-6 border-t border-borderSubtle">
            <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-textSecondary mb-3">
              Technical Interview Quick Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin(ROLES.ADMIN)}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-borderSubtle bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-xs font-medium text-textPrimary hover:text-primary transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Fill Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(ROLES.USER)}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-borderSubtle bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 text-xs font-medium text-textPrimary hover:text-status-success transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-status-success" />
                Fill User
              </button>
            </div>
            <p className="text-[11px] text-center text-textSecondary mt-2.5">
              Admin: <span className="font-mono text-slate-700">admin@taskflow.com</span>
              <br />
              User: <span className="font-mono text-slate-700">sarah.jenkins@taskflow.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
