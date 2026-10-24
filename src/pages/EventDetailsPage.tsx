import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Bookmark,
  Share2,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Shield,
  Copy,
  Check,
} from 'lucide-react';
import { EventItem, AttendeeRegistration } from '../types';
import { eventsService } from '../services/events-service';
import { registrationsService } from '../services/registrations-service';
import { savedEventsService } from '../services/saved-events-service';
import { authService } from '../services/auth-service';
import { formatEventDate, formatEventTimeRange, formatPrice, getMapsSearchUrl } from '../utils/formatters';
import { useToast } from '../components/ui/Toast';
import { ConfirmDialog, Modal } from '../components/ui/Modal';
import { EventCard } from '../components/events/EventCard';

export function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [registration, setRegistration] = useState<AttendeeRegistration | null>(null);

  // Modals state
  const [confirmRegisterOpen, setConfirmRegisterOpen] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadEventData() {
      if (!eventId) return;
      setLoading(true);
      try {
        const data = await eventsService.getEventById(eventId);
        setEvent(data);
        if (data) {
          setIsSaved(savedEventsService.isSaved(data.id));
          const reg = await registrationsService.getRegistrationForEvent(data.id);
          setRegistration(reg);

          const related = await eventsService.getRelatedEvents(data.id);
          setRelatedEvents(related);
        }
      } catch (err) {
        console.error('Failed to load event details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEventData();
  }, [eventId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="h-80 bg-slate-200 rounded-2xl" />
        <div className="h-8 w-2/3 bg-slate-200 rounded" />
        <div className="h-4 w-1/3 bg-slate-200 rounded" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-editorial text-2xl font-bold text-[#1E2320]">Event Not Found</h2>
        <p className="text-sm text-[#5F635D]">
          The event you are looking for may have been removed or does not exist.
        </p>
        <Link
          to="/discover"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E3F35] text-white rounded-lg text-xs font-semibold hover:bg-[#163028] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Discover</span>
        </Link>
      </div>
    );
  }

  const isFull = event.registeredCount >= event.capacity;
  const isRegistered = Boolean(registration && registration.status === 'confirmed');
  const spotsLeft = Math.max(0, event.capacity - event.registeredCount);

  const handleToggleBookmark = async () => {
    try {
      const state = await savedEventsService.toggleSave(event.id);
      setIsSaved(state);
      toast({
        type: 'success',
        title: state ? 'Event saved' : 'Removed from bookmarks',
      });
    } catch {
      toast({ type: 'error', title: 'Failed to bookmark event' });
    }
  };

  const handleRegisterConfirm = async () => {
    setActionLoading(true);
    try {
      const reg = await registrationsService.register(event);
      setRegistration(reg);
      setEvent((prev) => (prev ? { ...prev, registeredCount: prev.registeredCount + 1 } : null));
      setConfirmRegisterOpen(false);
      toast({
        type: 'success',
        title: 'Registration Confirmed!',
        description: `Your ticket code is ${reg.ticketCode}. View it anytime in My Registrations.`,
      });
    } catch (err: unknown) {
      toast({
        type: 'error',
        title: 'Registration failed',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!registration) return;
    setActionLoading(true);
    try {
      await registrationsService.cancelRegistration(registration.id);
      setRegistration(null);
      setEvent((prev) => (prev ? { ...prev, registeredCount: Math.max(0, prev.registeredCount - 1) } : null));
      setConfirmCancelOpen(false);
      toast({
        type: 'info',
        title: 'Registration Cancelled',
        description: 'Your spot has been freed up for other community members.',
      });
    } catch {
      toast({
        type: 'error',
        title: 'Cancellation failed',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back Link */}
      <Link
        to="/discover"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F635D] hover:text-[#1E2320] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to events</span>
      </Link>

      {/* Main Cover Banner */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-[#1E2320] shadow-md border border-[#E5E1D8]">
        <img
          src={event.coverImage}
          alt={event.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E2320]/80 via-transparent to-transparent" />

        {/* Floating Top Buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleBookmark}
            className="p-2.5 rounded-lg bg-white/95 hover:bg-white text-[#1E2320] hover:text-[#1E3F35] shadow-xs backdrop-blur-xs transition-colors"
            aria-label={isSaved ? 'Remove from saved' : 'Save event'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#1E3F35] text-[#1E3F35]' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setShareModalOpen(true)}
            className="p-2.5 rounded-lg bg-white/95 hover:bg-white text-[#1E2320] hover:text-[#1E3F35] shadow-xs backdrop-blur-xs transition-colors"
            aria-label="Share event"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Title Metadata Bar */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A3D9C9] mb-1">
            <span>{event.category}</span>
            <span aria-hidden="true">·</span>
            <span>{event.neighborhood}</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Split Grid: Details & Registration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Description & Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white rounded-xl border border-[#E5E1D8]">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#1E3F35] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#1E2320]">Date</p>
                <p className="text-xs text-[#5F635D] mt-0.5">{formatEventDate(event.startDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#1E3F35] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#1E2320]">Time</p>
                <p className="text-xs text-[#5F635D] mt-0.5">
                  {formatEventTimeRange(event.startDate, event.endDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:col-span-2 pt-2 border-t border-[#EBE7DF]">
              <MapPin className="w-5 h-5 text-[#1E3F35] shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#1E2320]">{event.venueName}</p>
                  <a
                    href={getMapsSearchUrl(event.address, event.city)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1E3F35] hover:underline"
                  >
                    <span>View in Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-[#5F635D] mt-0.5">{event.address}</p>
              </div>
            </div>
          </div>

          {/* About Event Section */}
          <div className="space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-[#1E2320]">About this event</h2>
            <div className="text-sm text-[#1E2320]/80 leading-relaxed space-y-3 whitespace-pre-line">
              {event.description}
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="pt-4 border-t border-[#E5E1D8]">
              <h3 className="text-xs font-semibold text-[#8C887E] uppercase tracking-wider mb-2">
                Event Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs text-[#5F635D] bg-[#F4F1EA] rounded-md border border-[#E2DFD8]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Organizer Info Card */}
          <div className="p-6 bg-white rounded-xl border border-[#E5E1D8] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8C887E] uppercase tracking-wider">
                Event Organizer
              </span>
              <Link
                to={`/organizers/${event.organizer.slug || event.organizer.id}`}
                className="text-xs font-semibold text-[#1E3F35] hover:underline"
              >
                View full profile
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#E5E1D8]"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-editorial text-base font-bold text-[#1E2320] truncate">
                  {event.organizer.name}
                </h3>
                <p className="text-xs text-[#5F635D] mt-0.5 line-clamp-2">
                  {event.organizer.bio}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Registration Card & Status */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 bg-white rounded-xl border border-[#E5E1D8] shadow-xs space-y-5">
            {/* Price & Admission */}
            <div className="flex items-baseline justify-between pb-4 border-b border-[#EBE7DF]">
              <div>
                <span className="font-editorial text-2xl font-bold text-[#1E2320] tabular-nums">
                  {formatPrice(event.price)}
                </span>
                {event.price === 0 && (
                  <span className="text-xs text-[#5F635D] ml-1.5">/ attendee</span>
                )}
              </div>
              <span className="text-xs text-[#5F635D]">
                {event.ageRestriction || 'All Ages'}
              </span>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5F635D] font-medium">Capacity</span>
                <span className="tabular-nums font-semibold text-[#1E2320]">
                  {event.registeredCount} / {event.capacity} registered
                </span>
              </div>
              <div className="w-full h-2 bg-[#F4F1EA] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isFull ? 'bg-rose-500' : 'bg-[#1E3F35]'
                  }`}
                  style={{
                    width: `${Math.min(100, (event.registeredCount / event.capacity) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-[#5F635D]">
                {isFull ? (
                  <span className="text-rose-600 font-medium">Event reached maximum capacity</span>
                ) : (
                  <span>{spotsLeft} open spots remaining</span>
                )}
              </p>
            </div>

            {/* Action State: Registered vs Not Registered */}
            {isRegistered ? (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-[#EAF1ED] border border-[#D0E2D9] rounded-lg flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1E3F35] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#1E3F35]">
                    <p className="font-semibold">You're registered!</p>
                    <p className="text-[11px] text-[#1E3F35]/80 mt-0.5">
                      Pass code: <span className="font-mono font-bold">{registration?.ticketCode}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to="/my-registrations"
                    className="flex-1 text-center py-2.5 px-3 text-xs font-semibold text-white bg-[#1E3F35] hover:bg-[#163028] rounded-lg transition-colors"
                  >
                    View Ticket Pass
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmCancelOpen(true)}
                    className="py-2.5 px-3 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                  >
                    Cancel RSVP
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isFull}
                  onClick={() => setConfirmRegisterOpen(true)}
                  className={`w-full py-3 text-xs font-semibold text-white rounded-lg transition-colors shadow-xs ${
                    isFull
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-[#1E3F35] hover:bg-[#163028] cursor-pointer'
                  }`}
                >
                  {isFull ? 'Event Sold Out' : 'Register for Event'}
                </button>
              </div>
            )}

            <div className="pt-2 text-center">
              <p className="text-[11px] text-[#8C887E]">
                Instant confirmation · No booking fees · Digital entry
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Events Section */}
      {relatedEvents.length > 0 && (
        <section className="pt-12 border-t border-[#E5E1D8] space-y-6">
          <h2 className="font-editorial text-2xl font-bold tracking-tight text-[#1E2320]">
            More Events in {event.neighborhood} & {event.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedEvents.map((rel) => (
              <EventCard key={rel.id} event={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Confirm Registration Dialog */}
      <ConfirmDialog
        isOpen={confirmRegisterOpen}
        onClose={() => setConfirmRegisterOpen(false)}
        onConfirm={handleRegisterConfirm}
        isLoading={actionLoading}
        title="Confirm Event Registration"
        message={`Would you like to register for "${event.title}" on ${formatEventDate(
          event.startDate
        )}? A digital entry ticket will be generated for your attendee profile.`}
        confirmLabel="Confirm & Get Pass"
      />

      {/* Confirm Cancellation Dialog */}
      <ConfirmDialog
        isOpen={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        onConfirm={handleCancelConfirm}
        isLoading={actionLoading}
        isDestructive
        title="Cancel Registration"
        message="Are you sure you want to cancel your RSVP? This will free your spot for other neighborhood attendees."
        confirmLabel="Yes, Cancel RSVP"
      />

      {/* Share Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Event"
        description="Share this gathering with your neighbors and friends."
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-2 bg-[#F4F1EA] border border-[#E2DFD8] rounded-lg">
            <input
              type="text"
              readOnly
              value={window.location.href}
              className="flex-1 bg-transparent text-xs text-[#1E2320] border-0 focus:outline-hidden truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-[#1E3F35] text-white rounded-md text-xs font-medium hover:bg-[#163028] flex items-center gap-1 shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
