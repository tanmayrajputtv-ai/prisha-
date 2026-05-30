import React, { useState } from 'react';
import { UserPlus, LogIn, Mail, Lock, ShieldAlert, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface LoginProps {
  onLoginSuccess: (user: UserProfile, isAdmin: boolean) => void;
  onSuccessMessage: (message: string) => void;
  onErrorMessage: (message: string) => void;
}

export default function Login({ onLoginSuccess, onSuccessMessage, onErrorMessage }: LoginProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [authNotice, setAuthNotice] = useState<{ message: string; type: 'warning' | 'info' | 'error' } | null>(null);

  // Login variables
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register variables
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    gender: 'Male',
    bloodGroup: 'B+',
    address: ''
  });

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSignUpData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      onErrorMessage('Please specify email and password values.');
      return;
    }

    setLoading(true);

    try {
      // 1. Check for SPECIAL DEMO ADMIN credentials
      if (loginEmail.trim().toLowerCase() === 'tanmayrajputtv@gmail.com' && loginPassword === 'tanmay@11') {
        const adminProfile: UserProfile = {
          id: 'admin-id-principal',
          email: 'tanmayrajputtv@gmail.com',
          full_name: 'Dr. Ankit Kumar Jain (Admin)',
          phone: '+91 7875379557',
          birth_date: '1988-10-04',
          gender: 'Male',
          address: 'B-106 Narmadapuram Rd, Bhopal',
          blood_group: 'AB+'
        };
        localStorage.setItem('prisha_admin_active', 'true');
        onSuccessMessage('✅ Logged in successfully as Clinic Administrator!');
        onLoginSuccess(adminProfile, true);
        return;
      }

      // 2. Real Supabase Auth login chain
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      });

      if (error) {
        // If there is an auth error, we can check mock accounts in localStorage
        const storedUsers = JSON.parse(localStorage.getItem('prisha_mock_users') || '[]');
        const existingMockUser = storedUsers.find((u: any) => u.email.toLowerCase() === loginEmail.toLowerCase());
        
        if (existingMockUser && loginPassword === 'password123') { // Simple password check for mock
          const mockProfile: UserProfile = {
            id: existingMockUser.id,
            email: existingMockUser.email,
            full_name: existingMockUser.fullName,
            phone: existingMockUser.phone,
            birth_date: existingMockUser.birthDate,
            gender: existingMockUser.gender,
            address: existingMockUser.address,
            blood_group: existingMockUser.bloodGroup
          };
          localStorage.removeItem('prisha_admin_active');
          onSuccessMessage(`✅ Logged in successfully as ${mockProfile.full_name}!`);
          onLoginSuccess(mockProfile, false);
          return;
        }

        // Try standard local test user login as fallback
        if (loginEmail.toLowerCase() === 'patient@example.com' && loginPassword === 'patient123') {
          const guestProfile: UserProfile = {
            id: 'demo-patient-uid-100',
            email: 'patient@example.com',
            full_name: 'Priyansh Jain (Demo)',
            phone: '+91 94250 11223',
            birth_date: '1995-12-05',
            gender: 'Male',
            address: 'Arera Colony, Bhopal',
            blood_group: 'O+'
          };
          localStorage.removeItem('prisha_admin_active');
          onSuccessMessage('✅ Logged in to patient sandbox environment.');
          onLoginSuccess(guestProfile, false);
          return;
        }

        throw error;
      }

      // If user log in is successful, query profile details from 'users' table
      if (data.user) {
        const { data: profile, error: profileErr } = await supabase
          .from('users')
          .select('*')
          .eq('email', data.user.email)
          .single();

        let finalProfile: UserProfile = {
          id: data.user.id,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.full_name || 'Patient User',
          phone: data.user.phone || ''
        };

        if (profile) {
          finalProfile = { ...finalProfile, ...profile };
        }

        const isAdministrator = finalProfile.email.toLowerCase() === 'tanmayrajputtv@gmail.com' && loginPassword === 'tanmay@11';
        if (isAdministrator) {
          localStorage.setItem('prisha_admin_active', 'true');
        } else {
          localStorage.removeItem('prisha_admin_active');
        }

        onSuccessMessage(`Welcome back, ${finalProfile.full_name}!`);
        onLoginSuccess(finalProfile, isAdministrator);
      }
    } catch (err: any) {
      const errMsg = err.message || '';
      if (errMsg.toLowerCase().includes('email not confirmed') || errMsg.toLowerCase().includes('confirm your email') || errMsg.toLowerCase().includes('email_not_confirmed')) {
        setAuthNotice({
          type: 'warning',
          message: '✉️ Email Address Not Confirmed! To complete your registration audit, please click the link in your verification email. If you are the Database Administrator, you can disable this requirement by going to key: "Supabase Dashboard -> Authentication -> Providers -> Email" and toggling off "Confirm email".'
        });
        onErrorMessage('Please confirm your email address to sign in.');
      } else {
        onErrorMessage(errMsg || 'Error occurred while executing sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      onErrorMessage('Confirm password mismatch!');
      return;
    }

    setLoading(true);

    try {
      // 1. Create real Supabase Authentication SignUp
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email.trim(),
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.fullName,
            phone: signUpData.phone
          }
        }
      });

      if (error) {
        // If it's a real validation error from live Supabase auth server (e.g. email already registered, password too weak, etc.)
        const isValErr = error.status === 400 || error.status === 422 || 
          error.message.toLowerCase().includes('already') || 
          error.message.toLowerCase().includes('exist') ||
          error.message.toLowerCase().includes('invalid') || 
          error.message.toLowerCase().includes('weak');
        
        if (isValErr) {
          const formattedErr = new Error(error.message);
          (formattedErr as any).isDbValidationError = true;
          throw formattedErr;
        }

        console.warn("Real Supabase signup failed/not configured, caching in localStorage as guest accounts.", error);
        throw error;
      }

      // 2. Insert detailed parameters to "users" profile table
      if (data.user) {
        const { error: insertErr } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: signUpData.email.trim(),
            full_name: signUpData.fullName,
            phone: signUpData.phone,
            birth_date: signUpData.birthDate || null,
            gender: signUpData.gender,
            address: signUpData.address || null,
            blood_group: signUpData.bloodGroup
          });

        if (insertErr) {
          console.warn("Supabase profile insert error - possibly table structure: ", insertErr);
          let friendlyMsg = insertErr.message || 'Database insert error.';
          if (insertErr.code === '23505') {
            friendlyMsg = '✉️ This email address is already initiated in our clinic database. If you have already registered, please try logging in now. If you received a verification link, please confirm your email first!';
          } else if (insertErr.code === '42501') {
            friendlyMsg = '🔒 Security Policy restriction: Permission denied while writing your patient profile.';
          }
          const dbError = new Error(friendlyMsg);
          (dbError as any).isDbValidationError = true;
          throw dbError;
        }

        const registeredProfile: UserProfile = {
          id: data.user.id,
          email: signUpData.email,
          full_name: signUpData.fullName,
          phone: signUpData.phone,
          birth_date: signUpData.birthDate,
          gender: signUpData.gender,
          address: signUpData.address,
          blood_group: signUpData.bloodGroup
        };

        if (data.session) {
          onSuccessMessage('✅ Registered and initialized clinical folder successfully!');
          onLoginSuccess(registeredProfile, false);
        } else {
          setActiveTab('login');
          setAuthNotice({
            type: 'warning',
            message: '✉️ Registration requested! However, Email Confirmation is required by your Supabase project. Please check your inbox (and spam folder) for the verification link to proceed. (Administrators: To disable this requirement, toggle off "Confirm email" inside your Supabase dashboard at: Authentication -> Providers -> Email).'
          });
          onSuccessMessage('✅ Account initialized! Verification email dispatched.');
        }
      }
    } catch (err: any) {
      if (err.isDbValidationError) {
        onErrorMessage(err.message);
        return;
      }
      // Graceful Mock fallback if Supabase Auth setup isn't live yet
      const registeredUser = {
        id: "mock-usr-" + Math.random().toString(36).substr(2, 9),
        fullName: signUpData.fullName,
        email: signUpData.email,
        phone: signUpData.phone,
        birthDate: signUpData.birthDate,
        gender: signUpData.gender,
        bloodGroup: signUpData.bloodGroup,
        address: signUpData.address,
        created_at: new Date().toISOString()
      };

      const storedUsers = JSON.parse(localStorage.getItem('prisha_mock_users') || '[]');
      storedUsers.push(registeredUser);
      localStorage.setItem('prisha_mock_users', JSON.stringify(storedUsers));

      const registeredProfile: UserProfile = {
        id: registeredUser.id,
        email: registeredUser.email,
        full_name: registeredUser.fullName,
        phone: registeredUser.phone,
        birth_date: registeredUser.birthDate,
        gender: registeredUser.gender,
        address: registeredUser.address,
        blood_group: registeredUser.bloodGroup
      };

      onSuccessMessage('✅ Registered successfully! Clinical folder initialized in browser local session.');
      onLoginSuccess(registeredProfile, false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-light">
      <section className="py-24 sm:py-32 flex items-center justify-center font-body text-sm select-none flex-grow">
        <div className="max-w-md w-full mx-auto px-4">
          
          {/* Logo brand profile */}
          <div className="text-center mb-8 flex flex-col items-center">
            <img
              src="https://i.ibb.co/HDjz6nFD/Whats-App-Image-2026-05-29-at-3-08-39-PM.jpg"
              alt="Prisha Clinic logo"
              className="w-12 h-12 rounded-full object-cover border border-secondary/20 shadow-md mb-2"
              referrerPolicy="no-referrer"
            />
            <h1 className="font-heading text-3xl font-bold text-dark mt-1">Prisha Skin & Hair</h1>
            <p className="text-xs text-secondary tracking-widest uppercase mt-1">Patient Portal Access</p>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-secondary/15 shadow-lg">
            {/* Tabs control */}
            <div className="flex border-b border-light">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setAuthNotice(null);
                }}
                className={`w-1/2 py-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  activeTab === 'login'
                    ? 'border-primary text-primary bg-light/50'
                    : 'border-transparent text-gray-400 hover:text-dark'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Patient Login</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setAuthNotice(null);
                }}
                className={`w-1/2 py-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  activeTab === 'register'
                    ? 'border-primary text-primary bg-light/50'
                    : 'border-transparent text-gray-400 hover:text-dark'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Folder</span>
              </button>
            </div>

            {authNotice && (
              <div className="mx-8 mt-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-xs text-amber-900 leading-relaxed space-y-2 select-text font-medium">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 font-semibold">{authNotice.message}</div>
                  <button 
                    onClick={() => setAuthNotice(null)}
                    className="text-amber-700/60 hover:text-amber-900 text-lg font-bold select-none cursor-pointer focus:outline-none flex-shrink-0"
                    type="button"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Login Frame Tab content */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="p-8 space-y-6">
                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-dark font-semibold mb-2" htmlFor="login_email">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                      <input 
                        type="email" 
                        id="login_email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="patient@example.com"
                        className="w-full border border-secondary/20 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-dark font-semibold" htmlFor="login_pwd">Password</label>
                      <button 
                        type="button"
                        onClick={() => onSuccessMessage("Password recovery is handled via clinic help desk.")}
                        className="text-xs text-primary hover:underline hover:text-dark"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                      <input 
                        type="password" 
                        id="login_pwd"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border border-secondary/20 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-dark text-white font-bold py-3.5 rounded-xl tracking-wider transition-colors shadow-md shadow-primary/20 cursor-pointer"
                >
                  {loading ? 'Authenticating credentials...' : 'Secure Patient Portal Sign In'}
                </button>

                {/* Helpful tips */}
                <div className="bg-cream/50 p-4 rounded-xl border border-secondary/10 flex items-start space-x-2.5">
                  <ShieldAlert className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-dark/70 leading-relaxed">
                    <p className="font-semibold">Sandbox Patient Login:</p>
                    <p className="mt-0.5">Demo Patient: <code className="bg-cream px-1 rounded select-all">patient@example.com</code> / <code className="bg-cream px-1 rounded select-all">patient123</code></p>
                    <p className="text-[11px] text-paragraph mt-1">Authorized clinic administrators can sign in securely using their administrative access credentials.</p>
                  </div>
                </div>
              </form>
            )}

            {/* Register Tab Content */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="p-8 space-y-6">
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-dark font-semibold mb-2" htmlFor="reg_name">Full Name *</label>
                    <input 
                      type="text" 
                      id="reg_name"
                      name="fullName"
                      value={signUpData.fullName}
                      onChange={handleRegisterChange}
                      placeholder="e.g. Pooja Meena"
                      className="w-full border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>

                  {/* Email & Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-dark font-semibold mb-2" htmlFor="reg_email">Email Address *</label>
                      <input 
                        type="email" 
                        id="reg_email"
                        name="email"
                        value={signUpData.email}
                        onChange={handleRegisterChange}
                        placeholder="name@example.com"
                        className="w-full border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-dark font-semibold mb-2" htmlFor="reg_phone">Phone *</label>
                      <input 
                        type="tel" 
                        id="reg_phone"
                        name="phone"
                        value={signUpData.phone}
                        onChange={handleRegisterChange}
                        placeholder="+91-XXXXX-XXXXX"
                        className="w-full border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-dark font-semibold mb-2" htmlFor="reg_pwd">Password *</label>
                      <input 
                        type="password" 
                        id="reg_pwd"
                        name="password"
                        value={signUpData.password}
                        onChange={handleRegisterChange}
                        placeholder="Min 6 characters"
                        className="w-full border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-dark font-semibold mb-2" htmlFor="reg_pwd_conf">Confirm Password *</label>
                      <input 
                        type="password" 
                        id="reg_pwd_conf"
                        name="confirmPassword"
                        value={signUpData.confirmPassword}
                        onChange={handleRegisterChange}
                        placeholder="••••••••"
                        className="w-full border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* DOB & Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-dark font-semibold mb-2" htmlFor="reg_dob">Birth Date</label>
                      <input 
                        type="date" 
                        id="reg_dob"
                        name="birthDate"
                        value={signUpData.birthDate}
                        onChange={handleRegisterChange}
                        className="w-full border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-dark font-semibold mb-2" htmlFor="reg_gender">Gender</label>
                      <select 
                        id="reg_gender"
                        name="gender"
                        value={signUpData.gender}
                        onChange={handleRegisterChange}
                        className="w-full border border-secondary/20 bg-white rounded-xl px-4 py-3 focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label className="block text-dark font-semibold mb-2" htmlFor="reg_blood">Blood Group</label>
                    <select 
                      id="reg_blood"
                      name="bloodGroup"
                      value={signUpData.bloodGroup}
                      onChange={handleRegisterChange}
                      className="w-full border border-secondary/20 bg-white rounded-xl px-4 py-3 focus:outline-none"
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

                  {/* Address */}
                  <div>
                    <label className="block text-dark font-semibold mb-2" htmlFor="reg_addr">Full Address</label>
                    <textarea 
                      id="reg_addr"
                      name="address"
                      rows={2}
                      value={signUpData.address}
                      onChange={handleRegisterChange}
                      placeholder="e.g. Arera Colony, Bhopal"
                      className="w-full border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary hover:bg-primary text-white font-bold py-3.5 rounded-xl tracking-wider transition-colors shadow-md shadow-secondary/15 cursor-pointer"
                >
                  {loading ? 'Initializing Clinical File...' : 'Create Account Portfolio'}
                </button>
              </form>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
