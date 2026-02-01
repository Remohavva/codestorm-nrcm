-- Create certificate test data for a specific user
-- INSTRUCTIONS: Replace the email below with the actual user email you want to test with

-- Set the user email here (CHANGE THIS TO YOUR TEST USER EMAIL)
-- Example: 'coordinator@university.edu' or 'prajith2773@gmail.com'
\set user_email 'coordinator@university.edu'

-- Create a backdated event with registration and certificate
DO $$
DECLARE
    test_user_id UUID;
    test_club_id UUID;
    test_event_id UUID;
    test_registration_id UUID;
    test_certificate_id UUID;
BEGIN
    -- Get user ID (replace email as needed)
    SELECT id INTO test_user_id FROM users WHERE email = 'coordinator@university.edu' LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'User not found with email: coordinator@university.edu';
        RAISE NOTICE 'Available users:';
        FOR rec IN SELECT email, name FROM users LIMIT 5 LOOP
            RAISE NOTICE '  - % (%)', rec.email, rec.name;
        END LOOP;
        RETURN;
    END IF;
    
    -- Get a club ID
    SELECT id INTO test_club_id FROM clubs LIMIT 1;
    
    IF test_club_id IS NULL THEN
        RAISE NOTICE 'No clubs found. Please create a club first.';
        RETURN;
    END IF;
    
    -- Create backdated event
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
        'Certificate Demo Workshop',
        'A demonstration workshop to showcase the certificate system with hands-on activities and learning outcomes.',
        '2026-01-20 15:00:00+00',  -- Backdated event
        'Innovation Lab',
        30,
        test_club_id,
        'approved',
        '2026-01-18 10:00:00+00',
        '2026-01-18 10:00:00+00'
    ) RETURNING id INTO test_event_id;
    
    -- Create registration
    INSERT INTO registrations (
        id,
        user_id,
        event_id,
        status,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        test_user_id,
        test_event_id,
        'registered',
        '2026-01-19 11:30:00+00',
        '2026-01-19 11:30:00+00'
    ) RETURNING id INTO test_registration_id;
    
    -- Create certificate
    INSERT INTO certificates (
        id,
        registration_id,
        event_id,
        user_id,
        issued_at,
        status,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        test_registration_id,
        test_event_id,
        test_user_id,
        '2026-01-19 11:35:00+00',
        'active',
        '2026-01-19 11:35:00+00',
        '2026-01-19 11:35:00+00'
    ) RETURNING id INTO test_certificate_id;
    
    RAISE NOTICE 'Successfully created test data:';
    RAISE NOTICE '  Event ID: %', test_event_id;
    RAISE NOTICE '  Registration ID: %', test_registration_id;
    RAISE NOTICE '  Certificate ID: %', test_certificate_id;
    RAISE NOTICE '  User: % (%)', (SELECT name FROM users WHERE id = test_user_id), (SELECT email FROM users WHERE id = test_user_id);
    
END $$;

-- Verify the certificate was created
SELECT 
    'Certificate Created Successfully!' as status,
    c.id as certificate_id,
    e.title as event_title,
    u.name as participant_name,
    u.email as participant_email,
    e.date as event_date,
    e.venue as event_venue,
    c.issued_at as certificate_issued,
    club.name as organizing_club
FROM certificates c
JOIN events e ON c.event_id = e.id
JOIN users u ON c.user_id = u.id
JOIN clubs club ON e.club_id = club.id
WHERE e.title = 'Certificate Demo Workshop'
ORDER BY c.created_at DESC
LIMIT 1;