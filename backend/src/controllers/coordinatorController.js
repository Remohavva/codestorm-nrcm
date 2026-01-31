const { supabaseAdmin } = require('../utils/supabase');

// Get coordinator dashboard data
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get clubs led by this coordinator
    const { data: clubs, error: clubsError } = await supabaseAdmin
      .from('clubs')
      .select('*')
      .eq('lead_id', userId);

    if (clubsError) throw clubsError;

    if (clubs.length === 0) {
      return res.json({
        success: true,
        data: {
          clubs: [],
          events: [],
          stats: {
            total_clubs: 0,
            total_events: 0,
            pending_events: 0,
            approved_events: 0,
            total_registrations: 0
          }
        }
      });
    }

    const clubIds = clubs.map(club => club.id);

    // Get events for these clubs
    const { data: events, error: eventsError } = await supabaseAdmin
      .from('events')
      .select(`
        *,
        club:clubs(id, name),
        registrations(count)
      `)
      .in('club_id', clubIds)
      .order('created_at', { ascending: false });

    if (eventsError) throw eventsError;

    // Get registration counts
    const { data: registrations, error: regError } = await supabaseAdmin
      .from('registrations')
      .select('event_id')
      .in('event_id', events.map(e => e.id))
      .eq('status', 'registered');

    if (regError) throw regError;

    // Calculate stats
    const stats = {
      total_clubs: clubs.length,
      total_events: events.length,
      pending_events: events.filter(e => e.status === 'pending').length,
      approved_events: events.filter(e => e.status === 'approved').length,
      rejected_events: events.filter(e => e.status === 'rejected').length,
      total_registrations: registrations.length
    };

    res.json({
      success: true,
      data: {
        clubs,
        events: events.map(event => ({
          ...event,
          registration_count: registrations.filter(r => r.event_id === event.id).length
        })),
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get events for coordinator's clubs
const getMyEvents = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, club_id } = req.query;

    // Get clubs led by this coordinator
    const { data: clubs, error: clubsError } = await supabaseAdmin
      .from('clubs')
      .select('id')
      .eq('lead_id', userId);

    if (clubsError) throw clubsError;

    if (clubs.length === 0) {
      return res.json({
        success: true,
        data: { events: [] }
      });
    }

    const clubIds = clubs.map(club => club.id);

    let query = supabaseAdmin
      .from('events')
      .select(`
        *,
        club:clubs(id, name),
        registrations(
          id,
          status,
          user:users(id, name, email)
        )
      `)
      .in('club_id', clubIds);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (club_id && clubIds.includes(club_id)) {
      query = query.eq('club_id', club_id);
    }

    const { data: events, error } = await query.order('date', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: {
        events: events.map(event => ({
          ...event,
          registration_count: event.registrations.filter(r => r.status === 'registered').length,
          available_spots: event.capacity - event.registrations.filter(r => r.status === 'registered').length
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get clubs managed by coordinator
const getMyClubs = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data: clubs, error } = await supabaseAdmin
      .from('clubs')
      .select(`
        *,
        events(count),
        _events:events(
          id,
          title,
          status,
          date,
          registrations(count)
        )
      `)
      .eq('lead_id', userId);

    if (error) throw error;

    res.json({
      success: true,
      data: {
        clubs: clubs.map(club => ({
          ...club,
          event_count: club._events.length,
          pending_events: club._events.filter(e => e.status === 'pending').length,
          approved_events: club._events.filter(e => e.status === 'approved').length
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create event for coordinator's club
const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, venue, capacity, club_id } = req.body;
    const userId = req.user.id;

    // Verify the coordinator owns this club
    const { data: club, error: clubError } = await supabaseAdmin
      .from('clubs')
      .select('id, name, lead_id')
      .eq('id', club_id)
      .eq('lead_id', userId)
      .single();

    if (clubError || !club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found or you are not the lead of this club'
      });
    }

    // Validate date is in the future
    if (new Date(date) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Event date must be in the future'
      });
    }

    // Create event
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .insert([{
        title,
        description,
        date,
        venue,
        capacity: parseInt(capacity),
        club_id,
        status: 'pending'
      }])
      .select(`
        *,
        club:clubs(id, name)
      `)
      .single();

    if (eventError) throw eventError;

    res.status(201).json({
      success: true,
      message: 'Event created successfully and is pending approval',
      data: { event }
    });
  } catch (error) {
    next(error);
  }
};

// Update event for coordinator's club
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    // Get event and verify ownership
    const { data: event, error: fetchError } = await supabaseAdmin
      .from('events')
      .select(`
        *,
        club:clubs(id, name, lead_id)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      throw fetchError;
    }

    // Check ownership
    if (event.club.lead_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update events for your own clubs'
      });
    }

    // Don't allow updating approved events that are in the past
    if (event.status === 'approved' && new Date(event.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update past events'
      });
    }

    // Validate date if being updated
    if (updates.date && new Date(updates.date) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Event date must be in the future'
      });
    }

    // If event was approved and we're making changes, set it back to pending
    if (event.status === 'approved' && Object.keys(updates).some(key => 
      ['title', 'description', 'date', 'venue', 'capacity'].includes(key)
    )) {
      updates.status = 'pending';
    }

    // Update event
    const { data: updatedEvent, error: updateError } = await supabaseAdmin
      .from('events')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        club:clubs(id, name)
      `)
      .single();

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event: updatedEvent }
    });
  } catch (error) {
    next(error);
  }
};

// Delete event for coordinator's club
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get event and verify ownership
    const { data: event, error: fetchError } = await supabaseAdmin
      .from('events')
      .select(`
        *,
        club:clubs(id, name, lead_id)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      throw fetchError;
    }

    // Check ownership
    if (event.club.lead_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete events for your own clubs'
      });
    }

    // Check if event has registrations
    const { data: registrations, error: regError } = await supabaseAdmin
      .from('registrations')
      .select('id')
      .eq('event_id', id)
      .eq('status', 'registered');

    if (regError) throw regError;

    if (registrations.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete event with ${registrations.length} active registrations`
      });
    }

    // Delete event
    const { error: deleteError } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get event registrations for coordinator's events
const getEventRegistrations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify event belongs to coordinator's club
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select(`
        *,
        club:clubs(id, name, lead_id)
      `)
      .eq('id', id)
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

    if (event.club.lead_id !== userId) {
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
        user:users(id, name, email)
      `)
      .eq('event_id', id)
      .order('created_at', { ascending: false });

    if (regError) throw regError;

    res.json({
      success: true,
      data: {
        event,
        registrations,
        stats: {
          total_registrations: registrations.length,
          active_registrations: registrations.filter(r => r.status === 'registered').length,
          cancelled_registrations: registrations.filter(r => r.status === 'cancelled').length,
          available_spots: event.capacity - registrations.filter(r => r.status === 'registered').length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getMyEvents,
  getMyClubs,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations
};