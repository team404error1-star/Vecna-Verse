import React from 'react';
import { CalendarX, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-5 bg-slate-200 rounded w-4/5" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function EventListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: 'search' | 'calendar' | 'sparkles';
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon = 'calendar',
}: EmptyStateProps) {
  const IconComponent = {
    search: Search,
    calendar: CalendarX,
    sparkles: Sparkles,
  }[icon];

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 my-6">
      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
        <IconComponent className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm leading-relaxed">{description}</p>
      {(actionLabel && actionHref) && (
        <Link
          to={actionHref}
          className="mt-5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          {actionLabel}
        </Link>
      )}
      {(actionLabel && onAction && !actionHref) && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
