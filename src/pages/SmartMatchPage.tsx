import React, { useState, useEffect } from 'react';
import { Sparkles, Sliders, Check, MapPin, CheckCircle } from 'lucide-react';
import { EventCategory, SmartMatchResult } from '../types';
import { DEMO_CATEGORIES, DEMO_NEIGHBORHOODS } from '../mocks/demo-data';
import { smartMatchService } from '../services/smart-match-service';
import { authService } from '../services/auth-service';
import { EventCard } from '../components/events/EventCard';
import { EventListSkeleton, EmptyState } from '../components/ui/LoadingSkeleton';

export function SmartMatchPage() {
  const currentUser = authService.getCurrentUser();

  const [selectedInterests, setSelectedInterests] = useState<EventCategory[]>(
    currentUser?.interests || ['Food & Community', 'Live Music & Culture']
  );
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>(
    currentUser?.neighborhood || 'Silverlake Commons'
  );
  const [preferFreeOnly, setPreferFreeOnly] = useState(false);

  const [results, setResults] = useState<SmartMatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleInterest = (category: EventCategory) => {
    setSelectedInterests((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  useEffect(() => {
    let active = true;
    async function fetchRecommendations() {
      setLoading(true);
      try {
        const matches = await smartMatchService.getRecommendations({
          userInterests: selectedInterests,
          preferredNeighborhood: selectedNeighborhood,
          preferFreeOnly,
        });
        if (active) {
          setResults(matches);
        }
      } catch (err) {
        console.error('Failed to get recommendations:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchRecommendations();
    return () => {
      active = false;
    };
  }, [selectedInterests, selectedNeighborhood, preferFreeOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Explanation Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 text-indigo-600">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Deterministic Local Recommendation Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Locora SmartMatch
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          SmartMatch scores events according to your interest categories, home neighborhood proximity, and schedule availability. Each card explains the exact reasons for its recommendation.
        </p>
      </div>

      {/* Preferences Customizer Panel */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">
            Customize Recommendation Weights
          </h2>
        </div>

        {/* Interests Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Select Your Interests ({selectedInterests.length} selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {DEMO_CATEGORIES.map((cat) => {
              const active = selectedInterests.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleInterest(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Neighborhood & Free admission toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Neighborhood
            </label>
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
            >
              {DEMO_NEIGHBORHOODS.filter((n) => n !== 'All Neighborhoods').map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="preferFree"
              checked={preferFreeOnly}
              onChange={(e) => setPreferFreeOnly(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <label htmlFor="preferFree" className="text-xs font-medium text-slate-700 cursor-pointer">
              Prioritize 100% Free Admission Events
            </label>
          </div>
        </div>
      </div>

      {/* Recommended Results List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Top Matches ({results.length})
          </h2>
          <span className="text-xs text-slate-500">
            Ranked by relevance score
          </span>
        </div>

        {loading ? (
          <EventListSkeleton count={6} />
        ) : results.length === 0 ? (
          <EmptyState
            icon="sparkles"
            title="No matching events found"
            description="Try selecting at least one interest category or pick another neighborhood."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(({ event, score, matchReasons }) => (
              <div key={event.id} className="flex flex-col space-y-2">
                {/* Score & Reasons Header */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-indigo-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{score}% Match Score</span>
                    </span>
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      {event.neighborhood}
                    </span>
                  </div>
                  <ul className="space-y-0.5 text-[11px] text-slate-600 list-disc list-inside">
                    {matchReasons.map((reason, i) => (
                      <li key={i} className="truncate">
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Event Card */}
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
