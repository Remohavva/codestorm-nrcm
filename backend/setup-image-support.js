const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupImageSupport() {
  console.log('🚀 Setting up Image support for posts...');
  
  try {
    console.log('📋 SQL to add image support to posts table:');
    
    console.log(`
-- Add image support columns to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_caption TEXT,
ADD COLUMN IF NOT EXISTS post_type VARCHAR(20) DEFAULT 'text';

-- Update existing posts to have post_type 'text'
UPDATE posts SET post_type = 'text' WHERE post_type IS NULL;

-- Create index for post_type
CREATE INDEX IF NOT EXISTS idx_posts_post_type ON posts(post_type);

-- Add comments for documentation
COMMENT ON COLUMN posts.image_url IS 'URL of uploaded image (for image posts)';
COMMENT ON COLUMN posts.image_caption IS 'Caption for image posts';
COMMENT ON COLUMN posts.post_type IS 'Type of post: text, image, or mixed';
    `);
    
    console.log('\n🔗 Go to: https://bkandjvgfaavecpyugqi.supabase.co/project/bkandjvgfaavecpyugqi/sql');
    console.log('📝 Copy and paste the SQL above to add image support to posts.');
    
    console.log('\n✅ Image support SQL generated successfully!');
    
    console.log('\n📋 Post types supported:');
    console.log('- text: Regular text posts');
    console.log('- image: Posts with images');
    console.log('- mixed: Posts with both text and images');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setupImageSupport();