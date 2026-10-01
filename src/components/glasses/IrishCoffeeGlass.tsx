import { Path } from "react-native-svg";
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
  solidGlass,
  url,
  useGlassIds,
} from "./parts";
import type { GlassProps } from "./types";

const BOWL = "M60 56 H140 L136 160 C135 176 120 182 100 182 C80 182 65 176 64 160 Z";
const HANDLE =
  "M136 86 H146 Q162 86 162 102 V124 Q162 140 146 140 H135 Z " +
  "M136 96 H144 Q152 96 152 104 V122 Q152 130 144 130 H136 Z";

/** Heatproof Irish coffee glass: tall bowl, short stem, small handle. */
export function IrishCoffeeGlass({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("irishCoffee");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={BOWL} />
      <Shadow cx={102} rx={40} />

      <Path d={HANDLE} fillRule="evenodd" {...solidGlass} />
      <Path d={HANDLE} fillRule="evenodd" {...glassStroke} />

      <StemAndFoot cx={100} top={180} stemHalf={6} footTop={206} footHalf={36} />

      <Path d={BOWL} fill={url(ids.glass)} />
      <Liquid ids={ids} top={76} />
      <Path d={BOWL} {...glassStroke} />
      <Highlight d="M71 70 L75 160" />
      <Highlight d="M130 72 L127 150" opacity={0.12} width={2} />
    </GlassFrame>
  );
}
