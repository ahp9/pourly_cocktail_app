import { colors, neutrals, action, drinkAccents } from './colors';
import { fontFamily, SERIF_MIN_SIZE } from './fonts';
import { typography } from './typography';
import { spacing, layout } from './spacing';
import { radius } from './radius';
import { controlHeight, imageRatio, icon, MIN_TOUCH_TARGET } from './sizes';
import { elevation } from './elevation';

export const theme = {
  colors,
  fontFamily,
  typography,
  spacing,
  layout,
  radius,
  controlHeight,
  imageRatio,
  icon,
  elevation,
} as const;

export type Theme = typeof theme;

export {
  colors,
  neutrals,
  action,
  drinkAccents,
  fontFamily,
  SERIF_MIN_SIZE,
  typography,
  spacing,
  layout,
  radius,
  controlHeight,
  imageRatio,
  icon,
  MIN_TOUCH_TARGET,
  elevation,
};
export { base } from './components';
export type { DrinkAccent } from './colors';
export type { TypographyVariant } from './typography';

// Font loading is Expo-specific, so import it directly:
// import { usePourlyFonts } from '@/styles/loadFonts';
