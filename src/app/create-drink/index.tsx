import { Button } from "@/components/controls/Button";
import { Chip, ChoiceGroup } from "@/components/forms/Choices";
import { Header } from "@/components/layout/Header";
import { AppText } from "@/components/primitivies/AppText";
import { useAuth } from "@/hooks/useAuth";
import { getBarItems, type BarItem } from "@/services/bar";
import { findCocktails } from "@/services/create_cocktail";
import { colors, spacing } from "@/styles";
import { TASTES, type Taste } from "@/types/cocktail";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const labelFor = (item: BarItem) => item.product_name ?? item.label;

// Adds the value if it's missing, removes it if it's there.
const toggle = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

export default function SelectIngredients() {
  const { user } = useAuth();
  const [items, setItems] = useState<BarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>();

  // Bottles are picked by ingredient key, flavours by taste.
  const [bottles, setBottles] = useState<string[]>([]);
  const [flavors, setFlavors] = useState<Taste[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setError(undefined);
      const bar = await getBarItems(user.id);
      setItems(bar);
      // Drop picks for bottles that are no longer in the bar.
      setBottles((picked) =>
        picked.filter((key) => bar.some((i) => i.ingredient_key === key)),
      );
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

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string>();

  // Open the best match among the drinks the bar can make.
  const create = async () => {
    if (!user) return;
    try {
      setCreating(true);
      setCreateError(undefined);
      const [best] = await findCocktails(user.id, flavors);
      if (!best) {
        setCreateError("Nothing in your bar makes a drink yet.");
        return;
      }
      router.push(`/create-drink/${best.cocktail.id}`);
    } catch (e) {
      setCreateError(
        e instanceof Error ? e.message : "Couldn't find a drink. Try again.",
      );
    } finally {
      setCreating(false);
    }
  };

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
          title="Create a drink"
          subtitle="What do you want to be in it?"
        />

        {/* <ChoiceGroup title="Your bottles" hint="Pick what should go in." multi>
          {loading ? (
            <ActivityIndicator color={colors.amber} />
          ) : error ? (
            <View style={styles.message}>
              <AppText variant="body" color="cream2">
                {error}
              </AppText>
              <Button label="Try again" variant="secondary" onPress={load} />
            </View>
          ) : items.length === 0 ? (
            <AppText variant="body" color="cream2">
              Your bar is empty. Add a bottle first.
            </AppText>
          ) : (
            items.map((item) => (
              <Chip
                key={item.id}
                label={labelFor(item)}
                selected={bottles.includes(item.ingredient_key)}
                onPress={() =>
                  setBottles((picked) => toggle(picked, item.ingredient_key))
                }
                multi
              />
            ))
          )}
        </ChoiceGroup> */}

        <ChoiceGroup title="Flavors" hint="How should it taste?" multi>
          {TASTES.map((taste) => (
            <Chip
              key={taste.key}
              label={taste.label}
              selected={flavors.includes(taste.key)}
              onPress={() => setFlavors((picked) => toggle(picked, taste.key))}
              multi
            />
          ))}
        </ChoiceGroup>

        <Button
          label="Create"
          fullWidth
          onPress={create}
          loading={creating}
          disabled={bottles.length === 0 && flavors.length === 0}
        />

        {createError ? (
          <AppText variant="body" color="cream2">
            {createError}
          </AppText>
        ) : null}
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
    gap: spacing.sp24,
  },
  message: { gap: spacing.sp12, alignItems: "flex-start" },
});
