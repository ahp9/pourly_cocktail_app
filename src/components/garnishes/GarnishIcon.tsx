import { GarnishType, normalizeGarnish } from "@/components/garnishes/garnishMapping";
import type { GarnishIconProps } from "@/types/garnishes";
import type { ComponentType } from "react";

import { CherryIcon } from "@/components/garnishes/CherryIcon";
import { ChocolateIcon } from "@/components/garnishes/ChocolateIcon";
import { LemonPeelIcon } from "@/components/garnishes/LemonPeelIcon";
import { LimePeelIcon } from "@/components/garnishes/LimePeelIcon";
import { MaraschinoCherryIcon } from "@/components/garnishes/MaraschinoCherryIcon";
import { OliveIcon } from "@/components/garnishes/OliveIcon";
import { OrangePeelIcon } from "@/components/garnishes/OrangePeelIcon";
import { OrangeSpiralIcon } from "@/components/garnishes/OrangeSpiralIcon";
import { WhippedCreamIcon } from "@/components/garnishes/WhippedCreamIcon";

export const GARNISH_COMPONENTS: Record<GarnishType, ComponentType<GarnishIconProps>> = {
  lemonPeel: LemonPeelIcon,
  cherry: CherryIcon,
  maraschinoCherry: MaraschinoCherryIcon,
  orangePeel: OrangePeelIcon,
  whippedCream: WhippedCreamIcon,
  chocolate: ChocolateIcon,
  olive: OliveIcon,
  orangeSpiral: OrangeSpiralIcon,
  limePeel: LimePeelIcon,
};

/** Renders the icon for a garnish key or raw name. Returns null for unknown names. */
export function GarnishIcon({
  garnish,
  ...props
}: GarnishIconProps & { garnish: GarnishType | (string & {}) }) {
  const type = normalizeGarnish(garnish);

  if (!type) {
    if (__DEV__) console.warn(`No icon for garnish "${garnish}". Add it to GARNISH_NAME_MAP.`);
    return null;
  }

  const Icon = GARNISH_COMPONENTS[type];
  return <Icon {...props} />;
}
