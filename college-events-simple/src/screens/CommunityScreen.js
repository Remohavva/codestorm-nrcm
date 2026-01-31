import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Card from '../components/Card';
import Button from '../components/Button';
import CreatePostModal from '../components/CreatePostModal';
import { COLORS, FONT_SIZES, SPACING, CHROME_GRADIENT } from '../constants/theme';

const CommunityScreen = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Welcome to College Events Community!',
      content: 'This is where students can discuss events, clubs, and campus life. Share your thoughts and connect with fellow students!',
      author: 'Admin',
      category: 'announcements',
      likes: 15,
      comments: 3,
      time: '2 hours ago',
    },
    {
      id: 2,
      title: 'Looking for study group partners',
      content: 'Anyone interested in forming a study group for Computer Science courses? We can meet at the library every Tuesday.',
      author: 'Sarah M.',
      category: 'academic',
      likes: 8,
      comments: 12,
      time: '4 hours ago',
    },
    {
      id: 3,
      title: 'Photography Club Meeting Tomorrow',
      content: 'Don\'t forget about our photography club meeting tomorrow at 3 PM in Room 205. We\'ll be discussing the upcoming photo exhibition!',
      author: 'Photo Club',
      category: 'clubs',
      likes: 22,
      comments: 7,
      time: '6 hours ago',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());

  const handleLike = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: likedPosts.has(postId) ? post.likes - 1 : post.likes + 1 
            }
          : post
      )
    );

    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleComment = (postId) => {
    Alert.alert('Comments', `Opening comments for "${posts.find(p => p.id === postId)?.title}"`);
  };

  const handleShare = (postId) => {
    const post = posts.find(p => p.id === postId);
    Alert.alert('Share Post', `Sharing "${post?.title}"`);
  };

  const handleCreatePost = () => {
    setShowCreateModal(true);
  };

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'announcements': return COLORS.warning;
      case 'academic': return COLORS.accent;
      case 'clubs': return COLORS.success;
      case 'events': return COLORS.warning;
      case 'social': return COLORS.error;
      case 'general': return COLORS.textSecondary;
      default: return COLORS.textSecondary;
    }
  };

  const renderPost = (post) => (
    <Card key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {post.author.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.authorName}>{post.author}</Text>
            <Text style={styles.postTime}>{post.time}</Text>
          </View>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(post.category) }]}>
          <Text style={styles.categoryText}>{post.category}</Text>
        </View>
      </View>

      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postContent}>{post.content}</Text>

      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLike(post.id)}
        >
          <Ionicons 
            name={likedPosts.has(post.id) ? "heart" : "heart-outline"} 
            size={20} 
            color={likedPosts.has(post.id) ? COLORS.error : COLORS.textSecondary}
          />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleComment(post.id)}
        >
          <Ionicons name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleShare(post.id)}
        >
          <Ionicons name="share-outline" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={CHROME_GRADIENT} style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreatePost}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card gradient style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome to the Community!</Text>
          <Text style={styles.welcomeText}>
            Connect with fellow students, discuss events, join clubs, and share your campus experiences.
          </Text>
          <Button 
            title="Create Your First Post" 
            onPress={handleCreatePost}
            style={styles.welcomeButton}
          />
        </Card>

        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Recent Discussions ({posts.length})</Text>
          {posts.map(renderPost)}
        </View>
      </ScrollView>

      <CreatePostModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreatePost={handlePostCreated}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    paddingTop: SPACING.xl,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  createButton: {
    backgroundColor: COLORS.accent,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  welcomeCard: {
    margin: SPACING.md,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  welcomeText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  welcomeButton: {
    minWidth: 200,
  },
  postsSection: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  postCard: {
    marginBottom: SPACING.md,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  avatarText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  authorName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  postTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: SPACING.sm,
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  postTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  postContent: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  actionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
});

export default CommunityScreen;