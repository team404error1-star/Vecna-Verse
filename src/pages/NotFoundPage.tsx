import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
          404 Error
        </span>
        <h1 className="text-2xl font-bold text-slate-900">
          Page Not Found
        </h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          The page or gathering you're looking for doesn't exist or may have been moved.
        </p>
      </div>

      <div className="pt-2">
        <Link
          to="/discover"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Explore Events Near You</span>
        </Link>
      </div>
    </div>
  );
}
