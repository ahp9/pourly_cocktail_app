export type PreparationMethod =
  | "shake"
  | "stir"
  | "build"
  | "blend"
  | "muddle"
  | "layer"
  | "unknown";

export interface Ingredient {
  ingredient: string;
  measure: string | null;
  measureMl: number | null;
}

export interface Cocktail {
  id: string;
  name: string;
  image: string | null;
  glass: string | null;
  category: string | null;
  alcoholic: boolean;

  ingredients: Ingredient[];

  method?: PreparationMethod;
  instructions: string | null;
}
