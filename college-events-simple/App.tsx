import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS } from './src/constants/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  // Form states
  const [loginForm, setLoginForm] = useState({ 
    email: 'test@example.com',  // Pre-filled for testing
    password: 'password123' 
  });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [postForm, setPostForm] = useState({ title: '', content: '', category: 'general' });

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
        const token = response.data.session?.access_token || response.data.token;
        const user = response.data.user;
        
        if (!token) {
          throw new Error('No authentication token received');
        }
        
        if (!user) {
          throw new Error('No user data received');
        }
        
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        setCurrentScreen('home');
        loadPosts();
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
        const token = response.data.session?.access_token || response.data.token;
        const user = response.data.user;
        
        if (!token) {
          throw new Error('No authentication token received');
        }
        
        if (!user) {
          throw new Error('No user data received');
        }
        
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        setCurrentScreen('home');
        loadPosts();
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
        setPosts(response.data.posts || []);
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
          category: 'announcements'
        },
        {
          id: 2,
          title: 'Looking for study group partners',
          content: 'Anyone interested in forming a study group for Computer Science courses? We can meet at the library every Tuesday.',
          author: { name: 'Sarah M.' },
          comment_count: 12,
          reaction_count: 8,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          category: 'academic'
        },
        {
          id: 3,
          title: 'Photography Club Meeting Tomorrow',
          content: 'Don\'t forget about our photography club meeting tomorrow at 3 PM in Room 205. We\'ll be discussing the upcoming photo exhibition!',
          author: { name: 'Photo Club' },
          comment_count: 7,
          reaction_count: 22,
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          category: 'clubs'
        }
      ]);
    }
  };

  const handleCreatePost = async () => {
    if (!postForm.title || !postForm.content) {
      Alert.alert('Error', 'Please fill in title and content');
      return;
    }

    setLoading(true);
    try {
      const response = await apiCall(API_ENDPOINTS.COMMUNITY_POSTS, {
        method: 'POST',
        body: JSON.stringify(postForm),
      });

      if (response.success) {
        setPostForm({ title: '', content: '', category: 'general' });
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
        author: { name: user?.name || 'You' },
        comment_count: 0,
        reaction_count: 0,
        created_at: new Date().toISOString(),
      };
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setPostForm({ title: '', content: '', category: 'general' });
      setShowCreatePost(false);
      
      Alert.alert('Post Created!', 'Your post has been created locally. Note: Backend database needs to be set up for persistent storage.');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await apiCall(API_ENDPOINTS.COMMUNITY_REACT(postId), {
        method: 'POST',
        body: JSON.stringify({ type: 'like' }),
      });
      loadPosts(); // Reload to get updated counts
    } catch (error) {
      // If API fails, update local state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, reaction_count: (post.reaction_count || 0) + 1 }
            : post
        )
      );
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setUser(null);
      setCurrentScreen('login');
      setPosts([]);
      Alert.alert('Logged Out', 'You have been logged out!');
    } catch (error) {
      console.error('Error during logout:', error);
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
                placeholder="Post Title"
                value={postForm.title}
                onChangeText={(text) => setPostForm({...postForm, title: text})}
                multiline={false}
              />
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What's on your mind?"
                value={postForm.content}
                onChangeText={(text) => setPostForm({...postForm, content: text})}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              
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
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postContent}>{post.content}</Text>
              <View style={styles.postActions}>
                <TouchableOpacity 
                  style={styles.actionIcon}
                  onPress={() => handleLikePost(post.id)}
                >
                  <Ionicons name="heart-outline" size={20} color="#666" />
                  <Text style={styles.actionCount}>{post.reaction_count || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIcon}>
                  <Ionicons name="chatbubble-outline" size={20} color="#666" />
                  <Text style={styles.actionCount}>{post.comment_count || 0}</Text>
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
        
        <View style={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>T</Text>
            </View>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>test@example.com</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>STUDENT</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        
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
      
      <ScrollView style={styles.content}>
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
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Community Activity</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {posts.reduce((sum, post) => sum + (post.reaction_count || 0), 0)}
              </Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
          </View>
        </View>
        
        {posts.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Posts</Text>
            {posts.slice(0, 3).map((post) => (
              <TouchableOpacity 
                key={post.id} 
                style={styles.recentPost}
                onPress={() => setCurrentScreen('community')}
              >
                <Text style={styles.recentPostTitle} numberOfLines={1}>
                  {post.title}
                </Text>
                <Text style={styles.recentPostAuthor}>
                  by {post.author?.name || 'Anonymous'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  recentPostTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  recentPostAuthor: {
    fontSize: 14,
    color: '#666',
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
});
