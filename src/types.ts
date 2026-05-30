export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  blood_group?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Appointment {
  id: string;
  user_id?: string;
  patient_name: string;
  phone: string;
  email?: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  doctor_note?: string;
  created_at?: string;
}

export interface SurgeryResult {
  id: string;
  title: string;
  description: string;
  before_image_url: string;
  after_image_url: string;
  treatment_type: string;
  created_at?: string;
}

export interface ServiceItem {
  id: number;
  emoji: string;
  name: string;
  description: string;
  priceRange: string;
}

export interface ReviewItem {
  id: number;
  name: string;
  stars: number;
  text: string;
  initials: string;
}
