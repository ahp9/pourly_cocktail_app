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

const OUTER = "M70 40 H150 L148 214 Q147 224 137 224 H83 Q73 224 72 214 Z";
const CAVITY = "M73 41 H147 L145 204 Q145 210 139 210 H81 Q75 210 75 204 Z";
const INNER_WALL =
  "M73 44 L75 204 Q75 210 81 210 H139 Q145 210 145 204 L147 44";

/** Highball / Collins: tall, narrow, straight-sided. */
export function HighballGlass({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("highball");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={CAVITY} />
      <Shadow rx={44} />
      <Path d={OUTER} fill={url(ids.glass)} />
      <Liquid ids={ids} top={64}>
        <IceCube x={96} y={70} size={30} rotate={-8} />
        <IceCube x={124} y={100} size={30} rotate={10} />
        <IceCube x={94} y={132} size={28} rotate={4} />
      </Liquid>
      <Path d={INNER_WALL} {...innerWall} />
      <Path d={OUTER} {...glassStroke} />
      <Highlight d="M80 54 L82 200" />
      <Highlight d="M141 58 L139 192" opacity={0.12} width={2} />
    </GlassFrame>
  );
}
