'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiHeart, 
  HiChat, 
  HiShare, 
  HiCalendar,
  HiUserGroup,
  HiArrowRight
} from 'react-icons/hi';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { feedPosts } from '@/lib/mockData';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setPosts(feedPosts);
    } catch (error) {
      console.error('Feed load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const formatTimestamp = (timestamp) => {
    return timestamp;
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case 'event':
        return <HiCalendar className="w-4 h-4" />;
      case 'announcement':
        return <HiUserGroup className="w-4 h-4" />;
      default:
        return <HiChat className="w-4 h-4" />;
    }
  };

  const getPostTypeColor = (type) => {
    switch (type) {
      case 'event':
        return 'text-accent-primary';
      case 'announcement':
        return 'text-accent-secondary';
      default:
        return 'text-chrome-300';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        
        <main className="container-chrome py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="font-plus-jakarta text-3xl md:text-4xl font-bold text-gradient mb-2">
              Campus Feed
            </h1>
            <p className="text-chrome-300 text-lg">
              Stay updated with the latest happenings around campus
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} variant="glass" className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-chrome-800 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-chrome-800 rounded mb-1"></div>
                          <div className="h-3 bg-chrome-800 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="h-32 bg-chrome-800 rounded mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-chrome-800 rounded"></div>
                        <div className="h-4 bg-chrome-800 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card variant="luxury" className="overflow-hidden">
                      <CardContent className="p-0">
                        {/* Post Header */}
                        <div className="p-6 pb-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {post.authorAvatar || post.author?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium text-white">{post.author}</h4>
                                <div className="flex items-center space-x-2 text-sm text-chrome-400">
                                  <span className={getPostTypeColor(post.type)}>
                                    {getPostTypeIcon(post.type)}
                                  </span>
                                  <span>{formatTimestamp(post.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-chrome-400">
                              {post.club}
                            </div>
                          </div>

                          {/* Post Content */}
                          <div className="space-y-3">
                            <h3 className="font-plus-jakarta text-lg font-semibold text-white">
                              {post.content.title}
                            </h3>
                            <p className="text-chrome-300 leading-relaxed">
                              {post.content.description}
                            </p>
                          </div>
                        </div>

                        {/* Post Image */}
                        {post.image && (
                          <div className="relative">
                            <img 
                              src={post.image} 
                              alt={post.content.title}
                              className="w-full h-64 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                        )}

                        {/* Post Actions */}
                        <div className="p-6 pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                              <button
                                onClick={() => handleLike(post.id)}
                                className={`flex items-center space-x-2 transition-colors ${
                                  post.isLiked 
                                    ? 'text-accent-error' 
                                    : 'text-chrome-400 hover:text-accent-error'
                                }`}
                              >
                                <HiHeart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                <span className="text-sm font-medium">{post.likes}</span>
                              </button>
                              
                              <button className="flex items-center space-x-2 text-chrome-400 hover:text-white transition-colors">
                                <HiChat className="w-5 h-5" />
                                <span className="text-sm font-medium">{post.comments}</span>
                              </button>
                              
                              <button className="flex items-center space-x-2 text-chrome-400 hover:text-white transition-colors">
                                <HiShare className="w-5 h-5" />
                                <span className="text-sm font-medium">{post.shares}</span>
                              </button>
                            </div>

                            {/* Event Action Button */}
                            {post.type === 'event' && post.content.eventId && (
                              <Button
                                variant="chrome"
                                size="sm"
                                onClick={() => window.location.href = `/events/${post.content.eventId}`}
                              >
                                View Event
                                <HiArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            )}
                          </div>

                          {/* Registration Status */}
                          {post.type === 'event' && post.isRegistered && (
                            <div className="mt-3 p-3 rounded-lg bg-accent-success/10 border border-accent-success/30">
                              <div className="flex items-center text-accent-success text-sm">
                                <HiCalendar className="w-4 h-4 mr-2" />
                                You're registered for this event
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* Load More */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-center py-8"
                >
                  <Button variant="chrome" size="lg">
                    Load More Posts
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}