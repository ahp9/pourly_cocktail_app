import type { Taste } from "@/types/cocktail";

export const TASTE_COLORS: Record<Taste, string> = {
  sweet: "#E07B9A",
  sour: "#E5C24F",
  bitter: "#AA8BD4",
  fruity: "#EB7848",
  herbal: "#8FBE72",
  creamy: "#E2C99A",
  fizzy: "#79B8AA",
};

import {
  EMPTY_FLAVOR,
  hasFlavor,
  TASTES,
  type CocktailIngredient,
  type Flavor,
} from "@/types/cocktail";

/** Typical ml for a kind, used when the recipe has no measureMl. */
const DEFAULT_ML: Record<string, number> = {
  spirit: 45,
  juice: 25,
  liqueur: 20,
  syrup: 15,
  mixer: 60,
  bitters: 1,
  garnish: 0,
};
const FALLBACK_ML = 15;

/**
 * How strongly a kind tastes per ml. Bitters and garnishes are tiny by
 * volume but you still taste them, so they get a boost.
 */
const INTENSITY: Record<string, number> = {
  bitters: 15,
  garnish: 1,
};

function weight(ingredient: CocktailIngredient): number {
  const kind = ingredient.kind ?? "";

  // A garnish has no volume, so give it a small fixed weight instead.
  if (kind === "garnish") return 8 * (INTENSITY.garnish ?? 1);

  const ml =
    ingredient.measureMl && ingredient.measureMl > 0
      ? ingredient.measureMl
      : (DEFAULT_ML[kind] ?? FALLBACK_ML);

  return ml * (INTENSITY[kind] ?? 1);
}

/**
 * The drink's flavour, 0..1 per taste: a weighted average of its
 * ingredients. Ingredients nobody has scored yet are skipped.
 * Returns null when none of them have a flavour.
 */
export function cocktailFlavor(
  ingredients: CocktailIngredient[],
): Flavor | null {
  const total: Flavor = { ...EMPTY_FLAVOR };
  let totalWeight = 0;

  for (const ingredient of ingredients) {
    if (!hasFlavor(ingredient.flavor)) continue;

    const w = weight(ingredient);
    if (w <= 0) continue;

    for (const { key } of TASTES) {
      total[key] += ingredient.flavor[key] * w;
    }
    totalWeight += w;
  }

  if (totalWeight === 0) return null;

  for (const { key } of TASTES) {
    total[key] = total[key] / totalWeight;
  }
  return total;
}

/** 0..1 to a number of dots, for the taste row. */
export const toDots = (value: number, max = 5) =>
  Math.round(Math.min(1, Math.max(0, value)) * max);
