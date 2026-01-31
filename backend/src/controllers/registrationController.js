const { supabaseAdmin } = require('../utils/supabase');

// Register for an event
const registerForEvent = async (req, res, next) => {
  try {
    const { id: event_id } = req.params;
    const user_id = req.user.id;

    // Check if event exists and is approved
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('id, title, capacity, status, date')
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
        message: 'Cannot register for unapproved events'
      });
    }

    // Check if event is in the future
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for past events'
      });
    }

    // Check current registration count
    const { data: registrations, error: countError } = await supabaseAdmin
      .from('registrations')
      .select('id')
      .eq('event_id', event_id)
      .eq('status', 'registered');

    if (countError) {
      throw countError;
    }

    // Check if event is full
    if (registrations.length >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Check if user is already registered
    const { data: existingRegistration, error: existingError } = await supabaseAdmin
      .from('registrations')
      .select('id, status')
      .eq('user_id', user_id)
      .eq('event_id', event_id)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError;
    }

    if (existingRegistration) {
      if (existingRegistration.status === 'registered') {
        return res.status(400).json({
          success: false,
          message: 'Already registered for this event'
        });
      }
      
      // If previously cancelled, update status to registered
      const { data: updatedRegistration, error: updateError } = await supabaseAdmin
        .from('registrations')
        .update({ status: 'registered' })
        .eq('id', existingRegistration.id)
        .select(`
          *,
          event:events(id, title, date, venue),
          user:users(id, name, email)
        `)
        .single();

      if (updateError) {
        throw updateError;
      }

      return res.json({
        success: true,
        message: 'Successfully registered for event',
        data: {
          registration: updatedRegistration
        }
      });
    }

    // Create new registration
    const { data: registration, error: registrationError } = await supabaseAdmin
      .from('registrations')
      .insert([{
        user_id,
        event_id,
        status: 'registered'
      }])
      .select(`
        *,
        event:events(id, title, date, venue),
        user:users(id, name, email)
      `)
      .single();

    if (registrationError) {
      throw registrationError;
    }

    res.status(201).json({
      success: true,
      message: 'Successfully registered for event',
      data: {
        registration
      }
    });
  } catch (error) {
    next(error);
  }
};

// Cancel registration
const cancelRegistration = async (req, res, next) => {
  try {
    const { id: event_id } = req.params;
    const user_id = req.user.id;

    // Find user's registration
    const { data: registration, error: findError } = await supabaseAdmin
      .from('registrations')
      .select('id, status')
      .eq('user_id', user_id)
      .eq('event_id', event_id)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Registration not found'
        });
      }
      throw findError;
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Registration already cancelled'
      });
    }

    // Update registration status to cancelled
    const { data: updatedRegistration, error: updateError } = await supabaseAdmin
      .from('registrations')
      .update({ status: 'cancelled' })
      .eq('id', registration.id)
      .select(`
        *,
        event:events(id, title, date, venue),
        user:users(id, name, email)
      `)
      .single();

    if (updateError) {
      throw updateError;
    }

    res.json({
      success: true,
      message: 'Registration cancelled successfully',
      data: {
        registration: updatedRegistration
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user's registrations
const getUserRegistrations = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { status, upcoming } = req.query;

    let query = supabaseAdmin
      .from('registrations')
      .select(`
        *,
        event:events(
          id,
          title,
          description,
          date,
          venue,
          capacity,
          status,
          club:clubs(id, name)
        )
      `)
      .eq('user_id', user_id);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    const { data: registrations, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Filter upcoming events if requested
    let filteredRegistrations = registrations;
    if (upcoming === 'true') {
      filteredRegistrations = registrations.filter(reg => 
        new Date(reg.event.date) > new Date()
      );
    }

    res.json({
      success: true,
      data: {
        registrations: filteredRegistrations
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get event registrations (for club leads and admins)
const getEventRegistrations = async (req, res, next) => {
  try {
    const { id: event_id } = req.params;

    // Check if event exists and user has permission
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select(`
        id,
        title,
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
        message: 'You can only view registrations for your own events'
      });
    }

    // Get registrations
    const { data: registrations, error: regError } = await supabaseAdmin
      .from('registrations')
      .select(`
        *,
        user:users(id, name, email),
        attendance:attendance(id, checked_in_at)
      `)
      .eq('event_id', event_id)
      .order('created_at', { ascending: false });

    if (regError) {
      throw regError;
    }

    res.json({
      success: true,
      data: {
        event: {
          id: event.id,
          title: event.title
        },
        registrations: registrations.map(reg => ({
          ...reg,
          checked_in: reg.attendance.length > 0,
          checked_in_at: reg.attendance[0]?.checked_in_at || null
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForEvent,
  cancelRegistration,
  getUserRegistrations,
  getEventRegistrations
};