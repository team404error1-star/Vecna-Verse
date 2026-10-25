import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Radio
} from 'lucide-react';

export function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Is Locora completely free to use?',
      a: 'Yes, 100%. Locora is built on open-source, community-first principles. Creating an attendee account, browsing local events, and reserving tickets has zero fees. Community organizers can also host non-commercial workshops and neighborhood gatherings completely free.'
    },
    {
      q: 'Do I need an account to browse neighborhood events?',
      a: 'No! You can freely explore the Discover feed, filter by neighborhood or category, view event locations and schedules without signing in. You only need a free account when you want to RSVP, save events to your personal wishlist, or receive personalized SmartMatch recommendations.'
    },
    {
      q: 'How does Locora protect my privacy compared to social media platforms?',
      a: 'Locora has zero third-party advertising trackers and never sells your data to brokers. Your profile is strictly used to match you with gatherings in your chosen neighborhoods, and your calendar exports sync directly to your personal device.'
    },
    {
      q: 'How can I publish my own neighborhood event or workshop?',
      a: 'Simply click "Post Event" in the navigation bar. You can specify date, venue address, maximum capacity, description, and cover image. Locora immediately publishes your listing to nearby neighbors and handles registration counts and attendee lists automatically.'
    },
    {
      q: 'Can I sync my reserved events to my personal calendar?',
      a: 'Yes. Every confirmed reservation includes an instant ".ics" calendar export compatible with Google Calendar, Apple Calendar, and Microsoft Outlook, complete with location pins and reminders.'
    }
  ];

  const testimonials = [
    {
      quote:
        'We filled all 45 seats for our Community Fermentation & Sourdough Workshop in under 4 hours without spending a single dollar on social media ads. Locora connected us straight to true neighbors.',
      author: 'Elena Rostova',
      role: 'Artisan Baker & Workshop Lead',
      neighborhood: 'Downtown Arts District'
    },
    {
      quote:
        'I relocated to the city three months ago knowing nobody. Through Locora’s courtyard acoustic sessions and Saturday maker clinics, I found a real circle of close friends.',
      author: 'Marcus Vance',
      role: 'Civic Organizer & Attendee',
      neighborhood: 'Historic Old Town'
    },
    {
      quote:
        'Managing volunteer registrations for our urban park restoration used to mean dozens of messy spreadsheets. Locora streamlined RSVPs and attendee notifications in five minutes.',
      author: 'Sarah Chen',
      role: 'Community Garden Director',
      neighborhood: 'Greenwood Heights'
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* 1. Hero Section */}
      <section className="relative pt-8 sm:pt-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#1E3F35] uppercase">
                <Radio className="w-3.5 h-3.5 text-[#1E3F35] animate-pulse" />
                <span>Hyperlocal Community Platform</span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1E2320] leading-[1.08] text-balance">
                Real gatherings. <br />
                Real neighbors. <br />
                <span className="text-[#1E3F35]">Zero social noise.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#5F635D] max-w-xl leading-relaxed">
                Locora connects you with artisan markets, courtyard concerts, indie hackathons, and neighborhood workshops happening right outside your doorstep. Free from algorithms, ads, and group chat chaos.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md">
                <Link
                  to="/signup"
                  className="px-6 py-3.5 bg-[#1E3F35] hover:bg-[#163028] text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md text-center whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Join Your Neighborhood Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/discover"
                  className="px-5 py-3.5 bg-white hover:bg-[#FAF8F5] text-[#1E2320] text-sm font-medium rounded-xl border border-[#E2DFD8] transition-colors text-center whitespace-nowrap"
                >
                  Explore Events as Guest
                </Link>
              </div>

              {/* Micro Trust Proof */}
              <div className="flex items-center gap-6 pt-2 text-xs text-[#5F635D]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1E3F35]" />
                  <span>100% Free & Open</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1E3F35]" />
                  <span>No Ad Tracking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1E3F35]" />
                  <span>Instant Calendar Sync</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-stone-200 border border-[#E2DFD8]">
                <img
                  src="/src/assets/images/hero_neighborhood_gathering_1792850960020.jpg"
                  alt="Evening neighborhood dinner and music gathering in community courtyard"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                
                {/* Floating Glassmorphic Event Ticket Preview */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white/60 shadow-lg text-[#1E2320]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold text-[#1E3F35] uppercase tracking-wider">
                        Happening This Saturday
                      </p>
                      <h4 className="text-sm font-bold text-[#1E2320] mt-0.5 line-clamp-1">
                        Lantern Courtyard Concert & Artisan Market
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#5F635D] mt-1">
                        <span>Historic Old Town</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">6:30 PM</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#1E3F35] font-semibold">Free RSVP</span>
                      </div>
                    </div>
                    <Link
                      to="/login"
                      className="px-3.5 py-1.5 bg-[#1E3F35] hover:bg-[#163028] text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Quantitative Rigor Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 bg-white rounded-2xl border border-[#E7E3DB] shadow-xs">
            <div>
              <p className="font-editorial text-3xl sm:text-4xl font-bold text-[#1E3F35] tabular-nums">
                45+
              </p>
              <p className="text-xs sm:text-sm text-[#5F635D] mt-1 font-medium">
                Active Neighborhoods
              </p>
            </div>
            <div>
              <p className="font-editorial text-3xl sm:text-4xl font-bold text-[#1E3F35] tabular-nums">
                12,800+
              </p>
              <p className="text-xs sm:text-sm text-[#5F635D] mt-1 font-medium">
                Community RSVPs
              </p>
            </div>
            <div>
              <p className="font-editorial text-3xl sm:text-4xl font-bold text-[#1E3F35] tabular-nums">
                320+
              </p>
              <p className="text-xs sm:text-sm text-[#5F635D] mt-1 font-medium">
                Local Event Hosts
              </p>
            </div>
            <div>
              <p className="font-editorial text-3xl sm:text-4xl font-bold text-[#1E3F35] tabular-nums">
                $0
              </p>
              <p className="text-xs sm:text-sm text-[#5F635D] mt-1 font-medium">
                Platform Fees & Ads
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mechanism / How It Works (Clean Editorial Numbering) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold text-[#1E3F35] tracking-wider uppercase">
            Simple, Transparent Flow
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#1E2320] mt-2 text-balance">
            How Locora brings your community together in three steps.
          </h2>
          <p className="text-sm sm:text-base text-[#5F635D] mt-3 leading-relaxed">
            No endless scrolling through national ad algorithms. Discover gatherings based on physical proximity, genuine interests, and verified attendance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-8 bg-white rounded-2xl border border-[#E7E3DB] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-[#1E3F35] tracking-wider">
                01. DISCOVER LOCAL
              </span>
              <h3 className="font-editorial text-xl font-bold text-[#1E2320]">
                Within Walking Distance
              </h3>
              <p className="text-sm text-[#5F635D] leading-relaxed">
                Filter activities by your specific district, walking radius, or public transit stop. From farmers markets to civic hackathons, see only what is actually nearby.
              </p>
            </div>
            <div className="pt-4 border-t border-[#F0ECE1] text-xs text-[#5F635D] flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-[#1E3F35]" />
              <span>Precise district filtering</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 bg-white rounded-2xl border border-[#E7E3DB] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-[#1E3F35] tracking-wider">
                02. SMARTMATCH ALIGNMENT
              </span>
              <h3 className="font-editorial text-xl font-bold text-[#1E2320]">
                Curated Interest Pairing
              </h3>
              <p className="text-sm text-[#5F635D] leading-relaxed">
                Select topics you care about—like acoustic folk, fermentation, urban gardening, or coding. Receive transparent suggestions explaining why each event matches your schedule.
              </p>
            </div>
            <div className="pt-4 border-t border-[#F0ECE1] text-xs text-[#5F635D] flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-[#1E3F35]" />
              <span>Zero opaque algorithmic bias</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 bg-white rounded-2xl border border-[#E7E3DB] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-[#1E3F35] tracking-wider">
                03. INSTANT RSVP & PASS
              </span>
              <h3 className="font-editorial text-xl font-bold text-[#1E2320]">
                One-Click Calendar Sync
              </h3>
              <p className="text-sm text-[#5F635D] leading-relaxed">
                Secure your spot with one click. Get automated .ics calendar invites for Apple, Google, or Outlook, complete with attendee check-in codes and venue directions.
              </p>
            </div>
            <div className="pt-4 border-t border-[#F0ECE1] text-xs text-[#5F635D] flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-[#1E3F35]" />
              <span>Native calendar download</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bento Grid of Capabilities */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold text-[#1E3F35] tracking-wider uppercase">
            Platform Capabilities
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#1E2320] mt-2 text-balance">
            Built for passionate attendees and dedicated community hosts.
          </h2>
          <p className="text-sm sm:text-base text-[#5F635D] mt-3 leading-relaxed">
            Whether you are searching for Saturday plans or rallying 200 neighbors for a street festival, Locora gives you reliable, purpose-built tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1 (Wide: col-span-2) */}
          <div className="md:col-span-2 p-8 sm:p-10 bg-white rounded-3xl border border-[#E7E3DB] shadow-xs flex flex-col justify-between">
            <div className="space-y-4 max-w-xl">
              <span className="text-xs font-semibold text-[#1E3F35] uppercase tracking-wider">
                For Local Explorers
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1E2320]">
                Hyperlocal discovery that respects your walking radius.
              </h3>
              <p className="text-sm sm:text-base text-[#5F635D] leading-relaxed">
                Traditional event directories show arena concerts 30 miles away. Locora is designed ground-up for walkability and micro-neighborhoods, featuring intimate book clubs, popup dinners, and community workshops.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-[#F0ECE1] flex flex-wrap items-center gap-4 text-xs font-medium text-[#5F635D]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3F35]" />
                Live distance sorting
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3F35]" />
                Interactive map clustering
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3F35]" />
                Free guest browsing
              </span>
            </div>
          </div>

          {/* Bento Card 2 (Col 1) */}
          <div className="p-8 sm:p-10 bg-[#1E3F35] rounded-3xl text-white shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#D0E2D9] uppercase tracking-wider">
                SmartMatch Engine
              </span>
              <h3 className="font-editorial text-2xl font-bold text-white leading-snug">
                Personalized discovery without tracking cookies.
              </h3>
              <p className="text-sm text-[#D0E2D9] leading-relaxed">
                Tune your interest profile once. Locora scores local happenings by category match and neighborhood closeness with 100% transparency.
              </p>
            </div>
            <div className="mt-6">
              <Link
                to="/smart-match"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline"
              >
                <span>Test SmartMatch now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Card 3 (Col 1) */}
          <div className="p-8 sm:p-10 bg-white rounded-3xl border border-[#E7E3DB] shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#1E3F35] uppercase tracking-wider">
                Calendar & Passes
              </span>
              <h3 className="font-editorial text-2xl font-bold text-[#1E2320]">
                One-tap sync to Apple, Google & Outlook.
              </h3>
              <p className="text-sm text-[#5F635D] leading-relaxed">
                Never miss an event you committed to. RSVPs generate direct .ics files with precise calendar times, location pins, and check-in QR codes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F0ECE1] text-xs text-[#8C887E]">
              Works offline on mobile and desktop
            </div>
          </div>

          {/* Bento Card 4 (Wide: col-span-2) */}
          <div className="md:col-span-2 p-8 sm:p-10 bg-white rounded-3xl border border-[#E7E3DB] shadow-xs flex flex-col justify-between">
            <div className="space-y-4 max-w-xl">
              <span className="text-xs font-semibold text-[#1E3F35] uppercase tracking-wider">
                For Event Organizers
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1E2320]">
                Everything you need to host, manage RSVPs, and grow your community.
              </h3>
              <p className="text-sm sm:text-base text-[#5F635D] leading-relaxed">
                Publish a clean event page in 60 seconds. Set attendee caps, manage waitlists, download attendee CSV rosters, and check guests in with real-time counters.
              </p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/organizer/events/new"
                className="px-5 py-2.5 bg-[#1E3F35] hover:bg-[#163028] text-white text-xs font-semibold rounded-lg transition-colors text-center whitespace-nowrap"
              >
                Post Your First Event Free
              </Link>
              <Link
                to="/organizer/dashboard"
                className="px-5 py-2.5 bg-[#FAF8F5] hover:bg-[#F2EFE9] text-[#1E2320] text-xs font-medium rounded-lg border border-[#E2DFD8] transition-colors text-center whitespace-nowrap"
              >
                Explore Organizer Console
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Attributable Social Proof / Testimonials */}
      <section id="community" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-[#1E3F35] tracking-wider uppercase">
            Community Voices
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#1E2320] mt-2">
            Trusted by neighborhood organizers and attendees alike.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 bg-white rounded-2xl border border-[#E7E3DB] shadow-xs flex flex-col justify-between space-y-6"
            >
              <p className="text-sm text-[#3E433F] leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="pt-4 border-t border-[#F0ECE1]">
                <p className="text-sm font-bold text-[#1E2320]">{t.author}</p>
                <div className="flex items-center gap-2 text-xs text-[#5F635D] mt-0.5">
                  <span>{t.role}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.neighborhood}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Frequently Asked Questions */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold text-[#1E3F35] tracking-wider uppercase">
            Got Questions?
          </span>
          <h2 className="font-editorial text-3xl font-bold tracking-tight text-[#1E2320] mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#E7E3DB] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F5]/80 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-[#1E2320]">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#1E3F35] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8C887E] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-[#5F635D] leading-relaxed border-t border-[#F0ECE1]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Final Conversion Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1E3F35] rounded-3xl p-8 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#D0E2D9] px-3 py-1 rounded-full bg-white/10">
              Get Started in 60 Seconds
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-balance leading-tight">
              Step outside and discover what is happening on your block.
            </h2>
            <p className="text-sm sm:text-base text-[#D0E2D9] leading-relaxed max-w-lg mx-auto">
              Join thousands of neighbors who discover concerts, workshops, and civic gatherings every week. Free to join, free forever.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-7 py-3 bg-white text-[#1E3F35] hover:bg-[#F2EFE9] text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Create Free Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/discover"
                className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors whitespace-nowrap text-center"
              >
                Browse Events Without Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
