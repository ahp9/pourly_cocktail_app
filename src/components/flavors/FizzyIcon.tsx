import { DEFAULT_SIZE, FlavorFrame, Highlight } from "@/components/flavors/parts";
import type { FlavorIconProps } from "@/types/flavors";
import { Circle, G } from "react-native-svg";

const BUBBLES = [
  { cx: 22, cy: 46, r: 11 },
  { cx: 44, cy: 37, r: 8 },
  { cx: 27, cy: 23, r: 6 },
  { cx: 48, cy: 54, r: 4.5 },
  { cx: 44, cy: 17, r: 4 },
  { cx: 35, cy: 8, r: 2.5 },
] as const;

/** Fizzy: rising bubbles. */
export function FizzyIcon({ size = DEFAULT_SIZE }: FlavorIconProps) {
  return (
    <FlavorFrame size={size}>
      <G fill="#BDE8FA" fillOpacity={0.3} stroke="#6CC4EE" strokeWidth={2}>
        {BUBBLES.map(({ cx, cy, r }) => (
          <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
        ))}
      </G>
      <Highlight d="M15 43 A7 7 0 0 1 19 38" opacity={0.85} width={2} />
      <Highlight d="M39 35 A5 5 0 0 1 42 32" opacity={0.85} width={2} />
      <Highlight d="M24 21 A3.5 3.5 0 0 1 26 19.5" opacity={0.85} width={2} />
    </FlavorFrame>
  );
}
