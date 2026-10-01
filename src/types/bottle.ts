// Shelves in My Bar. Fixed in code: each one is a section on screen.
// Spirits, liqueurs and wine contain alcohol; the rest don't.
export type BarCategory =
  | "spirits"
  | "liqueurs"
  | "wine" // prosecco, champagne, vermouth, Lillet
  | "mixers" // sodas, syrups, bitters
  | "juices" // orange juice, lime juice
  | "fresh"; // whole fruit and herbs: orange, lime, mint

export const BAR_CATEGORIES: { key: BarCategory; title: string }[] = [
  { key: "spirits", title: "Spirits" },
  { key: "liqueurs", title: "Liqueurs" },
  { key: "wine", title: "Wine & vermouth" },
  { key: "mixers", title: "Mixers" },
  { key: "juices", title: "Juices" },
  { key: "fresh", title: "Fresh" },
];

export const ALCOHOLIC_CATEGORIES: readonly BarCategory[] = [
  "spirits",
  "liqueurs",
  "wine",
];

export const isAlcoholic = (category: BarCategory) =>
  ALCOHOLIC_CATEGORIES.includes(category);

// What kind of alcohol a bottle is: a key in the `alcohol_types` table
// ("whiskey", "orange_liqueur"). New types are new rows, not code changes.
export type AlcoholType = string;

export type AlcoholTypeOption = {
  key: AlcoholType;
  label: string; // "Orange liqueur"
  category: BarCategory; // the shelf this type belongs on
};

// Something you can have in your bar. Built-in ones ship with the app;
// people can add their own, which are stored in the `ingredients` table.
// `key` is the lower-cased name: the primary key of `ingredients` and the
// value stored in bar_items.ingredient_key.
export type Ingredient = {
  key: string; // "baileys irish cream"
  name: string; // "Baileys irish cream" (the CocktailDB name)
  label: string; // "Irish cream" (shown in My Bar)
  category: BarCategory;
  alcoholType?: AlcoholType; // only for spirits, liqueurs and wine
  swatch: string; // colour of the little bottle swatch in My Bar
  custom?: boolean; // added by a user, not part of the built-in list
};

export type ProductSource = "pourly" | "openfoodfacts" | "label" | "manual";

// One physical bottle / SKU. The type of alcohol comes from `ingredient`.
export type Product = {
  barcode?: string;
  brand?: string;
  productName: string; // "Baileys Original Irish Cream"
  ingredient: Ingredient | null;
  abv?: number;
  volumeMl?: number;
  imageUrl?: string;
  source: ProductSource;
};
