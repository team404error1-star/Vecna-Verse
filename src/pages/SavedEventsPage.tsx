import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowLeft } from 'lucide-react';
import { EventItem } from '../types';
import { savedEventsService } from '../services/saved-events-service';
import { EventCard } from '../components/events/EventCard';
import { EventListSkeleton, EmptyState } from '../components/ui/LoadingSkeleton';

export function SavedEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    setLoading(true);
    try {
      const data = await savedEventsService.getSavedEvents();
      setEvents(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E1D8]">
        <div>
          <h1 className="font-editorial text-3xl font-bold tracking-tight text-[#1E2320]">
            Saved Events
          </h1>
          <p className="text-sm text-[#5F635D] mt-1">
            Keep track of neighborhood gatherings you're interested in attending.
          </p>
        </div>

        <Link
          to="/discover"
          className="text-xs font-semibold text-[#1E3F35] hover:underline transition-colors self-start sm:self-auto"
        >
          Explore more events →
        </Link>
      </div>

      {/* Grid of Saved Events */}
      {loading ? (
        <EventListSkeleton count={3} />
      ) : events.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No saved events yet"
          description="Click the bookmark icon on any event card across Locora to save it here for quick access."
          actionLabel="Discover Events"
          actionHref="/discover"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onBookmarkChange={loadSaved} />
          ))}
        </div>
      )}
    </div>
  );
}
