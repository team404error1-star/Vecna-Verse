import { EventFilterOptions, EventItem, PaginatedResponse } from '../types';
import { DEMO_EVENTS, DEMO_ORGANIZERS } from '../mocks/demo-data';
import { apiClient, isDemoMode } from './api-client';

const STORAGE_KEY = 'locora_events_db';

function getStoredEvents(): EventItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_EVENTS));
      return DEMO_EVENTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEMO_EVENTS;
  }
}

function saveStoredEvents(events: EventItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save events to local storage:', err);
  }
}

export const eventsService = {
  async getEvents(filters: EventFilterOptions = {}, page = 1, pageSize = 12): Promise<PaginatedResponse<EventItem>> {
    if (!isDemoMode()) {
      return apiClient.get<PaginatedResponse<EventItem>>('/events', {
        ...filters,
        page,
        pageSize,
      });
    }

    // Simulated network delay for authentic UI states
    await new Promise((resolve) => setTimeout(resolve, 150));

    let events = getStoredEvents();

    // Query filter (searches title, description, venueName, tags)
    if (filters.query?.trim()) {
      const q = filters.query.toLowerCase().trim();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venueName.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'All' && filters.category !== 'All Categories') {
      events = events.filter((e) => e.category === filters.category);
    }

    // Neighborhood filter
    if (filters.neighborhood && filters.neighborhood !== 'All' && filters.neighborhood !== 'All Neighborhoods') {
      events = events.filter((e) => e.neighborhood === filters.neighborhood);
    }

    // Price type
    if (filters.priceType === 'free') {
      events = events.filter((e) => e.price === 0);
    } else if (filters.priceType === 'paid') {
      events = events.filter((e) => e.price > 0);
    }

    // Date range filtering
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      events = events.filter((e) => {
        const eventDate = new Date(e.startDate);
        if (filters.dateRange === 'today') {
          return (
            eventDate.getDate() === now.getDate() &&
            eventDate.getMonth() === now.getMonth() &&
            eventDate.getFullYear() === now.getFullYear()
          );
        }
        if (filters.dateRange === 'this_weekend') {
          const day = eventDate.getDay();
          return day === 0 || day === 6; // Saturday or Sunday
        }
        if (filters.dateRange === 'this_month') {
          return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    // Sorting
    if (filters.sortBy === 'soonest') {
      events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    } else if (filters.sortBy === 'capacity') {
      events.sort((a, b) => (b.capacity - b.registeredCount) - (a.capacity - a.registeredCount));
    } else {
      // Default: featured first, then soonest
      events.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
    }

    const total = events.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const offset = (page - 1) * pageSize;
    const paginated = events.slice(offset, offset + pageSize);

    return {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages,
    };
  },

  async getEventById(id: string): Promise<EventItem | null> {
    if (!isDemoMode()) {
      try {
        return await apiClient.get<EventItem>(`/events/${id}`);
      } catch {
        return null;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    const events = getStoredEvents();
    return events.find((e) => e.id === id) || null;
  },

  async getRelatedEvents(eventId: string, limit = 3): Promise<EventItem[]> {
    const current = await this.getEventById(eventId);
    if (!current) return [];

    const all = getStoredEvents();
    return all
      .filter((e) => e.id !== eventId && (e.category === current.category || e.neighborhood === current.neighborhood))
      .slice(0, limit);
  },

  async createEvent(eventPayload: Partial<EventItem>): Promise<EventItem> {
    if (!isDemoMode()) {
      return apiClient.post<EventItem>('/events', eventPayload);
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
    const events = getStoredEvents();

    const newId = `evt-${Date.now()}`;
    const slug = (eventPayload.title || 'event')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newEvent: EventItem = {
      id: newId,
      title: eventPayload.title || 'Untitled Community Event',
      slug,
      summary: eventPayload.summary || eventPayload.description?.slice(0, 140) || 'Local community gathering.',
      description: eventPayload.description || '',
      category: eventPayload.category || 'Food & Community',
      coverImage: eventPayload.coverImage || '/src/assets/images/hero_neighborhood_gathering_1792850960020.jpg',
      startDate: eventPayload.startDate || new Date(Date.now() + 86400000 * 7).toISOString(),
      endDate: eventPayload.endDate || new Date(Date.now() + 86400000 * 7 + 7200000).toISOString(),
      venueName: eventPayload.venueName || 'Community Hall',
      address: eventPayload.address || '100 Main Street',
      neighborhood: eventPayload.neighborhood || 'Downtown Arts District',
      city: eventPayload.city || 'Metro City',
      price: Number(eventPayload.price) || 0,
      capacity: Number(eventPayload.capacity) || 50,
      registeredCount: 0,
      status: 'published',
      organizer: eventPayload.organizer || DEMO_ORGANIZERS[0],
      tags: eventPayload.tags && eventPayload.tags.length > 0 ? eventPayload.tags : ['Local', 'Community'],
      isFeatured: false,
    };

    events.unshift(newEvent);
    saveStoredEvents(events);
    return newEvent;
  },

  async updateEvent(id: string, updates: Partial<EventItem>): Promise<EventItem> {
    if (!isDemoMode()) {
      return apiClient.patch<EventItem>(`/events/${id}`, updates);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    const events = getStoredEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error('Event not found');
    }

    const updated = { ...events[index], ...updates };
    events[index] = updated;
    saveStoredEvents(events);
    return updated;
  },

  async deleteEvent(id: string): Promise<boolean> {
    if (!isDemoMode()) {
      await apiClient.delete(`/events/${id}`);
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    let events = getStoredEvents();
    events = events.filter((e) => e.id !== id);
    saveStoredEvents(events);
    return true;
  },

  async searchLiveRealEvents(city: string, query?: string): Promise<{ success: boolean; data: EventItem[]; count: number }> {
    return apiClient.post<{ success: boolean; data: EventItem[]; count: number }>('/events/search-live', {
      city,
      query,
    });
  },

  async detectLocationFromCoords(lat: number, lon: number): Promise<{ city: string; neighborhood: string; displayName: string }> {
    return apiClient.get<{ city: string; neighborhood: string; displayName: string }>('/location/reverse', {
      lat,
      lon,
    });
  },
};
