export type BarCategory = "spirits" | "liqueurs" | "mixers" | "fresh";

// What recipe matching cares about. `name` is the CocktailDB ingredient name.
export type Ingredient = {
  name: string; // "Baileys irish cream"
  label: string; // "Irish cream" (shown in My Bar)
  category: BarCategory;
  swatch: string; // colour of the little bottle swatch in My Bar
};

export type ProductSource = "pourly" | "openfoodfacts" | "label" | "manual";

// One physical bottle / SKU.
export type Product = {
  barcode?: string;
  brand?: string;
  productName: string; // "Baileys Original Irish Cream"
  alcoholType?: string; // "Irish cream liqueur"
  ingredient: Ingredient | null;
  abv?: number;
  volumeMl?: number;
  imageUrl?: string;
  source: ProductSource;
};
