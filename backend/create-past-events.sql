-- Create truly past events for testing
-- These events will have dates in January 2026 (before February 1, 2026)

-- Get a club ID to use
WITH club_data AS (
  SELECT id as club_id FROM clubs LIMIT 1
)
INSERT INTO events (
  title,
  description,
  date,
  venue,
  capacity,
  club_id,
  status,
  created_at,
  updated_at
) 
SELECT 
  'Mobile App Demo Workshop',
  'A hands-on workshop demonstrating mobile app development with React Native and certificate generation.',
  '2026-01-25T14:00:00+00:00',
  'Tech Hub Room 101',
  25,
  club_data.club_id,
  'approved',
  '2026-01-23T09:00:00+00:00',
  '2026-01-23T09:00:00+00:00'
FROM club_data

UNION ALL

SELECT 
  'AI & Machine Learning Workshop',
  'A comprehensive workshop covering the fundamentals of AI and Machine Learning with hands-on projects.',
  '2026-01-15T14:00:00+00:00',
  'Computer Science Lab A',
  50,
  club_data.club_id,
  'approved',
  '2026-01-13T10:00:00+00:00',
  '2026-01-13T10:00:00+00:00'
FROM club_data

UNION ALL

SELECT 
  'Web Development Bootcamp',
  'Intensive bootcamp covering modern web development technologies including React, Node.js, and database integration.',
  '2026-01-08T10:00:00+00:00',
  'Main Auditorium',
  100,
  club_data.club_id,
  'approved',
  '2026-01-05T08:00:00+00:00',
  '2026-01-05T08:00:00+00:00'
FROM club_data;

-- Verify the past events were created
SELECT 
  'Past Events Created:' as status,
  title,
  date,
  venue,
  capacity,
  status
FROM events 
WHERE date < '2026-02-01T00:00:00+00:00'
AND title IN ('Mobile App Demo Workshop', 'AI & Machine Learning Workshop', 'Web Development Bootcamp')
ORDER BY date DESC;