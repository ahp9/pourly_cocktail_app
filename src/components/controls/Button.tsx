import { AppText } from "@/components/primitivies/AppText";
import { PressableScale } from "@/components/primitivies/PressableScale";
import { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { amberGlow, colors, controlHeight, radius } from "../../styles/tokens";

type Variant = "primary" | "secondary" | "accent";
type Size = keyof typeof controlHeight;

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size,
  iconLeft,
  iconRight,
  fullWidth,
  disabled,
  loading,
  accessibilityHint,
}: Props) {
  const height =
    controlHeight[size ?? (variant === "primary" ? "primary" : "secondary")];
  const inactive = disabled || loading;
  const textColor = inactive
    ? "muted"
    : variant === "primary"
      ? "onAmber"
      : variant === "accent"
        ? "amberLight"
        : "cream";

  return (
    <PressableScale
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      style={[
        styles.base,
        { height },
        fullWidth && styles.fullWidth,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "accent" && styles.accent,
        inactive && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.muted} />
      ) : (
        <View style={styles.row}>
          {iconLeft}
          <AppText variant="button" color={textColor}>
            {label}
          </AppText>
          {iconRight}
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: { alignSelf: "stretch" },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  primary: { backgroundColor: colors.amber, ...amberGlow },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  accent: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.amberDeep,
  },
  disabled: {
    backgroundColor: colors.raised,
    borderColor: colors.raised,
    shadowOpacity: 0,
    elevation: 0,
  },
});
