/**
 * Font family names.
 *
 * Instrument Serif: anything the user reads at a glance.
 * Hanken Grotesk: anything the user taps or scans.
 * Serif never goes below 28px.
 *
 * React Native needs one family name per weight (fontWeight alone does not
 * pick a custom font file on Android). These names match the
 * @expo-google-fonts packages. See loadFonts.ts.
 */

export const fontFamily = {
  serif: 'InstrumentSerif_400Regular',
  serifItalic: 'InstrumentSerif_400Regular_Italic',
  sansRegular: 'HankenGrotesk_400Regular',
  sansMedium: 'HankenGrotesk_500Medium',
  sansSemiBold: 'HankenGrotesk_600SemiBold',
  sansBold: 'HankenGrotesk_700Bold',
} as const;

export const SERIF_MIN_SIZE = 28;
