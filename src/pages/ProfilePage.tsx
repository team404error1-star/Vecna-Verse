import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Check, AlertCircle, MapPin, Sparkles, LogOut } from 'lucide-react';
import { authService } from '../services/auth-service';
import { UserProfile, EventCategory } from '../types';
import { DEMO_CATEGORIES, DEMO_NEIGHBORHOODS } from '../mocks/demo-data';
import { useToast } from '../components/ui/Toast';
import { isDemoMode } from '../services/api-client';

export function ProfilePage() {
  const navigate = useNavigate();
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
      <div className="pb-4 border-b border-[#E5E1D8]">
        <h1 className="font-editorial text-3xl font-bold tracking-tight text-[#1E2320]">
          Profile & Preferences
        </h1>
        <p className="text-sm text-[#5F635D] mt-1">
          Manage your personal information, home neighborhood, and SmartMatch topic preferences.
        </p>
      </div>

      {isDemoMode() && (
        <div className="p-4 bg-[#EAF1ED] border border-[#D0E2D9] rounded-xl text-xs text-[#1E3F35] flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-[#1E3F35] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Demo Session Persistence:</span> Any
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

      <form onSubmit={handleSaveProfile} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E1D8] shadow-xs">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="font-editorial text-base font-bold text-[#1E2320] pb-2 border-b border-[#EBE7DF]">
            Account Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
                Display Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-xs bg-white border border-[#E2DFD8] rounded-lg p-2.5 text-[#1E2320] focus:border-[#1E3F35]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full text-xs bg-[#F4F1EA] border border-[#E2DFD8] rounded-lg p-2.5 text-[#8C887E] cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
              Bio / Community Note
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other attendees and organizers a bit about yourself..."
              className="w-full text-xs bg-white border border-[#E2DFD8] rounded-lg p-2.5 text-[#1E2320] focus:border-[#1E3F35]"
            />
          </div>
        </div>

        {/* Neighborhood Preference */}
        <div className="space-y-4 pt-4">
          <h2 className="font-editorial text-base font-bold text-[#1E2320] pb-2 border-b border-[#EBE7DF]">
            Location Settings
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">
              Primary Home Neighborhood
            </label>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full text-xs bg-white border border-[#E2DFD8] rounded-lg p-2.5 text-[#1E2320] cursor-pointer focus:border-[#1E3F35]"
            >
              {DEMO_NEIGHBORHOODS.filter((n) => n !== 'All Neighborhoods').map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#5F635D] mt-1">
              Used to calculate proximity weighting for SmartMatch recommendations.
            </p>
          </div>
        </div>

        {/* Topic Interests */}
        <div className="space-y-4 pt-4">
          <h2 className="font-editorial text-base font-bold text-[#1E2320] pb-2 border-b border-[#EBE7DF]">
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
                      ? 'bg-[#1E3F35] text-white shadow-2xs font-semibold'
                      : 'bg-white text-[#5F635D] border border-[#E2DFD8] hover:bg-[#F4F1EA] hover:text-[#1E2320]'
                  }`}
                >
                  {selected && <Check className="w-3.5 h-3.5" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save & Sign Out CTA */}
        <div className="pt-6 border-t border-[#EBE7DF] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={async () => {
              await authService.logout();
              navigate('/');
              toast({
                type: 'info',
                title: 'Signed Out',
                description: 'You have been safely signed out.',
              });
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#1E3F35] hover:bg-[#163028] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
