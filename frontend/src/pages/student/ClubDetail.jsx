import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiArrowLeft, 
  HiUserGroup, 
  HiCalendar, 
  HiTag,
  HiStar,
  HiMail,
  HiAcademicCap,
  HiPhotograph
} from 'react-icons/hi';
import { clubs, clubDetails, userClubMemberships, joinClub, leaveClub, eventGallery } from '../../data/mockData';
import GlassCard from '../../components/GlassCard';
import './ClubDetail.css';

function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clubId = parseInt(id);
  const club = clubDetails[clubId] || clubs.find(c => c.id === clubId);
  const [isMember, setIsMember] = useState(userClubMemberships.includes(clubId));

  const handleJoinClub = () => {
    if (window.confirm(`Are you sure you want to join ${club.name}?`)) {
      joinClub(clubId);
      setIsMember(true);
      alert(`Successfully joined ${club.name}!`);
    }
  };

  const handleLeaveClub = () => {
    if (window.confirm(`Are you sure you want to leave ${club.name}?`)) {
      leaveClub(clubId);
      setIsMember(false);
      alert(`You have left ${club.name}.`);
    }
  };

  if (!club) {
    return (
      <div className="club-detail-page">
        <div className="error-state">
          <p>Club not found</p>
          <button onClick={() => navigate('/student/dashboard/clubs')}>Back to Clubs</button>
        </div>
      </div>
    );
  }

  const detailInfo = clubDetails[clubId];

  return (
    <div className="club-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <HiArrowLeft size={20} />
        Back
      </button>

      <div className="club-header-section">
        <div className="club-logo-hero">{club.logo}</div>
        <div className="club-header-info">
          <h1>{club.name}</h1>
          <p className="club-category">{club.category}</p>
          <p className="club-description-main">{club.description}</p>
          <div className="club-stats-header">
            <div className="stat">
              <HiUserGroup className="stat-icon" />
              <span>{club.members} Members</span>
            </div>
            <div className="stat">
              <HiCalendar className="stat-icon" />
              <span>{club.events} Events</span>
            </div>
          </div>
        </div>
      </div>

      <div className="club-content">
        <div className="club-main">
          {detailInfo && detailInfo.history && (
            <GlassCard className="history-card">
              <h2>History</h2>
              <p className="history-text">{detailInfo.history}</p>
            </GlassCard>
          )}

          <GlassCard className="tags-section">
            <h2>Interests & Tags</h2>
            <div className="tags-list">
              {club.tags.map((tag, index) => (
                <span key={index} className="tag-item">
                  <HiTag className="tag-icon" />
                  {tag}
                </span>
              ))}
            </div>
          </GlassCard>

          {detailInfo && detailInfo.achievements && detailInfo.achievements.length > 0 && (
            <GlassCard className="achievements-card">
              <h2>Achievements</h2>
              <div className="achievements-list">
                {detailInfo.achievements.map((achievement, index) => (
                  <div key={index} className="achievement-item">
                    <HiStar className="trophy-icon" />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {detailInfo && detailInfo.pastEvents && detailInfo.pastEvents.length > 0 && (
            <GlassCard className="past-events-card">
              <h2>Past Events</h2>
              <div className="past-events-list">
                {detailInfo.pastEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="past-event-item clickable"
                    onClick={() => navigate(`/student/dashboard/past-events/${event.id}`)}
                  >
                    <div className="event-date-small">
                      <HiCalendar className="date-icon" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="event-info">
                      <div className="event-title-small">{event.title}</div>
                      <div className="event-participants">{event.participants} participants</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {eventGallery[clubId] && eventGallery[clubId].length > 0 && (
            <GlassCard className="event-gallery-card">
              <div className="gallery-header">
                <HiPhotograph className="gallery-icon" />
                <h2>Event Gallery</h2>
              </div>
              <div className="gallery-grid">
                {eventGallery[clubId].map((item) => (
                  <div key={item.id} className="gallery-item">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="gallery-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="gallery-overlay">
                      <div className="gallery-title">{item.title}</div>
                      <div className="gallery-date">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>

        <div className="club-sidebar">
          <GlassCard className="leadership-card">
            <h3>Leadership</h3>
            {detailInfo && detailInfo.coordinator && (
              <div className="leader-item">
                <div className="leader-avatar">
                  <HiAcademicCap size={20} />
                </div>
                <div className="leader-info">
                  <div className="leader-name">{detailInfo.coordinator.name}</div>
                  <div className="leader-role">{detailInfo.coordinator.role}</div>
                  <div className="leader-email">
                    <HiMail size={14} />
                    {detailInfo.coordinator.email}
                  </div>
                </div>
              </div>
            )}
            {detailInfo && detailInfo.president && (
              <div className="leader-item">
                <div className="leader-avatar">
                  <HiUserGroup size={20} />
                </div>
                <div className="leader-info">
                  <div className="leader-name">{detailInfo.president.name}</div>
                  <div className="leader-role">{detailInfo.president.role} • {detailInfo.president.year}</div>
                  <div className="leader-email">
                    <HiMail size={14} />
                    {detailInfo.president.email}
                  </div>
                </div>
              </div>
            )}
            {detailInfo && detailInfo.vicePresident && (
              <div className="leader-item">
                <div className="leader-avatar">
                  <HiUserGroup size={20} />
                </div>
                <div className="leader-info">
                  <div className="leader-name">{detailInfo.vicePresident.name}</div>
                  <div className="leader-role">{detailInfo.vicePresident.role} • {detailInfo.vicePresident.year}</div>
                  <div className="leader-email">
                    <HiMail size={14} />
                    {detailInfo.vicePresident.email}
                  </div>
                </div>
              </div>
            )}
          </GlassCard>

          <GlassCard className="join-club-card">
            {isMember ? (
              <>
                <h3>You're a Member</h3>
                <p>You are currently a member of this club.</p>
                <button className="join-btn leave" onClick={handleLeaveClub}>
                  Leave Club
                </button>
              </>
            ) : (
              <>
                <h3>Join This Club</h3>
                <p>Become a member and participate in club activities and events.</p>
                <button className="join-btn" onClick={handleJoinClub}>
                  Join Club
                </button>
              </>
            )}
          </GlassCard>

          {club.socialLinks && (
            <GlassCard className="social-links-card">
              <h3>Connect</h3>
              <div className="social-links">
                {club.socialLinks.website && (
                  <a href={`https://${club.socialLinks.website}`} className="social-link" target="_blank" rel="noopener noreferrer">
                    Website
                  </a>
                )}
                {club.socialLinks.instagram && (
                  <a href={`https://instagram.com/${club.socialLinks.instagram.replace('@', '')}`} className="social-link" target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                )}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClubDetail;
