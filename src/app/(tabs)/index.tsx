import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Glitter } from "@/components/animation/Glitter";
import { Button } from "@/components/controls/Button";
import { MartiniGlass } from "@/components/glasses/MartiniGlass";
import { Icon } from "@/components/icon";
import { Header } from "@/components/layout/Header";
import { NavRow } from "@/components/primitivies/NavRow";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { BarItem, getBarItems } from "@/services/bar";
import { colors, spacing, typography } from "@/styles";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Path } from "react-native-svg";

export default function Index() {
  const { user } = useAuth();
  const { profile, loading, refreshing, error, refetch } = useProfile();
  const [items, setItems] = useState<BarItem[]>([]);
  const [error_drinks, setError] = useState<string>();
  const [loading_drinks, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setError(undefined);
      setItems(await getBarItems(user.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load your bar.");
    } finally {
      setLoading(false);
      refetch();
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading_drinks || loading) {
    return (
      <View style={styles.safe}>
        <ActivityIndicator />
      </View>
    );
  }

  const reroute = () => router.push("/my-bar");

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            tintColor={colors.amber}
          />
        }
      >
        <Header title="Pourly" />

        <View style={styles.hero}>
          <View
            style={{
              height: 200,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Glitter height={200} />
            <MartiniGlass
              height={200}
              width={200}
              color={colors.drink.aperol}
            />
          </View>
          <Text style={styles.title}>What are we drinking?</Text>
        </View>
        <NavRow
          title="My Bar"
          subtitle={`${items.length || 0} Ingredients • Drinks`}
          href="/my-bar"
          accessibilityHint="Reroutes to the My Bar screen where you can view your ingredients and drinks."
          icon={
            <Icon color={colors.amber}>
              <Path d="M10 3h4v4l2 3v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10l2-3z" />
              <Path d="M8 14h8" />
            </Icon>
          }
          variant="flat"
        />

        <View style={styles.actions}>
          <Button
            label="Make a drink"
            onPress={() => router.push("/create-drink")}
          />
          <Button
            label="Surprise me"
            onPress={() => router.push("/create-drink/surprise")}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ground },
  content: {
    paddingHorizontal: spacing.sp24,
    paddingTop: spacing.sp16,
    paddingBottom: spacing.sp120,
    gap: spacing.sp16,
  },

  hero: {
    alignItems: "center",
  },

  title: {
    fontSize: typography.display.fontSize,
    marginBottom: spacing.sp8,
    color: typography.display.color,
    fontFamily: typography.display.fontFamily,
  },

  actions: {
    display: "flex",
    flexDirection: "row",
    gap: spacing.sp16,
    marginTop: spacing.sp16,
  },
});
