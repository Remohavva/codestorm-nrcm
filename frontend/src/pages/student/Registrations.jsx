import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCalendar, HiClock, HiLocationMarker, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { myRegistrations, cancelRegistration } from '../../data/mockData';
import GlassCard from '../../components/GlassCard';
import './Registrations.css';

function Registrations() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState(myRegistrations);

  const handleCancelRegistration = (eventId) => {
    if (window.confirm('Are you sure you want to cancel your registration?')) {
      cancelRegistration(eventId);
      setRegistrations(registrations.filter(reg => reg.eventId !== eventId));
      alert('Registration cancelled successfully!');
    }
  };
  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed':
        return <HiCheckCircle className="status-icon confirmed" />;
      case 'pending':
        return <HiClock className="status-icon pending" />;
      case 'cancelled':
        return <HiXCircle className="status-icon cancelled" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="registrations-page">
      <div className="registrations-header">
        <h1>My Registrations</h1>
        <p>Events you've registered for</p>
      </div>

      {registrations.length === 0 ? (
        <div className="empty-state">
          <p>You haven't registered for any events yet.</p>
          <p>Explore events in the Feed to get started!</p>
        </div>
      ) : (
        <div className="registrations-list">
          {registrations.map((registration) => {
            const event = registration.event;
            return (
              <GlassCard key={registration.eventId} className="registration-card">
                <div className="registration-header">
                  <div>
                    <h3 className="event-title">{event.title}</h3>
                    <span className="club-name">{event.club}</span>
                  </div>
                  <div className="registration-status">
                    {getStatusIcon(registration.status)}
                    <span className={`status-text ${registration.status}`}>
                      {getStatusText(registration.status)}
                    </span>
                  </div>
                </div>

                <p className="event-description">{event.description}</p>

                <div className="event-details">
                  <div className="detail-item">
                    <HiCalendar className="detail-icon" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="detail-item">
                    <HiClock className="detail-icon" />
                    <span>{event.time}</span>
                  </div>
                  <div className="detail-item">
                    <HiLocationMarker className="detail-icon" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="event-meta">
                  <div className="meta-item">
                    <span className="meta-label">Type:</span>
                    <span className="meta-value">{event.type}</span>
                  </div>
                  {event.prize && (
                    <div className="meta-item">
                      <span className="meta-label">Prize:</span>
                      <span className="meta-value prize">{event.prize}</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <span className="meta-label">Registered:</span>
                    <span className="meta-value">{new Date(registration.registeredAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="registration-actions">
                  <button 
                    className="action-btn secondary"
                    onClick={() => navigate(`/student/dashboard/events/${event.id}`)}
                  >
                    View Details
                  </button>
                  {registration.status === 'confirmed' && new Date(event.date) >= new Date() && (
                    <button 
                      className="action-btn danger"
                      onClick={() => handleCancelRegistration(registration.eventId)}
                    >
                      Cancel Registration
                    </button>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Registrations;
