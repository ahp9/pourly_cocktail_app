import { Button } from "@/components/controls/Button";
import { Header } from "@/components/layout/Header";
import { AppText } from "@/components/primitivies/AppText";
import { RecommendationList } from "@/components/profile/RecommendationList";
import { TasteProfileCard } from "@/components/profile/TasteProfileCard";
import { useProfile } from "@/hooks/useProfile";
import { colors, spacing } from "@/styles";
import { router } from "expo-router";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { profile, loading, refreshing, error, refetch } = useProfile();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.amber} />
      </View>
    );
  }

  if (error && !profile) {
    return (
      <View style={[styles.center, { gap: 16, paddingHorizontal: 24 }]}>
        <AppText variant="body" color="cream2" align="center">
          {error}
        </AppText>
        <Button label="Try again" variant="secondary" onPress={refetch} />
      </View>
    );
  }

  if (!profile) return null;

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
          title="Your taste"
          subtitle="Pourly is learning what you like."
        />

        {profile.personality ? (
          <AppText variant="title" color="amberLight">
            {profile.personality.name}
          </AppText>
        ) : null}

        <TasteProfileCard
          taste={profile.taste}
          onEdit={() => router.push("/add-personality")}
        />

        <RecommendationList items={profile.recommendations} />
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
    gap: spacing.sp24,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ground,
  },
});
