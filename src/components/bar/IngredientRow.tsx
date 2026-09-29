import { AppText } from "@/components/primitivies/AppText";
import { PressableScale } from "@/components/primitivies/PressableScale";
import { colors, radius } from "@/styles/tokens";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  label: string;
  swatch?: string;
  caption?: string;
  trailing?: ReactNode;
  selected?: boolean;
  onPress?: () => void;
  accessibilityHint?: string;
};

// Same look as the My Bar inventory row: swatch, name, trailing icon.
export function IngredientRow({
  label,
  swatch,
  caption,
  trailing,
  selected,
  onPress,
  accessibilityHint,
}: Props) {
  const body = (
    <>
      <View
        style={[styles.swatch, { backgroundColor: swatch ?? colors.raised }]}
      />
      <View style={styles.text}>
        <AppText variant="label" numberOfLines={1}>
          {label}
        </AppText>
        {caption ? (
          <AppText variant="caption" color="muted" numberOfLines={1}>
            {caption}
          </AppText>
        ) : null}
      </View>
      {trailing}
    </>
  );

  const style = [styles.row, selected && styles.selected];

  if (!onPress) return <View style={style}>{body}</View>;

  return (
    <PressableScale
      onPress={onPress}
      pressedScale={0.98}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected: !!selected }}
      style={style}
    >
      {body}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.tile,
  },
  selected: { borderColor: colors.amber, backgroundColor: colors.amberTint },
  swatch: { width: 8, height: 22, borderRadius: 3 },
  text: { flex: 1, gap: 2 },
});
