/**
 * Shared building blocks for the flavor icons.
 * Every icon uses these so the frame, highlights and IDs stay consistent.
 */
import { useId, type ReactNode } from "react";
import Svg, { Path } from "react-native-svg";

export const VIEW_BOX = "0 0 64 64";
export const DEFAULT_SIZE = 28;

export type FlavorIds = {
  base: string;
  gradient: string;
};

/**
 * Gradient IDs that are unique per component instance.
 * The same icon can appear several times on one screen without collisions.
 */
export function useFlavorIds(prefix: string): FlavorIds {
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

export function FlavorFrame({ size, children }: FrameProps) {
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

/** White shine stroke, used on round shapes (lime, bubbles). */
export function Highlight({ d, opacity = 0.55, width = 2.5 }: HighlightProps) {
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
