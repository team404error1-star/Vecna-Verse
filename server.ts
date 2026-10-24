import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

app.use(express.json());

// Ensure data directory exists
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');
const SAVED_FILE = path.join(DATA_DIR, 'saved.json');

// Initialize Gemini SDK if GEMINI_API_KEY is present
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiClient = new GoogleGenAI();
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI client:', err);
  }
}

// Helpers for persistent JSON storage
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Prepopulate initial events if file is empty
const INITIAL_SEED_EVENTS = [
  {
    id: 'evt-1',
    title: 'Metro Civic Hackathon: Urban Transit & Mobility Solutions',
    slug: 'metro-civic-hackathon-urban-transit',
    summary: 'A 24-hour community hackathon designing open-source tools for pedestrian safety and bus reliability.',
    description: 'Join developers, civic designers, and transit advocates for an intensive collaborative weekend building public tools for our city transit system. Mentors will be on-site to assist with geospatial APIs, accessibility standards, and rapid prototyping.',
    category: 'Technology & Hackathons',
    coverImage: '/src/assets/images/event_tech_hackathon_1792850960780.jpg',
    startDate: '2026-11-14T09:00:00Z',
    endDate: '2026-11-15T17:00:00Z',
    venueName: 'Urban Innovation Lab — Floor 4',
    address: '420 Technology Way',
    neighborhood: 'Downtown Arts District',
    city: 'Metro City',
    price: 0,
    capacity: 80,
    registeredCount: 64,
    status: 'published',
    tags: ['Coding', 'Open Data', 'Civic Tech', 'Hackathon'],
    isFeatured: true,
    ageRestriction: 'All Ages',
    organizer: {
      id: 'org-1',
      name: 'Metro Civic Tech Collective',
      slug: 'metro-civic-tech',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Fostering grassroots civic innovation, open data workshops, and ethical technology hackathons for our urban community.',
      email: 'organizers@civictech.demo',
      location: 'Downtown Arts District',
      eventsCount: 14,
      totalAttendeesServed: 1240,
    },
  },
  {
    id: 'evt-2',
    title: 'Silverlake Weekend Harvest & Artisan Baker Market',
    slug: 'silverlake-weekend-harvest-artisan-market',
    summary: 'Fresh regional produce, sourdough breads, heirloom flowers, and local preserves at the open-air square.',
    description: 'Celebrate our regional agricultural bounty at the Silverlake Commons outdoor pavilion. Meet over 30 family farms, micro-bakers, and organic honey producers.',
    category: 'Food & Community',
    coverImage: '/src/assets/images/event_farmers_market_1792850961672.jpg',
    startDate: '2026-11-08T08:30:00Z',
    endDate: '2026-11-08T14:00:00Z',
    venueName: 'Silverlake Commons Central Plaza',
    address: '150 Orchard Avenue',
    neighborhood: 'Silverlake Commons',
    city: 'Metro City',
    price: 0,
    capacity: 350,
    registeredCount: 218,
    status: 'published',
    tags: ['Farmers Market', 'Local Food', 'Artisan Bread'],
    isFeatured: true,
    ageRestriction: 'All Ages',
    organizer: {
      id: 'org-2',
      name: 'Green Roots Urban Agriculture',
      slug: 'green-roots-urban-ag',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      bio: 'Connecting local growers, artisan bakers, and urban gardeners.',
      email: 'hello@greenroots.demo',
      location: 'Silverlake Commons',
      eventsCount: 28,
      totalAttendeesServed: 3450,
    },
  },
  {
    id: 'evt-3',
    title: 'Courtyard Garden Acoustic Sessions: Indie Songwriter Showcase',
    slug: 'courtyard-garden-acoustic-sessions',
    summary: 'An intimate evening of live acoustic folk and storytelling in the historic brick courtyard under lantern lights.',
    description: 'Experience the sound of four emerging independent songwriters performing unplugged in our ivy-covered courtyard garden. Seating on rustic benches.',
    category: 'Live Music & Culture',
    coverImage: '/src/assets/images/event_acoustic_music_1792850962324.jpg',
    startDate: '2026-11-12T19:00:00Z',
    endDate: '2026-11-12T21:30:00Z',
    venueName: 'The Old Mill Courtyard Garden',
    address: '88 Millstone Lane',
    neighborhood: 'Historic Old Town',
    city: 'Metro City',
    price: 15,
    capacity: 65,
    registeredCount: 52,
    status: 'published',
    tags: ['Live Music', 'Acoustic', 'Folk', 'Indie'],
    isFeatured: true,
    ageRestriction: '16+',
    organizer: {
      id: 'org-3',
      name: 'Courtyard Sessions Live',
      slug: 'courtyard-sessions-live',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Independent live acoustic performances and intimate musical evenings.',
      email: 'booking@courtyardsessions.demo',
      location: 'Historic Old Town',
      eventsCount: 19,
      totalAttendeesServed: 1820,
    },
  },
  {
    id: 'evt-4',
    title: 'Sunrise Waterfront Vinyasa Yoga & Breathwork',
    slug: 'sunrise-waterfront-vinyasa-yoga',
    summary: 'An energizing 75-minute outdoor yoga flow with panoramic river views, open to all levels.',
    description: 'Greet the sunrise over the harbor with a mindful, grounding Vinyasa flow led by certified instructor Maya Lin. Alignment, breath awareness, and gentle mobility.',
    category: 'Fitness & Outdoors',
    coverImage: '/src/assets/images/event_morning_yoga_1792850962615.jpg',
    startDate: '2026-11-07T07:15:00Z',
    endDate: '2026-11-07T08:30:00Z',
    venueName: 'Harbor Green Riverfront Lawn',
    address: '300 Promenade Boulevard',
    neighborhood: 'Waterfront Green',
    city: 'Metro City',
    price: 0,
    capacity: 50,
    registeredCount: 41,
    status: 'published',
    tags: ['Yoga', 'Mindfulness', 'Outdoors', 'Wellness'],
    isFeatured: false,
    ageRestriction: 'All Ages',
    organizer: {
      id: 'org-4',
      name: 'City Parks Wellness Initiative',
      slug: 'city-parks-wellness',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'Promoting free and accessible community yoga and outdoor wellness.',
      email: 'info@citywellness.demo',
      location: 'Waterfront Green',
      eventsCount: 32,
      totalAttendeesServed: 4200,
    },
  },
  {
    id: 'evt-5',
    title: 'Lantern Night Festival & Local Food Truck Gathering',
    slug: 'lantern-night-festival-food-trucks',
    summary: 'A vibrant evening block party featuring 15 culinary trucks, craft market stalls, and light installations.',
    description: 'A neighborhood evening celebration bringing together our culinary favorites, artisan jewelers, printmakers, and live DJ sets in the historic cobblestone square.',
    category: 'Food & Community',
    coverImage: '/src/assets/images/hero_neighborhood_gathering_1792850960020.jpg',
    startDate: '2026-11-20T17:30:00Z',
    endDate: '2026-11-20T22:30:00Z',
    venueName: 'The Historic Cobblestone Market Square',
    address: '12 Wharf Street',
    neighborhood: 'Historic Old Town',
    city: 'Metro City',
    price: 0,
    capacity: 500,
    registeredCount: 380,
    status: 'published',
    tags: ['Night Market', 'Food Trucks', 'Community', 'Crafts'],
    isFeatured: true,
    ageRestriction: 'All Ages',
    organizer: {
      id: 'org-2',
      name: 'Green Roots Urban Agriculture',
      slug: 'green-roots-urban-ag',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      bio: 'Connecting local growers, artisan bakers, and urban gardeners.',
      email: 'hello@greenroots.demo',
      location: 'Silverlake Commons',
      eventsCount: 28,
      totalAttendeesServed: 3450,
    },
  },
];

