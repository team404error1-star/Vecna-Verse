import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({
        type: 'success',
        title: 'Reset Link Sent',
        description: `Instructions have been sent to ${email} (simulated in demo mode).`,
      });
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Sign In</span>
      </Link>

      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold text-slate-900">Reset your password</h1>
        <p className="text-xs text-slate-500">
          Enter your registered email and we'll send you recovery instructions.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center space-y-4 shadow-2xs">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-semibold text-slate-900">Check your inbox</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            We've sent a password reset link to <span className="font-semibold">{email}</span>. Please check your spam folder if you do not receive it in a few minutes.
          </p>
          <Link
            to="/login"
            className="inline-block px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl"
          >
            Return to Login
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4"
        >
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
                placeholder="name@example.com"
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            {loading ? 'Sending Instructions...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </div>
  );
}
