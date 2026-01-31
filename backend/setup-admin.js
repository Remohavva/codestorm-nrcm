const { supabaseAdmin } = require('./src/utils/supabase');

async function setupAdmin() {
  try {
    console.log('🚀 Setting up admin user...');

    // Create admin user
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from('users')
      .upsert({
        name: 'System Administrator',
        email: 'admin@university.edu',
        role: 'admin'
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (adminError) {
      console.error('❌ Error creating admin user:', adminError);
      return;
    }

    console.log('✅ Admin user created successfully:');
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   ID: ${adminUser.id}`);

    // Create additional sample data for testing (optional)
    console.log('\n📊 Creating sample data for testing...');

    // Create sample club
    const { data: sampleClub, error: clubError } = await supabaseAdmin
      .from('clubs')
      .upsert({
        name: 'Administration Club',
        description: 'System administration and management',
        lead_id: adminUser.id
      }, {
        onConflict: 'name'
      })
      .select()
      .single();

    if (clubError) {
      console.log('⚠️  Could not create sample club:', clubError.message);
    } else {
      console.log('✅ Sample club created:', sampleClub.name);
    }

    // Create sample event
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const { data: sampleEvent, error: eventError } = await supabaseAdmin
      .from('events')
      .upsert({
        title: 'Admin Training Workshop',
        description: 'Learn how to use the admin dashboard effectively',
        date: futureDate.toISOString(),
        venue: 'Admin Conference Room',
        capacity: 50,
        club_id: sampleClub?.id,
        status: 'pending'
      })
      .select()
      .single();

    if (eventError) {
      console.log('⚠️  Could not create sample event:', eventError.message);
    } else {
      console.log('✅ Sample event created:', sampleEvent.title);
    }

    console.log('\n🎉 Admin setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your backend server: npm run dev');
    console.log('2. Start your frontend server: npm run dev (in frontend folder)');
    console.log('3. Login with: admin@university.edu / password123');
    console.log('4. Navigate to: http://localhost:5173/admin/dashboard');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run the setup
setupAdmin();