import { colors } from "@/styles";
import { Stack } from "expo-router";

export const unstable_settings = { initialRouteName: "sign-in" };

// A plain Stack, not Tabs, so these screens never get the bottom nav.
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.ground },
        animation: "fade",
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen
        name="sign-up"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{ animation: "slide_from_right" }}
      />
    </Stack>
  );
}
