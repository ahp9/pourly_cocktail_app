import { DEFAULT_SIZE, GarnishFrame } from "@/components/garnishes/parts";
import type { GarnishIconProps } from "@/types/garnishes";
import { Ellipse, G, Path } from "react-native-svg";

const CREAM = "#FFF8EC";
const SHADE = "#E2D1B3";

/** Whipped cream: a piped dollop with a curled tip. */
export function WhippedCreamIcon({ size = DEFAULT_SIZE }: GarnishIconProps) {
  return (
    <GarnishFrame size={size}>
      <G fill={CREAM} stroke={SHADE} strokeWidth={1.2} strokeLinejoin="round">
        <Path d="M8 50 Q8 40 20 38 Q32 34 44 38 Q56 40 56 50 Q56 58 32 58 Q8 58 8 50 Z" />
        <Path d="M14 40 Q14 30 26 28 Q38 26 46 30 Q52 34 50 40 Q32 46 14 40 Z" />
        <Path d="M20 30 Q22 20 32 18 Q42 20 44 30 Q32 34 20 30 Z" />
        <Path d="M27 20 Q30 10 38 6 Q36 12 40 16 Q38 20 32 20 Z" />
      </G>
      <G stroke={SHADE} strokeWidth={1.2} fill="none" strokeLinecap="round">
        <Path d="M22 50 Q32 46 42 50" />
        <Path d="M26 38 Q32 35 38 38" />
      </G>
      <Ellipse cx={20} cy={46} rx={4} ry={1.8} fill="#FFFFFF" />
      <Ellipse cx={24} cy={34} rx={3} ry={1.5} fill="#FFFFFF" />
    </GarnishFrame>
  );
}
