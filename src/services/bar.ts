import { supabase } from "@/services/supabase";
import type { Product } from "@/types/bottle";

// Adds the confirmed bottle to the user's bar.
// With Supabase configured it writes a row to `bar_items`.
// Without it, it's a no-op so the flow still works while you build.
// Wire `onAdded` in the confirm screen to your own My Bar state (useBar).
export async function addToBar(
  userId: string,
  product: Product,
): Promise<void> {
  if (!product.ingredient) {
    throw new Error("Pick what this bottle counts as first.");
  }

  if (!supabase) return;

  const { error } = await supabase.from("bar_items").upsert(
    {
      user_id: userId,
      ingredient_name: product.ingredient.name,
      category: product.ingredient.category,
      product_name: product.productName,
      barcode: product.barcode ?? null,
    },
    {
      onConflict: "user_id,ingredient_name",
    },
  );

  if (error) {
    console.error("Supabase addToBar error:", error);
    throw new Error("Couldn't add it to your bar. Try again.");
  }
}

export type BarItem = {
  ingredient_name: string;
  category: string;
  product_name: string | null;
};

export async function getBarItems(userId: string): Promise<BarItem[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("bar_items")
    .select("ingredient_name, category, product_name")
    .eq("user_id", userId)
    .order("created_at");

  if (error) {
    throw new Error("Couldn't load your bar.");
  }

  return data ?? [];
}

export async function removeFromBar(
  userId: string,
  ingredient: string,
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from("bar_items")
    .delete()
    .eq("user_id", userId)
    .eq("ingredient_name", ingredient);

  console.log("Supabase removeFromBar error:", error);
  if (error) throw new Error("Couldn't remove it. Try again.");
}
