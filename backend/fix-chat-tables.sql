-- Fix chat tables to ensure proper UUID generation

-- 1. Fix conversations table ID column
ALTER TABLE conversations ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2. Fix messages table ID column  
ALTER TABLE messages ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Fix message_read_status table ID column
ALTER TABLE message_read_status ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 4. Test insert to verify it works
-- This should now work without specifying an ID
-- INSERT INTO conversations (participant1_id, participant2_id) 
-- VALUES ('06fc3285-986e-46fa-bf52-95686f82de56', 'dc0640d1-35ec-4015-9428-aa8ac5ec1899');