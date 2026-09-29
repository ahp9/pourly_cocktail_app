import { DarkTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
} from "@expo-google-fonts/hanken-grotesk";
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
  useFonts,
} from "@expo-google-fonts/instrument-serif";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { colors } from "@/styles/tokens";

SplashScreen.preventAutoHideAsync();

// Pourly is dark only, so there's no light theme. This also stops a
// white flash behind screens during transitions.
const PourlyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.ground,
    card: colors.ground,
    text: colors.cream,
    border: colors.line,
    primary: colors.amber,
  },
};

export default function RootLayout() {
  const [loaded] = useFonts({
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
      <ThemeProvider value={PourlyTheme}>
        <AnimatedSplashOverlay />
        <RootStack />
      </ThemeProvider>
    </AuthProvider>
  );
}

function RootStack() {
  const { user } = useAuth();
  const signedIn = !!user;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.ground },
      }}
    >
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="(tabs)" />
        {/* Full-screen flows without the nav bar go here too, e.g.
            <Stack.Screen name="mood" />
            <Stack.Screen name="recommendation" /> */}
      </Stack.Protected>

      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
