import React, { useState } from 'react';
import { User, Check, AlertCircle, MapPin, Sparkles } from 'lucide-react';
import { authService } from '../services/auth-service';
import { UserProfile, EventCategory } from '../types';
import { DEMO_CATEGORIES, DEMO_NEIGHBORHOODS } from '../mocks/demo-data';
import { useToast } from '../components/ui/Toast';
import { isDemoMode } from '../services/api-client';

export function ProfilePage() {
  const { toast } = useToast();
  const currentUser = authService.getCurrentUser();

  const [name, setName] = useState(currentUser?.name || '');
  const [email] = useState(currentUser?.email || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [neighborhood, setNeighborhood] = useState(
    currentUser?.neighborhood || 'Silverlake Commons'
  );
  const [interests, setInterests] = useState<EventCategory[]>(
    currentUser?.interests || ['Food & Community', 'Live Music & Culture']
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleInterest = (category: EventCategory) => {
    setInterests((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a display name.');
      return;
    }
    if (interests.length === 0) {
      setError('Please select at least one interest to power your recommendations.');
      return;
    }
    setError('');
    setSaving(true);

    try {
      await authService.updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        neighborhood,
        interests,
      });
      toast({
        type: 'success',
        title: 'Profile Updated',
        description: isDemoMode()
          ? 'Preferences saved to your local browser session.'
          : 'Your account settings were successfully updated.',
      });
    } catch {
      toast({
        type: 'error',
        title: 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Profile & Preferences
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal information, home neighborhood, and SmartMatch topic preferences.
        </p>
      </div>

      {isDemoMode() && (
        <div className="p-4 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900">Demo Session Persistence:</span> Any
            updates you save here will be reflected across your recommendations and local dashboard
            immediately.
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Account Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Display Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full text-xs bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Bio / Community Note
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other attendees and organizers a bit about yourself..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Neighborhood Preference */}
        <div className="space-y-4 pt-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Location Settings
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Primary Home Neighborhood
            </label>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 cursor-pointer"
            >
              {DEMO_NEIGHBORHOODS.filter((n) => n !== 'All Neighborhoods').map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Used to calculate proximity weighting for SmartMatch recommendations.
            </p>
          </div>
        </div>

        {/* Topic Interests */}
        <div className="space-y-4 pt-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Interest Categories
          </h2>

          <div className="flex flex-wrap gap-2">
            {DEMO_CATEGORIES.map((cat) => {
              const selected = interests.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleInterest(cat)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selected
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {selected && <Check className="w-3.5 h-3.5" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
