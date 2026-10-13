import { CocktailGlass } from "@/components/glasses/Glass";
import { AppText } from "@/components/primitivies/AppText";
import { blendIngredientColors } from "@/services/color";
import { colors, spacing } from "@/styles";
import type { Cocktail } from "@/types/cocktail";
import { ScrollView, StyleSheet, View } from "react-native";

export function RecipeSummary({ cocktail }: { cocktail: Cocktail }) {
  const color =
    blendIngredientColors(cocktail.ingredients) ?? colors.drink.basil;
  const sorted = [...cocktail.ingredients].sort(
    (a, b) => a.position - b.position,
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <CocktailGlass
          glass={cocktail.glass}
          color={color}
          width={120}
          height={120}
        />
      </View>

      <AppText variant="title">{cocktail.name}</AppText>

      <View style={styles.section}>
        <AppText variant="label">Ingredients</AppText>
        {sorted.map((i) => (
          <View key={`${i.position}-${i.name}`} style={styles.row}>
            <AppText variant="body">{i.name}</AppText>
            <AppText variant="body" color="cream2">
              {i.measure ?? (i.kind === "mixer" ? "Top up" : "")}
            </AppText>
          </View>
        ))}
      </View>

      {cocktail.instructions ? (
        <View style={styles.section}>
          <AppText variant="label">Instructions</AppText>
          <AppText variant="body" color="cream2">
            {cocktail.instructions}
          </AppText>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.sp24, paddingBottom: spacing.sp24 },
  hero: { alignItems: "center" },
  section: { gap: spacing.sp12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sp8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
});
