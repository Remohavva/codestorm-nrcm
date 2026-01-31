import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, FONT_SIZES, SPACING, CHROME_GRADIENT } from '../constants/theme';

const HomeScreen = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Browse Events',
      subtitle: 'Discover upcoming events',
      icon: 'calendar-outline',
      color: COLORS.warning,
      onPress: () => Alert.alert('Events', 'Events feature coming soon!'),
    },
    {
      title: 'Join Discussion',
      subtitle: 'Connect with students',
      icon: 'chatbubbles-outline',
      color: COLORS.accent,
      onPress: () => Alert.alert('Discussion', 'Go to Community tab to join discussions!'),
    },
    {
      title: 'Explore Clubs',
      subtitle: 'Find your community',
      icon: 'people-outline',
      color: COLORS.success,
      onPress: () => Alert.alert('Clubs', 'Clubs feature coming soon!'),
    },
  ];

  const recentActivity = [
    {
      title: 'Welcome to College Events!',
      subtitle: 'Start exploring the community',
      time: 'Just now',
      icon: 'star-outline',
    },
    {
      title: 'Photography Club Meeting',
      subtitle: 'Tomorrow at 3 PM',
      time: '2 hours ago',
      icon: 'camera-outline',
    },
    {
      title: 'Study Group Discussion',
      subtitle: 'Computer Science courses',
      time: '4 hours ago',
      icon: 'book-outline',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={CHROME_GRADIENT} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Student'}!</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => Alert.alert('Profile', 'Go to Profile tab to view your profile!')}
          >
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Card gradient style={styles.quickActionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionItem}
                onPress={action.onPress}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon} size={24} color={COLORS.white} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.activityCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityList}>
            {recentActivity.map((item, index) => (
              <TouchableOpacity key={index} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name={item.icon} size={20} color={COLORS.accent} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.activityTime}>{item.time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Posts Created</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>Likes Received</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Events Joined</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Comments Made</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.communityCard}>
          <Text style={styles.cardTitle}>Join the Community</Text>
          <Text style={styles.communityText}>
            Connect with fellow students, share experiences, and stay updated with campus events.
          </Text>
          <Button
            title="Go to Community"
            onPress={() => Alert.alert('Community', 'Go to Community tab to join discussions!')}
            style={styles.communityButton}
          />
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  profileButton: {
    padding: SPACING.xs,
  },
  headerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  content: {
    padding: SPACING.md,
  },
  quickActionsCard: {
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  actionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  actionSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  activityCard: {
    marginBottom: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.accent,
    fontWeight: '600',
  },
  activityList: {
    gap: SPACING.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  activityTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
  },
  statsCard: {
    marginBottom: SPACING.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  statNumber: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  communityCard: {
    alignItems: 'center',
  },
  communityText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  communityButton: {
    minWidth: 200,
  },
});

export default HomeScreen;