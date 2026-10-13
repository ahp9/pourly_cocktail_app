import { DEFAULT_SIZE, FlavorFrame } from "@/components/flavors/parts";
import type { FlavorIconProps } from "@/types/flavors";
import { G, Path } from "react-native-svg";

type LeafProps = {
  x: number;
  y: number;
  rotate: number;
  scale?: number;
};

/** One leaf, drawn pointing right from its base at (x, y). */
function Leaf({ x, y, rotate, scale = 1 }: LeafProps) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <Path d="M0 0 Q11 -9 22 0 Q11 9 0 0 Z" fill="#5DAA4C" />
      <Path d="M1 0 L19 0" stroke="#3E7F33" strokeWidth={1.2} strokeLinecap="round" />
    </G>
  );
}

const LEAVES: LeafProps[] = [
  { x: 31, y: 50, rotate: -30, scale: 1.15 },
  { x: 31, y: 50, rotate: -150, scale: 1.15 },
  { x: 31, y: 34, rotate: -35 },
  { x: 31, y: 34, rotate: -145 },
  { x: 32, y: 20, rotate: -90, scale: 0.85 },
];

/** Herbal: a mint sprig. */
export function HerbalIcon({ size = DEFAULT_SIZE }: FlavorIconProps) {
  return (
    <FlavorFrame size={size}>
      <Path
        d="M32 61 Q30 40 32 14"
        stroke="#4E8A3A"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
      {LEAVES.map((leaf) => (
        <Leaf key={`${leaf.y}${leaf.rotate}`} {...leaf} />
      ))}
    </FlavorFrame>
  );
}
