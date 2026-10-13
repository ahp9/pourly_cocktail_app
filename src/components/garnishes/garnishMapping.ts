export const GARNISH_TYPES = [
  "lemonPeel",
  "cherry",
  "maraschinoCherry",
  "orangePeel",
  "whippedCream",
  "chocolate",
  "olive",
  "orangeSpiral",
  "limePeel",
] as const;

export type GarnishType = (typeof GARNISH_TYPES)[number];

/** Raw database keys, lowercased. One entry per distinct key after lowercasing. */
const GARNISH_NAME_MAP: Readonly<Record<string, GarnishType>> = {
  "lemon peel": "lemonPeel",
  cherry: "cherry",
  "maraschino cherry": "maraschinoCherry",
  "orange peel": "orangePeel",
  "whipped cream": "whippedCream",
  chocolate: "chocolate",
  olive: "olive",
  "orange spiral": "orangeSpiral",
  "lime peel": "limePeel",
};

export function isGarnishType(value: string): value is GarnishType {
  return (GARNISH_TYPES as readonly string[]).includes(value);
}

/**
 * Maps a raw database garnish key (any casing) to a GarnishType.
 * Also accepts a GarnishType key as-is. Returns undefined for unknown names.
 */
export function normalizeGarnish(garnish: string): GarnishType | undefined {
  if (isGarnishType(garnish)) return garnish;

  const key = garnish.toLowerCase().trim().replace(/\s+/g, " ");
  return Object.prototype.hasOwnProperty.call(GARNISH_NAME_MAP, key)
    ? GARNISH_NAME_MAP[key]
    : undefined;
}
