import { AppText } from "@/components/primitivies/AppText";
import type { Slice } from "@/components/profile/TasteDonut";
import { StyleSheet, View } from "react-native";

// Names the colours in the chart. Text stays cream; the dot carries the colour.
export function TasteLegend({ slices }: { slices: Slice[] }) {
  return (
    <View style={styles.wrap} importantForAccessibility="no-hide-descendants">
      {slices.map((s) => (
        <View key={s.key} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: s.color }]} />
          <AppText variant="label" color="cream2">
            {s.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 16,
    rowGap: 8,
  },
  item: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
