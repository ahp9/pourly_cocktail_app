// Works out a cocktail's flavour profile from its recipe.
//
// Each ingredient has 0..1 scores for the taste dimensions. A cocktail's
// score is the average of its ingredients, weighted by volume x intensity.
// Strength comes from the alcohol content after dilution.

import { parseMeasure } from "./measure";

export const DIMENSIONS = [
  "sweet",
  "sour",
  "bitter",
  "fruity",
  "herbal",
  "creamy",
  "fizzy",
] as const;
export type Dimension = (typeof DIMENSIONS)[number];

export type Kind =
  | "spirit"
  | "liqueur"
  | "wine"
  | "bitters"
  | "mixer"
  | "juice"
  | "syrup"
  | "dairy"
  | "fresh"
  | "garnish"
  | "pantry"
  | "other";

export type Availability = "bar" | "grocery" | "pantry" | "garnish";

// Mirrors the `ingredients` table.
export type IngredientRow = {
  key: string;
  display_name: string;
  kind: Kind;
  availability: Availability;
  bar_keys: string[];
  abv: number;
  intensity: number;
  unit_ml: number | null;
  reviewed: boolean;
} & Record<Dimension, number>;

export type RecipeLine = { ingredient: string; measure: string | null };

export type CocktailFlavor = Record<Dimension, number> & {
  strong: number;
  abv: number;
  total_ml: number;
};

// Volume used when the measure is empty or unreadable.
const DEFAULT_ML: Record<Kind, number> = {
  spirit: 45,
  liqueur: 20,
  wine: 90,
  bitters: 1,
  mixer: 90,
  juice: 30,
  syrup: 15,
  dairy: 30,
  fresh: 10,
  garnish: 0,
  pantry: 0,
  other: 15,
};

// Water added by ice while mixing. Rough bartending rule of thumb.
const DILUTION: Record<string, number> = {
  shake: 1.25,
  stir: 1.2,
  blend: 1.4,
  muddle: 1.15,
  build: 1.1,
  layer: 1.0,
  unknown: 1.15,
};

// ABV at which a drink counts as fully "strong" (a Negroni is ~24%).
const STRONG_AT_ABV = 25;

export function lineMl(
  line: RecipeLine,
  ing: IngredientRow | undefined,
): number {
  const kind = ing?.kind ?? "other";
  if (kind === "garnish") return 0;

  const m = parseMeasure(line.measure);
  if (m.garnish) return 0;
  // Pantry items only count when the recipe gives an amount ("2 tsp sugar").
  // Ice, salt rims etc. usually have no measure and add nothing.
  if (kind === "pantry" && m.ml === null) return 0;
  // Ice, water, salt: no flavour, and "1 cup ice" shouldn't dilute the average.
  if (kind === "pantry" && ing && DIMENSIONS.every((d) => !ing[d])) return 0;
  if (m.ml !== null) return m.ml;
  if (m.count !== null && ing?.unit_ml)
    return Math.min(m.count, 12) * ing.unit_ml;
  return DEFAULT_ML[kind];
}

export function computeFlavor(
  lines: RecipeLine[],
  ingredients: Map<string, IngredientRow>,
  method: string | null,
): CocktailFlavor {
  const sums = Object.fromEntries(DIMENSIONS.map((d) => [d, 0])) as Record<
    Dimension,
    number
  >;
  let weightSum = 0;
  let totalMl = 0;
  let alcoholMl = 0;

  for (const line of lines) {
    const ing = ingredients.get(normalizeKey(line.ingredient));
    const ml = lineMl(line, ing);
    if (ml <= 0) continue;

    totalMl += ml;
    alcoholMl += ml * ((ing?.abv ?? 0) / 100);

    // Unknown ingredients still add volume (they dilute), but no flavour.
    if (!ing) continue;
    const w = ml * (ing.intensity || 1);
    weightSum += w;
    for (const d of DIMENSIONS) sums[d] += w * (ing[d] ?? 0);
  }

  const flavor = {} as Record<Dimension, number>;
  for (const d of DIMENSIONS)
    flavor[d] = weightSum > 0 ? r3(sums[d] / weightSum) : 0;

  const diluted = totalMl * (DILUTION[method ?? "unknown"] ?? 1.15);
  const abv = diluted > 0 ? (alcoholMl / diluted) * 100 : 0;

  return {
    ...flavor,
    strong: r3(Math.min(1, abv / STRONG_AT_ABV)),
    abv: Math.round(abv * 10) / 10,
    total_ml: Math.round(totalMl),
  };
}

export function normalizeKey(name: string) {
  return name.trim().toLowerCase();
}

function r3(n: number) {
  return Math.round(n * 1000) / 1000;
}
