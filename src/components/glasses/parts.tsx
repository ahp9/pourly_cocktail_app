/**
 * Shared building blocks for the glassware illustrations.
 * Every glass uses these so strokes, opacity, highlights and shadows stay identical.
 */
import { useId, type ReactNode } from "react";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import { colors } from "@/styles";

export const VIEW_BOX = "0 0 220 240";
export const DEFAULT_WIDTH = 156;
export const DEFAULT_HEIGHT = 170;
export const DEFAULT_LIQUID = colors.amber;

export const CREAM = colors.cream;

/** Outline drawn on top of every glass. */
export const glassStroke = {
  fill: "none",
  stroke: CREAM,
  strokeOpacity: 0.35,
  strokeWidth: 1.5,
  strokeLinejoin: "round",
} as const;

/** Faint inner wall line that shows thick glass (rocks glass, mugs, jars). */
export const innerWall = {
  fill: "none",
  stroke: CREAM,
  strokeOpacity: 0.16,
  strokeWidth: 1,
  strokeLinejoin: "round",
} as const;

/** Fill for solid glass parts: stems, feet, handles. */
export const solidGlass = {
  fill: CREAM,
  fillOpacity: 0.12,
} as const;

export type GlassIds = {
  base: string;
  glass: string;
  liquid: string;
  clip: string;
};

/**
 * Gradient and clip IDs that are unique per component instance.
 * Two glasses with different colours can sit on the same screen without collisions.
 */
export function useGlassIds(prefix: string): GlassIds {
  const unique = useId().replace(/[^a-zA-Z0-9]/g, "");
  const base = `${prefix}${unique}`;
  return {
    base,
    glass: `${base}Glass`,
    liquid: `${base}Liquid`,
    clip: `${base}Clip`,
  };
}

export const url = (id: string) => `url(#${id})`;

type FrameProps = {
  width: number;
  height: number;
  children: ReactNode;
};

export function GlassFrame({ width, height, children }: FrameProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={VIEW_BOX}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {children}
    </Svg>
  );
}

type DefsProps = {
  ids: GlassIds;
  color: string;
  /** Path of the inside of the vessel. Liquid is clipped to it. */
  cavity?: string;
  children?: ReactNode;
};

export function GlassDefs({ ids, color, cavity, children }: DefsProps) {
  return (
    <Defs>
      <LinearGradient id={ids.glass} x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor={CREAM} stopOpacity={0.22} />
        <Stop offset="0.5" stopColor={CREAM} stopOpacity={0.04} />
        <Stop offset="1" stopColor={CREAM} stopOpacity={0.16} />
      </LinearGradient>
      <LinearGradient id={ids.liquid} x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor={color} stopOpacity={0.72} />
        <Stop offset="1" stopColor={color} stopOpacity={1} />
      </LinearGradient>
      {cavity ? (
        <ClipPath id={ids.clip}>
          <Path d={cavity} />
        </ClipPath>
      ) : null}
      {children}
    </Defs>
  );
}

type LiquidProps = {
  ids: GlassIds;
  /** y of the liquid surface. */
  top: number;
  bottom?: number;
  /** Ice, bubbles etc. Clipped to the cavity together with the liquid. */
  children?: ReactNode;
};

export function Liquid({ ids, top, bottom = 226, children }: LiquidProps) {
  return (
    <G clipPath={url(ids.clip)}>
      <Rect
        x="0"
        y={top}
        width="220"
        height={bottom - top}
        fill={url(ids.liquid)}
        opacity={0.92}
      />
      <Rect x="0" y={top} width="220" height="2" fill={CREAM} opacity={0.28} />
      {children}
    </G>
  );
}

type ShadowProps = {
  rx: number;
  cx?: number;
};

export function Shadow({ rx, cx = 110 }: ShadowProps) {
  return (
    <Ellipse cx={cx} cy="228" rx={rx} ry="7" fill="#000000" opacity={0.3} />
  );
}

type HighlightProps = {
  d: string;
  opacity?: number;
  width?: number;
};

export function Highlight({ d, opacity = 0.24, width = 3 }: HighlightProps) {
  return (
    <Path
      d={d}
      fill="none"
      stroke="#FFFFFF"
      strokeOpacity={opacity}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

type IceCubeProps = {
  /** Centre x */
  x: number;
  /** Centre y */
  y: number;
  size: number;
  rotate?: number;
};

export function IceCube({ x, y, size, rotate = 0 }: IceCubeProps) {
  return (
    <Rect
      x={x - size / 2}
      y={y - size / 2}
      width={size}
      height={size * 0.92}
      rx={size * 0.2}
      fill={CREAM}
      fillOpacity={0.18}
      stroke={CREAM}
      strokeOpacity={0.42}
      strokeWidth={1.2}
      transform={`rotate(${rotate} ${x} ${y})`}
    />
  );
}

type BubbleProps = {
  cx: number;
  cy: number;
  r: number;
};

export function Bubble({ cx, cy, r }: BubbleProps) {
  return (
    <Circle
      cx={cx}
      cy={cy}
      r={r}
      fill={CREAM}
      fillOpacity={0.5}
    />
  );
}

type StemProps = {
  /** y where the stem meets the bowl */
  top: number;
  /** Half the width of the foot */
  footHalf: number;
  stemHalf?: number;
  /** y of the top of the foot dome */
  footTop?: number;
  cx?: number;
};

/** Stem plus circular foot, drawn as solid glass. */
export function StemAndFoot({
  top,
  footHalf,
  stemHalf = 3,
  footTop = 210,
  cx = 110,
}: StemProps) {
  const l = cx - stemHalf;
  const r = cx + stemHalf;
  const stem = `M${l} ${top} L${l} ${footTop - 8} Q${l} ${footTop - 1} ${l - 8} ${footTop + 2} H${r + 8} Q${r} ${footTop - 1} ${r} ${footTop - 8} L${r} ${top} Z`;

  const fl = cx - footHalf;
  const fr = cx + footHalf;
  const foot = `M${fl} 221 Q${fl + 4} ${footTop + 2} ${cx} ${footTop} Q${fr - 4} ${footTop + 2} ${fr} 221 Q${fr} 224 ${fr - 4} 224 H${fl + 4} Q${fl} 224 ${fl} 221 Z`;

  return (
    <G>
      <Path d={foot} {...solidGlass} />
      <Path d={foot} {...glassStroke} />
      <Path d={stem} {...solidGlass} />
      <Path d={stem} {...glassStroke} />
    </G>
  );
}