if (!fs.existsSync(EVENTS_FILE)) {
  writeJsonFile(EVENTS_FILE, INITIAL_SEED_EVENTS);
}

// ----------------------------------------------------
// REAL API ENDPOINTS
// ----------------------------------------------------

// 1. Health check & configuration status
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    providers: {
      geminiSearchGrounding: Boolean(process.env.GEMINI_API_KEY),
      ticketmasterApi: Boolean(process.env.TICKETMASTER_API_KEY),
      openStreetMapGeocoding: true,
    },
  });
});

// 2. Real Live Event Discovery via Gemini Google Search Grounding
app.post('/api/events/search-live', async (req: Request, res: Response) => {
  const { city = 'San Francisco', query = 'community events' } = req.body;

  // 1. Try Ticketmaster Discovery API if key is present
  if (process.env.TICKETMASTER_API_KEY) {
    try {
      const tmUrl = `https://app.ticketmaster.com/discovery/v2/events.json?city=${encodeURIComponent(city)}&keyword=${encodeURIComponent(query)}&size=8&apikey=${process.env.TICKETMASTER_API_KEY}`;
      const tmRes = await fetch(tmUrl);
      if (tmRes.ok) {
        const tmData: any = await tmRes.json();
        const rawEvents = tmData._embedded?.events || [];
        if (rawEvents.length > 0) {
          const liveEvents = rawEvents.map((e: any, index: number) => ({
            id: `tm-${e.id || index}`,
            title: e.name,
            slug: (e.name || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            summary: e.info?.slice(0, 140) || `${e.name} in ${city}`,
            description: e.info || e.pleaseNote || `Official live event in ${city}. Hosted at ${e._embedded?.venues?.[0]?.name || 'Local Venue'}.`,
            category: 'Live Music & Culture',
            coverImage: e.images?.[0]?.url || '/src/assets/images/hero_neighborhood_gathering_1792850960020.jpg',
            startDate: e.dates?.start?.dateTime || new Date().toISOString(),
            endDate: new Date(Date.now() + 10800000).toISOString(),
            venueName: e._embedded?.venues?.[0]?.name || 'Local Venue',
            address: e._embedded?.venues?.[0]?.address?.line1 || city,
            neighborhood: e._embedded?.venues?.[0]?.city?.name || city,
            city,
            price: e.priceRanges?.[0]?.min || 0,
            capacity: 250,
            registeredCount: Math.floor(Math.random() * 150) + 20,
            status: 'published',
            tags: [e.classifications?.[0]?.genre?.name || 'Live', 'Ticketmaster'],
            organizer: {
              id: 'org-tm',
              name: e._embedded?.attractions?.[0]?.name || 'Live Event Host',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
              bio: 'Verified event organizer and venue coordinator.',
              email: 'tickets@locora.city',
              location: city,
              eventsCount: 10,
              totalAttendeesServed: 5000,
            },
          }));

          const existing = readJsonFile<any[]>(EVENTS_FILE, []);
          const merged = [...liveEvents, ...existing.filter((ev) => !liveEvents.some((le: any) => le.id === ev.id))];
          writeJsonFile(EVENTS_FILE, merged);

          return res.json({
            success: true,
            provider: 'Ticketmaster Discovery API',
            count: liveEvents.length,
            city,
            data: liveEvents,
          });
        }
      }
    } catch (tmErr) {
      console.warn('Ticketmaster API fetch error, falling back to Gemini search:', tmErr);
    }
  }

  // 2. Try Gemini with Google Search Grounding
  if (!geminiClient) {
    return res.status(503).json({
      error: 'No Search Key Configured',
      message: 'Configure GEMINI_API_KEY in the AI Studio Secrets panel or TICKETMASTER_API_KEY in .env to pull real events worldwide.',
    });
  }

  try {
    const prompt = `You are a real-time event discovery engine. Find 4 REAL, actual upcoming events, concerts, farmers markets, hackathons, or workshops in or near "${city}" related to "${query}".
    Only provide real, verifiable events with actual venues.
    Return ONLY a valid JSON array of objects with the exact structure:
    [
      {
        "id": "live-evt-[randomId]",
        "title": "Exact Event Title",
        "summary": "1 sentence summary",
        "description": "2-3 sentences about the event",
        "category": "Technology & Hackathons" | "Workshops & Learning" | "Live Music & Culture" | "Fitness & Outdoors" | "Food & Community" | "Art & Creative" | "Volunteering & Impact",
        "coverImage": "/src/assets/images/hero_neighborhood_gathering_1792850960020.jpg",
        "startDate": "YYYY-MM-DDTHH:mm:ssZ",
        "endDate": "YYYY-MM-DDTHH:mm:ssZ",
        "venueName": "Real Venue Name",
        "address": "Street Address",
        "neighborhood": "Neighborhood or District",
        "city": "${city}",
        "price": 0,
        "capacity": 100,
        "registeredCount": 25,
        "status": "published",
        "tags": ["Tag1", "Tag2"],
        "organizer": {
          "id": "org-real-1",
          "name": "Actual Host or Organization",
          "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          "bio": "Host organization",
          "email": "contact@example.com",
          "location": "${city}",
          "eventsCount": 5,
          "totalAttendeesServed": 350
        }
      }
    ]`;

    const response = await geminiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '[]';
    let liveEvents = [];
    try {
      liveEvents = JSON.parse(text);
    } catch {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) liveEvents = JSON.parse(match[0]);
    }

    const existing = readJsonFile<any[]>(EVENTS_FILE, []);
    const merged = [...liveEvents, ...existing.filter((e) => !liveEvents.some((le: any) => le.id === e.id))];
    writeJsonFile(EVENTS_FILE, merged);

    res.json({
      success: true,
      provider: 'Gemini Google Search Grounding',
      count: liveEvents.length,
      city,
      data: liveEvents,
    });
  } catch (err: any) {
    console.error('Error fetching live events via Gemini search:', err);
    res.status(500).json({
      error: 'Live Search Notice',
      message: err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED')
        ? 'Gemini API quota reached. You can configure a personal key or add a free TICKETMASTER_API_KEY in .env.'
        : err.message || 'Unable to complete live search.',
    });
  }
});

