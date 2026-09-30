import { View } from "react-native";

import { spacing } from "@/styles";

export function Grid({ children }: { children: React.ReactNode[] }) {
  const rows: React.ReactNode[][] = [];
  for (let i = 0; i < children.length; i += 2)
    rows.push(children.slice(i, i + 2));
  return (
    <View style={{ gap: spacing.sp8 }}>
      {rows.map((row, i) => (
        <View key={i} style={{ flexDirection: "row", gap: spacing.sp8 }}>
          {row.map((child, j) => (
            <View key={j} style={{ flex: 1 }}>
              {child}
            </View>
          ))}
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </View>
  );
}
