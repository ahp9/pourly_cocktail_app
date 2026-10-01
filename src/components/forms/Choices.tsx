import { AppText } from "@/components/primitivies/AppText";
import { PressableScale } from "@/components/primitivies/PressableScale";
import { colors, radius } from "@/styles/tokens";
import { Check } from "lucide-react-native";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export function ChoiceGroup({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <View style={{ gap: 10 }}>
      <View style={{ gap: 2 }}>
        <AppText variant="label">{title}</AppText>
        {hint ? (
          <AppText variant="caption" color="muted">
            {hint}
          </AppText>
        ) : null}
      </View>
      <View style={styles.wrap} accessibilityRole="radiogroup">
        {children}
      </View>
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      pressedScale={0.94}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <AppText variant="label" color={selected ? "onAmber" : "cream"}>
        {label}
      </AppText>
    </PressableScale>
  );
}

export function Swatches({
  choices,
  value,
  onChange,
}: {
  choices: readonly string[];
  value?: string;
  onChange: (colour: string) => void;
}) {
  return (
    <>
      {choices.map((c) => {
        const selected = value === c;
        return (
          <PressableScale
            key={c}
            onPress={() => onChange(c)}
            pressedScale={0.94}
            accessibilityRole="radio"
            accessibilityLabel={`Colour ${c}`}
            accessibilityState={{ selected }}
            style={[
              styles.swatch,
              { backgroundColor: c },
              selected && styles.swatchSelected,
            ]}
          >
            {selected ? (
              <Check size={16} color={colors.onAmber} strokeWidth={2.5} />
            ) : null}
          </PressableScale>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.amber, borderColor: colors.amber },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  swatchSelected: { borderColor: colors.cream },
});
