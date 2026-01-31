import { useState } from 'react';
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
import { events, eventFees, clubs } from '../../data/mockData';
import GlassCard from '../../components/GlassCard';
import './EventDetail.css';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === parseInt(id));
  const club = event ? clubs.find(c => c.id === event.clubId) : null;
  const fee = event ? (eventFees[event.id] || { amount: 0, currency: 'INR' }) : { amount: 0, currency: 'INR' };
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState('details'); // 'details', 'payment', 'success'

  if (!event) {
    return (
      <div className="event-detail-page">
        <div className="error-state">
          <p>Event not found</p>
          <button onClick={() => navigate('/student/dashboard/feed')}>Back to Feed</button>
        </div>
      </div>
    );
  }

  const handleRegister = () => {
    if (fee && fee.amount > 0) {
      setShowPayment(true);
      setPaymentStep('payment');
    } else {
      setIsRegistered(true);
      setPaymentStep('success');
    }
  };

  const RAZORPAY_PAYMENT_LINK = 'https://razorpay.me/@golivignesh';

  const handlePayWithRazorpay = () => {
    window.open(RAZORPAY_PAYMENT_LINK, '_blank', 'noopener,noreferrer');
  };

  const handlePaymentComplete = () => {
    setIsRegistered(true);
    setPaymentStep('success');
    setShowPayment(false);
  };

  const isEventPast = new Date(event.date) < new Date();
  const isEventFull = event.registered >= event.capacity;

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
            </div>
            <h1 className="event-title">{event.title}</h1>
            <p className="event-description">{event.description}</p>
          </div>

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
                  <div className="detail-label">Capacity</div>
                  <div className="detail-value">
                    {event.registered} / {event.capacity} registered
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
        </div>

        <div className="event-sidebar">
          <GlassCard className="registration-card">
            {paymentStep === 'success' ? (
              <div className="success-state">
                <HiCheckCircle className="success-icon" />
                <h3>Registration Successful!</h3>
                <p>You have successfully registered for this event.</p>
                <button 
                  className="view-registrations-btn"
                  onClick={() => navigate('/student/dashboard/registrations')}
                >
                  View My Registrations
                </button>
              </div>
            ) : showPayment && paymentStep === 'payment' ? (
              <div className="payment-section payment-section-beautified">
                <div className="razorpay-header">
                  <div className="razorpay-logo">
                    <span className="razorpay-text">Razorpay</span>
                  </div>
                  <span className="payment-secure">Secure payment</span>
                </div>
                <h3>Pay event fee</h3>
                <div className="payment-details">
                  <div className="payment-row">
                    <span>Event</span>
                    <span className="event-name-payment">{event.title}</span>
                  </div>
                  <div className="payment-row">
                    <span>Amount</span>
                    <span>₹{fee ? fee.amount : 0}</span>
                  </div>
                  <div className="payment-row total">
                    <span>Total</span>
                    <span className="total-amount">₹{fee ? fee.amount : 0}</span>
                  </div>
                </div>
                <p className="payment-instruction">
                  You will be redirected to Razorpay to complete the payment of <strong>₹{fee ? fee.amount : 0}</strong>.
                </p>
                <button className="pay-btn razorpay-pay-btn" onClick={handlePayWithRazorpay}>
                  <span>Pay ₹{fee ? fee.amount : 0}</span>
                  <span className="pay-btn-sub">via Razorpay</span>
                </button>
                <p className="payment-confirm-label">Already paid?</p>
                <button className="confirm-paid-btn" onClick={handlePaymentComplete}>
                  Confirm payment completed
                </button>
                <button 
                  className="cancel-payment-btn"
                  onClick={() => {
                    setShowPayment(false);
                    setPaymentStep('details');
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <h3>Registration</h3>
                {fee && fee.amount > 0 && (
                  <div className="fee-info">
                    <span className="fee-label">Registration Fee:</span>
                    <span className="fee-amount">₹{fee.amount}</span>
                  </div>
                )}
                {fee && fee.amount === 0 && (
                  <div className="fee-info free">
                    <span>Free Event</span>
                  </div>
                )}
                <div className="registration-status">
                  <div className="status-item">
                    <span>Registered:</span>
                    <span>{event.registered}</span>
                  </div>
                  <div className="status-item">
                    <span>Available:</span>
                    <span>{event.capacity - event.registered}</span>
                  </div>
                </div>
                {isEventPast ? (
                  <button className="register-btn" disabled>
                    Event Ended
                  </button>
                ) : isEventFull ? (
                  <button className="register-btn" disabled>
                    Event Full
                  </button>
                ) : (
                  <button className="register-btn primary" onClick={handleRegister}>
                    {fee && fee.amount > 0 ? `Register & Pay ₹${fee.amount}` : 'Register Now'}
                  </button>
                )}
                <p className="deadline-text">
                  Registration deadline: {new Date(event.deadline).toLocaleDateString()}
                </p>
              </>
            )}
          </GlassCard>

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

export default EventDetail;
