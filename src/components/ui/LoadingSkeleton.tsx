import React from 'react';
import { CalendarX, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#E5E1D8] overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-[#EBE7DF]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-[#EBE7DF] rounded w-1/3" />
        <div className="h-5 bg-[#EBE7DF] rounded w-4/5" />
        <div className="h-4 bg-[#EBE7DF] rounded w-2/3" />
        <div className="pt-2 border-t border-[#EBE7DF] flex items-center justify-between">
          <div className="h-4 bg-[#EBE7DF] rounded w-1/4" />
          <div className="h-4 bg-[#EBE7DF] rounded w-1/4" />
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
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-[#E5E1D8] my-6">
      <div className="w-12 h-12 rounded-xl bg-[#F4F1EA] flex items-center justify-center text-[#1E3F35] mb-4">
        <IconComponent className="w-6 h-6" />
      </div>
      <h3 className="font-editorial text-lg font-bold text-[#1E2320]">{title}</h3>
      <p className="text-sm text-[#5F635D] mt-1 max-w-sm leading-relaxed">{description}</p>
      {(actionLabel && actionHref) && (
        <Link
          to={actionHref}
          className="mt-5 px-4 py-2 text-xs font-semibold text-white bg-[#1E3F35] rounded-lg hover:bg-[#163028] transition-colors whitespace-nowrap cursor-pointer"
        >
          {actionLabel}
        </Link>
      )}
      {(actionLabel && onAction && !actionHref) && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 text-xs font-semibold text-white bg-[#1E3F35] rounded-lg hover:bg-[#163028] transition-colors whitespace-nowrap cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
