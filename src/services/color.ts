import { CocktailIngredient } from "@/types/cocktail";

export function blendIngredientColors(
  ingredients: CocktailIngredient[],
): string | undefined {
  const valid = ingredients.filter(
    (ingredient): ingredient is CocktailIngredient & { swatch: string } =>
      typeof ingredient.swatch === "string" &&
      /^#[0-9A-Fa-f]{6}$/.test(ingredient.swatch),
  );

  if (valid.length === 0) {
    return undefined;
  }

  let totalWeight = 0;
  let red = 0;
  let green = 0;
  let blue = 0;

  for (const ingredient of valid) {
    const { r, g, b } = hexToRgb(ingredient.swatch);

    // If no amount is available, treat the ingredient as weight 1.
    const weight =
      typeof ingredient.measureMl === "number" && ingredient.measureMl > 0
        ? ingredient.measureMl
        : 1;

    red += r * weight;
    green += g * weight;
    blue += b * weight;

    totalWeight += weight;
  }

  return rgbToHex(
    Math.round(red / totalWeight),
    Math.round(green / totalWeight),
    Math.round(blue / totalWeight),
  );
}

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
