import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  User,
  BarChart3,
  CheckSquare,
  Zap
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Clubs', href: '/clubs', icon: Users },
    ...(user?.role === 'student' ? [
      { name: 'My Registrations', href: '/registrations', icon: CheckSquare },
    ] : []),
    ...(user?.role === 'club_lead' ? [
      { name: 'My Club', href: '/my-club', icon: Settings },
    ] : []),
    ...(user?.role === 'admin' ? [
      { name: 'Admin Panel', href: '/admin', icon: BarChart3 },
    ] : []),
  ];

  return (
    <div className="min-h-screen gradient-bg">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 glass-effect backdrop-blur-xl">
        <div className="flex h-16 items-center justify-center border-b border-dark-700">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary-600 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">College Events</h1>
          </div>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`sidebar-item ${
                      isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-700">
          <div className="flex items-center mb-4 p-3 rounded-lg bg-dark-700/50">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize truncate">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:text-white hover:bg-dark-700 transition-all duration-200 group"
          >
            <LogOut className="mr-3 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-8 px-8 min-h-screen">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;