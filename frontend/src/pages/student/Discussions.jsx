import { useState } from 'react';
import { HiPaperAirplane, HiDotsVertical, HiTag, HiUserGroup } from 'react-icons/hi';
import { discussions } from '../../data/mockData';
import GlassCard from '../../components/GlassCard';
import './Discussions.css';

function Discussions() {
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [message, setMessage] = useState('');
  const [threadMessages, setThreadMessages] = useState({});

  const handleSelectDiscussion = (discussion) => {
    setSelectedDiscussion(discussion);
    if (!threadMessages[discussion.id]) {
      // Initialize with some mock replies
      setThreadMessages({
        ...threadMessages,
        [discussion.id]: [
          {
            id: 1,
            author: discussion.author,
            content: discussion.title,
            timestamp: discussion.timestamp,
            isOriginal: true
          },
          {
            id: 2,
            author: 'Maria Garcia',
            content: 'Great question! I think Python is the best for beginners because of its simple syntax.',
            timestamp: '2 hours ago',
            isOriginal: false
          },
          {
            id: 3,
            author: 'Alex Chen',
            content: 'I agree with Maria. Python is definitely the way to go. Also check out freeCodeCamp for tutorials!',
            timestamp: '1 hour ago',
            isOriginal: false
          }
        ]
      });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedDiscussion) return;

    const newMessage = {
      id: Date.now(),
      author: 'You',
      content: message,
      timestamp: 'Just now',
      isOriginal: false
    };

    setThreadMessages({
      ...threadMessages,
      [selectedDiscussion.id]: [
        ...(threadMessages[selectedDiscussion.id] || []),
        newMessage
      ]
    });

    setMessage('');
  };

  return (
    <div className="discussions-chat-page">
      <div className="discussions-sidebar">
        <div className="discussions-sidebar-header">
          <h2>Discussions</h2>
          <button className="new-discussion-btn">
            + New
          </button>
        </div>

        <div className="discussions-list">
          {discussions.map(discussion => (
            <div
              key={discussion.id}
              className={`discussion-item ${selectedDiscussion?.id === discussion.id ? 'active' : ''}`}
              onClick={() => handleSelectDiscussion(discussion)}
            >
              <div className="discussion-item-header">
                <div className="discussion-item-avatar">{discussion.author.charAt(0)}</div>
                <div className="discussion-item-info">
                  <div className="discussion-item-title">{discussion.title}</div>
                  <div className="discussion-item-meta">
                    <span className="discussion-item-club">{discussion.club}</span>
                    <span className="discussion-item-time">{discussion.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className="discussion-item-footer">
                <div className="discussion-item-stats">
                  <span>{discussion.replies} replies</span>
                  <span>•</span>
                  <span>{discussion.views} views</span>
                </div>
                {discussion.lastReply && (
                  <div className="discussion-item-last">
                    Last: {discussion.lastReply.author}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="discussions-main">
        {selectedDiscussion ? (
          <>
            <div className="discussion-header-bar">
              <div className="discussion-header-info">
                <h2>{selectedDiscussion.title}</h2>
                <div className="discussion-header-meta">
                  <span className="discussion-club-tag">
                    <HiUserGroup size={14} />
                    {selectedDiscussion.club}
                  </span>
                  {selectedDiscussion.tags.map(tag => (
                    <span key={tag} className="discussion-tag-small">
                      <HiTag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button className="discussion-menu-btn">
                <HiDotsVertical size={20} />
              </button>
            </div>

            <div className="discussion-messages">
              {(threadMessages[selectedDiscussion.id] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.isOriginal ? 'original' : ''} ${msg.author === 'You' ? 'own' : ''}`}
                >
                  {!msg.isOriginal && (
                    <div className="message-avatar">{msg.author.charAt(0)}</div>
                  )}
                  <div className="message-content">
                    {!msg.isOriginal && (
                      <div className="message-author">{msg.author}</div>
                    )}
                    <div className="message-text">{msg.content}</div>
                    <div className="message-time">{msg.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="discussion-input-area">
              <form onSubmit={handleSendMessage} className="message-form">
                <input
                  type="text"
                  placeholder="Type your reply..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="message-input"
                />
                <button type="submit" className="send-button" disabled={!message.trim()}>
                  <HiPaperAirplane size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="discussion-empty">
            <div className="empty-icon">💬</div>
            <h3>Select a discussion</h3>
            <p>Choose a discussion from the sidebar to view and participate in the conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Discussions;
