import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/auth-service';
import { useToast } from '../components/ui/Toast';

export function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'attendee' | 'organizer'>('attendee');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const user = await authService.signup(name.trim(), email.trim(), role);
      toast({
        type: 'success',
        title: 'Account Created',
        description: `Welcome to Locora, ${user.name}!`,
      });
      if (role === 'organizer') {
        navigate('/organizer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      <div className="text-center space-y-2">
        <Link to="/" className="font-editorial text-3xl font-black tracking-tight text-[#1E2320] inline-block hover:text-[#1E3F35] transition-colors">
          Locora
        </Link>
        <h1 className="font-editorial text-2xl font-bold text-[#1E2320]">Create your Locora account</h1>
        <p className="text-xs text-[#5F635D]">
          Discover hyperlocal events, save favorites, or publish community gatherings.
        </p>
      </div>

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
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C887E]" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              required
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#E2DFD8] rounded-lg text-[#1E2320] focus:border-[#1E3F35]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C887E]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              required
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#E2DFD8] rounded-lg text-[#1E2320] focus:border-[#1E3F35]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C887E]" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
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

        <div>
          <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
            I am joining primarily as:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('attendee')}
              className={`p-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                role === 'attendee'
                  ? 'border-[#1E3F35] bg-[#EAF1ED] text-[#1E3F35] font-semibold'
                  : 'border-[#E2DFD8] bg-[#F4F1EA] text-[#5F635D] hover:bg-[#EBE7DF]'
              }`}
            >
              Attendee
            </button>
            <button
              type="button"
              onClick={() => setRole('organizer')}
              className={`p-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                role === 'organizer'
                  ? 'border-[#1E3F35] bg-[#EAF1ED] text-[#1E3F35] font-semibold'
                  : 'border-[#E2DFD8] bg-[#F4F1EA] text-[#5F635D] hover:bg-[#EBE7DF]'
              }`}
            >
              Organizer
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#1E3F35] hover:bg-[#163028] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          {loading ? 'Creating Account...' : 'Complete Sign Up with Email'}
        </button>

        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E1D8]" />
          </div>
          <span className="relative bg-white px-2 text-[11px] uppercase tracking-wider text-[#8C887E]">
            or sign up with
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
                title: `Account Ready`,
                description: `Welcome to Locora, ${user.name}!`,
              });
              navigate('/dashboard');
            } catch (err: unknown) {
              setError(err instanceof Error ? err.message : 'Google sign-up failed');
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
          <span>Continue with Google</span>
        </button>
      </form>

      <p className="text-center text-xs text-[#5F635D]">
        Already have an account?{' '}
        <Link to="/login" className="text-[#1E3F35] font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
