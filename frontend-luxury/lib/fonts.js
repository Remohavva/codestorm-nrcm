import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';

// Primary font - Inter (Apple-like, clean, modern)
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
});

// Secondary font - Plus Jakarta Sans (elegant, luxury feel)
export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  preload: true,
});

// Monospace font - JetBrains Mono (for code, stats, IDs)
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  preload: false, // Only load when needed
});

// Font class combinations for easy use
export const fontClasses = {
  // Primary combinations
  primary: inter.variable,
  secondary: plusJakarta.variable,
  mono: jetbrainsMono.variable,
  
  // All fonts combined
  all: `${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`,
  
  // Specific use cases
  heading: plusJakarta.variable, // Luxury headings
  body: inter.variable,          // Clean body text
  ui: inter.variable,            // UI elements
  code: jetbrainsMono.variable,  // Code, stats, IDs
};

// Typography utility classes
export const typographyClasses = {
  // Display text (hero sections)
  display: {
    '2xl': 'font-plus-jakarta text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight',
    xl: 'font-plus-jakarta text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight',
    lg: 'font-plus-jakarta text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
    md: 'font-plus-jakarta text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight',
    sm: 'font-plus-jakarta text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight',
  },
  
  // Headings
  heading: {
    h1: 'font-plus-jakarta text-3xl md:text-4xl font-bold tracking-tight',
    h2: 'font-plus-jakarta text-2xl md:text-3xl font-semibold tracking-tight',
    h3: 'font-plus-jakarta text-xl md:text-2xl font-semibold tracking-tight',
    h4: 'font-plus-jakarta text-lg md:text-xl font-semibold tracking-tight',
    h5: 'font-plus-jakarta text-base md:text-lg font-semibold tracking-tight',
    h6: 'font-plus-jakarta text-sm md:text-base font-semibold tracking-tight',
  },
  
  // Body text
  body: {
    xl: 'font-inter text-xl leading-relaxed',
    lg: 'font-inter text-lg leading-relaxed',
    md: 'font-inter text-base leading-relaxed',
    sm: 'font-inter text-sm leading-relaxed',
    xs: 'font-inter text-xs leading-relaxed',
  },
  
  // UI text
  ui: {
    lg: 'font-inter text-lg font-medium',
    md: 'font-inter text-base font-medium',
    sm: 'font-inter text-sm font-medium',
    xs: 'font-inter text-xs font-medium',
  },
  
  // Labels
  label: {
    lg: 'font-inter text-sm font-semibold uppercase tracking-wider',
    md: 'font-inter text-xs font-semibold uppercase tracking-wider',
    sm: 'font-inter text-xs font-semibold uppercase tracking-widest',
  },
  
  // Monospace (stats, IDs, code)
  mono: {
    lg: 'font-jetbrains-mono text-lg font-medium tabular-nums',
    md: 'font-jetbrains-mono text-base font-medium tabular-nums',
    sm: 'font-jetbrains-mono text-sm font-medium tabular-nums',
    xs: 'font-jetbrains-mono text-xs font-medium tabular-nums',
  },
  
  // Special effects
  gradient: {
    primary: 'text-gradient bg-gradient-to-r from-white to-chrome-200',
    chrome: 'chrome-text bg-gradient-to-r from-chrome-400 via-chrome-200 to-chrome-400',
    accent: 'text-gradient bg-gradient-to-r from-accent-primary to-accent-secondary',
  },
};

// CSS custom properties for typography
export const typographyCSSVars = {
  ':root': {
    '--font-inter': inter.style.fontFamily,
    '--font-plus-jakarta': plusJakarta.style.fontFamily,
    '--font-jetbrains-mono': jetbrainsMono.style.fontFamily,
    
    // Letter spacing
    '--letter-spacing-tight': '-0.025em',
    '--letter-spacing-normal': '0em',
    '--letter-spacing-wide': '0.025em',
    '--letter-spacing-wider': '0.05em',
    '--letter-spacing-widest': '0.1em',
    
    // Line heights
    '--line-height-none': '1',
    '--line-height-tight': '1.25',
    '--line-height-snug': '1.375',
    '--line-height-normal': '1.5',
    '--line-height-relaxed': '1.625',
    '--line-height-loose': '2',
  },
};

export default {
  inter,
  plusJakarta,
  jetbrainsMono,
  fontClasses,
  typographyClasses,
  typographyCSSVars,
};