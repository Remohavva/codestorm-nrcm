-- Fixed Certificate Demo Data for Supabase
-- This script works directly in Supabase SQL Editor

-- STEP 1: Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  issued_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_event_id ON certificates(event_id);
CREATE INDEX IF NOT EXISTS idx_certificates_registration_id ON certificates(registration_id);

-- Enable RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own certificates" ON certificates;
CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can create certificates" ON certificates;
CREATE POLICY "Authenticated users can create certificates" ON certificates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- STEP 2: Show available users (check this output to see available users)
SELECT 
  'Available Users - Pick one email for next step:' as info,
  id,
  name,
  email,
  role
FROM users 
ORDER BY created_at DESC 
LIMIT 10;