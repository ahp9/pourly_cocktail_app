import { Check, X } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/primitivies/AppText";
import { PressableScale } from "@/components/primitivies/PressableScale";
import { colors, spacing } from "@/styles";
import { fonts, radius } from "@/styles/tokens";

export function InventoryTile({
  label,
  swatch,
  editing,
  onRemove,
}: {
  label: string;
  swatch: string;
  editing: boolean;
  onRemove: () => void;
}) {
  const body = (
    <>
      <View style={[styles.swatch, { backgroundColor: swatch }]} />
      <AppText
        variant="label"
        numberOfLines={1}
        style={[styles.semibold, { flex: 1 }]}
      >
        {label}
      </AppText>
      {editing ? (
        <View style={styles.removeBadge}>
          <X size={14} color={colors.cream} strokeWidth={2.25} />
        </View>
      ) : (
        <Check size={18} color={colors.amberLight} strokeWidth={1.75} />
      )}
    </>
  );

  if (!editing) {
    return (
      <View
        style={styles.tile}
        accessible
        accessibilityLabel={`${label}, in your bar`}
      >
        {body}
      </View>
    );
  }

  return (
    <PressableScale
      onPress={onRemove}
      accessibilityRole="button"
      accessibilityLabel={`Remove ${label}`}
      style={[styles.tile, styles.tileEditing]}
    >
      {body}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  semibold: { fontFamily: fonts.sans600 },
  tile: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sp12,
    paddingHorizontal: spacing.sp16,
    borderRadius: radius.tile,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  swatch: { width: 8, height: 20, borderRadius: 3 },
  tileEditing: { borderColor: "rgba(201, 69, 59, 0.45)" },
  removeBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.drink.campari,
    alignItems: "center",
    justifyContent: "center",
  },
});
