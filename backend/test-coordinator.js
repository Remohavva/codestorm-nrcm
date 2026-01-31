const { supabaseAdmin } = require('./src/utils/supabase');

async function testCoordinatorSetup() {
  try {
    console.log('🧪 Testing Coordinator Setup...\n');

    // 1. Create a test club lead user
    console.log('1. Creating test club lead user...');
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

    if (userError) throw userError;
    console.log('✅ User created:', user.name, '(' + user.email + ')');

    // 2. Create a test club
    console.log('\n2. Creating test club...');
    const { data: club, error: clubError } = await supabaseAdmin
      .from('clubs')
      .upsert([
        {
          name: 'Tech Innovation Club',
          description: 'A club for technology enthusiasts and innovators',
          lead_id: user.id
        }
      ], { onConflict: 'name' })
      .select()
      .single();

    if (clubError) throw clubError;
    console.log('✅ Club created:', club.name);

    // 3. Create a test event
    console.log('\n3. Creating test event...');
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 7); // 7 days from now

    const { data: event, error: eventError } = await supabaseAdmin
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

    if (eventError) throw eventError;
    console.log('✅ Event created:', event.title);

    // 4. Test coordinator API endpoints
    console.log('\n4. Testing coordinator endpoints...');
    
    // Simulate API calls by querying directly
    const { data: dashboardData, error: dashError } = await supabaseAdmin
      .from('clubs')
      .select(`
        *,
        events(
          id,
          title,
          status,
          date,
          registrations(count)
        )
      `)
      .eq('lead_id', user.id);

    if (dashError) throw dashError;
    console.log('✅ Dashboard data retrieved for', dashboardData.length, 'clubs');

    // 5. Summary
    console.log('\n📊 Test Summary:');
    console.log('- User ID:', user.id);
    console.log('- Club ID:', club.id);
    console.log('- Event ID:', event.id);
    console.log('- Event Status:', event.status);
    console.log('- Event Date:', new Date(event.date).toLocaleDateString());

    console.log('\n🎉 Coordinator setup test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Start the backend: npm run dev');
    console.log('2. Start the frontend: npm run dev');
    console.log('3. Login with: coordinator@university.edu / password123');
    console.log('4. Navigate to /coordinator/dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

testCoordinatorSetup();