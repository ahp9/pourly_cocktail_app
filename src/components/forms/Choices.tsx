import { AppText } from "@/components/primitivies/AppText";
import { PressableScale } from "@/components/primitivies/PressableScale";
import { spacing } from "@/styles/";
import { colors, radius } from "@/styles/tokens";
import { Check } from "lucide-react-native";
import { createContext, useContext, useState, type ReactNode } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { FlavorIcon } from "../flavors/FlavorIcon";

// Share the calculated chip width with children
const ChipWidthContext = createContext<number | undefined>(undefined);

export function ChoiceGroup({
  title,
  hint,
  children,
  multi,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  multi?: boolean;
}) {
  const [containerWidth, setContainerWidth] = useState(0);

  const gap = spacing.sp16;
  const chipWidth = containerWidth > 0 ? (containerWidth - gap) / 2 : undefined;

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;

    if (width !== containerWidth) {
      setContainerWidth(width);
    }
  };

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

      <ChipWidthContext.Provider value={chipWidth}>
        <View
          style={styles.wrap}
          onLayout={handleLayout}
          accessibilityRole={multi ? undefined : "radiogroup"}
        >
          {children}
        </View>
      </ChipWidthContext.Provider>
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  multi,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  multi?: boolean;
}) {
  const chipWidth = useContext(ChipWidthContext);

  return (
    <PressableScale
      onPress={onPress}
      pressedScale={0.94}
      accessibilityRole={multi ? "checkbox" : "radio"}
      accessibilityLabel={label}
      accessibilityState={multi ? { checked: selected } : { selected }}
      style={[
        styles.chip,
        chipWidth !== undefined && { width: chipWidth },
        selected && styles.chipSelected,
      ]}
    >
      <AppText variant="label" color={selected ? "onAmber" : "cream"}>
        {label}
      </AppText>

      <FlavorIcon flavor={label} size={30} />
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
              <Check
                size={spacing.sp16}
                color={colors.onAmber}
                strokeWidth={2.5}
              />
            ) : null}
          </PressableScale>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sp16,
  },

  chip: {
    minHeight: 44,
    paddingHorizontal: spacing.sp16,
    justifyContent: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sp8,
  },

  chipSelected: {
    backgroundColor: colors.amber,
    borderColor: colors.amber,
  },

  swatch: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },

  swatchSelected: {
    borderColor: colors.cream,
  },
});
