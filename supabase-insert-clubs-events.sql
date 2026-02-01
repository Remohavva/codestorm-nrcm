-- SQL Scripts for Adding Clubs and Events Directly in Supabase
-- Run these in the Supabase SQL Editor

-- =====================================================
-- 1. INSERT CLUBS
-- =====================================================

-- First, get a user ID to assign as club lead (replace with actual user ID)
-- You can find user IDs by running: SELECT id, name, email FROM users;

-- Insert sample clubs
INSERT INTO clubs (name, description, lead_id) VALUES
('Computer Science Club', 'A community for CS students to learn, share, and collaborate on tech projects', 
 (SELECT id FROM users WHERE email = 'coordinator@university.edu' LIMIT 1)),
 
('Photography Club', 'Capture moments, share creativity, and explore the art of photography together', 
 (SELECT id FROM users WHERE email = 'coordinator@university.edu' LIMIT 1)),
 
('Debate Society', 'Sharpen your argumentation skills and engage in intellectual discussions', 
 (SELECT id FROM users WHERE email = 'coordinator@university.edu' LIMIT 1)),
 
('Music Club', 'For music lovers to jam, perform, and appreciate all genres of music', 
 (SELECT id FROM users WHERE email = 'coordinator@university.edu' LIMIT 1)),
 
('Environmental Club', 'Promoting sustainability and environmental awareness on campus', 
 (SELECT id FROM users WHERE email = 'coordinator@university.edu' LIMIT 1)),
 
('Drama Club', 'Express yourself through theater, acting, and dramatic performances', 
 (SELECT id FROM users WHERE email = 'coordinator@university.edu' LIMIT 1)),
 
('Sports Club', 'Stay active and competitive with various sports and fitness activities', 
 (SELECT id FROM users WHERE email = 'coordinator@university.edu' LIMIT 1)),
 
('Art Club', 'Explore creativity through painting, drawing, and various art forms', 
 (SELECT id FROM users WHERE email = 'coordinator@university.edu' LIMIT 1));

-- =====================================================
-- 2. INSERT EVENTS
-- =====================================================

-- Insert sample events for the clubs
-- Note: Adjust dates to be in the future from your current date

INSERT INTO events (title, description, date, venue, capacity, club_id, status) VALUES

-- Computer Science Club Events
('Tech Talk: AI in Modern Development', 
 'Join us for an exciting discussion about AI tools and their impact on software development. Industry experts will share insights.',
 '2026-02-15 18:00:00',
 'Main Auditorium',
 150,
 (SELECT id FROM clubs WHERE name = 'Computer Science Club' LIMIT 1),
 'approved'),

('Hackathon 2026', 
 'A 48-hour coding marathon where teams compete to build innovative solutions. Prizes worth $5000!',
 '2026-02-22 09:00:00',
 'Computer Lab Building',
 100,
 (SELECT id FROM clubs WHERE name = 'Computer Science Club' LIMIT 1),
 'approved'),

('Web Development Workshop', 
 'Learn modern web development with React, Node.js, and MongoDB. Hands-on coding session.',
 '2026-02-08 14:00:00',
 'Room 301',
 50,
 (SELECT id FROM clubs WHERE name = 'Computer Science Club' LIMIT 1),
 'approved'),

-- Photography Club Events
('Campus Photography Walk', 
 'Explore the beautiful campus while learning composition techniques and lighting tips from professional photographers.',
 '2026-02-10 16:00:00',
 'Campus Grounds',
 30,
 (SELECT id FROM clubs WHERE name = 'Photography Club' LIMIT 1),
 'approved'),

('Portrait Photography Workshop', 
 'Master the art of portrait photography with professional lighting setups and posing techniques.',
 '2026-02-17 15:00:00',
 'Art Studio',
 25,
 (SELECT id FROM clubs WHERE name = 'Photography Club' LIMIT 1),
 'pending'),

-- Debate Society Events
('Inter-College Debate Championship', 
 'Compete against the best debaters from neighboring colleges. Topic: "Technology vs Privacy"',
 '2026-02-20 10:00:00',
 'Conference Hall',
 200,
 (SELECT id FROM clubs WHERE name = 'Debate Society' LIMIT 1),
 'approved'),

('Public Speaking Workshop', 
 'Overcome stage fright and master the art of persuasive communication.',
 '2026-02-12 17:00:00',
 'Room 205',
 40,
 (SELECT id FROM clubs WHERE name = 'Debate Society' LIMIT 1),
 'approved'),

-- Music Club Events
('Open Mic Night', 
 'Showcase your musical talents! All genres welcome. Acoustic and electric setups available.',
 '2026-02-14 19:00:00',
 'Student Center',
 80,
 (SELECT id FROM clubs WHERE name = 'Music Club' LIMIT 1),
 'approved'),

