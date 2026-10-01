export const GLASS_TYPES = [
  "whiskey",
  "copperMug",
  "beerMug",
  "pint",
  "pilsner",
  "irishCoffee",
  "coupe",
  "wine",
  "whiskeySour",
  "balloon",
  "margarita",
  "highball",
  "pitcher",
  "hurricane",
  "coffeeMug",
  "masonJar",
  "champagne",
  "martini",
  "shot",
  "cordial",
  "punchBowl",
] as const;

export type GlassType = (typeof GLASS_TYPES)[number];

/** Raw database names, lowercased. One entry per distinct name after lowercasing. */
const GLASS_NAME_MAP: Readonly<Record<string, GlassType>> = {
  "whiskey glass": "whiskey",
  "old-fashioned glass": "whiskey",

  "copper mug": "copperMug",

  "beer mug": "beerMug",

  "beer glass": "pint",
  "pint glass": "pint",

  "beer pilsner": "pilsner",

  "irish coffee cup": "irishCoffee",

  "coupe glass": "coupe",
  "nick and nora glass": "coupe",

  "wine glass": "wine",
  "white wine glass": "wine",

  "whiskey sour glass": "whiskeySour",

  "balloon glass": "balloon",
  "brandy snifter": "balloon",

  "margarita glass": "margarita",
  "margarita/coupette glass": "margarita",

  "highball glass": "highball",
  "collins glass": "highball",

  pitcher: "pitcher",

  "hurricane glass": "hurricane",

  "coffee mug": "coffeeMug",

  "mason jar": "masonJar",
  jar: "masonJar",

  "champagne flute": "champagne",

  "martini glass": "martini",
  "cocktail glass": "martini",

  "shot glass": "shot",

  "cordial glass": "cordial",
  "pousse cafe glass": "cordial",

  "punch bowl": "punchBowl",
};

export function isGlassType(value: string): value is GlassType {
  return (GLASS_TYPES as readonly string[]).includes(value);
}

/**
 * Maps a raw database glass name (any casing) to a GlassType.
 * Also accepts a GlassType key as-is. Returns undefined for unknown names.
 */
export function normalizeGlass(glass: string): GlassType | undefined {
  if (isGlassType(glass)) return glass;

  const key = glass.toLowerCase().trim().replace(/\s+/g, " ");
  return Object.prototype.hasOwnProperty.call(GLASS_NAME_MAP, key)
    ? GLASS_NAME_MAP[key]
    : undefined;
}
