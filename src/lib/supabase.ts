import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://moxwdgkytvuzssjtlehz.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veHdkZ2t5dHZ1enNzanRsZWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MTY2MjUsImV4cCI6MjA5NTQ5MjYyNX0.A7dXGrKVlVMeJgPpoLULU6C2qj8l02kXIl0dv561J6c";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
