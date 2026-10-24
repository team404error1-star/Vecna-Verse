import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';
import { authService } from '../services/auth-service';
import { useToast } from '../components/ui/Toast';
import { isDemoMode } from '../services/api-client';

export function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState('sarah.chen@example.com');
  const [password, setPassword] = useState('locora2026demo');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide your email and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const user = await authService.login(email.trim(), password);
      toast({
        type: 'success',
        title: `Signed in as ${user.name}`,
        description: `Welcome back to Locora (${user.role} role).`,
      });
      if (user.role === 'organizer') {
        navigate('/organizer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: 'attendee' | 'organizer') => {
    setLoading(true);
    try {
      authService.quickSwitchUser(role);
      const user = authService.getCurrentUser()!;
      toast({
        type: 'success',
        title: `Demo Login: ${user.name}`,
        description: `Active as ${role}. Simulated in local browser storage.`,
      });
      if (role === 'organizer') {
        navigate('/organizer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      {/* Brand & Heading */}
      <div className="text-center space-y-2">
        <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900 inline-block">
          Locora
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Sign in to your account</h1>
        <p className="text-xs text-slate-500">
          Access your event tickets, saved gatherings, or organizer console.
        </p>
      </div>

      {/* Demo Quick Logins */}
      {isDemoMode() && (
        <div className="bg-slate-100 rounded-2xl p-4 space-y-2.5 text-xs">
          <p className="font-semibold text-slate-800 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Instant Demo Profile Selection:</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('attendee')}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-left hover:border-indigo-400 transition-colors cursor-pointer"
            >
              <div className="font-bold text-slate-900">Attendee</div>
              <div className="text-[11px] text-slate-500 truncate">Sarah Chen</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('organizer')}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-left hover:border-indigo-400 transition-colors cursor-pointer"
            >
              <div className="font-bold text-slate-900">Organizer</div>
              <div className="text-[11px] text-slate-500 truncate">Marcus Vance</div>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Independent backend connects via REST endpoints configured in .env.
          </p>
        </div>
      )}

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4"
      >
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <Link
              to="/forgot-password"
              className="text-[11px] text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
