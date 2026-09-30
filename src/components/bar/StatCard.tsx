import { AppText } from "@/components/primitivies/AppText";
import { PressableScale } from "@/components/primitivies/PressableScale";
import { colors, radius, spacing } from "@/styles";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

export function StatCard({ drinkCount }: { drinkCount: number | null }) {
  return (
    <View style={styles.statCard}>
      <View style={{ flex: 1, gap: spacing.sp4 }}>
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
