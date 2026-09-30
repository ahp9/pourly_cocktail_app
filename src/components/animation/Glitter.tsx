// components/Glitter.tsx
import { colors } from "@/styles";
import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const COLORS = [
  colors.amberLight,
  colors.drink.basil,
  colors.muted,
  colors.amberDeep,
];

type Particle = {
  left: `${number}%`;
  size: number;
  color: string;
  duration: number;
  delay: number;
  drift: number;
};

function makeParticles(count: number, height: number): Particle[] {
  return Array.from({ length: count }, () => {
    const speed = 30 + Math.random() * 30; // px per second
    return {
      left: `${Math.random() * 100}%`,
      size: 3 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: (height / speed) * 1000,
      delay: Math.random() * 3000,
      drift: (Math.random() - 0.5) * 30,
    };
  });
}

function Dot({ p, height }: { p: Particle; height: number }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      p.delay,
      withRepeat(
        withTiming(1, { duration: p.duration, easing: Easing.linear }),
        -1,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    // Fade in over the first 20%, fade out over the last 30%
    opacity:
      t.value < 0.2 ? t.value / 0.2 : t.value > 0.7 ? (1 - t.value) / 0.3 : 1,
    transform: [
      { translateY: -t.value * height },
      { translateX: t.value * p.drift },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 0,
          left: p.left,
          width: p.size,
          height: p.size,
          borderRadius: p.size / 2,
          backgroundColor: p.color,
        },
        style,
      ]}
    />
  );
}

export function Glitter({ count = 18, height = 400 }) {
  const reduceMotion = useReducedMotion();
  const particles = useMemo(
    () => makeParticles(count, height),
    [count, height],
  );

  if (reduceMotion) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => (
        <Dot key={i} p={p} height={height} />
      ))}
    </View>
  );
}
