import { useState, useEffect } from 'react';
import { 
  HiTrendingUp, 
  HiTrendingDown,
  HiUsers,
  HiCalendar,
  HiClipboardList,
  HiCheckCircle,
  HiClock,
  HiExclamationTriangle
} from 'react-icons/hi';
import GlassCard from '../GlassCard';

function AdminStats({ stats, loading }) {
  const [animatedStats, setAnimatedStats] = useState({});

  useEffect(() => {
    if (stats && !loading) {
      // Animate numbers counting up
      const targets = {
        totalUsers: stats.overview.total_users,
        totalClubs: stats.overview.total_clubs,
        totalEvents: stats.overview.total_events,
        totalRegistrations: stats.overview.total_registrations,
        attendanceRate: parseFloat(stats.overview.attendance_rate)
      };

      const duration = 1500; // 1.5 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

        setAnimatedStats({
          totalUsers: Math.floor(targets.totalUsers * easeProgress),
          totalClubs: Math.floor(targets.totalClubs * easeProgress),
          totalEvents: Math.floor(targets.totalEvents * easeProgress),
          totalRegistrations: Math.floor(targets.totalRegistrations * easeProgress),
          attendanceRate: (targets.attendanceRate * easeProgress).toFixed(1)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedStats(targets);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [stats, loading]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <GlassCard key={i} className="p-6 animate-pulse">
            <div className="h-20 bg-gray-700/50 rounded"></div>
          </GlassCard>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: animatedStats.totalUsers || 0,
      change: stats?.recent_activity?.new_users_30d || 0,
      changeLabel: 'this month',
      icon: HiUsers,
      color: 'blue',
      trend: 'up'
    },
    {
      title: 'Active Clubs',
      value: animatedStats.totalClubs || 0,
      change: stats?.recent_activity?.new_clubs_30d || 0,
      changeLabel: 'this month',
      icon: HiUsers,
      color: 'purple',
      trend: 'up'
    },
    {
      title: 'Total Events',
      value: animatedStats.totalEvents || 0,
      change: stats?.recent_activity?.new_events_30d || 0,
      changeLabel: 'this month',
      icon: HiCalendar,
      color: 'green',
      trend: 'up'
    },
    {
      title: 'Registrations',
      value: animatedStats.totalRegistrations || 0,
      change: stats?.recent_activity?.new_registrations_30d || 0,
      changeLabel: 'this month',
      icon: HiClipboardList,
      color: 'yellow',
      trend: 'up'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-400',
      purple: 'text-purple-400',
      green: 'text-green-400',
      yellow: 'text-yellow-400',
      red: 'text-red-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <GlassCard key={index} className="p-6 hover:bg-white/5 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stat.value.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  {stat.trend === 'up' ? (
                    <HiTrendingUp className="text-green-400" size={14} />
                  ) : (
                    <HiTrendingDown className="text-red-400" size={14} />
                  )}
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    +{stat.change}
                  </span>
                  <span className="text-gray-500 text-sm">{stat.changeLabel}</span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-gray-800/50 ${getColorClasses(stat.color)}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Rate */}
        <GlassCard className="p-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <HiCheckCircle className="text-green-400 mr-2" size={24} />
              <h3 className="text-lg font-semibold text-white">Attendance Rate</h3>
            </div>
            <div className="text-4xl font-bold text-green-400 mb-2">
              {animatedStats.attendanceRate || 0}%
            </div>
            <p className="text-gray-400 text-sm">Average event attendance</p>
            <div className="mt-4 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${animatedStats.attendanceRate || 0}%` }}
              ></div>
            </div>
          </div>
        </GlassCard>

        {/* Event Status Breakdown */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Event Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <HiCheckCircle className="text-green-400" size={16} />
                <span className="text-gray-300">Approved</span>
              </div>
              <span className="text-white font-medium">
                {stats?.event_status?.approved || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <HiClock className="text-yellow-400" size={16} />
                <span className="text-gray-300">Pending</span>
              </div>
              <span className="text-white font-medium">
                {stats?.event_status?.pending || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <HiExclamationTriangle className="text-red-400" size={16} />
                <span className="text-gray-300">Rejected</span>
              </div>
              <span className="text-white font-medium">
                {stats?.event_status?.rejected || 0}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* User Role Distribution */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">User Roles</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Students</span>
              <span className="text-blue-400 font-medium">
                {stats?.user_breakdown?.students || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Club Leaders</span>
              <span className="text-purple-400 font-medium">
                {stats?.user_breakdown?.club_leads || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Admins</span>
              <span className="text-red-400 font-medium">
                {stats?.user_breakdown?.admins || 0}
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Activity Timeline */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity (30 Days)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {stats?.recent_activity?.new_users_30d || 0}
            </div>
            <div className="text-gray-400 text-sm">New Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {stats?.recent_activity?.new_clubs_30d || 0}
            </div>
            <div className="text-gray-400 text-sm">New Clubs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {stats?.recent_activity?.new_events_30d || 0}
            </div>
            <div className="text-gray-400 text-sm">New Events</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {stats?.recent_activity?.new_registrations_30d || 0}
            </div>
            <div className="text-gray-400 text-sm">Registrations</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export default AdminStats;