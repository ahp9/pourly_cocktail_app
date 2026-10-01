import type { GlassProps } from "@/types/glasses";
import { Path } from "react-native-svg";
import {
  DEFAULT_HEIGHT,
  DEFAULT_LIQUID,
  DEFAULT_WIDTH,
  GlassDefs,
  GlassFrame,
  Highlight,
  Liquid,
  Shadow,
  glassStroke,
  innerWall,
  url,
  useGlassIds,
} from "./parts";

const OUTER =
  "M72 34 H148 C146 92 136 150 127 176 L128 204 Q130 214 142 216 Q146 217 146 221 Q146 224 142 224 " +
  "H78 Q74 224 74 221 Q74 217 78 216 Q90 214 92 204 L93 176 C84 150 74 92 72 34 Z";
const CAVITY =
  "M75 35 H145 C143 92 133 148 125 170 Q110 180 95 170 C87 148 77 92 75 35 Z";
const INNER_WALL =
  "M75 38 C77 92 87 148 95 170 Q110 180 125 170 C133 148 143 92 145 38";

/** Tall pilsner: narrow at the bottom, flaring to a wide mouth. */
export function PilsnerGlass({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("pilsner");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={CAVITY} />
      <Shadow rx={40} />
      <Path d={OUTER} fill={url(ids.glass)} />
      <Liquid ids={ids} top={54} />
      <Path d={INNER_WALL} {...innerWall} />
      <Path d={OUTER} {...glassStroke} />
      <Highlight d="M81 50 C83 96 88 134 96 162" />
      <Highlight d="M139 52 C137 92 132 126 126 150" opacity={0.12} width={2} />
    </GlassFrame>
  );
}
