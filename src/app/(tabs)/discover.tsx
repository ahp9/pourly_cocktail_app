import { CocktailCard } from "@/components/card/CocktailCard";
import { TextField } from "@/components/forms/TextField";
import { Header } from "@/components/layout/Header";
import { AppText } from "@/components/primitivies/AppText";
import { useRandomCocktails } from "@/hooks/useCocktails";
import { useProfile } from "@/hooks/useProfile";
import { colors, spacing } from "@/styles";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Discover() {
  const profile = useProfile();
  const random = useRandomCocktails(10);

  const refreshing = profile.refreshing || random.refreshing;
  const onRefresh = () => {
    profile.refetch();
    random.refetch();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.amber}
          />
        }
      >
        <Header title="Discover" subtitle="Find new cocktails to try." />

        <View style={styles.divider} />

        <View>
          <TextField label="Search" placeholder="Search cocktails..." />
        </View>

        <View style={styles.list}>
          {random.loading ? (
            <ActivityIndicator color={colors.amber} />
          ) : random.error ? (
            <AppText>{random.error}</AppText>
          ) : (
            random.cocktails.map((c) => (
              <CocktailCard key={c.id} cocktail={c} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ground },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.line,
  },
  content: {
    paddingHorizontal: spacing.sp24,
    paddingTop: spacing.sp16,
    paddingBottom: spacing.sp120,
    gap: spacing.sp16,
  },
  list: { gap: spacing.sp8 },
});
