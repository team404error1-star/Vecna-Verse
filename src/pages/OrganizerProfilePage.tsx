import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Globe, Mail, Calendar, Users, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Organizer, EventItem } from '../types';
import { organizersService } from '../services/organizers-service';
import { EventCard } from '../components/events/EventCard';
import { EventListSkeleton } from '../components/ui/LoadingSkeleton';

export function OrganizerProfilePage() {
  const { organizerId } = useParams<{ organizerId: string }>();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrganizer() {
      if (!organizerId) return;
      setLoading(true);
      try {
        const org = await organizersService.getOrganizerById(organizerId);
        setOrganizer(org);
        if (org) {
          const orgEvents = await organizersService.getOrganizerEvents(org.id);
          setEvents(orgEvents);
        }
      } finally {
        setLoading(false);
      }
    }
    loadOrganizer();
  }, [organizerId]);

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-16 text-center text-xs text-[#5F635D]">Loading organizer profile...</div>;
  }

  if (!organizer) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-[#1E2320]">Organizer Not Found</h2>
        <Link to="/discover" className="text-xs font-semibold text-[#1E3F35] underline">
          Explore all events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Link
        to="/discover"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F635D] hover:text-[#1E2320] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to events</span>
      </Link>

      {/* Organizer Header Card */}
      <div className="bg-white rounded-2xl border border-[#E5E1D8] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={organizer.avatar}
            alt={organizer.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-2xl object-cover border border-[#E2DFD8] shrink-0 shadow-xs"
          />

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1E2320]">
                {organizer.name}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1E3F35] bg-[#EAF1ED] px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Host</span>
              </span>
            </div>

            <p className="text-xs text-[#5F635D] leading-relaxed max-w-2xl">
              {organizer.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#5F635D] pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8C887E]" />
                <span>{organizer.location}</span>
              </span>

              {organizer.website && (
                <a
                  href={organizer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#1E3F35] hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website</span>
                </a>
              )}

              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#8C887E]" />
                <span>{organizer.email}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EBE7DF]">
          <div>
            <span className="text-[11px] text-[#5F635D] uppercase tracking-wider font-semibold">
              Events Hosted
            </span>
            <p className="font-editorial text-2xl font-bold text-[#1E2320] tabular-nums mt-0.5">
              {organizer.eventsCount}
            </p>
          </div>

          <div>
            <span className="text-[11px] text-[#5F635D] uppercase tracking-wider font-semibold">
              Community Reach
            </span>
            <p className="font-editorial text-2xl font-bold text-[#1E3F35] tabular-nums mt-0.5">
              {organizer.totalAttendeesServed}+ Attendees
            </p>
          </div>

          <div>
            <span className="text-[11px] text-[#5F635D] uppercase tracking-wider font-semibold">
              Active Listings
            </span>
            <p className="font-editorial text-2xl font-bold text-[#1E3F35] tabular-nums mt-0.5">
              {events.length}
            </p>
          </div>
        </div>
      </div>

      {/* Events Hosted Section */}
      <div className="space-y-6">
        <h2 className="font-editorial text-2xl font-bold tracking-tight text-[#1E2320]">
          Events by {organizer.name} ({events.length})
        </h2>

        {events.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-dashed border-[#E5E1D8] text-xs text-[#5F635D]">
            No public events currently scheduled.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
