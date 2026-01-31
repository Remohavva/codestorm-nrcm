// Test setup and configuration
const { supabaseAdmin } = require('../src/utils/supabase');

// Test database cleanup helper
const cleanupDatabase = async () => {
  try {
    // Clean up in reverse order of dependencies
    await supabaseAdmin.from('attendance').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('registrations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('clubs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  } catch (error) {
    console.error('Database cleanup error:', error);
  }
};

// Test data helpers
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    role: 'student'
  };

  const user = { ...defaultUser, ...userData };
  
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert([user])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const createTestClub = async (clubData = {}, leadId) => {
  const defaultClub = {
    name: `Test Club ${Date.now()}`,
    description: 'A test club',
    lead_id: leadId
  };

  const club = { ...defaultClub, ...clubData };
  
  const { data, error } = await supabaseAdmin
    .from('clubs')
    .insert([club])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const createTestEvent = async (eventData = {}, clubId) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const defaultEvent = {
    title: `Test Event ${Date.now()}`,
    description: 'A test event',
    date: tomorrow.toISOString(),
    venue: 'Test Venue',
    capacity: 50,
    club_id: clubId,
    status: 'pending'
  };

  const event = { ...defaultEvent, ...eventData };
  
  const { data, error } = await supabaseAdmin
    .from('events')
    .insert([event])
    .select()
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  cleanupDatabase,
  createTestUser,
  createTestClub,
  createTestEvent
};