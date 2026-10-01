import { StatCard } from "@/components/card/StatCard";
import { Button } from "@/components/controls/Button";
import { FeatureTile } from "@/components/controls/Tile/FeatureTile";
import { InventoryTile } from "@/components/controls/Tile/InventoryTile";
import { Grid } from "@/components/forms/Grid";
import { Header } from "@/components/layout/Header";
import { AppText } from "@/components/primitivies/AppText";
import { NavRow } from "@/components/primitivies/NavRow";
import { useAuth } from "@/hooks/useAuth";
import { getBarItems, removeFromBar, type BarItem } from "@/services/bar";
import { alcoholTypeLabel, loadCatalog } from "@/services/catalog";
import { getMakeableCocktails } from "@/services/cocktails";
import { colors, spacing } from "@/styles";
import { fonts, radius } from "@/styles/tokens";
import { BAR_CATEGORIES } from "@/types/bottle";
import { Cocktail } from "@/types/cocktail";
import * as Haptics from "expo-haptics";
import { router, useFocusEffect } from "expo-router";
import { Plus, ScanLine } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const labelFor = (item: BarItem) => item.product_name ?? item.label;

export default function MyBar() {
  const { user } = useAuth();
  const [items, setItems] = useState<BarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>();
  const [editing, setEditing] = useState(false);
  const [cocktails, setCocktails] = useState<Cocktail[] | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setError(undefined);
      const [bar, , makeable] = await Promise.all([
        getBarItems(user.id),
        loadCatalog(),
        getMakeableCocktails(),
      ]);
      setItems(bar);
      setCocktails(makeable);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load your bar.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const sections = useMemo(
    () =>
      BAR_CATEGORIES.map((s) => ({
        ...s,
        data: items.filter((i) => i.category === s.key),
      })).filter((s) => s.data.length > 0),
    [items],
  );

  const commit = async (item: BarItem) => {
    if (!user) return;
    try {
      await removeFromBar(user.id, item.id);
      setCocktails(await getMakeableCocktails());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't remove it.");
      load();
    }
  };

  const remove = (item: BarItem) => {
    commit(item);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setItems((all) => all.filter((i) => i.id !== item.id));

    // setRemoved(item);
  };

  useFocusEffect(useCallback(() => () => setEditing(false), []));
  useEffect(() => {
    if (items.length === 0) setEditing(false);
  }, [items.length]);

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
        <Header
          title="My Bar"
          subtitle={
            items.length === 1 ? "1 ingredient" : `${items.length} ingredients`
          }
          actions={
            <>
              {items.length > 0 && (
                <Pressable
                  onPress={() => setEditing((e) => !e)}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel={editing ? "Done editing" : "Edit bar"}
                  style={styles.editButton}
                >
                  <AppText
                    variant="label"
                    color="amberLight"
                    style={styles.semibold}
                  >
                    {editing ? "Done" : "Edit"}
                  </AppText>
                </Pressable>
              )}
            </>
          }
        />

        {/* Drink count */}
        <StatCard cocktails={cocktails} hasBottles={items.length > 0} />
        <NavRow
          title="Scan bottles"
          subtitle="Point your camera at your shelf"
          href="/add-bottle/scan"
          accessibilityHint="Opens the camera to read a barcode or label"
          icon={
            <ScanLine size={22} color={colors.amberLight} strokeWidth={1.75} />
          }
        />

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
              glow={colors.drink.campari}
              body="Drinks you're one bottle away from"
            />
            <FeatureTile
              title="Use it up"
              glow={colors.drink.aperol}
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
                    key={item.id}
                    item={item}
                    label={labelFor(item)}
                    swatch={item.swatch}
                    category={alcoholTypeLabel(item.alcohol_type)}
                    abv={item.abv ?? undefined}
                    editing={editing}
                    onRemove={() => remove(item)}
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ground },
  content: {
    paddingHorizontal: spacing.sp24,
    paddingTop: spacing.sp16,
    paddingBottom: spacing.sp120,
    gap: spacing.sp16,
  },
  semibold: { fontFamily: fonts.sans600 },

  tiles: { flexDirection: "row", gap: 8, marginTop: 16 },

  section: { gap: 12, marginTop: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between" },

  editButton: { minHeight: 44, justifyContent: "center" },
  toast: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 104, // above the tab bar
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.line,
  },

  message: { alignItems: "center", gap: 12, marginTop: 32 },
});
