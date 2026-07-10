export const colors = {
  // Core surfaces
  bg: '#0D0D0D',           // page background
  surface: '#161616',      // card / raised surface
  surfaceAlt: '#1E1E1E',   // secondary surface (avatars, placeholders, input fields)
  border: '#262626',       // hairline borders / dividers

  // Accent
  primary: '#C8FF3D',      // neon lime — primary accent
  primaryDark: '#A8E01F',
  onPrimary: '#0D0D0D',    // text/icon color placed on top of primary

  // Secondary accent
  accentBlue: '#4FA8FF',
  accentPink: '#FF6FA5',
  accentTeal: '#00E0C7',
  accentPurple: '#8A6FFF',
  accentOrange: '#FF5A36',

  // Text
  white: '#FFFFFF',
  textPrimary: '#FFFFFF',
  textSecondary: '#9A9A9A',
  textMuted: '#6E6E6E',

  // Legacy aliases kept for compatibility
  black: '#0D0D0D',
  charcoal: '#1E1E1E',
  offWhite: '#0D0D0D',
  gray: '#9A9A9A',
  lightGray: '#262626',
  card: '#161616',

  danger: '#FF5A5A',
  success: '#3DDC84',

  overlay: 'rgba(0,0,0,0.55)',
  scrimTop: 'rgba(0,0,0,0)',
  scrimBottom: 'rgba(0,0,0,0.92)',
};

export const type = {
  display: { fontSize: 30, fontWeight: '800', letterSpacing: -0.6 },
  h1: { fontSize: 24, fontWeight: '800', letterSpacing: -0.4 },
  h2: { fontSize: 19, fontWeight: '800', letterSpacing: -0.3 },
  h3: { fontSize: 15, fontWeight: '700' },
  body: { fontSize: 14, fontWeight: '500' },
  caption: { fontSize: 12, fontWeight: '600' },
  micro: { fontSize: 10.5, fontWeight: '700', letterSpacing: 0.4 },
};

export const shadow = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  deep: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 10,
  },
  glow: {
    shadowColor: '#C8FF3D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 32,
  full: 999,
};