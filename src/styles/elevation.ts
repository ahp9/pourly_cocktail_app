import type { ViewStyle } from 'react-native';
import { colors } from './colors';

/**
 * Two levels only.
 * Cards get a border and no shadow.
 * The primary CTA gets an amber glow.
 */
export const elevation = {
  card: {
    borderWidth: 1,
    borderColor: colors.line,
  },
  ctaGlow: {
    shadowColor: colors.amber,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10, // Android. shadowColor applies on API 28+.
  },
} satisfies Record<string, ViewStyle>;
