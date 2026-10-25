import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, PlusCircle, User, LogOut, Sparkles, ChevronDown } from 'lucide-react';
import { authService } from '../../services/auth-service';
import { UserProfile } from '../../types';
import { isDemoMode } from '../../services/api-client';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  const handleQuickSwitch = (role: 'attendee' | 'organizer' | 'guest') => {
    authService.quickSwitchUser(role);
    setProfileDropdownOpen(false);
    if (role === 'organizer') {
      navigate('/organizer/dashboard');
    } else if (role === 'attendee') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const isLandingPage = !currentUser && (location.pathname === '/' || location.pathname === '/landing');

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E3DB]">
      {/* Top Bar Contract: 3 zones, gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark in Editorial Serif */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            className="font-editorial text-2xl font-bold tracking-tight text-[#1E2320] whitespace-nowrap shrink-0 hover:text-[#1E3F35] transition-colors"
          >
            Locora
          </Link>
        </div>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5F635D]">
          {isLandingPage ? (
            <>
              <a href="#how-it-works" className="hover:text-[#1E2320] transition-colors whitespace-nowrap shrink-0">
                How It Works
              </a>
              <a href="#features" className="hover:text-[#1E2320] transition-colors whitespace-nowrap shrink-0">
                Capabilities
              </a>
              <a href="#community" className="hover:text-[#1E2320] transition-colors whitespace-nowrap shrink-0">
                Community
              </a>
              <a href="#faq" className="hover:text-[#1E2320] transition-colors whitespace-nowrap shrink-0">
                FAQ
              </a>
              <Link to="/discover" className="hover:text-[#1E2320] transition-colors whitespace-nowrap shrink-0">
                Explore Events
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/discover"
                className={`transition-colors whitespace-nowrap shrink-0 pb-1 ${
                  isCurrent('/discover')
                    ? 'text-[#1E2320] border-b-2 border-[#1E3F35] font-semibold'
                    : 'hover:text-[#1E2320]'
                }`}
              >
                Discover
              </Link>

              <Link
                to="/smart-match"
                className={`inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                  isCurrent('/smart-match')
                    ? 'text-[#1E2320] border-b-2 border-[#1E3F35] font-semibold'
                    : 'hover:text-[#1E2320]'
                }`}
              >
                <span>SmartMatch</span>
              </Link>

              {currentUser && (
                <Link
                  to="/dashboard"
                  className={`transition-colors whitespace-nowrap shrink-0 pb-1 ${
                    isCurrent('/dashboard') || isCurrent('/my-registrations') || isCurrent('/saved')
                      ? 'text-[#1E2320] border-b-2 border-[#1E3F35] font-semibold'
                      : 'hover:text-[#1E2320]'
                  }`}
                >
                  My Hub
                </Link>
              )}

              <Link
                to="/organizer/dashboard"
                className={`transition-colors whitespace-nowrap shrink-0 pb-1 ${
                  isCurrent('/organizer')
                    ? 'text-[#1E2320] border-b-2 border-[#1E3F35] font-semibold'
                    : 'hover:text-[#1E2320]'
                }`}
              >
                Organizer Hub
              </Link>
            </>
          )}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs text-xs font-medium text-slate-700"
                aria-expanded={profileDropdownOpen}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                />
                <span className="max-w-[120px] truncate">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-medium text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider mt-1">
                      Role: {currentUser.role}
                    </p>
                  </div>

                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Attendee Dashboard
                  </Link>
                  <Link
                    to="/my-registrations"
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    My Registrations
                  </Link>
                  <Link
                    to="/saved"
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Saved Events
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Profile Settings
                  </Link>

                  <div className="border-t border-slate-100 my-1" />

                  <Link
                    to="/organizer/dashboard"
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Organizer Console
                  </Link>
                  <Link
                    to="/organizer/events/new"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs text-indigo-600 font-medium hover:bg-indigo-50"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Create New Event</span>
                  </Link>

                  <div className="border-t border-slate-100 my-1" />

                  <div className="px-4 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Quick Role Switch
                  </div>
                  <button
                    onClick={() => handleQuickSwitch('attendee')}
                    className="w-full text-left px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Switch to Attendee (Sarah)
                  </button>
                  <button
                    onClick={() => handleQuickSwitch('organizer')}
                    className="w-full text-left px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Switch to Organizer (Marcus)
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : isLandingPage ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-semibold text-[#1E2320] hover:text-[#1E3F35] transition-colors whitespace-nowrap shrink-0"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1E3F35] hover:bg-[#163028] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-2xs"
              >
                Join Free
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-medium text-white bg-[#1E3F35] rounded-lg hover:bg-[#163028] transition-colors whitespace-nowrap shrink-0"
              >
                Sign In
              </Link>
              <Link
                to="/organizer/events/new"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#1E3F35] hover:bg-[#163028] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Event</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {!isLandingPage && (
            <Link
              to="/organizer/events/new"
              className="p-2 text-[#1E3F35] hover:bg-[#EAF1ED] rounded-lg"
              aria-label="Post event"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1E2320] hover:text-[#1E3F35] rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          {isLandingPage ? (
            <div className="space-y-1">
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                How It Works
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Capabilities
              </a>
              <a
                href="#community"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Community
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                FAQ
              </a>
              <Link
                to="/discover"
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Explore All Events
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              <Link
                to="/"
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Home
              </Link>
              <Link
                to="/discover"
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Discover Events
              </Link>
              <Link
                to="/smart-match"
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                SmartMatch Recommendations
              </Link>
              {currentUser && (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    My Dashboard
                  </Link>
                  <Link
                    to="/my-registrations"
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    My Registrations
                  </Link>
                  <Link
                    to="/saved"
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Saved Events
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Profile & Preferences
                  </Link>
                </>
              )}
              <Link
                to="/organizer/dashboard"
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Organizer Dashboard
              </Link>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-rose-600 p-2 hover:bg-rose-50 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : isLandingPage ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/signup"
                  className="w-full text-center py-2.5 text-xs font-semibold text-white bg-[#1E3F35] rounded-lg"
                >
                  Join Locora Free
                </Link>
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 text-xs font-medium text-white bg-[#1E3F35] rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/organizer/events/new"
                  className="w-full text-center py-2.5 text-xs font-medium text-white bg-[#1E3F35] hover:bg-[#163028] rounded-lg"
                >
                  Create New Event
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
