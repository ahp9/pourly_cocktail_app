import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';
import { radius } from './radius';
import { layout, spacing } from './spacing';
import { controlHeight } from './sizes';
import { elevation } from './elevation';

/** Shared base styles built from the tokens. */
export const base = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ground,
    paddingHorizontal: layout.screenGutter,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: layout.cardPadding,
    ...elevation.card,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.line,
  },

  // Buttons
  buttonGuided: {
    height: controlHeight.guided,
    borderRadius: radius.pill,
    backgroundColor: colors.amber,
    paddingHorizontal: spacing.sp24,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.ctaGlow,
  },
  buttonPrimary: {
    height: controlHeight.primary,
    borderRadius: radius.pill,
    backgroundColor: colors.amber,
    paddingHorizontal: spacing.sp24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimaryText: {
    ...typography.button,
    color: colors.onAmber,
  },
  buttonSecondary: {
    height: controlHeight.secondary,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.sp20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondaryText: {
    ...typography.button,
    color: colors.cream,
  },

  // Chips
  chip: {
    minHeight: controlHeight.chip,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.sp16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.amberTint,
    borderColor: colors.amber,
  },
  chipText: {
    ...typography.label,
  },
  chipTextSelected: {
    color: colors.amberLight,
  },
});
