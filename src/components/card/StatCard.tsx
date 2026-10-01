import { PressableScale } from "@/components/primitivies/PressableScale";
import { colors, radius, spacing } from "@/styles";
import type { Cocktail } from "@/types/cocktail";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { AppText } from "../primitivies/AppText";

type Props = { cocktails: Cocktail[] | null; hasBottles: boolean };

export function StatCard({ cocktails, hasBottles }: Props) {
  const count = cocktails?.length ?? 0;
  const canOpen = count > 0;

  const [label, title] = !hasBottles
    ? ["Add bottles to see", "what you can make."]
    : count === 0
      ? ["You can't make anything yet.", "Add a few more bottles."]
      : [
          "You can currently make",
          `${count} ${count === 1 ? "cocktail" : "cocktails"}.`,
        ];

  return (
    <PressableScale
      disabled={!canOpen}
      onPress={() => router.push("/add-bottle/can-make")}
      accessibilityRole="button"
      accessibilityLabel={
        canOpen ? `See the ${count} cocktails you can make` : undefined
      }
      style={styles.statCard}
    >
      <View style={{ flex: 1, gap: spacing.sp4 }}>
        <AppText variant="label" color="cream2">
          {label}
        </AppText>
        <AppText variant="title">{title}</AppText>
      </View>
      {canOpen && (
        <View style={styles.statArrow}>
          <ArrowRight size={22} color={colors.onAmber} strokeWidth={1.75} />
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sp16,
    padding: spacing.sp24,
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
});
