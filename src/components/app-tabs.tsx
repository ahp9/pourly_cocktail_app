// app/(tabs)/_layout.tsx
import { Icon } from "@/components/icon";
import { colors, typography } from "@/styles";
import { Tabs } from "expo-router";
import { Circle, Path } from "react-native-svg";

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "colors.ground",
          borderTopColor: "colors.line",
        },
        tabBarActiveTintColor: colors.amber,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: typography.navLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Icon color={color}>
              <Path d="M8 22h8M12 11v11M19 3l-7 8-7-8Z" />
            </Icon>
          ),
        }}
      />

      <Tabs.Screen
        name="my-bar"
        options={{
          title: "My Bar",
          tabBarIcon: ({ color }) => (
            <Icon color={color}>
              <Path d="M10 3h4v4l2 3v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10l2-3z" />
              <Path d="M8 14h8" />
            </Icon>
          ),
        }}
      />

      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => (
            <Icon color={color}>
              <Circle cx={12} cy={12} r={10} />
              <Path d="m16.24 7.76-1.8 5.41a2 2 0 0 1-1.27 1.27L7.76 16.24l1.8-5.41a2 2 0 0 1 1.27-1.27Z" />
            </Icon>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Icon color={color}>
              <Circle cx={12} cy={8} r={4} />
              <Path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
            </Icon>
          ),
        }}
      />
    </Tabs>
  );
}
