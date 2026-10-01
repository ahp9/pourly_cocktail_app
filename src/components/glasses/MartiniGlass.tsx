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
} from "@/components/glasses/parts";
import type { GlassProps } from "@/types/glasses";
import { Path } from "react-native-svg";

const BOWL = "M46 54 H174 L114 120 Q110 124 106 120 Z";

/** Martini / cocktail glass: V-shaped bowl, long thin stem. */
export function MartiniGlass({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("martini");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={BOWL} />
      <Shadow rx={40} />
      <StemAndFoot top={118} stemHalf={2.5} footHalf={34} />
      <Path d={BOWL} fill={url(ids.glass)} />
      <Liquid ids={ids} top={66} />
      <Path d={BOWL} {...glassStroke} />
      <Highlight d="M60 60 L98 102" />
    </GlassFrame>
  );
}
