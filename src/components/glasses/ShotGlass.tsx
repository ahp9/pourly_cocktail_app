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

const OUTER = "M78 146 H142 L136 216 Q135 224 127 224 H93 Q85 224 84 216 Z";
const CAVITY = "M81 147 H139 L134 202 Q133 206 129 206 H91 Q87 206 86 202 Z";
const INNER_WALL = "M81.3 150 L86 202 Q87 206 91 206 H129 Q133 206 134 202 L138.7 150";

/** Shot glass: small, slightly flared, thick base. */
export function ShotGlass({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("shot");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={CAVITY} />
      <Shadow rx={32} />
      <Path d={OUTER} fill={url(ids.glass)} />
      <Liquid ids={ids} top={162} />
      <Path d={INNER_WALL} {...innerWall} />
      <Path d={OUTER} {...glassStroke} />
      <Highlight d="M89 156 L93 200" />
    </GlassFrame>
  );
}
