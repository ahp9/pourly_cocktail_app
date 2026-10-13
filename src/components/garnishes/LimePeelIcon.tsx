import {
  CitrusPeel,
  DEFAULT_SIZE,
  GarnishFrame,
  LIME,
} from "@/components/garnishes/parts";
import type { GarnishIconProps } from "@/types/garnishes";

/** Lime peel: a curled strip of peel. */
export function LimePeelIcon({ size = DEFAULT_SIZE }: GarnishIconProps) {
  return (
    <GarnishFrame size={size}>
      <CitrusPeel colors={LIME} />
    </GarnishFrame>
  );
}
