import React from 'react';
import { Link } from 'react-router-dom';
import { DEMO_CATEGORIES } from '../../mocks/demo-data';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
              Locora
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Discover nearby. Connect locally. Unifying community events, local gatherings, and neighborhood organizers.
            </p>
            <p className="text-[11px] text-slate-400">
              Frontend demo client designed for seamless integration with independent REST backends.
            </p>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Explore Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              {DEMO_CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/discover?category=${encodeURIComponent(cat)}`}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Attendee & Discovery Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              For Attendees
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/discover" className="hover:text-indigo-600 transition-colors">
                  All Events
                </Link>
              </li>
              <li>
                <Link to="/smart-match" className="hover:text-indigo-600 transition-colors">
                  SmartMatch Recommendations
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
                  My Tickets & Registrations
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-indigo-600 transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-600 transition-colors">
                  Neighborhood Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Organizers & Community */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              For Organizers
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/organizer/events/new" className="hover:text-indigo-600 transition-colors">
                  Publish an Event
                </Link>
              </li>
              <li>
                <Link to="/organizer/dashboard" className="hover:text-indigo-600 transition-colors">
                  Organizer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/organizer/events" className="hover:text-indigo-600 transition-colors">
                  Manage Published Events
                </Link>
              </li>
              <li>
                <Link to="/organizers/metro-civic-tech" className="hover:text-indigo-600 transition-colors">
                  Sample Organizer Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Locora. Hyperlocal discovery and community engagement.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">REST API Ready</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-400">WCAG 2.2 AA Accessible</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-400">Zero-Pill Typography</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
