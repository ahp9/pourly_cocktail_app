import { PressableScale } from "@/components/primitivies/PressableScale";
import { colors } from "@/styles/";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
  size?: number;
};

// Avatar "Á", "+" on My Bar, back and close buttons.
export function CircleButton({
  children,
  onPress,
  accessibilityLabel,
  size = 48,
}: Props) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={size < 44 ? (44 - size) / 2 : 0}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {children}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
});
