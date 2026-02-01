-- Chat System Tables for College Events Platform

-- 1. Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  participant2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_message_id UUID,
  last_message_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(participant1_id, participant2_id)
);

-- Ensure participant1_id < participant2_id for consistency
CREATE OR REPLACE FUNCTION ensure_conversation_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.participant1_id > NEW.participant2_id THEN
    -- Swap the participants to maintain order
    NEW.participant1_id := OLD.participant2_id;
    NEW.participant2_id := OLD.participant1_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversation_order_trigger
  BEFORE INSERT OR UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION ensure_conversation_order();

CREATE INDEX idx_conversations_participant1 ON conversations(participant1_id);
CREATE INDEX idx_conversations_participant2 ON conversations(participant2_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- 2. Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'file'
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- 3. Message read status table
CREATE TABLE message_read_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

CREATE INDEX idx_message_read_status_message_id ON message_read_status(message_id);
CREATE INDEX idx_message_read_status_user_id ON message_read_status(user_id);

-- 4. Function to update conversation last message
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET 
    last_message_id = NEW.id,
    last_message_at = NEW.created_at,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- 5. Sample data for testing (optional)
-- Uncomment the lines below if you want to add test data

-- INSERT INTO conversations (participant1_id, participant2_id) 
-- VALUES (
--   'dc0640d1-35ec-4015-9428-aa8ac5ec1899', 
--   '06fc3285-986e-46fa-bf52-95686f82de56'
-- );

-- INSERT INTO messages (conversation_id, sender_id, content) 
-- VALUES 
--   ((SELECT id FROM conversations LIMIT 1), 'dc0640d1-35ec-4015-9428-aa8ac5ec1899', 'Hey! How are you doing?'),
--   ((SELECT id FROM conversations LIMIT 1), '06fc3285-986e-46fa-bf52-95686f82de56', 'Hi! I''m doing great, thanks for asking!'),
--   ((SELECT id FROM conversations LIMIT 1), 'dc0640d1-35ec-4015-9428-aa8ac5ec1899', 'That''s awesome! Are you coming to the photography club meeting?');