require('dotenv').config();
const { supabaseAdmin } = require('./src/utils/supabase');

async function setupCertificatesTable() {
  console.log('🏆 Setting up Certificates table...\n');

  try {
    // Create certificates table
    const { error: tableError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Create certificates table
        CREATE TABLE IF NOT EXISTS certificates (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
          event_id UUID REFERENCES events(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          issued_at TIMESTAMP DEFAULT NOW(),
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_certificates_registration_id ON certificates(registration_id);
        CREATE INDEX IF NOT EXISTS idx_certificates_event_id ON certificates(event_id);
        CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
        CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);
        CREATE INDEX IF NOT EXISTS idx_certificates_issued_at ON certificates(issued_at DESC);

        -- Create unique constraint to prevent duplicate certificates
        CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_unique_registration 
        ON certificates(registration_id) WHERE status = 'active';
      `
    });

    if (tableError) {
      console.error('❌ Error creating certificates table:', tableError);
      return;
    }

    console.log('✅ Certificates table created successfully');

    // Test the table by checking its structure
    const { data: tableInfo, error: infoError } = await supabaseAdmin
      .from('certificates')
      .select('*')
      .limit(1);

    if (infoError && infoError.code !== 'PGRST116') {
      console.error('❌ Error testing certificates table:', infoError);
      return;
    }

    console.log('✅ Certificates table is ready for use');
    console.log('\n🎉 Certificate system setup completed!');
    console.log('\n📋 Features available:');
    console.log('• Automatic certificate generation on event registration');
    console.log('• QR code verification system');
    console.log('• Professional certificate design');
    console.log('• Certificate download and sharing');
    console.log('• Verification API endpoint');

  } catch (error) {
    console.error('❌ Error setting up certificates table:', error);
  }
}

// Run the setup
if (require.main === module) {
  setupCertificatesTable();
}

module.exports = { setupCertificatesTable };