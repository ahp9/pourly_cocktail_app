import { colors, type, TypeVariant } from "@/styles/tokens";
import { Text, TextProps } from "react-native";

type ColorToken = keyof typeof colors;

type Props = TextProps & {
  variant?: TypeVariant;
  color?: ColorToken;
  align?: "left" | "center" | "right";
};

export function AppText({
  variant = "body",
  color = "cream",
  align,
  style,
  ...rest
}: Props) {
  return (
    <Text
      {...rest}
      style={[
        type[variant],
        { color: colors[color] },
        align && { textAlign: align },
        style,
      ]}
    />
  );
}
