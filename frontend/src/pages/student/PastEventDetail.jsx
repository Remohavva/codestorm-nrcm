import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiCalendar, 
  HiClock, 
  HiLocationMarker, 
  HiUserGroup, 
  HiTag,
  HiArrowLeft,
  HiCheckCircle
} from 'react-icons/hi';
import { pastEventsList, clubs } from '../../data/mockData';
import GlassCard from '../../components/GlassCard';
import './EventDetail.css';

function PastEventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = pastEventsList.find(e => e.id === parseInt(id));
  const club = event ? clubs.find(c => c.id === event.clubId) : null;

  if (!event) {
    return (
      <div className="event-detail-page">
        <div className="error-state">
          <p>Event not found</p>
          <button onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <HiArrowLeft size={20} />
        Back
      </button>

      <div className="event-detail-container">
        <div className="event-main">
          <div className="event-header">
            <div className="event-club-info">
              <span className="club-badge">{event.club}</span>
              <span className="event-type">{event.type}</span>
              <span className="event-status-completed">Completed</span>
            </div>
            <h1 className="event-title">{event.title}</h1>
            <p className="event-description">{event.description}</p>
          </div>

          {event.image && (
            <div className="event-image-container">
              <img src={event.image} alt={event.title} className="event-main-image" />
            </div>
          )}

          <GlassCard className="event-details-card">
            <h3>Event Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <HiCalendar className="detail-icon" />
                <div>
                  <div className="detail-label">Date</div>
                  <div className="detail-value">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
              <div className="detail-item">
                <HiClock className="detail-icon" />
                <div>
                  <div className="detail-label">Time</div>
                  <div className="detail-value">{event.time}</div>
                </div>
              </div>
              <div className="detail-item">
                <HiLocationMarker className="detail-icon" />
                <div>
                  <div className="detail-label">Location</div>
                  <div className="detail-value">{event.location}</div>
                </div>
              </div>
              <div className="detail-item">
                <HiUserGroup className="detail-icon" />
                <div>
                  <div className="detail-label">Participants</div>
                  <div className="detail-value">
                    {event.registered} participants
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {event.requirements && event.requirements.length > 0 && (
            <GlassCard className="requirements-card">
              <h3>Requirements</h3>
              <ul className="requirements-list">
                {event.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </GlassCard>
          )}

          {event.tags && event.tags.length > 0 && (
            <GlassCard className="tags-card">
              <h3>Tags</h3>
              <div className="tags-list">
                {event.tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    <HiTag className="tag-icon" />
                    {tag}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}

          {event.prize && (
            <GlassCard className="prize-card">
              <h3>Prize</h3>
              <div className="prize-amount">{event.prize}</div>
            </GlassCard>
          )}

          <GlassCard className="completed-badge-card">
            <div className="completed-info">
              <HiCheckCircle className="completed-icon" />
              <div>
                <h3>Event Completed</h3>
                <p>This event has already taken place. Thank you to all participants!</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="event-sidebar">
          {club && (
            <GlassCard className="club-info-card">
              <h3>Organized by</h3>
              <div className="club-details">
                <div className="club-logo-large">{club.logo}</div>
                <div className="club-name">{club.name}</div>
                <p className="club-description">{club.description}</p>
                <button 
                  className="view-club-btn"
                  onClick={() => navigate(`/student/dashboard/clubs/${club.id}`)}
                >
                  View Club
                </button>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

export default PastEventDetail;
