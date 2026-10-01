import { DEFAULT_SWATCH } from "@/data/ingredients";
import { ingredientByKey } from "@/services/catalog";
import { supabase } from "@/services/supabase";
import {
  isAlcoholic,
  type AlcoholType,
  type BarCategory,
  type Product,
} from "@/types/bottle";

export async function addToBar(
  userId: string,
  product: Product,
): Promise<void> {
  const { ingredient } = product;
  if (!ingredient) {
    throw new Error("Pick what this bottle counts as first.");
  }

  if (!supabase) return;

  // ABV only means something for spirits, liqueurs and wine. The database
  // clears it for anything else too (see the bar_items trigger).
  const abv = isAlcoholic(ingredient.category) ? (product.abv ?? null) : null;

  // One row per ingredient per user: adding a second gin replaces the first.
  const { error } = await supabase.from("bar_items").upsert(
    {
      user_id: userId,
      ingredient_key: ingredient.key,
      quantity: 1,
      product_name: product.productName,
      brand: product.brand ?? null,
      barcode: product.barcode ?? null,
      abv,
      volume_ml: product.volumeMl ?? null,
    },
    { onConflict: "user_id,ingredient_key" },
  );

  if (error) {
    console.error("Supabase addToBar error:", error);
    throw new Error("Couldn't add it to your bar. Try again.");
  }
}

// One bottle in the user's bar. `label`, `swatch`, `category` and
// `alcohol_type` come from the linked `ingredients` row, so ingredients
// people added show up the same way as built-in ones.
export type BarItem = {
  id: string;
  ingredient_key: string;
  label: string;
  swatch: string;
  category: BarCategory | null;
  alcohol_type: AlcoholType | null;

  quantity: number | null;

  product_name: string | null;
  brand: string | null;
  barcode: string | null;
  abv: number | null; // this bottle's ABV, or the typical one if unknown
  volume_ml: number | null;
};

type BarItemRow = {
  id: string;
  ingredient_key: string;
  quantity: number | null;
  product_name: string | null;
  brand: string | null;
  barcode: string | null;
  abv: number | null;
  volume_ml: number | null;
  ingredient: {
    display_name: string;
    bar_label: string | null;
    bar_category: BarCategory | null;
    alcohol_type: AlcoholType | null;
    swatch: string | null;
    abv: number | null;
  } | null;
};

export async function getBarItems(userId: string): Promise<BarItem[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("bar_items")
    .select(
      `
      id,
      ingredient_key,
      quantity,
      product_name,
      brand,
      barcode,
      abv,
      volume_ml,
      ingredient:ingredients (
        display_name, bar_label, bar_category, alcohol_type, swatch, abv
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at")
    .returns<BarItemRow[]>();

  if (error) {
    console.error("Supabase getBarItems error:", error);
    throw new Error("Couldn't load your bar.");
  }

  return (data ?? []).map(({ ingredient, ...row }) => {
    // Fall back to the app's list if the row has no shelf yet.
    const local = ingredientByKey(row.ingredient_key);
    const category = ingredient?.bar_category ?? local?.category ?? null;
    const alcoholic = category ? isAlcoholic(category) : false;

    return {
      ...row,
      label:
        ingredient?.bar_label ??
        local?.label ??
        ingredient?.display_name ??
        row.ingredient_key,
      swatch:
        ingredient?.swatch ??
        local?.swatch ??
        (category ? DEFAULT_SWATCH[category] : "#A99A83"),
      category,
      alcohol_type: ingredient?.alcohol_type ?? local?.alcoholType ?? null,
      abv: alcoholic ? (row.abv ?? ingredient?.abv ?? null) : null,
    };
  });
}

export async function removeFromBar(
  userId: string,
  barItemId: string,
): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from("bar_items")
    .delete()
    .eq("user_id", userId)
    .eq("id", barItemId);

  if (error) {
    console.error("Supabase removeFromBar error:", error);
    throw new Error("Couldn't remove it. Try again.");
  }
}
