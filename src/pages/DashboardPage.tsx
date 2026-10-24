import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Bookmark, Sparkles, MapPin, ArrowRight, Calendar, Users } from 'lucide-react';
import { AttendeeRegistration, EventItem, UserProfile } from '../types';
import { authService } from '../services/auth-service';
import { registrationsService } from '../services/registrations-service';
import { savedEventsService } from '../services/saved-events-service';
import { formatEventDate, formatEventTimeRange } from '../utils/formatters';
import { EventCard } from '../components/events/EventCard';

export function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [registrations, setRegistrations] = useState<AttendeeRegistration[]>([]);
  const [savedEvents, setSavedEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const regs = await registrationsService.getMyRegistrations();
        const activeRegs = regs.filter((r) => r.status === 'confirmed');
        setRegistrations(activeRegs);

        const saved = await savedEventsService.getSavedEvents();
        setSavedEvents(saved);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-[#1E2320]">Sign in to view your dashboard</h2>
        <p className="text-sm text-[#5F635D]">
          Sign in or switch to a demo profile to access your tickets, saved events, and recommendations.
        </p>
        <Link
          to="/login"
          className="inline-block px-5 py-2.5 bg-[#1E3F35] text-white rounded-lg text-xs font-semibold hover:bg-[#163028]"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const nextUpcoming = registrations[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl border border-[#E5E1D8] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover border-2 border-[#E5E1D8] shrink-0"
          />
          <div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1E2320]">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-[#5F635D] mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#8C887E]" />
              <span>{user.neighborhood}</span>
              <span aria-hidden="true" className="text-[#C8C4BC]">·</span>
              <span>{user.interests.slice(0, 2).join(', ')}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Link
            to="/profile"
            className="flex-1 sm:flex-none text-center px-4 py-2 bg-[#F4F1EA] hover:bg-[#EBE7DF] text-[#1E2320] text-xs font-medium rounded-lg transition-colors border border-[#E2DFD8]"
          >
            Edit Profile
          </Link>
          <Link
            to="/discover"
            className="flex-1 sm:flex-none text-center px-4 py-2 bg-[#1E3F35] hover:bg-[#163028] text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Discover Events
          </Link>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border border-[#E5E1D8] space-y-1 shadow-2xs">
          <span className="text-xs font-medium text-[#5F635D] flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-[#1E3F35]" />
            <span>Active Registrations</span>
          </span>
          <p className="font-editorial text-3xl font-bold text-[#1E2320] tabular-nums">
            {registrations.length}
          </p>
          <Link
            to="/my-registrations"
            className="text-[11px] text-[#1E3F35] font-semibold hover:underline block pt-1"
          >
            View tickets →
          </Link>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E5E1D8] space-y-1 shadow-2xs">
          <span className="text-xs font-medium text-[#5F635D] flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-[#1E3F35]" />
            <span>Saved Bookmarks</span>
          </span>
          <p className="font-editorial text-3xl font-bold text-[#1E2320] tabular-nums">
            {savedEvents.length}
          </p>
          <Link
            to="/saved"
            className="text-[11px] text-[#1E3F35] font-semibold hover:underline block pt-1"
          >
            View saved list →
          </Link>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E5E1D8] space-y-1 shadow-2xs">
          <span className="text-xs font-medium text-[#5F635D] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#1E3F35]" />
            <span>SmartMatch Hub</span>
          </span>
          <p className="font-editorial text-3xl font-bold text-[#1E2320]">Ready</p>
          <Link
            to="/smart-match"
            className="text-[11px] text-[#1E3F35] font-semibold hover:underline block pt-1"
          >
            Explore matches →
          </Link>
        </div>
      </div>

      {/* Next Upcoming Ticket Feature */}
      {nextUpcoming && (
        <div className="bg-white rounded-2xl border border-[#E5E1D8] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EBE7DF]">
            <h2 className="font-editorial text-base font-bold text-[#1E2320]">
              Your Next Event
            </h2>
            <Link
              to="/my-registrations"
              className="text-xs font-semibold text-[#1E3F35] hover:underline"
            >
              All registrations ({registrations.length})
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-60 aspect-[16/10] rounded-xl overflow-hidden bg-[#F4F1EA] shrink-0 border border-[#E2DFD8]">
              <img
                src={nextUpcoming.event.coverImage}
                alt={nextUpcoming.event.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-3">
              <div className="text-xs text-[#1E3F35] font-semibold uppercase tracking-wider">
                {nextUpcoming.event.category}
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#1E2320]">
                <Link to={`/events/${nextUpcoming.event.id}`} className="hover:text-[#1E3F35]">
                  {nextUpcoming.event.title}
                </Link>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#5F635D]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#8C887E]" />
                  <span>{formatEventDate(nextUpcoming.event.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8C887E]" />
                  <span>{nextUpcoming.event.venueName}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <span className="text-xs font-mono font-semibold bg-[#F4F1EA] text-[#1E2320] px-3 py-1.5 rounded-lg border border-[#E2DFD8]">
                  Ticket: {nextUpcoming.ticketCode}
                </span>
                <Link
                  to="/my-registrations"
                  className="text-xs font-semibold text-[#1E3F35] hover:underline"
                >
                  View Digital Pass →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Events Strip */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-2xl font-bold tracking-tight text-[#1E2320]">
              Saved Events
            </h2>
            <p className="text-xs text-[#5F635D] mt-0.5">
              Events you've bookmarked to check back later.
            </p>
          </div>
          <Link
            to="/saved"
            className="text-xs font-semibold text-[#1E3F35] hover:underline"
          >
            Manage saved ({savedEvents.length})
          </Link>
        </div>

        {savedEvents.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-dashed border-[#E5E1D8] text-xs text-[#5F635D]">
            No saved events yet. Browse events in{' '}
            <Link to="/discover" className="text-[#1E3F35] font-semibold underline">
              Discover
            </Link>{' '}
            and click the bookmark icon to save them here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedEvents.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
