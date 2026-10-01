import { Ellipse, LinearGradient, Line, Path, Rect, Stop } from "react-native-svg";
import {
  CREAM,
  DEFAULT_HEIGHT,
  DEFAULT_LIQUID,
  DEFAULT_WIDTH,
  GlassDefs,
  GlassFrame,
  Highlight,
  Shadow,
  glassStroke,
  url,
  useGlassIds,
} from "./parts";
import type { GlassProps } from "./types";

const COPPER_DARK = "#7E4224";
const COPPER_MID = "#B8693A";
const COPPER_LIGHT = "#E09A68";

const BODY = "M44 100 H144 L141 210 Q140 224 126 224 H62 Q48 224 47 210 Z";
const HANDLE = "M142 118 C168 116 176 128 176 156 C176 184 168 196 141 194";

/** Moscow mule style copper mug. */
export function CopperMug({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("copperMug");
  const copperId = `${ids.base}Copper`;

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color}>
        <LinearGradient id={copperId} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={COPPER_MID} />
          <Stop offset="0.3" stopColor={COPPER_LIGHT} />
          <Stop offset="0.65" stopColor={COPPER_MID} />
          <Stop offset="1" stopColor={COPPER_DARK} />
        </LinearGradient>
      </GlassDefs>

      <Shadow cx={102} rx={62} />

      {/* Handle */}
      <Path
        d={HANDLE}
        fill="none"
        stroke={COPPER_MID}
        strokeWidth={11}
        strokeLinecap="round"
      />
      <Path
        d={HANDLE}
        fill="none"
        stroke={COPPER_LIGHT}
        strokeOpacity={0.5}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Body */}
      <Path d={BODY} fill={url(copperId)} />
      <Line x1="47" y1="120" x2="143" y2="120" stroke={COPPER_DARK} strokeOpacity={0.6} strokeWidth={1.5} />
      <Line x1="48" y1="204" x2="140" y2="204" stroke={COPPER_DARK} strokeOpacity={0.6} strokeWidth={1.5} />
      <Path d={BODY} {...glassStroke} />

      {/* Rim and opening */}
      <Rect x="42" y="94" width="104" height="10" rx="4" fill={url(copperId)} />
      <Ellipse cx="94" cy="96" rx="49" ry="7" fill="#2B1A10" />
      <Ellipse cx="94" cy="98" rx="45" ry="5" fill={url(ids.liquid)} />
      <Rect
        x="104"
        y="88"
        width="18"
        height="14"
        rx="3"
        fill={CREAM}
        fillOpacity={0.3}
        stroke={CREAM}
        strokeOpacity={0.45}
        strokeWidth={1.2}
        transform="rotate(12 113 95)"
      />

      <Highlight d="M60 112 L64 204" opacity={0.3} />
      <Highlight d="M132 112 L130 200" opacity={0.12} width={2} />
    </GlassFrame>
  );
}
