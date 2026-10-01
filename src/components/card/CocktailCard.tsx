import { blendIngredientColors } from "@/services/color";
import { colors, elevation, layout, radius, spacing } from "@/styles";
import { Cocktail } from "@/types/cocktail";
import { StyleSheet, View } from "react-native";
import { CocktailGlass } from "../glasses/Glass";
import { AppText } from "../primitivies/AppText";

export function CocktailCard({ cocktail }: { cocktail: Cocktail }) {
  const names = cocktail.ingredients.map((i) => i.name).join(", ");
  const color = blendIngredientColors(cocktail.ingredients);

  return (
    <View style={styles.card}>
      <View
        style={{ width: 70, marginRight: spacing.sp20, alignItems: "center" }}
      >
        <CocktailGlass glass={cocktail.glass} color={color} />
      </View>
      <View>
        <AppText variant="label" style={{ marginBottom: 8 }}>
          {cocktail.name}
        </AppText>

        <View style={styles.swatches}>
          {cocktail.ingredients.map((i) => (
            <View
              key={`${i.position}-${i.name}`}
              style={[
                styles.swatch,
                // Recipe-only ingredients (egg white, nutmeg) have no swatch
                { backgroundColor: color },
              ]}
            />
          ))}
        </View>

        <AppText variant="body" color="muted">
          {names}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: layout.cardPadding,
    ...elevation.card,
    display: "flex",
    flexDirection: "row",
  },
  swatches: { flexDirection: "row", gap: 4, marginBottom: 8 },
  swatch: { width: 8, height: 20, borderRadius: 3 },
});
