require('dotenv').config();
const { supabaseAdmin } = require('./src/utils/supabase');

async function createAdminUser() {
  console.log('🔧 Creating admin user...\n');

  try {
    // Get existing users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role')
      .limit(5);

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }

    console.log('Available users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Promote the first user to admin if they're not already
    if (users.length > 0) {
      const userToPromote = users[0];
      
      if (userToPromote.role !== 'admin') {
        console.log(`\nPromoting ${userToPromote.name} to admin...`);
        
        const { data: updatedUser, error: updateError } = await supabaseAdmin
          .from('users')
          .update({ role: 'admin' })
          .eq('id', userToPromote.id)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Error updating user role:', updateError);
          return;
        }

        console.log('✅ User promoted to admin successfully!');
        console.log('Updated user:', updatedUser);
        
        console.log('\n📱 You can now login with these credentials:');
        console.log(`Email: ${updatedUser.email}`);
        console.log('Password: password123 (or your existing password)');
        console.log('\n🎯 The "Admin Dashboard" button will appear on the home screen for admin users.');
        
      } else {
        console.log(`\n✅ ${userToPromote.name} is already an admin!`);
        console.log('\n📱 Login credentials:');
        console.log(`Email: ${userToPromote.email}`);
        console.log('Password: password123 (or your existing password)');
      }
    } else {
      console.log('❌ No users found. Please register a user first.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminUser();