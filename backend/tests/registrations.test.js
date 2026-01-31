const request = require('supertest');
const app = require('../src/app');
const { cleanupDatabase, createTestUser, createTestClub, createTestEvent } = require('./setup');

describe('Registration Endpoints', () => {
  let studentUser, clubLeadUser, adminUser;
  let studentToken, clubLeadToken, adminToken;
  let testClub, testEvent;

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

    // Create test club and approved event
    testClub = await createTestClub({ name: 'Test Club' }, clubLeadUser.id);
    testEvent = await createTestEvent({ 
      title: 'Test Event',
      status: 'approved',
      capacity: 2
    }, testClub.id);
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  describe('POST /api/events/:id/register', () => {
    it('should register user for approved event', async () => {
      const response = await request(app)
        .post(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Successfully registered for event');
      expect(response.body.data.registration.user_id).toBe(studentUser.id);
      expect(response.body.data.registration.event_id).toBe(testEvent.id);
      expect(response.body.data.registration.status).toBe('registered');
    });

    it('should fail to register for non-existent event', async () => {
      const response = await request(app)
        .post('/api/events/00000000-0000-0000-0000-000000000000/register')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Event not found');
    });

    it('should fail to register for pending event', async () => {
      const pendingEvent = await createTestEvent({ 
        title: 'Pending Event',
        status: 'pending'
      }, testClub.id);

      const response = await request(app)
        .post(`/api/events/${pendingEvent.id}/register`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cannot register for unapproved events');
    });

    it('should fail to register twice for same event', async () => {
      // First registration
      await request(app)
        .post(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(201);

      // Second registration attempt
      const response = await request(app)
        .post(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Already registered for this event');
    });

    it('should fail to register when event is full', async () => {
      // Fill up the event (capacity is 2)
      await request(app)
        .post(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(201);

      await request(app)
        .post(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${clubLeadToken}`)
        .expect(201);

      // Try to register third user
      const response = await request(app)
        .post(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Event is full');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post(`/api/events/${testEvent.id}/register`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/events/:id/register', () => {
    beforeEach(async () => {
      // Register user for event first
      await request(app)
        .post(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${studentToken}`);
    });

    it('should cancel registration successfully', async () => {
      const response = await request(app)
        .delete(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Registration cancelled successfully');
      expect(response.body.data.registration.status).toBe('cancelled');
    });

    it('should fail to cancel non-existent registration', async () => {
      const response = await request(app)
        .delete(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${clubLeadToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Registration not found');
    });

    it('should fail to cancel already cancelled registration', async () => {
      // Cancel first time
      await request(app)
        .delete(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      // Try to cancel again
      const response = await request(app)
        .delete(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Registration already cancelled');
    });
  });

  describe('GET /api/users/me/registrations', () => {
    beforeEach(async () => {
      // Register user for event
      await request(app)
        .post(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${studentToken}`);
    });

    it('should get user registrations', async () => {
      const response = await request(app)
        .get('/api/users/me/registrations')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.registrations).toHaveLength(1);
      expect(response.body.data.registrations[0].user_id).toBe(studentUser.id);
      expect(response.body.data.registrations[0].event).toBeDefined();
    });

    it('should filter registrations by status', async () => {
      // Cancel the registration
      await request(app)
        .delete(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${studentToken}`);

      const response = await request(app)
        .get('/api/users/me/registrations?status=cancelled')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.registrations).toHaveLength(1);
      expect(response.body.data.registrations[0].status).toBe('cancelled');
    });

    it('should return empty array for user with no registrations', async () => {
      const response = await request(app)
        .get('/api/users/me/registrations')
        .set('Authorization', `Bearer ${clubLeadToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.registrations).toHaveLength(0);
    });
  });

  describe('GET /api/events/:id/registrations', () => {
    beforeEach(async () => {
      // Register multiple users for event
      await request(app)
        .post(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${studentToken}`);

      await request(app)
        .post(`/api/events/${testEvent.id}/register`)
        .set('Authorization', `Bearer ${adminToken}`);
    });

    it('should get event registrations as club lead', async () => {
      const response = await request(app)
        .get(`/api/events/${testEvent.id}/registrations`)
        .set('Authorization', `Bearer ${clubLeadToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.registrations).toHaveLength(2);
      expect(response.body.data.event.id).toBe(testEvent.id);
    });

    it('should get event registrations as admin', async () => {
      const response = await request(app)
        .get(`/api/events/${testEvent.id}/registrations`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.registrations).toHaveLength(2);
    });

    it('should fail to get registrations as non-owner', async () => {
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
        .get(`/api/events/${testEvent.id}/registrations`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You can only view registrations for your own events');
    });

    it('should fail as student', async () => {
      const response = await request(app)
        .get(`/api/events/${testEvent.id}/registrations`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});