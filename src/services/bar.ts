import { supabase } from "@/services/supabase";
import type { Product } from "@/types/bottle";

export async function addToBar(
  userId: string,
  product: Product,
): Promise<void> {
  if (!product.ingredient) {
    throw new Error("Pick what this bottle counts as first.");
  }

  if (!supabase) return;

  const { data: existing, error: lookupError } = await supabase
    .from("bar_items")
    .select("id")
    .eq("user_id", userId)
    .eq("ingredient_name", product.ingredient.name)
    .maybeSingle();

  if (lookupError) {
    console.error("Supabase addToBar lookup error:", lookupError);
    throw new Error("Couldn't add it to your bar. Try again.");
  }

  const productData = {
    category: product.ingredient.category,
    product_name: product.productName,
    barcode: product.barcode ?? null,
    brand: product.brand ?? null,
    alcohol_type: product.alcoholType ?? null,
    alcohol_percent: product.abv ?? null,
    inital_volume_ml: product.volumeMl ?? null,
  };

  if (existing) {
    const { error } = await supabase
      .from("bar_items")
      .update(productData)
      .eq("id", existing.id);

    if (error) {
      console.error("Supabase addToBar update error:", error);
      throw new Error("Couldn't update your bar. Try again.");
    }

    return;
  }

  const { error } = await supabase.from("bar_items").insert({
    user_id: userId,
    ingredient_name: product.ingredient.name,
    quantity: 1,
    ...productData,
  });

  if (error) {
    console.error("Supabase addToBar insert error:", error);
    throw new Error("Couldn't add it to your bar. Try again.");
  }
}

export type BarItem = {
  id: string;

  ingredient_name: string;
  category: string | null;

  quantity: number | null;

  product_name: string | null;
  barcode: string | null;
  brand: string | null;
  alcohol_type: string | null;
  alcohol_percent: number | null;
  inital_volume_ml: number | null;
};

export async function getBarItems(userId: string): Promise<BarItem[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("bar_items")
    .select(
      `
      id,
      ingredient_name,
      category,
      quantity,
      product_name,
      barcode,
      brand,
      alcohol_type,
      alcohol_percent,
      inital_volume_ml
    `,
    )
    .eq("user_id", userId)
    .order("created_at");

  if (error) {
    console.error("Supabase getBarItems error:", error);
    throw new Error("Couldn't load your bar.");
  }

  return data ?? [];
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
