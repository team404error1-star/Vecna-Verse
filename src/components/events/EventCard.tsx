import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Calendar, Users, ImageOff } from 'lucide-react';
import { EventItem } from '../../types';
import { formatEventDate, formatPrice } from '../../utils/formatters';
import { savedEventsService } from '../../services/saved-events-service';
import { useToast } from '../ui/Toast';

interface EventCardProps {
  event: EventItem;
  isRegistered?: boolean;
  onBookmarkChange?: (isSaved: boolean) => void;
}

export function EventCard({ event, isRegistered = false, onBookmarkChange }: EventCardProps) {
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState<boolean>(() => savedEventsService.isSaved(event.id));
  const [imageError, setImageError] = useState(false);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const nowSaved = await savedEventsService.toggleSave(event.id);
      setIsSaved(nowSaved);
      toast({
        type: 'success',
        title: nowSaved ? 'Event saved' : 'Removed from saved',
        description: nowSaved ? `Added "${event.title.slice(0, 30)}..." to your saved list.` : undefined,
      });
      if (onBookmarkChange) onBookmarkChange(nowSaved);
    } catch {
      toast({
        type: 'error',
        title: 'Could not update saved events',
      });
    }
  };

  const remaining = Math.max(0, event.capacity - event.registeredCount);

  return (
    <article className="group flex flex-col bg-white rounded-xl border border-[#E5E1D8] shadow-xs hover:border-[#1E3F35]/40 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Visual Cover Slot */}
      <div className="relative aspect-[4/3] bg-[#F4F1EA] overflow-hidden">
        <Link to={`/events/${event.id}`} tabIndex={-1} aria-hidden="true" className="block w-full h-full">
          {!imageError ? (
            <img
              src={event.coverImage}
              alt={event.title}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#F4F1EA] text-[#8C887E]">
              <ImageOff className="w-8 h-8 stroke-1 mb-1" />
              <span className="text-xs">{event.category}</span>
            </div>
          )}
        </Link>

        {/* Floating Bookmark Action */}
        <button
          type="button"
          onClick={handleToggleSave}
          aria-label={isSaved ? 'Remove from saved events' : 'Save event for later'}
          className="absolute top-3 right-3 p-2 rounded-lg bg-white/90 hover:bg-white text-[#1E2320] hover:text-[#1E3F35] shadow-xs backdrop-blur-xs transition-colors"
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#1E3F35] text-[#1E3F35]' : ''}`} />
        </button>

        {/* Price Tag in Bottom Corner */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#1E2320]/85 backdrop-blur-xs text-white text-xs font-semibold tabular-nums">
          {formatPrice(event.price)}
        </div>

        {/* Registered State Banner */}
        {isRegistered && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#1E3F35] backdrop-blur-xs text-white text-xs font-medium">
            Registered
          </div>
        )}
      </div>

      {/* Card Content & Zero-Pill Unboxed Metadata */}
      <div className="flex-1 flex flex-col p-5">
        {/* Category & Date Metadata with '·' separator */}
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1E3F35] mb-2 truncate">
          <span>{event.category}</span>
          <span aria-hidden="true" className="text-[#C8C4BC]">·</span>
          <span className="text-[#5F635D] font-normal normal-case">{formatEventDate(event.startDate)}</span>
        </div>

        {/* Event Title */}
        <h3 className="font-editorial text-lg font-bold text-[#1E2320] leading-snug line-clamp-2 mb-2 group-hover:text-[#1E3F35] transition-colors">
          <Link to={`/events/${event.id}`} className="focus:outline-hidden">
            {event.title}
          </Link>
        </h3>

        {/* Summary */}
        <p className="text-xs text-[#5F635D] line-clamp-2 mb-4 leading-relaxed flex-1">
          {event.summary}
        </p>

        {/* Location & Remaining Capacity Bar */}
        <div className="pt-3 border-t border-[#EBE7DF] flex items-center justify-between text-xs text-[#5F635D]">
          <div className="flex items-center gap-1.5 truncate max-w-[65%]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#8C887E]" />
            <span className="truncate">{event.neighborhood}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0 font-medium tabular-nums text-[#1E2320]">
            <Users className="w-3.5 h-3.5 text-[#8C887E]" />
            <span>{remaining > 0 ? `${remaining} spots` : 'Full'}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
