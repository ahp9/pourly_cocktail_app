import {
  CitrusPeel,
  DEFAULT_SIZE,
  GarnishFrame,
  LEMON,
} from "@/components/garnishes/parts";
import type { GarnishIconProps } from "@/types/garnishes";

/** Lemon peel: a curled strip of peel. */
export function LemonPeelIcon({ size = DEFAULT_SIZE }: GarnishIconProps) {
  return (
    <GarnishFrame size={size}>
      <CitrusPeel colors={LEMON} />
    </GarnishFrame>
  );
}
