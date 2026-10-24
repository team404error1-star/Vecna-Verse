import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { EventCategory, EventItem } from '../types';
import { DEMO_CATEGORIES, DEMO_NEIGHBORHOODS } from '../mocks/demo-data';
import { eventsService } from '../services/events-service';
import { useToast } from '../components/ui/Toast';
import { PRESET_COVER_IMAGES } from './CreateEventPage';

export function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventItem | null>(null);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('Food & Community');
  const [coverImage, setCoverImage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('Downtown Arts District');
  const [price, setPrice] = useState('0');
  const [capacity, setCapacity] = useState('50');
  const [tagsInput, setTagsInput] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      if (!eventId) return;
      setLoading(true);
      try {
        const data = await eventsService.getEventById(eventId);
        if (data) {
          setEvent(data);
          setTitle(data.title);
          setSummary(data.summary);
          setDescription(data.description);
          setCategory(data.category);
          setCoverImage(data.coverImage);
          setStartDate(data.startDate.slice(0, 16));
          setEndDate(data.endDate.slice(0, 16));
          setVenueName(data.venueName);
          setAddress(data.address);
          setNeighborhood(data.neighborhood);
          setPrice(String(data.price));
          setCapacity(String(data.capacity));
          setTagsInput(data.tags.join(', '));
        }
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [eventId]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required.';
    if (!description.trim()) errs.description = 'Description is required.';
    if (!venueName.trim()) errs.venueName = 'Venue name is required.';
    if (!address.trim()) errs.address = 'Street address is required.';

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime())) errs.startDate = 'Valid start date & time required.';
    if (isNaN(end.getTime())) errs.endDate = 'Valid end date & time required.';
    if (end <= start) errs.endDate = 'End time must be after start time.';

    const capNum = Number(capacity);
    if (isNaN(capNum) || capNum <= 0) errs.capacity = 'Capacity must be at least 1 spot.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId || !validate()) return;

    setSubmitting(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await eventsService.updateEvent(eventId, {
        title: title.trim(),
        summary: summary.trim(),
        description: description.trim(),
        category,
        coverImage,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        venueName: venueName.trim(),
        address: address.trim(),
        neighborhood,
        price: Number(price),
        capacity: Number(capacity),
        tags,
      });

      toast({
        type: 'success',
        title: 'Event Updated',
        description: 'Changes have been saved to your listing.',
      });

      navigate(`/events/${eventId}`);
    } catch {
      toast({
        type: 'error',
        title: 'Failed to update event',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-slate-500">Loading event data...</div>;
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Event Not Found</h2>
        <Link to="/organizer/events" className="text-xs font-semibold text-indigo-600 underline">
          Return to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        to="/organizer/events"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F635D] hover:text-[#1E2320] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Events</span>
      </Link>

      <div className="pb-4 border-b border-[#E5E1D8]">
        <h1 className="font-editorial text-3xl font-bold tracking-tight text-[#1E2320]">
          Edit Event Details
        </h1>
        <p className="text-sm text-[#5F635D] mt-1">
          Update event schedules, capacity limits, or venue location.
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E1D8] shadow-xs">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs bg-white border border-[#E2DFD8] rounded-lg p-3 text-[#1E2320] focus:border-[#1E3F35]"
            />
            {errors.title && <p className="text-[11px] text-rose-600 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full text-xs bg-white border border-[#E2DFD8] rounded-lg p-3 text-[#1E2320] focus:border-[#1E3F35]"
              >
                {DEMO_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
                Neighborhood *
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full text-xs bg-white border border-[#E2DFD8] rounded-lg p-3 text-[#1E2320] focus:border-[#1E3F35]"
              >
                {DEMO_NEIGHBORHOODS.filter((n) => n !== 'All Neighborhoods').map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
              Description *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs bg-white border border-[#E2DFD8] rounded-lg p-3 text-[#1E2320] focus:border-[#1E3F35]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs bg-white border border-[#E2DFD8] rounded-lg p-3 text-[#1E2320] focus:border-[#1E3F35]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs bg-white border border-[#E2DFD8] rounded-lg p-3 text-[#1E2320] focus:border-[#1E3F35]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
                Venue Name *
              </label>
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className="w-full text-xs bg-white border border-[#E2DFD8] rounded-lg p-3 text-[#1E2320] focus:border-[#1E3F35]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
                Street Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs bg-white border border-[#E2DFD8] rounded-lg p-3 text-[#1E2320] focus:border-[#1E3F35]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
                Capacity *
              </label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full text-xs bg-white border border-[#E2DFD8] rounded-lg p-3 text-[#1E2320] focus:border-[#1E3F35]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
                Price (USD)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-xs bg-white border border-[#E2DFD8] rounded-lg p-3 text-[#1E2320] focus:border-[#1E3F35]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
                Tags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full text-xs bg-white border border-[#E2DFD8] rounded-lg p-3 text-[#1E2320] focus:border-[#1E3F35]"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#EBE7DF] flex items-center justify-end gap-3">
          <Link
            to="/organizer/events"
            className="px-4 py-2.5 text-xs font-medium text-[#5F635D] hover:text-[#1E2320]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#1E3F35] hover:bg-[#163028] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            {submitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
