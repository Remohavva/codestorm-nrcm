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