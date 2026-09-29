import { IngredientRow } from "@/components/bar/IngredientRow";
import { CircleButton } from "@/components/controls/CircleButton";
import { TextField } from "@/components/forms/TextField";
import { AppText } from "@/components/primitivies/AppText";
import { PressableScale } from "@/components/primitivies/PressableScale";
import { searchIngredients } from "@/data/ingredients";
import { useAddBottle } from "@/hooks/useAddBottle";
import { colors, radius } from "@/styles/tokens";
import type { BarCategory, Ingredient } from "@/types/bottle";
import { router, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ScanLine,
  X,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SECTION_TITLES: Record<BarCategory, string> = {
  spirits: "Spirits",
  liqueurs: "Liqueurs",
  mixers: "Mixers",
  fresh: "Fresh",
};

// Two modes:
//  /add-bottle            -> start of the flow: scan card + manual search
//  /add-bottle?mode=pick  -> "Change" from the confirm screen: pick an ingredient
export default function AddBottle() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const picking = mode === "pick";
  const { draft, setDraft } = useAddBottle();
  const [query, setQuery] = useState("");

  const sections = useMemo(() => {
    const results = searchIngredients(query);
    return (Object.keys(SECTION_TITLES) as BarCategory[])
      .map((c) => ({
        title: SECTION_TITLES[c],
        data: results.filter((i) => i.category === c),
      }))
      .filter((s) => s.data.length > 0);
  }, [query]);

  const choose = (ingredient: Ingredient) => {
    if (picking && draft) {
      setDraft({
        ...draft,
        ingredient,
        alcoholType: draft.alcoholType ?? ingredient.label,
      });
      router.back();
      return;
    }
    setDraft({ productName: ingredient.label, ingredient, source: "manual" });
    router.push("/add-bottle/confirm");
  };

  const close = () =>
    router.canGoBack() ? router.back() : router.replace("/my-bar");

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <SectionList
        sections={sections}
        keyExtractor={(i) => i.name}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <CircleButton
              accessibilityLabel={picking ? "Back" : "Close"}
              onPress={close}
            >
              {picking ? (
                <ChevronLeft
                  size={24}
                  color={colors.cream}
                  strokeWidth={1.75}
                />
              ) : (
                <X size={22} color={colors.cream} strokeWidth={1.75} />
              )}
            </CircleButton>

            <View style={styles.titles}>
              <AppText variant="display" accessibilityRole="header">
                {picking ? "What is it?" : "Add a bottle"}
              </AppText>
              <AppText variant="body" color="cream2">
                {picking
                  ? "Pick what this bottle counts as in recipes."
                  : "Scan it, or find it in the list."}
              </AppText>
            </View>

            {!picking && (
              <PressableScale
                onPress={() => router.push("/add-bottle/scan")}
                accessibilityRole="button"
                accessibilityLabel="Scan a bottle"
                accessibilityHint="Opens the camera to read the barcode or label"
                style={styles.scanCard}
              >
                <View style={styles.scanIcon}>
                  <ScanLine
                    size={24}
                    color={colors.amberLight}
                    strokeWidth={1.75}
                  />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <AppText variant="heading">Scan a bottle</AppText>
                  <AppText variant="caption" color="muted">
                    Barcode first, label if that fails
                  </AppText>
                </View>
                <ChevronRight
                  size={22}
                  color={colors.muted}
                  strokeWidth={1.75}
                />
              </PressableScale>
            )}

            <TextField
              label="Search"
              value={query}
              onChangeText={setQuery}
              placeholder="Gin, Campari, lime…"
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
        }
        renderSectionHeader={({ section }) => (
          <AppText variant="overline" color="muted" style={styles.sectionTitle}>
            {section.title}
          </AppText>
        )}
        renderItem={({ item }) => (
          <IngredientRow
            label={item.label}
            swatch={item.swatch}
            selected={picking && draft?.ingredient?.name === item.name}
            onPress={() => choose(item)}
            trailing={
              <Plus size={20} color={colors.muted} strokeWidth={1.75} />
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <AppText
            variant="body"
            color="muted"
            align="center"
            style={{ marginTop: 24 }}
          >
            Nothing called “{query}”. Try a shorter word.
          </AppText>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ground },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 48 },
  header: { gap: 24, marginBottom: 8 },
  titles: { gap: 8, marginTop: 16 },
  scanCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.amberDeep,
    backgroundColor: colors.surface,
  },
  scanIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.thumb,
    backgroundColor: colors.raised,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: { marginTop: 24, marginBottom: 12 },
});
