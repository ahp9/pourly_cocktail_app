import {
  DEFAULT_SIZE,
  GarnishFrame,
  url,
  useGarnishIds,
} from "@/components/garnishes/parts";
import type { GarnishIconProps } from "@/types/garnishes";
import {
  Circle,
  Defs,
  Ellipse,
  G,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";

/** Olive: a stuffed green olive on a cocktail pick. */
export function OliveIcon({ size = DEFAULT_SIZE }: GarnishIconProps) {
  const ids = useGarnishIds("olive");

  return (
    <GarnishFrame size={size}>
      <Defs>
        <RadialGradient id={ids.gradient} cx="0.35" cy="0.35" r="0.75">
          <Stop offset="0" stopColor="#B4C55A" />
          <Stop offset="1" stopColor="#5E7424" />
        </RadialGradient>
      </Defs>
      {/* Pick */}
      <Path
        d="M8 56 L56 8"
        stroke="#D9B47A"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <Circle cx={54} cy={10} r={3.5} fill="#C9433A" />
      {/* Olive, rotated to sit along the pick */}
      <G transform="rotate(-45 30 34)">
        <Ellipse cx={30} cy={34} rx={16} ry={12} fill={url(ids.gradient)} />
        <Ellipse cx={42} cy={34} rx={4} ry={5} fill="#C9433A" />
        <Ellipse cx={43} cy={33} rx={1.5} ry={2} fill="#E86A5E" />
        <Ellipse cx={24} cy={27} rx={6} ry={2.5} fill="#FFFFFF" fillOpacity={0.35} />
      </G>
    </GarnishFrame>
  );
}
