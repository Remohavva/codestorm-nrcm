require('dotenv').config();
const { supabaseAdmin } = require('./src/utils/supabase');

async function setupCertificatesTable() {
  console.log('🏆 Setting up Certificates table manually...\n');

  try {
    // First, let's check if the table already exists
    const { data: existingTable, error: checkError } = await supabaseAdmin
      .from('certificates')
      .select('id')
      .limit(1);

    if (!checkError) {
      console.log('✅ Certificates table already exists!');
      return;
    }

    console.log('❌ Certificates table does not exist. Please create it manually in Supabase.');
    console.log('\n📋 SQL to run in Supabase SQL Editor:');
    console.log('=====================================\n');
    
    const sql = `
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

-- Add RLS policies
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own certificates
CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Authenticated users can insert certificates (for registration process)
CREATE POLICY "Authenticated users can create certificates" ON certificates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Users can update their own certificates
CREATE POLICY "Users can update own certificates" ON certificates
  FOR UPDATE USING (auth.uid() = user_id);
`;

    console.log(sql);
    console.log('\n=====================================');
    console.log('\n📝 Instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL above');
    console.log('4. Run the query');
    console.log('5. The certificates table will be created with proper indexes and RLS policies');

  } catch (error) {
    console.error('❌ Error checking certificates table:', error);
  }
}

// Run the setup
if (require.main === module) {
  setupCertificatesTable();
}

module.exports = { setupCertificatesTable };