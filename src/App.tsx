import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Results from './pages/Results';
import Appointment from './pages/Appointment';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

import { UserProfile } from './types';
import { supabase } from './lib/supabase';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [loadingSession, setLoadingSession] = useState<boolean>(true);
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'unconfigured' | 'error'>('checking');

  // Global custom toasts state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Trigger succession toasts helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // State state-based navigation
  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keep track of user session states on trigger
  useEffect(() => {
    async function restoreSession() {
      try {
        // Ping database & verify standard clinic tables live
        let connectionStatus: 'connected' | 'unconfigured' | 'error' = 'connected';
        try {
          const { error } = await supabase.from('surgery_results').select('id').limit(1);
          if (error) {
            // PGRST116 or table does not exist
            if (error.code === 'PGRST116' || error.message?.includes('does not exist') || error.code === '42P01') {
              connectionStatus = 'unconfigured';
            } else {
              connectionStatus = 'error';
            }
          }
        } catch (dbErr) {
          connectionStatus = 'error';
        }
        setSupabaseStatus(connectionStatus);

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          const userEmail = session.user.email || '';
          const isAdministrator = userEmail.toLowerCase() === 'tanmayrajputtv@gmail.com' && localStorage.getItem('prisha_admin_active') === 'true';
          
          const profile: UserProfile = {
            id: session.user.id,
            email: userEmail,
            full_name: session.user.user_metadata?.full_name || 'Patient User',
            phone: session.user.user_metadata?.phone || ''
          };
          
          setCurrentUser(profile);
          setIsAdmin(isAdministrator);
        } else {
          // Check localstorage mock backups
          const activeMockSession = localStorage.getItem('prisha_mock_active_session');
          if (activeMockSession) {
            const parsed = JSON.parse(activeMockSession);
            setCurrentUser(parsed.user);
            setIsAdmin(parsed.isAdmin);
          }
        }
      } catch (e) {
        console.warn("Auth initialization error - operating offline gracefully.", e);
        setSupabaseStatus('error');
      } finally {
        setLoadingSession(false);
      }
    }
    restoreSession();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase local boundary sign out.");
    }
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('prisha_mock_active_session');
    localStorage.removeItem('prisha_admin_active');
    
    showToast('Logged out of workspace successfully.', 'info');
    navigate('home');
  };

  const handleLoginSuccess = (user: UserProfile, isAdministrator: boolean) => {
    setCurrentUser(user);
    setIsAdmin(isAdministrator);
    
    // Save session in localstorage mocking
    localStorage.setItem('prisha_mock_active_session', JSON.stringify({
      user,
      isAdmin: isAdministrator
    }));

    if (isAdministrator) {
      navigate('admin');
    } else {
      navigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-light text-dark flex flex-col justify-between selection:bg-accent/40 selection:text-primary">
      
      {/* Toast Warnings */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Navigation Layer */}
      <Navbar 
        currentPage={currentPage}
        onNavigate={navigate}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        supabaseStatus={supabaseStatus}
      />

      {/* Pages components router */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <Home onNavigate={navigate} />
        )}
        
        {currentPage === 'about' && (
          <About />
        )}

        {currentPage === 'services' && (
          <Services 
            onNavigate={navigate} 
            onSelectService={setSelectedService} 
          />
        )}

        {currentPage === 'pricing' && (
          <Pricing 
            onNavigate={navigate} 
            onSelectService={setSelectedService} 
          />
        )}

        {currentPage === 'results' && (
          <Results />
        )}

        {currentPage === 'appointment' && (
          <Appointment 
            currentUser={currentUser}
            selectedService={selectedService}
            onSuccessMessage={(msg) => showToast(msg, 'success')}
            onErrorMessage={(msg) => showToast(msg, 'error')}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'contact' && (
          <Contact onSuccessMessage={(msg) => showToast(msg, 'success')} />
        )}

        {currentPage === 'login' && (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onSuccessMessage={(msg) => showToast(msg, 'success')}
            onErrorMessage={(msg) => showToast(msg, 'error')}
          />
        )}

        {currentPage === 'dashboard' && currentUser && (
          <Dashboard 
            currentUser={currentUser}
            onLogout={handleLogout}
            onNavigate={navigate}
            onSuccessMessage={(msg) => showToast(msg, 'success')}
            onErrorMessage={(msg) => showToast(msg, 'error')}
          />
        )}

        {currentPage === 'admin' && isAdmin && (
          <Admin 
            onLogout={handleLogout}
            onNavigate={navigate}
            onSuccessMessage={(msg) => showToast(msg, 'success')}
            onErrorMessage={(msg) => showToast(msg, 'error')}
          />
        )}
      </main>

      {/* Footer Segment */}
      <Footer onNavigate={navigate} />

      {/* Floating Elements - Green Pulse WhatsApp */}
      <a
        href="https://wa.me/917875379557"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 duration-200"
        style={{
          animation: 'pulse 2s infinite',
        }}
        title="WhatsApp Live Portal"
      >
        <span className="text-2xl">💬</span>
      </a>
      
    </div>
  );
}
