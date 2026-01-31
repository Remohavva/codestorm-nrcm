import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUserGroup, HiCalendar, HiTag, HiArrowRight } from 'react-icons/hi';
import { clubs } from '../../data/mockData';
import GlassCard from '../../components/GlassCard';
import './Clubs.css';

function Clubs() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Technology', 'Arts', 'Academic', 'Business'];

  const filteredClubs = selectedCategory === 'All' 
    ? clubs 
    : clubs.filter(club => club.category === selectedCategory);

  return (
    <div className="clubs-page">
      <div className="clubs-header">
        <div>
          <h1>Explore Clubs</h1>
          <p>Discover and join clubs that match your interests</p>
        </div>
      </div>

      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="clubs-grid">
        {filteredClubs.map(club => (
          <GlassCard key={club.id} className="club-card">
            <div className="club-header">
              <div className="club-logo">{club.logo}</div>
              <div className="club-info">
                <h3 className="club-name">{club.name}</h3>
                <span className="club-category">{club.category}</span>
              </div>
            </div>

            <p className="club-description">{club.description}</p>

            <div className="club-stats">
              <div className="stat-item">
                <HiUserGroup className="stat-icon" />
                <span>{club.members} members</span>
              </div>
              <div className="stat-item">
                <HiCalendar className="stat-icon" />
                <span>{club.events} events</span>
              </div>
            </div>

            <div className="club-tags">
              {club.tags.map(tag => (
                <span key={tag} className="club-tag">
                  <HiTag className="tag-icon" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="club-upcoming">
              <span className="upcoming-label">Upcoming:</span>
              <span className="upcoming-event">{club.upcomingEvent}</span>
            </div>

            <button 
              className="club-view-btn"
              onClick={() => navigate(`/student/dashboard/clubs/${club.id}`)}
            >
              View Club
              <HiArrowRight size={18} />
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export default Clubs;
