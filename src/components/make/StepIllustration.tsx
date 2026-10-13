import { CocktailGlass } from "@/components/glasses/Glass";
import {
  IceIcon,
  LimeWheelIcon,
  MixingGlassIcon,
  ShakerIcon,
} from "@/components/make/Icons";
import { blendIngredientColors } from "@/services/color";
import { colors, spacing } from "@/styles";
import type { Cocktail, CocktailIngredient } from "@/types/cocktail";
import type { Step } from "@/types/recipe";
import { useEffect, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = {
  step: Step;
  cocktail: Cocktail;
  added: CocktailIngredient[];
};

export function StepIllustration({ step, cocktail, added }: Props) {
  const liquid = blendIngredientColors(added) ?? undefined;
  const usesShaker = cocktail.method === "shake";

  const glass = (color?: string) => (
    <CocktailGlass
      glass={cocktail.glass}
      color={color ?? colors.raised}
      width={160}
      height={160}
    />
  );

  const mixer = (fill?: string) =>
    usesShaker ? <ShakerIcon fill={fill} /> : <MixingGlassIcon fill={fill} />;

  switch (step.kind) {
    case "prepare":
      return (
        <Stage>
          {step.vessel === "glass" ? glass() : mixer()}
          {step.ice && <IceIcon />}
        </Stage>
      );

    case "add":
      return (
        <Stage>{step.vessel === "glass" ? glass(liquid) : mixer(liquid)}</Stage>
      );

    case "shake":
      return (
        <Stage>
          <Wobble distance={10} angle={8} duration={120}>
            <ShakerIcon fill={liquid} />
          </Wobble>
        </Stage>
      );

    case "stir":
      return (
        <Stage>
          <Wobble distance={0} angle={4} duration={400}>
            <MixingGlassIcon fill={liquid} />
          </Wobble>
        </Stage>
      );

    case "strain":
      return (
        <Stage>
          <View style={styles.tilted}>{mixer(liquid)}</View>
          {glass(liquid)}
        </Stage>
      );

    case "top":
    case "done":
      return <Stage>{glass(liquid)}</Stage>;

    case "garnish":
      return (
        <Stage>
          <LimeWheelIcon />
        </Stage>
      );
  }
}

function Stage({ children }: { children: ReactNode }) {
  return <View style={styles.stage}>{children}</View>;
}

// Loops a back-and-forth motion. Used for shaking and stirring.
function Wobble({
  children,
  distance,
  angle,
  duration,
}: {
  children: ReactNode;
  distance: number;
  angle: number;
  duration: number;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withSequence(withTiming(1, { duration }), withTiming(-1, { duration })),
      -1,
      true,
    );
    return () => cancelAnimation(t);
  }, [t, duration]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: t.value * distance },
      { rotate: `${t.value * angle}deg` },
    ],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  stage: {
    height: 220,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sp8,
  },
  tilted: {
    transform: [{ rotate: "120deg" }, { scale: 0.7 }],
    marginRight: -spacing.sp24,
    marginBottom: spacing.sp32,
  },
});
