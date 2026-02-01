import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, ScrollView, ActivityIndicator, Animated, Vibration, Image, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { API_BASE_URL, API_ENDPOINTS } from './src/constants/api';

// Type definitions
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Post {
  id: string;  // Changed from number to string for UUID
  title: string;
  content: string;
  author: { name: string };
  comment_count: number;
  reaction_count: number;
  created_at: string;
  category: string;
  user_reaction: string | null;
  image_url?: string;
  image_caption?: string;
  post_type?: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  venue: string;
  date: string;
  capacity: number;
  registration_count: number;
  club: {
    name: string;
    lead: { name: string };
  };
  status?: string;
}

interface Comment {
  id: number;
  content: string;
  author: { name: string };
  created_at: string;
}

interface Conversation {
  id: string;
  other_user: { name: string };
  last_message?: { content: string; created_at: string };
}

interface Message {
  id: number;
  content: string;
  sender: { id: string; name: string };
  created_at: string;
  sending?: boolean;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set<string>());
  
  // Events states
  const [events, setEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingPastEvents, setLoadingPastEvents] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Individual page states
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [clubs, setClubs] = useState<any[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<any[]>([]);
  const [clubMembers, setClubMembers] = useState<any[]>([]);
  const [loadingEventDetails, setLoadingEventDetails] = useState(false);
  const [loadingClubDetails, setLoadingClubDetails] = useState(false);
  
  // Admin states
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminData, setAdminData] = useState<any>({
    analytics: null,
    users: [],
    events: [],
    pendingEvents: [],
    reports: [],
    communityAnalytics: null
  });
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState('dashboard');
  
  // Coordinator states
  const [showCoordinator, setShowCoordinator] = useState(false);
  const [coordinatorData, setCoordinatorData] = useState<any>({
    dashboard: null,
    clubs: [],
    events: [],
    selectedEvent: null,
    registrations: []
  });
  const [loadingCoordinator, setLoadingCoordinator] = useState(false);
  const [coordinatorTab, setCoordinatorTab] = useState('dashboard');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    capacity: '',
    club_id: ''
  });
  
  // Chat states
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChatList, setShowChatList] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [searchUsersResults, setSearchUsersResults] = useState<User[]>([]);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Certificate states
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  
  // Animation refs for heart scaling
  const heartAnimations = useRef(new Map()).current;
  
  // Form states
  const [loginForm, setLoginForm] = useState({ 
    email: 'coordinator@university.edu',  // Coordinator credentials for testing
    password: 'password123' 
  });
  const [registerForm, setRegisterForm] = useState({ 
    name: 'New User',
    email: `user${Date.now()}@example.com`,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Deep black background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Auth Styles
  authCard: {
    backgroundColor: '#1A1A1A', // Dark card background
    padding: 24,
    borderRadius: 16,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A', // Subtle border
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    textAlign: 'center',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#B0B0B0', // Light gray text
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#3A3A3A', // Dark border
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#2A2A2A', // Dark input background
    color: '#FFFFFF', // White text
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  authButton: {
    backgroundColor: '#4A90E2', // Keep the blue accent
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    color: '#FFFFFF', // White text
    fontSize: 18,
    fontWeight: '600',
  },
  switchAuthButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchAuthText: {
    color: '#4A90E2', // Blue accent
    fontSize: 16,
  },

  // Home Screen Styles
  welcomeCard: {
    backgroundColor: '#1A1A1A', // Dark card
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#B0B0B0', // Light gray
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: '#1A1A1A', // Dark background
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF', // White text
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
  eventsScroll: {
    marginBottom: 20,
  },
  eventCard: {
    backgroundColor: '#1A1A1A', // Dark card
    padding: 16,
    borderRadius: 12,
    marginRight: 16,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#B0B0B0', // Light gray
    marginBottom: 8,
    lineHeight: 20,
  },
  eventVenue: {
    fontSize: 14,
    color: '#B0B0B0', // Light gray
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#B0B0B0', // Light gray
    marginBottom: 4,
  },
  eventRegistrations: {
    fontSize: 14,
    color: '#4A90E2', // Blue accent
    fontWeight: '600',
    marginBottom: 4,
  },
  eventClub: {
    fontSize: 14,
    color: '#B0B0B0', // Light gray
    marginBottom: 2,
  },
  eventLead: {
    fontSize: 12,
    color: '#808080', // Darker gray
  },
  eventDetails: {
    fontSize: 14,
    color: '#B0B0B0', // Light gray
    marginBottom: 8,
  },
  eventStatus: {
    fontSize: 14,
    color: '#4A90E2', // Blue accent
    fontWeight: '600',
    marginBottom: 4,
  },

  // Community Styles
  postCard: {
    backgroundColor: '#1A1A1A', // Dark card
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF', // White text
  },
  postTime: {
    fontSize: 12,
    color: '#808080', // Darker gray
  },
  categoryBadge: {
    backgroundColor: '#2A4A6B', // Dark blue background
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#4A90E2', // Blue accent
    fontWeight: '600',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    color: '#B0B0B0', // Light gray
    lineHeight: 24,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    gap: 20,
  },
  actionIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    fontSize: 14,
    color: '#B0B0B0', // Light gray
  },
  actionCountLiked: {
    color: '#F44336', // Keep red for likes
    fontWeight: '600',
  },

  // Profile Styles
  profileCard: {
    backgroundColor: '#1A1A1A', // Dark card
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginTop: 12,
  },
  profileEmail: {
    fontSize: 16,
    color: '#B0B0B0', // Light gray
    marginTop: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#4A90E2', // Blue accent
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  statsCard: {
    backgroundColor: '#1A1A1A', // Dark card
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2', // Blue accent
  },
  statLabel: {
    fontSize: 14,
    color: '#B0B0B0', // Light gray
    marginTop: 4,
  },
  recentPostsCard: {
    backgroundColor: '#1A1A1A', // Dark card
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginBottom: 16,
  },
  recentPostItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A', // Dark border
  },
  recentPostTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF', // White text
    marginBottom: 4,
  },
  recentPostDate: {
    fontSize: 12,
    color: '#808080', // Darker gray
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A', // Dark background
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A', // Dark border
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navButtonActive: {
    backgroundColor: '#2A4A6B', // Dark blue background
    borderRadius: 8,
  },
  navText: {
    fontSize: 12,
    color: '#B0B0B0', // Light gray
    marginTop: 4,
  },
  navTextActive: {
    color: '#4A90E2', // Blue accent
    fontWeight: '600',
  },

  // Modal Styles
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)', // Darker overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#1A1A1A', // Dark modal background
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A', // Dark border
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },

  // Admin Styles
  adminTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  adminTab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  adminTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  adminTabText: {
    fontSize: 16,
    color: '#666',
  },
  adminTabTextActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  adminContent: {
    padding: 20,
    maxHeight: 400,
  },
  adminSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  adminSubsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    marginTop: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    flex: 1,
  },
  userCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  userInfo: {
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
    marginTop: 2,
  },
  userStats: {
    fontSize: 12,
    color: '#999',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Create Post Modal
  postTypeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  postTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  postTypeButtonActive: {
    borderColor: '#4A90E2',
    backgroundColor: '#E3F2FD',
  },
  postTypeText: {
    fontSize: 16,
    color: '#666',
  },
  postTypeTextActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderStyle: 'dashed',
    marginBottom: 16,
    gap: 8,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  createPostButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  createPostButtonDisabled: {
    opacity: 0.6,
  },
  createPostButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  // Post Detail Modal
  postDetail: {
    marginBottom: 20,
  },
  commentsSection: {
    marginTop: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  addCommentSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
    gap: 12,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  addCommentButton: {
    padding: 12,
  },
  commentCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },

  // Chat Styles
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
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
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  conversationTime: {
    fontSize: 12,
    color: '#999',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  userSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  searchUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  searchUserEmail: {
    fontSize: 14,
    color: '#666',
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  messageItem: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 12,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
  },
  messageContent: {
    fontSize: 16,
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    padding: 12,
  },

  // Utility Styles
  loader: {
    marginVertical: 20,
  },
  
  // Coordinator Styles
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  clubSelector: {
    marginBottom: 20,
  },
  clubSelectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  clubOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  clubOptionSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E3F2FD',
  },
  clubOptionText: {
    fontSize: 16,
    color: '#666',
  },
  clubOptionTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  registrationStats: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  participantsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 12,
  },
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  participantEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  participantDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },

  // Individual Event Page Styles
  eventPageHeader: {
    backgroundColor: '#1A1A1A', // Dark card
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  eventPageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginBottom: 16,
    textAlign: 'center',
  },
  eventPageMeta: {
    gap: 12,
  },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventMetaText: {
    fontSize: 16,
    color: '#B0B0B0', // Light gray
  },
  eventStatsCard: {
    backgroundColor: '#1A1A1A', // Dark card
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  eventStatItem: {
    alignItems: 'center',
  },
  eventStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2', // Keep blue accent
  },
  eventStatLabel: {
    fontSize: 14,
    color: '#B0B0B0', // Light gray
    marginTop: 4,
  },
  eventDescriptionCard: {
    backgroundColor: '#1A1A1A', // Dark card
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  organizerCard: {
    backgroundColor: '#1A1A1A', // Dark card
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  organizerDetails: {
    flex: 1,
  },
  organizerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
  organizerLead: {
    fontSize: 14,
    color: '#B0B0B0', // Light gray
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: '#4A90E2', // Keep blue accent
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  registerButtonText: {
    color: '#FFFFFF', // White text
    fontSize: 18,
    fontWeight: '600',
  },
  loginPromptCard: {
    backgroundColor: '#2A2A2A', // Dark card
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  loginPromptText: {
    fontSize: 16,
    color: '#B0B0B0', // Light gray
    textAlign: 'center',
    marginBottom: 16,
  },
  loginPromptButton: {
    backgroundColor: '#4A90E2', // Keep blue accent
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginPromptButtonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: '600',
  },

  // Individual Club Page Styles
  clubPageHeader: {
    backgroundColor: '#1A1A1A', // Dark card
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  clubIcon: {
    marginBottom: 16,
  },
  clubPageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginBottom: 12,
    textAlign: 'center',
  },
  clubPageDescription: {
    fontSize: 16,
    color: '#B0B0B0', // Light gray
    textAlign: 'center',
    lineHeight: 24,
  },
  clubStatsCard: {
    backgroundColor: '#1A1A1A', // Dark card
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  clubStatItem: {
    alignItems: 'center',
  },
  clubStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2', // Keep blue accent
  },
  clubStatLabel: {
    fontSize: 14,
    color: '#B0B0B0', // Light gray
    marginTop: 4,
  },
  clubLeadCard: {
    backgroundColor: '#1A1A1A', // Dark card
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  leadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leadDetails: {
    flex: 1,
  },
  leadName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
  leadEmail: {
    fontSize: 14,
    color: '#B0B0B0', // Light gray
    marginTop: 2,
  },
  leadRole: {
    fontSize: 14,
    color: '#4A90E2', // Blue accent
    fontWeight: '600',
    marginTop: 2,
  },
  clubEventsCard: {
    backgroundColor: '#1A1A1A', // Dark card
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  clubEventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A', // Dark border
  },
  clubEventInfo: {
    flex: 1,
  },
  clubEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF', // White text
  },
  clubEventDate: {
    fontSize: 14,
    color: '#B0B0B0', // Light gray
    marginTop: 2,
  },
  joinButton: {
    backgroundColor: '#4A90E2', // Keep blue accent
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  joinButtonText: {
    color: '#FFFFFF', // White text
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Club Card Styles
  clubCardHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
});

  // Get or create heart animation for a post
  const getHeartAnimation = (postId: string) => {
    if (!heartAnimations.has(postId)) {
      heartAnimations.set(postId, new Animated.Value(1));
    }
    return heartAnimations.get(postId);
  };

  // Animate heart when liked
  const animateHeart = (postId: string) => {
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
  const AnimatedHeart = ({ postId, isLiked, onPress, count }: {
    postId: string;
    isLiked: boolean;
    onPress: () => void;
    count: number;
  }) => {
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
        // Test if the token is still valid
        try {
          const testResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (testResponse.ok) {
            setUser(JSON.parse(userData));
            setCurrentScreen('home');
            loadPosts();
            loadEvents();
            loadPastEvents();
            loadClubs();
          } else {
            // Token is invalid, clear it
            console.log('Token expired, clearing stored auth');
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('user');
            loadPosts(); // Load posts without auth
            loadEvents();
            loadPastEvents();
            loadClubs();
          }
        } catch (error) {
          console.log('Token validation failed, clearing stored auth');
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
          loadPosts(); // Load posts without auth
          loadEvents();
          loadPastEvents();
          loadClubs();
        }
      } else {
        // No stored auth, load public data
        loadPosts();
        loadEvents();
        loadPastEvents();
        loadClubs();
      }
    } catch (error) {
      console.error('Error checking auth token:', error);
      loadPosts(); // Load posts without auth
      loadEvents();
      loadPastEvents();
      loadClubs();
    }
  };

  const apiCall = async (endpoint: string, options: any = {}) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const url = `${API_BASE_URL}${endpoint}`;
      
      console.log('API Call:', url, options.method || 'GET');
      
      const headers: any = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      
      // Only add auth header if token exists and endpoint requires auth
      if (token && !options.skipAuth) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        headers,
        ...options,
      });

      const data = await response.json();
      
      console.log('API Response:', response.status, data);
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return data;
    } catch (error: any) {
      console.error('API Error:', error.message);
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
      const response = await apiCall(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(loginForm),
      });

      if (response.success) {
        const token = response.data.session?.access_token || response.data.token;
        const user = response.data.user;
        
        if (!token || !user) {
          throw new Error('Invalid response from server');
        }
        
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        console.log('Login successful! User data:', user);
        console.log('User role:', user.role);
        
        setUser(user);
        setCurrentScreen('home');
        loadPosts();
        loadEvents();
        loadPastEvents();
        loadClubs();
        Alert.alert('Success!', `You are now logged in! Role: ${user.role}`);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'Please check your credentials');
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
      const response = await apiCall(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify(registerForm),
      });

      if (response.success) {
        const token = response.data.session?.access_token || response.data.token;
        const user = response.data.user;
        
        if (!token || !user) {
          throw new Error('Invalid response from server');
        }
        
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        setCurrentScreen('home');
        loadPosts();
        loadEvents();
        loadPastEvents();
        loadClubs();
        Alert.alert('Success!', 'Account created successfully!');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Registration Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      console.log('Loading posts from API...');
      const response = await apiCall(API_ENDPOINTS.COMMUNITY_POSTS, { skipAuth: true });
      console.log('Posts API response:', response);
      
      if (response.success) {
        const posts = response.data.posts || [];
        console.log('Posts loaded:', posts.length);
        setPosts(posts);
        
        const userLikedPosts = new Set<string>();
        posts.forEach((post: any) => {
          if (post.user_reaction === 'like') {
            userLikedPosts.add(post.id);
          }
        });
        setLikedPosts(userLikedPosts);
      } else {
        console.log('Posts API failed:', response.message);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      // Fallback mock data
      console.log('Using fallback mock data');
      setPosts([
        {
          id: '1',
          title: 'Welcome to College Events Community!',
          content: 'This is where students can discuss events, clubs, and campus life.',
          author: { name: 'Admin' },
          comment_count: 3,
          reaction_count: 15,
          created_at: new Date().toISOString(),
          category: 'announcements',
          user_reaction: null
        }
      ]);
      setLikedPosts(new Set<string>());
    }
  };

  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await apiCall(`${API_ENDPOINTS.EVENTS}?status=approved&upcoming=true`, { skipAuth: true });
      if (response.success) {
        setEvents(response.data.events || []);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      // Fallback mock data
      setEvents([
        {
          id: 1,
          title: 'Tech Fest 2026',
          description: 'Annual technology festival',
          venue: 'Main Auditorium',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          capacity: 500,
          registration_count: 234,
          club: {
            name: 'Computer Science Club',
            lead: { name: 'Alex Johnson' }
          }
        }
      ]);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Load past events
  const loadPastEvents = async () => {
    console.log('🕒 Loading past events...');
    setLoadingPastEvents(true);
    try {
      const response = await apiCall(`${API_ENDPOINTS.EVENTS}?status=approved&past=true`, { skipAuth: true });
      console.log('Past events API response:', response);
      if (response.success && response.data.events && response.data.events.length > 0) {
        console.log('Past events loaded from API:', response.data.events.length);
        setPastEvents(response.data.events);
      } else {
        console.log('No past events from API, using fallback data');
        // Always use fallback mock data for demonstration
        setPastEvents([
          {
            id: 101,
            title: 'Mobile App Demo Workshop',
            description: 'A hands-on workshop demonstrating mobile app development with React Native and certificate generation.',
            venue: 'Tech Hub Room 101',
            date: '2026-01-25T14:00:00Z',
            capacity: 25,
            registration_count: 18,
            club: {
              name: 'Computer Science Club',
              lead: { name: 'Alex Johnson' }
            }
          },
          {
            id: 102,
            title: 'AI & Machine Learning Workshop',
            description: 'A comprehensive workshop covering the fundamentals of AI and Machine Learning with hands-on projects.',
            venue: 'Computer Science Lab A',
            date: '2026-01-15T14:00:00Z',
            capacity: 50,
            registration_count: 42,
            club: {
              name: 'Computer Science Club',
              lead: { name: 'Alex Johnson' }
            }
          },
          {
            id: 103,
            title: 'Web Development Bootcamp',
            description: 'Intensive bootcamp covering modern web development technologies including React, Node.js, and database integration.',
            venue: 'Main Auditorium',
            date: '2026-01-08T10:00:00Z',
            capacity: 100,
            registration_count: 87,
            club: {
              name: 'Computer Science Club',
              lead: { name: 'Alex Johnson' }
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading past events:', error);
      // Fallback mock data for past events
      console.log('Using fallback past events due to error');
      setPastEvents([
        {
          id: 101,
          title: 'Mobile App Demo Workshop',
          description: 'A hands-on workshop demonstrating mobile app development with React Native and certificate generation.',
          venue: 'Tech Hub Room 101',
          date: '2026-01-25T14:00:00Z',
          capacity: 25,
          registration_count: 18,
          club: {
            name: 'Computer Science Club',
            lead: { name: 'Alex Johnson' }
          }
        },
        {
          id: 102,
          title: 'AI & Machine Learning Workshop',
          description: 'A comprehensive workshop covering the fundamentals of AI and Machine Learning with hands-on projects.',
          venue: 'Computer Science Lab A',
          date: '2026-01-15T14:00:00Z',
          capacity: 50,
          registration_count: 42,
          club: {
            name: 'Computer Science Club',
            lead: { name: 'Alex Johnson' }
          }
        },
        {
          id: 103,
          title: 'Web Development Bootcamp',
          description: 'Intensive bootcamp covering modern web development technologies including React, Node.js, and database integration.',
          venue: 'Main Auditorium',
          date: '2026-01-08T10:00:00Z',
          capacity: 100,
          registration_count: 87,
          club: {
            name: 'Computer Science Club',
            lead: { name: 'Alex Johnson' }
          }
        }
      ]);
    } finally {
      setLoadingPastEvents(false);
      console.log('🕒 Past events loading completed');
    }
  };

  // Load user certificates
  const loadCertificates = async () => {
    if (!user) return;
    
    setLoadingCertificates(true);
    try {
      const response = await apiCall(API_ENDPOINTS.MY_CERTIFICATES);
      if (response.success) {
        setCertificates(response.data.certificates || []);
      }
    } catch (error) {
      console.error('Error loading certificates:', error);
      setCertificates([]);
    } finally {
      setLoadingCertificates(false);
    }
  };

  // Download certificate
  const downloadCertificate = async (certificateId: string, eventTitle: string) => {
    try {
      const downloadUrl = `${API_BASE_URL}${API_ENDPOINTS.CERTIFICATE_DOWNLOAD(certificateId)}`;
      
      Alert.alert(
        'Certificate Ready',
        `Your certificate for "${eventTitle}" is ready to download!`,
        [
          {
            text: 'Download',
            onPress: () => {
              // In a real app, you would use Linking.openURL or a file download library
              console.log('Download URL:', downloadUrl);
              Alert.alert('Download Started', 'Certificate download has started. Check your downloads folder.');
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Error downloading certificate:', error);
      Alert.alert('Error', 'Failed to download certificate');
    }
  };

  // Load individual event details
  const loadEventDetails = async (eventId: string | number) => {
    setLoadingEventDetails(true);
    try {
      const response = await apiCall(API_ENDPOINTS.EVENT(eventId), { skipAuth: true });
      if (response.success) {
        setSelectedEvent(response.data.event);
        setEventRegistrations(response.data.registrations || []);
      }
    } catch (error) {
      console.error('Error loading event details:', error);
      // Fallback mock data
      setSelectedEvent({
        id: typeof eventId === 'string' ? parseInt(eventId) : eventId,
        title: 'Tech Fest 2026',
        description: 'Annual technology festival with workshops, competitions, and networking opportunities. Join us for an exciting day of innovation and learning.',
        venue: 'Main Auditorium',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        capacity: 500,
        registration_count: 234,
        club: {
          name: 'Computer Science Club',
          lead: { name: 'Alex Johnson' }
        },
        status: 'approved'
      });
      setEventRegistrations([]);
    } finally {
      setLoadingEventDetails(false);
    }
  };

  // Load clubs
  const loadClubs = async () => {
    try {
      const response = await apiCall(API_ENDPOINTS.CLUBS, { skipAuth: true });
      if (response.success) {
        setClubs(response.data.clubs || []);
      }
    } catch (error) {
      console.error('Error loading clubs:', error);
      // Fallback mock data
      setClubs([
        {
          id: '1',
          name: 'Computer Science Club',
          description: 'A community for CS students to learn, share, and collaborate on tech projects',
          lead: { name: 'Alex Johnson', email: 'alex@university.edu' },
          member_count: 45,
          event_count: 8,
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  // Load individual club details
  const loadClubDetails = async (clubId: string) => {
    setLoadingClubDetails(true);
    try {
      const [clubResponse, membersResponse] = await Promise.all([
        apiCall(API_ENDPOINTS.CLUB(clubId), { skipAuth: true }),
        apiCall(API_ENDPOINTS.CLUB_MEMBERS(clubId), { skipAuth: true })
      ]);
      
      if (clubResponse.success) {
        setSelectedClub(clubResponse.data.club);
        setClubMembers(membersResponse.success ? membersResponse.data.members : []);
      }
    } catch (error) {
      console.error('Error loading club details:', error);
      // Fallback mock data
      setSelectedClub({
        id: clubId,
        name: 'Computer Science Club',
        description: 'A community for CS students to learn, share, and collaborate on tech projects. We organize workshops, hackathons, and networking events.',
        lead: { name: 'Alex Johnson', email: 'alex@university.edu' },
        member_count: 45,
        event_count: 8,
        created_at: new Date().toISOString(),
        events: [
          {
            id: 1,
            title: 'Tech Fest 2026',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'approved'
          }
        ]
      });
      setClubMembers([]);
    } finally {
      setLoadingClubDetails(false);
    }
  };

  // Register for event
  const registerForEvent = async (eventId: string | number) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to register for events');
      return;
    }

    try {
      const response = await apiCall(API_ENDPOINTS.EVENT_REGISTER(eventId), {
        method: 'POST'
      });

      if (response.success) {
        const { registration, certificate } = response.data;
        
        if (certificate) {
          Alert.alert(
            'Registration Successful! 🎉', 
            `You have been registered for this event and your certificate has been generated!\n\nCertificate ID: ${certificate.id.substring(0, 8)}...`,
            [
              {
                text: 'View Certificate',
                onPress: () => {
                  downloadCertificate(certificate.id, event.title);
                }
              },
              { text: 'OK', style: 'default' }
            ]
          );
        } else {
          Alert.alert('Success!', 'You have been registered for this event');
        }
        
        loadEventDetails(eventId); // Refresh event details
      }
    } catch (error: any) {
      console.error('Error registering for event:', error);
      Alert.alert('Registration Failed', error.message || 'Please try again');
    }
  };

  // Join club
  const joinClub = async (clubId: string) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to join clubs');
      return;
    }

    try {
      const response = await apiCall(API_ENDPOINTS.CLUB_JOIN(clubId), {
        method: 'POST'
      });

      if (response.success) {
        Alert.alert('Success!', 'You have joined this club');
        loadClubDetails(clubId); // Refresh club details
      }
    } catch (error: any) {
      console.error('Error joining club:', error);
      Alert.alert('Join Failed', error.message || 'Please try again');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadPosts(), loadEvents(), loadPastEvents(), loadClubs()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Coordinator functions
  const loadCoordinatorDashboard = async () => {
    setLoadingCoordinator(true);
    try {
      if (user?.role !== 'club_lead' && user?.role !== 'admin') {
        throw new Error('Access denied: Coordinator role required');
      }

      const [dashboardRes, clubsRes, eventsRes] = await Promise.all([
        apiCall(API_ENDPOINTS.COORDINATOR_DASHBOARD),
        apiCall(API_ENDPOINTS.COORDINATOR_CLUBS),
        apiCall(API_ENDPOINTS.COORDINATOR_EVENTS)
      ]);

      setCoordinatorData({
        dashboard: dashboardRes.success ? dashboardRes.data : null,
        clubs: clubsRes.success ? clubsRes.data.clubs : [],
        events: eventsRes.success ? eventsRes.data.events : [],
        selectedEvent: null,
        registrations: []
      });
    } catch (error: any) {
      console.error('Error loading coordinator data:', error);
      Alert.alert('Coordinator Error', `Failed to load coordinator data: ${error.message}`);
    } finally {
      setLoadingCoordinator(false);
    }
  };

  const createEvent = async () => {
    if (!eventForm.title || !eventForm.description || !eventForm.date || !eventForm.venue || !eventForm.capacity || !eventForm.club_id) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await apiCall(API_ENDPOINTS.COORDINATOR_CREATE_EVENT, {
        method: 'POST',
        body: JSON.stringify({
          ...eventForm,
          capacity: parseInt(eventForm.capacity)
        }),
      });

      if (response.success) {
        setEventForm({
          title: '',
          description: '',
          date: '',
          venue: '',
          capacity: '',
          club_id: ''
        });
        setShowCreateEvent(false);
        loadCoordinatorDashboard();
        Alert.alert('Success!', 'Event created successfully and is pending approval');
      }
    } catch (error: any) {
      console.error('Error creating event:', error);
      Alert.alert('Error', `Failed to create event: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId: string, updates: any) => {
    try {
      const response = await apiCall(API_ENDPOINTS.COORDINATOR_UPDATE_EVENT(eventId), {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (response.success) {
        Alert.alert('Success', 'Event updated successfully');
        loadCoordinatorDashboard();
      }
    } catch (error: any) {
      console.error('Error updating event:', error);
      Alert.alert('Error', `Failed to update event: ${error.message}`);
    }
  };

  const deleteEvent = async (eventId: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiCall(API_ENDPOINTS.COORDINATOR_DELETE_EVENT(eventId), {
                method: 'DELETE',
              });

              if (response.success) {
                Alert.alert('Success', 'Event deleted successfully');
                loadCoordinatorDashboard();
              }
            } catch (error: any) {
              console.error('Error deleting event:', error);
              Alert.alert('Error', `Failed to delete event: ${error.message}`);
            }
          }
        }
      ]
    );
  };

  const loadEventRegistrations = async (eventId: string) => {
    try {
      const response = await apiCall(API_ENDPOINTS.COORDINATOR_EVENT_REGISTRATIONS(eventId));
      
      if (response.success) {
        setCoordinatorData((prev: any) => ({
          ...prev,
          selectedEvent: response.data.event,
          registrations: response.data.registrations
        }));
        setShowEventDetail(true);
      }
    } catch (error: any) {
      console.error('Error loading event registrations:', error);
      Alert.alert('Error', `Failed to load event details: ${error.message}`);
    }
  };
  const loadAllAdminData = async () => {
    setLoadingAdmin(true);
    try {
      if (user?.role !== 'admin') {
        throw new Error('Access denied: Admin role required');
      }

      const [analyticsRes, usersRes, eventsRes, pendingRes, communityRes] = await Promise.all([
        apiCall(API_ENDPOINTS.ADMIN_ANALYTICS),
        apiCall(API_ENDPOINTS.ADMIN_USERS),
        apiCall(API_ENDPOINTS.ADMIN_EVENTS),
        apiCall(API_ENDPOINTS.ADMIN_PENDING_EVENTS),
        apiCall(API_ENDPOINTS.ADMIN_COMMUNITY_ANALYTICS)
      ]);

      setAdminData({
        analytics: analyticsRes.success ? analyticsRes.data : null,
        users: usersRes.success ? usersRes.data.users : [],
        events: eventsRes.success ? eventsRes.data.events : [],
        pendingEvents: pendingRes.success ? pendingRes.data.events : [],
        reports: [],
        communityAnalytics: communityRes.success ? communityRes.data : null
      });
    } catch (error: any) {
      console.error('Error loading admin data:', error);
      Alert.alert('Admin Error', `Failed to load admin data: ${error.message}`);
    } finally {
      setLoadingAdmin(false);
    }
  };

  const updateEventStatus = async (eventId: number, status: string) => {
    try {
      const response = await apiCall(API_ENDPOINTS.ADMIN_UPDATE_EVENT_STATUS(eventId), {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });

      if (response.success) {
        Alert.alert('Success', `Event ${status} successfully`);
        loadAllAdminData();
      }
    } catch (error: any) {
      console.error('Error updating event status:', error);
      Alert.alert('Error', `Failed to update event status: ${error.message}`);
    }
  };

  const handleCreatePost = async () => {
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
        loadPosts();
        Alert.alert('Success!', 'Your post has been created!');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    const wasLiked = likedPosts.has(postId);
    
    Vibration.vibrate(50);
    animateHeart(postId);
    
    // Optimistic update
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (wasLiked) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

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
      // Revert optimistic update
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
    }
  };

  const handleViewComments = async (post: Post) => {
    setSelectedPost(post);
    setShowPostDetail(true);
    setLoading(true);
    
    try {
      const response = await apiCall(API_ENDPOINTS.COMMUNITY_POST(post.id));
      if (response.success && response.data.post.comments) {
        setComments(response.data.post.comments);
        setSelectedPost(response.data.post);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([
        {
          id: 1,
          content: 'Great post! Thanks for sharing.',
          author: { name: 'Student A' },
          created_at: new Date().toISOString()
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
      const response = await apiCall(API_ENDPOINTS.COMMUNITY_COMMENT(selectedPost!.id), {
        method: 'POST',
        body: JSON.stringify({ content: newComment.trim() }),
      });

      if (response.success) {
        handleViewComments(selectedPost!);
        setNewComment('');
        Alert.alert('Success!', 'Comment added successfully!');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
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
      setShowCoordinator(false);
      setAdminData({
        analytics: null,
        users: [],
        events: [],
        pendingEvents: [],
        reports: [],
        communityAnalytics: null
      });
      setCoordinatorData({
        dashboard: null,
        clubs: [],
        events: [],
        selectedEvent: null,
        registrations: []
      });
      Alert.alert('Logged Out', 'You have been logged out!');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Chat functions
  const loadConversations = async () => {
    try {
      const response = await apiCall(API_ENDPOINTS.CHAT_CONVERSATIONS);
      if (response.success) {
        setConversations(response.data.conversations || []);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await apiCall(API_ENDPOINTS.CHAT_MESSAGES(conversationId));
      if (response.success) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) {
      return;
    }

    const messageText = newMessage.trim();
    setNewMessage('');

    const tempMessage: Message = {
      id: Date.now(),
      content: messageText,
      sender: { id: user!.id, name: user!.name },
      created_at: new Date().toISOString(),
      sending: true
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const response = await apiCall(API_ENDPOINTS.CHAT_SEND_MESSAGE(selectedConversation.id), {
        method: 'POST',
        body: JSON.stringify({ content: messageText }),
      });
      
      if (response.success) {
        loadMessages(selectedConversation.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchUsersResults([]);
      return;
    }

    try {
      const response = await apiCall(`${API_ENDPOINTS.CHAT_SEARCH_USERS}?q=${encodeURIComponent(query)}`);
      if (response.success) {
        setSearchUsersResults(response.data.users || []);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchUsersResults([]);
    }
  };

  const startConversation = async (otherUser: User) => {
    try {
      const response = await apiCall(API_ENDPOINTS.CHAT_CONVERSATION_WITH(otherUser.id), {
        method: 'POST',
      });

      if (response.success) {
        setSelectedConversation(response.data.conversation);
        setShowUserSearch(false);
        setShowChatList(false);
        setShowChat(true);
        loadMessages(response.data.conversation.id);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      Alert.alert('Error', 'Failed to start conversation');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const base64Image = `data:image/jpeg;base64,${asset.base64}`;
      
      try {
        const response = await apiCall(API_ENDPOINTS.UPLOAD_IMAGE, {
          method: 'POST',
          body: JSON.stringify({ 
            image: base64Image,
            filename: `image_${Date.now()}.jpg`
          }),
        });

        if (response.success) {
          setPostForm(prev => ({
            ...prev,
            image_url: response.data.url,
            post_type: 'image'
          }));
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Failed to upload image');
      }
    }
  };
  // Login Screen
  const renderLoginScreen = () => (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={styles.header}>
        <Text style={styles.headerTitle}>College Events</Text>
        <Ionicons name="school" size={24} color="#FFFFFF" />
      </LinearGradient>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.authCard}>
          <Text style={styles.authTitle}>Welcome Back</Text>
          <Text style={styles.authSubtitle}>Sign in to continue</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={loginForm.email}
            onChangeText={(text) => setLoginForm(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={loginForm.password}
            onChangeText={(text) => setLoginForm(prev => ({ ...prev, password: text }))}
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={[styles.authButton, loading && styles.authButtonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.authButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.switchAuthButton}
            onPress={() => setCurrentScreen('register')}
          >
            <Text style={styles.switchAuthText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  // Register Screen
  const renderRegisterScreen = () => (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={styles.header}>
        <Text style={styles.headerTitle}>College Events</Text>
        <Ionicons name="school" size={24} color="#FFFFFF" />
      </LinearGradient>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.authCard}>
          <Text style={styles.authTitle}>Create Account</Text>
          <Text style={styles.authSubtitle}>Join the community</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={registerForm.name}
            onChangeText={(text) => setRegisterForm(prev => ({ ...prev, name: text }))}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={registerForm.email}
            onChangeText={(text) => setRegisterForm(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={registerForm.password}
            onChangeText={(text) => setRegisterForm(prev => ({ ...prev, password: text }))}
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={[styles.authButton, loading && styles.authButtonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.authButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.switchAuthButton}
            onPress={() => setCurrentScreen('login')}
          >
            <Text style={styles.switchAuthText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  // Home Screen
  const renderHomeScreen = () => {
    console.log('Rendering home screen. User:', user);
    console.log('User role:', user?.role);
    console.log('Past events count:', pastEvents.length);
    console.log('Loading past events:', loadingPastEvents);
    console.log('Past events data:', pastEvents.slice(0, 2)); // Show first 2 events
    console.log('Is club_lead?', user?.role === 'club_lead');
    console.log('Is admin?', user?.role === 'admin');
    console.log('Should show coordinator?', (user?.role === 'club_lead' || user?.role === 'admin'));
    
    return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={styles.header}>
        <Text style={styles.headerTitle}>College Events</Text>
        <View style={styles.headerActions}>
          {user?.role === 'admin' && (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => {
                setShowAdmin(true);
                loadAllAdminData();
              }}
            >
              <Ionicons name="settings" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          {(user?.role === 'club_lead' || user?.role === 'admin') && (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => {
                console.log('Calendar icon pressed! User role:', user?.role);
                console.log('User data:', user);
                Alert.alert('Debug', `Calendar pressed! User role: ${user?.role}`);
                setShowCoordinator(true);
                loadCoordinatorDashboard();
              }}
            >
              <Ionicons name="calendar" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => {
              setShowChatList(true);
              loadConversations();
            }}
          >
            <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome back, {user?.name}!</Text>
          <Text style={styles.welcomeSubtitle}>Stay connected with campus events and community</Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => setCurrentScreen('community')}
          >
            <Ionicons name="people" size={24} color="#4A90E2" />
            <Text style={styles.quickActionText}>Community</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => {
              setCurrentScreen('profile');
              loadCertificates();
            }}
          >
            <Ionicons name="person" size={24} color="#4A90E2" />
            <Text style={styles.quickActionText}>Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <Ionicons name="calendar" size={20} color="#666" />
        </View>

        {loadingEvents ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventsScroll}>
            {events.map(event => (
              <TouchableOpacity 
                key={event.id} 
                style={styles.eventCard}
                onPress={() => {
                  loadEventDetails(event.id);
                  setCurrentScreen('eventDetail');
                }}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventVenue}>{event.venue}</Text>
                <Text style={styles.eventDate}>
                  {new Date(event.date).toLocaleDateString()}
                </Text>
                <Text style={styles.eventRegistrations}>
                  {event.registration_count}/{event.capacity} registered
                </Text>
                <Text style={styles.eventClub}>by {event.club?.name}</Text>
                <Text style={styles.eventLead}>Lead: {event.club?.lead?.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Past Events Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Past Events</Text>
          <Ionicons name="time" size={20} color="#666" />
        </View>

        {/* Debug info */}
        <Text style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>
          Debug: Loading={loadingPastEvents.toString()}, Count={pastEvents.length}
        </Text>

        {loadingPastEvents ? (
          <ActivityIndicator style={styles.loader} />
        ) : pastEvents.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventsScroll}>
            {pastEvents.map(event => (
              <TouchableOpacity 
                key={event.id} 
                style={[styles.eventCard, { opacity: 0.8 }]}
                onPress={() => {
                  loadEventDetails(event.id);
                  setCurrentScreen('eventDetail');
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={[styles.eventTitle, { marginLeft: 4, fontSize: 16 }]}>Completed</Text>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventVenue}>{event.venue}</Text>
                <Text style={styles.eventDate}>
                  {new Date(event.date).toLocaleDateString()}
                </Text>
                <Text style={styles.eventRegistrations}>
                  {event.registration_count}/{event.capacity} attended
                </Text>
                <Text style={styles.eventClub}>by {event.club?.name}</Text>
                <Text style={styles.eventLead}>Lead: {event.club?.lead?.name}</Text>
                
                {/* Certificate indicator for registered users */}
                {user && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, padding: 8, backgroundColor: '#2A4A6B', borderRadius: 6 }}>
                    <Ionicons name="ribbon" size={14} color="#4A90E2" />
                    <Text style={{ color: '#4A90E2', fontSize: 12, marginLeft: 4, fontWeight: '600' }}>
                      Certificate Available
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={[styles.eventCard, { alignItems: 'center', justifyContent: 'center', height: 120 }]}>
            <Ionicons name="calendar-outline" size={32} color="#666" />
            <Text style={[styles.eventDescription, { textAlign: 'center', marginTop: 8 }]}>
              No past events yet
            </Text>
          </View>
        )}

        {/* Clubs Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Clubs</Text>
          <Ionicons name="people" size={20} color="#666" />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventsScroll}>
          {clubs.map(club => (
            <TouchableOpacity 
              key={club.id} 
              style={styles.eventCard}
              onPress={() => {
                loadClubDetails(club.id);
                setCurrentScreen('clubDetail');
              }}
            >
              <View style={styles.clubCardHeader}>
                <Ionicons name="people-circle" size={40} color="#4A90E2" />
              </View>
              <Text style={styles.eventTitle}>{club.name}</Text>
              <Text style={styles.eventDescription} numberOfLines={2}>
                {club.description}
              </Text>
              <Text style={styles.eventRegistrations}>
                {club.member_count || 0} members
              </Text>
              <Text style={styles.eventClub}>Lead: {club.lead?.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'home' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('home')}
        >
          <Ionicons name="home" size={24} color={currentScreen === 'home' ? "#4A90E2" : "#666"} />
          <Text style={[styles.navText, currentScreen === 'home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'community' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('community')}
        >
          <Ionicons name="people" size={24} color={currentScreen === 'community' ? "#4A90E2" : "#666"} />
          <Text style={[styles.navText, currentScreen === 'community' && styles.navTextActive]}>Community</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'profile' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('profile')}
        >
          <Ionicons name="person" size={24} color={currentScreen === 'profile' ? "#4A90E2" : "#666"} />
          <Text style={[styles.navText, currentScreen === 'profile' && styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  };

  // Community Screen
  const renderCommunityScreen = () => (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity onPress={() => setShowCreatePost(true)}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>
      
      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {posts.map(post => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAuthor}>
                <Ionicons name="person-circle" size={32} color="#666" />
                <View>
                  <Text style={styles.authorName}>{post.author?.name}</Text>
                  <Text style={styles.postTime}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{post.category}</Text>
              </View>
            </View>
            
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>
            
            {post.image_url && (
              <Image source={{ uri: post.image_url }} style={styles.postImage} />
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
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'home' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('home')}
        >
          <Ionicons name="home" size={24} color={currentScreen === 'home' ? "#4A90E2" : "#666"} />
          <Text style={[styles.navText, currentScreen === 'home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'community' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('community')}
        >
          <Ionicons name="people" size={24} color={currentScreen === 'community' ? "#4A90E2" : "#666"} />
          <Text style={[styles.navText, currentScreen === 'community' && styles.navTextActive]}>Community</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'profile' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('profile')}
        >
          <Ionicons name="person" size={24} color={currentScreen === 'profile' ? "#4A90E2" : "#666"} />
          <Text style={[styles.navText, currentScreen === 'profile' && styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Profile Screen
  const renderProfileScreen = () => (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient colors={['#E8E8E8', '#C0C0C0', '#A8A8A8']} style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#000" />
        </TouchableOpacity>
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <Ionicons name="person-circle" size={80} color="#666" />
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <Text style={styles.profileRole}>{user?.role}</Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Community Activity</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{posts.filter((p: Post) => p.author?.name === user?.name).length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Array.from(likedPosts).length}</Text>
              <Text style={styles.statLabel}>Likes Given</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{conversations.length}</Text>
              <Text style={styles.statLabel}>Conversations</Text>
            </View>
          </View>
        </View>

        <View style={styles.recentPostsCard}>
          <Text style={styles.cardTitle}>Recent Posts</Text>
          {posts.filter((p: Post) => p.author?.name === user?.name).slice(0, 3).map((post: Post) => (
            <TouchableOpacity 
              key={post.id} 
              style={styles.recentPostItem}
              onPress={() => handleViewComments(post)}
            >
              <Text style={styles.recentPostTitle}>{post.title}</Text>
              <Text style={styles.recentPostDate}>
                {new Date(post.created_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Certificates Section */}
        <View style={styles.recentPostsCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={styles.cardTitle}>My Certificates</Text>
            <TouchableOpacity onPress={loadCertificates}>
              <Ionicons name="refresh" size={20} color="#4A90E2" />
            </TouchableOpacity>
          </View>
          
          {loadingCertificates ? (
            <ActivityIndicator style={styles.loader} />
          ) : certificates.length > 0 ? (
            certificates.slice(0, 3).map((cert: any) => (
              <TouchableOpacity 
                key={cert.id} 
                style={styles.recentPostItem}
                onPress={() => downloadCertificate(cert.id, cert.event.title)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recentPostTitle}>{cert.event.title}</Text>
                    <Text style={styles.recentPostDate}>
                      Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                    </Text>
                    {cert.event.organizer && (
                      <Text style={[styles.recentPostDate, { color: '#4A90E2' }]}>
                        by {cert.event.organizer}
                      </Text>
                    )}
                  </View>
                  <Ionicons name="download" size={20} color="#4A90E2" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.recentPostDate, { textAlign: 'center', marginVertical: 20 }]}>
              No certificates yet. Register for events to earn certificates!
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'home' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('home')}
        >
          <Ionicons name="home" size={24} color={currentScreen === 'home' ? "#4A90E2" : "#666"} />
          <Text style={[styles.navText, currentScreen === 'home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'community' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('community')}
        >
          <Ionicons name="people" size={24} color={currentScreen === 'community' ? "#4A90E2" : "#666"} />
          <Text style={[styles.navText, currentScreen === 'community' && styles.navTextActive]}>Community</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'profile' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('profile')}
        >
          <Ionicons name="person" size={24} color={currentScreen === 'profile' ? "#4A90E2" : "#666"} />
          <Text style={[styles.navText, currentScreen === 'profile' && styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Individual Event Page
  const renderEventPage = () => {
    if (!selectedEvent) return null;

    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <View style={styles.headerButton} />
        </LinearGradient>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {loadingEventDetails ? (
            <ActivityIndicator style={styles.loader} size="large" />
          ) : (
            <>
              {/* Event Header */}
              <View style={styles.eventPageHeader}>
                <Text style={styles.eventPageTitle}>{selectedEvent.title}</Text>
                <View style={styles.eventPageMeta}>
                  <View style={styles.eventMetaItem}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.eventMetaText}>
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                  </View>
                  <View style={styles.eventMetaItem}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.eventMetaText}>
                      {new Date(selectedEvent.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                  <View style={styles.eventMetaItem}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.eventMetaText}>{selectedEvent.venue}</Text>
                  </View>
                </View>
              </View>

              {/* Event Stats */}
              <View style={styles.eventStatsCard}>
                <View style={styles.eventStatItem}>
                  <Text style={styles.eventStatNumber}>{selectedEvent.registration_count || 0}</Text>
                  <Text style={styles.eventStatLabel}>Registered</Text>
                </View>
                <View style={styles.eventStatItem}>
                  <Text style={styles.eventStatNumber}>{selectedEvent.capacity}</Text>
                  <Text style={styles.eventStatLabel}>Capacity</Text>
                </View>
                <View style={styles.eventStatItem}>
                  <Text style={styles.eventStatNumber}>
                    {selectedEvent.capacity - (selectedEvent.registration_count || 0)}
                  </Text>
                  <Text style={styles.eventStatLabel}>Available</Text>
                </View>
              </View>

              {/* Event Description */}
              <View style={styles.eventDescriptionCard}>
                <Text style={styles.cardTitle}>About This Event</Text>
                <Text style={styles.eventDescription}>{selectedEvent.description}</Text>
              </View>

              {/* Organized By */}
              <View style={styles.organizerCard}>
                <Text style={styles.cardTitle}>Organized By</Text>
                <View style={styles.organizerInfo}>
                  <Ionicons name="people-circle-outline" size={40} color="#4A90E2" />
                  <View style={styles.organizerDetails}>
                    <Text style={styles.organizerName}>{selectedEvent.club?.name}</Text>
                    <Text style={styles.organizerLead}>Lead: {selectedEvent.club?.lead?.name}</Text>
                  </View>
                </View>
              </View>

              {/* Registration Button */}
              {user && (
                <TouchableOpacity 
                  style={styles.registerButton}
                  onPress={() => registerForEvent(selectedEvent.id)}
                >
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={styles.registerButtonText}>Register for Event</Text>
                </TouchableOpacity>
              )}

              {!user && (
                <View style={styles.loginPromptCard}>
                  <Text style={styles.loginPromptText}>Please login to register for this event</Text>
                  <TouchableOpacity 
                    style={styles.loginPromptButton}
                    onPress={() => {
                      setCurrentScreen('login');
                    }}
                  >
                    <Text style={styles.loginPromptButtonText}>Login</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={[styles.navButton, currentScreen === 'home' && styles.navButtonActive]}
            onPress={() => setCurrentScreen('home')}
          >
            <Ionicons name="home" size={24} color={currentScreen === 'home' ? "#4A90E2" : "#666"} />
            <Text style={[styles.navText, currentScreen === 'home' && styles.navTextActive]}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, currentScreen === 'community' && styles.navButtonActive]}
            onPress={() => setCurrentScreen('community')}
          >
            <Ionicons name="people" size={24} color={currentScreen === 'community' ? "#4A90E2" : "#666"} />
            <Text style={[styles.navText, currentScreen === 'community' && styles.navTextActive]}>Community</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, currentScreen === 'profile' && styles.navButtonActive]}
            onPress={() => setCurrentScreen('profile')}
          >
            <Ionicons name="person" size={24} color={currentScreen === 'profile' ? "#4A90E2" : "#666"} />
            <Text style={[styles.navText, currentScreen === 'profile' && styles.navTextActive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Individual Club Page
  const renderClubPage = () => {
    if (!selectedClub) return null;

    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient colors={['#1A1A1A', '#2A2A2A', '#3A3A3A']} style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Club Details</Text>
          <View style={styles.headerButton} />
        </LinearGradient>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {loadingClubDetails ? (
            <ActivityIndicator style={styles.loader} size="large" />
          ) : (
            <>
              {/* Club Header */}
              <View style={styles.clubPageHeader}>
                <View style={styles.clubIcon}>
                  <Ionicons name="people-circle" size={60} color="#4A90E2" />
                </View>
                <Text style={styles.clubPageTitle}>{selectedClub.name}</Text>
                <Text style={styles.clubPageDescription}>{selectedClub.description}</Text>
              </View>

              {/* Club Stats */}
              <View style={styles.clubStatsCard}>
                <View style={styles.clubStatItem}>
                  <Text style={styles.clubStatNumber}>{selectedClub.member_count || 0}</Text>
                  <Text style={styles.clubStatLabel}>Members</Text>
                </View>
                <View style={styles.clubStatItem}>
                  <Text style={styles.clubStatNumber}>{selectedClub.event_count || 0}</Text>
                  <Text style={styles.clubStatLabel}>Events</Text>
                </View>
                <View style={styles.clubStatItem}>
                  <Text style={styles.clubStatNumber}>
                    {new Date(selectedClub.created_at).getFullYear()}
                  </Text>
                  <Text style={styles.clubStatLabel}>Founded</Text>
                </View>
              </View>

              {/* Club Lead */}
              <View style={styles.clubLeadCard}>
                <Text style={styles.cardTitle}>Club Leadership</Text>
                <View style={styles.leadInfo}>
                  <Ionicons name="person-circle-outline" size={40} color="#4A90E2" />
                  <View style={styles.leadDetails}>
                    <Text style={styles.leadName}>{selectedClub.lead?.name}</Text>
                    <Text style={styles.leadEmail}>{selectedClub.lead?.email}</Text>
                    <Text style={styles.leadRole}>Club Lead</Text>
                  </View>
                </View>
              </View>

              {/* Upcoming Events */}
              {selectedClub.events && selectedClub.events.length > 0 && (
                <View style={styles.clubEventsCard}>
                  <Text style={styles.cardTitle}>Upcoming Events</Text>
                  {selectedClub.events.map((event: any) => (
                    <TouchableOpacity 
                      key={event.id}
                      style={styles.clubEventItem}
                      onPress={() => {
                        loadEventDetails(event.id);
                        setCurrentScreen('eventDetail');
                      }}
                    >
                      <View style={styles.clubEventInfo}>
                        <Text style={styles.clubEventTitle}>{event.title}</Text>
                        <Text style={styles.clubEventDate}>
                          {new Date(event.date).toLocaleDateString()}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Join Button */}
              {user && (
                <TouchableOpacity 
                  style={styles.joinButton}
                  onPress={() => joinClub(selectedClub.id)}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#fff" />
                  <Text style={styles.joinButtonText}>Join Club</Text>
                </TouchableOpacity>
              )}

              {!user && (
                <View style={styles.loginPromptCard}>
                  <Text style={styles.loginPromptText}>Please login to join this club</Text>
                  <TouchableOpacity 
                    style={styles.loginPromptButton}
                    onPress={() => {
                      setCurrentScreen('login');
                    }}
                  >
                    <Text style={styles.loginPromptButtonText}>Login</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={[styles.navButton, currentScreen === 'home' && styles.navButtonActive]}
            onPress={() => setCurrentScreen('home')}
          >
            <Ionicons name="home" size={24} color={currentScreen === 'home' ? "#4A90E2" : "#666"} />
            <Text style={[styles.navText, currentScreen === 'home' && styles.navTextActive]}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, currentScreen === 'community' && styles.navButtonActive]}
            onPress={() => setCurrentScreen('community')}
          >
            <Ionicons name="people" size={24} color={currentScreen === 'community' ? "#4A90E2" : "#666"} />
            <Text style={[styles.navText, currentScreen === 'community' && styles.navTextActive]}>Community</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, currentScreen === 'profile' && styles.navButtonActive]}
            onPress={() => setCurrentScreen('profile')}
          >
            <Ionicons name="person" size={24} color={currentScreen === 'profile' ? "#4A90E2" : "#666"} />
            <Text style={[styles.navText, currentScreen === 'profile' && styles.navTextActive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Admin Dashboard
  const renderAdminDashboard = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Admin Dashboard</Text>
          <TouchableOpacity onPress={() => setShowAdmin(false)}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.adminTabs}>
          <TouchableOpacity 
            style={[styles.adminTab, adminTab === 'dashboard' && styles.adminTabActive]}
            onPress={() => setAdminTab('dashboard')}
          >
            <Text style={[styles.adminTabText, adminTab === 'dashboard' && styles.adminTabTextActive]}>
              Dashboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.adminTab, adminTab === 'users' && styles.adminTabActive]}
            onPress={() => setAdminTab('users')}
          >
            <Text style={[styles.adminTabText, adminTab === 'users' && styles.adminTabTextActive]}>
              Users
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.adminTab, adminTab === 'events' && styles.adminTabActive]}
            onPress={() => setAdminTab('events')}
          >
            <Text style={[styles.adminTabText, adminTab === 'events' && styles.adminTabTextActive]}>
              Events
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.adminContent}>
          {loadingAdmin ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <>
              {adminTab === 'dashboard' && (
                <View>
                  <Text style={styles.adminSectionTitle}>System Overview</Text>
                  {adminData.analytics && (
                    <View style={styles.statsGrid}>
                      <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{adminData.analytics.stats?.overview?.total_users || 0}</Text>
                        <Text style={styles.statLabel}>Total Users</Text>
                      </View>
                      <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{adminData.analytics.stats?.overview?.total_events || 0}</Text>
                        <Text style={styles.statLabel}>Total Events</Text>
                      </View>
                      <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{adminData.analytics.stats?.overview?.total_clubs || 0}</Text>
                        <Text style={styles.statLabel}>Total Clubs</Text>
                      </View>
                      <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{adminData.analytics.stats?.event_status?.pending || 0}</Text>
                        <Text style={styles.statLabel}>Pending Events</Text>
                      </View>
                    </View>
                  )}
                  
                  {adminData.communityAnalytics && (
                    <View>
                      <Text style={styles.adminSectionTitle}>Community Stats</Text>
                      <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                          <Text style={styles.statNumber}>{adminData.communityAnalytics.analytics?.overview?.total_posts || 0}</Text>
                          <Text style={styles.statLabel}>Total Posts</Text>
                        </View>
                        <View style={styles.statCard}>
                          <Text style={styles.statNumber}>{adminData.communityAnalytics.analytics?.overview?.total_comments || 0}</Text>
                          <Text style={styles.statLabel}>Total Comments</Text>
                        </View>
                        <View style={styles.statCard}>
                          <Text style={styles.statNumber}>{adminData.communityAnalytics.analytics?.overview?.total_reactions || 0}</Text>
                          <Text style={styles.statLabel}>Total Reactions</Text>
                        </View>
                        <View style={styles.statCard}>
                          <Text style={styles.statNumber}>{adminData.communityAnalytics.analytics?.moderation?.pending_reports || 0}</Text>
                          <Text style={styles.statLabel}>Pending Reports</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {adminTab === 'users' && (
                <View>
                  <Text style={styles.adminSectionTitle}>User Management</Text>
                  {adminData.users.map((user: any) => (
                    <View key={user.id} style={styles.userCard}>
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                        <Text style={styles.userRole}>Role: {user.role}</Text>
                      </View>
                      <Text style={styles.userStats}>
                        Posts: {user.clubs_count || 0} | Registrations: {user.registrations_count || 0}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {adminTab === 'events' && (
                <View>
                  <Text style={styles.adminSectionTitle}>Event Management</Text>
                  
                  {adminData.pendingEvents.length > 0 && (
                    <View>
                      <Text style={styles.adminSubsectionTitle}>Pending Approval</Text>
                      {adminData.pendingEvents.map((event: any) => (
                        <View key={event.id} style={styles.eventCard}>
                          <Text style={styles.eventTitle}>{event.title}</Text>
                          <Text style={styles.eventDescription}>{event.description}</Text>
                          <Text style={styles.eventDetails}>
                            {event.venue} • {new Date(event.date).toLocaleDateString()}
                          </Text>
                          <Text style={styles.eventClub}>by {event.club?.name}</Text>
                          
                          <View style={styles.eventActions}>
                            <TouchableOpacity 
                              style={styles.approveButton}
                              onPress={() => updateEventStatus(event.id, 'approved')}
                            >
                              <Text style={styles.approveButtonText}>Approve</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={styles.rejectButton}
                              onPress={() => updateEventStatus(event.id, 'rejected')}
                            >
                              <Text style={styles.rejectButtonText}>Reject</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  <Text style={styles.adminSubsectionTitle}>All Events</Text>
                  {adminData.events.map((event: any) => (
                    <View key={event.id} style={styles.eventCard}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventDetails}>
                        {event.venue} • {new Date(event.date).toLocaleDateString()}
                      </Text>
                      <Text style={styles.eventStatus}>Status: {event.status}</Text>
                      <Text style={styles.eventRegistrations}>
                        Registrations: {event.registration_count || 0}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );

  // Coordinator Dashboard
  const renderCoordinatorDashboard = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Coordinator Dashboard</Text>
          <TouchableOpacity onPress={() => setShowCoordinator(false)}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.adminTabs}>
          <TouchableOpacity 
            style={[styles.adminTab, coordinatorTab === 'dashboard' && styles.adminTabActive]}
            onPress={() => setCoordinatorTab('dashboard')}
          >
            <Text style={[styles.adminTabText, coordinatorTab === 'dashboard' && styles.adminTabTextActive]}>
              Dashboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.adminTab, coordinatorTab === 'events' && styles.adminTabActive]}
            onPress={() => setCoordinatorTab('events')}
          >
            <Text style={[styles.adminTabText, coordinatorTab === 'events' && styles.adminTabTextActive]}>
              Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.adminTab, coordinatorTab === 'clubs' && styles.adminTabActive]}
            onPress={() => setCoordinatorTab('clubs')}
          >
            <Text style={[styles.adminTabText, coordinatorTab === 'clubs' && styles.adminTabTextActive]}>
              Clubs
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.adminContent}>
          {loadingCoordinator ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <>
              {coordinatorTab === 'dashboard' && (
                <View>
                  <Text style={styles.adminSectionTitle}>Overview</Text>
                  {coordinatorData.dashboard && (
                    <View style={styles.statsGrid}>
                      <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{coordinatorData.dashboard.stats?.total_clubs || 0}</Text>
                        <Text style={styles.statLabel}>My Clubs</Text>
                      </View>
                      <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{coordinatorData.dashboard.stats?.total_events || 0}</Text>
                        <Text style={styles.statLabel}>Total Events</Text>
                      </View>
                      <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{coordinatorData.dashboard.stats?.pending_events || 0}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                      </View>
                      <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{coordinatorData.dashboard.stats?.approved_events || 0}</Text>
                        <Text style={styles.statLabel}>Approved</Text>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {coordinatorTab === 'events' && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.adminSectionTitle}>My Events</Text>
                    <TouchableOpacity 
                      style={styles.createButton}
                      onPress={() => setShowCreateEvent(true)}
                    >
                      <Ionicons name="add" size={20} color="#fff" />
                      <Text style={styles.createButtonText}>Create Event</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {coordinatorData.events.map((event: any) => (
                    <View key={event.id} style={styles.eventCard}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventDescription}>{event.description}</Text>
                      <Text style={styles.eventDetails}>
                        {event.venue} • {new Date(event.date).toLocaleDateString()}
                      </Text>
                      <Text style={styles.eventStatus}>Status: {event.status}</Text>
                      <Text style={styles.eventRegistrations}>
                        Registrations: {event.registration_count || 0}/{event.capacity}
                      </Text>
                      
                      <View style={styles.eventActions}>
                        <TouchableOpacity 
                          style={styles.viewButton}
                          onPress={() => loadEventRegistrations(event.id)}
                        >
                          <Text style={styles.viewButtonText}>View Details</Text>
                        </TouchableOpacity>
                        {event.status === 'pending' && (
                          <TouchableOpacity 
                            style={styles.rejectButton}
                            onPress={() => deleteEvent(event.id)}
                          >
                            <Text style={styles.rejectButtonText}>Delete</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {coordinatorTab === 'clubs' && (
                <View>
                  <Text style={styles.adminSectionTitle}>My Clubs</Text>
                  {coordinatorData.clubs.map((club: any) => (
                    <View key={club.id} style={styles.userCard}>
                      <Text style={styles.userName}>{club.name}</Text>
                      <Text style={styles.userEmail}>{club.description}</Text>
                      <Text style={styles.userStats}>
                        Events: {club.event_count || 0} | Pending: {club.pending_events || 0}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );

  // Create Event Modal
  const renderCreateEventModal = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Create Event</Text>
          <TouchableOpacity onPress={() => setShowCreateEvent(false)}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          <TextInput
            style={styles.input}
            placeholder="Event Title"
            value={eventForm.title}
            onChangeText={(text) => setEventForm(prev => ({ ...prev, title: text }))}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Event Description"
            value={eventForm.description}
            onChangeText={(text) => setEventForm(prev => ({ ...prev, description: text }))}
            multiline
            numberOfLines={4}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={eventForm.date}
            onChangeText={(text) => setEventForm(prev => ({ ...prev, date: text }))}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Venue"
            value={eventForm.venue}
            onChangeText={(text) => setEventForm(prev => ({ ...prev, venue: text }))}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Capacity"
            value={eventForm.capacity}
            onChangeText={(text) => setEventForm(prev => ({ ...prev, capacity: text }))}
            keyboardType="numeric"
          />
          
          <View style={styles.clubSelector}>
            <Text style={styles.clubSelectorLabel}>Select Club:</Text>
            {coordinatorData.clubs.map((club: any) => (
              <TouchableOpacity
                key={club.id}
                style={[
                  styles.clubOption,
                  eventForm.club_id === club.id && styles.clubOptionSelected
                ]}
                onPress={() => setEventForm(prev => ({ ...prev, club_id: club.id }))}
              >
                <Text style={[
                  styles.clubOptionText,
                  eventForm.club_id === club.id && styles.clubOptionTextSelected
                ]}>
                  {club.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.createPostButton, loading && styles.createPostButtonDisabled]}
            onPress={createEvent}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.createPostButtonText}>Create Event</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );

  // Event Detail Modal
  const renderEventDetailModal = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Event Details</Text>
          <TouchableOpacity onPress={() => setShowEventDetail(false)}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          {coordinatorData.selectedEvent && (
            <View>
              <Text style={styles.eventTitle}>{coordinatorData.selectedEvent.title}</Text>
              <Text style={styles.eventDescription}>{coordinatorData.selectedEvent.description}</Text>
              <Text style={styles.eventDetails}>
                {coordinatorData.selectedEvent.venue} • {new Date(coordinatorData.selectedEvent.date).toLocaleDateString()}
              </Text>
              <Text style={styles.eventStatus}>Status: {coordinatorData.selectedEvent.status}</Text>
              
              <View style={styles.registrationStats}>
                <Text style={styles.statsTitle}>Registration Statistics</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{coordinatorData.registrations.filter((r: any) => r.status === 'registered').length}</Text>
                    <Text style={styles.statLabel}>Registered</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{coordinatorData.selectedEvent.capacity - coordinatorData.registrations.filter((r: any) => r.status === 'registered').length}</Text>
                    <Text style={styles.statLabel}>Available</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{coordinatorData.registrations.filter((r: any) => r.status === 'cancelled').length}</Text>
                    <Text style={styles.statLabel}>Cancelled</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.participantsTitle}>Participants</Text>
              {coordinatorData.registrations.filter((r: any) => r.status === 'registered').map((registration: any) => (
                <View key={registration.id} style={styles.participantCard}>
                  <Ionicons name="person-circle" size={32} color="#666" />
                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>{registration.user?.name}</Text>
                    <Text style={styles.participantEmail}>{registration.user?.email}</Text>
                    <Text style={styles.participantDate}>
                      Registered: {new Date(registration.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );

  // Create Post Modal
  const renderCreatePostModal = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Create Post</Text>
          <TouchableOpacity onPress={() => setShowCreatePost(false)}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          <View style={styles.postTypeSelector}>
            <TouchableOpacity 
              style={[styles.postTypeButton, postForm.post_type === 'text' && styles.postTypeButtonActive]}
              onPress={() => setPostForm(prev => ({ ...prev, post_type: 'text' }))}
            >
              <Ionicons name="text" size={20} color={postForm.post_type === 'text' ? "#4A90E2" : "#666"} />
              <Text style={[styles.postTypeText, postForm.post_type === 'text' && styles.postTypeTextActive]}>
                Text
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.postTypeButton, postForm.post_type === 'image' && styles.postTypeButtonActive]}
              onPress={() => setPostForm(prev => ({ ...prev, post_type: 'image' }))}
            >
              <Ionicons name="image" size={20} color={postForm.post_type === 'image' ? "#4A90E2" : "#666"} />
              <Text style={[styles.postTypeText, postForm.post_type === 'image' && styles.postTypeTextActive]}>
                Image
              </Text>
            </TouchableOpacity>
          </View>

          {postForm.post_type === 'text' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Post title"
                value={postForm.title}
                onChangeText={(text) => setPostForm(prev => ({ ...prev, title: text }))}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What's on your mind?"
                value={postForm.content}
                onChangeText={(text) => setPostForm(prev => ({ ...prev, content: text }))}
                multiline
                numberOfLines={4}
              />
            </>
          )}

          {postForm.post_type === 'image' && (
            <>
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                <Ionicons name="camera" size={24} color="#4A90E2" />
                <Text style={styles.imagePickerText}>Select Image</Text>
              </TouchableOpacity>
              
              {postForm.image_url && (
                <Image source={{ uri: postForm.image_url }} style={styles.selectedImage} />
              )}
              
              <TextInput
                style={styles.input}
                placeholder="Image caption (optional)"
                value={postForm.image_caption}
                onChangeText={(text) => setPostForm(prev => ({ ...prev, image_caption: text }))}
              />
            </>
          )}

          <TouchableOpacity 
            style={[styles.createPostButton, loading && styles.createPostButtonDisabled]}
            onPress={handleCreatePost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.createPostButtonText}>Create Post</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );

  // Post Detail Modal
  const renderPostDetailModal = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Post Details</Text>
          <TouchableOpacity onPress={() => setShowPostDetail(false)}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          {selectedPost && (
            <View style={styles.postDetail}>
              <View style={styles.postHeader}>
                <View style={styles.postAuthor}>
                  <Ionicons name="person-circle" size={32} color="#666" />
                  <View>
                    <Text style={styles.authorName}>{selectedPost.author?.name}</Text>
                    <Text style={styles.postTime}>
                      {new Date(selectedPost.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.postTitle}>{selectedPost.title}</Text>
              <Text style={styles.postContent}>{selectedPost.content}</Text>
              
              {selectedPost.image_url && (
                <Image source={{ uri: selectedPost.image_url }} style={styles.postImage} />
              )}
              
              <View style={styles.postActions}>
                <AnimatedHeart
                  postId={selectedPost.id}
                  isLiked={likedPosts.has(selectedPost.id)}
                  onPress={() => handleLikePost(selectedPost.id)}
                  count={selectedPost.reaction_count}
                />
              </View>

              <View style={styles.commentsSection}>
                <Text style={styles.commentsTitle}>Comments</Text>
                
                <View style={styles.addCommentSection}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                  />
                  <TouchableOpacity 
                    style={styles.addCommentButton}
                    onPress={handleAddComment}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#4A90E2" />
                    ) : (
                      <Ionicons name="send" size={20} color="#4A90E2" />
                    )}
                  </TouchableOpacity>
                </View>

                {comments.map(comment => (
                  <View key={comment.id} style={styles.commentCard}>
                    <View style={styles.commentHeader}>
                      <Ionicons name="person-circle" size={24} color="#666" />
                      <View>
                        <Text style={styles.commentAuthor}>{comment.author?.name}</Text>
                        <Text style={styles.commentTime}>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );

  // Chat List Modal
  const renderChatListModal = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Messages</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => {
                setShowUserSearch(true);
                setSearchQuery('');
                setSearchUsersResults([]);
              }}
            >
              <Ionicons name="add" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowChatList(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.modalBody}>
          {conversations.map(conversation => (
            <TouchableOpacity 
              key={conversation.id} 
              style={styles.conversationItem}
              onPress={() => {
                setSelectedConversation(conversation);
                setShowChatList(false);
                setShowChat(true);
                loadMessages(conversation.id);
              }}
            >
              <Ionicons name="person-circle" size={40} color="#666" />
              <View style={styles.conversationInfo}>
                <Text style={styles.conversationName}>
                  {conversation.other_user?.name || 'Unknown User'}
                </Text>
                <Text style={styles.lastMessage}>
                  {conversation.last_message?.content || 'No messages yet'}
                </Text>
              </View>
              <Text style={styles.conversationTime}>
                {conversation.last_message?.created_at ? 
                  new Date(conversation.last_message.created_at).toLocaleDateString() : 
                  ''
                }
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  // User Search Modal
  const renderUserSearchModal = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Start Conversation</Text>
          <TouchableOpacity onPress={() => setShowUserSearch(false)}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.modalBody}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              searchUsers(text);
            }}
          />

          <ScrollView>
            {searchUsersResults.map(user => (
              <TouchableOpacity 
                key={user.id} 
                style={styles.userSearchItem}
                onPress={() => startConversation(user)}
              >
                <Ionicons name="person-circle" size={40} color="#666" />
                <View>
                  <Text style={styles.searchUserName}>{user.name}</Text>
                  <Text style={styles.searchUserEmail}>{user.email}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );

  // Chat Modal
  const renderChatModal = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => {
            setShowChat(false);
            setShowChatList(true);
          }}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {selectedConversation?.other_user?.name || 'Chat'}
          </Text>
          <TouchableOpacity onPress={() => setShowChat(false)}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.chatMessages}>
          {messages.map(message => (
            <View 
              key={message.id} 
              style={[
                styles.messageItem,
                message.sender?.id === user?.id ? styles.myMessage : styles.otherMessage
              ]}
            >
              <Text style={styles.messageContent}>{message.content}</Text>
              <Text style={styles.messageTime}>
                {new Date(message.created_at).toLocaleTimeString()}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.chatInput}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Ionicons name="send" size={20} color="#4A90E2" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Main render function
  return (
    <View style={styles.container}>
      {currentScreen === 'login' && renderLoginScreen()}
      {currentScreen === 'register' && renderRegisterScreen()}
      {currentScreen === 'home' && renderHomeScreen()}
      {currentScreen === 'community' && renderCommunityScreen()}
      {currentScreen === 'profile' && renderProfileScreen()}
      {currentScreen === 'eventDetail' && renderEventPage()}
      {currentScreen === 'clubDetail' && renderClubPage()}
      
      {showAdmin && renderAdminDashboard()}
      {showCoordinator && renderCoordinatorDashboard()}
      {showCreateEvent && renderCreateEventModal()}
      {showEventDetail && renderEventDetailModal()}
      {showCreatePost && renderCreatePostModal()}
      {showPostDetail && renderPostDetailModal()}
      {showChatList && renderChatListModal()}
      {showUserSearch && renderUserSearchModal()}
      {showChat && renderChatModal()}
    </View>
  );
}