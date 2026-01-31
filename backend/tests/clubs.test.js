const request = require('supertest');
const app = require('../src/app');
const { cleanupDatabase, createTestUser, createTestClub } = require('./setup');

describe('Club Endpoints', () => {
  let studentUser, clubLeadUser, adminUser;
  let studentToken, clubLeadToken, adminToken;

  beforeEach(async () => {
    await cleanupDatabase();

    // Create test users
    const studentRegister = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Student User',
        email: 'student@example.com',
        password: 'password123',
        role: 'student'
      });
    studentUser = studentRegister.body.data.user;

    const clubLeadRegister = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Club Lead User',
        email: 'clublead@example.com',
        password: 'password123',
        role: 'club_lead'
      });
    clubLeadUser = clubLeadRegister.body.data.user;

    const adminRegister = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });
    adminUser = adminRegister.body.data.user;

    // Get tokens
    const studentLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student@example.com', password: 'password123' });
    studentToken = studentLogin.body.data.session.access_token;

    const clubLeadLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'clublead@example.com', password: 'password123' });
    clubLeadToken = clubLeadLogin.body.data.session.access_token;

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminLogin.body.data.session.access_token;
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  describe('GET /api/clubs', () => {
    it('should get all clubs (public endpoint)', async () => {
      // Create a test club first
      await createTestClub({ name: 'Test Club' }, clubLeadUser.id);

      const response = await request(app)
        .get('/api/clubs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.clubs).toHaveLength(1);
      expect(response.body.data.clubs[0].name).toBe('Test Club');
    });

    it('should return empty array when no clubs exist', async () => {
      const response = await request(app)
        .get('/api/clubs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.clubs).toHaveLength(0);
    });
  });

  describe('POST /api/clubs', () => {
    const clubData = {
      name: 'New Test Club',
      description: 'A new test club for testing'
    };

    it('should create club as club lead', async () => {
      const response = await request(app)
        .post('/api/clubs')
        .set('Authorization', `Bearer ${clubLeadToken}`)
        .send(clubData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Club created successfully');
      expect(response.body.data.club.name).toBe(clubData.name);
      expect(response.body.data.club.description).toBe(clubData.description);
      expect(response.body.data.club.lead_id).toBe(clubLeadUser.id);
    });

    it('should create club as admin', async () => {
      const response = await request(app)
        .post('/api/clubs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(clubData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.club.lead_id).toBe(adminUser.id);
    });

    it('should fail to create club as student', async () => {
      const response = await request(app)
        .post('/api/clubs')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(clubData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Only club leads and admins can create clubs');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/clubs')
        .send(clubData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid data', async () => {
      const response = await request(app)
        .post('/api/clubs')
        .set('Authorization', `Bearer ${clubLeadToken}`)
        .send({ name: 'A' }) // Too short
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });
  });

  describe('GET /api/clubs/:id', () => {
    let testClub;

    beforeEach(async () => {
      testClub = await createTestClub({ name: 'Test Club' }, clubLeadUser.id);
    });

    it('should get single club by id', async () => {
      const response = await request(app)
        .get(`/api/clubs/${testClub.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.club.id).toBe(testClub.id);
      expect(response.body.data.club.name).toBe('Test Club');
      expect(response.body.data.club.lead).toBeDefined();
    });

    it('should return 404 for non-existent club', async () => {
      const response = await request(app)
        .get('/api/clubs/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Club not found');
    });
  });

  describe('PUT /api/clubs/:id', () => {
    let testClub;

    beforeEach(async () => {
      testClub = await createTestClub({ name: 'Test Club' }, clubLeadUser.id);
    });

    it('should update club as owner', async () => {
      const updateData = {
        name: 'Updated Club Name',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/clubs/${testClub.id}`)
        .set('Authorization', `Bearer ${clubLeadToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.club.name).toBe(updateData.name);
      expect(response.body.data.club.description).toBe(updateData.description);
    });

    it('should update club as admin', async () => {
      const updateData = {
        name: 'Admin Updated Club',
        description: 'Updated by admin'
      };

      const response = await request(app)
        .put(`/api/clubs/${testClub.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.club.name).toBe(updateData.name);
    });

    it('should fail to update as non-owner', async () => {
      // Create another club lead
      const anotherClubLead = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another Lead',
          email: 'another@example.com',
          password: 'password123',
          role: 'club_lead'
        });

      const anotherLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'another@example.com', password: 'password123' });
      
      const anotherToken = anotherLogin.body.data.session.access_token;

      const response = await request(app)
        .put(`/api/clubs/${testClub.id}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({ name: 'Unauthorized Update' })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You can only update your own clubs');
    });
  });
});