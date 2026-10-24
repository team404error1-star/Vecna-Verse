/**
 * Locora Core Types and Domain Models
 * Defines data structures for events, attendees, organizers, and API contracts.
 */

export type EventCategory =
  | 'Technology & Hackathons'
  | 'Workshops & Learning'
  | 'Live Music & Culture'
  | 'Fitness & Outdoors'
  | 'Food & Community'
  | 'Art & Creative'
  | 'Volunteering & Impact';

export type EventStatus = 'published' | 'draft' | 'cancelled' | 'completed';

export type RegistrationStatus = 'confirmed' | 'waitlist' | 'cancelled';

export interface Organizer {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  website?: string;
  email: string;
  location: string;
  eventsCount: number;
  totalAttendeesServed: number;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  summary: string;
  category: EventCategory;
  coverImage: string;
  startDate: string; // ISO String (e.g. '2026-11-14T18:30:00Z')
  endDate: string;   // ISO String
  venueName: string;
  address: string;
  neighborhood: string;
  city: string;
  price: number; // 0 for free
  capacity: number;
  registeredCount: number;
  status: EventStatus;
  organizer: Organizer;
  tags: string[];
  isFeatured?: boolean;
  ageRestriction?: string;
}

export interface AttendeeRegistration {
  id: string;
  eventId: string;
  event: EventItem;
  userId: string;
  userName: string;
  userEmail: string;
  status: RegistrationStatus;
  registeredAt: string;
  ticketCode: string;
  checkedIn: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  neighborhood: string;
  interests: EventCategory[];
  role: 'attendee' | 'organizer' | 'admin';
  createdAt: string;
}

export interface SmartMatchResult {
  event: EventItem;
  score: number; // 0 - 100
  matchReasons: string[];
}

export interface EventFilterOptions {
  query?: string;
  category?: string;
  neighborhood?: string;
  dateRange?: 'all' | 'today' | 'tomorrow' | 'this_weekend' | 'this_month';
  priceType?: 'all' | 'free' | 'paid';
  sortBy?: 'soonest' | 'relevance' | 'capacity';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
