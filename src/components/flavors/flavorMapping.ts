import type { Flavor } from "@/types/flavors";

export const FLAVOR_TYPES = [
  "sweet",
  "sour",
  "bitter",
  "fruity",
  "herbal",
  "creamy",
  "fizzy",
] as const satisfies readonly (keyof Flavor)[];

export type FlavorType = (typeof FLAVOR_TYPES)[number];

// Fails to compile if a key is added to Flavor but not to FLAVOR_TYPES.
type MissingFlavors = Exclude<keyof Flavor, FlavorType>;
const _allFlavorsCovered: MissingFlavors extends never ? true : MissingFlavors = true;
void _allFlavorsCovered;

export const FLAVOR_LABELS: Readonly<Record<FlavorType, string>> = {
  sweet: "Sweet",
  sour: "Sour",
  bitter: "Bitter",
  fruity: "Fruity",
  herbal: "Herbal",
  creamy: "Creamy",
  fizzy: "Fizzy",
};

export function isFlavorType(value: string): value is FlavorType {
  return (FLAVOR_TYPES as readonly string[]).includes(value);
}

/** Maps any casing ("Sweet", " FIZZY ") to a FlavorType. Returns undefined for unknown names. */
export function normalizeFlavor(flavor: string): FlavorType | undefined {
  const key = flavor.toLowerCase().trim();
  return isFlavorType(key) ? key : undefined;
}
