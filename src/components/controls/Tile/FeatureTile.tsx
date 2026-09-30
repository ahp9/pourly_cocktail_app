import { AppText } from "@/components/primitivies/AppText";
import { colors, radius, typography } from "@/styles";
import { StyleSheet, View } from "react-native";

export function FeatureTile({
  title,
  body,
  glow,
}: {
  title: string;
  body: string;
  glow: string;
}) {
  return (
    <View style={styles.feature}>
      <View style={[styles.featureGlow, { backgroundColor: glow }]} />
      <AppText variant="title" style={styles.featureTitle}>
        {title}
      </AppText>
      <AppText variant="caption" color="cream2">
        {body}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  feature: {
    flex: 1,
    minHeight: 136,
    padding: 16,
    gap: 16,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  featureGlow: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.25,
  },
  featureTitle: {
    fontSize: typography.title.fontSize,
    lineHeight: typography.title.lineHeight,
  },
});
