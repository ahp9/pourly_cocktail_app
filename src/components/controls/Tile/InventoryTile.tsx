import { Check, X } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { PopUp } from "@/components/pop-up/PopUp";
import { AppText } from "@/components/primitivies/AppText";
import { PressableScale } from "@/components/primitivies/PressableScale";
import { BarItem } from "@/services/bar";
import { colors, spacing } from "@/styles";
import { fonts, radius } from "@/styles/tokens";

export function InventoryTile({
  label,
  item,
  swatch,
  editing,
  onRemove,
  category,
  abv,
  description,
}: {
  label: string;
  item: BarItem;
  swatch: string;
  editing: boolean;
  onRemove: () => void;
  category?: string;
  abv?: number;
  description?: string;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);

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

  if (editing) {
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

  const meta = [category, abv != null ? `${abv}% ABV` : undefined]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <PressableScale
        onPress={() => setDetailsOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}, in your bar`}
        accessibilityHint="Shows details"
        style={styles.tile}
      >
        {body}
      </PressableScale>

      <PopUp
        visible={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        item={item}
        swatch={swatch}
      />
    </>
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
