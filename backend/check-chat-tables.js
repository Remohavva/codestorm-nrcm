const { supabaseAdmin } = require('./src/utils/supabase');

async function checkChatTables() {
  console.log('🔍 Checking chat tables...\n');

  try {
    // Check if conversations table exists
    console.log('1. Checking conversations table...');
    const { data: conversations, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .limit(1);
    
    if (convError) {
      console.error('❌ Conversations table error:', convError.message);
      console.log('💡 You may need to create the chat tables. Run: node setup-chat-tables.js');
      return;
    } else {
      console.log('✅ Conversations table exists');
    }

    // Check if messages table exists
    console.log('2. Checking messages table...');
    const { data: messages, error: msgError } = await supabaseAdmin
      .from('messages')
      .select('*')
      .limit(1);
    
    if (msgError) {
      console.error('❌ Messages table error:', msgError.message);
      return;
    } else {
      console.log('✅ Messages table exists');
    }

    // Check if message_read_status table exists
    console.log('3. Checking message_read_status table...');
    const { data: readStatus, error: readError } = await supabaseAdmin
      .from('message_read_status')
      .select('*')
      .limit(1);
    
    if (readError) {
      console.error('❌ Message read status table error:', readError.message);
      return;
    } else {
      console.log('✅ Message read status table exists');
    }

    // Check if users table has the required users
    console.log('4. Checking users for testing...');
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, name, email')
      .limit(5);
    
    if (usersError) {
      console.error('❌ Users table error:', usersError.message);
      return;
    } else {
      console.log('✅ Users table accessible');
      console.log('Available users for testing:');
      users.forEach(user => {
        console.log(`  - ${user.name} (${user.email}) - ID: ${user.id}`);
      });
    }

    // Test basic chat functionality
    console.log('\n5. Testing basic chat operations...');
    
    if (users.length >= 2) {
      const user1 = users[0];
      const user2 = users[1];
      
      console.log(`Testing conversation between ${user1.name} and ${user2.name}...`);
      
      // Try to create a conversation
      const participant1 = user1.id < user2.id ? user1.id : user2.id;
      const participant2 = user1.id < user2.id ? user2.id : user1.id;
      
      const { data: testConv, error: testConvError } = await supabaseAdmin
        .from('conversations')
        .upsert([{
          participant1_id: participant1,
          participant2_id: participant2
        }])
        .select('*')
        .single();
      
      if (testConvError) {
        console.error('❌ Test conversation creation failed:', testConvError.message);
      } else {
        console.log('✅ Test conversation created/found:', testConv.id);
        
        // Try to create a test message
        const { data: testMsg, error: testMsgError } = await supabaseAdmin
          .from('messages')
          .insert([{
            conversation_id: testConv.id,
            sender_id: user1.id,
            content: 'Test message from chat verification script'
          }])
          .select('*')
          .single();
        
        if (testMsgError) {
          console.error('❌ Test message creation failed:', testMsgError.message);
        } else {
          console.log('✅ Test message created:', testMsg.id);
        }
      }
    }

    console.log('\n🎉 Chat tables verification complete!');
    console.log('\n💡 If you\'re still having issues:');
    console.log('1. Check that your mobile app is using the correct API URL');
    console.log('2. Verify authentication tokens are valid');
    console.log('3. Check network connectivity between mobile and backend');
    console.log('4. Look at the mobile app console logs for detailed errors');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.error('Full error:', error);
  }
}

checkChatTables();