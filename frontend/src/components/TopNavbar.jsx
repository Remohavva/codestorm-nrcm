import { useNavigate } from 'react-router-dom';
import { HiBell, HiSearch, HiMenu } from 'react-icons/hi';
import { userProfile } from '../data/mockData';
import './TopNavbar.css';

function TopNavbar({ onMenuClick }) {
  const navigate = useNavigate();

  return (
    <div className="top-navbar">
      <button className="mobile-menu-btn" onClick={onMenuClick}>
        <HiMenu size={24} />
      </button>
      
      <div className="navbar-search">
        <HiSearch className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Search events, clubs, discussions..." 
          className="search-input"
        />
      </div>

      <div className="navbar-actions">
        <button className="navbar-icon-btn" title="Notifications">
          <HiBell size={20} />
          <span className="notification-badge">3</span>
        </button>
        <div 
          className="navbar-profile"
          onClick={() => navigate('/student/dashboard/profile')}
          title="Profile"
        >
          <div className="profile-avatar">{userProfile.avatar}</div>
        </div>
      </div>
    </div>
  );
}

export default TopNavbar;
