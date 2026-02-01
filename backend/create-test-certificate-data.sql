-- Create test data for certificate demonstration
-- This script creates a backdated event, registration, and certificate

-- First, let's create the certificates table if it doesn't exist
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_certificates_registration_id ON certificates(registration_id);
CREATE INDEX IF NOT EXISTS idx_certificates_event_id ON certificates(event_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);
CREATE INDEX IF NOT EXISTS idx_certificates_issued_at ON certificates(issued_at DESC);

-- Create unique constraint to prevent duplicate certificates
CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_unique_registration 
ON certificates(registration_id) WHERE status = 'active';

-- Add RLS policies
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own certificates
DROP POLICY IF EXISTS "Users can view own certificates" ON certificates;
CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Authenticated users can insert certificates (for registration process)
DROP POLICY IF EXISTS "Authenticated users can create certificates" ON certificates;
CREATE POLICY "Authenticated users can create certificates" ON certificates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Users can update their own certificates
DROP POLICY IF EXISTS "Users can update own certificates" ON certificates;
CREATE POLICY "Users can update own certificates" ON certificates
  FOR UPDATE USING (auth.uid() = user_id);

-- Now let's create test data
-- Note: Replace the UUIDs below with actual user and club IDs from your database

-- Step 1: Insert a backdated event (replace club_id with actual club ID)
INSERT INTO events (
  id,
  title,
  description,
  date,
  venue,
  capacity,
  club_id,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'AI & Machine Learning Workshop',
  'A comprehensive workshop covering the fundamentals of AI and Machine Learning with hands-on projects and real-world applications.',
  '2026-01-15 14:00:00+00',  -- Backdated to January 15, 2026
  'Computer Science Lab A',
  50,
  (SELECT id FROM clubs LIMIT 1),  -- Uses first available club
  'approved',
  '2026-01-10 10:00:00+00',  -- Created 5 days before event
  '2026-01-10 10:00:00+00'
) ON CONFLICT DO NOTHING;

-- Step 2: Get the event ID we just created
-- Step 3: Insert a registration for a user (replace with actual user ID)
WITH event_data AS (
  SELECT id as event_id FROM events WHERE title = 'AI & Machine Learning Workshop' LIMIT 1
),
user_data AS (
  SELECT id as user_id FROM users WHERE email = 'coordinator@university.edu' LIMIT 1  -- Replace with actual user email
)
INSERT INTO registrations (
  id,
  user_id,
  event_id,
  status,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  user_data.user_id,
  event_data.event_id,
  'registered',
  '2026-01-12 09:30:00+00',  -- Registered 3 days before event
  '2026-01-12 09:30:00+00'
FROM event_data, user_data
ON CONFLICT DO NOTHING;

-- Step 4: Insert a certificate for the registration
WITH registration_data AS (
  SELECT 
    r.id as registration_id,
    r.user_id,
    r.event_id
  FROM registrations r
  JOIN events e ON r.event_id = e.id
  WHERE e.title = 'AI & Machine Learning Workshop'
  LIMIT 1
)
INSERT INTO certificates (
  id,
  registration_id,
  event_id,
  user_id,
  issued_at,
  status,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  registration_data.registration_id,
  registration_data.event_id,
  registration_data.user_id,
  '2026-01-12 09:35:00+00',  -- Certificate issued 5 minutes after registration
  'active',
  '2026-01-12 09:35:00+00',
  '2026-01-12 09:35:00+00'
FROM registration_data
ON CONFLICT DO NOTHING;

-- Let's also create another backdated event for more test data
INSERT INTO events (
  id,
  title,
  description,
  date,
  venue,
  capacity,
  club_id,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Web Development Bootcamp',
  'Intensive bootcamp covering modern web development technologies including React, Node.js, and database integration.',
  '2026-01-08 10:00:00+00',  -- Another backdated event
  'Main Auditorium',
  100,
  (SELECT id FROM clubs LIMIT 1),
  'approved',
  '2026-01-05 08:00:00+00',
  '2026-01-05 08:00:00+00'
) ON CONFLICT DO NOTHING;

-- Registration and certificate for second event
WITH event_data AS (
  SELECT id as event_id FROM events WHERE title = 'Web Development Bootcamp' LIMIT 1
),
user_data AS (
  SELECT id as user_id FROM users WHERE email = 'coordinator@university.edu' LIMIT 1
)
INSERT INTO registrations (
  id,
  user_id,
  event_id,
  status,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  user_data.user_id,
  event_data.event_id,
  'registered',
  '2026-01-06 14:20:00+00',
  '2026-01-06 14:20:00+00'
FROM event_data, user_data
ON CONFLICT DO NOTHING;

-- Certificate for second event
WITH registration_data AS (
  SELECT 
    r.id as registration_id,
    r.user_id,
    r.event_id
  FROM registrations r
  JOIN events e ON r.event_id = e.id
  WHERE e.title = 'Web Development Bootcamp'
  AND r.user_id = (SELECT id FROM users WHERE email = 'coordinator@university.edu' LIMIT 1)
  LIMIT 1
)
INSERT INTO certificates (
  id,
  registration_id,
  event_id,
  user_id,
  issued_at,
  status,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  registration_data.registration_id,
  registration_data.event_id,
  registration_data.user_id,
  '2026-01-06 14:25:00+00',
  'active',
  '2026-01-06 14:25:00+00',
  '2026-01-06 14:25:00+00'
FROM registration_data
ON CONFLICT DO NOTHING;

-- Verify the data was created
SELECT 
  'Test Data Summary' as info,
  (SELECT COUNT(*) FROM events WHERE title IN ('AI & Machine Learning Workshop', 'Web Development Bootcamp')) as events_created,
  (SELECT COUNT(*) FROM registrations r JOIN events e ON r.event_id = e.id WHERE e.title IN ('AI & Machine Learning Workshop', 'Web Development Bootcamp')) as registrations_created,
  (SELECT COUNT(*) FROM certificates c JOIN events e ON c.event_id = e.id WHERE e.title IN ('AI & Machine Learning Workshop', 'Web Development Bootcamp')) as certificates_created;

-- Show the created certificates for verification
SELECT 
  c.id as certificate_id,
  e.title as event_title,
  u.name as user_name,
  u.email as user_email,
  c.issued_at,
  c.status
FROM certificates c
JOIN events e ON c.event_id = e.id
JOIN users u ON c.user_id = u.id
WHERE e.title IN ('AI & Machine Learning Workshop', 'Web Development Bootcamp')
ORDER BY c.issued_at DESC;