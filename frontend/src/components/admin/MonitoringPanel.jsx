import { useState, useEffect } from 'react';
import { 
  HiRefresh,
  HiTrendingUp,
  HiTrendingDown,
  HiClock,
  HiUsers,
  HiCalendar,
  HiClipboardList,
  HiCheckCircle,
  HiExclamationTriangle,
  HiInformationCircle
} from 'react-icons/hi';
import { adminAPI, attendanceAPI } from '../../services/api';
import GlassCard from '../GlassCard';

function MonitoringPanel() {
  const [analytics, setAnalytics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy',
    uptime: '99.9%',
    responseTime: '120ms',
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchMonitoringData();
    const interval = setInterval(fetchMonitoringData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);
      const [analyticsResponse] = await Promise.all([
        adminAPI.getAnalytics(),
        // Add more monitoring endpoints as they become available
      ]);
      
      setAnalytics(analyticsResponse.data.data);
      
      // Simulate recent activity (in a real app, this would come from an API)
      setRecentActivity([
        {
          id: 1,
          type: 'registration',
          message: 'New user registered: john.doe@university.edu',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          icon: HiUsers,
          color: 'text-blue-400'
        },
        {
          id: 2,
          type: 'event',
          message: 'Event "Tech Talk 2024" was approved',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          icon: HiCheckCircle,
          color: 'text-green-400'
        },
        {
          id: 3,
          type: 'checkin',
          message: '15 users checked in to "Workshop: React Basics"',
          timestamp: new Date(Date.now() - 8 * 60 * 1000),
          icon: HiClipboardList,
          color: 'text-purple-400'
        },
        {
          id: 4,
          type: 'warning',
          message: 'Event "Music Festival" approaching capacity (95%)',
          timestamp: new Date(Date.now() - 12 * 60 * 1000),
          icon: HiExclamationTriangle,
          color: 'text-yellow-400'
        },
        {
          id: 5,
          type: 'club',
          message: 'New club "AI Research Group" created',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          icon: HiUsers,
          color: 'text-indigo-400'
        }
      ]);

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getHealthStatus = () => {
    if (systemHealth.status === 'healthy') {
      return { color: 'text-green-400', icon: HiCheckCircle, text: 'All Systems Operational' };
    } else if (systemHealth.status === 'warning') {
      return { color: 'text-yellow-400', icon: HiExclamationTriangle, text: 'Minor Issues Detected' };
    } else {
      return { color: 'text-red-400', icon: HiExclamationTriangle, text: 'System Issues' };
    }
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Real-time Monitoring</h2>
          <p className="text-gray-400">Last updated: {lastUpdate.toLocaleTimeString()}</p>
        </div>
        <button
          onClick={fetchMonitoringData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <HiRefresh className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* System Health */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">System Health</h3>
          <div className={`flex items-center space-x-2 ${healthStatus.color}`}>
            <healthStatus.icon size={20} />
            <span>{healthStatus.text}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{systemHealth.uptime}</div>
            <div className="text-gray-400 text-sm">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{systemHealth.responseTime}</div>
            <div className="text-gray-400 text-sm">Avg Response</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{analytics?.stats?.overview?.total_users || 0}</div>
            <div className="text-gray-400 text-sm">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {analytics?.stats?.upcoming_events?.this_week || 0}
            </div>
            <div className="text-gray-400 text-sm">Events This Week</div>
          </div>
        </div>
      </GlassCard>

      {/* Live Metrics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Events</p>
                <p className="text-2xl font-bold text-white">{analytics.stats.event_status.approved}</p>
                <div className="flex items-center space-x-1 text-green-400 text-sm">
                  <HiTrendingUp size={14} />
                  <span>+{analytics.stats.recent_activity.new_events_30d} this month</span>
                </div>
              </div>
              <HiCalendar className="text-green-400" size={32} />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Approvals</p>
                <p className="text-2xl font-bold text-white">{analytics.stats.event_status.pending}</p>
                <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                  <HiClock size={14} />
                  <span>Requires attention</span>
                </div>
              </div>
              <HiExclamationTriangle className="text-yellow-400" size={32} />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">New Registrations</p>
                <p className="text-2xl font-bold text-white">{analytics.stats.recent_activity.new_registrations_30d}</p>
                <div className="flex items-center space-x-1 text-blue-400 text-sm">
                  <HiTrendingUp size={14} />
                  <span>Last 30 days</span>
                </div>
              </div>
              <HiClipboardList className="text-blue-400" size={32} />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Attendance</p>
                <p className="text-2xl font-bold text-white">{analytics.stats.overview.total_attendance}</p>
                <div className="flex items-center space-x-1 text-purple-400 text-sm">
                  <HiCheckCircle size={14} />
                  <span>All time</span>
                </div>
              </div>
              <HiUsers className="text-purple-400" size={32} />
            </div>
          </GlassCard>
        </div>
      )}

      {/* Recent Activity Feed */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {recentActivity.map(activity => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
              <div className={`p-2 rounded-full bg-gray-700 ${activity.color}`}>
                <activity.icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{activity.message}</p>
                <p className="text-gray-400 text-xs">{formatTimeAgo(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-colors">
            <HiUsers className="text-blue-400" />
            <span className="text-white">View All Users</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-green-600/20 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors">
            <HiCalendar className="text-green-400" />
            <span className="text-white">Approve Events</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-purple-600/20 border border-purple-600/30 rounded-lg hover:bg-purple-600/30 transition-colors">
            <HiInformationCircle className="text-purple-400" />
            <span className="text-white">System Logs</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

export default MonitoringPanel;