import {
  DEFAULT_SIZE,
  FlavorFrame,
  Highlight,
  url,
  useFlavorIds,
} from "@/components/flavors/parts";
import type { FlavorIconProps } from "@/types/flavors";
import { Circle, Defs, G, Line, RadialGradient, Stop } from "react-native-svg";

const PITH = "#E8F5C8";

/** Segment lines every 45°, from the centre to the rind. */
const SEGMENTS = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x2: 32 + 18 * Math.cos(rad), y2: 32 + 18 * Math.sin(rad), deg };
});

/** Sour: a lime slice. */
export function SourIcon({ size = DEFAULT_SIZE }: FlavorIconProps) {
  const ids = useFlavorIds("sour");

  return (
    <FlavorFrame size={size}>
      <Defs>
        <RadialGradient id={ids.gradient} cx="0.4" cy="0.35" r="0.7">
          <Stop offset="0" stopColor="#D4F07A" />
          <Stop offset="1" stopColor="#8CC63F" />
        </RadialGradient>
      </Defs>
      <Circle cx={32} cy={32} r={25} fill="#3F8A2A" />
      <Circle cx={32} cy={32} r={22} fill={PITH} />
      <Circle cx={32} cy={32} r={19.5} fill={url(ids.gradient)} />
      <G stroke={PITH} strokeWidth={2.5} strokeLinecap="round">
        {SEGMENTS.map(({ x2, y2, deg }) => (
          <Line key={deg} x1={32} y1={32} x2={x2} y2={y2} />
        ))}
      </G>
      <Circle cx={32} cy={32} r={3} fill={PITH} />
      <Highlight d="M15 22 A19 19 0 0 1 24 13" />
    </FlavorFrame>
  );
}
