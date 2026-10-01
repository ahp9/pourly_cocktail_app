import { Button } from "@/components/controls/Button";
import { CocktailGlass } from "@/components/glasses/Glass";
import { AppText } from "@/components/primitivies/AppText";
import { blendIngredientColors } from "@/services/color";
import { colors, elevation, layout, radius, spacing } from "@/styles";
import { Cocktail } from "@/types/cocktail";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

export function CocktailCard({ cocktail }: { cocktail: Cocktail }) {
  const names = cocktail.ingredients.map((i) => i.name).join(", ");
  const color = blendIngredientColors(cocktail.ingredients);

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <CocktailGlass
          glass={cocktail.glass}
          color={color}
          height={90}
          width={90}
        />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <AppText variant="heading" style={{ marginBottom: 8 }}>
            {cocktail.name}
          </AppText>
          <AppText variant="body" color="muted">
            {names}
          </AppText>
        </View>
        <Button
          label="View"
          variant="accent"
          size="secondarySmall"
          onPress={() => router.push(`/cocktail/${cocktail.id}`)}
        />
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
  imageContainer: {
    marginRight: spacing.sp20,
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
  },
  textContainer: {
    flex: 1,
    textOverflow: "clip",
    overflow: "hidden",
  },
});
