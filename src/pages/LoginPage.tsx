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
        <Link to="/" className="font-editorial text-3xl font-black tracking-tight text-[#1E2320] inline-block hover:text-[#1E3F35] transition-colors">
          Locora
        </Link>
        <h1 className="font-editorial text-2xl font-bold text-[#1E2320]">Sign in to your account</h1>
        <p className="text-xs text-[#5F635D]">
          Access your event tickets, saved gatherings, or organizer console.
        </p>
      </div>

      {/* Demo Quick Logins */}
      {isDemoMode() && (
        <div className="bg-[#EAF1ED] border border-[#D0E2D9] rounded-2xl p-4 space-y-2.5 text-xs">
          <p className="font-semibold text-[#1E3F35] flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#1E3F35]" />
            <span>Instant Demo Profile Selection:</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('attendee')}
              className="p-2.5 bg-white border border-[#D0E2D9] rounded-xl text-left hover:border-[#1E3F35] transition-colors cursor-pointer"
            >
              <div className="font-bold text-[#1E2320]">Attendee</div>
              <div className="text-[11px] text-[#5F635D] truncate">Sarah Chen</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('organizer')}
              className="p-2.5 bg-white border border-[#D0E2D9] rounded-xl text-left hover:border-[#1E3F35] transition-colors cursor-pointer"
            >
              <div className="font-bold text-[#1E2320]">Organizer</div>
              <div className="text-[11px] text-[#5F635D] truncate">Marcus Vance</div>
            </button>
          </div>
          <p className="text-[10px] text-[#1E3F35]/80 leading-tight">
            Independent backend connects via REST endpoints configured in .env.
          </p>
        </div>
      )}

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E1D8] shadow-xs space-y-4"
      >
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C887E]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#E2DFD8] rounded-lg text-[#1E2320] focus:border-[#1E3F35]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#1E2320]">Password</label>
            <Link
              to="/forgot-password"
              className="text-[11px] text-[#1E3F35] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C887E]" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-9 pr-10 py-2.5 text-xs bg-white border border-[#E2DFD8] rounded-lg text-[#1E2320] focus:border-[#1E3F35]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C887E] hover:text-[#1E2320] p-0.5"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#1E3F35] hover:bg-[#163028] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          {loading ? 'Authenticating...' : 'Sign In with Email'}
        </button>

        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E1D8]" />
          </div>
          <span className="relative bg-white px-2 text-[11px] uppercase tracking-wider text-[#8C887E]">
            or continue with
          </span>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setError('');
            try {
              const user = await authService.loginWithGoogle();
              toast({
                type: 'success',
                title: `Signed in as ${user.name}`,
                description: `Welcome to Locora!`,
              });
              navigate('/dashboard');
            } catch (err: unknown) {
              setError(err instanceof Error ? err.message : 'Google sign-in failed');
            } finally {
              setLoading(false);
            }
          }}
          className="w-full py-2.5 bg-white hover:bg-[#F4F1EA] text-[#1E2320] border border-[#E2DFD8] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign In with Google</span>
        </button>
      </form>

      <p className="text-center text-xs text-[#5F635D]">
        Don't have an account?{' '}
        <Link to="/signup" className="text-[#1E3F35] font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
