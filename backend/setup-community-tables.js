const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupCommunityTables() {
  console.log('🚀 Setting up Community & Discussion tables...');

  try {
    // Create posts table
    const { error: postsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS posts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          category VARCHAR(50) DEFAULT 'general',
          author_id UUID REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
        CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
        CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
        CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
      `
    });

    if (postsError) {
      console.error('Error creating posts table:', postsError);
    } else {
      console.log('✅ Posts table created successfully');
    }

    // Create comments table
    const { error: commentsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS comments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          content TEXT NOT NULL,
          post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
          author_id UUID REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
        CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
        CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
      `
    });

    if (commentsError) {
      console.error('Error creating comments table:', commentsError);
    } else {
      console.log('✅ Comments table created successfully');
    }

    // Create reactions table
    const { error: reactionsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS reactions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(20) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(post_id, user_id)
        );
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON reactions(post_id);
        CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);
      `
    });

    if (reactionsError) {
      console.error('Error creating reactions table:', reactionsError);
    } else {
      console.log('✅ Reactions table created successfully');
    }

    // Create reports table
    const { error: reportsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS reports (
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
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);
        CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
        CREATE INDEX IF NOT EXISTS idx_reports_content_type ON reports(content_type);
      `
    });

    if (reportsError) {
      console.error('Error creating reports table:', reportsError);
    } else {
      console.log('✅ Reports table created successfully');
    }

    // Insert some sample posts
    const { data: users } = await supabase
      .from('users')
      .select('id, name')
      .limit(1);

    if (users && users.length > 0) {
      const adminUser = users[0];
      
      const { error: insertError } = await supabase
        .from('posts')
        .insert([
          {
            title: 'Welcome to College Events Community!',
            content: 'This is where students can discuss events, clubs, and campus life. Share your thoughts and connect with fellow students!',
            category: 'announcements',
            author_id: adminUser.id
          },
          {
            title: 'Looking for study group partners',
            content: 'Anyone interested in forming a study group for Computer Science courses? We can meet at the library every Tuesday.',
            category: 'academic',
            author_id: adminUser.id
          },
          {
            title: 'Photography Club Meeting Tomorrow',
            content: 'Don\'t forget about our photography club meeting tomorrow at 3 PM in Room 205. We\'ll be discussing the upcoming photo exhibition!',
            category: 'clubs',
            author_id: adminUser.id
          }
        ]);

      if (insertError) {
        console.error('Error inserting sample posts:', insertError);
      } else {
        console.log('✅ Sample posts inserted successfully');
      }
    }

    console.log('🎉 Community tables setup completed!');

  } catch (error) {
    console.error('❌ Error setting up community tables:', error);
  }
}

// Run the setup
setupCommunityTables();