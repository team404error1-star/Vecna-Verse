import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { SmartMatchPage } from './pages/SmartMatchPage';
import { DashboardPage } from './pages/DashboardPage';
import { RegistrationsPage } from './pages/RegistrationsPage';
import { SavedEventsPage } from './pages/SavedEventsPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrganizerDashboardPage } from './pages/OrganizerDashboardPage';
import { OrganizerEventsPage } from './pages/OrganizerEventsPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { EditEventPage } from './pages/EditEventPage';
import { AttendeesPage } from './pages/AttendeesPage';
import { OrganizerProfilePage } from './pages/OrganizerProfilePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { LandingPage } from './pages/LandingPage';
import { authService } from './services/auth-service';
import { UserProfile } from './types';

function HomeOrLanding() {
  const [currentUser, setCurrentUser] = React.useState<UserProfile | null>(() => authService.getCurrentUser());

  useEffect(() => {
    const unsub = authService.subscribe((u) => {
      setCurrentUser(u);
    });
    return unsub;
  }, []);

  if (currentUser) {
    return <HomePage />;
  }
  return <LandingPage />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E2320] font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Root Route: Shows Landing Page if guest/logged out; shows Community HomePage if logged in */}
              <Route path="/" element={<HomeOrLanding />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/events/:eventId" element={<EventDetailsPage />} />
              <Route path="/organizers/:organizerId" element={<OrganizerProfilePage />} />
              <Route path="/smart-match" element={<SmartMatchPage />} />

              {/* Attendee Protected Areas */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/my-registrations" element={<RegistrationsPage />} />
              <Route path="/saved" element={<SavedEventsPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Organizer Hub */}
              <Route path="/organizer/dashboard" element={<OrganizerDashboardPage />} />
              <Route path="/organizer/events" element={<OrganizerEventsPage />} />
              <Route path="/organizer/events/new" element={<CreateEventPage />} />
              <Route path="/organizer/events/:eventId/edit" element={<EditEventPage />} />
              <Route path="/organizer/events/:eventId/attendees" element={<AttendeesPage />} />

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
