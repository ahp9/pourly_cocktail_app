import { Check, X } from "lucide-react-native";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/primitivies/AppText";
import { BarItem } from "@/services/bar";
import { colors, spacing } from "@/styles";
import { fonts, radius } from "@/styles/tokens";

export function PopUp({
  visible,
  onClose,
  item,
  swatch,
}: {
  visible: boolean;
  onClose: () => void;
  item: BarItem;
  swatch: string;
}) {
  const fields = (
    Object.entries(item) as [keyof BarItem, BarItem[keyof BarItem]][]
  ).filter(([key]) => key !== "id");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close"
      >
        {/* Inner Pressable swallows taps so the card doesn't close itself */}
        <Pressable style={styles.card} onPress={() => {}} accessible={false}>
          <View style={styles.header}>
            <AppText
              variant="label"
              numberOfLines={2}
              style={[styles.title, { flex: 1 }]}
              accessibilityRole="header"
            >
              {item.product_name ?? item.label}
            </AppText>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close details"
              style={styles.closeButton}
            >
              <X size={18} color={colors.cream} strokeWidth={2} />
            </Pressable>
          </View>

          <View style={styles.body}>
            <View style={[styles.detailSwatch, { backgroundColor: swatch }]} />

            <View style={styles.fieldList}>
              {fields.map(([key, value], i) => {
                const isNull = value === null;
                return (
                  <View
                    key={key}
                    style={[styles.fieldRow, i > 0 && styles.fieldDivider]}
                  >
                    <AppText variant="label" style={styles.fieldKey}>
                      {key}
                    </AppText>
                    <AppText
                      variant="label"
                      numberOfLines={1}
                      style={[styles.fieldValue, isNull && styles.nullValue]}
                    >
                      {isNull ? "null" : String(value)}
                    </AppText>
                  </View>
                );
              })}
            </View>

            <View style={styles.statusRow}>
              <Check size={16} color={colors.amberLight} strokeWidth={1.75} />
              <AppText variant="label" style={styles.semibold}>
                In your bar
              </AppText>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    padding: spacing.sp16,
  },
  card: {
    borderRadius: radius.tile,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.sp16,
    gap: spacing.sp16,
  },
  semibold: { fontFamily: fonts.sans600 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sp12,
  },
  title: {
    fontFamily: fonts.sans600,
    fontSize: 20,
    lineHeight: 26,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    gap: spacing.sp12,
  },
  detailSwatch: { height: 6, borderRadius: 3 },

  fieldList: {
    borderRadius: radius.tile,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.sp12,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sp12,
    paddingVertical: spacing.sp12 / 1.5,
  },
  fieldDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  fieldKey: { opacity: 0.6 },
  fieldValue: {
    fontFamily: fonts.sans600,
    flexShrink: 1,
    textAlign: "right",
  },
  nullValue: {
    fontFamily: undefined,
    fontStyle: "italic",
    opacity: 0.4,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sp12 / 2,
    paddingTop: spacing.sp12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
