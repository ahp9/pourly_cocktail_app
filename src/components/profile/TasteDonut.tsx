import { AppText } from "@/components/primitivies/AppText";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

export type Slice = {
  key: string;
  label: string;
  value: number;
  color: string;
};

type Props = {
  slices: Slice[];
  size?: number;
  thickness?: number;
  centerTop?: string;
  centerLabel?: string;
};

const GAP_PX = 2;

export function TasteDonut({
  slices,
  size = 200,
  thickness = 28,
  centerTop,
  centerLabel,
}: Props) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const c = size / 2;
  const outer = c;
  const inner = c - thickness;
  const mid = (outer + inner) / 2;

  let start = 0;
  const arcs = slices.map((s) => {
    const sweep = (s.value / total) * Math.PI * 2;
    const arc = { ...s, start, end: start + sweep };
    start += sweep;
    return arc;
  });

  // Read out for screen readers, since the ring is only shapes.
  const description = slices
    .map((s) => `${s.label} ${Math.round((s.value / total) * 100)} percent`)
    .join(", ");

  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Taste profile: ${description}`}
    >
      <Svg width={size} height={size}>
        {arcs.length === 1 ? (
          <Circle
            cx={c}
            cy={c}
            r={mid}
            stroke={arcs[0].color}
            strokeWidth={thickness}
            fill="none"
          />
        ) : (
          arcs.map((a) => (
            <Path
              key={a.key}
              d={ringSlice(c, outer, inner, a.start, a.end)}
              fill={a.color}
            />
          ))
        )}
      </Svg>

      {centerLabel ? (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          {centerTop ? (
            <AppText variant="caption" color="muted">
              {centerTop}
            </AppText>
          ) : null}
          <AppText variant="title" align="center" numberOfLines={1}>
            {centerLabel}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

function ringSlice(
  c: number,
  outer: number,
  inner: number,
  start: number,
  end: number,
) {
  const trimOuter = GAP_PX / 2 / outer;
  const trimInner = GAP_PX / 2 / inner;
  const s0 = start + trimOuter;
  const e0 = end - trimOuter;
  const s1 = start + trimInner;
  const e1 = end - trimInner;
  const large = e0 - s0 > Math.PI ? 1 : 0;

  const pt = (r: number, a: number) =>
    `${c + r * Math.sin(a)} ${c - r * Math.cos(a)}`;

  return [
    `M ${pt(outer, s0)}`,
    `A ${outer} ${outer} 0 ${large} 1 ${pt(outer, e0)}`,
    `L ${pt(inner, e1)}`,
    `A ${inner} ${inner} 0 ${large} 0 ${pt(inner, s1)}`,
    "Z",
  ].join(" ");
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
});
