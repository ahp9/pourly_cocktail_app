import { DEFAULT_SIZE, GarnishFrame } from "@/components/garnishes/parts";
import type { GarnishIconProps } from "@/types/garnishes";
import { G, Path, Rect } from "react-native-svg";

const SQUARES = [
  [12, 12],
  [27, 12],
  [12, 27],
  [27, 27],
  [12, 42],
  [27, 42],
] as const;

/** Chocolate: a bar with a piece broken off. */
export function ChocolateIcon({ size = DEFAULT_SIZE }: GarnishIconProps) {
  return (
    <GarnishFrame size={size}>
      <Path
        d="M8 8 H44 V40 L40 44 L44 48 V58 H8 Z"
        fill="#5A2E16"
        strokeLinejoin="round"
      />
      <G>
        {SQUARES.map(([x, y]) => (
          <G key={`${x}-${y}`}>
            <Rect x={x} y={y} width={13} height={13} rx={2} fill="#7B4223" />
            <Rect x={x + 1.5} y={y + 1.5} width={10} height={2} rx={1} fill="#9A5A35" />
          </G>
        ))}
      </G>
      {/* Broken-off piece */}
      <G transform="rotate(14 52 46)">
        <Path d="M46 38 H58 V52 H46 L49 47 L46 43 Z" fill="#5A2E16" strokeLinejoin="round" />
        <Rect x={50} y={40} width={6} height={10} rx={1.5} fill="#7B4223" />
      </G>
    </GarnishFrame>
  );
}
