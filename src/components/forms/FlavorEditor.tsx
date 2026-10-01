// Seven taste rows, each a four-step meter. Tap a step to set it, tap the
// top filled step again to clear the row. Stored as 0, .25, .5, .75 or 1.
// With `readOnly` it shows an existing profile and ignores taps.
// `words` names the five levels (none + four steps).

import { AppText } from "@/components/primitivies/AppText";
import { colors, radius } from "@/styles/tokens";
import { TASTES, type Flavor, type Taste } from "@/types/cocktail";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View } from "react-native";

const STEPS = 4;
const STRENGTH = ["None", "A little", "Some", "Lots", "Very"] as const;

const toStep = (v: number) =>
  Math.max(0, Math.min(STEPS, Math.round(v * STEPS)));

export function FlavorEditor({
  value,
  onChange,
  readOnly = false,
  words = STRENGTH,
}: {
  value: Flavor;
  onChange?: (next: Flavor) => void;
  readOnly?: boolean;
  words?: readonly string[];
}) {
  const set = (taste: Taste, step: number) => {
    if (readOnly || !onChange) return;
    const clamped = Math.max(0, Math.min(STEPS, step));
    if (clamped === toStep(value[taste])) return;
    Haptics.selectionAsync();
    onChange({ ...value, [taste]: clamped / STEPS });
  };

  return (
    <View style={styles.list}>
      {TASTES.map(({ key, label }) => {
        const step = toStep(value[key]);
        return (
          <View
            key={key}
            style={styles.row}
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel={label}
            accessibilityValue={{ text: words[step] }}
            accessibilityActions={
              readOnly
                ? undefined
                : [{ name: "increment" }, { name: "decrement" }]
            }
            onAccessibilityAction={(e) =>
              set(
                key,
                step + (e.nativeEvent.actionName === "increment" ? 1 : -1),
              )
            }
          >
            <AppText variant="label" style={styles.name}>
              {label}
            </AppText>

            <View style={styles.meter}>
              {Array.from({ length: STEPS }, (_, i) => {
                const n = i + 1;
                return (
                  <Pressable
                    key={n}
                    disabled={readOnly}
                    // Tapping the top filled step clears the row.
                    onPress={() => set(key, n === step ? 0 : n)}
                    hitSlop={{ top: 10, bottom: 10 }}
                    importantForAccessibility="no"
                    style={[styles.step, n <= step && styles.stepOn]}
                  />
                );
              })}
            </View>

            <AppText
              variant="caption"
              color={step > 0 ? "cream2" : "muted"}
              style={styles.word}
            >
              {words[step]}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 44,
  },
  name: { width: 64 },
  meter: { flex: 1, flexDirection: "row", gap: 4 },
  step: {
    flex: 1,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.raised,
  },
  stepOn: { backgroundColor: colors.amber },
  word: { width: 72, textAlign: "right" },
});
