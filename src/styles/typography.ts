import type { TextStyle } from "react-native";
import { colors } from "./colors";
import { fontFamily } from "./fonts";

/**
 * Type scale. Sizes and line heights are in dp.
 * Letter spacing in the spec is a percentage of font size; converted here.
 */

const tracking = (fontSize: number, percent: number) =>
  (fontSize * percent) / 100;

export const typography = {
  // Serif 104/104
  displayXL: {
    fontFamily: fontFamily.serif,
    fontSize: 104,
    lineHeight: 104,
    color: colors.cream,
  },
  // Serif 54/56, -1.5%
  display: {
    fontFamily: fontFamily.serif,
    fontSize: 54,
    lineHeight: 56,
    letterSpacing: tracking(54, -1.5),
    color: colors.cream,
  },
  // Serif 44/48
  title: {
    fontFamily: fontFamily.serif,
    fontSize: 44,
    lineHeight: 48,
    color: colors.cream,
  },
  // Sans 600 20/26
  heading: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 20,
    lineHeight: 26,
    color: colors.cream,
  },
  // Sans 400 17/24
  body: {
    fontFamily: fontFamily.sansRegular,
    fontSize: 17,
    lineHeight: 24,
    color: colors.cream2,
  },
  // Sans 600 18/24
  button: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 18,
    lineHeight: 24,
  },
  // Sans 500 15/20
  label: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.cream,
  },
  // Sans 500 13/18. Minimum size. Nothing smaller ships.
  caption: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  // Sans 700 12, +14%, uppercase
  overline: {
    fontFamily: fontFamily.sansBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: tracking(12, 14),
    textTransform: "uppercase",
    color: colors.muted,
  },

  // Sans 500 12/16. Tab bar labels.
  navLabel: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
