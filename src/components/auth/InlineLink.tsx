import { AppText } from "@/components/primitivies/AppText";
import { PressableScale } from "@/components/primitivies/PressableScale";
import { fonts } from "@/styles/tokens";
import { StyleSheet, View } from "react-native";

type Props = {
  prompt?: string; // "New to Pourly?"
  label: string; // "Create an account"
  onPress: () => void;
};

// Footer link and "Forgot password?". Amber light is the design's accent-text color.
export function InlineLink({ prompt, label, onPress }: Props) {
  return (
    <View style={styles.row}>
      {prompt ? (
        <AppText variant="label" color="muted">
          {prompt}
        </AppText>
      ) : null}
      <PressableScale
        onPress={onPress}
        pressedScale={0.97}
        haptic={false}
        hitSlop={12}
        accessibilityRole="link"
        accessibilityLabel={label}
        style={styles.target}
      >
        <AppText variant="label" color="amberLight" style={styles.bold}>
          {label}
        </AppText>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  target: { minHeight: 44, justifyContent: "center" },
  bold: { fontFamily: fonts.sans600 },
});
