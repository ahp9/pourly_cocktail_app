import { AppText } from "@/components/primitivies/AppText";
import { spacing } from "@/styles";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type HeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={{ gap: spacing.sp4 }}>
        <AppText variant="display" accessibilityRole="header">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="body" color="cream2">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {actions ? <View style={styles.headerActions}>{actions}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sp16,
    marginBottom: spacing.sp8,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sp16,
  },
});
