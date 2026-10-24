import { AttendeeRegistration, EventItem } from '../types';
import { DEMO_EVENTS } from '../mocks/demo-data';
import { eventsService } from './events-service';
import { authService } from './auth-service';
import { apiClient, isDemoMode } from './api-client';

const REG_STORAGE_KEY = 'locora_registrations';

function getInitialRegistrations(): AttendeeRegistration[] {
  // Prepopulate with a couple of realistic demo registrations for Sarah Chen
  return [
    {
      id: 'reg-1',
      eventId: 'evt-2',
      event: DEMO_EVENTS[1],
      userId: 'usr-attendee-1',
      userName: 'Sarah Chen',
      userEmail: 'sarah.chen@example.com',
      status: 'confirmed',
      registeredAt: '2026-10-20T14:30:00Z',
      ticketCode: 'LOC-7192-SH',
      checkedIn: false,
    },
    {
      id: 'reg-2',
      eventId: 'evt-4',
      event: DEMO_EVENTS[3],
      userId: 'usr-attendee-1',
      userName: 'Sarah Chen',
      userEmail: 'sarah.chen@example.com',
      status: 'confirmed',
      registeredAt: '2026-10-22T09:15:00Z',
      ticketCode: 'LOC-4830-VY',
      checkedIn: false,
    },
  ];
}

function getStoredRegistrations(): AttendeeRegistration[] {
  try {
    const raw = localStorage.getItem(REG_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialRegistrations();
      localStorage.setItem(REG_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialRegistrations();
  }
}

function saveStoredRegistrations(list: AttendeeRegistration[]): void {
  try {
    localStorage.setItem(REG_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save registrations:', err);
  }
}

export const registrationsService = {
  async getMyRegistrations(): Promise<AttendeeRegistration[]> {
    if (!isDemoMode()) {
      return apiClient.get<AttendeeRegistration[]>('/me/registrations');
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    const user = authService.getCurrentUser();
    if (!user) return [];

    const all = getStoredRegistrations();
    return all.filter((r) => r.userId === user.id);
  },

  async isRegistered(eventId: string): Promise<boolean> {
    const user = authService.getCurrentUser();
    if (!user) return false;

    if (!isDemoMode()) {
      try {
        const regs = await this.getMyRegistrations();
        return regs.some((r) => r.eventId === eventId && r.status === 'confirmed');
      } catch {
        return false;
      }
    }

    const all = getStoredRegistrations();
    return all.some((r) => r.eventId === eventId && r.userId === user.id && r.status === 'confirmed');
  },

  async getRegistrationForEvent(eventId: string): Promise<AttendeeRegistration | null> {
    const user = authService.getCurrentUser();
    if (!user) return null;

    const all = getStoredRegistrations();
    return all.find((r) => r.eventId === eventId && r.userId === user.id && r.status === 'confirmed') || null;
  },

  async register(event: EventItem): Promise<AttendeeRegistration> {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Please sign in or select a demo user profile to register for events.');
    }

    if (!isDemoMode()) {
      return apiClient.post<AttendeeRegistration>(`/events/${event.id}/registrations`);
    }

    await new Promise((resolve) => setTimeout(resolve, 250));

    // Capacity verification
    if (event.registeredCount >= event.capacity) {
      throw new Error('This event is at full capacity. Join the waitlist or explore nearby alternatives.');
    }

    const all = getStoredRegistrations();
    const existing = all.find((r) => r.eventId === event.id && r.userId === user.id);

    if (existing && existing.status === 'confirmed') {
      return existing;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReg: AttendeeRegistration = {
      id: `reg-${Date.now()}`,
      eventId: event.id,
      event,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      status: 'confirmed',
      registeredAt: new Date().toISOString(),
      ticketCode: `LOC-${randomSuffix}-TK`,
      checkedIn: false,
    };

    if (existing) {
      existing.status = 'confirmed';
      existing.ticketCode = newReg.ticketCode;
    } else {
      all.unshift(newReg);
    }
    saveStoredRegistrations(all);

    // Update event registered count in demo state
    try {
      await eventsService.updateEvent(event.id, {
        registeredCount: Math.min(event.capacity, event.registeredCount + 1),
      });
    } catch (e) {
      console.warn('Could not increment event registered count:', e);
    }

    return newReg;
  },

  async cancelRegistration(registrationId: string): Promise<boolean> {
    if (!isDemoMode()) {
      await apiClient.delete(`/registrations/${registrationId}`);
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    const all = getStoredRegistrations();
    const target = all.find((r) => r.id === registrationId);
    if (!target) return false;

    target.status = 'cancelled';
    saveStoredRegistrations(all);

    // Decrement event registered count
    try {
      const event = await eventsService.getEventById(target.eventId);
      if (event && event.registeredCount > 0) {
        await eventsService.updateEvent(target.eventId, {
          registeredCount: event.registeredCount - 1,
        });
      }
    } catch (e) {
      console.warn('Could not decrement event count:', e);
    }

    return true;
  },

  async getEventAttendees(eventId: string): Promise<AttendeeRegistration[]> {
    if (!isDemoMode()) {
      return apiClient.get<AttendeeRegistration[]>(`/events/${eventId}/attendees`);
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    const all = getStoredRegistrations();
    return all.filter((r) => r.eventId === eventId);
  },

  async toggleCheckIn(registrationId: string): Promise<AttendeeRegistration> {
    if (!isDemoMode()) {
      return apiClient.patch<AttendeeRegistration>(`/registrations/${registrationId}/checkin`);
    }

    const all = getStoredRegistrations();
    const target = all.find((r) => r.id === registrationId);
    if (!target) throw new Error('Registration record not found');

    target.checkedIn = !target.checkedIn;
    saveStoredRegistrations(all);
    return target;
  },
};
