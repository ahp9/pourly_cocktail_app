import { Line, Path } from "react-native-svg";
import { colors } from "@/styles";
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
  "M76 30 H144 C142 52 132 70 132 90 C132 112 154 128 154 158 C154 184 134 198 110 198 " +
  "C86 198 66 184 66 158 C66 128 88 112 88 90 C88 70 78 52 76 30 Z";

/** Hurricane glass: flared lip, narrow waist, round lower bulb, short stem. */
export function HurricaneGlass({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("hurricane");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={BOWL} />
      <Shadow rx={42} />
      <StemAndFoot top={196} stemHalf={6} footHalf={36} />
      <Path d={BOWL} fill={url(ids.glass)} />

      {/* Straw sits behind the liquid */}
      <Line
        x1="104"
        y1="184"
        x2="150"
        y2="14"
        stroke={colors.cream2}
        strokeOpacity={0.7}
        strokeWidth={5}
        strokeLinecap="round"
      />

      <Liquid ids={ids} top={62} />
      <Path d={BOWL} {...glassStroke} />
      <Highlight d="M84 44 C88 62 94 76 94 94" />
      <Highlight d="M78 138 C74 158 80 176 94 186" />
    </GlassFrame>
  );
}
