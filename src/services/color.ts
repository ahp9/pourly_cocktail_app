import { CocktailIngredient } from "@/types/cocktail";

/** How much each kind tints the drink, per ml. 0 = no color at all. */
const KIND_MULTIPLIER: Record<string, number> = {
  spirit: 1.5,
  juice: 1.5,
  liqueur: 1.2,
  syrup: 0.8,
  mixer: 0.6,
  bitters: 0.5,
  garnish: 0,
};

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

const FALLBACK_MULTIPLIER = 1;
const FALLBACK_ML = 15;

function ingredientWeight(ingredient: CocktailIngredient): number {
  const kind = ingredient.kind ?? "";
  const multiplier = KIND_MULTIPLIER[kind] ?? FALLBACK_MULTIPLIER;
  if (multiplier === 0) return 0;

  const ml =
    typeof ingredient.measureMl === "number" && ingredient.measureMl > 0
      ? ingredient.measureMl
      : (DEFAULT_ML[kind] ?? FALLBACK_ML);

  return ml * multiplier;
}

export function blendIngredientColors(
  ingredients: CocktailIngredient[],
): string | undefined {
  let totalWeight = 0;
  let red = 0;
  let green = 0;
  let blue = 0;

  for (const ingredient of ingredients) {
    const { swatch } = ingredient;
    if (typeof swatch !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(swatch)) {
      continue;
    }

    const weight = ingredientWeight(ingredient);
    if (weight <= 0) continue;

    const { r, g, b } = hexToRgb(swatch);
    red += r * weight;
    green += g * weight;
    blue += b * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) {
    return undefined;
  }

  return rgbToHex(
    Math.round(red / totalWeight),
    Math.round(green / totalWeight),
    Math.round(blue / totalWeight),
  );
}

// hexToRgb and rgbToHex stay the same

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}
