import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, ScrollView, ActivityIndicator, Animated, Vibration, Image, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { API_BASE_URL, API_ENDPOINTS } from './src/constants/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  
  // Events states
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Admin states
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminData, setAdminData] = useState({
    analytics: null,
    users: [],
    events: [],
    pendingEvents: [],
    reports: [],
    communityAnalytics: null
  });
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState('dashboard'); // dashboard, users, events, reports
  
  // Chat states
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChatList, setShowChatList] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [searchUsers, setSearchUsers] = useState([]);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Animation refs for heart scaling
  const heartAnimations = useRef(new Map()).current;
  
  // Form states
  const [loginForm, setLoginForm] = useState({ 
    email: 'test@example.com',  // Pre-filled for testing
    password: 'password123' 
  });
  const [registerForm, setRegisterForm] = useState({ 
    name: 'New User',  // Pre-filled for testing
    email: `user${Date.now()}@example.com`,  // Unique email to avoid conflicts
    password: 'password123' 
  });
  const [postForm, setPostForm] = useState({ 
    title: '', 
    content: '', 
    category: 'general',
    image_url: '',
    image_caption: '',
    post_type: 'text'
  });

  // Get or create heart animation for a post
  const getHeartAnimation = (postId) => {
    if (!heartAnimations.has(postId)) {
      heartAnimations.set(postId, new Animated.Value(1));
    }
    return heartAnimations.get(postId);
  };

  // Animate heart when liked
  const animateHeart = (postId) => {
    const animation = getHeartAnimation(postId);
    
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animated Heart Component
  const AnimatedHeart = ({ postId, isLiked, onPress, count }) => {
    const animation = getHeartAnimation(postId);
    
    return (
      <TouchableOpacity style={styles.actionIcon} onPress={onPress}>
        <Animated.View style={{ transform: [{ scale: animation }] }}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={20} 
            color={isLiked ? "#F44336" : "#666"} 
          />
        </Animated.View>
        <Text style={[
          styles.actionCount,
          isLiked && styles.actionCountLiked
        ]}>
          {count || 0}
        </Text>
      </TouchableOpacity>
    );
  };

  // Check for stored auth token on app start
  useEffect(() => {
    checkAuthToken();
  }, []);

  const checkAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        setCurrentScreen('home');
        loadPosts();
        loadEvents();
      }
    } catch (error) {
      console.error('Error checking auth token:', error);
    }
  };

  const testNetworkConnection = async () => {
    try {
      console.log('Testing network connection to:', `${API_BASE_URL.replace('/api', '')}/health`);
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      const data = await response.json();
      console.log('Network test result:', data);
      Alert.alert('Network Test', `Connection successful! Server: ${data.message}`);
    } catch (error) {
      console.error('Network test failed:', error);
      Alert.alert('Network Test Failed', 
        `Cannot reach server at ${API_BASE_URL}. Make sure:\n\n` +
        '1. Backend server is running\n' +
        '2. Your phone and computer are on the same WiFi\n' +
        '3. Firewall allows connections\n\n' +
        `Error: ${error.message}`
      );
    }
  };

  const apiCall = async (endpoint, options = {}) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const url = `${API_BASE_URL}${endpoint}`;
      
      console.log('API Call:', url, options.method || 'GET');
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      console.log('API Response:', response.status, data);
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error.message);
      console.error('Full error:', error);
      throw error;
    }
  };

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with:', { email: loginForm.email });
      
      const response = await apiCall(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(loginForm),
      });

      console.log('Login response:', response);

      if (response.success) {
        console.log('Full response data:', JSON.stringify(response.data, null, 2));
        
        const token = response.data.session?.access_token || response.data.token;
        const user = response.data.user;
        
        console.log('Extracted token:', token);
        console.log('Extracted user:', user);
        
        if (!token) {
          console.error('Token extraction failed. Response structure:', response.data);
          throw new Error('No authentication token received');
        }
        
        if (!user) {
          console.error('User extraction failed. Response structure:', response.data);
          throw new Error('No user data received');
        }
        
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        setCurrentScreen('home');
        loadPosts();
        loadEvents();
        Alert.alert('Success!', 'You are now logged in!');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 
        error.message || 'Please check your credentials and network connection'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting registration with:', { 
        name: registerForm.name, 
        email: registerForm.email 
      });
      
      const response = await apiCall(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify(registerForm),
      });

      console.log('Register response:', response);

      if (response.success) {
        console.log('Full response data:', JSON.stringify(response.data, null, 2));
        
        const token = response.data.session?.access_token || response.data.token;
        const user = response.data.user;
        
        console.log('Extracted token:', token);
        console.log('Extracted user:', user);
        
        if (!token) {
          console.error('Token extraction failed. Response structure:', response.data);
          throw new Error('No authentication token received');
        }
        
        if (!user) {
          console.error('User extraction failed. Response structure:', response.data);
          throw new Error('No user data received');
        }
        
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        setCurrentScreen('home');
        loadPosts();
        loadEvents();
        Alert.alert('Success!', 'Account created successfully!');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration Failed', 
        error.message || 'Please try again or check your network connection'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await apiCall(API_ENDPOINTS.COMMUNITY_POSTS);
      if (response.success) {
        const posts = response.data.posts || [];
        setPosts(posts);
        
        // Track which posts the user has liked
        const userLikedPosts = new Set();
        posts.forEach(post => {
          if (post.user_reaction === 'like') {
            userLikedPosts.add(post.id);
          }
        });
        setLikedPosts(userLikedPosts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      // Use fallback mock data if API fails
      setPosts([
        {
          id: 1,
          title: 'Welcome to College Events Community!',
          content: 'This is where students can discuss events, clubs, and campus life. Share your thoughts and connect with fellow students!',
          author: { name: 'Admin' },
          comment_count: 3,
          reaction_count: 15,
          created_at: new Date().toISOString(),
          category: 'announcements',
          user_reaction: null
        },
        {
          id: 2,
          title: 'Looking for study group partners',
          content: 'Anyone interested in forming a study group for Computer Science courses? We can meet at the library every Tuesday.',
          author: { name: 'Sarah M.' },
          comment_count: 12,
          reaction_count: 8,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          category: 'academic',
          user_reaction: null
        },
        {
          id: 3,
          title: 'Photography Club Meeting Tomorrow',
          content: 'Don\'t forget about our photography club meeting tomorrow at 3 PM in Room 205. We\'ll be discussing the upcoming photo exhibition!',
          author: { name: 'Photo Club' },
          comment_count: 7,
          reaction_count: 22,
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          category: 'clubs',
          user_reaction: null
        }
      ]);
      setLikedPosts(new Set());
    }
  };

  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await apiCall(`${API_ENDPOINTS.EVENTS}?status=approved&upcoming=true`);
      if (response.success) {
        const events = response.data.events || [];
        setEvents(events);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      // Use fallback mock data if API fails
      setEvents([
        {
          id: 1,
          title: 'Tech Fest 2026',
          description: 'Annual technology festival featuring coding competitions, tech talks, and innovation showcases.',
          venue: 'Main Auditorium',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          capacity: 500,
          registration_count: 234,
          club: {
            name: 'Computer Science Club',
            lead: { name: 'Alex Johnson' }
          },
          status: 'approved'
        },
        {
          id: 2,
          title: 'Cultural Night',
          description: 'Celebrate diversity with performances, food, and cultural exhibitions from around the world.',
          venue: 'Student Center',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          capacity: 300,
          registration_count: 156,
          club: {
            name: 'Cultural Society',
            lead: { name: 'Maria Rodriguez' }
          },
          status: 'approved'
        },
        {
          id: 3,
          title: 'Startup Pitch Competition',
          description: 'Present your innovative business ideas to industry experts and win exciting prizes.',
          venue: 'Business Hall',
          date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
          capacity: 150,
          registration_count: 89,
          club: {
            name: 'Entrepreneurship Club',
            lead: { name: 'David Kim' }
          },
          status: 'approved'
        },
        {
          id: 4,
          title: 'Photography Workshop',
          description: 'Learn professional photography techniques from industry experts. Bring your camera!',
          venue: 'Art Studio',
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          capacity: 50,
          registration_count: 42,
          club: {
            name: 'Photography Club',
            lead: { name: 'Emma Wilson' }
          },
          status: 'approved'
        }
      ]);
    } finally {
      setLoadingEvents(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadPosts(), loadEvents()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Admin functions
  const loadAdminAnalytics = async () => {
    try {
      console.log('Loading admin analytics...');
      const response = await apiCall(API_ENDPOINTS.ADMIN_ANALYTICS);
      console.log('Admin analytics response:', response);
      if (response.success) {
        setAdminData(prev => ({ ...prev, analytics: response.data }));
        console.log('Admin analytics loaded successfully');
      } else {
        throw new Error(response.message || 'Failed to load analytics');
      }
    } catch (error) {
      console.error('Error loading admin analytics:', error);
      Alert.alert('Admin Error', `Failed to load analytics: ${error.message}`);
    }
  };

  const loadAdminUsers = async () => {
    try {
      console.log('Loading admin users...');
      const response = await apiCall(API_ENDPOINTS.ADMIN_USERS);
      console.log('Admin users response:', response);
      if (response.success) {
        setAdminData(prev => ({ ...prev, users: response.data.users }));
        console.log('Admin users loaded successfully:', response.data.users.length);
      } else {
        throw new Error(response.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error loading admin users:', error);
      Alert.alert('Admin Error', `Failed to load users: ${error.message}`);
    }
  };

  const loadAdminEvents = async () => {
    try {
      console.log('Loading admin events...');
      const [eventsResponse, pendingResponse] = await Promise.all([
        apiCall(API_ENDPOINTS.ADMIN_EVENTS),
        apiCall(API_ENDPOINTS.ADMIN_PENDING_EVENTS)
      ]);
      
      console.log('Admin events response:', eventsResponse);
      console.log('Admin pending events response:', pendingResponse);
      
      if (eventsResponse.success) {
        setAdminData(prev => ({ ...prev, events: eventsResponse.data.events }));
        console.log('Admin events loaded successfully:', eventsResponse.data.events.length);
      }
      if (pendingResponse.success) {
        setAdminData(prev => ({ ...prev, pendingEvents: pendingResponse.data.events }));
        console.log('Admin pending events loaded successfully:', pendingResponse.data.events.length);
      }
    } catch (error) {
      console.error('Error loading admin events:', error);
      Alert.alert('Admin Error', `Failed to load events: ${error.message}`);
    }
  };

  const loadCommunityAnalytics = async () => {
    try {
      console.log('Loading community analytics...');
      const response = await apiCall(API_ENDPOINTS.ADMIN_COMMUNITY_ANALYTICS);
      console.log('Community analytics response:', response);
      if (response.success) {
        setAdminData(prev => ({ ...prev, communityAnalytics: response.data }));
        console.log('Community analytics loaded successfully');
      } else {
        throw new Error(response.message || 'Failed to load community analytics');
      }
    } catch (error) {
      console.error('Error loading community analytics:', error);
      Alert.alert('Admin Error', `Failed to load community analytics: ${error.message}`);
    }
  };

  const loadAllAdminData = async () => {
    console.log('Starting to load all admin data...');
    setLoadingAdmin(true);
    try {
      console.log('User role check:', user?.role);
      if (user?.role !== 'admin') {
        throw new Error('Access denied: Admin role required');
      }

      await Promise.all([
        loadAdminAnalytics(),
        loadAdminUsers(),
        loadAdminEvents(),
        loadCommunityAnalytics()
      ]);
      console.log('All admin data loaded successfully');
    } catch (error) {
      console.error('Error loading admin data:', error);
      Alert.alert('Admin Dashboard Error', `Failed to load admin data: ${error.message}`);
    } finally {
      setLoadingAdmin(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await apiCall(API_ENDPOINTS.ADMIN_UPDATE_USER_ROLE(userId), {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });

      if (response.success) {
        Alert.alert('Success', 'User role updated successfully');
        loadAdminUsers(); // Refresh users list
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      Alert.alert('Error', `Failed to update user role: ${error.message}`);
    }
  };

  const updateEventStatus = async (eventId, status) => {
    try {
      const response = await apiCall(API_ENDPOINTS.ADMIN_UPDATE_EVENT_STATUS(eventId), {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });

      if (response.success) {
        Alert.alert('Success', `Event ${status} successfully`);
        loadAdminEvents(); // Refresh events list
      }
    } catch (error) {
      console.error('Error updating event status:', error);
      Alert.alert('Error', `Failed to update event status: ${error.message}`);
    }
  };

  const handleCreatePost = async () => {
    // Validate based on post type
    if (postForm.post_type === 'text' && (!postForm.title || !postForm.content)) {
      Alert.alert('Error', 'Please fill in title and content');
      return;
    }
    
    if (postForm.post_type === 'image' && !postForm.image_url) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    setLoading(true);
    try {
      const response = await apiCall(API_ENDPOINTS.COMMUNITY_POSTS, {
        method: 'POST',
        body: JSON.stringify(postForm),
      });

      if (response.success) {
        setPostForm({ 
          title: '', 
          content: '', 
          category: 'general',
          image_url: '',
          image_caption: '',
          post_type: 'text'
        });
        setShowCreatePost(false);
        loadPosts(); // Reload posts
        Alert.alert('Success!', 'Your post has been created!');
      }
    } catch (error) {
      // If API fails, add post to local state as fallback
      const newPost = {
        id: Date.now(),
        title: postForm.title,
        content: postForm.content,
        category: postForm.category,
        image_url: postForm.image_url,
        image_caption: postForm.image_caption,
        post_type: postForm.post_type,
        author: { name: user?.name || 'You' },
        comment_count: 0,
        reaction_count: 0,
        created_at: new Date().toISOString(),
      };
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setPostForm({ 
        title: '', 
        content: '', 
        category: 'general',
        image_url: '',
        image_caption: '',
        post_type: 'text'
      });
      setShowCreatePost(false);
      
      Alert.alert('Post Created!', 'Your post has been created locally. Note: Backend database needs to be set up for persistent storage.');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    const wasLiked = likedPosts.has(postId);
    
    // Add haptic feedback
    Vibration.vibrate(50);
    
    // Animate heart
    animateHeart(postId);
    
    // Optimistically update UI
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (wasLiked) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    // Update post reaction count optimistically
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              reaction_count: wasLiked 
                ? (post.reaction_count || 1) - 1 
                : (post.reaction_count || 0) + 1,
              user_reaction: wasLiked ? null : 'like'
            }
          : post
      )
    );

    try {
      const response = await apiCall(API_ENDPOINTS.COMMUNITY_REACT(postId), {
        method: 'POST',
        body: JSON.stringify({ type: 'like' }),
      });
      
      if (response.success) {
        // Update with actual server response
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  reaction_count: response.data.reaction_count,
                  user_reaction: response.data.user_reaction
                }
              : post
          )
        );
        
        // Update liked posts based on server response
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          if (response.data.user_reaction === 'like') {
            newSet.add(postId);
          } else {
            newSet.delete(postId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert optimistic update on error
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                reaction_count: wasLiked 
                  ? (post.reaction_count || 0) + 1 
                  : (post.reaction_count || 1) - 1,
                user_reaction: wasLiked ? 'like' : null
              }
            : post
        )
      );
    }
  };

  const handleViewComments = async (post) => {
    setSelectedPost(post);
    setShowPostDetail(true);
    setLoading(true);
    
    try {
      const response = await apiCall(API_ENDPOINTS.COMMUNITY_POST(post.id));
      if (response.success && response.data.post.comments) {
        setComments(response.data.post.comments);
        
        // Update the selected post with latest data including user reaction
        const updatedPost = response.data.post;
        setSelectedPost(updatedPost);
        
        // Update liked posts state based on user reaction
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          if (updatedPost.user_reaction === 'like') {
            newSet.add(updatedPost.id);
          } else {
            newSet.delete(updatedPost.id);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      // Use mock comments if API fails
      setComments([
        {
          id: 1,
          content: 'Great post! Thanks for sharing.',
          author: { name: 'Student A' },
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          content: 'I agree with this. Very informative.',
          author: { name: 'Student B' },
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    setLoading(true);
    try {
      const response = await apiCall(API_ENDPOINTS.COMMUNITY_COMMENT(selectedPost.id), {
        method: 'POST',
        body: JSON.stringify({ content: newComment.trim() }),
      });

      if (response.success) {
        // Reload comments
        handleViewComments(selectedPost);
        setNewComment('');
        Alert.alert('Success!', 'Comment added successfully!');
      }
    } catch (error) {
      // If API fails, add comment to local state
      const mockComment = {
        id: Date.now(),
        content: newComment.trim(),
        author: { name: user?.name || 'You' },
        created_at: new Date().toISOString()
      };
      
      setComments(prevComments => [mockComment, ...prevComments]);
      setNewComment('');
      Alert.alert('Comment Added!', 'Your comment has been added locally.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setUser(null);
      setCurrentScreen('login');
      setPosts([]);
      setEvents([]);
      setConversations([]);
      setMessages([]);
      setShowAdmin(false);
      setAdminData({
        analytics: null,
        users: [],
        events: [],
        pendingEvents: [],
        reports: [],
        communityAnalytics: null
      });
      Alert.alert('Logged Out', 'You have been logged out!');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Chat functions
  const loadConversations = async () => {
    try {
      console.log('Loading conversations...');
      const response = await apiCall(API_ENDPOINTS.CHAT_CONVERSATIONS);
      console.log('Conversations API response:', response);
      if (response.success) {
        setConversations(response.data.conversations || []);
        console.log('Conversations loaded:', response.data.conversations?.length || 0);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      console.error('Error details:', error.message);
      setConversations([]);
      Alert.alert('Chat Error', `Failed to load conversations: ${error.message}`);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      console.log('Loading messages for conversation:', conversationId);
      const response = await apiCall(API_ENDPOINTS.CHAT_MESSAGES(conversationId));
      console.log('Messages API response:', response);
      if (response.success) {
        setMessages(response.data.messages || []);
        console.log('Messages loaded:', response.data.messages?.length || 0);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      console.error('Error details:', error.message);
      setMessages([]);
      Alert.alert('Chat Error', `Failed to load messages: ${error.message}`);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) {
      console.log('Cannot send message: empty message or no conversation selected');
      return;
    }

    const messageText = newMessage.trim();
    console.log('Sending message:', messageText, 'to conversation:', selectedConversation.id);
    setNewMessage('');

    // Optimistic update
    const tempMessage = {
      id: Date.now(),
      content: messageText,
      sender: { id: user.id, name: user.name },
      created_at: new Date().toISOString(),
      sending: true
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const response = await apiCall(API_ENDPOINTS.CHAT_SEND_MESSAGE(selectedConversation.id), {
        method: 'POST',
        body: JSON.stringify({ content: messageText }),
      });
      
      console.log('Send message API response:', response);

      if (response.success) {
        // Replace temp message with real message
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id ? response.data.message : msg
          )
        );
        loadConversations(); // Refresh conversations to update last message
        console.log('Message sent successfully');
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.message);
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      Alert.alert('Send Error', `Failed to send message: ${error.message}`);
    }
  };

  const handleStartChat = async (otherUser) => {
    try {
      console.log('Starting chat with user:', otherUser);
      const response = await apiCall(API_ENDPOINTS.CHAT_CONVERSATION_WITH(otherUser.id));
      console.log('Start chat API response:', response);
      
      if (response.success) {
        setSelectedConversation(response.data.conversation);
        setShowUserSearch(false);
        setShowChatList(false);
        setShowChat(true);
        loadMessages(response.data.conversation.id);
        console.log('Chat started successfully');
      } else {
        throw new Error(response.message || 'Failed to start conversation');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      console.error('Error details:', error.message);
      Alert.alert('Chat Error', `Failed to start conversation: ${error.message}`);
    }
  };

  const handleSearchUsers = async (query) => {
    if (!query || query.length < 2) {
      setSearchUsers([]);
      return;
    }

    try {
      console.log('Searching users with query:', query);
      const response = await apiCall(`${API_ENDPOINTS.CHAT_SEARCH_USERS}?query=${encodeURIComponent(query)}`);
      console.log('Search users API response:', response);
      
      if (response.success) {
        setSearchUsers(response.data.users || []);
        console.log('Users found:', response.data.users?.length || 0);
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (error) {
      console.error('Error searching users:', error);
      console.error('Error details:', error.message);
      setSearchUsers([]);
      Alert.alert('Search Error', `Failed to search users: ${error.message}`);
    }
  };

  // Image handling functions
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload images!');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setLoading(true);
        
        try {
          // Upload image to backend
          const imageData = `data:image/jpeg;base64,${asset.base64}`;
          const uploadResponse = await apiCall(API_ENDPOINTS.UPLOAD_IMAGE, {
            method: 'POST',
            body: JSON.stringify({
              image_data: imageData,
              filename: asset.fileName || 'image.jpg'
            }),
          });

          if (uploadResponse.success) {
            setPostForm(prev => ({
              ...prev,
              image_url: `${API_BASE_URL.replace('/api', '')}${uploadResponse.data.image_url}`,
              post_type: prev.title || prev.content ? 'mixed' : 'image'
            }));
            Alert.alert('Success!', 'Image uploaded successfully!');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Upload Failed', 'Failed to upload image. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = () => {
    setPostForm(prev => ({
      ...prev,
      image_url: '',
      image_caption: '',
      post_type: prev.title || prev.content ? 'text' : 'text'
    }));
  };

  const sharePost = async (post) => {
    try {
      if (post.image_url) {
        // Share image post
        const shareText = `${post.title}\n\n${post.content}\n\nShared from College Events App`;
        await Sharing.shareAsync(post.image_url, {
          dialogTitle: 'Share Post',
          mimeType: 'image/jpeg',
        });
      } else {
        // Share text post
        const shareText = `${post.title}\n\n${post.content}\n\nShared from College Events App`;
        await Sharing.shareAsync('', {
          dialogTitle: 'Share Post',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Share Failed', 'Unable to share this post');
    }
  };

  // Login/Register Screen
  if (!user) {
    const isRegister = currentScreen === 'register';
    
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <LinearGradient 
          colors={['#E8E8E8', '#C0C0C0', '#A8A8A8']} 
          style={styles.loginContainer}
        >
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={60} color="#000" />
          </View>
          <Text style={styles.title}>College Events</Text>
          <Text style={styles.subtitle}>
            {isRegister ? 'Create your account' : 'Sign in to your account'}
          </Text>
          
          <View style={styles.formContainer}>
            {isRegister && (
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={registerForm.name}
                onChangeText={(text) => setRegisterForm({...registerForm, name: text})}
                autoCapitalize="words"
              />
            )}
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={isRegister ? registerForm.email : loginForm.email}
              onChangeText={(text) => {
                if (isRegister) {
                  setRegisterForm({...registerForm, email: text});
                } else {
                  setLoginForm({...loginForm, email: text});
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={isRegister ? registerForm.password : loginForm.password}
              onChangeText={(text) => {
                if (isRegister) {
                  setRegisterForm({...registerForm, password: text});
                } else {
                  setLoginForm({...loginForm, password: text});
                }
              }}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={isRegister ? handleRegister : handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isRegister ? 'Sign Up' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.debugButton]} 
            onPress={testNetworkConnection}
          >
            <Text style={styles.buttonText}>Test Network</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => {
              setCurrentScreen(isRegister ? 'login' : 'register');
              setLoginForm({ email: '', password: '' });
              setRegisterForm({ name: '', email: '', password: '' });
            }}
          >
            <Text style={styles.linkText}>
              {isRegister 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"
              }
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  // Chat List Screen
  if (showChatList) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <LinearGradient 
          colors={['#E8E8E8', '#C0C0C0', '#A8A8A8']} 
          style={styles.header}
        >
          <TouchableOpacity onPress={() => setShowChatList(false)}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity onPress={() => {
            setShowUserSearch(true);
            setSearchQuery('');
            setSearchUsers([]);
          }}>
            <Ionicons name="add" size={24} color="#000" />
          </TouchableOpacity>
        </LinearGradient>
        
        <ScrollView style={styles.content}>
          {conversations.length === 0 ? (
            <View style={styles.noChatsContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#CCC" />
              <Text style={styles.noChatsText}>No conversations yet</Text>
              <Text style={styles.noChatsSubtext}>Start a new conversation!</Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  setShowUserSearch(true);
                  setSearchQuery('');
                  setSearchUsers([]);
                }}
              >
                <Text style={styles.actionText}>Find Users</Text>
              </TouchableOpacity>
            </View>
          ) : (
            conversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.id}
                style={styles.conversationCard}
                onPress={() => {
                  setSelectedConversation(conversation);
                  setShowChatList(false);
                  setShowChat(true);
                  loadMessages(conversation.id);
                }}
              >
                <View style={styles.conversationAvatar}>
                  <Text style={styles.conversationAvatarText}>
                    {conversation.participant?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={styles.conversationInfo}>
                  <Text style={styles.conversationName}>
                    {conversation.participant?.name || 'Unknown User'}
                  </Text>
                  <Text style={styles.conversationLastMessage} numberOfLines={1}>
                    {conversation.last_message?.content || 'No messages yet'}
                  </Text>
                </View>
                <View style={styles.conversationMeta}>
                  <Text style={styles.conversationTime}>
                    {conversation.last_message_at 
                      ? new Date(conversation.last_message_at).toLocaleDateString()
                      : ''
                    }
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // User Search Screen
  if (showUserSearch) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <LinearGradient 
          colors={['#E8E8E8', '#C0C0C0', '#A8A8A8']} 
          style={styles.header}
        >
          <TouchableOpacity onPress={() => setShowUserSearch(false)}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Message</Text>
          <View style={{ width: 24 }} />
        </LinearGradient>
        
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                handleSearchUsers(text);
              }}
              autoFocus
            />
          </View>
          
          <ScrollView>
            {searchUsers.map((searchUser) => (
              <TouchableOpacity
                key={searchUser.id}
                style={styles.userCard}
                onPress={() => handleStartChat(searchUser)}
              >
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {searchUser.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{searchUser.name}</Text>
                  <Text style={styles.userEmail}>{searchUser.email}</Text>
                  <Text style={styles.userRole}>{searchUser.role}</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            {searchQuery.length >= 2 && searchUsers.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No users found</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    );
  }

  // Chat Screen
  if (showChat && selectedConversation) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <LinearGradient 
          colors={['#E8E8E8', '#C0C0C0', '#A8A8A8']} 
          style={styles.header}
        >
          <TouchableOpacity onPress={() => {
            setShowChat(false);
            setShowChatList(true);
            setMessages([]);
          }}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {selectedConversation.participant?.name || 'Chat'}
          </Text>
          <View style={{ width: 24 }} />
        </LinearGradient>
        
        <ScrollView 
          style={styles.messagesContainer}
          ref={(ref) => {
            if (ref) {
              ref.scrollToEnd({ animated: true });
            }
          }}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageCard,
                message.sender.id === user.id ? styles.myMessage : styles.otherMessage
              ]}
            >
              <Text style={[
                styles.messageText,
                message.sender.id === user.id ? styles.myMessageText : styles.otherMessageText
              ]}>
                {message.content}
              </Text>
              <Text style={[
                styles.messageTime,
                message.sender.id === user.id ? styles.myMessageTime : styles.otherMessageTime
              ]}>
                {new Date(message.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
                {message.sending && ' ⏳'}
              </Text>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Post Detail Screen with Comments
  if (showPostDetail && selectedPost) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <LinearGradient 
          colors={['#E8E8E8', '#C0C0C0', '#A8A8A8']} 
          style={styles.header}
        >
          <TouchableOpacity onPress={() => {
            setShowPostDetail(false);
            setSelectedPost(null);
            setComments([]);
          }}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post Details</Text>
          <View style={{ width: 24 }} />
        </LinearGradient>
        
        <ScrollView style={styles.content}>
          {/* Post Content */}
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Text style={styles.avatarText}>
                  {selectedPost.author?.name?.charAt(0)?.toUpperCase() || 'A'}
                </Text>
              </View>
              <View>
                <Text style={styles.postAuthor}>{selectedPost.author?.name || 'Anonymous'}</Text>
                <Text style={styles.postTime}>
                  {selectedPost.created_at ? new Date(selectedPost.created_at).toLocaleDateString() : 'Recently'}
                </Text>
              </View>
            </View>
            <Text style={styles.postTitle}>{selectedPost.title}</Text>
            <Text style={styles.postContent}>{selectedPost.content}</Text>
            <View style={styles.postActions}>
              <AnimatedHeart 
                postId={selectedPost.id}
                isLiked={likedPosts.has(selectedPost.id)}
                onPress={() => handleLikePost(selectedPost.id)}
                count={selectedPost.reaction_count}
              />
              <TouchableOpacity style={styles.actionIcon}>
                <Ionicons name="chatbubble-outline" size={20} color="#666" />
                <Text style={styles.actionCount}>{comments.length}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Add Comment Section */}
          <View style={styles.addCommentSection}>
            <Text style={styles.sectionTitle}>Add a Comment</Text>
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write your comment..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <TouchableOpacity 
                style={[styles.commentButton, loading && styles.buttonDisabled]}
                onPress={handleAddComment}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="send" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Comments List */}
          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>
              Comments ({comments.length})
            </Text>
            
            {comments.length === 0 ? (
              <View style={styles.noCommentsContainer}>
                <Ionicons name="chatbubble-outline" size={48} color="#CCC" />
                <Text style={styles.noCommentsText}>No comments yet</Text>
                <Text style={styles.noCommentsSubtext}>Be the first to comment!</Text>
              </View>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <View style={styles.commentAvatar}>
                      <Text style={styles.commentAvatarText}>
                        {comment.author?.name?.charAt(0)?.toUpperCase() || 'A'}
                      </Text>
                    </View>
                    <View style={styles.commentInfo}>
                      <Text style={styles.commentAuthor}>
                        {comment.author?.name || 'Anonymous'}
                      </Text>
                      <Text style={styles.commentTime}>
                        {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : 'Recently'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Community Screen
  if (currentScreen === 'community') {
    if (showCreatePost) {
      return (
        <View style={styles.container}>
          <StatusBar style="dark" />
          <LinearGradient 
            colors={['#E8E8E8', '#C0C0C0', '#A8A8A8']} 
            style={styles.header}
          >
            <TouchableOpacity onPress={() => setShowCreatePost(false)}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Post</Text>
            <TouchableOpacity 
              onPress={handleCreatePost}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.headerAction}>Post</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
          
          <ScrollView style={styles.content}>
            <View style={styles.createPostForm}>
              <TextInput
                style={styles.input}
                placeholder="Post Title (optional for image posts)"
                value={postForm.title}
                onChangeText={(text) => setPostForm({
                  ...postForm, 
                  title: text,
                  post_type: text || postForm.content ? (postForm.image_url ? 'mixed' : 'text') : (postForm.image_url ? 'image' : 'text')
                })}
                multiline={false}
              />
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What's on your mind? (optional for image posts)"
                value={postForm.content}
                onChangeText={(text) => setPostForm({
                  ...postForm, 
                  content: text,
                  post_type: postForm.title || text ? (postForm.image_url ? 'mixed' : 'text') : (postForm.image_url ? 'image' : 'text')
                })}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />

              {/* Image Section */}
              <View style={styles.imageSection}>
                <Text style={styles.sectionLabel}>Add Image (Optional)</Text>
                
                {postForm.image_url ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image 
                      source={{ uri: postForm.image_url }} 
                      style={styles.imagePreview}
                      resizeMode="cover"
                    />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={removeImage}
                    >
                      <Ionicons name="close-circle" size={24} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.imagePickerButton}
                    onPress={pickImage}
                    disabled={loading}
                  >
                    <Ionicons name="camera" size={32} color="#666" />
                    <Text style={styles.imagePickerText}>Tap to add image</Text>
                  </TouchableOpacity>
                )}

                {postForm.image_url && (
                  <TextInput
                    style={styles.input}
                    placeholder="Image caption (optional)"
                    value={postForm.image_caption}
                    onChangeText={(text) => setPostForm({...postForm, image_caption: text})}
                    multiline={false}
                  />
                )}
              </View>
              
              <View style={styles.categorySelector}>
                <Text style={styles.categoryLabel}>Category:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {['general', 'events', 'clubs', 'academic', 'social', 'announcements'].map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        postForm.category === category && styles.categoryChipActive
                      ]}
                      onPress={() => setPostForm({...postForm, category})}
                    >
                      <Text style={[
                        styles.categoryChipText,
                        postForm.category === category && styles.categoryChipTextActive
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Post Type Indicator */}
              <View style={styles.postTypeIndicator}>
                <Text style={styles.postTypeText}>
                  Post Type: {postForm.post_type === 'mixed' ? '📝📷 Text + Image' : 
                             postForm.post_type === 'image' ? '📷 Image Only' : '📝 Text Only'}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <LinearGradient 
          colors={['#E8E8E8', '#C0C0C0', '#A8A8A8']} 
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Community</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => setShowCreatePost(true)}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>
        
        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome to Community!</Text>
            <Text style={styles.cardText}>
              Connect with fellow students and share your experiences.
            </Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowCreatePost(true)}
            >
              <Text style={styles.actionText}>Create Post</Text>
            </TouchableOpacity>
          </View>
          
          {posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.postAvatar}>
                  <Text style={styles.avatarText}>
                    {post.author?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.postAuthor}>{post.author?.name || 'Anonymous'}</Text>
                  <Text style={styles.postTime}>
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Recently'}
                  </Text>
                </View>
              </View>
              
              {post.title && <Text style={styles.postTitle}>{post.title}</Text>}
              {post.content && <Text style={styles.postContent}>{post.content}</Text>}
              
              {/* Image Display */}
              {post.image_url && (
                <View style={styles.postImageContainer}>
                  <Image 
                    source={{ uri: post.image_url }} 
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                  {post.image_caption && (
                    <Text style={styles.imageCaption}>{post.image_caption}</Text>
                  )}
                </View>
              )}
              
              <View style={styles.postActions}>
                <AnimatedHeart 
                  postId={post.id}
                  isLiked={likedPosts.has(post.id)}
                  onPress={() => handleLikePost(post.id)}
                  count={post.reaction_count}
                />
                <TouchableOpacity 
                  style={styles.actionIcon}
                  onPress={() => handleViewComments(post)}
                >
                  <Ionicons name="chatbubble-outline" size={20} color="#666" />
                  <Text style={styles.actionCount}>{post.comment_count || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionIcon}
                  onPress={() => sharePost(post)}
                >
                  <Ionicons name="share-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tab} onPress={() => setCurrentScreen('home')}>
            <Ionicons name="home-outline" size={24} color="#666" />
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="chatbubbles" size={24} color="#000" />
            <Text style={styles.tabText}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setCurrentScreen('profile')}>
            <Ionicons name="person-outline" size={24} color="#666" />
            <Text style={styles.tabText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Admin Dashboard Screen
  if (showAdmin && user?.role === 'admin') {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <LinearGradient 
          colors={['#E8E8E8', '#C0C0C0', '#A8A8A8']} 
          style={styles.header}
        >
          <TouchableOpacity onPress={() => setShowAdmin(false)}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <TouchableOpacity onPress={loadAllAdminData} disabled={loadingAdmin}>
            {loadingAdmin ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Ionicons name="refresh" size={24} color="#000" />
            )}
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView style={styles.content}>
          {/* Simple Test Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Admin Dashboard Test</Text>
            <Text style={styles.cardText}>
              Welcome to the admin dashboard! This is a test to ensure the interface loads correctly.
            </Text>
            
            {loadingAdmin && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#4A90E2" />
                <Text style={styles.loadingText}>Loading admin data...</Text>
              </View>
            )}
            
            {!loadingAdmin && (
              <View>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {
                    console.log('Testing admin analytics...');
                    loadAdminAnalytics();
                  }}
                >
                  <Text style={styles.actionText}>Test Analytics API</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, { marginTop: 12, backgroundColor: '#4CAF50' }]}
                  onPress={() => {
                    console.log('Testing admin users...');
                    loadAdminUsers();
                  }}
                >
                  <Text style={styles.actionText}>Test Users API</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, { marginTop: 12, backgroundColor: '#FF9800' }]}
                  onPress={() => {
                    console.log('Testing admin events...');
                    loadAdminEvents();
                  }}
                >
                  <Text style={styles.actionText}>Test Events API</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Show Analytics Data if Available */}
          {adminData.analytics?.stats?.overview && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>✅ Analytics Loaded</Text>
              <Text style={styles.cardText}>
                Users: {adminData.analytics.stats.overview.total_users || 0} | 
                Events: {adminData.analytics.stats.overview.total_events || 0} | 
                Clubs: {adminData.analytics.stats.overview.total_clubs || 0}
              </Text>
            </View>
          )}

          {/* Show Users Data if Available */}
          {adminData.users && adminData.users.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>✅ Users Loaded</Text>
              <Text style={styles.cardText}>
                Found {adminData.users.length} users
              </Text>
              {adminData.users.slice(0, 3).map((user, index) => (
                <Text key={user.id} style={styles.cardText}>
                  {index + 1}. {user.name} ({user.role})
                </Text>
              ))}
            </View>
          )}

          {/* Show Events Data if Available */}
          {adminData.events && adminData.events.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>✅ Events Loaded</Text>
              <Text style={styles.cardText}>
                Found {adminData.events.length} events
              </Text>
            </View>
          )}

          {/* Show Pending Events if Available */}
          {adminData.pendingEvents && adminData.pendingEvents.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>⚠️ Pending Events</Text>
              <Text style={styles.cardText}>
                {adminData.pendingEvents.length} events need approval
              </Text>
            </View>
          )}

          {/* Debug Information */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Debug Info</Text>
            <Text style={styles.cardText}>User Role: {user?.role}</Text>
            <Text style={styles.cardText}>Loading: {loadingAdmin ? 'Yes' : 'No'}</Text>
            <Text style={styles.cardText}>
              Data Status: Analytics({adminData.analytics ? '✅' : '❌'}) | 
              Users({adminData.users?.length || 0}) | 
              Events({adminData.events?.length || 0})
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (currentScreen === 'profile') {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <LinearGradient 
          colors={['#E8E8E8', '#C0C0C0', '#A8A8A8']} 
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Profile</Text>
        </LinearGradient>
        
        <ScrollView style={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user?.role?.toUpperCase() || 'STUDENT'}</Text>
            </View>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Community Activity</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{posts.length}</Text>
                <Text style={styles.statLabel}>Total Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {posts.reduce((sum, post) => sum + (post.reaction_count || 0), 0)}
                </Text>
                <Text style={styles.statLabel}>Total Likes</Text>
              </View>
            </View>
            <View style={[styles.statsGrid, { marginTop: 16 }]}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {posts.filter(post => post.author?.id === user?.id || post.author?.name === user?.name).length}
                </Text>
                <Text style={styles.statLabel}>My Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {conversations.length}
                </Text>
                <Text style={styles.statLabel}>Conversations</Text>
              </View>
            </View>
          </View>
          
          {posts.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recent Community Posts</Text>
              <Text style={styles.cardSubtitle}>Latest discussions in the community</Text>
              {posts.slice(0, 3).map((post) => (
                <TouchableOpacity 
                  key={post.id} 
                  style={styles.recentPost}
                  onPress={() => setCurrentScreen('community')}
                >
                  <View style={styles.recentPostHeader}>
                    <Text style={styles.recentPostTitle} numberOfLines={1}>
                      {post.title}
                    </Text>
                    <View style={styles.recentPostStats}>
                      <Ionicons name="heart" size={12} color="#F44336" />
                      <Text style={styles.recentPostStatText}>{post.reaction_count || 0}</Text>
                      <Ionicons name="chatbubble" size={12} color="#666" style={{ marginLeft: 8 }} />
                      <Text style={styles.recentPostStatText}>{post.comment_count || 0}</Text>
                    </View>
                  </View>
                  <Text style={styles.recentPostAuthor}>
                    by {post.author?.name || 'Anonymous'} • {post.category || 'general'}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => setCurrentScreen('community')}
              >
                <Text style={styles.viewAllText}>View All Posts</Text>
                <Ionicons name="arrow-forward" size={16} color="#4A90E2" />
              </TouchableOpacity>
            </View>
          )}
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
        
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tab} onPress={() => setCurrentScreen('home')}>
            <Ionicons name="home-outline" size={24} color="#666" />
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setCurrentScreen('community')}>
            <Ionicons name="chatbubbles-outline" size={24} color="#666" />
            <Text style={styles.tabText}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="person" size={24} color="#000" />
            <Text style={styles.tabText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Home Screen
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient 
        colors={['#E8E8E8', '#C0C0C0', '#A8A8A8']} 
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Welcome, {user?.name}!</Text>
        <TouchableOpacity onPress={() => setCurrentScreen('profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4A90E2']}
            tintColor="#4A90E2"
          />
        }
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              setCurrentScreen('community');
              if (posts.length === 0) loadPosts();
            }}
          >
            <Ionicons name="chatbubbles" size={24} color="#fff" />
            <Text style={styles.actionText}>Go to Community</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { marginTop: 12, backgroundColor: '#4CAF50' }]}
            onPress={() => {
              setShowChatList(true);
              loadConversations();
            }}
          >
            <Ionicons name="mail" size={24} color="#fff" />
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>
          
          {user?.role === 'admin' && (
            <TouchableOpacity 
              style={[styles.actionButton, { marginTop: 12, backgroundColor: '#9C27B0' }]}
              onPress={() => {
                setShowAdmin(true);
                loadAllAdminData();
              }}
            >
              <Ionicons name="settings" size={24} color="#fff" />
              <Text style={styles.actionText}>Admin Dashboard</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Events Feed Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Upcoming Events</Text>
            {loadingEvents && <ActivityIndicator color="#4A90E2" />}
          </View>
          <Text style={styles.cardSubtitle}>
            Discover exciting events hosted by various clubs
          </Text>
          
          {events.length === 0 && !loadingEvents ? (
            <View style={styles.noEventsContainer}>
              <Ionicons name="calendar-outline" size={48} color="#CCC" />
              <Text style={styles.noEventsText}>No upcoming events</Text>
              <Text style={styles.noEventsSubtext}>Check back later for new events!</Text>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.eventsScrollView}
            >
              {events.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle} numberOfLines={2}>
                      {event.title}
                    </Text>
                    <View style={styles.eventClubBadge}>
                      <Text style={styles.eventClubText} numberOfLines={1}>
                        {event.club?.name || 'Unknown Club'}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.eventDescription} numberOfLines={3}>
                    {event.description}
                  </Text>
                  
                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetailRow}>
                      <Ionicons name="location-outline" size={16} color="#666" />
                      <Text style={styles.eventDetailText} numberOfLines={1}>
                        {event.venue}
                      </Text>
                    </View>
                    
                    <View style={styles.eventDetailRow}>
                      <Ionicons name="calendar-outline" size={16} color="#666" />
                      <Text style={styles.eventDetailText}>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Text>
                    </View>
                    
                    <View style={styles.eventDetailRow}>
                      <Ionicons name="people-outline" size={16} color="#666" />
                      <Text style={styles.eventDetailText}>
                        {event.registration_count || 0}/{event.capacity} registered
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.eventFooter}>
                    <Text style={styles.eventHostedBy}>
                      Hosted by {event.club?.lead?.name || 'Club Lead'}
                    </Text>
                    <View style={styles.eventActions}>
                      <TouchableOpacity style={styles.eventActionButton}>
                        <Ionicons name="information-circle-outline" size={20} color="#4A90E2" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.eventActionButton}>
                        <Ionicons name="share-outline" size={20} color="#4A90E2" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back!</Text>
          <Text style={styles.cardText}>
            Stay connected with your college community. Join discussions, attend events, and chat with fellow students.
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="home" size={24} color="#000" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => {
          setCurrentScreen('community');
          if (posts.length === 0) loadPosts();
        }}>
          <Ionicons name="chatbubbles-outline" size={24} color="#666" />
          <Text style={styles.tabText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setCurrentScreen('profile')}>
          <Ionicons name="person-outline" size={24} color="#666" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  debugButton: {
    backgroundColor: '#666',
    marginBottom: 8,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerAction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#4A90E2',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPostForm: {
    padding: 16,
  },
  categorySelector: {
    marginTop: 16,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  categoryChip: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#4A90E2',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  postTime: {
    fontSize: 14,
    color: '#666',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  actionCountLiked: {
    color: '#F44336',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  recentPost: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  recentPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentPostTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  recentPostStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentPostStatText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  recentPostAuthor: {
    fontSize: 14,
    color: '#666',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    marginTop: -4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  viewAllText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
    marginRight: 4,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileAvatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  roleBadge: {
    backgroundColor: '#C0C0C0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#C0C0C0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 4,
  },
  // Comment styles
  addCommentSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 80,
  },
  commentButton: {
    backgroundColor: '#4A90E2',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  noCommentsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
  },
  noCommentsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  noCommentsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  commentCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  commentInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
  },
  commentContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  // Chat styles
  noChatsContainer: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  noChatsText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  noChatsSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  conversationAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  conversationAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  conversationLastMessage: {
    fontSize: 14,
    color: '#666',
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  conversationTime: {
    fontSize: 12,
    color: '#999',
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  userRole: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageCard: {
    maxWidth: '80%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4A90E2',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#666',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#4A90E2',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
  // Image styles
  imageSection: {
    marginVertical: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  imagePickerButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  postImageContainer: {
    marginVertical: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  imageCaption: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  postTypeIndicator: {
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  postTypeText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  // Events styles
  noEventsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noEventsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  noEventsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  eventsScrollView: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  eventHeader: {
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    lineHeight: 22,
  },
  eventClubBadge: {
    backgroundColor: '#C0C0C0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  eventClubText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 16,
  },
  eventDetails: {
    marginBottom: 16,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  eventHostedBy: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    flex: 1,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  eventActionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  // Admin styles
  adminTabBar: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  adminTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: 'transparent',
  },
  adminTabActive: {
    backgroundColor: '#4A90E2',
  },
  adminTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 4,
  },
  adminTabTextActive: {
    color: '#fff',
  },
  alertCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    backgroundColor: '#FFF8E1',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
    marginLeft: 8,
  },
  alertText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  alertButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  userManagementCard: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
  },
  userStats: {
    flexDirection: 'row',
    marginTop: 4,
  },
  userStat: {
    fontSize: 12,
    color: '#666',
    marginRight: 16,
  },
  roleSelector: {
    marginTop: 8,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  roleButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  roleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'capitalize',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  eventManagementCard: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 12,
  },
  eventActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    gap: 6,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  eventActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  eventListCard: {
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  eventListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  statusApproved: {
    backgroundColor: '#E8F5E8',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusRejected: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
  },
  eventListDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
});
