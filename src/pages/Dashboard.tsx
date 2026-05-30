import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  Layout, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Phone, 
  CalendarCheck, 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  MapPin,
  Heart,
  Activity,
  Droplet
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserProfile, Appointment } from '../types';

interface DashboardProps {
  currentUser: UserProfile;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onSuccessMessage: (message: string) => void;
  onErrorMessage: (message: string) => void;
}

export default function Dashboard({ currentUser, onLogout, onNavigate, onSuccessMessage, onErrorMessage }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'profile'>('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [isSupabaseError, setIsSupabaseError] = useState(false);

  // Profile fields state
  const [profileData, setProfileData] = useState({
    fullName: currentUser.full_name || '',
    phone: currentUser.phone || '',
    birthDate: currentUser.birth_date || '',
    gender: currentUser.gender || 'Male',
    bloodGroup: currentUser.blood_group || 'B+',
    address: currentUser.address || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync profileData on mount/user change
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        fullName: currentUser.full_name || '',
        phone: currentUser.phone || '',
        birthDate: currentUser.birth_date || '',
        gender: currentUser.gender || 'Male',
        bloodGroup: currentUser.blood_group || 'B+',
        address: currentUser.address || ''
      });
    }
  }, [currentUser]);

  // Load appointments
  const loadAppointmentsData = async () => {
    setLoadingAppts(true);
    try {
      // 1. Fetch from live Supabase DB
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('email', currentUser.email)
        .order('created_at', { ascending: false });

      if (error) {
        setIsSupabaseError(true);
      } else {
        setIsSupabaseError(false);
      }

      let combined: Appointment[] = [];
      if (!error && data) {
        combined = [...data];
      }

      // 2. Fetch mock bookings as fallback / local storage syncing
      const storedMockAppts = JSON.parse(localStorage.getItem('prisha_mock_bookings') || '[]');
      const userMockAppts = storedMockAppts.filter(
        (appt: any) => appt.email === currentUser.email || appt.user_id === currentUser.id
      );
      
      combined = [...combined, ...userMockAppts];

      // De-duplicate appointments by date, time, and service
      const uniqueCombined = combined.filter((appt, index, self) =>
        index === self.findIndex((a) => a.preferred_date === appt.preferred_date && a.preferred_time === appt.preferred_time && a.service === appt.service)
      );

      setAppointments(uniqueCombined);
    } catch (err) {
      console.warn("Could not load database appointments, relying on offline storage list.", err);
      setIsSupabaseError(true);
      const storedMockAppts = JSON.parse(localStorage.getItem('prisha_mock_bookings') || '[]');
      const userMockAppts = storedMockAppts.filter(
        (appt: any) => appt.email === currentUser.email || appt.user_id === currentUser.id
      );
      setAppointments(userMockAppts);
    } finally {
      setLoadingAppts(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadAppointmentsData();
    }
  }, [currentUser]);

  // Update profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      // Update in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profileData.fullName,
          phone: profileData.phone,
          birth_date: profileData.birthDate || null,
          gender: profileData.gender,
          address: profileData.address || null,
          blood_group: profileData.bloodGroup
        })
        .eq('email', currentUser.email);

      if (error) throw error;

      onSuccessMessage('✅ Your profile has been updated successfully!');
    } catch (err: any) {
      console.log("Saving user profile to local sandbox backup storage.");
      
      // Sync into localStorage
      const storedUsers = JSON.parse(localStorage.getItem('prisha_mock_users') || '[]');
      const userIndex = storedUsers.findIndex((u: any) => u.email.toLowerCase() === currentUser.email.toLowerCase());
      
      const updatedUserObj = {
        id: currentUser.id,
        fullName: profileData.fullName,
        email: currentUser.email,
        phone: profileData.phone,
        birthDate: profileData.birthDate,
        gender: profileData.gender,
        bloodGroup: profileData.bloodGroup,
        address: profileData.address,
        updated_at: new Date().toISOString()
      };

      if (userIndex !== -1) {
        storedUsers[userIndex] = updatedUserObj;
      } else {
        storedUsers.push(updatedUserObj);
      }
      localStorage.setItem('prisha_mock_users', JSON.stringify(storedUsers));

      onSuccessMessage('✅ Your profile has been saved in this sandbox session!');
    } finally {
      setSavingProfile(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'PT';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const countAppointments = (status: 'pending' | 'approved' | 'rejected') => {
    return appointments.filter(a => a.status === status).length;
  };

  return (
    <div className="flex flex-col min-h-screen bg-light">
      {/* Upper Dashboard Greet Banner */}
      <section className="pt-28 pb-12 bg-white border-b border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* User Meta Info block */}
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 rounded-2xl bg-secondary text-white font-heading font-extrabold flex items-center justify-center text-xl shadow-lg shadow-secondary/10 border border-white/10 tracking-wider">
                {getInitials(profileData.fullName || currentUser.full_name)}
              </div>
              
              <div>
                <span className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full">
                  Verified Patient
                </span>
                
                <h1 className="font-heading text-2xl lg:text-3xl font-black text-dark tracking-tight mt-1.5">
                  Hello, {profileData.fullName || currentUser.full_name}
                </h1>
                
                <div className="flex flex-wrap items-center mt-1.5 gap-2 text-xs text-paragraph/80 font-medium">
                  <span>Prisha Aesthetic & Laser Clinic Portal</span>
                  <span className="text-stone-300">•</span>
                  
                  {isSupabaseError ? (
                    <span className="inline-flex items-center space-x-1.5 text-amber-600 bg-amber-500/5 px-2 py-0.5 rounded-md border border-amber-500/10 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      <span>SANDBOX STORAGE</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1.5 text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>SECURE CLOUD SYNCED</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => onNavigate('appointment')}
                className="w-full md:w-auto bg-primary hover:bg-dark text-white font-heading text-xs font-extrabold tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md shadow-primary/10 cursor-pointer flex items-center justify-center space-x-2 border-2 border-primary hover:border-dark"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK APPOINTMENT</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Main Panel Area */}
      <section className="py-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Desktop Left Sidebar Tabs */}
            <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-light shadow-sm space-y-1.5">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-3 mb-2.5">
                NAVIGATION
              </p>
              
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left font-body text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center space-x-3 border ${
                  activeTab === 'overview'
                    ? 'bg-secondary text-white border-secondary shadow-md shadow-secondary/10'
                    : 'text-dark hover:bg-cream/40 border-transparent'
                }`}
              >
                <Layout className="w-4 h-4 flex-shrink-0" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full text-left font-body text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center space-x-3 border ${
                  activeTab === 'appointments'
                    ? 'bg-secondary text-white border-secondary shadow-md shadow-secondary/10'
                    : 'text-dark hover:bg-cream/40 border-transparent'
                }`}
              >
                <CalendarCheck className="w-4 h-4 flex-shrink-0" />
                <span>Appointments ({appointments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left font-body text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center space-x-3 border ${
                  activeTab === 'profile'
                    ? 'bg-secondary text-white border-secondary shadow-md shadow-secondary/10'
                    : 'text-dark hover:bg-cream/40 border-transparent'
                }`}
              >
                <User className="w-4 h-4 flex-shrink-0" />
                <span>My Patient Profile</span>
              </button>

              <div className="border-t border-light pt-2.5 mt-4">
                <button
                  onClick={onLogout}
                  className="w-full text-left font-body text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent transition-all cursor-pointer flex items-center space-x-3"
                >
                  <X className="w-4 h-4 flex-shrink-0" />
                  <span>Logout from Session</span>
                </button>
              </div>
            </div>

            {/* Main Dynamic View Content */}
            <div className="lg:col-span-9 bg-white p-6 sm:p-10 rounded-2xl border border-light shadow-sm min-h-[480px]">
              
              {/* Overview HOME view */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in text-dark select-text">
                  <div className="border-b border-light pb-4">
                    <h2 className="font-heading text-lg font-extrabold uppercase tracking-wide text-dark">
                      Treatment & Consulting Summary
                    </h2>
                    <p className="font-body text-xs text-paragraph mt-0.5">
                      Your diagnostic tracker for appointments with Dr. Ankit Kumar Jain
                    </p>
                  </div>

                  {/* Clean Human Status Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800">
                          Pending Approval
                        </p>
                        <p className="font-heading text-3xl font-black text-amber-950 mt-1">
                          {countAppointments('pending')}
                        </p>
                      </div>
                      <span className="p-3 bg-amber-500/10 rounded-xl text-amber-600">
                        <Clock className="w-5 h-5" />
                      </span>
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800">
                          Confirmed Visits
                        </p>
                        <p className="font-heading text-3xl font-black text-emerald-950 mt-1">
                          {countAppointments('approved')}
                        </p>
                      </div>
                      <span className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
                        <CheckCircle className="w-5 h-5" />
                      </span>
                    </div>

                    <div className="bg-rose-500/5 border border-rose-500/10 p-5 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-rose-800">
                          Canceled / Ended
                        </p>
                        <p className="font-heading text-3xl font-black text-rose-950 mt-1">
                          {countAppointments('rejected')}
                        </p>
                      </div>
                      <span className="p-3 bg-rose-500/10 rounded-xl text-rose-600">
                        <AlertCircle className="w-5 h-5" />
                      </span>
                    </div>

                  </div>

                  {/* Two column layout: Left Profile Quick Card, Right Calendar Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Compact personal profile snapshot card */}
                    <div className="border border-light rounded-2xl p-6 bg-light/30 flex flex-col justify-between">
                      <div>
                        <h3 className="font-heading text-sm font-extrabold uppercase tracking-wide text-dark mb-4 flex items-center space-x-2">
                          <User className="w-4 h-4 text-primary" />
                          <span>Patient Information</span>
                        </h3>
                        
                        <div className="space-y-3 font-body text-xs text-paragraph">
                          <div className="flex border-b border-stone-100 pb-2">
                            <span className="w-24 font-bold text-stone-400">EMAIL</span>
                            <span className="font-medium text-dark select-all">{currentUser.email}</span>
                          </div>
                          
                          <div className="flex border-b border-stone-100 pb-2">
                            <span className="w-24 font-bold text-stone-400">PHONE</span>
                            <span className="font-medium text-dark">{profileData.phone || 'Not Specified'}</span>
                          </div>

                          <div className="flex border-b border-stone-100 pb-2">
                            <span className="w-24 font-bold text-stone-400">BLOOD GROUP</span>
                            <span className="font-semibold text-rose-600 flex items-center gap-1">
                              <Droplet className="w-3.5 h-3.5 inline text-rose-500" />
                              {profileData.bloodGroup || 'Not Specified'}
                            </span>
                          </div>

                          <div className="flex pb-1">
                            <span className="w-24 font-bold text-stone-400">GENDER</span>
                            <span className="font-medium text-dark">{profileData.gender || 'Not Specified'}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('profile')}
                        className="mt-6 text-xs font-extrabold text-primary hover:text-dark flex items-center space-x-1 uppercase tracking-wider focus:outline-none cursor-pointer"
                      >
                        <span>Update Personal Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Compact booking list snapshot */}
                    <div className="border border-light rounded-2xl p-6 bg-light/30 flex flex-col justify-between">
                      <div>
                        <h3 className="font-heading text-sm font-extrabold uppercase tracking-wide text-dark mb-4 flex items-center space-x-2">
                          <CalendarCheck className="w-4 h-4 text-primary" />
                          <span>Recent Appointments</span>
                        </h3>

                        {loadingAppts ? (
                          <div className="py-6 text-center text-stone-400 text-xs">Retrieving consultation logs...</div>
                        ) : appointments.length === 0 ? (
                          <div className="py-6 text-center text-stone-400 text-xs leading-relaxed">
                            No appointments currently booked.
                          </div>
                        ) : (
                          <div className="space-y-3 font-body text-xs">
                            {appointments.slice(0, 3).map((appt) => (
                              <div 
                                key={appt.id}
                                onClick={() => setSelectedAppt(appt)}
                                className="p-3 bg-white border border-light hover:border-stone-200 rounded-xl transition-colors duration-150 cursor-pointer flex items-center justify-between"
                              >
                                <div>
                                  <p className="font-bold text-dark">{appt.service}</p>
                                  <p className="text-[10px] text-stone-400 mt-0.5">{appt.preferred_date} • {appt.preferred_time}</p>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                  appt.status === 'approved'
                                    ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/5'
                                    : appt.status === 'rejected'
                                    ? 'bg-rose-500/10 text-rose-700 border border-rose-500/5'
                                    : 'bg-amber-500/10 text-amber-700 border border-amber-500/5'
                                }`}>
                                  {appt.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {appointments.length > 0 && (
                        <button
                          onClick={() => setActiveTab('appointments')}
                          className="mt-6 text-xs font-extrabold text-primary hover:text-dark flex items-center space-x-1 uppercase tracking-wider focus:outline-none cursor-pointer"
                        >
                          <span>View Full Log List</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              )}

              {/* Consultation appointments log tab */}
              {activeTab === 'appointments' && (
                <div className="space-y-6 animate-fade-in text-dark">
                  <div className="border-b border-light pb-4">
                    <h2 className="font-heading text-lg font-extrabold uppercase tracking-wide text-dark">
                      Consultation History & Bookings
                    </h2>
                    <p className="font-body text-xs text-paragraph mt-0.5">
                      Verify schedules, clinical feedback, and active booking statuses
                    </p>
                  </div>

                  {loadingAppts ? (
                    <div className="py-12 text-center text-primary font-body text-xs">Accessing clinical server...</div>
                  ) : appointments.length === 0 ? (
                    <div className="bg-light/30 border border-light p-10 rounded-2xl text-center font-body text-sm text-paragraph space-y-4">
                      <p>You have no current appointment entries logged under your profile.</p>
                      <button 
                        onClick={() => onNavigate('appointment')} 
                        className="bg-secondary text-white font-heading text-xs font-bold tracking-wider px-6 py-3 rounded-lg hover:bg-primary transition-all cursor-pointer inline-flex items-center space-x-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>BOOK YOUR FIRST SESSION</span>
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-light">
                      <table className="w-full font-body text-xs text-left">
                        <thead className="bg-light text-stone-500 uppercase h-[46px] text-[10px] font-bold border-b border-light tracking-wider">
                          <tr>
                            <th className="px-6 py-2">Service Registered</th>
                            <th className="px-6 py-2">Consultation Schedule</th>
                            <th className="px-6 py-2">Visit Status</th>
                            <th className="px-6 py-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-light text-dark font-medium">
                          {appointments.map((appt) => (
                            <tr key={appt.id} className="hover:bg-light/20 transition-colors">
                              <td className="px-6 py-4 font-bold text-sm text-dark">{appt.service}</td>
                              <td className="px-6 py-4">
                                <div className="text-xs">
                                  <p className="font-bold text-dark">{appt.preferred_date}</p>
                                  <p className="text-stone-400 mt-0.5">{appt.preferred_time}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md border ${
                                  appt.status === 'approved'
                                    ? 'bg-emerald-500/5 text-emerald-700 border-emerald-500/10'
                                    : appt.status === 'rejected'
                                    ? 'bg-rose-500/5 text-rose-700 border-rose-500/10'
                                    : 'bg-amber-500/5 text-amber-700 border-amber-500/10'
                                }`}>
                                  {appt.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => setSelectedAppt(appt)}
                                  className="text-[11px] font-bold text-primary hover:text-dark hover:underline cursor-pointer focus:outline-none"
                                >
                                  Details Dossier
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Patient information / Edit profile tab */}
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-fade-in text-dark select-text">
                  
                  {/* Left Column Form */}
                  <form onSubmit={handleSaveProfile} className="xl:col-span-8 space-y-6">
                    <div className="border-b border-light pb-4">
                      <h2 className="font-heading text-lg font-extrabold uppercase tracking-wide text-dark">
                        Personal Information & Demographics
                      </h2>
                      <p className="font-body text-xs text-paragraph mt-0.5">
                        Keep your medical folder accurate to let Dr. Ankit assess your profile safely
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-body text-xs text-dark">
                      <div>
                        <label className="block font-bold text-stone-500 uppercase tracking-wider mb-2" htmlFor="prof_name">Full Name *</label>
                        <input 
                          type="text" 
                          id="prof_name"
                          value={profileData.fullName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full border border-stone-200/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-sm transition-all"
                          placeholder="e.g. Tanmay Rajput"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block font-bold text-stone-500 uppercase tracking-wider mb-2">Registered Email (Static)</label>
                        <input 
                          type="email" 
                          value={currentUser.email}
                          className="w-full border border-stone-100 rounded-xl px-4 py-3 bg-stone-50 text-stone-400 font-medium text-sm cursor-not-allowed outline-none select-all"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-body text-xs text-dark">
                      <div>
                        <label className="block font-bold text-stone-500 uppercase tracking-wider mb-2" htmlFor="prof_phone">Contact Phone *</label>
                        <input 
                          type="tel" 
                          id="prof_phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full border border-stone-200/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-sm transition-all"
                          placeholder="+91-XXXXX-XXXXX"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block font-bold text-stone-500 uppercase tracking-wider mb-2" htmlFor="prof_dob">Date of Birth</label>
                        <input 
                          type="date" 
                          id="prof_dob"
                          value={profileData.birthDate}
                          onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
                          className="w-full border border-stone-200/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-sm text-stone-600 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-body text-xs text-dark">
                      <div>
                        <label className="block font-bold text-stone-500 uppercase tracking-wider mb-2" htmlFor="prof_gender">Gender Identity</label>
                        <select 
                          id="prof_gender"
                          value={profileData.gender}
                          onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value }))}
                          className="w-full border border-stone-200/80 bg-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-sm transition-all"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block font-bold text-stone-500 uppercase tracking-wider mb-2" htmlFor="prof_blood">Blood Group Type</label>
                        <select 
                          id="prof_blood"
                          value={profileData.bloodGroup}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                          className="w-full border border-stone-200/80 bg-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-sm transition-all"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                    </div>

                    <div className="font-body text-xs text-dark">
                      <label className="block font-bold text-stone-500 uppercase tracking-wider mb-2" htmlFor="prof_addr">Residential Address</label>
                      <textarea 
                        id="prof_addr"
                        rows={3}
                        value={profileData.address}
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full border border-stone-200/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-sm transition-all"
                        placeholder="e.g. Arera Colony, Bhopal"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="bg-secondary hover:bg-primary text-white font-heading text-xs font-extrabold tracking-wider px-8 py-4 rounded-xl transition-all shadow-md shadow-secondary/15 cursor-pointer text-center outline-none border border-transparent hover:border-primary uppercase"
                    >
                      {savingProfile ? 'Updating clinical records...' : 'Save Profile Changes'}
                    </button>
                  </form>

                  {/* Right Column Health ID Card Display */}
                  <div className="xl:col-span-4 space-y-6">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                      DIGITAL PATIENT ID CARD
                    </p>
                    
                    {/* Visual Health Card Layout */}
                    <div className="bg-gradient-to-br from-secondary to-dark text-white p-6 rounded-2xl shadow-xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                      
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>

                      <div className="flex justify-between items-start gap-2 relative">
                        <div>
                          <p className="font-heading font-black tracking-tight text-md">PRISHA CLINIC</p>
                          <p className="text-[8px] text-primary font-black tracking-widest uppercase mt-0.5">AESTHETIC & LASER</p>
                        </div>
                        <span className="p-1.5 bg-white/10 rounded-lg text-primary">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      </div>

                      <div className="my-6 relative">
                        <p className="text-[8px] text-white/40 tracking-widest font-bold uppercase">PATIENT HOLDER</p>
                        <p className="font-heading font-black text-lg tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                          {profileData.fullName || currentUser.full_name || 'REGISTERED PATIENT'}
                        </p>
                        <p className="text-[10px] text-stone-400 tracking-normal mt-0.5 select-all">{currentUser.email}</p>
                      </div>

                      <div className="flex justify-between items-end border-t border-white/10 pt-4 relative">
                        <div>
                          <p className="text-[7px] text-white/30 tracking-widest font-bold uppercase">BLOOD TYPE</p>
                          <p className="text-xs font-bold text-rose-400 flex items-center gap-0.5">
                            <Droplet className="w-3 h-3 text-rose-500 flex-shrink-0" />
                            <span>{profileData.bloodGroup}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-[7px] text-white/30 tracking-widest font-bold uppercase">MOBILE</p>
                          <p className="text-[10px] font-mono font-medium text-stone-300">{profileData.phone || '(No Phone)'}</p>
                        </div>
                      </div>

                    </div>

                    <div className="bg-light/40 border border-light p-4 rounded-xl text-xs text-paragraph leading-relaxed flex items-start space-x-2.5">
                      <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-dark">Data Security Ensured</p>
                        <p className="text-stone-500 mt-0.5">
                          Your profile resides securely in our private healthcare index. HIPAA compliancy models restrict unauthorized sharing.
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Booking Details Viewer Dialog */}
      {selectedAppt && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-light shadow-2xl relative animate-fade-in font-body text-dark select-text">
            
            <button
              onClick={() => setSelectedAppt(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-dark hover:bg-light rounded-full cursor-pointer transition-colors focus:outline-none"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-light pb-4 mb-6">
              <span className="text-[9px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block tracking-widest">
                APPOINTMENT SUMMARY
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-black text-dark tracking-tight mt-2 flex items-center space-x-2">
                <span>{selectedAppt.service}</span>
              </h3>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-stone-100">
                <div>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest">Patient Name</p>
                  <p className="text-dark font-bold text-sm mt-0.5">{selectedAppt.patient_name}</p>
                </div>
                <div>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest">Selected Treatment</p>
                  <p className="text-dark font-bold text-sm mt-0.5">{selectedAppt.service}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-stone-100">
                <div>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest">Appointment Date</p>
                  <p className="text-dark font-bold text-sm mt-0.5">{selectedAppt.preferred_date}</p>
                </div>
                <div>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest">Preferred Time Slot</p>
                  <p className="text-dark font-bold text-sm mt-0.5">{selectedAppt.preferred_time}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-stone-100">
                <div>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest">Contact Phone</p>
                  <p className="text-dark font-medium text-xs mt-0.5">{selectedAppt.phone}</p>
                </div>
                <div>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest">Appointment Status</p>
                  <div className="mt-1">
                    <span className={`text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md border ${
                      selectedAppt.status === 'approved'
                        ? 'bg-emerald-500/5 text-emerald-700 border-emerald-500/10'
                        : selectedAppt.status === 'rejected'
                        ? 'bg-rose-500/5 text-rose-700 border-rose-500/10'
                        : 'bg-amber-500/5 text-amber-700 border-amber-500/10'
                    }`}>
                      {selectedAppt.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedAppt.message && (
                <div className="bg-light/40 border border-light p-3.5 rounded-xl text-dark">
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold">Your Requested Note</p>
                  <p className="font-medium text-xs text-paragraph mt-1 leading-relaxed">
                    "{selectedAppt.message}"
                  </p>
                </div>
              )}

              {selectedAppt.doctor_note && (
                <div className="bg-primary/5 border border-primary/10 p-3.5 rounded-xl text-dark">
                  <p className="text-[9px] text-primary uppercase tracking-widest font-bold">Note from Dr. Ankit Kumar Jain</p>
                  <p className="italic text-xs text-paragraph mt-1 leading-relaxed">
                    "{selectedAppt.doctor_note}"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-light flex justify-end">
              <button
                onClick={() => setSelectedAppt(null)}
                className="bg-secondary hover:bg-primary text-white font-heading text-xs font-bold tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer uppercase"
                type="button"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
