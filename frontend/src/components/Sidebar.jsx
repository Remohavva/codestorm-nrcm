import { NavLink, useNavigate } from 'react-router-dom';
import { 
  HiHome, 
  HiUserGroup, 
  HiClipboardList, 
  HiChatAlt2,
  HiUser,
  HiCalendar,
  HiLogout,
  HiMenu,
  HiX
} from 'react-icons/hi';
import './Sidebar.css';

function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/student/dashboard/feed', icon: HiHome, label: 'Feed' },
    { path: '/student/dashboard/events', icon: HiCalendar, label: 'Events' },
    { path: '/student/dashboard/clubs', icon: HiUserGroup, label: 'Clubs' },
    { path: '/student/dashboard/registrations', icon: HiClipboardList, label: 'My Registrations' },
    { path: '/student/dashboard/discussions', icon: HiChatAlt2, label: 'Discussions' },
    { path: '/student/dashboard/profile', icon: HiUser, label: 'Profile' }
  ];

  const handleLogout = () => {
    // Mock logout - clear any stored data and redirect
    if (window.confirm('Are you sure you want to logout?')) {
      navigate('/login');
    }
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">CampusHub</h2>
          <button className="sidebar-toggle" onClick={onToggle}>
            {isOpen ? <HiX size={20} /> : <HiMenu size={20} />}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <Icon className="nav-icon" />
                {isOpen && <span className="nav-label">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <HiLogout className="nav-icon" />
            {isOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </div>
      
      {!isOpen && (
        <div className="sidebar-overlay" onClick={onToggle} />
      )}
    </>
  );
}

export default Sidebar;
