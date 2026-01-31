// Database cleanup script
require('dotenv').config();
const { supabaseAdmin } = require('./src/utils/supabase');

async function cleanupDatabase() {
  try {
    console.log('🧹 Cleaning up database...');
    
    // Clean up in reverse order of dependencies
    await supabaseAdmin.from('attendance').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Cleaned attendance table');
    
    await supabaseAdmin.from('registrations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Cleaned registrations table');
    
    await supabaseAdmin.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Cleaned notifications table');
    
    await supabaseAdmin.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Cleaned events table');
    
    await supabaseAdmin.from('clubs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Cleaned clubs table');
    
    await supabaseAdmin.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Cleaned users table');
    
    console.log('🎉 Database cleanup completed!');
  } catch (error) {
    console.error('❌ Database cleanup error:', error);
  }
}

if (require.main === module) {
  cleanupDatabase();
}

module.exports = { cleanupDatabase };