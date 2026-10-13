import {
  DEFAULT_SIZE,
  GarnishFrame,
  url,
  useGarnishIds,
} from "@/components/garnishes/parts";
import type { GarnishIconProps } from "@/types/garnishes";
import {
  Circle,
  Defs,
  Ellipse,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";

/** Cherry: a dark fresh cherry with a stem and leaf. */
export function CherryIcon({ size = DEFAULT_SIZE }: GarnishIconProps) {
  const ids = useGarnishIds("cherry");

  return (
    <GarnishFrame size={size}>
      <Defs>
        <RadialGradient id={ids.gradient} cx="0.35" cy="0.35" r="0.75">
          <Stop offset="0" stopColor="#C8303E" />
          <Stop offset="1" stopColor="#6E0B1E" />
        </RadialGradient>
      </Defs>
      <Path
        d="M32 30 Q32 18 40 8"
        stroke="#5B7A2B"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
      <Path d="M39 10 Q48 2 56 8 Q48 16 39 10 Z" fill="#6FA83A" />
      <Path d="M40 10 Q48 8 54 8" stroke="#4E7F25" strokeWidth={1} fill="none" />
      <Circle cx={32} cy={42} r={16} fill={url(ids.gradient)} />
      <Path
        d="M28 28 Q32 31 36 28"
        stroke="#4A0714"
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
      />
      <Ellipse
        cx={26}
        cy={36}
        rx={3.5}
        ry={5}
        fill="#FFFFFF"
        fillOpacity={0.4}
        transform="rotate(-30 26 36)"
      />
    </GarnishFrame>
  );
}
