import {
  DEFAULT_SIZE,
  GarnishFrame,
  Highlight,
  url,
  useGarnishIds,
} from "@/components/garnishes/parts";
import type { GarnishIconProps } from "@/types/garnishes";
import { Circle, Defs, Path, RadialGradient, Stop } from "react-native-svg";

/** Maraschino cherry: bright glossy red, long bare stem. */
export function MaraschinoCherryIcon({ size = DEFAULT_SIZE }: GarnishIconProps) {
  const ids = useGarnishIds("maraschino");

  return (
    <GarnishFrame size={size}>
      <Defs>
        <RadialGradient id={ids.gradient} cx="0.35" cy="0.3" r="0.8">
          <Stop offset="0" stopColor="#FF6B7A" />
          <Stop offset="0.55" stopColor="#E3143A" />
          <Stop offset="1" stopColor="#A10A26" />
        </RadialGradient>
      </Defs>
      <Path
        d="M32 32 Q30 16 44 4"
        stroke="#8A6A3A"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx={32} cy={44} r={15} fill={url(ids.gradient)} />
      <Highlight d="M22 40 A11 11 0 0 1 28 33" opacity={0.75} width={3} />
      <Circle cx={38} cy={52} r={1.5} fill="#FFFFFF" fillOpacity={0.5} />
    </GarnishFrame>
  );
}
