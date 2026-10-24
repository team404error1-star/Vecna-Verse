import { EventItem } from '../types';
import { DEMO_EVENTS } from '../mocks/demo-data';
import { eventsService } from './events-service';
import { isDemoMode, apiClient } from './api-client';

const SAVED_STORAGE_KEY = 'locora_saved_events';

function getInitialSaved(): string[] {
  // Prepopulate evt-1 and evt-3 as saved for demo user
  return ['evt-1', 'evt-3'];
}

function getStoredSavedIds(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSaved();
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialSaved();
  }
}

function saveStoredIds(ids: string[]): void {
  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to update saved event IDs:', err);
  }
}

type SavedListener = (ids: string[]) => void;
const listeners = new Set<SavedListener>();

function notify(ids: string[]) {
  listeners.forEach((fn) => fn(ids));
}

export const savedEventsService = {
  subscribe(listener: SavedListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSavedIds(): string[] {
    return getStoredSavedIds();
  },

  isSaved(eventId: string): boolean {
    const ids = getStoredSavedIds();
    return ids.includes(eventId);
  },

  async toggleSave(eventId: string): Promise<boolean> {
    if (!isDemoMode()) {
      const isCurrentlySaved = this.isSaved(eventId);
      if (isCurrentlySaved) {
        await apiClient.delete(`/me/saved-events/${eventId}`);
        return false;
      } else {
        await apiClient.post(`/me/saved-events/${eventId}`);
        return true;
      }
    }

    const ids = getStoredSavedIds();
    let updated: string[];
    let isNowSaved = false;

    if (ids.includes(eventId)) {
      updated = ids.filter((id) => id !== eventId);
      isNowSaved = false;
    } else {
      updated = [...ids, eventId];
      isNowSaved = true;
    }

    saveStoredIds(updated);
    notify(updated);
    return isNowSaved;
  },

  async getSavedEvents(): Promise<EventItem[]> {
    if (!isDemoMode()) {
      return apiClient.get<EventItem[]>('/me/saved-events');
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    const ids = getStoredSavedIds();
    const result: EventItem[] = [];

    for (const id of ids) {
      const event = await eventsService.getEventById(id);
      if (event) {
        result.push(event);
      }
    }

    return result;
  },
};
