import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiCalendar, 
  HiClock, 
  HiLocationMarker, 
  HiUserGroup,
  HiTag,
  HiArrowRight,
  HiFilter
} from 'react-icons/hi';
import { eventsAPI, clubsAPI } from '../../services/api';
import GlassCard from '../../components/GlassCard';
import './Events.css';

function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Competition', 'Workshop', 'Performance', 'Exhibition'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch events and clubs in parallel
      const [eventsResponse, clubsResponse] = await Promise.all([
        eventsAPI.getAll({ status: 'approved', upcoming: true }),
        clubsAPI.getAll()
      ]);
      
      setEvents(eventsResponse.data.data.events || []);
      setClubs(clubsResponse.data.data.clubs || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to empty arrays
      setEvents([]);
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'All' || event.type === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.club?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getClubInfo = (clubId) => {
    return clubs.find(c => c.id === clubId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="events-page">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <div>
          <h1>All Events</h1>
          <p>Discover and register for upcoming events</p>
        </div>
        <div className="events-count">
          <span>{filteredEvents.length} events</span>
        </div>
      </div>

      <div className="events-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="events-search"
          />
        </div>
        <div className="category-filters">
          <HiFilter className="filter-icon" />
          {categories.map(category => (
            <button
              key={category}
              className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="empty-events">
          <p>No events found matching your criteria.</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => {
            const club = event.club || getClubInfo(event.club_id);
            return (
              <GlassCard key={event.id} className="event-card">
                <div className="event-card-header">
                  <div className="event-club-badge">
                    🎯
                    <span>{club?.name || 'Unknown Club'}</span>
                  </div>
                  <span className={`event-status-badge ${event.status}`}>
                    {event.status}
                  </span>
                </div>

                <h3 className="event-card-title">{event.title}</h3>
                <p className="event-card-description">{event.description}</p>

                <div className="event-card-details">
                  <div className="event-detail-item">
                    <HiCalendar className="detail-icon" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="event-detail-item">
                    <HiClock className="detail-icon" />
                    <span>{formatTime(event.date)}</span>
                  </div>
                  <div className="event-detail-item">
                    <HiLocationMarker className="detail-icon" />
                    <span>{event.venue}</span>
                  </div>
                </div>

                <div className="event-card-footer">
                  <div className="event-stats">
                    <div className="stat">
                      <HiUserGroup className="stat-icon" />
                      <span>{event.registration_count || 0}/{event.capacity}</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="event-view-btn"
                  onClick={() => navigate(`/student/dashboard/events/${event.id}`)}
                >
                  View Details & Register
                  <HiArrowRight size={18} />
                </button>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Events;
