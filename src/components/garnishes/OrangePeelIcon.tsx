import {
  CitrusPeel,
  DEFAULT_SIZE,
  GarnishFrame,
  ORANGE,
} from "@/components/garnishes/parts";
import type { GarnishIconProps } from "@/types/garnishes";

/** Orange peel: a curled strip of peel. */
export function OrangePeelIcon({ size = DEFAULT_SIZE }: GarnishIconProps) {
  return (
    <GarnishFrame size={size}>
      <CitrusPeel colors={ORANGE} />
    </GarnishFrame>
  );
}
