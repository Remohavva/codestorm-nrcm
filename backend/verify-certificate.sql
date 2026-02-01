-- STEP 3: Verify the certificate was created successfully
SELECT 
  '🏆 Certificate Verification Results:' as status,
  c.id as certificate_id,
  e.title as event_title,
  u.name as participant,
  u.email as email,
  e.date as event_date,
  e.venue as venue,
  c.issued_at as certificate_issued,
  club.name as organized_by,
  c.status as certificate_status
FROM certificates c
JOIN events e ON c.event_id = e.id
JOIN users u ON c.user_id = u.id
JOIN clubs club ON e.club_id = club.id
WHERE e.title = 'Mobile App Demo Workshop'
ORDER BY c.created_at DESC;