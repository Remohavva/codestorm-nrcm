import { useState } from 'react';
import { HiCalendar, HiAcademicCap, HiTag, HiStar, HiMail, HiUserGroup, HiPencil } from 'react-icons/hi';
import { userProfile, pastEvents, events, myRegistrations, updateUserProfile } from '../../data/mockData';
import GlassCard from '../../components/GlassCard';
import './Profile.css';

function Profile() {
  const [profile, setProfile] = useState(userProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    bio: profile.bio,
    interests: profile.interests.join(', '),
    year: profile.year,
    course: profile.course
  });
  const upcomingEvents = myRegistrations
    .filter(reg => reg.status === 'confirmed')
    .map(reg => reg.event)
    .filter(event => event && new Date(event.date) >= new Date());

  const pastEventsList = pastEvents;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedProfile = updateUserProfile({
      name: editForm.name,
      bio: editForm.bio,
      interests: editForm.interests.split(',').map(i => i.trim()).filter(i => i),
      year: editForm.year,
      course: editForm.course
    });
    setProfile(updatedProfile);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditForm({
      name: profile.name,
      bio: profile.bio,
      interests: profile.interests.join(', '),
      year: profile.year,
      course: profile.course
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-large">{profile.avatar}</div>
        <div className="profile-info">
          <div className="profile-name-row">
            <h1>{profile.name}</h1>
            <button className="edit-profile-btn" onClick={handleEdit}>
              <HiPencil size={18} />
              Edit Profile
            </button>
          </div>
          <p className="profile-email">{profile.email}</p>
          <div className="profile-meta">
            <span><HiAcademicCap /> {profile.year}</span>
            <span>•</span>
            <span>{profile.course}</span>
            <span>•</span>
            <span>ID: {profile.studentId}</span>
          </div>
        </div>
      </div>

      {isEditing ? (
        <GlassCard className="edit-profile-card">
          <h2>Edit Profile</h2>
          <div className="edit-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Year</label>
              <select
                value={editForm.year}
                onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
            <div className="form-group">
              <label>Course</label>
              <input
                type="text"
                value={editForm.course}
                onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Interests (comma-separated)</label>
              <input
                type="text"
                value={editForm.interests}
                onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                placeholder="Programming, AI/ML, Web Development"
              />
            </div>
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </GlassCard>
      ) : (
        <>
          <div className="profile-bio">
            <p>{profile.bio}</p>
            <p className="join-date">Member since {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="profile-stats">
            <GlassCard className="stat-card">
              <div className="stat-value">{profile.totalEvents}</div>
              <div className="stat-label">Events Attended</div>
            </GlassCard>
            <GlassCard className="stat-card">
              <div className="stat-value">{profile.clubs.length}</div>
              <div className="stat-label">Clubs Joined</div>
            </GlassCard>
            <GlassCard className="stat-card">
              <div className="stat-value">{profile.certificates}</div>
              <div className="stat-label">Certificates</div>
            </GlassCard>
          </div>

          <div className="profile-sections">
            <GlassCard className="profile-section">
              <h2>Interests</h2>
              <div className="interests-list">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="interest-tag">
                    <HiTag className="tag-icon" />
                    {interest}
                  </span>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="profile-section">
              <h2>My Clubs</h2>
              <div className="clubs-list">
                {profile.clubs.map(club => (
              <div key={club.id} className="club-item">
                <div className="club-info">
                  <HiUserGroup className="club-icon" />
                  <div>
                    <div className="club-name">{club.name}</div>
                    <div className="club-role">{club.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

            <GlassCard className="profile-section">
              <h2>Upcoming Events</h2>
              {upcomingEvents.length === 0 ? (
                <p className="empty-text">No upcoming events</p>
              ) : (
                <div className="events-list">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="event-item">
                      <div className="event-date">
                        <HiCalendar className="date-icon" />
                        <div>
                          <div className="date-day">{new Date(event.date).getDate()}</div>
                          <div className="date-month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                        </div>
                      </div>
                      <div className="event-details">
                        <div className="event-title">{event.title}</div>
                        <div className="event-club">{event.club}</div>
                        <div className="event-location">{event.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            <GlassCard className="profile-section">
              <h2>Past Events</h2>
              {pastEventsList.length === 0 ? (
                <p className="empty-text">No past events</p>
              ) : (
                <div className="events-list">
                  {pastEventsList.map(event => (
                    <div key={event.id} className="event-item past">
                      <div className="event-date">
                        <HiCalendar className="date-icon" />
                        <div>
                          <div className="date-day">{new Date(event.date).getDate()}</div>
                          <div className="date-month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                        </div>
                      </div>
                      <div className="event-details">
                        <div className="event-title">{event.title}</div>
                        <div className="event-club">{event.club}</div>
                        {event.certificate && (
                          <div className="certificate-badge">
                            <HiStar className="trophy-icon" />
                            Certificate Available
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
