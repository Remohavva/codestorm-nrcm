import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, CHROME_GRADIENT } from '../constants/theme';

const Card = ({ children, gradient = false, style, ...props }) => {
  if (gradient) {
    return (
      <View style={[styles.card, style]} {...props}>
        <LinearGradient colors={CHROME_GRADIENT} style={styles.gradientContainer}>
          {children}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.card, styles.regularCard, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  regularCard: {
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gradientContainer: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
});

export default Card;