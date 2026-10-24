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
          {loading ? 'Creating Account...' : 'Complete Sign Up'}
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
