require('dotenv').config();
const { supabaseAdmin } = require('./src/utils/supabase');

async function debugChatTables() {
  console.log('🔍 Debugging chat tables...\n');

  try {
    // Test 1: Check if conversations table exists and is accessible
    console.log('1. Testing conversations table access...');
    const { data: conversations, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .limit(1);
    
    if (convError) {
      console.error('❌ Conversations table error:', convError);
      console.error('Error details:', JSON.stringify(convError, null, 2));
    } else {
      console.log('✅ Conversations table accessible');
      console.log('Sample data:', conversations);
    }

    // Test 2: Check if messages table exists and is accessible
    console.log('\n2. Testing messages table access...');
    const { data: messages, error: msgError } = await supabaseAdmin
      .from('messages')
      .select('*')
      .limit(1);
    
    if (msgError) {
      console.error('❌ Messages table error:', msgError);
      console.error('Error details:', JSON.stringify(msgError, null, 2));
    } else {
      console.log('✅ Messages table accessible');
      console.log('Sample data:', messages);
    }

    // Test 3: Check users table
    console.log('\n3. Testing users table access...');
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, name, email')
      .limit(3);
    
    if (usersError) {
      console.error('❌ Users table error:', usersError);
    } else {
      console.log('✅ Users table accessible');
      console.log('Available users:', users);
    }

    // Test 4: Try the specific query that's failing
    console.log('\n4. Testing the specific conversations query...');
    const testUserId = '06fc3285-986e-46fa-bf52-95686f82de56'; // Test user ID
    
    const { data: testConversations, error: testError } = await supabaseAdmin
      .from('conversations')
      .select(`
        id,
        participant1_id,
        participant2_id,
        last_message_at,
        created_at,
        last_message_id
      `)
      .or(`participant1_id.eq.${testUserId},participant2_id.eq.${testUserId}`)
      .order('last_message_at', { ascending: false });

    if (testError) {
      console.error('❌ Specific query error:', testError);
      console.error('Error details:', JSON.stringify(testError, null, 2));
    } else {
      console.log('✅ Specific query successful');
      console.log('Found conversations:', testConversations);
    }

    // Test 5: Create a test conversation if none exist
    if (!testError && testConversations.length === 0 && users.length >= 2) {
      console.log('\n5. Creating test conversation...');
      const user1 = users[0];
      const user2 = users[1];
      
      const participant1 = user1.id < user2.id ? user1.id : user2.id;
      const participant2 = user1.id < user2.id ? user2.id : user1.id;
      
      const { data: newConv, error: createError } = await supabaseAdmin
        .from('conversations')
        .insert([{
          participant1_id: participant1,
          participant2_id: participant2
        }])
        .select('*')
        .single();
      
      if (createError) {
        console.error('❌ Create conversation error:', createError);
      } else {
        console.log('✅ Test conversation created:', newConv);
      }
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('Full error:', error);
  }
}

debugChatTables();