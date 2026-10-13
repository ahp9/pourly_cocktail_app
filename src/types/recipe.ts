import type { CocktailIngredient } from "@/types/cocktail";

export type Vessel = "glass" | "shaker" | "mixingGlass";

export type Step =
  | { kind: "prepare"; vessel: Vessel; glass: string; ice: boolean }
  | { kind: "add"; vessel: Vessel; ingredient: CocktailIngredient }
  | { kind: "shake" }
  | { kind: "stir" }
  | { kind: "strain"; glass: string; ice: boolean }
  | { kind: "top"; ingredient: CocktailIngredient }
  | { kind: "garnish"; ingredient: CocktailIngredient }
  | { kind: "done" };
