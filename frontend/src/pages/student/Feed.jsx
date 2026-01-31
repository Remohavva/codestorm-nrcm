import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiHeart, HiOutlineHeart, HiChat, HiShare, HiBookmark, HiOutlineBookmark, HiCalendar, HiLocationMarker, HiClock } from 'react-icons/hi';
import { feedPosts, events } from '../../data/mockData';
import GlassCard from '../../components/GlassCard';
import './Feed.css';

function Feed() {
  const [posts, setPosts] = useState(feedPosts);
  const navigate = useNavigate();

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleRegister = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isRegistered: !post.isRegistered }
        : post
    ));
  };

  const getEventDetails = (eventId) => {
    return events.find(e => e.id === eventId);
  };

  return (
    <div className="feed-page">
      <div className="feed-container">
        <div className="feed-header">
          <h1>Feed</h1>
          <p>Stay updated with events and announcements</p>
        </div>

        <div className="feed-posts">
          {posts.map((post) => {
            const eventDetails = post.content.eventId ? getEventDetails(post.content.eventId) : null;
            
            return (
              <GlassCard key={post.id} className="feed-post">
                <div className="post-header">
                  <div className="post-author">
                    <div className="author-avatar">{post.club.charAt(0)}</div>
                    <div className="author-info">
                      <div className="author-name">{post.author}</div>
                      <div className="post-meta">
                        <span className="club-name">{post.club}</span>
                        <span className="post-time">{post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <button className="post-bookmark">
                    {post.isRegistered ? <HiBookmark size={20} /> : <HiOutlineBookmark size={20} />}
                  </button>
                </div>

                <div className="post-content">
                  <h3 
                    className="post-title clickable"
                    onClick={() => eventDetails && navigate(`/student/dashboard/events/${eventDetails.id}`)}
                  >
                    {post.content.title}
                  </h3>
                  <p className="post-description">{post.content.description}</p>
                  
                  {post.image && (
                    <div className="post-image-container">
                      <img 
                        src={post.image} 
                        alt={post.content.title}
                        className="post-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {eventDetails && (
                    <div className="event-details-card">
                      <div className="event-detail-row">
                        <HiCalendar className="event-icon" />
                        <span>{new Date(eventDetails.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="event-detail-row">
                        <HiClock className="event-icon" />
                        <span>{eventDetails.time}</span>
                      </div>
                      <div className="event-detail-row">
                        <HiLocationMarker className="event-icon" />
                        <span>{eventDetails.location}</span>
                      </div>
                      <div className="event-stats">
                        <span>{eventDetails.registered} registered</span>
                        <span>•</span>
                        <span>{eventDetails.capacity - eventDetails.registered} spots left</span>
                      </div>
                      {!post.isRegistered && (
                        <button 
                          className="event-register-btn"
                          onClick={() => navigate(`/student/dashboard/events/${eventDetails.id}`)}
                        >
                          View Details & Register
                        </button>
                      )}
                      {post.isRegistered && (
                        <button 
                          className="event-registered-btn"
                          onClick={() => navigate(`/student/dashboard/events/${eventDetails.id}`)}
                        >
                          View Event Details
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="post-footer">
                  <div className="post-actions">
                    <button 
                      className="action-btn"
                      onClick={() => handleLike(post.id)}
                    >
                      {post.isLiked ? <HiHeart size={20} className="liked" /> : <HiOutlineHeart size={20} />}
                      <span>{post.likes}</span>
                    </button>
                    <button className="action-btn">
                      <HiChat size={20} />
                      <span>{post.comments}</span>
                    </button>
                    <button className="action-btn">
                      <HiShare size={20} />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Feed;