// 3. Real Geolocation / Reverse Geocode via OpenStreetMap Nominatim
app.get('/api/location/reverse', async (req: Request, res: Response) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon parameters are required' });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LocoraHyperlocalPlatform/1.0',
      },
    });
    if (!response.ok) throw new Error('Nominatim reverse geocode failed');
    const data = await response.json();
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.suburb ||
      data.address?.county ||
      'Metro City';
    const neighborhood =
      data.address?.neighbourhood ||
      data.address?.suburb ||
      data.address?.district ||
      city;

    res.json({
      city,
      neighborhood,
      displayName: data.display_name,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to detect location', details: err.message });
  }
});

// 4. Get Events
app.get('/api/events', (req: Request, res: Response) => {
  let events = readJsonFile<any[]>(EVENTS_FILE, INITIAL_SEED_EVENTS);
  const { query, category, neighborhood, dateRange, priceType, sortBy, page = 1, pageSize = 12 } = req.query;

  if (query && typeof query === 'string' && query.trim()) {
    const q = query.toLowerCase().trim();
    events = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.venueName.toLowerCase().includes(q) ||
        (e.tags && e.tags.some((t: string) => t.toLowerCase().includes(q)))
    );
  }

  if (category && category !== 'All' && category !== 'All Categories') {
    events = events.filter((e) => e.category === category);
  }

  if (neighborhood && neighborhood !== 'All' && neighborhood !== 'All Neighborhoods') {
    events = events.filter((e) => e.neighborhood === neighborhood);
  }

  if (priceType === 'free') {
    events = events.filter((e) => e.price === 0);
  } else if (priceType === 'paid') {
    events = events.filter((e) => e.price > 0);
  }

  if (sortBy === 'soonest') {
    events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  } else if (sortBy === 'capacity') {
    events.sort((a, b) => (b.capacity - b.registeredCount) - (a.capacity - a.registeredCount));
  } else {
    events.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(pageSize) || 12;
  const total = events.length;
  const totalPages = Math.ceil(total / limitNum) || 1;
  const offset = (pageNum - 1) * limitNum;
  const paginated = events.slice(offset, offset + limitNum);

  res.json({
    data: paginated,
    total,
    page: pageNum,
    pageSize: limitNum,
    totalPages,
  });
});

