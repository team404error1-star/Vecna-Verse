import { EventItem, Organizer } from '../types';
import { DEMO_ORGANIZERS } from '../mocks/demo-data';
import { eventsService } from './events-service';
import { isDemoMode, apiClient } from './api-client';

export interface OrganizerStats {
  totalEvents: number;
  publishedCount: number;
  totalRegistrations: number;
  activeCommunities: number;
}

export const organizersService = {
  async getOrganizerById(id: string): Promise<Organizer | null> {
    if (!isDemoMode()) {
      try {
        return await apiClient.get<Organizer>(`/organizers/${id}`);
      } catch {
        return null;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    return DEMO_ORGANIZERS.find((o) => o.id === id || o.slug === id) || null;
  },

  async getOrganizerEvents(organizerId: string): Promise<EventItem[]> {
    if (!isDemoMode()) {
      return apiClient.get<EventItem[]>(`/organizers/${organizerId}/events`);
    }

    const { data: all } = await eventsService.getEvents({}, 1, 100);
    return all.filter((e) => e.organizer.id === organizerId || e.organizer.slug === organizerId);
  },

  async getOrganizerStats(organizerId: string): Promise<OrganizerStats> {
    const events = await this.getOrganizerEvents(organizerId);
    const published = events.filter((e) => e.status === 'published');
    const totalRegs = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);

    return {
      totalEvents: events.length,
      publishedCount: published.length,
      totalRegistrations: totalRegs,
      activeCommunities: 1,
    };
  },
};
