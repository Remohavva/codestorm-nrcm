// Design Tokens - Liquid Metal / Chrome / Obsidian Black Theme
export const designTokens = {
  // Color Palette
  colors: {
    // Background System
    background: {
      primary: '#0a0a0a',      // Deep obsidian
      secondary: '#111111',     // Graphite
      tertiary: '#1a1a1a',     // Charcoal
      glass: 'rgba(255, 255, 255, 0.02)', // Glass overlay
    },
    
    // Chrome/Metal System
    chrome: {
      50: '#f8fafc',           // Lightest chrome
      100: '#f1f5f9',          // Light chrome
      200: '#e2e8f0',          // Chrome highlight
      300: '#cbd5e1',          // Chrome mid
      400: '#94a3b8',          // Chrome base
      500: '#64748b',          // Chrome dark
      600: '#475569',          // Chrome darker
      700: '#334155',          // Chrome deep
      800: '#1e293b',          // Chrome night
      900: '#0f172a',          // Chrome black
    },
    
    // Accent System
    accent: {
      primary: '#3b82f6',      // Electric blue
      secondary: '#8b5cf6',    // Purple
      success: '#10b981',      // Emerald
      warning: '#f59e0b',      // Amber
      error: '#ef4444',        // Red
      info: '#06b6d4',         // Cyan
    },
    
    // Glass/Reflection System
    glass: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.05)',
      dark: 'rgba(0, 0, 0, 0.2)',
      reflection: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)',
    },
    
    // Text System
    text: {
      primary: '#ffffff',      // Pure white
      secondary: '#e2e8f0',    // Chrome light
      tertiary: '#94a3b8',     // Chrome mid
      muted: '#64748b',        // Chrome dark
      inverse: '#0a0a0a',      // Black on light
    },
    
    // Border System
    border: {
      primary: 'rgba(255, 255, 255, 0.1)',
      secondary: 'rgba(255, 255, 255, 0.05)',
      accent: 'rgba(59, 130, 246, 0.3)',
      chrome: 'rgba(148, 163, 184, 0.2)',
    }
  },
  
  // Typography Scale
  typography: {
    fontFamily: {
      primary: ['Inter', 'SF Pro Display', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      secondary: ['SF Pro Text', 'Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Cascadia Code', 'monospace'],
    },
    
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
      sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
      base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.0125em' }],
      lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0.0125em' }],
      xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '0em' }],
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.0125em' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],
      '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
      '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
      '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
      '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
      '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
    },
    
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    }
  },
  
  // Spacing System (8px base)
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem',      // 384px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  // Shadows & Glows
  boxShadow: {
    // Ambient shadows
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    
    // Chrome glows
    'chrome-sm': '0 0 10px rgba(148, 163, 184, 0.1)',
    'chrome-md': '0 0 20px rgba(148, 163, 184, 0.15)',
    'chrome-lg': '0 0 30px rgba(148, 163, 184, 0.2)',
    
    // Accent glows
    'accent-sm': '0 0 10px rgba(59, 130, 246, 0.2)',
    'accent-md': '0 0 20px rgba(59, 130, 246, 0.3)',
    'accent-lg': '0 0 30px rgba(59, 130, 246, 0.4)',
    
    // Inner shadows
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    'inner-chrome': 'inset 0 1px 2px rgba(255, 255, 255, 0.1)',
    
    none: 'none',
  },
  
  // Animation & Transitions
  animation: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      chrome: 'cubic-bezier(0.16, 1, 0.3, 1)',
    }
  },
  
  // Breakpoints
  screens: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-Index Scale
  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    auto: 'auto',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modal: '1040',
    popover: '1050',
    tooltip: '1060',
    toast: '1070',
  }
};

// CSS Custom Properties for runtime theme switching
export const cssVariables = {
  ':root': {
    // Background
    '--bg-primary': designTokens.colors.background.primary,
    '--bg-secondary': designTokens.colors.background.secondary,
    '--bg-tertiary': designTokens.colors.background.tertiary,
    '--bg-glass': designTokens.colors.background.glass,
    
    // Chrome
    '--chrome-50': designTokens.colors.chrome[50],
    '--chrome-100': designTokens.colors.chrome[100],
    '--chrome-200': designTokens.colors.chrome[200],
    '--chrome-300': designTokens.colors.chrome[300],
    '--chrome-400': designTokens.colors.chrome[400],
    '--chrome-500': designTokens.colors.chrome[500],
    '--chrome-600': designTokens.colors.chrome[600],
    '--chrome-700': designTokens.colors.chrome[700],
    '--chrome-800': designTokens.colors.chrome[800],
    '--chrome-900': designTokens.colors.chrome[900],
    
    // Text
    '--text-primary': designTokens.colors.text.primary,
    '--text-secondary': designTokens.colors.text.secondary,
    '--text-tertiary': designTokens.colors.text.tertiary,
    '--text-muted': designTokens.colors.text.muted,
    
    // Accents
    '--accent-primary': designTokens.colors.accent.primary,
    '--accent-secondary': designTokens.colors.accent.secondary,
    '--accent-success': designTokens.colors.accent.success,
    '--accent-warning': designTokens.colors.accent.warning,
    '--accent-error': designTokens.colors.accent.error,
    '--accent-info': designTokens.colors.accent.info,
    
    // Borders
    '--border-primary': designTokens.colors.border.primary,
    '--border-secondary': designTokens.colors.border.secondary,
    '--border-accent': designTokens.colors.border.accent,
    '--border-chrome': designTokens.colors.border.chrome,
    
    // Glass
    '--glass-light': designTokens.colors.glass.light,
    '--glass-medium': designTokens.colors.glass.medium,
    '--glass-dark': designTokens.colors.glass.dark,
  }
};

export default designTokens;

module.exports = { designTokens };