import { FlavorType, normalizeFlavor } from "@/components/flavors/flavorMapping";
import type { FlavorIconProps } from "@/types/flavors";
import type { ComponentType } from "react";

import { BitterIcon } from "@/components/flavors/BitterIcon";
import { CreamyIcon } from "@/components/flavors/CreamyIcon";
import { FizzyIcon } from "@/components/flavors/FizzyIcon";
import { FruityIcon } from "@/components/flavors/FruityIcon";
import { HerbalIcon } from "@/components/flavors/HerbalIcon";
import { SourIcon } from "@/components/flavors/SourIcon";
import { SweetIcon } from "@/components/flavors/SweetIcon";

export const FLAVOR_COMPONENTS: Record<FlavorType, ComponentType<FlavorIconProps>> = {
  sweet: SweetIcon,
  sour: SourIcon,
  bitter: BitterIcon,
  fruity: FruityIcon,
  herbal: HerbalIcon,
  creamy: CreamyIcon,
  fizzy: FizzyIcon,
};

/** Renders the icon for a flavor key. Returns null for unknown names. */
export function FlavorIcon({
  flavor,
  ...props
}: FlavorIconProps & { flavor: FlavorType | (string & {}) }) {
  const type = normalizeFlavor(flavor);

  if (!type) {
    if (__DEV__) console.warn(`No icon for flavor "${flavor}".`);
    return null;
  }

  const Icon = FLAVOR_COMPONENTS[type];
  return <Icon {...props} />;
}
