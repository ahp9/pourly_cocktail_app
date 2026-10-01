import { AddPersonalityProvider } from "@/hooks/useAddPersonality";
import { colors } from "@/styles/tokens";
import { Stack } from "expo-router";

// Full-screen flow opened from My Bar. Registered in app/_layout.tsx,
// outside (tabs), so the nav bar is hidden.
export default function AddPersonalityLayout() {
  return (
    <AddPersonalityProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.ground },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </AddPersonalityProvider>
  );
}
