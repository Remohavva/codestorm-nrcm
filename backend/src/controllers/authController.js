const { supabase, supabaseAdmin } = require('../utils/supabase');

// Register new user
const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    // For development/testing, we'll create users directly in our database
    // and use a simple auth approach. In production, you'd use proper Supabase Auth
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user record directly in our users table for testing
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        name,
        email,
        role
      }])
      .select()
      .single();

    if (userError) {
      throw userError;
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // For development/testing, we'll use simple email/password check
    // In production, you'd use proper Supabase Auth
    
    // Get user from our database
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // For testing, we'll accept "password123" as the valid password
    // In production, you'd verify the hashed password properly
    if (password !== 'password123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Create a simple session token (in production, use proper JWT)
    const sessionToken = Buffer.from(`${userData.id}:${Date.now()}`).toString('base64');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        },
        session: {
          access_token: sessionToken,
          refresh_token: 'test_refresh_token',
          expires_at: Date.now() + 3600000 // 1 hour
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
const logout = async (req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile
};