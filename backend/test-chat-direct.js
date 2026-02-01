const axios = require('axios');
require('dotenv').config();

const API_BASE = 'http://localhost:3002/api';

async function testChatDirect() {
  console.log('🧪 Testing Chat API directly...\n');

  try {
    // Step 1: Login to get a valid token
    console.log('1. Logging in to get auth token...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });

    const loginData = loginResponse.data;
    console.log('Login response:', loginData);

    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.message);
      return;
    }

    const token = loginData.data.session?.access_token || loginData.data.token;
    const user = loginData.data.user;
    
    if (!token) {
      console.error('❌ No token received from login');
      return;
    }

    console.log('✅ Login successful, user:', user.name, 'token length:', token.length);

    // Step 2: Test user search
    console.log('\n2. Testing user search...');
    const searchResponse = await axios.get(`${API_BASE}/chat/users/search?query=test`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const searchData = searchResponse.data;
    console.log('Search response:', JSON.stringify(searchData, null, 2));

    console.log('✅ User search successful, found', searchData.data.users.length, 'users');

    // Step 3: Test get conversations
    console.log('\n3. Testing get conversations...');
    const conversationsResponse = await axios.get(`${API_BASE}/chat/conversations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const conversationsData = conversationsResponse.data;
    console.log('Conversations response:', JSON.stringify(conversationsData, null, 2));

    console.log('✅ Get conversations successful, found', conversationsData.data.conversations.length, 'conversations');

    // Step 4: Test create conversation (if we have other users)
    if (searchData.data.users.length > 0) {
      const otherUser = searchData.data.users[0];
      console.log('\n4. Testing create conversation with user:', otherUser.name);
      
      const createConvResponse = await axios.get(`${API_BASE}/chat/conversations/with/${otherUser.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const createConvData = createConvResponse.data;
      console.log('Create conversation response:', JSON.stringify(createConvData, null, 2));

      console.log('✅ Create conversation successful');
      const conversationId = createConvData.data.conversation.id;

      // Step 5: Test send message
      console.log('\n5. Testing send message...');
      const sendMessageResponse = await axios.post(`${API_BASE}/chat/conversations/${conversationId}/messages`, {
        content: 'Hello! This is a test message from the direct API test.'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const sendMessageData = sendMessageResponse.data;
      console.log('Send message response:', JSON.stringify(sendMessageData, null, 2));

      console.log('✅ Send message successful');

      // Step 6: Test get messages
      console.log('\n6. Testing get messages...');
      const messagesResponse = await axios.get(`${API_BASE}/chat/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const messagesData = messagesResponse.data;
      console.log('Get messages response:', JSON.stringify(messagesData, null, 2));

      console.log('✅ Get messages successful, found', messagesData.data.messages.length, 'messages');
    }

    console.log('\n🎉 All chat API tests passed! The backend is working correctly.');
    console.log('\n💡 If mobile app still has issues, check:');
    console.log('1. Mobile app API URL configuration');
    console.log('2. Network connectivity from mobile to backend');
    console.log('3. Mobile app authentication token handling');
    console.log('4. Mobile app console logs for specific errors');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    console.log('\n💡 Common issues:');
    console.log('1. Backend server not running (npm start)');
    console.log('2. Wrong API URL or port');
    console.log('3. Network connectivity issues');
    console.log('4. Authentication problems');
  }
}

testChatDirect();