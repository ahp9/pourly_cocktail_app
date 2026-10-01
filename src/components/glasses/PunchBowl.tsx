import { Line, Path } from "react-native-svg";
import { colors } from "@/styles";
import {
  CREAM,
  DEFAULT_HEIGHT,
  DEFAULT_LIQUID,
  DEFAULT_WIDTH,
  GlassDefs,
  GlassFrame,
  Highlight,
  IceCube,
  Liquid,
  Shadow,
  StemAndFoot,
  glassStroke,
  url,
  useGlassIds,
} from "./parts";
import type { GlassProps } from "./types";

const BOWL = "M24 88 H196 C196 140 160 176 110 176 C60 176 24 140 24 88 Z";
const FACETS = "M60 96 Q64 140 90 168 M110 96 V174 M160 96 Q156 140 130 168";

/** Wide communal punch bowl on a short pedestal, with a ladle. */
export function PunchBowl({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("punchBowl");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={BOWL} />
      <Shadow rx={52} />
      <StemAndFoot top={172} stemHalf={10} footTop={202} footHalf={46} />
      <Path d={BOWL} fill={url(ids.glass)} />

      {/* Ladle handle, behind the liquid */}
      <Line
        x1="144"
        y1="140"
        x2="182"
        y2="44"
        stroke={colors.cream2}
        strokeOpacity={0.75}
        strokeWidth={4}
        strokeLinecap="round"
      />

      <Liquid ids={ids} top={104}>
        <IceCube x={64} y={106} size={26} rotate={-8} />
        <IceCube x={100} y={102} size={24} rotate={12} />
      </Liquid>
      <Path d={FACETS} fill="none" stroke={CREAM} strokeOpacity={0.12} strokeWidth={1} />
      <Path d={BOWL} {...glassStroke} />
      <Highlight d="M36 100 C40 130 54 152 72 164" />
    </GlassFrame>
  );
}
