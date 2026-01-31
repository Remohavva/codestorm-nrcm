import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../components/Card';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';

const ClubsScreen = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Clubs</Text>
        <Text style={styles.subtitle}>Coming Soon...</Text>
        <Text style={styles.description}>
          Explore and join student clubs and organizations.
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default ClubsScreen;