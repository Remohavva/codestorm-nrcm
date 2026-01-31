const { supabaseAdmin } = require('../utils/supabase');

// Create new post
const createPost = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    const userId = req.user.id;

    // Create post
    const { data: postData, error: postError } = await supabaseAdmin
      .from('posts')
      .insert([{
        title,
        content,
        category,
        author_id: userId,
        status: 'active'
      }])
      .select(`
        *,
        author:users!author_id(id, name, role),
        _count:comments(count)
      `)
      .single();

    if (postError) {
      throw postError;
    }

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        post: {
          ...postData,
          comment_count: 0,
          reaction_count: 0,
          user_reaction: null
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get posts feed with pagination
const getPosts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search, 
      sort = 'created_at' 
    } = req.query;
    
    const offset = (page - 1) * limit;
    const userId = req.user?.id;

    let query = supabaseAdmin
      .from('posts')
      .select(`
        *,
        author:users!author_id(id, name, role),
        comments(count),
        reactions(count)
      `)
      .eq('status', 'active');

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Apply sorting
    const sortOrder = sort === 'popular' ? false : true; // popular = desc, others = asc
    const sortField = sort === 'popular' ? 'created_at' : sort;
    query = query.order(sortField, { ascending: sortOrder });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: posts, error } = await query;

    if (error) {
      throw error;
    }

    // Get user reactions if authenticated
    let userReactions = {};
    if (userId && posts.length > 0) {
      const postIds = posts.map(p => p.id);
      const { data: reactions } = await supabaseAdmin
        .from('reactions')
        .select('post_id, type')
        .eq('user_id', userId)
        .in('post_id', postIds);
      
      userReactions = reactions?.reduce((acc, r) => {
        acc[r.post_id] = r.type;
        return acc;
      }, {}) || {};
    }

    // Format posts with counts and user reactions
    const formattedPosts = posts.map(post => ({
      ...post,
      comment_count: post.comments.length,
      reaction_count: post.reactions.length,
      user_reaction: userReactions[post.id] || null
    }));

    res.json({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          hasMore: posts.length === parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single post with comments
const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Get post
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        author:users!author_id(id, name, role),
        comments(
          *,
          author:users!author_id(id, name, role)
        ),
        reactions(count)
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (postError) {
      if (postError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      throw postError;
    }

    // Get user reaction if authenticated
    let userReaction = null;
    if (userId) {
      const { data: reaction } = await supabaseAdmin
        .from('reactions')
        .select('type')
        .eq('post_id', id)
        .eq('user_id', userId)
        .single();
      
      userReaction = reaction?.type || null;
    }

    res.json({
      success: true,
      data: {
        post: {
          ...post,
          comment_count: post.comments.length,
          reaction_count: post.reactions.length,
          user_reaction: userReaction
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
// Add comment to post
const addComment = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Check if post exists
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('id')
      .eq('id', postId)
      .eq('status', 'active')
      .single();

    if (postError || !post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Create comment
    const { data: commentData, error: commentError } = await supabaseAdmin
      .from('comments')
      .insert([{
        content,
        post_id: postId,
        author_id: userId
      }])
      .select(`
        *,
        author:users!author_id(id, name, role)
      `)
      .single();

    if (commentError) {
      throw commentError;
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: commentData
      }
    });
  } catch (error) {
    next(error);
  }
};

// React to post (like/dislike)
const reactToPost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const { type } = req.body; // 'like' or 'dislike'
    const userId = req.user.id;

    // Check if post exists
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('id')
      .eq('id', postId)
      .eq('status', 'active')
      .single();

    if (postError || !post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user already reacted
    const { data: existingReaction, error: reactionError } = await supabaseAdmin
      .from('reactions')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (reactionError && reactionError.code !== 'PGRST116') {
      throw reactionError;
    }

    let result;
    if (existingReaction) {
      if (existingReaction.type === type) {
        // Remove reaction if same type
        const { error: deleteError } = await supabaseAdmin
          .from('reactions')
          .delete()
          .eq('id', existingReaction.id);

        if (deleteError) throw deleteError;

        result = { action: 'removed', type: null };
      } else {
        // Update reaction type
        const { error: updateError } = await supabaseAdmin
          .from('reactions')
          .update({ type })
          .eq('id', existingReaction.id);

        if (updateError) throw updateError;

        result = { action: 'updated', type };
      }
    } else {
      // Create new reaction
      const { error: insertError } = await supabaseAdmin
        .from('reactions')
        .insert([{
          post_id: postId,
          user_id: userId,
          type
        }]);

      if (insertError) throw insertError;

      result = { action: 'added', type };
    }

    // Get updated reaction count
    const { data: reactions, error: countError } = await supabaseAdmin
      .from('reactions')
      .select('count')
      .eq('post_id', postId);

    if (countError) throw countError;

    res.json({
      success: true,
      message: `Reaction ${result.action} successfully`,
      data: {
        user_reaction: result.type,
        reaction_count: reactions.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Report post or comment
const reportContent = async (req, res, next) => {
  try {
    const { type, content_id, reason, description } = req.body;
    const userId = req.user.id;

    // Validate content exists
    let contentExists = false;
    if (type === 'post') {
      const { data: post } = await supabaseAdmin
        .from('posts')
        .select('id')
        .eq('id', content_id)
        .single();
      contentExists = !!post;
    } else if (type === 'comment') {
      const { data: comment } = await supabaseAdmin
        .from('comments')
        .select('id')
        .eq('id', content_id)
        .single();
      contentExists = !!comment;
    }

    if (!contentExists) {
      return res.status(404).json({
        success: false,
        message: `${type} not found`
      });
    }

    // Check if user already reported this content
    const { data: existingReport } = await supabaseAdmin
      .from('reports')
      .select('id')
      .eq('reporter_id', userId)
      .eq('content_type', type)
      .eq('content_id', content_id)
      .single();

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this content'
      });
    }

    // Create report
    const { data: reportData, error: reportError } = await supabaseAdmin
      .from('reports')
      .insert([{
        reporter_id: userId,
        content_type: type,
        content_id,
        reason,
        description,
        status: 'pending'
      }])
      .select()
      .single();

    if (reportError) {
      throw reportError;
    }

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: {
        report: reportData
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update post (author only)
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const userId = req.user.id;

    // Get post to check ownership
    const { data: post, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      throw fetchError;
    }

    // Check permissions (author or admin)
    if (post.author_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own posts'
      });
    }

    // Update post
    const { data: updatedPost, error: updateError } = await supabaseAdmin
      .from('posts')
      .update({ title, content, category, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        author:users!author_id(id, name, role)
      `)
      .single();

    if (updateError) {
      throw updateError;
    }

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: {
        post: updatedPost
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete post (author or admin only)
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get post to check ownership
    const { data: post, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      throw fetchError;
    }

    // Check permissions (author or admin)
    if (post.author_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      });
    }

    // Soft delete by updating status
    const { error: deleteError } = await supabaseAdmin
      .from('posts')
      .update({ status: 'deleted' })
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  addComment,
  reactToPost,
  reportContent,
  updatePost,
  deletePost
};