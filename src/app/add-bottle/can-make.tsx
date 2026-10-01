import { CocktailCard } from "@/components/card/CocktailCard";
import { CircleButton } from "@/components/controls/CircleButton";
import { Header } from "@/components/layout/Header";
import { AppText } from "@/components/primitivies/AppText";
import { getMakeableCocktails } from "@/services/cocktails";
import { colors, spacing } from "@/styles";
import type { Cocktail } from "@/types/cocktail";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CanMake() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    getMakeableCocktails()
      .then(setCocktails)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Couldn't load cocktails."),
      )
      .finally(() => setLoading(false));
  }, []);

  const close = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/my-bar");
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={cocktails}
        keyExtractor={(cocktail) => cocktail.id}
        renderItem={({ item }) => <CocktailCard cocktail={item} />}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <CircleButton accessibilityLabel="Back" onPress={close}>
              <ChevronLeft size={24} color={colors.cream} strokeWidth={1.75} />
            </CircleButton>

            <Header
              title="You can make"
              subtitle={`${cocktails.length} cocktails`}
            />
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.amber} />
          ) : (
            <AppText variant="body" color="cream2" align="center">
              {error ?? "Nothing yet."}
            </AppText>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ground,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.sp24,
    paddingTop: spacing.sp20,
    paddingBottom: spacing.sp24,
    gap: spacing.sp16,
  },
  header: {
    gap: spacing.sp16,
  },
});
