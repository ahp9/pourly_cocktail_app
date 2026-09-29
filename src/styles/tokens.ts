// Values copied from the Pourly design tokens sheet.
// If your styles/ folder already exports these, delete this file and point the imports at yours.

export const colors = {
  ground: "#16120E",
  surface: "#211B16",
  raised: "#2B241E",
  line: "rgba(242, 230, 210, 0.10)",
  cream: "#F2E6D2",
  cream2: "#CDBFA8",
  muted: "#A99A83",

  amber: "#D6A24E",
  amberLight: "#E3B86E",
  amberDeep: "#B8843E",
  amberTint: "rgba(214, 162, 78, 0.14)",
  onAmber: "#1A130B",

  basil: "#8FB86A",
  citrus: "#E6C45C",
  campari: "#C9453B",
  aperol: "#E5793A",
  vermouth: "#7A2E35",
  orgeat: "#E9D8B8",
} as const;

export const fonts = {
  serif: "InstrumentSerif_400Regular",
  serifItalic: "InstrumentSerif_400Regular_Italic",
  sans400: "HankenGrotesk_400Regular",
  sans500: "HankenGrotesk_500Medium",
  sans600: "HankenGrotesk_600SemiBold",
  sans700: "HankenGrotesk_700Bold",
} as const;

export const space = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  56: 56,
} as const;

export const radius = {
  thumb: 12,
  tile: 16,
  mood: 20,
  card: 24,
  hero: 28,
  pill: 999,
} as const;

export const controlHeight = {
  guided: 68,
  primary: 60,
  secondary: 52,
  secondarySmall: 48,
  chip: 44,
} as const;

// Typography from the tokens sheet. Serif never goes below 28px.
export const type = {
  displayXL: { fontFamily: fonts.serif, fontSize: 104, lineHeight: 104 },
  display: {
    fontFamily: fonts.serif,
    fontSize: 54,
    lineHeight: 56,
    letterSpacing: -0.81,
  },
  title: { fontFamily: fonts.serif, fontSize: 44, lineHeight: 48 },
  heading: { fontFamily: fonts.sans600, fontSize: 20, lineHeight: 26 },
  body: { fontFamily: fonts.sans400, fontSize: 17, lineHeight: 24 },
  button: { fontFamily: fonts.sans600, fontSize: 18, lineHeight: 24 },
  label: { fontFamily: fonts.sans500, fontSize: 15, lineHeight: 20 },
  caption: { fontFamily: fonts.sans500, fontSize: 13, lineHeight: 18 },
  overline: {
    fontFamily: fonts.sans700,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 12 * 0.14,
    textTransform: "uppercase" as const,
  },
} as const;

export type TypeVariant = keyof typeof type;

// Motion curves from the microinteractions sheet.
export const motion = {
  pour: [0.2, 0.8, 0.2, 1] as const, // entrances, reveals, fills · 240–900ms
  settle: [0.34, 1.4, 0.64, 1] as const, // taps, selections · 200–320ms
  reducedMs: 150, // reduced motion: opacity only
} as const;

// "CTA: amber glow" elevation.
export const amberGlow = {
  shadowColor: colors.amber,
  shadowOpacity: 0.35,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 6 },
  elevation: 8,
} as const;
