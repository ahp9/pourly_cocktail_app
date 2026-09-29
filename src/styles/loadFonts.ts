/**
 * Font loading for Expo.
 *
 * npx expo install expo-font @expo-google-fonts/instrument-serif @expo-google-fonts/hanken-grotesk
 *
 * Usage in App.tsx / _layout.tsx:
 *   const [loaded] = usePourlyFonts();
 *   if (!loaded) return null;
 */

import { useFonts } from 'expo-font';
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from '@expo-google-fonts/instrument-serif';
import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
} from '@expo-google-fonts/hanken-grotesk';

export const fontAssets = {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
};

export function usePourlyFonts() {
  return useFonts(fontAssets);
}
