import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#C0C0C0',
  black: '#000000',
  white: '#FFFFFF',
  accent: '#4A90E2',
  textSecondary: '#666666',
};

const CHROME_GRADIENT = ['#E8E8E8', '#C0C0C0', '#A8A8A8'];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    setUser({ name: 'Test User', email: 'test@example.com' });
    setCurrentScreen('home');
    Alert.alert('Success!', 'You are now logged in!');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
    Alert.alert('Logged Out', 'You have been logged out successfully!');
  };

  const LoginScreen = () => (
    <LinearGradient colors={CHROME_GRADIENT} style={styles.container}>
      <View style={styles.loginCard}>
        <View style={styles.logo}>
          <Ionicons name="school" size={60} color={COLORS.black} />
        </View>
        <Text style={styles.title}>College Events</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setCurrentScreen('register')}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const RegisterScreen = () => (
    <LinearGradient colors={CHROME_GRADIENT} style={styles.container}>
      <View style={styles.loginCard}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('login')}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        
        <View style={styles.logo}>
          <Ionicons name="person-add" size={60} color={COLORS.black} />
        </View>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join your college community</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setCurrentScreen('login')}>
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const HomeScreen = () => (
    <View style={styles.container}>
      <LinearGradient colors={CHROME_GRADIENT} style={styles.header}>
        <Text style={styles.headerTitle}>Welcome, {user?.name}!</Text>
        <TouchableOpacity onPress={() => setCurrentScreen('profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>T</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setCurrentScreen('community')}
          >
            <Ionicons name="chatbubbles" size={24} color={COLORS.white} />
            <Text style={styles.actionText}>Community</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab} onPress={() => setCurrentScreen('home')}>
          <Ionicons name="home" size={24} color={COLORS.black} />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setCurrentScreen('community')}>
          <Ionicons name="chatbubbles-outline" size={24} color={COLORS.textSecondary} />
          <Text style={styles.tabText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setCurrentScreen('profile')}>
          <Ionicons name="person-outline" size={24} color={COLORS.textSecondary} />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CommunityScreen = () => (
    <View style={styles.container}>
      <LinearGradient colors={CHROME_GRADIENT} style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity style={styles.createButton}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </LinearGradient>
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome to Community!</Text>
          <Text style={styles.cardText}>
            Connect with fellow students and share your experiences.
          </Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Post Created!', 'Your post has been created successfully!')}
          >
            <Text style={styles.actionText}>Create Post</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.postAvatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View>
              <Text style={styles.postAuthor}>Admin</Text>
              <Text style={styles.postTime}>2 hours ago</Text>
            </View>
          </View>
          <Text style={styles.postTitle}>Welcome to College Events!</Text>
          <Text style={styles.postContent}>
            This is where students can discuss events, clubs, and campus life.
          </Text>
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionIcon}>
              <Ionicons name="heart-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.actionCount}>15</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIcon}>
              <Ionicons name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.actionCount}>3</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab} onPress={() => setCurrentScreen('home')}>
          <Ionicons name="home-outline" size={24} color={COLORS.textSecondary} />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setCurrentScreen('community')}>
          <Ionicons name="chatbubbles" size={24} color={COLORS.black} />
          <Text style={styles.tabText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setCurrentScreen('profile')}>
          <Ionicons name="person-outline" size={24} color={COLORS.textSecondary} />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ProfileScreen = () => (
    <View style={styles.container}>
      <LinearGradient colors={CHROME_GRADIENT} style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </LinearGradient>
      
      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>T</Text>
          </View>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
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
          <Ionicons name="home-outline" size={24} color={COLORS.textSecondary} />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setCurrentScreen('community')}>
          <Ionicons name="chatbubbles-outline" size={24} color={COLORS.textSecondary} />
          <Text style={styles.tabText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setCurrentScreen('profile')}>
          <Ionicons name="person" size={24} color={COLORS.black} />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderScreen = () => {
    if (!user) {
      return currentScreen === 'register' ? <RegisterScreen /> : <LoginScreen />;
    }
    
    switch (currentScreen) {
      case 'community': return <CommunityScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      {renderScreen()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loginCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
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
    color: COLORS.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 8,
    zIndex: 1,
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
    color: COLORS.black,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
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
    color: COLORS.black,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: COLORS.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: COLORS.accent,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
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
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  postTime: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    color: COLORS.textSecondary,
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
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  profileCard: {
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileAvatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  roleBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.black,
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
    backgroundColor: COLORS.primary,
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
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});