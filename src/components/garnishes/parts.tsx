/**
 * Shared building blocks for the garnish icons.
 * Every icon uses these so the frame, highlights and citrus peels stay consistent.
 */
import { useId, type ReactNode } from "react";
import Svg, { G, Path } from "react-native-svg";

export const VIEW_BOX = "0 0 64 64";
export const DEFAULT_SIZE = 28;

export type GarnishIds = {
  base: string;
  gradient: string;
};

/**
 * Gradient IDs that are unique per component instance.
 * The same icon can appear several times on one screen without collisions.
 */
export function useGarnishIds(prefix: string): GarnishIds {
  const unique = useId().replace(/[^a-zA-Z0-9]/g, "");
  const base = `${prefix}${unique}`;
  return {
    base,
    gradient: `${base}Gradient`,
  };
}

export const url = (id: string) => `url(#${id})`;

type FrameProps = {
  size: number;
  children: ReactNode;
};

export function GarnishFrame({ size, children }: FrameProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox={VIEW_BOX}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {children}
    </Svg>
  );
}

type HighlightProps = {
  d: string;
  opacity?: number;
  width?: number;
};

/** White shine stroke for glossy surfaces. */
export function Highlight({ d, opacity = 0.5, width = 2.5 }: HighlightProps) {
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

/** Colours for one citrus fruit. */
export type CitrusColors = {
  /** Outer skin */
  rind: string;
  /** Darker edge and pores */
  shade: string;
  /** White inner layer */
  pith: string;
};

export const LEMON: CitrusColors = { rind: "#F6D23C", shade: "#D9A91A", pith: "#FFF6D6" };
export const ORANGE: CitrusColors = { rind: "#F59A2C", shade: "#D06F12", pith: "#FFEBD2" };
export const LIME: CitrusColors = { rind: "#6BB33A", shade: "#3F8A2A", pith: "#E8F5C8" };

/**
 * Centre lines of a curled strip of peel, drawn as a tilted coil.
 * Back runs show the pith on the inside of each turn, front runs show the rind.
 */
const PEEL_BACK = [
  "M8.8 52.9 L12.5 54.3 L16.5 54.7 L20.2 53.8 L21.8 52.9",
  "M17.2 31.9 L17.5 33.5 L19.4 36.0 L22.7 38.8 L27.1 41.0 L31.9 42.0 L36.4 41.4 L39.7 39.1",
  "M33.2 17.6 L33.7 19.3 L35.8 21.7 L39.2 24.1 L43.3 25.9 L47.7 26.5 L51.5 25.7 L54.4 23.4",
];
const PEEL_FRONT = [
  "M21.8 52.9 L24.1 49.9 L25.0 45.9 L24.5 41.5 L22.9 37.3 L20.8 34.0 L18.7 32.1 L17.3 31.8 L17.2 31.9",
  "M39.7 39.1 L41.6 35.3 L41.9 30.6 L40.7 25.7 L38.6 21.5 L36.1 18.6 L34.1 17.3 L33.2 17.6",
  "M54.4 23.4 L56.0 20.0 L56.3 16.0 L55.5 12.0 L55.2 11.1",
];

/** A curled strip of citrus peel. The pith shows on the inside of each turn. */
export function CitrusPeel({ colors }: { colors: CitrusColors }) {
  return (
    <G fill="none" strokeLinecap="round" strokeLinejoin="round">
      {PEEL_BACK.map((d) => (
        <G key={d}>
          <Path d={d} stroke={colors.shade} strokeWidth={7} />
          <Path d={d} stroke={colors.pith} strokeWidth={4.5} />
        </G>
      ))}
      {PEEL_FRONT.map((d) => (
        <G key={d}>
          <Path d={d} stroke={colors.shade} strokeWidth={8} />
          <Path d={d} stroke={colors.rind} strokeWidth={5.5} />
        </G>
      ))}
    </G>
  );
}
