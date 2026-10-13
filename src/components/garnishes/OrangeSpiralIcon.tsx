import { DEFAULT_SIZE, GarnishFrame, ORANGE } from "@/components/garnishes/parts";
import type { GarnishIconProps } from "@/types/garnishes";
import { G, Path } from "react-native-svg";

/** Back halves of each loop show the pith, front halves show the rind. */
const BACK = [
  "M16 12 Q32 4 48 12",
  "M16 26 Q32 18 48 26",
  "M16 40 Q32 32 48 40",
];
const FRONT = [
  "M48 12 Q36 22 16 26",
  "M48 26 Q36 36 16 40",
  "M48 40 Q38 52 24 58",
];

/** Orange spiral: a long corkscrew of peel. */
export function OrangeSpiralIcon({ size = DEFAULT_SIZE }: GarnishIconProps) {
  return (
    <GarnishFrame size={size}>
      <G fill="none" strokeLinecap="round">
        <G stroke={ORANGE.pith} strokeWidth={5}>
          {BACK.map((d) => (
            <Path key={d} d={d} />
          ))}
        </G>
        <G stroke={ORANGE.shade} strokeWidth={7}>
          {FRONT.map((d) => (
            <Path key={d} d={d} />
          ))}
        </G>
        <G stroke={ORANGE.rind} strokeWidth={5}>
          {FRONT.map((d) => (
            <Path key={d} d={d} />
          ))}
        </G>
      </G>
    </GarnishFrame>
  );
}
