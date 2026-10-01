import { Path, Rect } from "react-native-svg";
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
  glassStroke,
  innerWall,
  url,
  useGlassIds,
} from "./parts";
import type { GlassProps } from "./types";

const OUTER =
  "M66 56 H154 V78 C154 84 162 86 162 96 V208 Q162 224 146 224 H74 Q58 224 58 208 V96 C58 86 66 84 66 78 Z";
const CAVITY =
  "M69 57 H151 V80 C151 86 158 88 158 98 V200 Q158 210 148 210 H72 Q62 210 62 200 V98 C62 88 69 86 69 80 Z";
const INNER_WALL =
  "M69 60 V80 C69 86 62 88 62 98 V200 Q62 210 72 210 H148 Q158 210 158 200 V98 C158 88 151 86 151 80 V60";
const THREADS = "M66 61 L154 59 M66 67 L154 65 M66 73 L154 71";

/** Mason jar: screw-thread neck, shoulders, heavy base. */
export function MasonJar({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("masonJar");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={CAVITY} />
      <Shadow rx={58} />
      <Path d={OUTER} fill={url(ids.glass)} />
      <Liquid ids={ids} top={100}>
        <IceCube x={88} y={100} size={32} rotate={-9} />
        <IceCube x={128} y={104} size={30} rotate={11} />
      </Liquid>
      <Path d={INNER_WALL} {...innerWall} />
      <Rect
        x="82"
        y="128"
        width="56"
        height="52"
        rx="10"
        fill="none"
        stroke={CREAM}
        strokeOpacity={0.16}
        strokeWidth={1}
      />
      <Path d={OUTER} {...glassStroke} />
      <Path
        d={THREADS}
        fill="none"
        stroke={CREAM}
        strokeOpacity={0.32}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <Highlight d="M70 104 V200" />
      <Highlight d="M152 104 V196" opacity={0.12} width={2} />
    </GlassFrame>
  );
}
