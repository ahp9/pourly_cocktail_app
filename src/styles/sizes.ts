/** Control heights in dp. All controls are pill-shaped. */
export const controlHeight = {
  guided: 68,
  primary: 60,
  secondary: 52,
  secondaryCompact: 48,
  chip: 44, // Also the minimum touch target
} as const;

export const MIN_TOUCH_TARGET = 44;

/** Image aspect ratios (width / height), for the `aspectRatio` style prop. */
export const imageRatio = {
  hero: 8 / 7,
  card: 19 / 10,
  thumb: 1,
  bottle: 5 / 8,
} as const;

/** Icons: 24px, 1.75 stroke, round caps. Spread into an SVG icon component. */
export const icon = {
  size: 24,
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;
