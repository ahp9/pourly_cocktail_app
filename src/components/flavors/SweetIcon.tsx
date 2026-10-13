import { DEFAULT_SIZE, FlavorFrame } from "@/components/flavors/parts";
import type { FlavorIconProps } from "@/types/flavors";
import { Circle, G, Path, Polygon } from "react-native-svg";

const TOP = "#FFFFFF";
const LEFT = "#EDE6DA";
const RIGHT = "#D9CFC0";

const GRAINS = [
  [14, 34],
  [18, 40],
  [30, 44],
  [46, 47],
  [51, 41],
  [34, 49],
] as const;

/** Sweet: two sugar cubes with a sparkle. */
export function SweetIcon({ size = DEFAULT_SIZE }: FlavorIconProps) {
  return (
    <FlavorFrame size={size}>
      <G stroke="#BFB3A1" strokeWidth={1} strokeLinejoin="round">
        <Polygon points="24,15 40,24 24,33 8,24" fill={TOP} />
        <Polygon points="8,24 24,33 24,51 8,42" fill={LEFT} />
        <Polygon points="24,33 40,24 40,42 24,51" fill={RIGHT} />
        <Polygon points="40,23 56,32 40,41 24,32" fill={TOP} />
        <Polygon points="24,32 40,41 40,59 24,50" fill={LEFT} />
        <Polygon points="40,41 56,32 56,50 40,59" fill={RIGHT} />
      </G>
      <G fill="#C9BCA8">
        {GRAINS.map(([cx, cy]) => (
          <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={0.9} />
        ))}
      </G>
      <Path
        d="M53 8 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z"
        fill="#F5D88A"
      />
    </FlavorFrame>
  );
}
