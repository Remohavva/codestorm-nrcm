const { supabaseAdmin } = require('../utils/supabase');

// Create new event
const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, venue, capacity, club_id } = req.body;

    // Check if user is club_lead or admin
    if (!['club_lead', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only club leads and admins can create events'
      });
    }

    // If user is club_lead, verify they own the club
    if (req.user.role === 'club_lead') {
      const { data: club, error: clubError } = await supabaseAdmin
        .from('clubs')
        .select('lead_id')
        .eq('id', club_id)
        .single();

      if (clubError || !club) {
        return res.status(404).json({
          success: false,
          message: 'Club not found'
        });
      }

      if (club.lead_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You can only create events for your own clubs'
        });
      }
    }

    // Create event
    const { data: eventData, error: eventError } = await supabaseAdmin
      .from('events')
      .insert([{
        title,
        description,
        date,
        venue,
        capacity,
        club_id,
        status: 'pending'
      }])
      .select(`
        *,
        club:clubs(id, name, lead:users!lead_id(id, name))
      `)
      .single();

    if (eventError) {
      throw eventError;
    }

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: {
        event: eventData
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all events with filters
const getEvents = async (req, res, next) => {
  try {
    const { status, club_id, upcoming } = req.query;
    
    let query = supabaseAdmin
      .from('events')
      .select(`
        *,
        club:clubs(id, name, lead:users!lead_id(id, name)),
        registrations(count),
        _count:registrations(count)
      `);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    
    if (club_id) {
      query = query.eq('club_id', club_id);
    }
    
    if (upcoming === 'true') {
      query = query.gte('date', new Date().toISOString());
    }

    const { data: events, error } = await query.order('date', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: {
        events: events.map(event => ({
          ...event,
          registration_count: event.registrations.length
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single event
const getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: event, error } = await supabaseAdmin
      .from('events')
      .select(`
        *,
        club:clubs(
          id,
          name,
          description,
          lead:users!lead_id(id, name, email)
        ),
        registrations(
          id,
          status,
          created_at,
          user:users(id, name, email)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: {
        event: {
          ...event,
          registration_count: event.registrations.length,
          available_spots: event.capacity - event.registrations.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Approve event (admin only)
const approveEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Update event status to approved
    const { data: event, error } = await supabaseAdmin
      .from('events')
      .update({ status: 'approved' })
      .eq('id', id)
      .select(`
        *,
        club:clubs(id, name, lead:users!lead_id(id, name))
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      throw error;
    }

    // TODO: Send notification to club lead
    // await createNotification(event.club.lead.id, `Your event "${event.title}" has been approved!`);

    res.json({
      success: true,
      message: 'Event approved successfully',
      data: {
        event
      }
    });
  } catch (error) {
    next(error);
  }
};

// Reject event (admin only)
const rejectEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Update event status to rejected
    const { data: event, error } = await supabaseAdmin
      .from('events')
      .update({ status: 'rejected' })
      .eq('id', id)
      .select(`
        *,
        club:clubs(id, name, lead:users!lead_id(id, name))
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      throw error;
    }

    // TODO: Send notification to club lead with reason
    // const message = `Your event "${event.title}" has been rejected. ${reason ? `Reason: ${reason}` : ''}`;
    // await createNotification(event.club.lead.id, message);

    res.json({
      success: true,
      message: 'Event rejected successfully',
      data: {
        event
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update event (club lead or admin only)
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Get event to check ownership
    const { data: event, error: fetchError } = await supabaseAdmin
      .from('events')
      .select(`
        *,
        club:clubs(lead_id)
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

    // Check permissions
    if (req.user.role !== 'admin' && event.club.lead_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update events for your own clubs'
      });
    }

    // Update event
    const { data: updatedEvent, error: updateError } = await supabaseAdmin
      .from('events')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        club:clubs(id, name, lead:users!lead_id(id, name))
      `)
      .single();

    if (updateError) {
      throw updateError;
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: {
        event: updatedEvent
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  approveEvent,
  rejectEvent,
  updateEvent
};