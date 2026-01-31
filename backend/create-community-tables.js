const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createCommunityTables() {
  console.log('🚀 Creating Community tables...');
  
  try {
    // First, let's check if posts table exists by trying to select from it
    const { data: existingPosts, error: checkError } = await supabase
      .from('posts')
      .select('id')
      .limit(1);

    if (checkError) {
      console.log('❌ Posts table does not exist. Please create it manually in Supabase dashboard.');
      console.log('Error:', checkError.message);
      console.log('📋 SQL to create posts table:');
      console.log(`
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
      `);
      
      console.log('📋 SQL to create comments table:');
      console.log(`
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
      `);
      
      console.log('📋 SQL to create reactions table:');
      console.log(`
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_reactions_post_id ON reactions(post_id);
CREATE INDEX idx_reactions_user_id ON reactions(user_id);
      `);
      
      console.log('📋 SQL to create reports table:');
      console.log(`
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_type VARCHAR(20) NOT NULL,
  content_id UUID NOT NULL,
  reason VARCHAR(50) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_content_type ON reports(content_type);
      `);
      
      console.log('\n🔗 Go to: https://bkandjvgfaavecpyugqi.supabase.co/project/bkandjvgfaavecpyugqi/sql');
      console.log('📝 Copy and paste the SQL above to create the tables.');
      
      return;
    }

    if (existingPosts) {
      console.log('✅ Posts table already exists');
      
      // Check if we have any posts
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*');

      if (postsError) {
        console.error('Error fetching posts:', postsError);
        return;
      }

      if (posts.length === 0) {
        console.log('📝 Adding sample posts...');
        
        // Get an admin user
        const { data: adminUser } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'admin')
          .limit(1);

        const authorId = adminUser && adminUser.length > 0 
          ? adminUser[0].id 
          : 'dc0640d1-35ec-4015-9428-aa8ac5ec1899'; // fallback to first user

        const samplePosts = [
          {
            title: 'Welcome to College Events Community!',
            content: 'This is where students can discuss events, clubs, and campus life. Share your thoughts and connect with fellow students!',
            category: 'announcements',
            author_id: authorId
          },
          {
            title: 'Looking for study group partners',
            content: 'Anyone interested in forming a study group for Computer Science courses? We can meet at the library every Tuesday.',
            category: 'academic',
            author_id: authorId
          },
          {
            title: 'Photography Club Meeting Tomorrow',
            content: 'Don\'t forget about our photography club meeting tomorrow at 3 PM in Room 205. We\'ll be discussing the upcoming photo exhibition!',
            category: 'clubs',
            author_id: authorId
          }
        ];

        const { error: insertError } = await supabase
          .from('posts')
          .insert(samplePosts);

        if (insertError) {
          console.error('Error inserting sample posts:', insertError);
        } else {
          console.log('✅ Sample posts added successfully');
        }
      } else {
        console.log(`✅ Found ${posts.length} existing posts`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createCommunityTables();