// Visitor Management — design tokens
// Modest, psychological palette (trust blue, calm green, warm amber) + glass surfaces.

export const colors = {
  // surfaces
  background: '#EEF1F6', // soft off-white
  surface: '#FFFFFF',
  elevated: '#F7F9FC',

  // ink
  text: '#1F2937',
  subtext: '#6B7583',
  subtle: '#9AA4B1',

  // brand / primary (trust, security)
  primary: '#3B6EA5',
  primaryDark: '#2E567F',
  primarySoft: '#E7EEF6',

  // status (psychological)
  success: '#2E9E6B', // checked-in — calm, active
  warning: '#D99A3D', // expected — gentle pending
  muted: '#8A94A3', // checked-out — neutral, complete
  danger: '#C0574F',

  // glass
  glassBorder: 'rgba(255,255,255,0.55)',
  glassDark: 'rgba(31,41,55,0.72)', // deep calm-blue/ink glass for chrome
  glassLight: 'rgba(255,255,255,0.55)',
  glassHighlight: 'rgba(255,255,255,0.9)',
  white: '#FFFFFF',
  shadow: 'rgba(31,41,55,0.14)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 40,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
};

export const type = {
  title: { fontSize: 24, fontWeight: '800' as const, letterSpacing: -0.4 },
  h2: { fontSize: 18, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '500' as const },
  label: { fontSize: 13, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
  small: { fontSize: 11, fontWeight: '600' as const },
};

export const shadow = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
};

export const statusColors: Record<string, { bg: string; fg: string; dot: string }> = {
  checkedin: { bg: '#DFF0E7', fg: '#22704E', dot: colors.success },
  expected: { bg: '#F6EAD6', fg: '#9A6B22', dot: colors.warning },
  checkedout: { bg: '#E9ECF1', fg: '#5B6572', dot: colors.muted },
};

export function statusDisplay(status: string): string {
  return status === 'checked-in'
    ? 'Checked-in'
    : status === 'checked-out'
      ? 'Checked-out'
      : 'Expected';
}