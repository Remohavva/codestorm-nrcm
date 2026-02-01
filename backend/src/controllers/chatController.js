const { supabaseAdmin } = require('../utils/supabase');

// Get user's conversations
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log('Getting conversations for user:', userId);

    // Simple query first - just get conversations
    const { data: conversations, error } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch conversations',
        error: error.message
      });
    }

    console.log('Found conversations:', conversations.length);

    // For now, return simple format without complex joins
    const formattedConversations = conversations.map(conv => {
      const otherParticipantId = conv.participant1_id === userId 
        ? conv.participant2_id 
        : conv.participant1_id;
      
      return {
        id: conv.id,
        participant: { id: otherParticipantId, name: 'Loading...', email: '' },
        last_message: null,
        last_message_at: conv.last_message_at,
        created_at: conv.created_at
      };
    });

    res.json({
      success: true,
      data: {
        conversations: formattedConversations
      }
    });
  } catch (error) {
    console.error('getConversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
};

// Get or create conversation between two users
const getOrCreateConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    if (userId === otherUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create conversation with yourself'
      });
    }

    // Ensure consistent ordering for unique constraint
    const participant1 = userId < otherUserId ? userId : otherUserId;
    const participant2 = userId < otherUserId ? otherUserId : userId;

    // Try to find existing conversation
    let { data: conversation, error: findError } = await supabaseAdmin
      .from('conversations')
      .select(`
        id,
        participant1_id,
        participant2_id,
        created_at,
        participant1:participant1_id(id, name, email),
        participant2:participant2_id(id, name, email)
      `)
      .eq('participant1_id', participant1)
      .eq('participant2_id', participant2)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      throw findError;
    }

    // Create conversation if it doesn't exist
    if (!conversation) {
      const { data: newConversation, error: createError } = await supabaseAdmin
        .from('conversations')
        .insert([{
          participant1_id: participant1,
          participant2_id: participant2
        }])
        .select(`
          id,
          participant1_id,
          participant2_id,
          created_at,
          participant1:participant1_id(id, name, email),
          participant2:participant2_id(id, name, email)
        `)
        .single();

      if (createError) {
        throw createError;
      }

      conversation = newConversation;
    }

    // Format response to show the other participant
    const otherParticipant = conversation.participant1_id === userId 
      ? conversation.participant2 
      : conversation.participant1;

    res.json({
      success: true,
      data: {
        conversation: {
          id: conversation.id,
          participant: otherParticipant,
          created_at: conversation.created_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get messages in a conversation
const getMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // Verify user is part of this conversation
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('id, participant1_id, participant2_id')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (conversation.participant1_id !== userId && conversation.participant2_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get messages
    const { data: messages, error: messagesError } = await supabaseAdmin
      .from('messages')
      .select(`
        id,
        content,
        message_type,
        is_read,
        created_at,
        sender:sender_id(id, name, email)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (messagesError) {
      throw messagesError;
    }

    // Mark messages as read for the current user
    const unreadMessageIds = messages
      .filter(msg => msg.sender.id !== userId && !msg.is_read)
      .map(msg => msg.id);

    if (unreadMessageIds.length > 0) {
      await supabaseAdmin
        .from('message_read_status')
        .upsert(
          unreadMessageIds.map(messageId => ({
            message_id: messageId,
            user_id: userId
          }))
        );

      // Update is_read status
      await supabaseAdmin
        .from('messages')
        .update({ is_read: true })
        .in('id', unreadMessageIds);
    }

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Return in chronological order
        pagination: {
          page,
          limit,
          hasMore: messages.length === limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Send a message
const sendMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { content, message_type = 'text' } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Verify user is part of this conversation
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('id, participant1_id, participant2_id')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (conversation.participant1_id !== userId && conversation.participant2_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create message
    const { data: message, error: messageError } = await supabaseAdmin
      .from('messages')
      .insert([{
        conversation_id: conversationId,
        sender_id: userId,
        content: content.trim(),
        message_type
      }])
      .select(`
        id,
        content,
        message_type,
        is_read,
        created_at,
        sender:sender_id(id, name, email)
      `)
      .single();

    if (messageError) {
      throw messageError;
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get unread message count
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data: unreadMessages, error } = await supabaseAdmin
      .from('messages')
      .select('id, conversation_id')
      .neq('sender_id', userId)
      .eq('is_read', false)
      .in('conversation_id', 
        supabaseAdmin
          .from('conversations')
          .select('id')
          .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      );

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: {
        unread_count: unreadMessages.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Search users to start new conversations
const searchUsers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role')
      .neq('id', userId)
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(20);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: {
        users
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  getUnreadCount,
  searchUsers
};