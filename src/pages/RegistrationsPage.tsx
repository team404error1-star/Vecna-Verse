import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin, Clock, QrCode, XCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AttendeeRegistration } from '../types';
import { registrationsService } from '../services/registrations-service';
import { formatEventDate, formatEventTimeRange } from '../utils/formatters';
import { useToast } from '../components/ui/Toast';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/LoadingSkeleton';

export function RegistrationsPage() {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<AttendeeRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'upcoming' | 'past_cancelled'>('upcoming');

  const [selectedPass, setSelectedPass] = useState<AttendeeRegistration | null>(null);
  const [cancelTarget, setCancelTarget] = useState<AttendeeRegistration | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function loadRegistrations() {
      setLoading(true);
      try {
        const data = await registrationsService.getMyRegistrations();
        setRegistrations(data);
      } finally {
        setLoading(false);
      }
    }
    loadRegistrations();
  }, []);

  const handleCancelRegistration = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await registrationsService.cancelRegistration(cancelTarget.id);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === cancelTarget.id ? { ...r, status: 'cancelled' } : r))
      );
      setCancelTarget(null);
      toast({
        type: 'info',
        title: 'RSVP Cancelled',
        description: `Your registration for "${cancelTarget.event.title.slice(0, 30)}..." was cancelled.`,
      });
    } catch {
      toast({
        type: 'error',
        title: 'Failed to cancel RSVP',
      });
    } finally {
      setCancelling(false);
    }
  };

  const upcomingList = registrations.filter((r) => r.status === 'confirmed');
  const pastList = registrations.filter((r) => r.status !== 'confirmed');
  const displayedList = filterTab === 'upcoming' ? upcomingList : pastList;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E1D8]">
        <div>
          <h1 className="font-editorial text-3xl font-bold tracking-tight text-[#1E2320]">
            My Registrations
          </h1>
          <p className="text-sm text-[#5F635D] mt-1">
            Access your event tickets, digital entry codes, and manage your RSVPs.
          </p>
        </div>

        <Link
          to="/discover"
          className="self-start sm:self-auto px-4 py-2 bg-[#1E3F35] hover:bg-[#163028] text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Discover More Events
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E1D8]">
        <button
          type="button"
          onClick={() => setFilterTab('upcoming')}
          className={`pb-3 px-2 text-xs font-semibold transition-colors border-b-2 ${
            filterTab === 'upcoming'
              ? 'border-[#1E3F35] text-[#1E3F35]'
              : 'border-transparent text-[#5F635D] hover:text-[#1E2320]'
          }`}
        >
          Upcoming ({upcomingList.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterTab('past_cancelled')}
          className={`pb-3 px-2 text-xs font-semibold transition-colors border-b-2 ${
            filterTab === 'past_cancelled'
              ? 'border-[#1E3F35] text-[#1E3F35]'
              : 'border-transparent text-[#5F635D] hover:text-[#1E2320]'
          }`}
        >
          Cancelled & Past ({pastList.length})
        </button>
      </div>

      {/* Registrations List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-28 bg-[#F4F1EA] rounded-xl" />
          <div className="h-28 bg-[#F4F1EA] rounded-xl" />
        </div>
      ) : displayedList.length === 0 ? (
        <EmptyState
          icon="calendar"
          title={filterTab === 'upcoming' ? 'No upcoming registrations' : 'No past or cancelled registrations'}
          description={
            filterTab === 'upcoming'
              ? 'You have not registered for any upcoming events. Explore events in your neighborhood!'
              : 'No records to show here.'
          }
          actionLabel={filterTab === 'upcoming' ? 'Browse Events' : undefined}
          actionHref="/discover"
        />
      ) : (
        <div className="space-y-4">
          {displayedList.map((reg) => (
            <div
              key={reg.id}
              className="bg-white rounded-xl border border-[#E5E1D8] p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#1E3F35]/30 transition-colors shadow-2xs"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F4F1EA] shrink-0 border border-[#E2DFD8]">
                  <img
                    src={reg.event.coverImage}
                    alt={reg.event.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E3F35]">
                    <span>{reg.event.category}</span>
                    <span aria-hidden="true" className="text-[#C8C4BC]">·</span>
                    <span className="text-[#5F635D] font-normal normal-case">{reg.event.neighborhood}</span>
                  </div>

                  <h3 className="font-editorial text-lg font-bold text-[#1E2320] leading-snug">
                    <Link to={`/events/${reg.event.id}`} className="hover:text-[#1E3F35]">
                      {reg.event.title}
                    </Link>
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#5F635D] pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8C887E]" />
                      {formatEventDate(reg.event.startDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#8C887E]" />
                      {formatEventTimeRange(reg.event.startDate, reg.event.endDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8C887E]" />
                      {reg.event.venueName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                {reg.status === 'confirmed' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedPass(reg)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1E2320] bg-[#F4F1EA] hover:bg-[#EBE7DF] border border-[#E2DFD8] rounded-lg transition-colors"
                    >
                      <QrCode className="w-4 h-4 text-[#1E3F35]" />
                      <span>View Pass</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCancelTarget(reg)}
                      className="px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                    >
                      Cancel RSVP
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-medium text-[#8C887E] px-3 py-1 bg-[#F4F1EA] rounded-md border border-[#E2DFD8]">
                    Cancelled
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Digital Pass Modal */}
      {selectedPass && (
        <Modal
          isOpen={Boolean(selectedPass)}
          onClose={() => setSelectedPass(null)}
          title="Digital Entry Pass"
          description="Present this pass upon arrival at the venue."
        >
          <div className="space-y-6">
            <div className="bg-[#1E2320] text-white rounded-2xl p-6 text-center space-y-4 shadow-md">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A3D9C9]">
                LOCORA VERIFIED ATTENDEE PASS
              </span>
              <h3 className="font-editorial text-xl font-bold leading-tight">
                {selectedPass.event.title}
              </h3>
              <p className="text-xs text-white/80">
                {formatEventDate(selectedPass.event.startDate)} · {selectedPass.event.venueName}
              </p>

              {/* Simulated QR Code Canvas */}
              <div className="w-40 h-40 bg-white rounded-xl mx-auto p-3 flex flex-col items-center justify-center shadow-inner">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-[#FAF8F5] border border-[#E2DFD8] rounded-lg">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        (i * 7) % 3 === 0 || i === 0 || i === 5 || i === 30 || i === 35
                          ? 'bg-[#1E2320]'
                          : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="font-mono text-sm tracking-wider font-bold text-[#A3D9C9]">
                {selectedPass.ticketCode}
              </div>
              <div className="text-[11px] text-white/60">
                Attendee: {selectedPass.userName} ({selectedPass.userEmail})
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelRegistration}
        isLoading={cancelling}
        isDestructive
        title="Cancel Event RSVP"
        message={`Are you sure you want to cancel your RSVP for "${cancelTarget?.event.title}"? Your spot will be made available to other attendees immediately.`}
        confirmLabel="Yes, Cancel RSVP"
      />
    </div>
  );
}
