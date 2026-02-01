require('dotenv').config();
const { supabaseAdmin } = require('./src/utils/supabase');

async function createTestCoordinator() {
  try {
    console.log('🧪 Creating Test Coordinator User and Club...\n');

    // 1. Create coordinator user
    console.log('1. Creating coordinator user...');
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .upsert([
        {
          name: 'John Coordinator',
          email: 'coordinator@university.edu',
          role: 'club_lead'
        }
      ], { onConflict: 'email' })
      .select()
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      return;
    }
    console.log('✅ Coordinator user created:', user.name, '(' + user.email + ')');

    // 2. Create a test club
    console.log('\n2. Creating test club...');
    
    // First check if club already exists
    const { data: existingClub, error: checkError } = await supabaseAdmin
      .from('clubs')
      .select('*')
      .eq('name', 'Tech Innovation Club')
      .single();

    let club;
    if (existingClub) {
      console.log('✅ Club already exists:', existingClub.name);
      club = existingClub;
    } else {
      const { data: newClub, error: clubError } = await supabaseAdmin
        .from('clubs')
        .insert([
          {
            name: 'Tech Innovation Club',
            description: 'A club for technology enthusiasts and innovators',
            lead_id: user.id
          }
        ])
        .select()
        .single();

      if (clubError) {
        console.error('Club creation error:', clubError);
        return;
      }
      console.log('✅ Club created:', newClub.name);
      club = newClub;
    }

    // 3. Create a sample event
    console.log('\n3. Creating sample event...');
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 7); // 7 days from now

    // Check if event already exists
    const { data: existingEvent, error: checkEventError } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('title', 'Tech Talk: AI in Modern Development')
      .single();

    let event;
    if (existingEvent) {
      console.log('✅ Event already exists:', existingEvent.title);
      event = existingEvent;
    } else {
      const { data: newEvent, error: eventError } = await supabaseAdmin
        .from('events')
        .insert([
          {
            title: 'Tech Talk: AI in Modern Development',
            description: 'Join us for an exciting discussion about AI tools and their impact on software development.',
            date: eventDate.toISOString(),
            venue: 'Main Auditorium',
            capacity: 100,
            club_id: club.id,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (eventError) {
        console.error('Event creation error:', eventError);
        return;
      }
      console.log('✅ Sample event created:', newEvent.title);
      event = newEvent;
    }

    console.log('\n🎉 Test coordinator setup completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Email: coordinator@university.edu');
    console.log('Password: password123');
    console.log('\n🚀 Next Steps:');
    console.log('1. Go to http://localhost:5174/login/coordinator');
    console.log('2. Login with the credentials above');
    console.log('3. You should be redirected to the coordinator dashboard');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

// Only run if called directly
if (require.main === module) {
  createTestCoordinator();
}

module.exports = { createTestCoordinator };