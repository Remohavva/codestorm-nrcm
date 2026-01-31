import { useState, useEffect } from 'react';
import { 
  HiUsers, 
  HiUserGroup, 
  HiCalendar, 
  HiClipboardList,
  HiCheckCircle,
  HiClock,
  HiExclamationTriangle,
  HiTrendingUp,
  HiEye
} from 'react-icons/hi';
import { adminAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import Beams from '../components/Beams';
import EventManagement from '../components/admin/EventManagement';
import UserManagement from '../components/admin/UserManagement';
import MonitoringPanel from '../components/admin/MonitoringPanel';

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data.data);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading admin dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  const { stats, top_clubs } = analytics;

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Beams
          beamWidth={2}
          beamHeight={20}
          beamNumber={12}
          lightColor="#3b82f6"
          speed={1}
          noiseIntensity={1.2}
          scale={0.15}
          rotation={15}
        />
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Monitor and manage your campus platform</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg backdrop-blur-sm border border-gray-700">
            {[
              { id: 'overview', label: 'Overview', icon: HiTrendingUp },
              { id: 'events', label: 'Events', icon: HiCalendar },
              { id: 'users', label: 'Users', icon: HiUsers },
              { id: 'monitoring', label: 'Monitoring', icon: HiEye }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{stats.overview.total_users}</p>
                    <p className="text-green-400 text-sm">+{stats.recent_activity.new_users_30d} this month</p>
                  </div>
                  <HiUsers className="text-blue-400" size={32} />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Clubs</p>
                    <p className="text-2xl font-bold text-white">{stats.overview.total_clubs}</p>
                    <p className="text-green-400 text-sm">+{stats.recent_activity.new_clubs_30d} this month</p>
                  </div>
                  <HiUserGroup className="text-purple-400" size={32} />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Events</p>
                    <p className="text-2xl font-bold text-white">{stats.overview.total_events}</p>
                    <p className="text-green-400 text-sm">+{stats.recent_activity.new_events_30d} this month</p>
                  </div>
                  <HiCalendar className="text-green-400" size={32} />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Registrations</p>
                    <p className="text-2xl font-bold text-white">{stats.overview.total_registrations}</p>
                    <p className="text-green-400 text-sm">+{stats.recent_activity.new_registrations_30d} this month</p>
                  </div>
                  <HiClipboardList className="text-yellow-400" size={32} />
                </div>
              </GlassCard>
            </div>

            {/* User Breakdown & Event Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">User Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Students</span>
                    <span className="text-white font-medium">{stats.user_breakdown.students}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Club Leaders</span>
                    <span className="text-white font-medium">{stats.user_breakdown.club_leads}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Admins</span>
                    <span className="text-white font-medium">{stats.user_breakdown.admins}</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Event Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <HiCheckCircle className="text-green-400" size={16} />
                      <span className="text-gray-400">Approved</span>
                    </div>
                    <span className="text-white font-medium">{stats.event_status.approved}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <HiClock className="text-yellow-400" size={16} />
                      <span className="text-gray-400">Pending</span>
                    </div>
                    <span className="text-white font-medium">{stats.event_status.pending}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <HiExclamationTriangle className="text-red-400" size={16} />
                      <span className="text-gray-400">Rejected</span>
                    </div>
                    <span className="text-white font-medium">{stats.event_status.rejected}</span>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Top Clubs */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top Active Clubs</h3>
              <div className="space-y-3">
                {top_clubs.map((club, index) => (
                  <div key={club.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-500 text-sm">#{index + 1}</span>
                      <span className="text-white">{club.name}</span>
                    </div>
                    <span className="text-blue-400 font-medium">{club.event_count} events</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Other tabs will be implemented in separate components */}
        {activeTab === 'events' && <EventManagement />}

        {activeTab === 'users' && <UserManagement />}

        {activeTab === 'monitoring' && <MonitoringPanel />}
      </div>
    </div>
  );
}

export default AdminDashboard;