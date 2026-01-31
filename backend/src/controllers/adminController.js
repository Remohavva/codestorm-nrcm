const { supabaseAdmin } = require('../utils/supabase');

// Get analytics dashboard data
const getAnalytics = async (req, res, next) => {
  try {
    // Get total counts
    const [
      { data: users, error: usersError },
      { data: clubs, error: clubsError },
      { data: events, error: eventsError },
      { data: registrations, error: registrationsError },
      { data: attendance, error: attendanceError }
    ] = await Promise.all([
      supabaseAdmin.from('users').select('id, role, created_at'),
      supabaseAdmin.from('clubs').select('id, created_at'),
      supabaseAdmin.from('events').select('id, status, created_at, date'),
      supabaseAdmin.from('registrations').select('id, status, created_at'),
      supabaseAdmin.from('attendance').select('id, checked_in_at')
    ]);

    if (usersError) throw usersError;
    if (clubsError) throw clubsError;
    if (eventsError) throw eventsError;
    if (registrationsError) throw registrationsError;
    if (attendanceError) throw attendanceError;

    // Calculate statistics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats = {
      overview: {
        total_users: users.length,
        total_clubs: clubs.length,
        total_events: events.length,
        total_registrations: registrations.filter(r => r.status === 'registered').length,
        total_attendance: attendance.length
      },
      user_breakdown: {
        students: users.filter(u => u.role === 'student').length,
        club_leads: users.filter(u => u.role === 'club_lead').length,
        admins: users.filter(u => u.role === 'admin').length
      },
      event_status: {
        pending: events.filter(e => e.status === 'pending').length,
        approved: events.filter(e => e.status === 'approved').length,
        rejected: events.filter(e => e.status === 'rejected').length
      },
      recent_activity: {
        new_users_30d: users.filter(u => new Date(u.created_at) >= thirtyDaysAgo).length,
        new_clubs_30d: clubs.filter(c => new Date(c.created_at) >= thirtyDaysAgo).length,
        new_events_30d: events.filter(e => new Date(e.created_at) >= thirtyDaysAgo).length,
        new_registrations_30d: registrations.filter(r => new Date(r.created_at) >= thirtyDaysAgo).length
      },
      upcoming_events: {
        total: events.filter(e => e.status === 'approved' && new Date(e.date) > now).length,
        this_week: events.filter(e => {
          const eventDate = new Date(e.date);
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          return e.status === 'approved' && eventDate > now && eventDate <= weekFromNow;
        }).length
      }
    };

    // Get top clubs by events
    const clubEventCounts = {};
    events.forEach(event => {
      if (event.club_id) {
        clubEventCounts[event.club_id] = (clubEventCounts[event.club_id] || 0) + 1;
      }
    });

    const { data: topClubs, error: topClubsError } = await supabaseAdmin
      .from('clubs')
      .select('id, name')
      .in('id', Object.keys(clubEventCounts).slice(0, 5));

    if (topClubsError) throw topClubsError;

    const topClubsWithCounts = topClubs.map(club => ({
      ...club,
      event_count: clubEventCounts[club.id] || 0
    })).sort((a, b) => b.event_count - a.event_count);

    res.json({
      success: true,
      data: {
        stats,
        top_clubs: topClubsWithCounts
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all events for admin review
const getAllEvents = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('events')
      .select(`
        *,
        club:clubs(
          id,
          name,
          lead:users!lead_id(id, name, email)
        ),
        registrations(count)
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: events, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: {
        events: events.map(event => ({
          ...event,
          registration_count: event.registrations.length
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all users for admin management
const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('users')
      .select(`
        *,
        clubs:clubs!lead_id(count),
        registrations(count)
      `, { count: 'exact' });

    if (role) {
      query = query.eq('role', role);
    }

    const { data: users, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          ...user,
          clubs_count: user.clubs.length,
          registrations_count: user.registrations.length
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user role
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['student', 'club_lead', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    // Prevent admin from changing their own role
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    // Update user role
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update({ role })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get pending events that need approval
const getPendingEvents = async (req, res, next) => {
  try {
    const { data: events, error } = await supabaseAdmin
      .from('events')
      .select(`
        *,
        club:clubs(
          id,
          name,
          lead:users!lead_id(id, name, email)
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: {
        events
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update event status (approve/reject)
const updateEventStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "approved" or "rejected"'
      });
    }

    // Check if event exists
    const { data: existingEvent, error: checkError } = await supabaseAdmin
      .from('events')
      .select('id, title, status')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      throw checkError;
    }

    // Update event status
    const { data: updatedEvent, error: updateError } = await supabaseAdmin
      .from('events')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: `Event ${status} successfully`,
      data: { event: updatedEvent }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
  getAllEvents,
  getAllUsers,
  updateUserRole,
  getPendingEvents,
  updateEventStatus
};
// Community moderation functions

// Get all reports for admin review
const getReports = async (req, res, next) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { data: reports, error, count } = await supabaseAdmin
      .from('reports')
      .select(`
        *,
        reporter:users!reporter_id(id, name, email),
        post:posts(id, title, author:users!author_id(id, name)),
        comment:comments(id, content, author:users!author_id(id, name))
      `, { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Handle report (approve/dismiss)
const handleReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, admin_notes } = req.body; // 'approved' or 'dismissed'

    if (!['approved', 'dismissed'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "approved" or "dismissed"'
      });
    }

    // Get report details
    const { data: report, error: reportError } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (reportError) {
      if (reportError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }
      throw reportError;
    }

    // Update report status
    const { error: updateError } = await supabaseAdmin
      .from('reports')
      .update({
        status: action,
        admin_notes,
        reviewed_by: req.user.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // If approved, take action on the content
    if (action === 'approved') {
      if (report.content_type === 'post') {
        await supabaseAdmin
          .from('posts')
          .update({ status: 'hidden' })
          .eq('id', report.content_id);
      } else if (report.content_type === 'comment') {
        await supabaseAdmin
          .from('comments')
          .update({ status: 'hidden' })
          .eq('id', report.content_id);
      }
    }

    res.json({
      success: true,
      message: `Report ${action} successfully`,
      data: { report_id: id, action }
    });
  } catch (error) {
    next(error);
  }
};

// Get community analytics
const getCommunityAnalytics = async (req, res, next) => {
  try {
    const [
      { data: posts, error: postsError },
      { data: comments, error: commentsError },
      { data: reactions, error: reactionsError },
      { data: reports, error: reportsError }
    ] = await Promise.all([
      supabaseAdmin.from('posts').select('id, created_at, status'),
      supabaseAdmin.from('comments').select('id, created_at'),
      supabaseAdmin.from('reactions').select('id, type, created_at'),
      supabaseAdmin.from('reports').select('id, status, created_at')
    ]);

    if (postsError) throw postsError;
    if (commentsError) throw commentsError;
    if (reactionsError) throw reactionsError;
    if (reportsError) throw reportsError;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const analytics = {
      overview: {
        total_posts: posts.filter(p => p.status === 'active').length,
        total_comments: comments.length,
        total_reactions: reactions.length,
        total_reports: reports.length
      },
      recent_activity: {
        new_posts_30d: posts.filter(p => new Date(p.created_at) >= thirtyDaysAgo && p.status === 'active').length,
        new_comments_30d: comments.filter(c => new Date(c.created_at) >= thirtyDaysAgo).length,
        new_reactions_30d: reactions.filter(r => new Date(r.created_at) >= thirtyDaysAgo).length,
        new_reports_30d: reports.filter(r => new Date(r.created_at) >= thirtyDaysAgo).length
      },
      moderation: {
        pending_reports: reports.filter(r => r.status === 'pending').length,
        approved_reports: reports.filter(r => r.status === 'approved').length,
        dismissed_reports: reports.filter(r => r.status === 'dismissed').length,
        hidden_posts: posts.filter(p => p.status === 'hidden').length
      },
      engagement: {
        likes: reactions.filter(r => r.type === 'like').length,
        dislikes: reactions.filter(r => r.type === 'dislike').length,
        avg_comments_per_post: posts.length > 0 ? (comments.length / posts.filter(p => p.status === 'active').length).toFixed(2) : 0
      }
    };

    res.json({
      success: true,
      data: { analytics }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
  getAllEvents,
  getAllUsers,
  updateUserRole,
  getPendingEvents,
  updateEventStatus,
  getReports,
  handleReport,
  getCommunityAnalytics
};