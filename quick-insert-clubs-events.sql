-- Quick Insert Scripts for Supabase
-- Copy and paste these individual sections as needed

-- =====================================================
-- QUICK CLUB INSERTS (Replace USER_ID with actual user ID)
-- =====================================================

-- First, find your user ID:
SELECT id, name, email FROM users WHERE role IN ('admin', 'club_lead');

-- Then replace 'YOUR_USER_ID_HERE' with the actual UUID from above

-- Insert a single club:
INSERT INTO clubs (name, description, lead_id) VALUES
('Gaming Club', 'For gamers to connect, compete, and have fun together', 'YOUR_USER_ID_HERE');

-- Insert multiple clubs at once:
INSERT INTO clubs (name, description, lead_id) VALUES
('Robotics Club', 'Build, program, and compete with robots', 'YOUR_USER_ID_HERE'),
('Literature Club', 'Discuss books, poetry, and creative writing', 'YOUR_USER_ID_HERE'),
('Dance Club', 'Express yourself through various dance forms', 'YOUR_USER_ID_HERE');

-- =====================================================
-- QUICK EVENT INSERTS (Replace CLUB_ID with actual club ID)
-- =====================================================

-- First, find your club ID:
SELECT id, name FROM clubs;

-- Then replace 'YOUR_CLUB_ID_HERE' with the actual UUID from above

-- Insert a single event:
INSERT INTO events (title, description, date, venue, capacity, club_id, status) VALUES
('Gaming Tournament', 
 'Epic gaming competition with multiple game categories and prizes',
 '2026-02-15 14:00:00',
 'Gaming Lab',
 64,
 'YOUR_CLUB_ID_HERE',
 'approved');

-- Insert multiple events for the same club:
INSERT INTO events (title, description, date, venue, capacity, club_id, status) VALUES
('Book Reading Session', 'Monthly book discussion and reading session', '2026-02-10 16:00:00', 'Library Hall', 30, 'YOUR_CLUB_ID_HERE', 'approved'),
('Poetry Night', 'Share your original poems and enjoy others creativity', '2026-02-17 19:00:00', 'Auditorium', 50, 'YOUR_CLUB_ID_HERE', 'pending'),
('Creative Writing Workshop', 'Learn techniques for better storytelling', '2026-02-24 15:00:00', 'Room 201', 25, 'YOUR_CLUB_ID_HERE', 'approved');

-- =====================================================
-- EXAMPLE WITH ACTUAL COORDINATOR USER
-- =====================================================

-- If you want to use the existing coordinator user:
INSERT INTO clubs (name, description, lead_id) VALUES
('Innovation Hub', 
 'A space for entrepreneurs and innovators to collaborate and build startups',
 (SELECT id FROM users WHERE email = 'coordinator@university.edu'));

-- Then add events for this club:
INSERT INTO events (title, description, date, venue, capacity, club_id, status) VALUES
('Startup Pitch Competition', 
 'Present your startup ideas to industry experts and win funding opportunities',
 '2026-02-20 18:00:00',
 'Innovation Center',
 100,
 (SELECT id FROM clubs WHERE name = 'Innovation Hub'),
 'approved');

-- =====================================================
-- BULK INSERT TEMPLATE
-- =====================================================

-- Use this template to quickly add multiple clubs and events:

-- Step 1: Insert clubs
INSERT INTO clubs (name, description, lead_id) VALUES
('Club Name 1', 'Description 1', (SELECT id FROM users WHERE email = 'coordinator@university.edu')),
('Club Name 2', 'Description 2', (SELECT id FROM users WHERE email = 'coordinator@university.edu')),
('Club Name 3', 'Description 3', (SELECT id FROM users WHERE email = 'coordinator@university.edu'));

-- Step 2: Insert events (adjust dates to be in the future)
INSERT INTO events (title, description, date, venue, capacity, club_id, status) VALUES
('Event 1', 'Event 1 Description', '2026-02-15 18:00:00', 'Venue 1', 50, (SELECT id FROM clubs WHERE name = 'Club Name 1'), 'approved'),
('Event 2', 'Event 2 Description', '2026-02-16 19:00:00', 'Venue 2', 75, (SELECT id FROM clubs WHERE name = 'Club Name 2'), 'pending'),
('Event 3', 'Event 3 Description', '2026-02-17 20:00:00', 'Venue 3', 100, (SELECT id FROM clubs WHERE name = 'Club Name 3'), 'approved');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check what you just inserted:
SELECT c.name as club, e.title as event, e.date, e.status 
FROM clubs c 
LEFT JOIN events e ON c.id = e.club_id 
ORDER BY c.name, e.date;

-- Count events by club:
SELECT c.name, COUNT(e.id) as event_count
FROM clubs c 
LEFT JOIN events e ON c.id = e.club_id 
GROUP BY c.id, c.name 
ORDER BY event_count DESC;