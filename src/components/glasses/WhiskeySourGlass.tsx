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

const BOWL =
  "M68 78 H152 C148 88 146 94 146 104 C146 132 132 150 110 150 C88 150 74 132 74 104 C74 94 72 88 68 78 Z";

/** Sour glass: small stemmed glass with a rounded bowl and flared lip. */
export function WhiskeySourGlass({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("whiskeySour");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={BOWL} />
      <Shadow rx={40} />
      <StemAndFoot top={148} footHalf={34} />
      <Path d={BOWL} fill={url(ids.glass)} />
      <Liquid ids={ids} top={98} />
      <Path d={BOWL} {...glassStroke} />
      <Highlight d="M82 104 C82 124 90 138 100 144" />
    </GlassFrame>
  );
}
