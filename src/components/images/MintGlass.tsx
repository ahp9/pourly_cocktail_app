import Svg, {
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

type MintGlassProps = {
  width?: number;
  height?: number;
};

export function MintGlass({ width = 156, height = 170 }: MintGlassProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 220 240"
      accessibilityElementsHidden
    >
      <Defs>
        <LinearGradient id="tnLiquid" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#C9DE94" />
          <Stop offset="1" stopColor="#5B8A3B" />
        </LinearGradient>

        <LinearGradient id="tnGlass" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#F2E6D2" stopOpacity={0.22} />
          <Stop offset="0.5" stopColor="#F2E6D2" stopOpacity={0.04} />
          <Stop offset="1" stopColor="#F2E6D2" stopOpacity={0.16} />
        </LinearGradient>
      </Defs>

      {/* Shadow */}
      <Ellipse cx="110" cy="228" rx="80" ry="8" fill="#000000" opacity={0.4} />

      {/* Glass */}
      <Path
        d="M40 70 H180 L171 214 Q170 224 160 224 H60 Q50 224 49 214 Z"
        fill="url(#tnGlass)"
        stroke="#F2E6D2"
        strokeOpacity={0.35}
        strokeWidth={1.5}
      />

      {/* Liquid */}
      <Path
        d="M44 112 H176 L170 208 Q169 216 160 216 H60 Q51 216 50 208 Z"
        fill="url(#tnLiquid)"
        opacity={0.92}
      />

      {/* Ice cube */}
      <Rect
        x="62"
        y="98"
        width="44"
        height="40"
        rx="8"
        fill="#F2E6D2"
        fillOpacity={0.18}
        stroke="#F2E6D2"
        strokeOpacity={0.4}
        transform="rotate(-10 84 118)"
      />

      {/* Ice cube */}
      <Rect
        x="110"
        y="94"
        width="46"
        height="42"
        rx="8"
        fill="#F2E6D2"
        fillOpacity={0.16}
        stroke="#F2E6D2"
        strokeOpacity={0.4}
        transform="rotate(8 133 115)"
      />

      {/* Ice cube */}
      <Rect
        x="86"
        y="142"
        width="40"
        height="36"
        rx="8"
        fill="#F2E6D2"
        fillOpacity={0.12}
        stroke="#F2E6D2"
        strokeOpacity={0.3}
        transform="rotate(4 106 160)"
      />

      {/* Right mint leaf */}
      <Path
        d="M118 98 C128 60 168 50 180 56 C176 80 150 102 118 98 Z"
        fill="#6F9E48"
      />

      {/* Right mint vein */}
      <Path
        d="M118 98 C138 82 160 66 178 57"
        stroke="#4A742D"
        strokeWidth={1.5}
        fill="none"
      />

      {/* Left mint leaf */}
      <Path
        d="M112 98 C96 66 70 56 60 60 C66 84 88 102 112 98 Z"
        fill="#86B75C"
      />

      {/* Glass highlight */}
      <Path
        d="M56 82 L64 204"
        stroke="#FFFFFF"
        strokeOpacity={0.28}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </Svg>
  );
}
