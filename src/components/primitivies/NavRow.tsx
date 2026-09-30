import { AppText } from "@/components/primitivies/AppText";
import { PressableScale } from "@/components/primitivies/PressableScale";
import { colors } from "@/styles";
import { fonts, radius } from "@/styles/tokens";
import { router, type Href } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type NavRowProps = {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  href: Href;
  accessibilityHint?: string;
  variant?: "bordered" | "flat";
};

export function NavRow({
  title,
  subtitle,
  icon,
  href,
  accessibilityHint,
  variant = "bordered",
}: NavRowProps) {
  return (
    <PressableScale
      onPress={() => router.push(href)}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      style={[styles.row, variant === "bordered" && styles.bordered]}
    >
      <View style={styles.icon}>{icon}</View>
      <View style={styles.text}>
        <AppText variant="label" style={styles.semibold}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color="muted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <ChevronRight size={22} color={colors.muted} strokeWidth={1.75} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  bordered: {
    padding: 16,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.amberDeep,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.thumb,
    backgroundColor: colors.raised,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, gap: 2 },
  semibold: { fontFamily: fonts.sans600 },
});
