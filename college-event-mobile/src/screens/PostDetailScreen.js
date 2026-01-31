import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ApiService from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';

const PostDetailScreen = ({ route, navigation }) => {
  const { post: initialPost } = route.params;
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPostDetails();
  }, []);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getPost(post.id);
      
      if (response.success) {
        setPost(response.data.post);
        setComments(response.data.post.comments || []);
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
      Alert.alert('Error', 'Failed to load post details.');
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (type) => {
    try {
      const response = await ApiService.reactToPost(post.id, type);
      
      if (response.success) {
        setPost(prev => ({
          ...prev,
          user_reaction: response.data.user_reaction,
          reaction_count: response.data.reaction_count
        }));
      }
    } catch (error) {
      console.error('Error reacting to post:', error);
      Alert.alert('Error', 'Failed to react to post.');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const response = await ApiService.addComment(post.id, newComment.trim());
      
      if (response.success) {
        setComments(prev => [...prev, response.data.comment]);
        setPost(prev => ({
          ...prev,
          comment_count: prev.comment_count + 1
        }));
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReport = () => {
    Alert.alert(
      'Report Post',
      'Why are you reporting this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Spam', onPress: () => submitReport('spam') },
        { text: 'Inappropriate', onPress: () => submitReport('inappropriate') },
        { text: 'Harassment', onPress: () => submitReport('harassment') },
        { text: 'Other', onPress: () => submitReport('other') },
      ]
    );
  };

  const submitReport = async (reason) => {
    try {
      const reportData = {
        type: 'post',
        content_id: post.id,
        reason,
      };

      const response = await ApiService.reportContent(reportData);
      
      if (response.success) {
        Alert.alert('Success', 'Report submitted successfully.');
      }
    } catch (error) {
      console.error('Error reporting post:', error);
      Alert.alert('Error', 'Failed to submit report.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderComment = (comment) => (
    <View key={comment.id} style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <View style={styles.commentAvatar}>
          <Text style={styles.commentAvatarText}>
            {comment.author.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.commentInfo}>
          <Text style={styles.commentAuthor}>{comment.author.name}</Text>
          <Text style={styles.commentTime}>{formatDate(comment.created_at)}</Text>
        </View>
      </View>
      <Text style={styles.commentContent}>{comment.content}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.authorInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {post.author.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.authorName}>{post.author.name}</Text>
                <Text style={styles.postTime}>{formatDate(post.created_at)}</Text>
              </View>
            </View>
            
            <View style={styles.headerActions}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{post.category}</Text>
              </View>
              <TouchableOpacity onPress={handleReport} style={styles.reportButton}>
                <Ionicons name="flag-outline" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent}>{post.content}</Text>

          <View style={styles.postActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleReaction('like')}
            >
              <Ionicons 
                name={post.user_reaction === 'like' ? 'heart' : 'heart-outline'} 
                size={24} 
                color={post.user_reaction === 'like' ? COLORS.error : COLORS.textSecondary}
              />
              <Text style={styles.actionText}>{post.reaction_count}</Text>
            </TouchableOpacity>

            <View style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={24} color={COLORS.textSecondary} />
              <Text style={styles.actionText}>{post.comment_count}</Text>
            </View>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </Card>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>
            Comments ({comments.length})
          </Text>
          
          {comments.map(renderComment)}
        </View>
      </ScrollView>

      <View style={styles.commentInputContainer}>
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
          numberOfLines={2}
          style={styles.commentInput}
        />
        <Button
          title="Post"
          onPress={handleAddComment}
          loading={submittingComment}
          disabled={!newComment.trim()}
          size="small"
          style={styles.commentButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  postCard: {
    margin: SPACING.md,
    marginBottom: SPACING.sm,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  avatarText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  authorName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  postTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: COLORS.backgroundDark,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  reportButton: {
    padding: SPACING.xs,
  },
  postTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    lineHeight: 28,
  },
  postContent: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.xl,
  },
  actionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  commentsSection: {
    margin: SPACING.md,
    marginTop: 0,
  },
  commentsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  commentContainer: {
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  commentAvatarText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  commentInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  commentTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
  },
  commentContent: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  commentInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: SPACING.sm,
  },
  commentButton: {
    minWidth: 60,
  },
});

export default PostDetailScreen;