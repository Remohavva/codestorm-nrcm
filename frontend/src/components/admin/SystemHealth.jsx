import { useState, useEffect } from 'react';
import { 
  HiServer, 
  HiDatabase, 
  HiClock,
  HiCheckCircle,
  HiExclamationTriangle,
  HiXCircle,
  HiRefresh,
  HiChartBar,
  HiGlobeAlt,
  HiShieldCheck
} from 'react-icons/hi';
import GlassCard from '../GlassCard';

function SystemHealth({ systemHealth }) {
  const [healthData, setHealthData] = useState(systemHealth || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (systemHealth) {
      setHealthData(systemHealth);
    }
  }, [systemHealth]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'online':
        return <HiCheckCircle className="text-green-400" size={20} />;
      case 'warning':
        return <HiExclamationTriangle className="text-yellow-400" size={20} />;
      case 'error':
      case 'offline':
        return <HiXCircle className="text-red-400" size={20} />;
      default:
        return <HiClock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'online':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
      case 'offline':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const refreshHealthData = async () => {
    setLoading(true);
    // Simulate health check
    setTimeout(() => {
      setHealthData({
        ...healthData,
        last_check: new Date().toISOString()
      });
      setLoading(false);
    }, 1000);
  };

  const healthMetrics = [
    {
      title: 'System Status',
      value: healthData.status || 'unknown',
      icon: HiServer,
      status: healthData.status || 'unknown'
    },
    {
      title: 'Database',
      value: healthData.database_status || 'unknown',
      icon: HiDatabase,
      status: healthData.database_status || 'unknown'
    },
    {
      title: 'Uptime',
      value: healthData.uptime || '0%',
      icon: HiClock,
      status: 'healthy'
    },
    {
      title: 'Response Time',
      value: healthData.response_time || '0ms',
      icon: HiChartBar,
      status: 'healthy'
    },
    {
      title: 'Active Sessions',
      value: healthData.active_sessions || 0,
      icon: HiGlobeAlt,
      status: 'healthy'
    },
    {
      title: 'Security',
      value: 'Protected',
      icon: HiShieldCheck,
      status: 'healthy'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">System Health</h2>
        <button
          onClick={refreshHealthData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <HiRefresh className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overall Status */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {getStatusIcon(healthData.status)}
            <div>
              <h3 className="text-xl font-semibold text-white">
                System {healthData.status === 'healthy' ? 'Operational' : 'Status'}
              </h3>
              <p className="text-gray-400">
                Last checked: {healthData.last_check ? 
                  new Date(healthData.last_check).toLocaleString() : 
                  'Never'
                }
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            healthData.status === 'healthy' 
              ? 'bg-green-600/20 text-green-400' 
              : 'bg-yellow-600/20 text-yellow-400'
          }`}>
            {healthData.status === 'healthy' ? 'All Systems Go' : 'Monitoring'}
          </div>
        </div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthMetrics.map((metric, index) => (
            <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="text-gray-400" size={20} />
                {getStatusIcon(metric.status)}
              </div>
              <div>
                <p className="text-gray-400 text-sm">{metric.title}</p>
                <p className="text-white font-semibold">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">CPU Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-700 rounded-full">
                  <div className="w-1/3 h-full bg-green-500 rounded-full"></div>
                </div>
                <span className="text-white text-sm">33%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Memory Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-700 rounded-full">
                  <div className="w-1/2 h-full bg-yellow-500 rounded-full"></div>
                </div>
                <span className="text-white text-sm">50%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Disk Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-700 rounded-full">
                  <div className="w-1/4 h-full bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-white text-sm">25%</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 bg-gray-800/50 rounded">
              <HiCheckCircle className="text-green-400" size={16} />
              <div className="flex-1">
                <p className="text-white text-sm">Database backup completed</p>
                <p className="text-gray-400 text-xs">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-gray-800/50 rounded">
              <HiCheckCircle className="text-green-400" size={16} />
              <div className="flex-1">
                <p className="text-white text-sm">Security scan passed</p>
                <p className="text-gray-400 text-xs">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-gray-800/50 rounded">
              <HiExclamationTriangle className="text-yellow-400" size={16} />
              <div className="flex-1">
                <p className="text-white text-sm">High memory usage detected</p>
                <p className="text-gray-400 text-xs">1 hour ago</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* System Information */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Server Version</p>
            <p className="text-white font-medium">v1.0.0</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Node.js Version</p>
            <p className="text-white font-medium">v18.17.0</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Database Version</p>
            <p className="text-white font-medium">PostgreSQL 15</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Last Backup</p>
            <p className="text-white font-medium">
              {healthData.last_backup ? 
                new Date(healthData.last_backup).toLocaleDateString() : 
                'Never'
              }
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export default SystemHealth;