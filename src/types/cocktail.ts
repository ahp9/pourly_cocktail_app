export type PreparationMethod =
  | "shake"
  | "stir"
  | "build"
  | "blend"
  | "muddle"
  | "layer"
  | "unknown";

// Mirrors ingredients.availability.
export type Availability = "bar" | "grocery" | "pantry" | "garnish";

// One line of a recipe: "1 1/2 oz Gin".
// Named CocktailIngredient so it doesn't clash with Ingredient in
// types/bottle.ts (something you have in your bar).
export interface CocktailIngredient {
  key: string | null; // ingredients.key, "gin"
  name: string; // "Gin"
  measure: string | null; // "1 1/2 oz"
  measureMl: number | null; // 44
  position: number;

  // From the linked `ingredients` row. Null when the recipe uses something
  // the table doesn't know, or for drinks straight from TheCocktailDB.
  kind: string | null; // "spirit", "juice", "garnish"
  availability: Availability | null;
  barKeys: string[]; // bar ingredient keys that count as this one
  abv: number | null;
  swatch: string | null; // only set for things you can have in your bar
  flavor: Flavor | null;
}

// 0..1 per taste, from the `ingredients` table.
export type Flavor = {
  sweet: number;
  sour: number;
  bitter: number;
  fruity: number;
  herbal: number;
  creamy: number;
  fizzy: number;
};

export type Taste = keyof Flavor;

// Order and wording for flavour UI.
export const TASTES: { key: Taste; label: string }[] = [
  { key: "sweet", label: "Sweet" },
  { key: "sour", label: "Sour" },
  { key: "bitter", label: "Bitter" },
  { key: "fruity", label: "Fruity" },
  { key: "herbal", label: "Herbal" },
  { key: "creamy", label: "Creamy" },
  { key: "fizzy", label: "Fizzy" },
];

export const EMPTY_FLAVOR: Flavor = {
  sweet: 0,
  sour: 0,
  bitter: 0,
  fruity: 0,
  herbal: 0,
  creamy: 0,
  fizzy: 0,
};

// All zeros means nobody has scored it yet.
export const hasFlavor = (f: Flavor | null | undefined): f is Flavor =>
  !!f && TASTES.some((t) => f[t.key] > 0);

export interface Cocktail {
  id: string;
  name: string;
  image: string | null;
  glass: string | null;
  category: string | null;
  alcoholic: boolean;

  ingredients: CocktailIngredient[];

  method?: PreparationMethod;
  instructions: string | null;
}
