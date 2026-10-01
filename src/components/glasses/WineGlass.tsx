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
  StemAndFoot,
  glassStroke,
  url,
  useGlassIds,
} from "./parts";
import type { GlassProps } from "./types";

const BOWL =
  "M76 40 H144 C152 64 158 88 154 104 C150 120 134 130 110 130 C86 130 70 120 66 104 C62 88 68 64 76 40 Z";

/** Wine glass: medium bowl, long stem. Works for white and general wine. */
export function WineGlass({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("wine");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={BOWL} />
      <Shadow rx={42} />
      <StemAndFoot top={128} footHalf={36} />
      <Path d={BOWL} fill={url(ids.glass)} />
      <Liquid ids={ids} top={88} />
      <Path d={BOWL} {...glassStroke} />
      <Highlight d="M78 56 C72 76 72 96 80 112" />
    </GlassFrame>
  );
}
