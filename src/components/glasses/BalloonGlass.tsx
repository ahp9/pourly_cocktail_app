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
  "M84 54 H136 C140 72 174 96 174 138 C174 174 148 194 110 194 C72 194 46 174 46 138 C46 96 80 72 84 54 Z";

/** Balloon glass / brandy snifter: large round bowl, narrow mouth, short stem. */
export function BalloonGlass({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("balloon");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={BOWL} />
      <Shadow rx={46} />
      <StemAndFoot top={192} stemHalf={5} footHalf={40} />
      <Path d={BOWL} fill={url(ids.glass)} />
      <Liquid ids={ids} top={156} />
      <Path d={BOWL} {...glassStroke} />
      <Highlight d="M60 118 C58 146 68 166 84 178" />
      <Highlight d="M90 64 C86 76 80 84 72 92" opacity={0.14} width={2} />
    </GlassFrame>
  );
}
