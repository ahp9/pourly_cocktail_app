import {
  Bubble,
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
  "M88 28 H132 C134 70 132 110 124 128 C120 136 116 140 110 140 C104 140 100 136 96 128 C88 110 86 70 88 28 Z";

const BUBBLES = [
  { cx: 108, cy: 124, r: 1.5 },
  { cx: 112, cy: 108, r: 1.8 },
  { cx: 107, cy: 92, r: 1.4 },
  { cx: 111, cy: 76, r: 2 },
  { cx: 105, cy: 62, r: 1.5 },
  { cx: 118, cy: 96, r: 1.3 },
  { cx: 101, cy: 112, r: 1.4 },
  { cx: 120, cy: 66, r: 1.6 },
];

/** Champagne flute: tall narrow bowl, long stem, rising bubbles. */
export function ChampagneFlute({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  color = DEFAULT_LIQUID,
}: GlassProps) {
  const ids = useGlassIds("champagne");

  return (
    <GlassFrame width={width} height={height}>
      <GlassDefs ids={ids} color={color} cavity={BOWL} />
      <Shadow rx={36} />
      <StemAndFoot top={138} stemHalf={2.5} footHalf={30} />
      <Path d={BOWL} fill={url(ids.glass)} />
      <Liquid ids={ids} top={48}>
        {BUBBLES.map((b) => (
          <Bubble key={`${b.cx}-${b.cy}`} cx={b.cx} cy={b.cy} r={b.r} />
        ))}
      </Liquid>
      <Path d={BOWL} {...glassStroke} />
      <Highlight d="M93 40 C92 70 94 100 100 124" />
    </GlassFrame>
  );
}
