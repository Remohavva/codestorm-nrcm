// Simple script to test Supabase connection
require('dotenv').config();
const { supabaseAdmin } = require('./src/utils/supabase');

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.log('\n📝 Make sure you have:');
      console.log('1. Created a Supabase project');
      console.log('2. Updated your .env file with correct credentials');
      console.log('3. Run the database schema from database/schema.sql');
      process.exit(1);
    }

    console.log('✅ Supabase connection successful!');
    console.log('📊 Database is ready for testing');
    
    // Test table existence
    const tables = ['users', 'clubs', 'events', 'registrations', 'attendance', 'notifications'];
    console.log('\n🔍 Checking tables...');
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabaseAdmin
          .from(table)
          .select('count')
          .limit(1);
        
        if (tableError) {
          console.log(`❌ Table '${table}' not found or accessible`);
        } else {
          console.log(`✅ Table '${table}' exists`);
        }
      } catch (err) {
        console.log(`❌ Table '${table}' error:`, err.message);
      }
    }
    
    console.log('\n🚀 Ready to run tests!');
    console.log('Run: npm test');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

testConnection();