('Battle of the Bands', 
 'Rock the stage! College bands compete for the title and cash prizes.',
 '2026-02-28 18:00:00',
 'Main Auditorium',
 300,
 (SELECT id FROM clubs WHERE name = 'Music Club' LIMIT 1),
 'pending'),

-- Environmental Club Events
('Campus Clean-Up Drive', 
 'Join us in making our campus greener and cleaner. Refreshments and certificates provided.',
 '2026-02-09 08:00:00',
 'Campus Grounds',
 100,
 (SELECT id FROM clubs WHERE name = 'Environmental Club' LIMIT 1),
 'approved'),

('Sustainability Workshop', 
 'Learn practical ways to reduce your carbon footprint and live sustainably.',
 '2026-02-16 14:00:00',
 'Room 102',
 60,
 (SELECT id FROM clubs WHERE name = 'Environmental Club' LIMIT 1),
 'approved'),

-- Drama Club Events
('Shakespeare Night', 
 'Experience the magic of Shakespeare with performances from Hamlet, Romeo & Juliet, and Macbeth.',
 '2026-02-21 19:30:00',
 'Theater Hall',
 120,
 (SELECT id FROM clubs WHERE name = 'Drama Club' LIMIT 1),
 'approved'),

('Acting Workshop for Beginners', 
 'Discover your inner actor! Learn basic acting techniques and stage presence.',
 '2026-02-11 16:00:00',
 'Drama Room',
 35,
 (SELECT id FROM clubs WHERE name = 'Drama Club' LIMIT 1),
 'approved'),

-- Sports Club Events
('Annual Sports Meet', 
 'Multi-sport competition featuring basketball, volleyball, badminton, and track events.',
 '2026-02-25 09:00:00',
 'Sports Complex',
 500,
 (SELECT id FROM clubs WHERE name = 'Sports Club' LIMIT 1),
 'approved'),

('Fitness Bootcamp', 
 'High-intensity workout session to boost your fitness levels. All fitness levels welcome.',
 '2026-02-13 06:00:00',
 'Gymnasium',
 40,
 (SELECT id FROM clubs WHERE name = 'Sports Club' LIMIT 1),
 'approved'),

-- Art Club Events
('Art Exhibition: Student Showcase', 
 'Display your artistic creations! Paintings, sculptures, and digital art welcome.',
 '2026-02-18 11:00:00',
 'Art Gallery',
 150,
 (SELECT id FROM clubs WHERE name = 'Art Club' LIMIT 1),
 'pending'),

('Painting Workshop: Watercolors', 
 'Learn watercolor techniques from landscape to portrait painting.',
 '2026-02-07 15:00:00',
 'Art Studio',
 20,
 (SELECT id FROM clubs WHERE name = 'Art Club' LIMIT 1),
 'approved');

-- =====================================================
-- 3. VERIFY INSERTIONS
-- =====================================================

-- Check inserted clubs
SELECT 
  c.id,
  c.name,
  c.description,
  u.name as lead_name,
  u.email as lead_email
FROM clubs c
LEFT JOIN users u ON c.lead_id = u.id
ORDER BY c.name;

-- Check inserted events
SELECT 
  e.id,
  e.title,
  e.date,
  e.venue,
  e.capacity,
  e.status,
  c.name as club_name
FROM events e
LEFT JOIN clubs c ON e.club_id = c.id
ORDER BY e.date;

-- =====================================================
-- 4. ADDITIONAL USEFUL QUERIES
-- =====================================================

-- Get events by status
SELECT title, date, venue, status, 
       (SELECT name FROM clubs WHERE id = club_id) as club_name
FROM events 
WHERE status = 'approved'
ORDER BY date;

-- Get club statistics
SELECT 
  c.name as club_name,
  COUNT(e.id) as total_events,
  COUNT(CASE WHEN e.status = 'approved' THEN 1 END) as approved_events,
  COUNT(CASE WHEN e.status = 'pending' THEN 1 END) as pending_events
FROM clubs c
LEFT JOIN events e ON c.id = e.club_id
GROUP BY c.id, c.name
ORDER BY total_events DESC;

-- Get upcoming events (next 30 days)
SELECT 
  e.title,
  e.date,
  e.venue,
  e.capacity,
  c.name as club_name,
  u.name as coordinator_name
FROM events e
JOIN clubs c ON e.club_id = c.id
JOIN users u ON c.lead_id = u.id
WHERE e.date >= NOW() 
  AND e.date <= NOW() + INTERVAL '30 days'
  AND e.status = 'approved'
ORDER BY e.date;