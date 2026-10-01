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
import type { GlassProps } from "./types";

const OUTER = "M58 46 H162 L150 214 Q149 224 139 224 H81 Q71 224 70 214 Z";
const CAVITY = "M61 47 H159 L148 204 Q147 210 141 210 H79 Q73 210 72 204 Z";
const INNER_WALL = "M61.2 50 L72 204 Q73 210 79 210 H141 Q147 210 148 204 L158.8 50";

/** Shaker-style pint glass, wider at the top. */
export function PintGlass({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("pint");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={CAVITY} />
      <Shadow rx={46} />
      <Path d={OUTER} fill={url(ids.glass)} />
      <Liquid ids={ids} top={64} />
      <Path d={INNER_WALL} {...innerWall} />
      <Path d={OUTER} {...glassStroke} />
      <Highlight d="M70 60 L80 200" />
      <Highlight d="M150 66 L142 190" opacity={0.12} width={2} />
    </GlassFrame>
  );
}
