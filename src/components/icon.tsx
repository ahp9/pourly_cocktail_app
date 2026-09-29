// components/Icon.tsx
import { icon } from "@/styles";
import Svg, { SvgProps } from "react-native-svg";

export function Icon({
  color,
  size = icon.size,
  children,
  ...rest
}: SvgProps & { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={icon.strokeWidth}
      strokeLinecap={icon.strokeLinecap}
      strokeLinejoin={icon.strokeLinejoin}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      {...rest}
    >
      {children}
    </Svg>
  );
}
