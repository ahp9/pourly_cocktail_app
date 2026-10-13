import { colors } from "@/styles";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

type IconProps = { size?: number; fill?: string };

const line = {
  stroke: colors.cream,
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

export function ShakerIcon({ size = 160, fill }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {fill && <Path d="M22 34 h20 l-2 24 h-16 z" fill={fill} opacity={0.85} />}
      <Rect x={27} y={4} width={10} height={6} rx={2} {...line} />
      <Path d="M24 10 h16 l3 10 h-22 z" {...line} />
      <Path d="M20 22 h24 l-3 36 h-18 z" {...line} />
    </Svg>
  );
}

export function MixingGlassIcon({ size = 160, fill }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {fill && <Path d="M18 34 h28 l-2 24 h-24 z" fill={fill} opacity={0.85} />}
      <Path d="M16 16 h32 l-3 42 h-26 z" {...line} />
      {/* Bar spoon */}
      <Line x1={42} y1={4} x2={30} y2={50} {...line} />
      <Circle cx={42} cy={4} r={2} {...line} />
    </Svg>
  );
}

export function IceIcon({ size = 72 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect
        x={10}
        y={26}
        width={22}
        height={22}
        rx={4}
        transform="rotate(-12 21 37)"
        {...line}
      />
      <Rect
        x={32}
        y={18}
        width={22}
        height={22}
        rx={4}
        transform="rotate(10 43 29)"
        {...line}
      />
      <Line x1={15} y1={32} x2={19} y2={31} {...line} />
      <Line x1={38} y1={23} x2={42} y2={24} {...line} />
    </Svg>
  );
}

export function LimeWheelIcon({ size = 140 }: IconProps) {
  const spokes = [0, 45, 90, 135];
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Circle cx={32} cy={32} r={24} fill={colors.drink.basil} opacity={0.25} />
      <Circle cx={32} cy={32} r={24} {...line} />
      <Circle cx={32} cy={32} r={19} {...line} />
      {spokes.map((deg) => (
        <Line
          key={deg}
          x1={32}
          y1={14}
          x2={32}
          y2={50}
          transform={`rotate(${deg} 32 32)`}
          {...line}
        />
      ))}
    </Svg>
  );
}
