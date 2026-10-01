import { Header } from "@/components/layout/Header";
import { AppText } from "@/components/primitivies/AppText";
import { useProfile } from "@/hooks/useProfile";
import { colors, spacing } from "@/styles";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectIngredients() {
  const { profile, loading, refreshing, error, refetch } = useProfile();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            tintColor={colors.amber}
          />
        }
      >
        <Header
          title="Choose flavours/Liqours"
          subtitle="What do you want to be in it?"
        />
        <AppText variant="body" color="cream2" align="center">
          TODO{" "}
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ground },
  content: {
    paddingHorizontal: spacing.sp24,
    paddingTop: spacing.sp16,
    paddingBottom: spacing.sp120,
    gap: spacing.sp16,
  },
});
