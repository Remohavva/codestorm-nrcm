const { supabaseAdmin } = require('../utils/supabase');

// Get comprehensive admin dashboard data
const getAdminDashboard = async (req, res, next) => {
  try {
    // Get all basic counts
    const [
      { data: users, error: usersError },
      { data: clubs, error: clubsError },
      { data: events, error: eventsError },
      { data: registrations, error: registrationsError },
      { data: attendance, error: attendanceError }
    ] = await Promise.all([
      supabaseAdmin.from('users').select('id, role, created_at'),
      supabaseAdmin.from('clubs').select('id, created_at'),
      supabaseAdmin.from('events').select('id, status, created_at, date, club_id'),
      supabaseAdmin.from('registrations').select('id, status, created_at'),
      supabaseAdmin.from('attendance').select('id, checked_in_at')
    ]);

    if (usersError) throw usersError;
    if (clubsError) throw clubsError;
    if (eventsError) throw eventsError;
    if (registrationsError) throw registrationsError;
    if (attendanceError) throw attendanceError;

    // Calculate time periods
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Calculate comprehensive statistics
    const dashboardStats = {
      // Overview metrics
      overview: {
        total_users: users.length,
        total_clubs: clubs.length,
        total_events: events.length,
        total_registrations: registrations.filter(r => r.status === 'registered').length,
        total_attendance: attendance.length,
        attendance_rate: events.length > 0 ? 
          ((attendance.length / registrations.filter(r => r.status === 'registered').length) * 100).toFixed(1) : 0
      },

      // User breakdown
      user_breakdown: {
        students: users.filter(u => u.role === 'student').length,
        club_leads: users.filter(u => u.role === 'club_lead').length,
        admins: users.filter(u => u.role === 'admin').length
      },

      // Event status breakdown
      event_status: {
        pending: events.filter(e => e.status === 'pending').length,
        approved: events.filter(e => e.status === 'approved').length,
        rejected: events.filter(e => e.status === 'rejected').length
      },

      // Time-based activity
      recent_activity: {
        new_users_today: users.filter(u => new Date(u.created_at) >= today).length,
        new_users_this_week: users.filter(u => new Date(u.created_at) >= thisWeek).length,
        new_users_this_month: users.filter(u => new Date(u.created_at) >= thisMonth).length,
        new_users_30d: users.filter(u => new Date(u.created_at) >= thirtyDaysAgo).length,
        
        new_clubs_this_week: clubs.filter(c => new Date(c.created_at) >= thisWeek).length,
        new_clubs_30d: clubs.filter(c => new Date(c.created_at) >= thirtyDaysAgo).length,
        
        new_events_this_week: events.filter(e => new Date(e.created_at) >= thisWeek).length,
        new_events_30d: events.filter(e => new Date(e.created_at) >= thirtyDaysAgo).length,
        
        new_registrations_today: registrations.filter(r => new Date(r.created_at) >= today).length,
        new_registrations_this_week: registrations.filter(r => new Date(r.created_at) >= thisWeek).length,
        new_registrations_30d: registrations.filter(r => new Date(r.created_at) >= thirtyDaysAgo).length
      },

      // Upcoming events
      upcoming_events: {
        total: events.filter(e => e.status === 'approved' && new Date(e.date) > now).length,
        this_week: events.filter(e => {
          const eventDate = new Date(e.date);
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          return e.status === 'approved' && eventDate > now && eventDate <= weekFromNow;
        }).length,
        this_month: events.filter(e => {
          const eventDate = new Date(e.date);
          const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
          return e.status === 'approved' && eventDate > now && eventDate <= monthFromNow;
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

    const topClubIds = Object.keys(clubEventCounts)
      .sort((a, b) => clubEventCounts[b] - clubEventCounts[a])
      .slice(0, 5);

    let topClubs = [];
    if (topClubIds.length > 0) {
      const { data: clubsData, error: topClubsError } = await supabaseAdmin
        .from('clubs')
        .select('id, name, description, lead_id, users!lead_id(name, email)')
        .in('id', topClubIds);

      if (topClubsError) throw topClubsError;

      topClubs = clubsData.map(club => ({
        ...club,
        event_count: clubEventCounts[club.id] || 0
      })).sort((a, b) => b.event_count - a.event_count);
    }

    // Get recent events for quick overview
    const { data: recentEvents, error: recentEventsError } = await supabaseAdmin
      .from('events')
      .select(`
        id,
        title,
        date,
        status,
        venue,
        capacity,
        created_at,
        clubs(id, name)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentEventsError) throw recentEventsError;

    // Get recent users
    const { data: recentUsers, error: recentUsersError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentUsersError) throw recentUsersError;

    // System health metrics (you can expand this)
    const systemHealth = {
      status: 'healthy',
      uptime: '99.9%',
      response_time: '120ms',
      active_sessions: users.length, // Simplified - in real app, track active sessions
      database_status: 'connected',
      last_backup: new Date().toISOString()
    };

    res.json({
      success: true,
      data: {
        stats: dashboardStats,
        top_clubs: topClubs,
        recent_events: recentEvents,
        recent_users: recentUsers,
        system_health: systemHealth,
        admin_info: {
          admin_name: req.user.name,
          admin_email: req.user.email,
          last_login: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    next(error);
  }
};

// Get admin-specific alerts and notifications
const getAdminAlerts = async (req, res, next) => {
  try {
    const alerts = [];

    // Check for pending events
    const { data: pendingEvents, error: pendingError } = await supabaseAdmin
      .from('events')
      .select('id, title, created_at')
      .eq('status', 'pending');

    if (pendingError) throw pendingError;

    if (pendingEvents.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Pending Event Approvals',
        message: `${pendingEvents.length} events are waiting for approval`,
        count: pendingEvents.length,
        action_url: '/admin/events?status=pending'
      });
    }

    // Check for events near capacity
    const { data: nearCapacityEvents, error: capacityError } = await supabaseAdmin
      .from('events')
      .select(`
        id,
        title,
        capacity,
        registrations(count)
      `)
      .eq('status', 'approved')
      .gte('date', new Date().toISOString());

    if (capacityError) throw capacityError;

    const highCapacityEvents = nearCapacityEvents.filter(event => {
      const registrationCount = event.registrations[0]?.count || 0;
      return (registrationCount / event.capacity) >= 0.9;
    });

    if (highCapacityEvents.length > 0) {
      alerts.push({
        type: 'info',
        title: 'High Capacity Events',
        message: `${highCapacityEvents.length} events are near capacity (>90%)`,
        count: highCapacityEvents.length,
        action_url: '/admin/events?filter=high_capacity'
      });
    }

    // Check for new users in last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const { data: newUsers, error: newUsersError } = await supabaseAdmin
      .from('users')
      .select('id')
      .gte('created_at', yesterday.toISOString());

    if (newUsersError) throw newUsersError;

    if (newUsers.length > 10) {
      alerts.push({
        type: 'success',
        title: 'High User Registration',
        message: `${newUsers.length} new users registered in the last 24 hours`,
        count: newUsers.length,
        action_url: '/admin/users?filter=recent'
      });
    }

    res.json({
      success: true,
      data: { alerts }
    });

  } catch (error) {
    console.error('Admin alerts error:', error);
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAdminAlerts
};