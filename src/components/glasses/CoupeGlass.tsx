import {
  DEFAULT_HEIGHT,
  DEFAULT_LIQUID,
  DEFAULT_WIDTH,
  GlassDefs,
  GlassFrame,
  Highlight,
  Liquid,
  Shadow,
  StemAndFoot,
  glassStroke,
  url,
  useGlassIds,
} from "@/components/glasses/parts";
import type { GlassProps } from "@/types/glasses";
import { Path } from "react-native-svg";

const BOWL = "M58 72 H162 C162 114 140 140 110 140 C80 140 58 114 58 72 Z";

/** Coupe / Nick & Nora: stemmed, rounded medium-depth bowl. */
export function CoupeGlass({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("coupe");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={BOWL} />
      <Shadow rx={42} />
      <StemAndFoot top={138} footHalf={36} />
      <Path d={BOWL} fill={url(ids.glass)} />
      <Liquid ids={ids} top={84} />
      <Path d={BOWL} {...glassStroke} />
      <Highlight d="M68 86 C70 106 80 122 94 130" />
    </GlassFrame>
  );
}
