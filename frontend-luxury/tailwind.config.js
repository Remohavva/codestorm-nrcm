/** @type {import('tailwindcss').Config} */
const { designTokens } = require('./design-tokens.js');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Colors from design tokens
      colors: {
        // Background system
        bg: designTokens.colors.background,
        
        // Chrome system
        chrome: designTokens.colors.chrome,
        
        // Accent system
        accent: designTokens.colors.accent,
        
        // Text system
        text: designTokens.colors.text,
        
        // Border system
        border: designTokens.colors.border,
        
        // Glass system
        glass: designTokens.colors.glass,
        
        // Semantic colors
        primary: designTokens.colors.accent.primary,
        secondary: designTokens.colors.accent.secondary,
        success: designTokens.colors.accent.success,
        warning: designTokens.colors.accent.warning,
        error: designTokens.colors.accent.error,
        info: designTokens.colors.accent.info,
      },
      
      // Typography
      fontFamily: designTokens.typography.fontFamily,
      fontSize: designTokens.typography.fontSize,
      fontWeight: designTokens.typography.fontWeight,
      
      // Spacing
      spacing: designTokens.spacing,
      
      // Border radius
      borderRadius: designTokens.borderRadius,
      
      // Box shadows
      boxShadow: designTokens.boxShadow,
      
      // Screens
      screens: designTokens.screens,
      
      // Z-index
      zIndex: designTokens.zIndex,
      
      // Animation
      transitionDuration: designTokens.animation.duration,
      transitionTimingFunction: designTokens.animation.easing,
      
      // Custom gradients
      backgroundImage: {
        'chrome-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'obsidian-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #1a1a1a 100%)',
        'metal-gradient': 'linear-gradient(135deg, #94a3b8 0%, #64748b 50%, #475569 100%)',
        'accent-gradient': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'glow-gradient': 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
      },
      
      // Custom backdrop blur
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'chrome-shine': 'chromeShine 3s ease-in-out infinite',
      },
      
      // Keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        chromeShine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      
      // Custom utilities
      utilities: {
        '.glass-morphism': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.chrome-surface': {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.obsidian-surface': {
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #1a1a1a 100%)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        '.text-gradient': {
          background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.chrome-text': {
          background: 'linear-gradient(135deg, #94a3b8 0%, #e2e8f0 50%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    
    // Custom plugin for design system utilities
    function({ addUtilities, addComponents, theme }) {
      // Glass morphism utilities
      addUtilities({
        '.glass-morphism': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.chrome-surface': {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.obsidian-surface': {
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #1a1a1a 100%)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        '.text-gradient': {
          background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.chrome-text': {
          background: 'linear-gradient(135deg, #94a3b8 0%, #e2e8f0 50%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
      });
      
      // Component utilities
      addComponents({
        '.btn-chrome': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: theme('borderRadius.lg'),
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          color: theme('colors.text.primary'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.5)',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
          },
        },
        '.card-chrome': {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: theme('borderRadius.2xl'),
          padding: theme('spacing.6'),
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
        '.input-chrome': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.3'),
          color: theme('colors.text.primary'),
          '&:focus': {
            outline: 'none',
            borderColor: 'rgba(59, 130, 246, 0.5)',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
          },
          '&::placeholder': {
            color: theme('colors.text.muted'),
          },
        },
      });
    },
  ],
};