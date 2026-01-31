-- Create Admin User Schema
-- Run this SQL script to create an admin user for the system

-- Insert admin user
INSERT INTO users (name, email, role, created_at, updated_at) 
VALUES (
    'System Administrator',
    'admin@university.edu',
    'admin',
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    role = 'admin',
    updated_at = NOW();

-- Create additional admin users (optional)
INSERT INTO users (name, email, role, created_at, updated_at) 
VALUES 
    ('John Admin', 'john.admin@university.edu', 'admin', NOW(), NOW()),
    ('Sarah Manager', 'sarah.manager@university.edu', 'admin', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
    role = 'admin',
    updated_at = NOW();

-- Verify admin users were created
SELECT id, name, email, role, created_at 
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- Optional: Create a super admin with additional privileges
-- (You can extend this later for different admin levels)
INSERT INTO users (name, email, role, created_at, updated_at) 
VALUES (
    'Super Admin',
    'superadmin@university.edu',
    'admin',
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    role = 'admin',
    updated_at = NOW();

-- Grant admin users access to all clubs (if needed)
-- This is optional - only if you want admins to manage all clubs
DO $$
DECLARE
    admin_user_id UUID;
    club_record RECORD;
BEGIN
    -- Get admin user ID
    SELECT id INTO admin_user_id 
    FROM users 
    WHERE email = 'admin@university.edu';
    
    -- If no clubs exist, create a sample admin club
    IF NOT EXISTS (SELECT 1 FROM clubs LIMIT 1) THEN
        INSERT INTO clubs (name, description, lead_id, created_at, updated_at)
        VALUES (
            'Administration',
            'System administration and management club',
            admin_user_id,
            NOW(),
            NOW()
        );
    END IF;
END $$;