// 5. Get Event by ID
app.get('/api/events/:id', (req: Request, res: Response) => {
  const events = readJsonFile<any[]>(EVENTS_FILE, INITIAL_SEED_EVENTS);
  const event = events.find((e) => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json(event);
});

// 6. Create Event (Real server-side persistence)
app.post('/api/events', (req: Request, res: Response) => {
  const events = readJsonFile<any[]>(EVENTS_FILE, INITIAL_SEED_EVENTS);
  const payload = req.body;

  const newId = `evt-${Date.now()}`;
  const slug = (payload.title || 'event')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const newEvent = {
    id: newId,
    title: payload.title || 'Untitled Community Event',
    slug,
    summary: payload.summary || payload.description?.slice(0, 140) || 'Local gathering.',
    description: payload.description || '',
    category: payload.category || 'Food & Community',
    coverImage: payload.coverImage || '/src/assets/images/hero_neighborhood_gathering_1792850960020.jpg',
    startDate: payload.startDate || new Date().toISOString(),
    endDate: payload.endDate || new Date().toISOString(),
    venueName: payload.venueName || 'Community Hall',
    address: payload.address || 'Main Street',
    neighborhood: payload.neighborhood || 'Downtown Arts District',
    city: payload.city || 'Metro City',
    price: Number(payload.price) || 0,
    capacity: Number(payload.capacity) || 50,
    registeredCount: 0,
    status: 'published',
    tags: payload.tags || ['Community'],
    isFeatured: false,
    organizer: payload.organizer || {
      id: 'org-1',
      name: 'Metro Civic Tech Collective',
      slug: 'metro-civic-tech',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Community Organizer',
      email: 'organizers@civictech.demo',
      location: 'Downtown Arts District',
      eventsCount: 1,
      totalAttendeesServed: 50,
    },
  };

  events.unshift(newEvent);
  writeJsonFile(EVENTS_FILE, events);
  res.status(201).json(newEvent);
});

// 7. Update Event
app.patch('/api/events/:id', (req: Request, res: Response) => {
  const events = readJsonFile<any[]>(EVENTS_FILE, INITIAL_SEED_EVENTS);
  const index = events.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }

  events[index] = { ...events[index], ...req.body };
  writeJsonFile(EVENTS_FILE, events);
  res.json(events[index]);
});

