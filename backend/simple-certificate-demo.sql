-- Simple Certificate Demo Data
-- STEP 1: First, create the certificates table (run this first)

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

-- STEP 2: Check available users (run this to see available users)
SELECT 
  'Available Users:' as info,
  id,
  name,
  email,
  role
FROM users 
ORDER BY created_at DESC 
LIMIT 5;

-- STEP 3: Check available clubs
SELECT 
  'Available Clubs:' as info,
  id,
  name,
  lead_id
FROM clubs 
LIMIT 3;

-- STEP 4: Create test event, registration, and certificate
-- MODIFY THE EMAIL BELOW TO MATCH YOUR TEST USER
WITH 
target_user AS (
  SELECT id, name, email FROM users 
  WHERE email = 'coordinator@university.edu'  -- CHANGE THIS EMAIL
  LIMIT 1
),
target_club AS (
  SELECT id, name FROM clubs LIMIT 1
),
new_event AS (
  INSERT INTO events (
    title,
    description,
    date,
    venue,
    capacity,
    club_id,
    status,
    created_at
  ) 
  SELECT 
    'Mobile App Demo Workshop',
    'A hands-on workshop demonstrating mobile app development with React Native and certificate generation.',
    '2026-01-25 14:00:00+00',
    'Tech Hub Room 101',
    25,
    target_club.id,
    'approved',
    '2026-01-23 09:00:00+00'
  FROM target_club
  RETURNING id, title
),
new_registration AS (
  INSERT INTO registrations (
    user_id,
    event_id,
    status,
    created_at
  )
  SELECT 
    target_user.id,
    new_event.id,
    'registered',
    '2026-01-24 10:15:00+00'
  FROM target_user, new_event
  RETURNING id, user_id, event_id
),
new_certificate AS (
  INSERT INTO certificates (
    registration_id,
    event_id,
    user_id,
    issued_at,
    status
  )
  SELECT 
    new_registration.id,
    new_registration.event_id,
    new_registration.user_id,
    '2026-01-24 10:20:00+00',
    'active'
  FROM new_registration
  RETURNING id, user_id, event_id
)
SELECT 
  'SUCCESS: Certificate Demo Data Created!' as result,
  target_user.name as user_name,
  target_user.email as user_email,
  new_event.title as event_title,
  new_certificate.id as certificate_id
FROM target_user, new_event, new_certificate;

-- STEP 5: Verify the certificate was created
SELECT 
  '🎉 Certificate Verification' as status,
  c.id as certificate_id,
  e.title as event_title,
  u.name as participant,
  u.email as email,
  e.date as event_date,
  e.venue as venue,
  c.issued_at as certificate_issued,
  club.name as organized_by
FROM certificates c
JOIN events e ON c.event_id = e.id
JOIN users u ON c.user_id = u.id
JOIN clubs club ON e.club_id = club.id
WHERE e.title = 'Mobile App Demo Workshop'
ORDER BY c.created_at DESC;