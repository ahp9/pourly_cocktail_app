import { supabase } from "@/services/supabase";
import type {
  Availability,
  Cocktail,
  CocktailIngredient,
  Flavor,
  PreparationMethod,
} from "@/types/cocktail";

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
  const ingredients: CocktailIngredient[] = [];

  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}`];

    const measure = cocktail[`strMeasure${i}`];

    if (ingredient) {
      ingredients.push({
        key: ingredient.trim().toLowerCase(),
        name: ingredient.trim(),
        measure: measure?.trim() || null,
        measureMl: convertToMl(measure),
        position: i,
        // Not looked up: these drinks come straight from TheCocktailDB.
        kind: null,
        availability: null,
        barKeys: [],
        abv: null,
        swatch: null,
        flavor: null,
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

// ------------------------------------
// Cocktails from Supabase, with their ingredients
//
// 1. Get the cocktail(s) from `cocktails`.
// 2. Get their recipe lines from `cocktail_ingredients`.
// 3. Look up those lines' ingredient_key in `ingredients`. Lines whose
//    ingredient isn't in the table still show, just without the details.
// ------------------------------------

type CocktailRow = Omit<Cocktail, "ingredients" | "method"> & {
  method: PreparationMethod | null;
};

type LineRow = {
  cocktail_id: string;
  ingredient: string;
  ingredient_key: string | null;
  measure: string | null;
  measure_ml: number | null;
  position: number;
};

type IngredientRow = Flavor & {
  key: string;
  kind: string;
  availability: Availability;
  bar_keys: string[];
  abv: number;
  swatch: string | null;
};

const COCKTAIL_COLUMNS =
  "id, name, image, glass, category, alcoholic, method, instructions";

// One cocktail with its ingredients.
export async function getCocktail(id: string): Promise<Cocktail> {
  const { data, error } = await supabase
    .from("cocktails")
    .select(COCKTAIL_COLUMNS)
    .eq("id", id)
    .single();
  if (error) throw error;

  const [cocktail] = await addIngredients([data as CocktailRow]);
  return cocktail;
}

// `count` random cocktails with their ingredients.
export async function getRandomCocktails(count: number): Promise<Cocktail[]> {
  const { data, error } = await supabase.rpc("random_cocktails", { n: count });
  if (error) throw error;

  return addIngredients((data ?? []) as CocktailRow[]);
}

// Steps 2 and 3 for cocktails you already have.
export async function addIngredients(
  cocktails: CocktailRow[],
): Promise<Cocktail[]> {
  if (cocktails.length === 0) return [];

  // 2. Recipe lines for these cocktails
  const { data: lineData, error: linesError } = await supabase
    .from("cocktail_ingredients")
    .select(
      "cocktail_id, ingredient, ingredient_key, measure, measure_ml, position",
    )
    .in(
      "cocktail_id",
      cocktails.map((c) => c.id),
    )
    .order("position");
  if (linesError) throw linesError;
  const lines = (lineData ?? []) as LineRow[];

  // 3. The ingredients those lines use, if they're in the table
  const keys = [
    ...new Set(lines.map((l) => l.ingredient_key).filter((k) => k !== null)),
  ];
  const { data: ingredientData, error: ingredientsError } = await supabase
    .from("ingredients")
    .select(
      "key, kind, availability, bar_keys, abv, swatch, sweet, sour, bitter, fruity, herbal, creamy, fizzy",
    )
    .in("key", keys);
  if (ingredientsError) throw ingredientsError;
  const byKey = new Map(
    ((ingredientData ?? []) as IngredientRow[]).map((i) => [i.key, i]),
  );

  // Put each line on its cocktail
  return cocktails.map(({ method, ...cocktail }) => ({
    ...cocktail,
    method: method ?? undefined,
    ingredients: lines
      .filter((l) => l.cocktail_id === cocktail.id)
      .map((l): CocktailIngredient => {
        const found = l.ingredient_key ? byKey.get(l.ingredient_key) : null;
        return {
          key: l.ingredient_key,
          name: l.ingredient,
          measure: l.measure,
          measureMl: l.measure_ml,
          position: l.position,
          kind: found?.kind ?? null,
          availability: found?.availability ?? null,
          barKeys: found?.bar_keys ?? [],
          abv: found?.abv ?? null,
          swatch: found?.swatch ?? null,
          flavor: found
            ? {
                sweet: found.sweet,
                sour: found.sour,
                bitter: found.bitter,
                fruity: found.fruity,
                herbal: found.herbal,
                creamy: found.creamy,
                fizzy: found.fizzy,
              }
            : null,
        };
      }),
  }));
}
