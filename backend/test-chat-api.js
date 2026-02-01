const fetch = require('node-fetch');
require('dotenv').config();

const API_BASE = 'http://localhost:3002/api';

// Test credentials - replace with actual user tokens
const TEST_TOKENS = {
  user1: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRjMDY0MGQxLTM1ZWMtNDAxNS05NDI4LWFhOGFjNWVjMTg5OSIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzM4NDI0NzI5LCJleHAiOjE3Mzg1MTExMjl9.example', // Replace with actual token
  user2: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA2ZmMzMjg1LTk4NmUtNDZmYS1iZjUyLTk1Njg2ZjgyZGU1NiIsImVtYWlsIjoidXNlcjJAZXhhbXBsZS5jb20iLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTczODQyNDcyOSwiZXhwIjoxNzM4NTExMTI5fQ.example' // Replace with actual token
};

async function testChatAPI() {
  console.log('🧪 Testing Chat API...\n');

  try {
    // Test 1: Search for users
    console.log('1. Testing user search...');
    const searchResponse = await fetch(`${API_BASE}/chat/users/search?query=test`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKENS.user1}`,
        'Content-Type': 'application/json'
      }
    });
    
    const searchData = await searchResponse.json();
    console.log('Search Response:', JSON.stringify(searchData, null, 2));
    
    if (!searchResponse.ok) {
      console.error('❌ User search failed:', searchData.message);
      return;
    }
    
    // Test 2: Get conversations
    console.log('\n2. Testing get conversations...');
    const conversationsResponse = await fetch(`${API_BASE}/chat/conversations`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKENS.user1}`,
        'Content-Type': 'application/json'
      }
    });
    
    const conversationsData = await conversationsResponse.json();
    console.log('Conversations Response:', JSON.stringify(conversationsData, null, 2));
    
    if (!conversationsResponse.ok) {
      console.error('❌ Get conversations failed:', conversationsData.message);
      return;
    }
    
    // Test 3: Create/get conversation with another user
    console.log('\n3. Testing create conversation...');
    const createConvResponse = await fetch(`${API_BASE}/chat/conversations/with/06fc3285-986e-46fa-bf52-95686f82de56`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKENS.user1}`,
        'Content-Type': 'application/json'
      }
    });
    
    const createConvData = await createConvResponse.json();
    console.log('Create Conversation Response:', JSON.stringify(createConvData, null, 2));
    
    if (!createConvResponse.ok) {
      console.error('❌ Create conversation failed:', createConvData.message);
      return;
    }
    
    const conversationId = createConvData.data.conversation.id;
    
    // Test 4: Send a message
    console.log('\n4. Testing send message...');
    const sendMessageResponse = await fetch(`${API_BASE}/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TEST_TOKENS.user1}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: 'Hello! This is a test message from the API test.'
      })
    });
    
    const sendMessageData = await sendMessageResponse.json();
    console.log('Send Message Response:', JSON.stringify(sendMessageData, null, 2));
    
    if (!sendMessageResponse.ok) {
      console.error('❌ Send message failed:', sendMessageData.message);
      return;
    }
    
    // Test 5: Get messages
    console.log('\n5. Testing get messages...');
    const messagesResponse = await fetch(`${API_BASE}/chat/conversations/${conversationId}/messages`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKENS.user1}`,
        'Content-Type': 'application/json'
      }
    });
    
    const messagesData = await messagesResponse.json();
    console.log('Messages Response:', JSON.stringify(messagesData, null, 2));
    
    if (!messagesResponse.ok) {
      console.error('❌ Get messages failed:', messagesData.message);
      return;
    }
    
    console.log('\n✅ All chat API tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

// Test basic connectivity first
async function testConnectivity() {
  console.log('🔗 Testing basic connectivity...\n');
  
  try {
    const response = await fetch(`${API_BASE.replace('/api', '')}/health`);
    const data = await response.json();
    console.log('Health check:', data);
    
    if (response.ok) {
      console.log('✅ Server is running\n');
      await testChatAPI();
    } else {
      console.error('❌ Server health check failed');
    }
  } catch (error) {
    console.error('❌ Cannot connect to server:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. Backend server is running (npm start)');
    console.log('2. Server is accessible on localhost:3002');
    console.log('3. No firewall blocking the connection');
  }
}

testConnectivity();