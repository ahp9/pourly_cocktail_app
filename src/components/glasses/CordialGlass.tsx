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

const BOWL =
  "M90 110 H130 C130 130 128 150 118 158 C114 161 106 161 102 158 C92 150 90 130 90 110 Z";

/** Cordial / pousse café glass: tiny narrow bowl on a medium stem. */
export function CordialGlass({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("cordial");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={BOWL} />
      <Shadow rx={28} />
      <StemAndFoot top={158} stemHalf={2.5} footHalf={24} />
      <Path d={BOWL} fill={url(ids.glass)} />
      <Liquid ids={ids} top={120} />
      <Path d={BOWL} {...glassStroke} />
      <Highlight d="M96 118 C96 134 98 146 104 154" width={2.5} />
    </GlassFrame>
  );
}
