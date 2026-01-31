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
  HiEye,
  HiRefresh,
  HiBell,
  HiChartBar,
  HiCog
} from 'react-icons/hi';
import { adminAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import Beams from '../components/Beams';
import EventManagement from '../components/admin/EventManagement';
import UserManagement from '../components/admin/UserManagement';
import MonitoringPanel from '../components/admin/MonitoringPanel';
import AdminAlerts from '../components/admin/AdminAlerts';
import AdminStats from '../components/admin/AdminStats';
import SystemHealth from '../components/admin/SystemHealth';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, alertsResponse] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getAlerts()
      ]);
      
      setDashboardData(dashboardResponse.data.data);
      setAlerts(alertsResponse.data.data.alerts);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <HiExclamationTriangle className="text-red-400 text-6xl mx-auto mb-4" />
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { stats, top_clubs, recent_events, recent_users, system_health, admin_info } = dashboardData || {};

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">
                Welcome back, {admin_info?.admin_name || 'Administrator'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right text-sm text-gray-400">
                <div>Last updated: {lastUpdate.toLocaleTimeString()}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>System Online</span>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <HiRefresh className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <AdminAlerts alerts={alerts} onRefresh={fetchDashboardData} />
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg backdrop-blur-sm border border-gray-700">
            {[
              { id: 'overview', label: 'Overview', icon: HiChartBar },
              { id: 'events', label: 'Events', icon: HiCalendar },
              { id: 'users', label: 'Users', icon: HiUsers },
              { id: 'monitoring', label: 'Monitoring', icon: HiEye },
              { id: 'system', label: 'System', icon: HiCog }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <AdminStats stats={stats} />

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Breakdown Chart */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">User Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-gray-300">Students</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{stats?.user_breakdown?.students || 0}</div>
                      <div className="text-xs text-gray-400">
                        {stats?.overview?.total_users > 0 
                          ? Math.round((stats.user_breakdown.students / stats.overview.total_users) * 100)
                          : 0}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span className="text-gray-300">Club Leaders</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{stats?.user_breakdown?.club_leads || 0}</div>
                      <div className="text-xs text-gray-400">
                        {stats?.overview?.total_users > 0 
                          ? Math.round((stats.user_breakdown.club_leads / stats.overview.total_users) * 100)
                          : 0}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-gray-300">Admins</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{stats?.user_breakdown?.admins || 0}</div>
                      <div className="text-xs text-gray-400">
                        {stats?.overview?.total_users > 0 
                          ? Math.round((stats.user_breakdown.admins / stats.overview.total_users) * 100)
                          : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Event Status Chart */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Event Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <HiCheckCircle className="text-green-400" size={16} />
                      <span className="text-gray-300">Approved</span>
                    </div>
                    <span className="text-white font-medium">{stats?.event_status?.approved || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <HiClock className="text-yellow-400" size={16} />
                      <span className="text-gray-300">Pending</span>
                    </div>
                    <span className="text-white font-medium">{stats?.event_status?.pending || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <HiExclamationTriangle className="text-red-400" size={16} />
                      <span className="text-gray-300">Rejected</span>
                    </div>
                    <span className="text-white font-medium">{stats?.event_status?.rejected || 0}</span>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Events */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Events</h3>
                <div className="space-y-3">
                  {recent_events?.slice(0, 5).map(event => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{event.title}</div>
                        <div className="text-gray-400 text-sm">
                          {event.clubs?.name} • {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        event.status === 'approved' ? 'bg-green-600/20 text-green-400' :
                        event.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        {event.status}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Recent Users */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {recent_users?.slice(0, 5).map(user => (
                    <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-gray-400 text-sm">{user.email}</div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin' ? 'bg-red-600/20 text-red-400' :
                        user.role === 'club_lead' ? 'bg-purple-600/20 text-purple-400' :
                        'bg-blue-600/20 text-blue-400'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Top Clubs */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top Active Clubs</h3>
              <div className="space-y-3">
                {top_clubs?.map((club, index) => (
                  <div key={club.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{club.name}</div>
                        <div className="text-gray-400 text-sm">
                          Lead: {club.users?.name || 'No lead assigned'}
                        </div>
                      </div>
                    </div>
                    <div className="text-blue-400 font-medium">{club.event_count} events</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'events' && <EventManagement />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'monitoring' && <MonitoringPanel />}
        {activeTab === 'system' && <SystemHealth systemHealth={system_health} />}
      </div>
    </div>
  );
}

export default AdminDashboard;