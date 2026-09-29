/**
 * Pourly color tokens.
 * Dark only. Warm neutrals, one action color (amber).
 * Drink accents are for drink-specific UI only. Use them sparingly.
 */

export const neutrals = {
  ground: '#16120E', // App background
  surface: '#211B16', // Cards, chips, rows
  raised: '#2B241E', // Pills inside cards
  line: 'rgba(242, 230, 210, 0.10)', // Cream @ 10%. Card borders, dividers
  cream: '#F2E6D2', // Primary text
  cream2: '#CDBFA8', // Secondary text
  muted: '#A99A83', // Captions, idle nav
} as const;

export const action = {
  amber: '#D6A24E', // Primary buttons, selection
  amberLight: '#E3B86E', // Accent text, match %
  amberDeep: '#B8843E', // Bar gradient start
  amberTint: 'rgba(214, 162, 78, 0.14)', // Amber @ 14%. Selected fill
  onAmber: '#1A130B', // Text on amber
} as const;

export const drinkAccents = {
  basil: '#8FB86A', // Herbal drinks, "have it" ticks
  citrus: '#E6C45C', // Sours, citrus
  campari: '#C9453B', // Bitter, red aperitifs
  aperol: '#E5793A', // Spritzes, orange
  vermouth: '#7A2E35', // Stirred, spirit-forward
  orgeat: '#E9D8B8', // Tiki, creamy
} as const;

export const colors = {
  ...neutrals,
  ...action,
  drink: drinkAccents,
} as const;

export type DrinkAccent = keyof typeof drinkAccents;
export type Colors = typeof colors;
