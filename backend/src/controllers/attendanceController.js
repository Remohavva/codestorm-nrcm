const { supabaseAdmin } = require('../utils/supabase');

// Check in user to event
const checkInUser = async (req, res, next) => {
  try {
    const { id: event_id } = req.params;
    const { user_id } = req.body;
    
    // If no user_id provided, use current user (self check-in)
    const targetUserId = user_id || req.user.id;

    // Check if event exists
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select(`
        id,
        title,
        date,
        status,
        club:clubs(lead_id)
      `)
      .eq('id', event_id)
      .single();

    if (eventError) {
      if (eventError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      throw eventError;
    }

    // Check if event is approved
    if (event.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot check in to unapproved events'
      });
    }

    // For checking in other users, verify permissions
    if (user_id && user_id !== req.user.id) {
      if (req.user.role !== 'admin' && event.club.lead_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You can only check in users for your own events'
        });
      }
    }

    // Check if user is registered for the event
    const { data: registration, error: regError } = await supabaseAdmin
      .from('registrations')
      .select('id, status')
      .eq('user_id', targetUserId)
      .eq('event_id', event_id)
      .single();

    if (regError) {
      if (regError.code === 'PGRST116') {
        return res.status(400).json({
          success: false,
          message: 'User is not registered for this event'
        });
      }
      throw regError;
    }

    if (registration.status !== 'registered') {
      return res.status(400).json({
        success: false,
        message: 'User registration is not active'
      });
    }

    // Check if user is already checked in
    const { data: existingAttendance, error: attendanceError } = await supabaseAdmin
      .from('attendance')
      .select('id, checked_in_at')
      .eq('user_id', targetUserId)
      .eq('event_id', event_id)
      .single();

    if (attendanceError && attendanceError.code !== 'PGRST116') {
      throw attendanceError;
    }

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'User is already checked in',
        data: {
          checked_in_at: existingAttendance.checked_in_at
        }
      });
    }

    // Create attendance record
    const { data: attendance, error: createError } = await supabaseAdmin
      .from('attendance')
      .insert([{
        user_id: targetUserId,
        event_id,
        checked_in_at: new Date().toISOString()
      }])
      .select(`
        *,
        user:users(id, name, email),
        event:events(id, title, date, venue)
      `)
      .single();

    if (createError) {
      throw createError;
    }

    res.status(201).json({
      success: true,
      message: 'User checked in successfully',
      data: {
        attendance
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get event attendance (for club leads and admins)
const getEventAttendance = async (req, res, next) => {
  try {
    const { id: event_id } = req.params;

    // Check if event exists and user has permission
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select(`
        id,
        title,
        date,
        capacity,
        club:clubs(lead_id)
      `)
      .eq('id', event_id)
      .single();

    if (eventError) {
      if (eventError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      throw eventError;
    }

    // Check permissions
    if (req.user.role !== 'admin' && event.club.lead_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only view attendance for your own events'
      });
    }

    // Get attendance records
    const { data: attendance, error: attendanceError } = await supabaseAdmin
      .from('attendance')
      .select(`
        *,
        user:users(id, name, email)
      `)
      .eq('event_id', event_id)
      .order('checked_in_at', { ascending: false });

    if (attendanceError) {
      throw attendanceError;
    }

    // Get total registrations for comparison
    const { data: registrations, error: regError } = await supabaseAdmin
      .from('registrations')
      .select('id')
      .eq('event_id', event_id)
      .eq('status', 'registered');

    if (regError) {
      throw regError;
    }

    res.json({
      success: true,
      data: {
        event: {
          id: event.id,
          title: event.title,
          date: event.date,
          capacity: event.capacity
        },
        attendance: attendance,
        stats: {
          total_registered: registrations.length,
          total_attended: attendance.length,
          attendance_rate: registrations.length > 0 
            ? Math.round((attendance.length / registrations.length) * 100) 
            : 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user's attendance history
const getUserAttendance = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const { data: attendance, error } = await supabaseAdmin
      .from('attendance')
      .select(`
        *,
        event:events(
          id,
          title,
          date,
          venue,
          club:clubs(id, name)
        )
      `)
      .eq('user_id', user_id)
      .order('checked_in_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: {
        attendance
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkInUser,
  getEventAttendance,
  getUserAttendance
};