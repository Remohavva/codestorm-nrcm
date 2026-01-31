import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, CHROME_GRADIENT } from '../constants/theme';

const Card = ({
  children,
  style,
  gradient = false,
  shadow = 'medium', // 'light', 'medium', 'heavy', 'none'
  padding = 'medium', // 'small', 'medium', 'large', 'none'
  ...props
}) => {
  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    // Shadow styles
    if (shadow === 'light') {
      baseStyle.push(SHADOWS.light);
    } else if (shadow === 'medium') {
      baseStyle.push(SHADOWS.medium);
    } else if (shadow === 'heavy') {
      baseStyle.push(SHADOWS.heavy);
    }

    // Padding styles
    if (padding === 'small') {
      baseStyle.push(styles.smallPadding);
    } else if (padding === 'large') {
      baseStyle.push(styles.largePadding);
    } else if (padding === 'medium') {
      baseStyle.push(styles.mediumPadding);
    }

    return baseStyle;
  };

  if (gradient) {
    return (
      <View style={[getCardStyle(), style]} {...props}>
        <LinearGradient
          colors={CHROME_GRADIENT}
          style={styles.gradientContainer}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gradientContainer: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  smallPadding: {
    padding: SPACING.sm,
  },
  mediumPadding: {
    padding: SPACING.md,
  },
  largePadding: {
    padding: SPACING.lg,
  },
});

export default Card;