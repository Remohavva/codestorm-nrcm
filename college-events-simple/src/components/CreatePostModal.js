import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Card from './Card';
import Button from './Button';
import Input from './Input';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, CHROME_GRADIENT } from '../constants/theme';

const CreatePostModal = ({ visible, onClose, onCreatePost }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
  });
  const [errors, setErrors] = useState({});

  const categories = [
    { key: 'general', label: 'General Discussion', icon: 'chatbubbles-outline', color: COLORS.textSecondary },
    { key: 'events', label: 'Events', icon: 'calendar-outline', color: COLORS.warning },
    { key: 'clubs', label: 'Clubs', icon: 'people-outline', color: COLORS.success },
    { key: 'academic', label: 'Academic', icon: 'school-outline', color: COLORS.accent },
    { key: 'social', label: 'Social', icon: 'happy-outline', color: COLORS.error },
    { key: 'announcements', label: 'Announcements', icon: 'megaphone-outline', color: COLORS.warning },
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newPost = {
      id: Date.now(), // Simple ID generation
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category,
      author: 'You', // In real app, this would come from auth context
      likes: 0,
      comments: 0,
      time: 'Just now',
    };

    onCreatePost(newPost);
    
    // Reset form
    setFormData({
      title: '',
      content: '',
      category: 'general',
    });
    setErrors({});
    
    Alert.alert('Success!', 'Your post has been created successfully!');
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      title: '',
      content: '',
      category: 'general',
    });
    setErrors({});
    onClose();
  };

  const renderCategoryOption = (category) => (
    <TouchableOpacity
      key={category.key}
      style={[
        styles.categoryOption,
        formData.category === category.key && styles.categoryOptionSelected
      ]}
      onPress={() => updateFormData('category', category.key)}
    >
      <Ionicons 
        name={category.icon} 
        size={24} 
        color={formData.category === category.key ? COLORS.white : category.color}
      />
      <Text
        style={[
          styles.categoryOptionText,
          formData.category === category.key && styles.categoryOptionTextSelected
        ]}
      >
        {category.label}
      </Text>
      {formData.category === category.key && (
        <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient colors={CHROME_GRADIENT} style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <View style={styles.placeholder} />
        </LinearGradient>

        <ScrollView 
          style={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.formCard}>
            <Input
              label="Title"
              placeholder="What's on your mind?"
              value={formData.title}
              onChangeText={(value) => updateFormData('title', value)}
              error={errors.title}
              maxLength={255}
            />

            <Input
              label="Content"
              placeholder="Share your thoughts, ask questions, or start a discussion..."
              value={formData.content}
              onChangeText={(value) => updateFormData('content', value)}
              multiline
              numberOfLines={6}
              error={errors.content}
              maxLength={1000}
            />

            <Text style={styles.characterCount}>
              {formData.content.length}/1000 characters
            </Text>

            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>Category</Text>
              <Text style={styles.sectionSubtitle}>
                Choose the most relevant category for your post
              </Text>
              
              <View style={styles.categoriesContainer}>
                {categories.map(renderCategoryOption)}
              </View>
            </View>
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={handleClose}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title="Post"
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
  closeButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  placeholder: {
    width: 32, // Same width as close button for centering
  },
  content: {
    flex: 1,
  },
  formCard: {
    margin: SPACING.md,
  },
  characterCount: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    textAlign: 'right',
    marginTop: -SPACING.sm,
    marginBottom: SPACING.md,
  },
  categorySection: {
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  categoriesContainer: {
    gap: SPACING.sm,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryOptionSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  categoryOptionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    flex: 1,
    fontWeight: '500',
  },
  categoryOptionTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

export default CreatePostModal;