import { Button } from "@/components/controls/Button";
import { AppText } from "@/components/primitivies/AppText";
import { TasteLegend } from "@/components/profile/TasteLegend";
import { TASTE_COLORS } from "@/styles/taste";
import { colors, radius } from "@/styles/tokens";
import { TASTES } from "@/types/cocktail";
import type { TasteScore } from "@/types/profile";
import { Pencil, Plus } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { TasteDonut, type Slice } from "./TasteDonut";

type Props = {
  taste: TasteScore[];
  onEdit: () => void;
};

// The tastes the user picked, as a ring. Small edit button in the header.
export function TasteProfileCard({ taste, onEdit }: Props) {
  const slices = toSlices(taste);
  const empty = slices.length === 0;
  const top = slices.reduce<Slice | null>(
    (best, s) => (!best || s.value > best.value ? s : best),
    null,
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="heading">Your flavors</AppText>
          <AppText variant="caption" color="muted">
            {empty
              ? "Tell Pourly what you like."
              : "What you told Pourly you like."}
          </AppText>
        </View>
        <Button
          label={empty ? "Add" : "Edit"}
          variant="accent"
          size="chip"
          iconLeft={
            empty ? (
              <Plus size={16} color={colors.amberLight} strokeWidth={2} />
            ) : (
              <Pencil size={14} color={colors.amberLight} strokeWidth={2} />
            )
          }
          accessibilityHint={
            empty ? "Add your flavor profile" : "Change your flavor profile"
          }
          onPress={onEdit}
        />
      </View>

      {empty ? (
        <AppText variant="body" color="cream2">
          Pick the tastes you like and Pourly will suggest drinks to match.
        </AppText>
      ) : (
        <View style={styles.chart}>
          <TasteDonut
            slices={slices}
            centerTop="Mostly"
            centerLabel={top?.label}
          />
          <TasteLegend slices={slices} />
        </View>
      )}
    </View>
  );
}

// Scores from the table -> slices in the fixed TASTES order, zeros dropped.
// Unknown keys are skipped; they have no colour.
function toSlices(taste: TasteScore[]): Slice[] {
  const byKey = new Map(taste.map((t) => [t.key, t.value]));
  return TASTES.flatMap(({ key, label }) => {
    const value = byKey.get(key) ?? 0;
    return value > 0 ? [{ key, label, value, color: TASTE_COLORS[key] }] : [];
  });
}

const styles = StyleSheet.create({
  card: {
    gap: 20,
    padding: 20,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  chart: { alignItems: "center", gap: 20 },
});
