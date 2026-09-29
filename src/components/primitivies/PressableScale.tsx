import { useReducedMotion } from "@/hooks/useRefucedMotion";
import { motion } from "@/styles/tokens";
import * as Haptics from "expo-haptics";
import { ReactNode, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from "react-native";

type Props = Omit<PressableProps, "style" | "children"> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  pressedScale?: number; // .97 for buttons, .94 for chips (per the sheets)
  haptic?: boolean;
};

const settle = Easing.bezier(...motion.settle);

export function PressableScale({
  children,
  style,
  pressedScale = 0.97,
  haptic = true,
  disabled,
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();

  const to = (value: number, duration: number) => {
    if (reduced) return; // transforms drop out; haptics stay
    Animated.timing(scale, {
      toValue: value,
      duration,
      easing: settle,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      onPressIn={(e) => {
        to(pressedScale, 80);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        to(1, 280);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(e);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
