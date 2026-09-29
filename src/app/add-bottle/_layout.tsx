import { AddBottleProvider } from "@/hooks/useAddBottle";
import { colors } from "@/styles/tokens";
import { Stack } from "expo-router";

// Full-screen flow opened from My Bar. Registered in app/_layout.tsx,
// outside (tabs), so the nav bar is hidden.
export default function AddBottleLayout() {
  return (
    <AddBottleProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.ground },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="scan" options={{ animation: "fade" }} />
        <Stack.Screen name="confirm" />
      </Stack>
    </AddBottleProvider>
  );
}
