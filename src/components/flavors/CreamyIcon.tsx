import { DEFAULT_SIZE, FlavorFrame } from "@/components/flavors/parts";
import type { FlavorIconProps } from "@/types/flavors";
import { Ellipse, G, Path } from "react-native-svg";

const CREAM = "#FFF8EC";
const SHADE = "#E2D1B3";

/** Creamy: a swirl of whipped cream. */
export function CreamyIcon({ size = DEFAULT_SIZE }: FlavorIconProps) {
  return (
    <FlavorFrame size={size}>
      <G stroke={SHADE} strokeWidth={1.2}>
        <Ellipse cx={32} cy={50} rx={24} ry={9} fill="#F3E6CF" />
        <Ellipse cx={32} cy={44} rx={22} ry={10} fill={CREAM} />
        <Ellipse cx={32} cy={34} rx={17} ry={9} fill={CREAM} />
        <Ellipse cx={32} cy={25} rx={12} ry={7} fill={CREAM} />
        <Path
          d="M24 24 Q30 18 33 6 Q38 16 40 24 Z"
          fill={CREAM}
          strokeLinejoin="round"
        />
      </G>
      <G stroke={SHADE} strokeWidth={1.2} fill="none" strokeLinecap="round">
        <Path d="M14 46 Q32 54 50 46" />
        <Path d="M19 37 Q32 44 45 37" />
      </G>
      <Ellipse cx={25} cy={31} rx={3} ry={1.6} fill="#FFFFFF" />
      <Ellipse cx={19} cy={41} rx={4} ry={1.8} fill="#FFFFFF" />
    </FlavorFrame>
  );
}
