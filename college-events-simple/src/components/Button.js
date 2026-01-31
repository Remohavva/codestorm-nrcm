import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, CHROME_GRADIENT } from '../constants/theme';

const Button = ({ title, onPress, variant = 'primary', style, ...props }) => {
  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.button, style]} {...props}>
        <LinearGradient colors={CHROME_GRADIENT} style={styles.gradient}>
          <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, styles.outline, style]}
      {...props}
    >
      <Text style={[styles.buttonText, styles.outlineText]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    minHeight: 44,
  },
  gradient: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  buttonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.black,
  },
  outlineText: {
    color: COLORS.primary,
  },
});

export default Button;