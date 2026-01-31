const request = require('supertest');
const app = require('../src/app');
const { cleanupDatabase, createTestUser, createTestClub, createTestEvent } = require('./setup');

describe('Event Endpoints', () => {
  let studentUser, clubLeadUser, adminUser;
  let studentToken, clubLeadToken, adminToken;
  let testClub;

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

    // Create test club
    testClub = await createTestClub({ name: 'Test Club' }, clubLeadUser.id);
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  describe('GET /api/events', () => {
    beforeEach(async () => {
      // Create test events
      await createTestEvent({ title: 'Event 1', status: 'approved' }, testClub.id);
      await createTestEvent({ title: 'Event 2', status: 'pending' }, testClub.id);
    });

    it('should get all events', async () => {
      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toHaveLength(2);
    });

    it('should filter events by status', async () => {
      const response = await request(app)
        .get('/api/events?status=approved')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toHaveLength(1);
      expect(response.body.data.events[0].status).toBe('approved');
    });

    it('should filter events by club', async () => {
      const response = await request(app)
        .get(`/api/events?club_id=${testClub.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.events).toHaveLength(2);
    });
  });

  describe('POST /api/events', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const eventData = {
      title: 'New Test Event',
      description: 'A test event',
      date: tomorrow.toISOString(),
      venue: 'Test Venue',
      capacity: 100,
      club_id: null // Will be set in tests
    };

    beforeEach(() => {
      eventData.club_id = testClub.id;
    });

    it('should create event as club lead', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${clubLeadToken}`)
        .send(eventData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Event created successfully');
      expect(response.body.data.event.title).toBe(eventData.title);
      expect(response.body.data.event.status).toBe('pending');
    });

    it('should create event as admin', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(eventData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.event.title).toBe(eventData.title);
    });

    it('should fail to create event as student', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(eventData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail with past date', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${clubLeadToken}`)
        .send({
          ...eventData,
          date: yesterday.toISOString()
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid capacity', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${clubLeadToken}`)
        .send({
          ...eventData,
          capacity: 0
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail when club lead tries to create event for another club', async () => {
      // Create another club with different lead
      const anotherClubLead = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another Lead',
          email: 'another@example.com',
          password: 'password123',
          role: 'club_lead'
        });

      const anotherClub = await createTestClub(
        { name: 'Another Club' }, 
        anotherClubLead.body.data.user.id
      );

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${clubLeadToken}`)
        .send({
          ...eventData,
          club_id: anotherClub.id
        })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You can only create events for your own clubs');
    });
  });

  describe('PUT /api/events/:id/approve', () => {
    let testEvent;

    beforeEach(async () => {
      testEvent = await createTestEvent({ title: 'Pending Event' }, testClub.id);
    });

    it('should approve event as admin', async () => {
      const response = await request(app)
        .put(`/api/events/${testEvent.id}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Event approved successfully');
      expect(response.body.data.event.status).toBe('approved');
    });

    it('should fail to approve as non-admin', async () => {
      const response = await request(app)
        .put(`/api/events/${testEvent.id}/approve`)
        .set('Authorization', `Bearer ${clubLeadToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should fail with non-existent event', async () => {
      const response = await request(app)
        .put('/api/events/00000000-0000-0000-0000-000000000000/approve')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/events/:id/reject', () => {
    let testEvent;

    beforeEach(async () => {
      testEvent = await createTestEvent({ title: 'Pending Event' }, testClub.id);
    });

    it('should reject event as admin', async () => {
      const response = await request(app)
        .put(`/api/events/${testEvent.id}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: 'Test rejection reason' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Event rejected successfully');
      expect(response.body.data.event.status).toBe('rejected');
    });

    it('should fail to reject as non-admin', async () => {
      const response = await request(app)
        .put(`/api/events/${testEvent.id}/reject`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/events/:id', () => {
    let testEvent;

    beforeEach(async () => {
      testEvent = await createTestEvent({ title: 'Test Event' }, testClub.id);
    });

    it('should get single event by id', async () => {
      const response = await request(app)
        .get(`/api/events/${testEvent.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.event.id).toBe(testEvent.id);
      expect(response.body.data.event.title).toBe('Test Event');
      expect(response.body.data.event.club).toBeDefined();
    });

    it('should return 404 for non-existent event', async () => {
      const response = await request(app)
        .get('/api/events/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});