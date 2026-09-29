import { Button } from "@/components/controls/Button";
import { AppText } from "@/components/primitivies/AppText";
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
        <AppText variant="display">Your taste</AppText>
        <AppText variant="body" color="cream2">
          Pourly is learning what you like.
        </AppText>

        {profile.taste.length > 0 ? (
          profile.taste.map((t) => (
            <AppText key={t.key} variant="label">
              {t.label} · {t.value}%
            </AppText>
          ))
        ) : (
          <AppText variant="body" color="cream2">
            Rate a few drinks to build your taste profile.
          </AppText>
        )}

        {profile.personality ? (
          <AppText variant="title" color="amberLight">
            {profile.personality.name}
          </AppText>
        ) : (
          <Button
            label="Add personality"
            variant="secondary"
            onPress={() => {
              // TODO: navigate to the personality flow
            }}
          />
        )}

        {profile.recommendations.length > 0 ? (
          profile.recommendations.map((r) => (
            <AppText key={r.id} variant="label">
              {r.name} · {r.match}%
            </AppText>
          ))
        ) : (
          <AppText variant="body" color="cream2">
            No recommendations yet.
          </AppText>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ground, marginTop: spacing.sp56 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ground,
  },
  content: { paddingHorizontal: 24, paddingBottom: 120, gap: 12 },
});
