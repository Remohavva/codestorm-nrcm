// Silver + Chrome + Black Theme
export const COLORS = {
  // Primary Colors
  primary: '#C0C0C0',      // Silver
  primaryDark: '#A8A8A8',  // Darker Silver
  primaryLight: '#E8E8E8', // Light Silver
  
  // Chrome/Metallic
  chrome: '#B8B8B8',
  chromeDark: '#909090',
  chromeLight: '#D0D0D0',
  
  // Black variants
  black: '#000000',
  blackLight: '#1A1A1A',
  blackMedium: '#333333',
  
  // White variants
  white: '#FFFFFF',
  whiteDark: '#F5F5F5',
  
  // Accent colors
  accent: '#4A90E2',       // Blue for links/actions
  success: '#4CAF50',      // Green
  warning: '#FF9800',      // Orange
  error: '#F44336',        // Red
  
  // Text colors
  textPrimary: '#000000',
  textSecondary: '#666666',
  textLight: '#999999',
  textOnDark: '#FFFFFF',
  
  // Background colors
  background: '#FFFFFF',
  backgroundDark: '#F5F5F5',
  backgroundCard: '#FFFFFF',
  
  // Border colors
  border: '#E0E0E0',
  borderDark: '#CCCCCC',
  
  // Shadow colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heavy: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const CHROME_GRADIENT = ['#E8E8E8', '#C0C0C0', '#A8A8A8'];
export const DARK_GRADIENT = ['#333333', '#1A1A1A', '#000000'];