import {
  DEFAULT_SIZE,
  FlavorFrame,
  url,
  useFlavorIds,
} from "@/components/flavors/parts";
import type { FlavorIconProps } from "@/types/flavors";
import { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

const LABEL_LINE = "#9C8A6E";

/** Bitter: a bottle of cocktail bitters. */
export function BitterIcon({ size = DEFAULT_SIZE }: FlavorIconProps) {
  const ids = useFlavorIds("bitter");

  return (
    <FlavorFrame size={size}>
      <Defs>
        <LinearGradient id={ids.gradient} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#A2531C" />
          <Stop offset="0.6" stopColor="#7A3B12" />
          <Stop offset="1" stopColor="#5A2A0C" />
        </LinearGradient>
      </Defs>
      {/* Cap */}
      <Rect x={29} y={2} width={6} height={5} rx={1.5} fill="#3A3A3A" />
      <Rect x={25} y={6} width={14} height={8} rx={2} fill="#2B2B2B" />
      {/* Neck and body */}
      <Rect x={27} y={13} width={10} height={11} fill={url(ids.gradient)} />
      <Rect x={17} y={22} width={30} height={38} rx={10} fill={url(ids.gradient)} />
      {/* Label */}
      <Rect x={19} y={33} width={26} height={17} rx={2} fill="#F3E7CF" />
      <Rect x={23} y={37} width={18} height={2.5} rx={1.25} fill="#B5462A" />
      <Rect x={25} y={42} width={14} height={1.5} rx={0.75} fill={LABEL_LINE} />
      <Rect x={27} y={45.5} width={10} height={1.5} rx={0.75} fill={LABEL_LINE} />
      {/* Shine */}
      <Rect x={21} y={26} width={3} height={5} rx={1.5} fill="#FFFFFF" fillOpacity={0.3} />
      <Rect x={21} y={52} width={3} height={5} rx={1.5} fill="#FFFFFF" fillOpacity={0.3} />
    </FlavorFrame>
  );
}
