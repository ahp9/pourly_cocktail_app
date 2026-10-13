import {
  DEFAULT_SIZE,
  FlavorFrame,
  url,
  useFlavorIds,
} from "@/components/flavors/parts";
import type { FlavorIconProps } from "@/types/flavors";
import {
  Circle,
  Defs,
  Ellipse,
  G,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";

const CHERRIES = [
  { cx: 21, cy: 45 },
  { cx: 43, cy: 47 },
] as const;

/** Fruity: a pair of cherries. */
export function FruityIcon({ size = DEFAULT_SIZE }: FlavorIconProps) {
  const ids = useFlavorIds("fruity");

  return (
    <FlavorFrame size={size}>
      <Defs>
        <RadialGradient id={ids.gradient} cx="0.35" cy="0.35" r="0.75">
          <Stop offset="0" stopColor="#F0504F" />
          <Stop offset="1" stopColor="#A3122A" />
        </RadialGradient>
      </Defs>
      <G stroke="#5B7A2B" strokeWidth={2.5} fill="none" strokeLinecap="round">
        <Path d="M22 34 Q26 18 40 8" />
        <Path d="M43 36 Q41 20 40 8" />
      </G>
      <Path d="M40 9 Q49 1 57 7 Q49 15 40 9 Z" fill="#6FA83A" />
      <Path d="M41 9 Q49 7 55 7" stroke="#4E7F25" strokeWidth={1} fill="none" />
      {CHERRIES.map(({ cx, cy }) => (
        <G key={cx}>
          <Circle cx={cx} cy={cy} r={12} fill={url(ids.gradient)} />
          <Ellipse
            cx={cx - 4}
            cy={cy - 5}
            rx={3}
            ry={4}
            fill="#FFFFFF"
            fillOpacity={0.45}
            transform={`rotate(-30 ${cx - 4} ${cy - 5})`}
          />
        </G>
      ))}
    </FlavorFrame>
  );
}
