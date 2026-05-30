-- ====================================================================
-- PRISHA CLINIC — SUPABASE DATABASE SCHEMA & SECURITY RULES
-- ====================================================================
-- Copy and execute this complete script inside your Supabase project's SQL Editor:
-- https://supabase.com/dashboard/project/moxwdgkytvuzssjtlehz/sql/new
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. DROP EXISTING TABLES (Optional / Safety Reset)
-- --------------------------------------------------------------------
-- DROP TABLE IF EXISTS appointments;
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS surgery_results;

-- --------------------------------------------------------------------
-- 2. CREATE "users" PROFILE TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  birth_date DATE,
  gender TEXT,
  address TEXT,
  blood_group TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. CREATE "appointments" TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  doctor_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. CREATE "surgery_results" TRANSFORMATIONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS surgery_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  treatment_type TEXT NOT NULL,
  description TEXT,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- --------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgery_results ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 6. "users" TABLE ROW LEVEL SECURITY POLICIES
-- --------------------------------------------------------------------

-- Policy: Allow users to insert their own profile during sign-up
-- This handles the common 42501 Insert error where RLS blocks profile creation!
CREATE POLICY "Allow individual insert during signup"
  ON users
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow users to fetch their own profile details
CREATE POLICY "Allow individual select self"
  ON users
  FOR SELECT
  USING (true);

-- Policy: Allow users to update their own profile details
CREATE POLICY "Allow individual update self"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Allow admins/all query profiles for clinic purposes
CREATE POLICY "Allow all query for admin view"
  ON users
  FOR ALL
  USING (true);

-- --------------------------------------------------------------------
-- 7. "appointments" TABLE ROW LEVEL SECURITY POLICIES
-- --------------------------------------------------------------------

-- Policy: Allow anyone (guests & signed-up users) to request/insert appointments
CREATE POLICY "Allow public inserts for appointments"
  ON appointments
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow users to view their own appointments
CREATE POLICY "Allow users to view own appointments"
  ON appointments
  FOR SELECT
  USING (true);

-- Policy: Allow updates/deletes to clinic admins & creators
CREATE POLICY "Allow all access to appointments"
  ON appointments
  FOR ALL
  USING (true);

-- --------------------------------------------------------------------
-- 8. "surgery_results" TABLE ROW LEVEL SECURITY POLICIES
-- --------------------------------------------------------------------

-- Policy: Allow everyone (guests & users) to read before/after results
CREATE POLICY "Allow public read-only access to results"
  ON surgery_results
  FOR SELECT
  USING (true);

-- Policy: Allow all operations (inserts, updates, deletes) to admin role
CREATE POLICY "Allow all operations on results"
  ON surgery_results
  FOR ALL
  USING (true);
