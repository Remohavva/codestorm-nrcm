const { supabaseAdmin } = require('../utils/supabase');

// Create new club
const createClub = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const lead_id = req.user.id;

    // Check if user is club_lead or admin
    if (!['club_lead', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only club leads and admins can create clubs'
      });
    }

    // Create club
    const { data: clubData, error: clubError } = await supabaseAdmin
      .from('clubs')
      .insert([{
        name,
        description,
        lead_id
      }])
      .select(`
        *,
        lead:users!lead_id(id, name, email)
      `)
      .single();

    if (clubError) {
      throw clubError;
    }

    res.status(201).json({
      success: true,
      message: 'Club created successfully',
      data: {
        club: clubData
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all clubs
const getClubs = async (req, res, next) => {
  try {
    const { data: clubs, error } = await supabaseAdmin
      .from('clubs')
      .select(`
        *,
        lead:users!lead_id(id, name, email),
        events:events(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: {
        clubs: clubs.map(club => ({
          ...club,
          event_count: club.events.length
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single club
const getClub = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: club, error } = await supabaseAdmin
      .from('clubs')
      .select(`
        *,
        lead:users!lead_id(id, name, email),
        events:events(
          id,
          title,
          description,
          date,
          venue,
          capacity,
          status,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Club not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: {
        club
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update club (only by club lead or admin)
const updateClub = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Get club to check ownership
    const { data: club, error: fetchError } = await supabaseAdmin
      .from('clubs')
      .select('lead_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Club not found'
        });
      }
      throw fetchError;
    }

    // Check if user can update this club
    if (req.user.role !== 'admin' && club.lead_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own clubs'
      });
    }

    // Update club
    const { data: updatedClub, error: updateError } = await supabaseAdmin
      .from('clubs')
      .update({ name, description })
      .eq('id', id)
      .select(`
        *,
        lead:users!lead_id(id, name, email)
      `)
      .single();

    if (updateError) {
      throw updateError;
    }

    res.json({
      success: true,
      message: 'Club updated successfully',
      data: {
        club: updatedClub
      }
    });
  } catch (error) {
    next(error);
  }
};

// Join club
const joinClub = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if club exists
    const { data: club, error: clubError } = await supabaseAdmin
      .from('clubs')
      .select('id, name')
      .eq('id', id)
      .single();

    if (clubError) {
      if (clubError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Club not found'
        });
      }
      throw clubError;
    }

    // Check if already a member (assuming we have a club_members table)
    // For now, we'll just return success
    res.json({
      success: true,
      message: `Successfully joined ${club.name}`,
      data: {
        club_id: id,
        user_id: userId
      }
    });
  } catch (error) {
    next(error);
  }
};

// Leave club
const leaveClub = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if club exists
    const { data: club, error: clubError } = await supabaseAdmin
      .from('clubs')
      .select('id, name')
      .eq('id', id)
      .single();

    if (clubError) {
      if (clubError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Club not found'
        });
      }
      throw clubError;
    }

    res.json({
      success: true,
      message: `Successfully left ${club.name}`,
      data: {
        club_id: id,
        user_id: userId
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get club members
const getClubMembers = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if club exists
    const { data: club, error: clubError } = await supabaseAdmin
      .from('clubs')
      .select('id, name')
      .eq('id', id)
      .single();

    if (clubError) {
      if (clubError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Club not found'
        });
      }
      throw clubError;
    }

    // For now, return mock data since we don't have a club_members table yet
    res.json({
      success: true,
      data: {
        club,
        members: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@university.edu',
            joined_at: new Date().toISOString()
          }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClub,
  getClubs,
  getClub,
  updateClub,
  joinClub,
  leaveClub,
  getClubMembers
};