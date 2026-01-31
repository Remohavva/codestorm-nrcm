const request = require('supertest');
const app = require('../src/app');
const { supabaseAdmin } = require('../src/utils/supabase');

describe('Community API', () => {
  let testUser, testPost, authToken;

  beforeAll(async () => {
    // Create test user
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'hashedpassword',
        role: 'student'
      }])
      .select()
      .single();

    if (userError) throw userError;
    testUser = userData;

    // Create auth token
    authToken = Buffer.from(`${testUser.id}:${Date.now()}`).toString('base64');
  });

  afterAll(async () => {
    // Cleanup
    if (testPost) {
      await supabaseAdmin.from('posts').delete().eq('id', testPost.id);
    }
    if (testUser) {
      await supabaseAdmin.from('users').delete().eq('id', testUser.id);
    }
  });

  describe('POST /api/community/posts', () => {
    it('should create a new post', async () => {
      const postData = {
        title: 'Test Post',
        content: 'This is a test post content',
        category: 'general'
      };

      const response = await request(app)
        .post('/api/community/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.post.title).toBe(postData.title);
      expect(response.body.data.post.content).toBe(postData.content);
      expect(response.body.data.post.author.id).toBe(testUser.id);

      testPost = response.body.data.post;
    });

    it('should require authentication', async () => {
      const postData = {
        title: 'Test Post',
        content: 'This is a test post content'
      };

      await request(app)
        .post('/api/community/posts')
        .send(postData)
        .expect(401);
    });

    it('should validate post data', async () => {
      const invalidData = {
        title: 'A', // Too short
        content: 'Short' // Too short
      };

      await request(app)
        .post('/api/community/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);
    });
  });

  describe('GET /api/community/posts', () => {
    it('should get posts feed', async () => {
      const response = await request(app)
        .get('/api/community/posts')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.posts)).toBe(true);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/community/posts?page=1&limit=5')
        .expect(200);

      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(5);
    });

    it('should support category filtering', async () => {
      const response = await request(app)
        .get('/api/community/posts?category=general')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/community/posts/:id', () => {
    it('should get single post with comments', async () => {
      if (!testPost) {
        // Create a test post first
        const postData = {
          title: 'Test Post for Get',
          content: 'This is a test post content for get endpoint',
          category: 'general'
        };

        const createResponse = await request(app)
          .post('/api/community/posts')
          .set('Authorization', `Bearer ${authToken}`)
          .send(postData);

        testPost = createResponse.body.data.post;
      }

      const response = await request(app)
        .get(`/api/community/posts/${testPost.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.post.id).toBe(testPost.id);
      expect(response.body.data.post.comments).toBeDefined();
    });

    it('should return 404 for non-existent post', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await request(app)
        .get(`/api/community/posts/${fakeId}`)
        .expect(404);
    });
  });

  describe('POST /api/community/posts/:id/comments', () => {
    it('should add comment to post', async () => {
      if (!testPost) return;

      const commentData = {
        content: 'This is a test comment'
      };

      const response = await request(app)
        .post(`/api/community/posts/${testPost.id}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.comment.content).toBe(commentData.content);
      expect(response.body.data.comment.author.id).toBe(testUser.id);
    });

    it('should require authentication for comments', async () => {
      if (!testPost) return;

      const commentData = {
        content: 'This is a test comment'
      };

      await request(app)
        .post(`/api/community/posts/${testPost.id}/comments`)
        .send(commentData)
        .expect(401);
    });
  });

  describe('POST /api/community/posts/:id/react', () => {
    it('should add reaction to post', async () => {
      if (!testPost) return;

      const reactionData = {
        type: 'like'
      };

      const response = await request(app)
        .post(`/api/community/posts/${testPost.id}/react`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(reactionData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user_reaction).toBe('like');
    });

    it('should toggle reaction when same type is sent', async () => {
      if (!testPost) return;

      // First reaction
      await request(app)
        .post(`/api/community/posts/${testPost.id}/react`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'like' });

      // Toggle (remove) reaction
      const response = await request(app)
        .post(`/api/community/posts/${testPost.id}/react`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'like' })
        .expect(200);

      expect(response.body.data.user_reaction).toBe(null);
    });
  });

  describe('POST /api/community/reports', () => {
    it('should create a report', async () => {
      if (!testPost) return;

      const reportData = {
        type: 'post',
        content_id: testPost.id,
        reason: 'spam',
        description: 'This post looks like spam'
      };

      const response = await request(app)
        .post('/api/community/reports')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reportData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.report.reason).toBe(reportData.reason);
    });

    it('should prevent duplicate reports', async () => {
      if (!testPost) return;

      const reportData = {
        type: 'post',
        content_id: testPost.id,
        reason: 'inappropriate'
      };

      // First report
      await request(app)
        .post('/api/community/reports')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reportData);

      // Duplicate report should fail
      await request(app)
        .post('/api/community/reports')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reportData)
        .expect(400);
    });
  });
});