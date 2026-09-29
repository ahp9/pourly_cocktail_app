import { Cocktail, Ingredient, PreparationMethod } from "@/types/cocktail";

const API_URL = "https://www.thecocktaildb.com/api/json/v1/1";

export async function searchCocktails(name: string) {
  const response = await fetch(
    `${API_URL}/search.php?s=${encodeURIComponent(name)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch cocktails");
  }

  const data = await response.json();

  return data.drinks ?? [];
}

// ------------------------------------
// Convert measurements to ml
// ------------------------------------

function convertToMl(measure: string | null): number | null {
  if (!measure) return null;

  const value = measure.toLowerCase().trim();

  // 1 1/2 oz
  const mixedOz = value.match(/(\d+)\s+(\d+)\/(\d+)\s*oz/);

  if (mixedOz) {
    const whole = Number(mixedOz[1]);
    const numerator = Number(mixedOz[2]);
    const denominator = Number(mixedOz[3]);

    const oz = whole + numerator / denominator;

    return Math.round(oz * 29.5735);
  }

  // 1/2 oz
  const fractionOz = value.match(/(\d+)\/(\d+)\s*oz/);

  if (fractionOz) {
    const numerator = Number(fractionOz[1]);
    const denominator = Number(fractionOz[2]);

    const oz = numerator / denominator;

    return Math.round(oz * 29.5735);
  }

  // 2 oz
  const oz = value.match(/([\d.]+)\s*oz/);

  if (oz) {
    return Math.round(Number(oz[1]) * 29.5735);
  }

  // 4.5 cl
  const cl = value.match(/([\d.]+)\s*cl/);

  if (cl) {
    return Math.round(Number(cl[1]) * 10);
  }

  // already ml
  const ml = value.match(/([\d.]+)\s*ml/);

  if (ml) {
    return Math.round(Number(ml[1]));
  }

  return null;
}

// ------------------------------------
// Determine preparation method
// ------------------------------------

function getMethod(instructions: string | null): PreparationMethod {
  if (!instructions) return "unknown";

  const text = instructions.toLowerCase();

  if (text.includes("shake")) {
    return "shake";
  }

  if (text.includes("stir")) {
    return "stir";
  }

  if (text.includes("blend")) {
    return "blend";
  }

  if (text.includes("muddle")) {
    return "muddle";
  }

  if (text.includes("layer")) {
    return "layer";
  }

  if (text.includes("pour") || text.includes("build")) {
    return "build";
  }

  return "unknown";
}

// ------------------------------------
// Normalize CocktailDB response
// ------------------------------------

export function normalizeCocktailData(cocktail: any): Cocktail {
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}`];

    const measure = cocktail[`strMeasure${i}`];

    if (ingredient) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() ?? null,
        measureMl: convertToMl(measure),
      });
    }
  }

  return {
    id: cocktail.idDrink,

    name: cocktail.strDrink,

    image: cocktail.strDrinkThumb ?? null,

    glass: cocktail.strGlass ?? null,

    category: cocktail.strCategory ?? null,

    alcoholic: cocktail.strAlcoholic === "Alcoholic",

    ingredients,

    method: getMethod(cocktail.strInstructions),

    instructions: cocktail.strInstructions ?? null,
  };
}
