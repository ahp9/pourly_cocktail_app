import { Ellipse, LinearGradient, Path, Stop } from "react-native-svg";
import { colors } from "@/styles";
import {
  DEFAULT_HEIGHT,
  DEFAULT_LIQUID,
  DEFAULT_WIDTH,
  GlassDefs,
  GlassFrame,
  Highlight,
  Shadow,
  url,
  useGlassIds,
} from "./parts";
import type { GlassProps } from "./types";

const BODY = "M44 96 H140 V206 Q140 224 122 224 H62 Q44 224 44 206 Z";
const HANDLE =
  "M138 116 H154 Q174 116 174 138 V160 Q174 184 150 184 H138 Z " +
  "M138 128 H152 Q162 128 162 140 V158 Q162 172 150 172 H138 Z";

/** Opaque ceramic coffee mug. Only the drink surface is visible. */
export function CoffeeMug({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("coffeeMug");
  const ceramicId = `${ids.base}Ceramic`;

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color}>
        <LinearGradient id={ceramicId} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={colors.cream2} />
          <Stop offset="0.3" stopColor={colors.cream} />
          <Stop offset="1" stopColor={colors.muted} />
        </LinearGradient>
      </GlassDefs>

      <Shadow cx={100} rx={58} />

      <Path d={HANDLE} fillRule="evenodd" fill={colors.cream2} />
      <Path d={BODY} fill={url(ceramicId)} />

      {/* Opening and drink surface */}
      <Ellipse cx="92" cy="96" rx="48" ry="8" fill={colors.muted} />
      <Ellipse cx="92" cy="98" rx="44" ry="6" fill={url(ids.liquid)} />

      <Highlight d="M56 110 V202" opacity={0.4} />
    </GlassFrame>
  );
}
