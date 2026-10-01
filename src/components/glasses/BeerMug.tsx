import {
  CREAM,
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
  solidGlass,
  url,
  useGlassIds,
} from "@/components/glasses/parts";
import type { GlassProps } from "@/types/glasses";
import { Line, Path } from "react-native-svg";

const OUTER = "M42 76 H142 V208 Q142 224 126 224 H58 Q42 224 42 208 Z";
const CAVITY = "M48 77 H136 V196 Q136 206 126 206 H58 Q48 206 48 196 Z";
const INNER_WALL = "M48 80 V196 Q48 206 58 206 H126 Q136 206 136 196 V80";
const HANDLE =
  "M140 100 H158 Q178 100 178 120 V172 Q178 192 158 192 H140 Z " +
  "M140 114 H156 Q164 114 164 122 V170 Q164 178 156 178 H140 Z";
const FOAM =
  "M40 102 Q50 86 64 92 Q78 82 92 90 Q106 80 120 89 Q132 82 144 92 V108 H40 Z";

/** Heavy glass beer mug with handle. */
export function BeerMug({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("beerMug");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={CAVITY} />
      <Shadow cx={106} rx={64} />

      <Path d={HANDLE} fillRule="evenodd" {...solidGlass} />
      <Path d={HANDLE} fillRule="evenodd" {...glassStroke} />

      <Path d={OUTER} fill={url(ids.glass)} />
      <Liquid ids={ids} top={98}>
        <Path d={FOAM} fill={CREAM} fillOpacity={0.55} />
      </Liquid>
      <Path d={INNER_WALL} {...innerWall} />
      <Line
        x1="72"
        y1="114"
        x2="72"
        y2="192"
        stroke={CREAM}
        strokeOpacity={0.12}
        strokeWidth={1}
      />
      <Line
        x1="112"
        y1="114"
        x2="112"
        y2="192"
        stroke={CREAM}
        strokeOpacity={0.12}
        strokeWidth={1}
      />
      <Path d={OUTER} {...glassStroke} />

      <Highlight d="M54 90 V196" />
      <Highlight d="M130 96 V190" opacity={0.12} width={2} />
    </GlassFrame>
  );
}
