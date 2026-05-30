import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard, Calendar } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: UserProfile | null;
  isAdmin: boolean;
  onLogout: () => void;
  supabaseStatus?: 'checking' | 'connected' | 'unconfigured' | 'error';
}

export default function Navbar({ currentPage, onNavigate, currentUser, isAdmin, onLogout, supabaseStatus = 'checking' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'results', label: 'Results' },
    { id: 'appointment', label: 'Appointment' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (pageId: string) => {
    onNavigate(pageId);
    setIsMobileOpen(false);
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-light'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3 select-none">
            <div
              onClick={() => handleLinkClick('home')}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <img
                src="https://i.ibb.co/HDjz6nFD/Whats-App-Image-2026-05-29-at-3-08-39-PM.jpg"
                alt="Prisha Clinic Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-secondary/20 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <span className="font-heading text-lg sm:text-2xl font-black tracking-tight text-primary uppercase">
                Prisha
              </span>
            </div>

            {/* Supabase Status Indicator Badge */}
            <div className="hidden sm:inline-flex items-center">
              {supabaseStatus === 'connected' && (
                <span className="inline-flex items-center space-x-1 bg-green-500/10 text-green-700 border border-green-500/20 px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase" title="Live connection active">
                  <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
                  <span>Supabase Live</span>
                </span>
              )}
              {supabaseStatus === 'unconfigured' && (
                <span className="inline-flex items-center space-x-1 bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase" title="API active, but standard tables does not exist yet. Operating in local sandbox mode.">
                  <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Empty Tables</span>
                </span>
              )}
              {supabaseStatus === 'error' && (
                <span className="inline-flex items-center space-x-1 bg-rose-500/10 text-rose-700 border border-rose-500/20 px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase" title="Failed to contact Supabase. Running client-side simulation.">
                  <span className="w-1 h-1 rounded-full bg-rose-500"></span>
                  <span>Sandbox Mode</span>
                </span>
              )}
              {supabaseStatus === 'checking' && (
                <span className="inline-flex items-center space-x-1 bg-gray-500/10 text-gray-500 border border-gray-500/20 px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase">
                  <span className="w-1 h-1 rounded-full bg-gray-400 animate-pulse"></span>
                  <span>Checking...</span>
                </span>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative font-body text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer pb-1 ${
                    isActive
                      ? 'text-primary border-b-2 border-primary'
                      : isScrolled
                      ? 'text-dark/80 hover:text-primary'
                      : 'text-white hover:text-accent font-semibold filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right Side Controls */}
          <div className="hidden lg:flex items-center space-x-4">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center space-x-2 p-1.5 rounded-full transition-all focus:outline-none cursor-pointer ${
                    isScrolled
                      ? 'hover:bg-light border border-secondary/20'
                      : 'hover:bg-black/10 border border-white/20'
                  }`}
                >
                  {currentUser.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.full_name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-secondary"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-secondary text-white font-body flex items-center justify-center text-sm font-bold">
                      {getInitials(currentUser.full_name)}
                    </div>
                  )}
                  <span
                    className={`font-body text-sm font-medium pr-1 ${
                      isScrolled ? 'text-dark' : 'text-white filter drop-shadow'
                    }`}
                  >
                    {currentUser.full_name?.split(' ')[0]}
                  </span>
                  {isAdmin && (
                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-light py-2 z-50 animate-fade-in origin-top-right">
                      <div className="px-4 py-3 border-b border-light">
                        <p className="text-xs text-gray-400 font-body">Signed in as</p>
                        <p className="text-sm font-semibold text-dark font-body truncate">
                          {currentUser.email}
                        </p>
                      </div>

                      {isAdmin ? (
                        <button
                          onClick={() => {
                            handleLinkClick('admin');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-dark hover:bg-light font-body flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary" />
                          <span>Clinic Control Panel</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleLinkClick('dashboard');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-dark hover:bg-light font-body flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <User className="w-4 h-4 text-primary" />
                          <span>My Patient Portal</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          handleLinkClick('appointment');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-dark hover:bg-light font-body flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Book Appointment</span>
                      </button>

                      <div className="border-t border-light mt-1"></div>
                      <button
                        onClick={() => {
                          onLogout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-body flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleLinkClick('login')}
                className={`font-body text-sm font-semibold px-6 py-2 rounded-full border transition-all duration-300 cursor-pointer ${
                  isScrolled
                    ? 'border-primary text-primary hover:bg-primary hover:text-white'
                    : 'border-white text-white hover:bg-white hover:text-primary filter drop-shadow'
                }`}
              >
                Log In
              </button>
            )}

            <button
              onClick={() => handleLinkClick('appointment')}
              className="bg-secondary hover:bg-primary text-white font-body text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer shadow-md shadow-secondary/15"
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="lg:hidden flex items-center space-x-2">
            {currentUser && (
              <button
                onClick={() => handleLinkClick(isAdmin ? 'admin' : 'dashboard')}
                className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-body text-xs font-bold"
                title="Go to portal"
              >
                {getInitials(currentUser.full_name)}
              </button>
            )}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={`p-2 rounded-full transition-colors focus:outline-none cursor-pointer ${
                isScrolled ? 'text-primary hover:bg-light' : 'text-white'
              }`}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between py-6 px-6 lg:hidden animate-fade-in">
          <div>
            <div className="flex justify-between items-center mb-8">
              <div
                onClick={() => handleLinkClick('home')}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <img
                  src="https://i.ibb.co/HDjz6nFD/Whats-App-Image-2026-05-29-at-3-08-39-PM.jpg"
                  alt="Prisha Clinic Logo"
                  className="w-7 h-7 rounded-full object-cover border border-secondary/20 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <span className="font-heading text-lg font-black text-primary uppercase">
                  Prisha
                </span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 rounded-full hover:bg-light text-primary cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className={`text-left font-body text-lg font-medium py-2 border-b border-light ${
                      isActive ? 'text-primary font-bold pl-2 border-l-4 border-l-primary' : 'text-dark/80'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col space-y-3 pt-6 border-t border-light">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-3 px-2 py-1 mb-2">
                  <div className="w-10 h-10 rounded-full bg-secondary text-white font-body flex items-center justify-center font-bold">
                    {getInitials(currentUser.full_name)}
                  </div>
                  <div>
                    <h4 className="font-body text-sm font-bold text-dark">{currentUser.full_name}</h4>
                    <p className="text-xs text-paragraph truncate max-w-[200px]">{currentUser.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleLinkClick(isAdmin ? 'admin' : 'dashboard')}
                  className="w-full text-center bg-light text-primary border border-secondary/20 py-3 rounded-full font-body text-sm font-semibold transition-colors cursor-pointer"
                >
                  Go to {isAdmin ? 'Admin Dashboard' : 'My Portal'}
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileOpen(false);
                  }}
                  className="w-full text-center text-rose-600 hover:bg-rose-50 py-3 rounded-full font-body text-sm font-semibold transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => handleLinkClick('login')}
                className="w-full text-center border border-primary text-primary hover:bg-primary hover:text-white py-3 rounded-full font-body text-sm font-semibold transition-all cursor-pointer"
              >
                Log In
              </button>
            )}

            <button
              onClick={() => handleLinkClick('appointment')}
              className="w-full text-center bg-primary text-white py-3 rounded-full font-body text-sm font-semibold hover:bg-dark transition-colors cursor-pointer shadow-md shadow-primary/25"
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
