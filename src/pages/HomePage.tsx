import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, ArrowRight, Calendar, Users, ShieldCheck, HeartHandshake, Navigation, Loader2 } from 'lucide-react';
import { EventItem } from '../types';
import { eventsService } from '../services/events-service';
import { DEMO_CATEGORIES, DEMO_NEIGHBORHOODS } from '../mocks/demo-data';
import { EventCard } from '../components/events/EventCard';
import { EventListSkeleton } from '../components/ui/LoadingSkeleton';
import { useToast } from '../components/ui/Toast';

export function HomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All Neighborhoods');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data } = await eventsService.getEvents({}, 1, 10);
        setFeaturedEvents(data.filter((e) => e.isFeatured).slice(0, 3));
        setUpcomingEvents(data.slice(0, 6));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast({ type: 'error', title: 'Geolocation is not supported by your browser' });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await eventsService.detectLocationFromCoords(pos.coords.latitude, pos.coords.longitude);
          setSelectedNeighborhood(loc.neighborhood || loc.city);
          toast({
            type: 'success',
            title: `Location Detected: ${loc.city}`,
            description: `Nearby neighborhood: ${loc.neighborhood}`,
          });
        } catch {
          toast({ type: 'error', title: 'Could not resolve address from coordinates' });
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        toast({ type: 'info', title: 'Location access was not granted. Using manual selection.' });
      }
    );
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedNeighborhood !== 'All Neighborhoods') params.set('neighborhood', selectedNeighborhood);
    navigate(`/discover?${params.toString()}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Proposition & Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
                  Hyperlocal Community Platform
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] text-balance">
                  Discover nearby. <br />
                  <span className="text-indigo-600">Connect locally.</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                  Locora brings neighborhood gatherings, civic hackathons, courtyard concerts, and artisan markets into one unified discovery experience.
                </p>
              </div>

              {/* Instant Search Form */}
              <form
                onSubmit={handleHeroSearch}
                className="bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-md space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2 max-w-xl"
              >
                {/* Search Text */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search music, tech, farmers market..."
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-transparent border-0 text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                  />
                </div>

                {/* Neighborhood Dropdown & Detect Location Button */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/60 shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <select
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    className="text-xs font-medium text-slate-700 bg-transparent border-0 cursor-pointer focus:outline-hidden max-w-[140px] truncate"
                  >
                    {DEMO_NEIGHBORHOODS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                    {selectedNeighborhood !== 'All Neighborhoods' && !DEMO_NEIGHBORHOODS.includes(selectedNeighborhood) && (
                      <option value={selectedNeighborhood}>{selectedNeighborhood}</option>
                    )}
                  </select>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={locating}
                    title="Detect my real current location"
                    aria-label="Detect my real current location"
                    className="p-1 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                  >
                    {locating ? <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" /> : <Navigation className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Search CTA */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                >
                  Find Events
                </button>
              </form>

              {/* Quick Category Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
                <span className="text-slate-400 text-xs">Trending:</span>
                {['Food & Community', 'Live Music & Culture', 'Technology & Hackathons'].map((cat) => (
                  <Link
                    key={cat}
                    to={`/discover?category=${encodeURIComponent(cat)}`}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Column: High-Impact Visual Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[16/10] bg-slate-100 border border-slate-200/80">
                <img
                  src="/src/assets/images/hero_neighborhood_gathering_1792850960020.jpg"
                  alt="Vibrant neighborhood gathering under warm evening string lights"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-medium text-indigo-200 uppercase tracking-wider">
                    Community Spotlight
                  </p>
                  <p className="text-base font-semibold leading-tight mt-0.5">
                    Lantern Night Festival & Artisan Market
                  </p>
                  <p className="text-xs text-slate-300 mt-1">Historic Old Town · 380 Registered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Marquee Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Featured Gatherings
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Curated neighborhood highlights with high community attendance.
            </p>
          </div>
          <Link
            to="/discover"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>Explore all events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <EventListSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* SmartMatch Feature Showcase Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-indigo-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SmartMatch Personalized Discovery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
              Find activities tailored to your exact neighborhood and interests.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Never miss a workshop or meetup. Set your preferred neighborhoods and topic interests, and receive transparent recommendations explaining exactly why each event was selected.
            </p>
            <div className="pt-2">
              <Link
                to="/smart-match"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-colors shadow-xs"
              >
                <span>Try SmartMatch Discovery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Browse by Interest
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Explore activities organized by creative, technical, and social categories.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {DEMO_CATEGORIES.map((category) => (
            <Link
              key={category}
              to={`/discover?category=${encodeURIComponent(category)}`}
              className="p-5 bg-white rounded-xl border border-slate-200/80 hover:border-indigo-400 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {category}
              </span>
              <span className="text-xs text-slate-400 mt-4 flex items-center gap-1">
                <span>View listings</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Upcoming in Your City
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Events scheduled over the coming weeks across all districts.
            </p>
          </div>
          <Link
            to="/discover"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            See all ({upcomingEvents.length}+)
          </Link>
        </div>

        {loading ? (
          <EventListSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Organizer Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Organizing an event or workshop?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Locora gives local community leaders, non-profits, and indie organizers tools to publish listings, manage attendee RSVPs, and cultivate real neighborhood engagement.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Link
              to="/organizer/events/new"
              className="text-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
            >
              Post an Event Free
            </Link>
            <Link
              to="/organizer/dashboard"
              className="text-center px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/20"
            >
              Organizer Console
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