// 8. Delete Event
app.delete('/api/events/:id', (req: Request, res: Response) => {
  let events = readJsonFile<any[]>(EVENTS_FILE, INITIAL_SEED_EVENTS);
  events = events.filter((e) => e.id !== req.params.id);
  writeJsonFile(EVENTS_FILE, events);
  res.status(204).send();
});

// 9. Real Registrations
app.get('/api/me/registrations', (_req: Request, res: Response) => {
  const regs = readJsonFile<any[]>(REGISTRATIONS_FILE, []);
  res.json(regs);
});

app.post('/api/events/:id/registrations', (req: Request, res: Response) => {
  const events = readJsonFile<any[]>(EVENTS_FILE, INITIAL_SEED_EVENTS);
  const event = events.find((e) => e.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (event.registeredCount >= event.capacity) {
    return res.status(400).json({ message: 'Event has reached maximum capacity.' });
  }

  const regs = readJsonFile<any[]>(REGISTRATIONS_FILE, []);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newReg = {
    id: `reg-${Date.now()}`,
    eventId: event.id,
    event,
    userId: req.body.userId || 'usr-attendee-1',
    userName: req.body.userName || 'Sarah Chen',
    userEmail: req.body.userEmail || 'sarah.chen@example.com',
    status: 'confirmed',
    registeredAt: new Date().toISOString(),
    ticketCode: `LOC-${randomSuffix}-TK`,
    checkedIn: false,
  };

  regs.unshift(newReg);
  writeJsonFile(REGISTRATIONS_FILE, regs);

  event.registeredCount = (event.registeredCount || 0) + 1;
  writeJsonFile(EVENTS_FILE, events);

  res.status(201).json(newReg);
});

app.delete('/api/registrations/:id', (req: Request, res: Response) => {
  const regs = readJsonFile<any[]>(REGISTRATIONS_FILE, []);
  const target = regs.find((r) => r.id === req.params.id);
  if (target) {
    target.status = 'cancelled';
    writeJsonFile(REGISTRATIONS_FILE, regs);

    const events = readJsonFile<any[]>(EVENTS_FILE, INITIAL_SEED_EVENTS);
    const event = events.find((e) => e.id === target.eventId);
    if (event && event.registeredCount > 0) {
      event.registeredCount -= 1;
      writeJsonFile(EVENTS_FILE, events);
    }
  }
  res.status(204).send();
});

app.get('/api/events/:id/attendees', (req: Request, res: Response) => {
  const regs = readJsonFile<any[]>(REGISTRATIONS_FILE, []);
  const eventAttendees = regs.filter((r) => r.eventId === req.params.id);
  res.json(eventAttendees);
});

// 10. Saved Bookmarks
app.get('/api/me/saved-events', (_req: Request, res: Response) => {
  const savedIds = readJsonFile<string[]>(SAVED_FILE, ['evt-1', 'evt-3']);
  const events = readJsonFile<any[]>(EVENTS_FILE, INITIAL_SEED_EVENTS);
  const savedEvents = events.filter((e) => savedIds.includes(e.id));
  res.json(savedEvents);
});

app.post('/api/me/saved-events/:id', (req: Request, res: Response) => {
  let savedIds = readJsonFile<string[]>(SAVED_FILE, ['evt-1', 'evt-3']);
  if (!savedIds.includes(req.params.id)) {
    savedIds.push(req.params.id);
    writeJsonFile(SAVED_FILE, savedIds);
  }
  res.json({ saved: true });
});

app.delete('/api/me/saved-events/:id', (req: Request, res: Response) => {
  let savedIds = readJsonFile<string[]>(SAVED_FILE, ['evt-1', 'evt-3']);
  savedIds = savedIds.filter((id) => id !== req.params.id);
  writeJsonFile(SAVED_FILE, savedIds);
  res.json({ saved: false });
});

// 11. Attendee Check-In
app.patch('/api/registrations/:id/checkin', (req: Request, res: Response) => {
  const regs = readJsonFile<any[]>(REGISTRATIONS_FILE, []);
  const target = regs.find((r) => r.id === req.params.id);
  if (!target) {
    return res.status(404).json({ message: 'Registration not found' });
  }
  target.checkedIn = !target.checkedIn;
  writeJsonFile(REGISTRATIONS_FILE, regs);
  res.json(target);
});

// 12. Organizers & Profiles
app.get('/api/organizers/:id', (req: Request, res: Response) => {
  const events = readJsonFile<any[]>(EVENTS_FILE, INITIAL_SEED_EVENTS);
  const foundInEvents = events.find(
    (e) => e.organizer && (e.organizer.id === req.params.id || e.organizer.slug === req.params.id)
  );
  if (foundInEvents && foundInEvents.organizer) {
    return res.json(foundInEvents.organizer);
  }
  const foundInSeed = INITIAL_SEED_EVENTS.map((e) => e.organizer).find(
    (o) => o.id === req.params.id || o.slug === req.params.id
  );
  if (foundInSeed) {
    return res.json(foundInSeed);
  }
  return res.status(404).json({ message: 'Organizer not found' });
});

app.get('/api/organizers/:id/events', (req: Request, res: Response) => {
  const events = readJsonFile<any[]>(EVENTS_FILE, INITIAL_SEED_EVENTS);
  const filtered = events.filter(
    (e) => e.organizer && (e.organizer.id === req.params.id || e.organizer.slug === req.params.id)
  );
  res.json(filtered);
});

// 13. SmartMatch Recommendations
app.get('/api/smart-match/recommendations', (req: Request, res: Response) => {
  const { interests, neighborhood, freeOnly } = req.query;
  const userInterests =
    typeof interests === 'string' && interests
      ? interests.split(',').map((s) => s.trim())
      : ['Food & Community', 'Live Music & Culture'];
  const userNeighborhood =
    typeof neighborhood === 'string' && neighborhood ? neighborhood : 'Silverlake Commons';
  const isFreeOnly = freeOnly === 'true';

  const events = readJsonFile<any[]>(EVENTS_FILE, INITIAL_SEED_EVENTS);

  const scored = events.map((event) => {
    let score = 30;
    const matchReasons: string[] = [];

    if (userInterests.includes(event.category)) {
      score += 35;
      matchReasons.push(`Matches your interest in ${event.category}`);
    }

    const matchingTags = (event.tags || []).filter((tag: string) =>
      userInterests.some((interest: string) => interest.toLowerCase().includes(tag.toLowerCase()))
    );
    if (matchingTags.length > 0) {
      score += 15;
      matchReasons.push(`Aligned tags: ${matchingTags.slice(0, 2).join(', ')}`);
    }

    if (userNeighborhood && event.neighborhood === userNeighborhood) {
      score += 20;
      matchReasons.push(`Located directly in your home neighborhood (${userNeighborhood})`);
    } else {
      score += 5;
      matchReasons.push(`Within 15 min transit in ${event.neighborhood}`);
    }

    if (isFreeOnly && event.price === 0) {
      score += 10;
      matchReasons.push('Free community admission');
    } else if (!isFreeOnly && event.price === 0) {
      score += 5;
    }

    const remainingCapacity = (event.capacity || 50) - (event.registeredCount || 0);
    if (remainingCapacity > 10) {
      score += 5;
      matchReasons.push('Good seating & registration availability');
    }

    return {
      event,
      score: Math.min(98, score),
      matchReasons,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  res.json(scored);
});

// 14. Auth & User Profile
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const INITIAL_USERS = [
  {
    id: 'usr-attendee-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Product designer & urban gardener passionate about neighborhood sustainability and local live music.',
    neighborhood: 'Silverlake Commons',
    interests: ['Food & Community', 'Live Music & Culture', 'Technology & Hackathons', 'Fitness & Outdoors'],
    role: 'attendee',
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'usr-org-1',
    name: 'Marcus Vance',
    email: 'marcus@civictech.demo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Organizer lead at Metro Civic Tech Collective. Building bridges between local technology innovators and neighborhood communities.',
    neighborhood: 'Downtown Arts District',
    interests: ['Technology & Hackathons', 'Workshops & Learning', 'Volunteering & Impact'],
    role: 'organizer',
    createdAt: '2025-10-10T11:00:00Z',
  },
];

if (!fs.existsSync(USERS_FILE)) {
  writeJsonFile(USERS_FILE, INITIAL_USERS);
}

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const users = readJsonFile<any[]>(USERS_FILE, INITIAL_USERS);
  let user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) {
    const isOrg = email && (email.includes('org') || email.includes('civictech') || email.includes('marcus'));
    user = users.find((u) => (isOrg ? u.role === 'organizer' : u.role === 'attendee')) || users[0];
  }
  res.json({ user, token: 'demo_jwt_token_locora_preview' });
});

app.post('/api/auth/signup', (req: Request, res: Response) => {
  const { name, email, role = 'attendee' } = req.body;
  const users = readJsonFile<any[]>(USERS_FILE, INITIAL_USERS);
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || 'Community Member',
    email: email || `user-${Date.now()}@example.com`,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: role === 'organizer' ? 'Community organizer in Metro City.' : 'Local resident and active event attendee.',
    neighborhood: 'Downtown Arts District',
    interests: ['Food & Community', 'Live Music & Culture'],
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeJsonFile(USERS_FILE, users);
  res.status(201).json({ user: newUser, token: 'demo_jwt_token_locora_preview' });
});

app.get('/api/me', (_req: Request, res: Response) => {
  const users = readJsonFile<any[]>(USERS_FILE, INITIAL_USERS);
  res.json(users[0]);
});

app.patch('/api/me', (req: Request, res: Response) => {
  const users = readJsonFile<any[]>(USERS_FILE, INITIAL_USERS);
  if (users.length > 0) {
    users[0] = { ...users[0], ...req.body };
    writeJsonFile(USERS_FILE, users);
    return res.json(users[0]);
  }
  res.status(404).json({ message: 'User not found' });
});

// ----------------------------------------------------
// VITE MIDDLEWARE (DEV) OR STATIC BUILD (PROD)
// ----------------------------------------------------
async function startServer() {
  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Locora Full-Stack Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
