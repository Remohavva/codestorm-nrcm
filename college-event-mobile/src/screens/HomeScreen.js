import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, FONT_SIZES, SPACING, CHROME_GRADIENT } from '../constants/theme';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={CHROME_GRADIENT} style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{user?.name}!</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Card style={styles.quickActionsCard} gradient>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <Button
              title="Browse Events"
              onPress={() => navigation.navigate('Events')}
              style={styles.actionButton}
            />
            <Button
              title="Join Discussion"
              onPress={() => navigation.navigate('Community')}
              style={styles.actionButton}
            />
            <Button
              title="Explore Clubs"
              onPress={() => navigation.navigate('Clubs')}
              style={styles.actionButton}
            />
          </View>
        </Card>

        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Your Activity</Text>
          <Text style={styles.comingSoon}>Coming Soon...</Text>
          <Text style={styles.comingSoonDesc}>
            Track your event registrations, club memberships, and community engagement.
          </Text>
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
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
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
  content: {
    padding: SPACING.md,
  },
  quickActionsCard: {
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  actionsGrid: {
    gap: SPACING.sm,
  },
  actionButton: {
    marginBottom: SPACING.sm,
  },
  statsCard: {
    alignItems: 'center',
  },
  comingSoon: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  comingSoonDesc: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default HomeScreen;