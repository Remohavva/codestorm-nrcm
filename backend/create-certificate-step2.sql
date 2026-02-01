-- STEP 2: Create certificate data for specific user
-- CHANGE THE EMAIL BELOW to match your user from the previous query

-- Create test event, registration, and certificate
WITH 
target_user AS (
  SELECT id, name, email FROM users 
  WHERE email = 'coordinator@university.edu'  -- ⚠️ CHANGE THIS EMAIL ⚠️
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
  WHERE EXISTS (SELECT 1 FROM target_user)
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
  '🎉 SUCCESS: Certificate Demo Data Created!' as result,
  target_user.name as user_name,
  target_user.email as user_email,
  new_event.title as event_title,
  new_certificate.id as certificate_id
FROM target_user, new_event, new_certificate

UNION ALL

-- Show error if user not found
SELECT 
  '❌ ERROR: User not found with that email' as result,
  'Please check the email and try again' as user_name,
  'Available emails shown in previous query' as user_email,
  'N/A' as event_title,
  'N/A' as certificate_id
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'coordinator@university.edu');  -- ⚠️ CHANGE THIS EMAIL TOO ⚠️