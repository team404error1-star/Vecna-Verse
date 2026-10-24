import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar, Users, Eye, BarChart2, Edit, ChevronRight, CheckCircle2 } from 'lucide-react';
import { EventItem, Organizer } from '../types';
import { eventsService } from '../services/events-service';
import { organizersService, OrganizerStats } from '../services/organizers-service';
import { authService } from '../services/auth-service';
import { formatEventDate, formatPrice } from '../utils/formatters';

export function OrganizerDashboardPage() {
  const currentUser = authService.getCurrentUser();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [stats, setStats] = useState<OrganizerStats>({
    totalEvents: 0,
    publishedCount: 0,
    totalRegistrations: 0,
    activeCommunities: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrganizerData() {
      setLoading(true);
      try {
        const { data } = await eventsService.getEvents({}, 1, 50);
        // For demo, show events where organizer is org-1 or current user
        setEvents(data);

        const totalRegs = data.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);
        setStats({
          totalEvents: data.length,
          publishedCount: data.filter((e) => e.status === 'published').length,
          totalRegistrations: totalRegs,
          activeCommunities: 1,
        });
      } finally {
        setLoading(false);
      }
    }
    loadOrganizerData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
        <div>
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            Organizer Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Community Event Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your community listings, track attendee RSVPs, and coordinate check-ins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/organizer/events"
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            Manage Events
          </Link>
          <Link
            to="/organizer/events/new"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Event</span>
          </Link>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200/80 space-y-1">
          <span className="text-xs font-medium text-slate-500">Total Events Hosted</span>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{stats.totalEvents}</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/80 space-y-1">
          <span className="text-xs font-medium text-slate-500">Live Published</span>
          <p className="text-2xl font-bold text-emerald-600 tabular-nums">{stats.publishedCount}</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/80 space-y-1">
          <span className="text-xs font-medium text-slate-500">Total RSVPs Confirmed</span>
          <p className="text-2xl font-bold text-indigo-600 tabular-nums">{stats.totalRegistrations}</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/80 space-y-1">
          <span className="text-xs font-medium text-slate-500">Active Districts</span>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">4</p>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Recent Events</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live registration tracking and roster access
            </p>
          </div>
          <Link
            to="/organizer/events"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-3">
            <p>You haven't posted any events yet.</p>
            <Link
              to="/organizer/events/new"
              className="inline-block px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-5">Event</th>
                  <th className="py-3 px-5">Date & Venue</th>
                  <th className="py-3 px-5">Category</th>
                  <th className="py-3 px-5">RSVPs / Capacity</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.slice(0, 6).map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.coverImage}
                          alt={evt.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/events/${evt.id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 truncate block max-w-xs"
                          >
                            {evt.title}
                          </Link>
                          <span className="text-slate-400 text-[11px]">
                            {formatPrice(evt.price)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap">
                      <p className="font-medium text-slate-800">{formatEventDate(evt.startDate)}</p>
                      <p className="text-slate-500 text-[11px] truncate max-w-[160px]">
                        {evt.venueName}
                      </p>
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap text-slate-600">
                      {evt.category}
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="font-semibold tabular-nums text-slate-900">
                        {evt.registeredCount} / {evt.capacity}
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600"
                          style={{
                            width: `${Math.min(100, (evt.registeredCount / evt.capacity) * 100)}%`,
                          }}
                        />
                      </div>
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                        {evt.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap text-right space-x-2">
                      <Link
                        to={`/organizer/events/${evt.id}/attendees`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <Users className="w-3 h-3" />
                        <span>Roster</span>
                      </Link>

                      <Link
                        to={`/organizer/events/${evt.id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
