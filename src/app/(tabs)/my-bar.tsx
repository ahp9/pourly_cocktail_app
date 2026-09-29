import { Button } from "@/components/controls/Button";
import { AppText } from "@/components/primitivies/AppText";
import { PressableScale } from "@/components/primitivies/PressableScale";
import { INGREDIENTS } from "@/data/ingredients";
import { useAuth } from "@/hooks/useAuth";
import { getBarItems, type BarItem } from "@/services/bar";
import { spacing } from "@/styles";
import { colors, fonts, radius } from "@/styles/tokens";
import type { BarCategory } from "@/types/bottle";
import { router, useFocusEffect } from "expo-router";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Plus,
  ScanLine,
} from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SECTIONS: { key: BarCategory; title: string }[] = [
  { key: "spirits", title: "Spirits" },
  { key: "liqueurs", title: "Liqueurs" },
  { key: "mixers", title: "Mixers" },
  { key: "fresh", title: "Fresh" },
];

const swatchFor = (ingredient: string) =>
  INGREDIENTS.find((i) => i.name === ingredient)?.swatch ?? colors.muted;

const labelFor = (item: BarItem) =>
  INGREDIENTS.find((i) => i.name === item.ingredient_name)?.label ??
  item.ingredient_name;

export default function MyBar() {
  const { user } = useAuth();
  const [items, setItems] = useState<BarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>();

  // TODO: replace with your recipe matching against CocktailDB.
  const drinkCount: number | null = null;

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setError(undefined);
      setItems(await getBarItems(user.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load your bar.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  // Reloads when the tab opens and when the add-bottle flow closes.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const sections = useMemo(
    () =>
      SECTIONS.map((s) => ({
        ...s,
        data: items.filter((i) => i.category === s.key),
      })).filter((s) => s.data.length > 0),
    [items],
  );

  const addBottle = () => router.push("/add-bottle");
  const scan = () => router.push("/add-bottle/scan");

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={colors.amber}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <AppText variant="display" accessibilityRole="header">
              My Bar
            </AppText>
            <AppText variant="body" color="cream2">
              {items.length === 1
                ? "1 ingredient"
                : `${items.length} ingredients`}
            </AppText>
          </View>
        </View>

        {/* Drink count */}
        <View style={styles.statCard}>
          <View style={{ flex: 1, gap: 4 }}>
            <AppText variant="label" color="cream2">
              {drinkCount ? "You can currently make" : "Add bottles to see"}
            </AppText>
            <AppText variant="title">
              {drinkCount ? `${drinkCount} cocktails.` : "what you can make."}
            </AppText>
          </View>
          {drinkCount ? (
            <PressableScale
              onPress={() => router.push("/discover")}
              accessibilityRole="button"
              accessibilityLabel={`See the ${drinkCount} cocktails you can make`}
              style={styles.statArrow}
            >
              <ArrowRight size={22} color={colors.onAmber} strokeWidth={1.75} />
            </PressableScale>
          ) : null}
        </View>

        {/* Scan bottles */}
        <PressableScale
          onPress={scan}
          accessibilityRole="button"
          accessibilityLabel="Scan bottles"
          accessibilityHint="Opens the camera to read a barcode or label"
          style={styles.scanRow}
        >
          <View style={styles.scanIcon}>
            <ScanLine size={22} color={colors.amberLight} strokeWidth={1.75} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="label" style={styles.semibold}>
              Scan bottles
            </AppText>
            <AppText variant="caption" color="muted">
              Point your camera at your shelf
            </AppText>
          </View>
          <ChevronRight size={22} color={colors.muted} strokeWidth={1.75} />
        </PressableScale>

        <Button
          label="Add ingredient"
          variant="secondary"
          size="secondary"
          fullWidth
          onPress={addBottle}
          iconLeft={<Plus size={20} color={colors.cream} strokeWidth={1.75} />}
        />

        {/* Almost / Use it up */}
        {items.length > 0 && (
          <View style={styles.tiles}>
            <FeatureTile
              title="Almost"
              glow={colors.campari}
              body="Drinks you're one bottle away from"
            />
            <FeatureTile
              title="Use it up"
              glow={colors.aperol}
              body="Finish what's been open too long"
            />
          </View>
        )}

        {/* Inventory */}
        {loading ? (
          <ActivityIndicator color={colors.amber} style={{ marginTop: 32 }} />
        ) : error ? (
          <View style={styles.message}>
            <AppText variant="body" color="cream2" align="center">
              {error}
            </AppText>
            <Button label="Try again" variant="secondary" onPress={load} />
          </View>
        ) : items.length === 0 ? (
          <View style={styles.message}>
            <AppText variant="heading" align="center">
              Your bar is empty.
            </AppText>
            <AppText variant="body" color="cream2" align="center">
              Scan a bottle or add one from the list to get started.
            </AppText>
          </View>
        ) : (
          sections.map((section) => (
            <View key={section.key} style={styles.section}>
              <View style={styles.sectionHeader}>
                <AppText variant="overline" color="muted">
                  {section.title}
                </AppText>
                <AppText variant="caption" color="muted">
                  {section.data.length}
                </AppText>
              </View>
              <Grid>
                {section.data.map((item) => (
                  <InventoryTile
                    key={item.ingredient_name}
                    label={labelFor(item)}
                    swatch={swatchFor(item.ingredient_name)}
                  />
                ))}
              </Grid>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Small pieces used only here. Move to components/bar/ when reused. ---

function InventoryTile({ label, swatch }: { label: string; swatch: string }) {
  return (
    <View
      style={styles.tile}
      accessible
      accessibilityLabel={`${label}, in your bar`}
    >
      <View style={[styles.swatch, { backgroundColor: swatch }]} />
      <AppText
        variant="label"
        numberOfLines={1}
        style={[styles.semibold, { flex: 1 }]}
      >
        {label}
      </AppText>
      <Check size={18} color={colors.amberLight} strokeWidth={1.75} />
    </View>
  );
}

function FeatureTile({
  title,
  body,
  glow,
}: {
  title: string;
  body: string;
  glow: string;
}) {
  return (
    <View style={styles.feature}>
      <View style={[styles.featureGlow, { backgroundColor: glow }]} />
      <AppText variant="title" style={styles.featureTitle}>
        {title}
      </AppText>
      <AppText variant="caption" color="cream2">
        {body}
      </AppText>
    </View>
  );
}

// Two columns; an odd last item keeps its half width.
function Grid({ children }: { children: React.ReactNode[] }) {
  const rows: React.ReactNode[][] = [];
  for (let i = 0; i < children.length; i += 2)
    rows.push(children.slice(i, i + 2));
  return (
    <View style={{ gap: 8 }}>
      {rows.map((row, i) => (
        <View key={i} style={{ flexDirection: "row", gap: 8 }}>
          {row.map((child, j) => (
            <View key={j} style={{ flex: 1 }}>
              {child}
            </View>
          ))}
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ground },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
    gap: 16,
  },
  semibold: { fontFamily: fonts.sans600 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sp56,
    marginBottom: 8,
  },

  statCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 24,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  statArrow: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.amber,
    alignItems: "center",
    justifyContent: "center",
  },

  scanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.amberDeep,
  },
  scanIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.thumb,
    backgroundColor: colors.raised,
    alignItems: "center",
    justifyContent: "center",
  },

  tiles: { flexDirection: "row", gap: 8, marginTop: 16 },
  feature: {
    flex: 1,
    minHeight: 136,
    padding: 16,
    gap: 16,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  featureGlow: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.25,
  },
  featureTitle: { fontSize: 32, lineHeight: 36 },

  section: { gap: 12, marginTop: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between" },
  tile: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    borderRadius: radius.tile,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  swatch: { width: 8, height: 20, borderRadius: 3 },

  message: { alignItems: "center", gap: 12, marginTop: 32 },
});
