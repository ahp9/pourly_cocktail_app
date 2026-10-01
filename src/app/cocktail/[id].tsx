import { Button } from "@/components/controls/Button";
import { CircleButton } from "@/components/controls/CircleButton";
import { CocktailGlass } from "@/components/glasses/Glass";
import { AppText } from "@/components/primitivies/AppText";
import { useCocktail } from "@/hooks/useCocktails";
import { blendIngredientColors } from "@/services/color";
import { base, colors, layout, radius, spacing } from "@/styles";
import { cocktailFlavor, toDots } from "@/styles/taste";
import { TASTES } from "@/types/cocktail";
import { router, useLocalSearchParams } from "expo-router";
import { Check, Heart, X } from "lucide-react-native";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CocktailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cocktail, loading, error } = useCocktail(id);

  const flavor = cocktailFlavor(cocktail?.ingredients ?? []);

  const close = () =>
    router.canGoBack() ? router.back() : router.replace("/");

  if (loading || error || !cocktail) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        {loading ? (
          <ActivityIndicator color={colors.amber} />
        ) : (
          <AppText variant="body" color="muted">
            {error ?? "Cocktail not found."}
          </AppText>
        )}
      </SafeAreaView>
    );
  }

  const drinkColor =
    blendIngredientColors(cocktail.ingredients) ?? colors.drink.basil;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <CircleButton accessibilityLabel="Close" size={44} onPress={close}>
          <X size={20} color={colors.cream} strokeWidth={1.75} />
        </CircleButton>
        <AppText variant="overline">Pourly picked</AppText>
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Glass with a soft glow in the drink's colour */}
        <View style={styles.hero}>
          <View style={[styles.glow, { backgroundColor: drinkColor }]} />
          <CocktailGlass
            glass={cocktail.glass}
            color={drinkColor}
            width={160}
            height={160}
          />
        </View>

        {/* Title block */}
        <View style={styles.titleBlock}>
          {/* <View style={styles.matchRow}>
            <View style={styles.matchRing} />
            <AppText variant="label" color="amberLight">
              {PLACEHOLDER_MATCH}% match
            </AppText>
          </View> */}
          <AppText variant="title">{cocktail.name}</AppText>
          {cocktail.category ? (
            <AppText variant="body" color="cream2">
              {cocktail.category}
            </AppText>
          ) : null}
        </View>

        {/* Taste */}
        <View style={styles.tasteRow}>
          {flavor &&
            TASTES.map((t) => {
              const dots = toDots(flavor[t.key]);

              if (dots === 0) return null;

              return (
                <View key={t.key} style={styles.tasteItem}>
                  <AppText variant="caption">{t.label}</AppText>
                  <Dots value={dots} />
                </View>
              );
            })}
        </View>

        {/* Ingredients */}
        <View style={styles.ingredients}>
          <AppText variant="label">Ingredients</AppText>
          <View style={styles.chips}>
            {cocktail.ingredients.map((i) => (
              <View
                key={`${i.position}-${i.name}`}
                style={[base.chip, styles.chip]}
              >
                <Check size={14} color={colors.drink.basil} strokeWidth={2} />
                <AppText variant="label">{i.name}</AppText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <Button label="Make this drink" fullWidth onPress={() => {}} />
        <View style={styles.secondaryRow}>
          <View style={{ flex: 1 }}>
            <Button
              label="Not feeling it"
              variant="secondary"
              fullWidth
              onPress={close}
            />
          </View>
          <Button
            label="Save"
            variant="secondary"
            iconLeft={
              <Heart size={18} color={colors.cream} strokeWidth={1.75} />
            }
            onPress={() => {}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Dots({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: max }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i < value ? colors.amber : colors.raised },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ground },
  center: { alignItems: "center", justifyContent: "center" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.screenGutter,
    paddingTop: spacing.sp8,
  },
  topBarSpacer: { width: 44 },

  content: {
    paddingHorizontal: layout.screenGutter,
    paddingBottom: spacing.sp24,
    gap: spacing.sp24,
  },

  hero: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sp16,
  },
  glow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.12,
  },

  titleBlock: { gap: spacing.sp8 },
  matchRow: { flexDirection: "row", alignItems: "center", gap: spacing.sp8 },
  matchRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.amber,
  },

  tasteRow: {
    flexDirection: "row",
    paddingVertical: spacing.sp12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  tasteItem: { flex: 1, gap: spacing.sp4 },
  dots: { flexDirection: "row", gap: spacing.sp4 },
  dot: { width: 8, height: 8, borderRadius: radius.pill },

  ingredients: { gap: spacing.sp12 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sp8 },
  chip: { flexDirection: "row", gap: spacing.sp8 },

  actions: {
    paddingHorizontal: layout.screenGutter,
    paddingTop: spacing.sp12,
    paddingBottom: spacing.sp8,
    gap: spacing.sp12,
  },
  secondaryRow: { flexDirection: "row", gap: spacing.sp12 },
});
