import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ApiService from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';

const CreatePostScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { key: 'general', label: 'General Discussion', icon: 'chatbubbles-outline' },
    { key: 'events', label: 'Events', icon: 'calendar-outline' },
    { key: 'clubs', label: 'Clubs', icon: 'people-outline' },
    { key: 'academic', label: 'Academic', icon: 'school-outline' },
    { key: 'social', label: 'Social', icon: 'happy-outline' },
    { key: 'announcements', label: 'Announcements', icon: 'megaphone-outline' },
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
    } else if (formData.title.trim().length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    } else if (formData.content.trim().length > 5000) {
      newErrors.content = 'Content must be less than 5000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
      };

      const response = await ApiService.createPost(postData);
      
      if (response.success) {
        Alert.alert(
          'Success',
          'Your post has been created successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create post. Please try again.'
      );
    } finally {
      setLoading(false);
    }
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
        color={formData.category === category.key ? COLORS.black : COLORS.textSecondary}
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
        <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Create New Post</Text>
          
          <Input
            label="Title"
            placeholder="What's on your mind?"
            value={formData.title}
            onChangeText={(value) => updateFormData('title', value)}
            error={errors.title}
            maxLength={255}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Content</Text>
            <Input
              placeholder="Share your thoughts, ask questions, or start a discussion..."
              value={formData.content}
              onChangeText={(value) => updateFormData('content', value)}
              multiline
              numberOfLines={6}
              error={errors.content}
              maxLength={5000}
              style={styles.contentInput}
            />
            <Text style={styles.characterCount}>
              {formData.content.length}/5000
            </Text>
          </View>

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
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.cancelButton}
        />
        <Button
          title="Post"
          onPress={handleSubmit}
          loading={loading}
          disabled={!formData.title.trim() || !formData.content.trim()}
          style={styles.submitButton}
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
  formCard: {
    margin: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  contentInput: {
    marginBottom: 0,
  },
  characterCount: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  categorySection: {
    marginTop: SPACING.md,
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
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  categoryOptionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    flex: 1,
    fontWeight: '500',
  },
  categoryOptionTextSelected: {
    color: COLORS.black,
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

export default CreatePostScreen;