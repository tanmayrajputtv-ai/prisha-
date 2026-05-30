import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, Users, Image as ImageIcon, Check, X, FileText, Plus, Edit, Trash2, LogOut, CheckCircle, Eye, RefreshCw, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserProfile, Appointment, SurgeryResult } from '../types';

interface AdminProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onSuccessMessage: (message: string) => void;
  onErrorMessage: (message: string) => void;
}

export default function Admin({ onLogout, onNavigate, onSuccessMessage, onErrorMessage }: AdminProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'all_appointments' | 'pending' | 'approved' | 'rejected' | 'patients' | 'results'>('overview');
  
  // Data State Catalogues
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [surgeryResults, setSurgeryResults] = useState<SurgeryResult[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isErrorMode, setIsErrorMode] = useState(false);

  // Modal actions indicators
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [doctorNoteInput, setDoctorNoteInput] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  // Surgery result form state
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SurgeryResult | null>(null);
  const [resultFormData, setResultFormData] = useState({
    title: '',
    treatment_type: '',
    description: '',
    before_image_url: '',
    after_image_url: ''
  });
  const [savingResult, setSavingResult] = useState(false);

  // Simultaneous retrieval of all databases on load as requested
  const loadDatabaseState = async () => {
    setLoading(true);
    setIsErrorMode(false);
    try {
      const [apptRes, usersRes, resultsRes] = await Promise.all([
        supabase.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('*').order('created_at', { ascending: false }),
        supabase.from('surgery_results').select('*').order('created_at', { ascending: false })
      ]);

      let backendAppts = apptRes.data || [];
      let backendUsers = usersRes.data || [];
      let backendResults = resultsRes.data || [];

      // Merge mock objects stored locally to guarantee seamless client reviews
      const storedMockAppts = JSON.parse(localStorage.getItem('prisha_mock_bookings') || '[]');
      const storedMockUsers = JSON.parse(localStorage.getItem('prisha_mock_users') || '[]');
      const storedMockResults = JSON.parse(localStorage.getItem('prisha_mock_results') || '[]');

      // Format mock users to fit UserProfile structure
      const formattedMockUsers: UserProfile[] = storedMockUsers.map((u: any) => ({
        id: u.id,
        email: u.email,
        full_name: u.fullName,
        phone: u.phone,
        birth_date: u.birthDate,
        gender: u.gender,
        blood_group: u.bloodGroup,
        address: u.address,
        created_at: u.created_at
      }));

      // Combine arrays, removing any duplicate ids
      const finalAppointments = [...backendAppts, ...storedMockAppts].filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );

      const finalUsers = [...backendUsers, ...formattedMockUsers].filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );

      const finalResults = [...backendResults, ...storedMockResults].filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );

      setAppointments(finalAppointments);
      setUsers(finalUsers);
      setSurgeryResults(finalResults);

      if (apptRes.error || usersRes.error) {
        throw new Error("Supabase is unconfigured or tables don't exist yet.");
      }
    } catch (e: any) {
      console.warn("Supabase tables are missing. Operating in resilient sandbox fallback mode.", e);
      setIsErrorMode(true);
      
      // Load everything dynamically from browser memories
      const storedMockAppts = JSON.parse(localStorage.getItem('prisha_mock_bookings') || '[]');
      const storedMockUsers = JSON.parse(localStorage.getItem('prisha_mock_users') || '[]');
      const storedMockResults = JSON.parse(localStorage.getItem('prisha_mock_results') || '[]');

      // Default patients placeholders
      const defaultUsers: UserProfile[] = [
        { id: 'usr-1', email: 'pooja@example.com', full_name: 'Pooja Meena', phone: '+91 9845012345', gender: 'Female', blood_group: 'B+', created_at: '2026-05-10' },
        { id: 'usr-2', email: 'neeraj@example.com', full_name: 'Neeraj Sahu', phone: '+91 8889412341', gender: 'Male', blood_group: 'O+', created_at: '2026-05-12' },
        { id: 'usr-3', email: 'vipin@example.com', full_name: 'Vipin Chouhan', phone: '+91 7566112342', gender: 'Male', blood_group: 'A+', created_at: '2026-05-15' }
      ];

      // Default bookings placeholders
      const defaultAppts: Appointment[] = [
        { id: 'app-1', patient_name: 'Pooja Meena', phone: '+91 9845012345', email: 'pooja@example.com', service: 'CO2 Laser Treatment', preferred_date: '2026-06-05', preferred_time: '12:00 PM', status: 'approved', doctor_note: 'Avoid sun exposure for 48 hours post procedure.', created_at: '2026-05-25' },
        { id: 'app-2', patient_name: 'Neeraj Sahu', phone: '+91 8889412341', email: 'neeraj@example.com', service: 'Hair Transplant (FUE)', preferred_date: '2026-06-10', preferred_time: '11:00 AM', status: 'pending', created_at: '2026-05-28' },
        { id: 'app-3', patient_name: 'Vipin Chouhan', phone: '+91 7566112342', email: 'vipin@example.com', service: 'PRP Therapy', preferred_date: '2026-06-01', preferred_time: '03:00 PM', status: 'pending', created_at: '2026-05-29' }
      ];

      // Default surgeries placeholders
      const defaultResults: SurgeryResult[] = [
        {
          id: "demo-r1",
          title: "Advanced Hair Transplant (FUE)",
          description: "6 months post FUE hair follicle surgery showcasing immense density revival and completely natural-looking donor hair recovery.",
          before_image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600",
          after_image_url: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600",
          treatment_type: "Hair Transplant"
        },
        {
          id: "demo-r2",
          title: "Fractional CO2 Acne Laser Resurfacing",
          description: "Clinical elimination of severe facial scarring and acne hyperpigmentation spots after a sequence of three procedural sessions.",
          before_image_url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600",
          after_image_url: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600",
          treatment_type: "Laser Treatment"
        }
      ];

      // Merge
      const finalMockAppts = storedMockAppts.length ? [...storedMockAppts, ...defaultAppts] : defaultAppts;
      const finalMockUsers = storedMockUsers.length ? [...storedMockUsers.map((u: any) => ({
        id: u.id, email: u.email, full_name: u.fullName, phone: u.phone, gender: u.gender, blood_group: u.bloodGroup, created_at: u.created_at
      })), ...defaultUsers] : defaultUsers;
      const finalMockResults = storedMockResults.length ? [...storedMockResults, ...defaultResults] : defaultResults;

      // Unique ID filter
      setAppointments(finalMockAppts.filter((item: any, i: number, ar: any) => ar.findIndex((t: any) => t.id === item.id) === i));
      setUsers(finalMockUsers.filter((item: any, i: number, ar: any) => ar.findIndex((t: any) => t.id === item.id) === i));
      setSurgeryResults(finalMockResults.filter((item: any, i: number, ar: any) => ar.findIndex((t: any) => t.id === item.id) === i));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseState();
  }, []);

  // Action: Approve Appointment with Doctor Note
  const handleApprove = async () => {
    if (!selectedAppt) return;
    setIsApproving(true);
    try {
      // 1. Live Supabase database Update
      const { error } = await supabase
        .from('appointments')
        .update({
          status: 'approved',
          doctor_note: doctorNoteInput || null
        })
        .eq('id', selectedAppt.id);

      if (error) throw error;
      
      onSuccessMessage(`✅ Appointment for ${selectedAppt.patient_name} approved successfully!`);
    } catch (e) {
      console.log("Saving appointment approval locally in localStorage.");
      
      // Save updated appointment locally
      const storedAppts = JSON.parse(localStorage.getItem('prisha_mock_bookings') || '[]');
      const updatedIdx = storedAppts.findIndex((a: any) => a.id === selectedAppt.id);
      
      const updatedApptObj = {
        ...selectedAppt,
        status: 'approved',
        doctor_note: doctorNoteInput || 'Approved by Dr. Ankit.'
      };

      if (updatedIdx !== -1) {
        storedAppts[updatedIdx] = updatedApptObj;
      } else {
        storedAppts.push(updatedApptObj);
      }
      localStorage.setItem('prisha_mock_bookings', JSON.stringify(storedAppts));
      onSuccessMessage(`✅ Appointment approved in local sandbox!`);
    } finally {
      setIsApproving(false);
      setIsActionModalOpen(false);
      loadDatabaseState();
    }
  };

  // Action: Reject Appointment
  const handleReject = async (appt: Appointment) => {
    if (!confirm(`Are you sure you want to cancel the appointment for ${appt.patient_name}?`)) return;
    try {
      // 1. Live Supabase database Update
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'rejected' })
        .eq('id', appt.id);

      if (error) throw error;

      onSuccessMessage(`❌ Appointment cancelled successfully.`);
    } catch (e) {
      console.log("Saving appointment rejection locally.");
      const storedAppts = JSON.parse(localStorage.getItem('prisha_mock_bookings') || '[]');
      const updatedIdx = storedAppts.findIndex((a: any) => a.id === appt.id);
      
      const updatedApptObj = {
        ...appt,
        status: 'rejected'
      };

      if (updatedIdx !== -1) {
        storedAppts[updatedIdx] = updatedApptObj;
      } else {
        storedAppts.push(updatedApptObj);
      }
      localStorage.setItem('prisha_mock_bookings', JSON.stringify(storedAppts));
      onSuccessMessage(`❌ Appointment rejected in local sandbox.`);
    } finally {
      loadDatabaseState();
    }
  };

  // Action: Add / Update Transformed Image result card
  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultFormData.title || !resultFormData.treatment_type || !resultFormData.before_image_url || !resultFormData.after_image_url) {
      onErrorMessage('Please provide all values marked with an asterisk (*).');
      return;
    }

    setSavingResult(true);
    try {
      if (selectedResult) {
        // Edit Mode - Update in Supabase
        const { error } = await supabase
          .from('surgery_results')
          .update({
            title: resultFormData.title,
            treatment_type: resultFormData.treatment_type,
            description: resultFormData.description,
            before_image_url: resultFormData.before_image_url,
            after_image_url: resultFormData.after_image_url
          })
          .eq('id', selectedResult.id);

        if (error) throw error;
        onSuccessMessage('✅ Case surgery result updated successfully!');
      } else {
        // Create Mode - Insert in Supabase
        const { error } = await supabase
          .from('surgery_results')
          .insert({
            title: resultFormData.title,
            treatment_type: resultFormData.treatment_type,
            description: resultFormData.description,
            before_image_url: resultFormData.before_image_url,
            after_image_url: resultFormData.after_image_url
          });

        if (error) throw error;
        onSuccessMessage('✅ Case surgery result published successfully!');
      }
    } catch (e) {
      console.log("Emulating surgery results edits in local storage.");
      const storedResults = JSON.parse(localStorage.getItem('prisha_mock_results') || '[]');
      
      if (selectedResult) {
        // Edit local index
        const idx = storedResults.findIndex((r: any) => r.id === selectedResult.id);
        const updatedObj = {
          ...selectedResult,
          title: resultFormData.title,
          treatment_type: resultFormData.treatment_type,
          description: resultFormData.description,
          before_image_url: resultFormData.before_image_url,
          after_image_url: resultFormData.after_image_url
        };
        if (idx !== -1) {
          storedResults[idx] = updatedObj;
        }
      } else {
        // Insert new object
        const newObj = {
          id: "mock-res-" + Math.random().toString(36).substr(2, 9),
          title: resultFormData.title,
          treatment_type: resultFormData.treatment_type,
          description: resultFormData.description,
          before_image_url: resultFormData.before_image_url,
          after_image_url: resultFormData.after_image_url,
          created_at: new Date().toISOString()
        };
        storedResults.push(newObj);
      }
      localStorage.setItem('prisha_mock_results', JSON.stringify(storedResults));
      onSuccessMessage('✅ Result saved in sandbox cache!');
    } finally {
      setSavingResult(false);
      setIsResultModalOpen(false);
      setSelectedResult(null);
      setResultFormData({ title: '', treatment_type: '', description: '', before_image_url: '', after_image_url: '' });
      loadDatabaseState();
    }
  };

  // Action: Delete Transform outcome
  const handleDeleteResult = async (item: SurgeryResult) => {
    if (!confirm(`Are you certain you wish to delete the case outcome "${item.title}"?`)) return;
    try {
      const { error } = await supabase
        .from('surgery_results')
        .delete()
        .eq('id', item.id);

      if (error) throw error;
      onSuccessMessage('🗑️ Result record deleted.');
    } catch (e) {
      const storedResults = JSON.parse(localStorage.getItem('prisha_mock_results') || '[]');
      const filtered = storedResults.filter((r: any) => r.id !== item.id);
      localStorage.setItem('prisha_mock_results', JSON.stringify(filtered));
      onSuccessMessage('🗑️ Local sandbox result deleted.');
    } finally {
      loadDatabaseState();
    }
  };

  const getFilteredAppointments = () => {
    if (activeTab === 'all_appointments' || activeTab === 'overview') return appointments;
    if (activeTab === 'pending') return appointments.filter(a => a.status === 'pending');
    if (activeTab === 'approved') return appointments.filter(a => a.status === 'approved');
    if (activeTab === 'rejected') return appointments.filter(a => a.status === 'rejected');
    return appointments;
  };

  const openApproveModal = (appt: Appointment) => {
    setSelectedAppt(appt);
    setDoctorNoteInput(appt.doctor_note || '');
    setIsActionModalOpen(true);
  };

  const openEditResultModal = (item: SurgeryResult) => {
    setSelectedResult(item);
    setResultFormData({
      title: item.title,
      treatment_type: item.treatment_type,
      description: item.description,
      before_image_url: item.before_image_url,
      after_image_url: item.after_image_url
    });
    setIsResultModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-light">
      {/* Header Banner */}
      <section className="bg-cream pt-28 pb-10 border-b border-secondary/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <span className="p-3 bg-primary text-white rounded-2xl">
                <LayoutDashboard className="w-6 h-6" />
              </span>
              <div>
                <h1 className="font-heading text-2xl font-bold text-dark uppercase tracking-tight">Clinic Control Panel</h1>
                <div className="flex flex-wrap items-center mt-0.5 gap-2 select-none">
                  <p className="font-body text-xs text-secondary uppercase tracking-widest font-extrabold text-paragraph/70">
                    Dr. Ankit Kumar Jain / Tanmay Rajput
                  </p>
                  <span className="text-xs text-gray-400 hidden sm:inline">•</span>
                  {isErrorMode ? (
                    <span className="inline-flex items-center space-x-1 bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase" title="Empty database tables. Working on mock session fallback.">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      <span>SANDBOX FALLBACK</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 bg-green-500/10 text-green-700 border border-green-500/20 px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase" title="Supabase tables are synchronised successfully.">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span>SUPABASE CONNECTED</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={loadDatabaseState}
                className="p-2.5 bg-white border border-secondary/20 rounded-xl hover:bg-light text-primary cursor-pointer transition-colors"
                title="Synchronize indices"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={onLogout}
                className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white px-5 py-2.5 rounded-xl font-body text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Console Out</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Panel layout */}
      <section className="py-12 flex-grow select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {isErrorMode && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="font-body text-xs text-amber-800 leading-relaxed">
                <p className="font-bold">Sandbox Emulation Engaged</p>
                <p className="mt-0.5">The database tables are not standard-provisioned in Supabase. We are executing clinical indices directly inside browser local sessions to grant you perfect review capabilities.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Admin Navigation list */}
            <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-secondary/10 shadow-sm space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left font-body text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center space-x-2 border-box ${
                  activeTab === 'overview' ? 'bg-primary text-white' : 'text-dark hover:bg-light'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>OVERVIEW SUMMARY</span>
              </button>

              <button
                onClick={() => setActiveTab('all_appointments')}
                className={`w-full text-left font-body text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center space-x-2 border-box ${
                  activeTab === 'all_appointments' ? 'bg-primary text-white' : 'text-dark hover:bg-light'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>ALL APPOINTMENTS ({appointments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('pending')}
                className={`w-full text-left font-body text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center space-x-2 border-box ${
                  activeTab === 'pending' ? 'bg-primary text-white' : 'text-dark hover:bg-light'
                }`}
              >
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>PENDING QUEUE ({appointments.filter(a => a.status === 'pending').length})</span>
              </button>

              <button
                onClick={() => setActiveTab('approved')}
                className={`w-full text-left font-body text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center space-x-2 border-box ${
                  activeTab === 'approved' ? 'bg-primary text-white' : 'text-dark hover:bg-light'
                }`}
              >
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>APPROVED ARCHIVES ({appointments.filter(a => a.status === 'approved').length})</span>
              </button>

              <button
                onClick={() => setActiveTab('rejected')}
                className={`w-full text-left font-body text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center space-x-2 border-box ${
                  activeTab === 'rejected' ? 'bg-primary text-white' : 'text-dark hover:bg-light'
                }`}
              >
                <Calendar className="w-4 h-4 text-rose-500" />
                <span>REJECTED ARCHIVES ({appointments.filter(a => a.status === 'rejected').length})</span>
              </button>

              <button
                onClick={() => setActiveTab('patients')}
                className={`w-full text-left font-body text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center space-x-2 border-box ${
                  activeTab === 'patients' ? 'bg-primary text-white' : 'text-dark hover:bg-light'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>ALL PATIENTS ({users.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('results')}
                className={`w-full text-left font-body text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center space-x-2 border-box ${
                  activeTab === 'results' ? 'bg-primary text-white' : 'text-dark hover:bg-light'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>BEFORE / AFTER GALLERY ({surgeryResults.length})</span>
              </button>
            </div>

            {/* Main Content Pane */}
            <div className="lg:col-span-9 bg-white p-8 rounded-3xl border border-secondary/15 shadow-sm min-h-[500px]">
              
              {/* Overview Tab Dashboard Summary */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="border-b border-light pb-4">
                    <h2 className="font-heading text-xl font-bold text-dark">Clinical Logistics Logs</h2>
                    <p className="font-body text-xs text-paragraph">Bhopal operations analytics and ledger</p>
                  </div>

                  {/* Operational stat boards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                    <div className="bg-light p-4 rounded-2xl border border-secondary/10">
                      <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Booked</p>
                      <p className="font-heading text-3xl font-bold text-primary mt-1">{appointments.length}</p>
                    </div>
                    <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                      <p className="font-body text-[10px] font-bold text-amber-700 uppercase tracking-widest">Waiting List</p>
                      <p className="font-heading text-3xl font-bold text-amber-900 mt-1">{appointments.filter(a => a.status === 'pending').length}</p>
                    </div>
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                      <p className="font-body text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Approved</p>
                      <p className="font-heading text-3xl font-bold text-emerald-900 mt-1">{appointments.filter(a => a.status === 'approved').length}</p>
                    </div>
                    <div className="bg-light p-4 rounded-2xl border border-secondary/10">
                      <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Patients</p>
                      <p className="font-heading text-3xl font-bold text-primary mt-1">{users.length}</p>
                    </div>
                  </div>

                  {/* Recent bookings highlights queue */}
                  <div className="space-y-4">
                    <h3 className="font-heading text-lg font-semibold text-dark">Urgent Pending Triage</h3>
                    {loading ? (
                      <div className="py-6 text-center text-primary font-body text-xs">Accessing queue...</div>
                    ) : appointments.filter(a => a.status === 'pending').length === 0 ? (
                      <div className="bg-light p-6 rounded-2xl text-center font-body text-xs text-dark/60 select-none">
                        No pending appointments require evaluation.
                      </div>
                    ) : (
                      <div className="space-y-3 font-body text-sm text-dark">
                        {appointments.filter(a => a.status === 'pending').slice(0, 3).map((appt) => (
                          <div key={appt.id} className="bg-light p-4 rounded-xl border border-secondary/10 flex items-center justify-between">
                            <div>
                              <h4 className="font-bold">{appt.patient_name}</h4>
                              <p className="text-xs text-gray-400 mt-0.5">{appt.service} — {appt.preferred_date} at {appt.preferred_time}</p>
                            </div>
                            <button
                              onClick={() => openApproveModal(appt)}
                              className="bg-primary hover:bg-dark text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                            >
                              Action Triage
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Triage / Management List view */}
              {(activeTab === 'all_appointments' || activeTab === 'pending' || activeTab === 'approved' || activeTab === 'rejected') && (
                <div className="space-y-6 animate-fade-in font-body text-sm">
                  <div className="border-b border-light pb-4 flex justify-between items-center">
                    <div>
                      <h2 className="font-heading text-xl font-bold text-dark">
                        {activeTab.replace('_', ' ').toUpperCase()} RECORDS
                      </h2>
                      <p className="text-xs text-paragraph">Coordinate patients timelines and clinical notes</p>
                    </div>
                  </div>

                  {loading ? (
                    <div className="py-12 text-center text-primary text-xs">Querying timeline folders...</div>
                  ) : getFilteredAppointments().length === 0 ? (
                    <div className="bg-light p-10 rounded-2xl text-center text-gray-400 font-medium">No results recorded under this tier.</div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-light select-text">
                      <table className="w-full text-left">
                        <thead className="bg-cream/40 text-xs font-bold uppercase text-dark border-b border-light h-[45px]">
                          <tr>
                            <th className="px-6 py-2">Patient</th>
                            <th className="px-6 py-2">Requested Service</th>
                            <th className="px-6 py-2">Schedule Date</th>
                            <th className="px-6 py-2">Status</th>
                            <th className="px-6 py-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-light text-dark/85">
                          {getFilteredAppointments().map((appt) => (
                            <tr key={appt.id} className="hover:bg-cream/10 transition-colors">
                              <td className="px-6 py-4">
                                <div className="font-bold">{appt.patient_name}</div>
                                <div className="text-xs text-gray-400 mt-0.5 select-all">{appt.phone}</div>
                              </td>
                              <td className="px-6 py-4 font-semibold text-xs text-secondary">{appt.service}</td>
                              <td className="px-6 py-4 text-xs font-medium">{appt.preferred_date} <br/><span className="text-gray-400">{appt.preferred_time}</span></td>
                              <td className="px-6 py-4">
                                <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
                                  appt.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                  appt.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {appt.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  {appt.status === 'pending' && (
                                    <>
                                      <button 
                                        onClick={() => openApproveModal(appt)}
                                        className="p-1.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors cursor-pointer"
                                        title="Approve / Add notes"
                                      >
                                        <Check className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleReject(appt)}
                                        className="p-1.5 bg-rose-50 text-rose-600 rounded hover:bg-rose-100 transition-colors cursor-pointer"
                                        title="Reject"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => { setSelectedAppt(appt); setIsActionModalOpen(true); }}
                                    className="p-1.5 bg-light text-primary rounded hover:bg-cream cursor-pointer"
                                    title="View Folder details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Patient Browser directory Tab */}
              {activeTab === 'patients' && (
                <div className="space-y-6 animate-fade-in font-body text-sm select-text">
                  <div className="border-b border-light pb-4">
                    <h2 className="font-heading text-xl font-bold text-dark">Active Patient Directory</h2>
                    <p className="text-xs text-paragraph">Indexed biological records ledger</p>
                  </div>

                  {loading ? (
                    <div className="py-12 text-center text-primary text-xs">Querying clinic archives...</div>
                  ) : users.length === 0 ? (
                    <div className="bg-light p-10 rounded-2xl text-center text-gray-400">No patient files exist.</div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-light">
                      <table className="w-full text-left">
                        <thead className="bg-cream/40 text-xs font-bold uppercase text-dark border-b border-light h-[45px]">
                          <tr>
                            <th className="px-6 py-2">Patient Profile</th>
                            <th className="px-6 py-2">Contact Info</th>
                            <th className="px-6 py-2">Gender</th>
                            <th className="px-6 py-2">Blood Group</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-light text-dark/85">
                          {users.map((u) => (
                            <tr key={u.id} className="hover:bg-cream/10 transition-colors">
                              <td className="px-6 py-4 font-bold">{u.full_name}</td>
                              <td className="px-6 py-4 text-xs font-semibold select-all">
                                <div>Email: {u.email}</div>
                                <div className="text-gray-400 mt-0.5">Phone: {u.phone}</div>
                              </td>
                              <td className="px-6 py-4 text-xs font-medium">{u.gender || 'Unknown'}</td>
                              <td className="px-6 py-4">
                                <span className="bg-primary/10 text-primary py-0.5 px-2 rounded-full font-bold text-xs">
                                  {u.blood_group || 'O+'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Before & After Cases publisher tab */}
              {activeTab === 'results' && (
                <div className="space-y-6 animate-fade-in font-body text-sm">
                  <div className="border-b border-light pb-4 flex justify-between items-center flex-wrap gap-4 sm:gap-0">
                    <div>
                      <h2 className="font-heading text-xl font-bold text-dark font-sans">TRANSFORM CLINIC GALLERY MANAGER</h2>
                      <p className="text-xs text-paragraph">Author cases records directly on the dynamic Results catalog</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedResult(null);
                        setResultFormData({ title: '', treatment_type: 'Hair Transplant', description: '', before_image_url: '', after_image_url: '' });
                        setIsResultModalOpen(true);
                      }}
                      className="bg-primary hover:bg-dark text-white font-bold py-2.5 px-5 rounded-xl cursor-pointer flex items-center space-x-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publish New Case</span>
                    </button>
                  </div>

                  {loading ? (
                    <div className="py-12 text-center text-primary text-xs">Sorting photo archives...</div>
                  ) : surgeryResults.length === 0 ? (
                    <div className="bg-light p-10 rounded-2xl text-center text-gray-400 font-medium">No results published yet. Publish case outputs.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 select-text">
                      {surgeryResults.map((item) => (
                        <div key={item.id} className="border border-secondary/15 rounded-2xl p-5 bg-light flex flex-col justify-between">
                          <div>
                            <div className="grid grid-cols-2 gap-2 h-36 bg-gray-100 rounded-xl overflow-hidden relative border border-secondary/10 mb-4 select-none">
                              <img src={item.before_image_url} alt="Before" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                              <img src={item.after_image_url} alt="After" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            </div>
                            <span className="bg-secondary/20 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full select-none">
                              {item.treatment_type}
                            </span>
                            <h4 className="font-bold text-base text-dark mt-2">{item.title}</h4>
                            <p className="text-xs text-dark/70 leading-relaxed mt-1">{item.description}</p>
                          </div>

                          <div className="flex justify-end items-center space-x-2 pt-4 border-t border-secondary/10 mt-4 select-none">
                            <button
                              onClick={() => openEditResultModal(item)}
                              className="p-2 bg-white text-secondary hover:bg-secondary hover:text-white rounded-lg border border-secondary/20 cursor-pointer transition-colors"
                              title="Edit case"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteResult(item)}
                              className="p-2 bg-white text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg border border-rose-200 cursor-pointer transition-colors"
                              title="Delete case outcome"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Approve Appointment / Details Actions Triage Modal Dialog */}
      {isActionModalOpen && selectedAppt && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 border border-secondary/15 shadow-2xl relative animate-fade-in font-body text-sm text-dark">
            <button
              onClick={() => setIsActionModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-dark rounded-full cursor-pointer hover:bg-light"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading text-2xl font-bold text-dark border-b border-light pb-3 mb-6">
              Clinical Session Details
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Patient Name</p>
                  <p className="font-semibold text-sm mt-0.5">{selectedAppt.patient_name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Session Request</p>
                  <p className="font-semibold text-sm mt-0.5">{selectedAppt.service}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-light/50 pt-3">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Requested Date</p>
                  <p className="font-semibold text-sm mt-0.5">{selectedAppt.preferred_date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time Slot</p>
                  <p className="font-semibold text-sm mt-0.5">{selectedAppt.preferred_time}</p>
                </div>
              </div>

              {selectedAppt.message && (
                <div className="border-t border-light/50 pt-3">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Symptom notes or query</p>
                  <p className="mt-1 italic leading-relaxed text-xs">"{selectedAppt.message}"</p>
                </div>
              )}

              {selectedAppt.status === 'pending' ? (
                <div className="border-t border-light/50 pt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2" htmlFor="doc_notes">Add Dr. Ankit notes / Treatment schedule *</label>
                    <textarea
                      id="doc_notes"
                      rows={3}
                      value={doctorNoteInput}
                      onChange={(e) => setDoctorNoteInput(e.target.value)}
                      placeholder="e.g. Schedule FUE hair harvest post blood report validations."
                      className="w-full border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none text-xs focus:ring-1 focus:ring-primary"
                    ></textarea>
                  </div>

                  <div className="flex space-x-3 select-none">
                    <button
                      onClick={handleApprove}
                      disabled={isApproving}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl cursor-pointer text-center"
                    >
                      {isApproving ? 'Approving Booking...' : 'Approve Appointment'}
                    </button>
                    <button
                      onClick={() => handleReject(selectedAppt)}
                      className="w-1/2 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 font-semibold py-3 px-4 rounded-xl cursor-pointer text-center"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-light/50 pt-3">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status Record</p>
                  <p className={`font-bold mt-1 text-xs uppercase ${selectedAppt.status === 'approved' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {selectedAppt.status}
                  </p>
                  {selectedAppt.doctor_note && (
                    <div className="mt-3 bg-cream/40 p-4 rounded-xl border border-secondary/10">
                      <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Dermatologist Note</p>
                      <p className="text-xs italic text-dark mt-1">"{selectedAppt.doctor_note}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Surgery Transform Case publisher form Modal */}
      {isResultModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveResult}
            className="bg-white rounded-3xl max-w-lg w-full p-8 border border-secondary/15 shadow-2xl relative animate-fade-in font-body text-sm text-dark space-y-5"
          >
            <button
              type="button"
              onClick={() => setIsResultModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-dark rounded-full cursor-pointer hover:bg-light"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading text-2xl font-bold text-dark border-b border-light pb-2">
              {selectedResult ? 'Edit Surgery Case' : 'Publish Surgery Case'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1" htmlFor="res_title">Case Title *</label>
                <input 
                  type="text" 
                  id="res_title"
                  value={resultFormData.title}
                  onChange={(e) => setResultFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Laser Hair Restoration or CO2 Scar Repair"
                  className="w-full border border-secondary/20 rounded-xl px-4 py-2.5 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1" htmlFor="res_type">Treatment Type Badge *</label>
                  <select 
                    id="res_type"
                    value={resultFormData.treatment_type}
                    onChange={(e) => setResultFormData(prev => ({ ...prev, treatment_type: e.target.value }))}
                    className="w-full border border-secondary/20 bg-white rounded-xl px-4 py-2.5 focus:outline-none"
                    required
                  >
                    <option value="Hair Transplant">Hair Transplant</option>
                    <option value="Laser Treatment">Laser Treatment</option>
                    <option value="PRP & Aesthetics">PRP & Aesthetics</option>
                    <option value="Acne Management">Acne Management</option>
                    <option value="Anti-Aging Clinic">Anti-Aging Clinic</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1" htmlFor="res_before">Before Image URL *</label>
                  <input 
                    type="url" 
                    id="res_before"
                    value={resultFormData.before_image_url}
                    onChange={(e) => setResultFormData(prev => ({ ...prev, before_image_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full border border-secondary/20 rounded-xl px-4 py-2.5 focus:outline-none text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1" htmlFor="res_after">After Image URL *</label>
                <input 
                  type="url" 
                  id="res_after"
                  value={resultFormData.after_image_url}
                  onChange={(e) => setResultFormData(prev => ({ ...prev, after_image_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-secondary/20 rounded-xl px-4 py-2.5 focus:outline-none text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" htmlFor="res_desc">Surgical / Treatment Case Description</label>
                <textarea 
                  id="res_desc"
                  rows={3}
                  value={resultFormData.description}
                  onChange={(e) => setResultFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Elaborate procedural success facts, session count, clinical timeline..."
                  className="w-full border border-secondary/20 rounded-xl px-4 py-2.5 focus:outline-none text-xs"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingResult}
              className="w-full bg-primary hover:bg-dark text-white font-bold py-3 rounded-xl tracking-wider cursor-pointer text-center"
            >
              {savingResult ? 'Publishing outcome...' : 'Publish Outcomes to Results Page'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
