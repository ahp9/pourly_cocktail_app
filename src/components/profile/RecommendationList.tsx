import { AppText } from "@/components/primitivies/AppText";
import { spacing } from "@/styles/spacing";
import type { Recommendation } from "@/types/profile";
import { View } from "react-native";

export function RecommendationList({ items }: { items: Recommendation[] }) {
  return (
    <View style={{ gap: spacing.sp12 }}>
      <AppText variant="heading">For you</AppText>
      {items.length > 0 ? (
        items.map((r) => (
          <AppText key={r.id} variant="label">
            {r.name} · {r.match}% match
          </AppText>
        ))
      ) : (
        <AppText variant="body" color="cream2">
          No recommendations yet.
        </AppText>
      )}
    </View>
  );
}
