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

/** Wide shallow upper bowl stepping into a small round lower bowl. */
const BOWL =
  "M44 64 H176 C176 90 162 100 146 102 C143 103 142 106 142 110 C142 132 128 146 110 146 " +
  "C92 146 78 132 78 110 C78 106 77 103 74 102 C58 100 44 90 44 64 Z";

/** Margarita / coupette glass with the stepped double bowl. */
export function MargaritaGlass({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("margarita");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={BOWL} />
      <Shadow rx={42} />
      <StemAndFoot top={144} footHalf={36} />
      <Path d={BOWL} fill={url(ids.glass)} />
      <Liquid ids={ids} top={74} />
      <Path d={BOWL} {...glassStroke} />
      <Highlight d="M54 74 C58 88 66 94 76 98" />
      <Highlight d="M88 114 C90 128 96 136 104 140" opacity={0.14} width={2} />
    </GlassFrame>
  );
}
