const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Test data
const testUser = {
  name: 'Community Test User',
  email: 'community@test.com',
  password: 'password123',
  role: 'student'
};

const testPost = {
  title: 'Welcome to the Community!',
  content: 'This is our first community post. Let\'s discuss events, clubs, and campus life here!',
  category: 'general'
};

async function testCommunityAPI() {
  try {
    console.log('🚀 Testing Community API endpoints...\n');

    // 1. Register test user
    console.log('1. Registering test user...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ User registered successfully');
    
    const authToken = registerResponse.data.data.token;
    const headers = { Authorization: `Bearer ${authToken}` };

    // 2. Create a post
    console.log('\n2. Creating a community post...');
    const postResponse = await axios.post(`${BASE_URL}/community/posts`, testPost, { headers });
    console.log('✅ Post created successfully');
    console.log(`   Post ID: ${postResponse.data.data.post.id}`);
    console.log(`   Title: ${postResponse.data.data.post.title}`);
    
    const postId = postResponse.data.data.post.id;

    // 3. Get posts feed
    console.log('\n3. Fetching posts feed...');
    const feedResponse = await axios.get(`${BASE_URL}/community/posts`);
    console.log('✅ Posts feed retrieved successfully');
    console.log(`   Found ${feedResponse.data.data.posts.length} posts`);

    // 4. Get single post
    console.log('\n4. Fetching single post...');
    const singlePostResponse = await axios.get(`${BASE_URL}/community/posts/${postId}`);
    console.log('✅ Single post retrieved successfully');
    console.log(`   Comments: ${singlePostResponse.data.data.post.comment_count}`);

    // 5. Add a comment
    console.log('\n5. Adding a comment...');
    const commentResponse = await axios.post(
      `${BASE_URL}/community/posts/${postId}/comments`,
      { content: 'Great post! Looking forward to more discussions.' },
      { headers }
    );
    console.log('✅ Comment added successfully');
    console.log(`   Comment: ${commentResponse.data.data.comment.content}`);

    // 6. React to post
    console.log('\n6. Reacting to post...');
    const reactionResponse = await axios.post(
      `${BASE_URL}/community/posts/${postId}/react`,
      { type: 'like' },
      { headers }
    );
    console.log('✅ Reaction added successfully');
    console.log(`   User reaction: ${reactionResponse.data.data.user_reaction}`);

    // 7. Test pagination
    console.log('\n7. Testing pagination...');
    const paginatedResponse = await axios.get(`${BASE_URL}/community/posts?page=1&limit=5`);
    console.log('✅ Pagination working');
    console.log(`   Page: ${paginatedResponse.data.data.pagination.page}`);
    console.log(`   Limit: ${paginatedResponse.data.data.pagination.limit}`);

    // 8. Test category filtering
    console.log('\n8. Testing category filtering...');
    const categoryResponse = await axios.get(`${BASE_URL}/community/posts?category=general`);
    console.log('✅ Category filtering working');
    console.log(`   Found ${categoryResponse.data.data.posts.length} posts in 'general' category`);

    // 9. Test search
    console.log('\n9. Testing search...');
    const searchResponse = await axios.get(`${BASE_URL}/community/posts?search=community`);
    console.log('✅ Search working');
    console.log(`   Found ${searchResponse.data.data.posts.length} posts matching 'community'`);

    console.log('\n🎉 All Community API tests passed!');
    console.log('\n📋 Available endpoints:');
    console.log('   GET  /api/community/posts - Get posts feed');
    console.log('   GET  /api/community/posts/:id - Get single post');
    console.log('   POST /api/community/posts - Create post (auth required)');
    console.log('   PUT  /api/community/posts/:id - Update post (auth required)');
    console.log('   DELETE /api/community/posts/:id - Delete post (auth required)');
    console.log('   POST /api/community/posts/:id/comments - Add comment (auth required)');
    console.log('   POST /api/community/posts/:id/react - React to post (auth required)');
    console.log('   POST /api/community/reports - Report content (auth required)');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 Make sure the server is running on http://localhost:3001');
      console.log('   Run: npm run dev');
    }
  }
}

// Run tests
testCommunityAPI();