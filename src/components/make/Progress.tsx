import { colors, radius, spacing } from "@/styles";
import { StyleSheet, View } from "react-native";

export function Progress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            { backgroundColor: i <= current ? colors.amber : colors.raised },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.sp4 },
  segment: { flex: 1, height: 4, borderRadius: radius.pill },
});
