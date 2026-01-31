import { 
  HiExclamationTriangle, 
  HiInformationCircle, 
  HiCheckCircle,
  HiX,
  HiArrowRight
} from 'react-icons/hi';
import GlassCard from '../GlassCard';

function AdminAlerts({ alerts, onRefresh }) {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <HiExclamationTriangle className="text-yellow-400" size={20} />;
      case 'error':
        return <HiExclamationTriangle className="text-red-400" size={20} />;
      case 'success':
        return <HiCheckCircle className="text-green-400" size={20} />;
      default:
        return <HiInformationCircle className="text-blue-400" size={20} />;
    }
  };

  const getAlertBorderColor = (type) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/5';
      case 'error':
        return 'border-red-500/30 bg-red-500/5';
      case 'success':
        return 'border-green-500/30 bg-green-500/5';
      default:
        return 'border-blue-500/30 bg-blue-500/5';
    }
  };

  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
          <HiExclamationTriangle className="text-yellow-400" />
          <span>System Alerts ({alerts.length})</span>
        </h2>
        <button
          onClick={onRefresh}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <HiX size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {alerts.map((alert, index) => (
          <GlassCard 
            key={index} 
            className={`p-4 border ${getAlertBorderColor(alert.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium text-sm">{alert.title}</h3>
                  {alert.count && (
                    <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                      {alert.count}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3">{alert.message}</p>
                {alert.action_url && (
                  <button className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                    <span>View Details</span>
                    <HiArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export default AdminAlerts;