import { Path } from "react-native-svg";
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
  solidGlass,
  url,
  useGlassIds,
} from "./parts";
import type { GlassProps } from "./types";

const OUTER =
  "M34 28 Q46 30 54 40 L50 210 Q50 224 64 224 H140 Q154 224 154 210 L150 40 L152 32 Q152 28 148 28 Z";
const CAVITY = "M40 30 Q50 32 56 42 L53 206 Q53 214 62 214 H142 Q151 214 151 206 L148 42 L149 30 Z";
const INNER_WALL = "M56 44 L53 206 Q53 214 62 214 H142 Q151 214 151 206 L148 44";
const HANDLE =
  "M150 54 H168 Q190 54 190 76 V148 Q190 178 156 190 L152 178 Q178 168 178 146 V80 Q178 66 166 66 H150 Z";

/** Serving pitcher with spout and handle. */
export function Pitcher({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("pitcher");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={CAVITY} />
      <Shadow cx={104} rx={60} />

      <Path d={HANDLE} {...solidGlass} />
      <Path d={HANDLE} {...glassStroke} />

      <Path d={OUTER} fill={url(ids.glass)} />
      <Liquid ids={ids} top={72}>
        <IceCube x={82} y={72} size={30} rotate={-10} />
        <IceCube x={120} y={68} size={32} rotate={8} />
      </Liquid>
      <Path d={INNER_WALL} {...innerWall} />
      <Path d={OUTER} {...glassStroke} />
      <Highlight d="M64 52 L61 200" />
      <Highlight d="M142 56 L144 196" opacity={0.12} width={2} />
    </GlassFrame>
  );
}
