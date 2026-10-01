import {
  DEFAULT_HEIGHT,
  DEFAULT_LIQUID,
  DEFAULT_WIDTH,
  GlassDefs,
  GlassFrame,
  Highlight,
  IceCube,
  Liquid,
  Shadow,
  glassStroke,
  innerWall,
  url,
  useGlassIds,
} from "@/components/glasses/parts";
import type { GlassProps } from "@/types/glasses";
import { Path } from "react-native-svg";

const OUTER = "M46 108 H174 L168 214 Q167 224 157 224 H63 Q53 224 52 214 Z";
const CAVITY = "M49 109 H171 L165 198 Q164 206 156 206 H64 Q56 206 55 198 Z";
const INNER_WALL =
  "M49.5 112 L55 198 Q56 206 64 206 H156 Q164 206 165 198 L170.5 112";

/** Rocks / old-fashioned glass. */
export function WhiskeyGlass({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("whiskey");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={CAVITY} />
      <Shadow rx={62} />
      <Path d={OUTER} fill={url(ids.glass)} />
      <Liquid ids={ids} top={148}>
        <IceCube x={82} y={146} size={34} rotate={-12} />
        <IceCube x={124} y={142} size={36} rotate={9} />
        <IceCube x={104} y={178} size={30} rotate={5} />
      </Liquid>
      <Path d={INNER_WALL} {...innerWall} />
      <Path d={OUTER} {...glassStroke} />
      <Highlight d="M60 120 L66 196" />
      <Highlight d="M160 124 L156 190" opacity={0.12} width={2} />
    </GlassFrame>
  );
}
