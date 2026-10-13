import { Button } from "@/components/controls/Button";
import { Progress } from "@/components/make/Progress";
import { RecipeSummary } from "@/components/make/ReceipeSummary";
import { StepIllustration } from "@/components/make/StepIllustration";
import { AppText } from "@/components/primitivies/AppText";
import { useCocktail } from "@/hooks/useCocktails";
import { buildSteps, describeStep } from "@/services/recipe";
import { colors, layout, spacing } from "@/styles";
import type { CocktailIngredient } from "@/types/cocktail";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MakeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cocktail, loading } = useCocktail(id);
  const [index, setIndex] = useState(0);

  const steps = useMemo(
    () => (cocktail ? buildSteps(cocktail) : []),
    [cocktail],
  );

  // Ingredients poured so far, for the liquid colour in the illustration.
  const added = useMemo<CocktailIngredient[]>(
    () =>
      steps
        .slice(0, index + 1)
        .flatMap((s) =>
          s.kind === "add" || s.kind === "top" ? [s.ingredient] : [],
        ),
    [steps, index],
  );

  if (loading || !cocktail) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <ActivityIndicator color={colors.amber} />
      </SafeAreaView>
    );
  }

  const step = steps[index];
  const { title, body } = describeStep(step);
  const isLast = step.kind === "done";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <Progress current={index} total={steps.length} />

      <View style={styles.body}>
        {isLast ? (
          <RecipeSummary cocktail={cocktail} />
        ) : (
          <Animated.View
            key={index}
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.step}
          >
            <StepIllustration step={step} cocktail={cocktail} added={added} />
            <AppText variant="title">{title}</AppText>
            {body ? (
              <AppText variant="body" color="cream2">
                {body}
              </AppText>
            ) : null}
          </Animated.View>
        )}
      </View>

      <View style={styles.actions}>
        {index > 0 && (
          <Button
            label="Back"
            variant="secondary"
            onPress={() => setIndex(index - 1)}
          />
        )}
        <View style={{ flex: 1 }}>
          <Button
            label={isLast ? "Done" : "Next"}
            fullWidth
            onPress={() =>
              isLast ? router.dismissTo("/") : setIndex(index + 1)
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ground,
    paddingHorizontal: layout.screenGutter,
    paddingTop: spacing.sp16,
    gap: spacing.sp24,
  },
  center: { alignItems: "center", justifyContent: "center" },
  body: { flex: 1 },
  step: { flex: 1, justifyContent: "center", gap: spacing.sp12 },
  actions: {
    flexDirection: "row",
    gap: spacing.sp12,
    paddingBottom: spacing.sp8,
  },
});
