import {
  ingredientByKey,
  loadCatalog,
  normalizeIngredient,
} from "@/services/catalog";
import { supabase } from "@/services/supabase";
import type { Product } from "@/types/bottle";

// Open Food Facts wants apps to identify themselves: AppName/Version (email).
const OFF_USER_AGENT = `Pourly/1.0 (${process.env.EXPO_PUBLIC_CONTACT_EMAIL ?? "hello@pourly.app"})`;
const OFF_FIELDS =
  "product_name,brands,categories_tags,quantity,image_front_url,nutriments";

// ---------------------------------------------------------------------------
// Barcode: your Supabase first, then Open Food Facts. null = not recognised.
// ---------------------------------------------------------------------------
export async function identifyByBarcode(
  barcode: string,
): Promise<Product | null> {
  // Make sure ingredients people added can be matched too.
  await loadCatalog();
  const known = await fromSupabase(barcode);
  if (known) return known;
  return fromOpenFoodFacts(barcode);
}

async function fromSupabase(barcode: string): Promise<Product | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("barcode", barcode)
    .maybeSingle();
  if (error || !data) return null;

  return {
    barcode: data.barcode,
    brand: data.brand ?? undefined,
    productName: data.product_name,
    ingredient: data.ingredient_key
      ? ingredientByKey(data.ingredient_key)
      : null,
    abv: data.abv ?? undefined,
    volumeMl: data.volume_ml ?? undefined,
    imageUrl: data.image_url ?? undefined,
    source: "pourly",
  };
}

type OffProduct = {
  product_name?: string;
  brands?: string;
  categories_tags?: string[];
  quantity?: string;
  image_front_url?: string;
  nutriments?: { alcohol_100g?: number; alcohol?: number };
};

async function fromOpenFoodFacts(barcode: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v3/product/${encodeURIComponent(barcode)}.json?fields=${OFF_FIELDS}`,
      { headers: { "User-Agent": OFF_USER_AGENT, Accept: "application/json" } },
    );
    if (!res.ok) return null; // 404 = unknown barcode, 503 = rate limited

    const data = (await res.json()) as { product?: OffProduct };
    const p = data.product;
    if (!p?.product_name) return null;

    const categories = (p.categories_tags ?? []).map((t) =>
      t.replace(/^[a-z]{2}:/, "").replace(/-/g, " "),
    );
    const searchable = [p.product_name, p.brands, ...categories].join(" ");

    return {
      barcode,
      brand: p.brands?.split(",")[0]?.trim(),
      productName: p.product_name,
      ingredient: normalizeIngredient(searchable),
      abv: p.nutriments?.alcohol_100g ?? p.nutriments?.alcohol,
      volumeMl: parseVolume(p.quantity ?? ""),
      imageUrl: p.image_front_url,
      source: "openfoodfacts",
    };
  } catch {
    return null; // offline or blocked: fall through to label / manual
  }
}

// ---------------------------------------------------------------------------
// Label text (from on-device OCR) -> product guess.
// ---------------------------------------------------------------------------
export function identifyByLabel(lines: string[], barcode?: string): Product {
  const clean = lines.map((l) => l.trim()).filter(Boolean);
  const all = clean.join(" ");

  const abvLine = /(\d{1,2}(?:[.,]\d)?)\s*%\s*(?:vol|abv|alc)?/i;
  const volLine = /\b\d+(?:[.,]\d+)?\s*(?:ml|cl|l|ltr|litre|liter)\b/i;

  const abvMatch = all.match(abvLine);
  const abv = abvMatch ? parseFloat(abvMatch[1].replace(",", ".")) : undefined;
  const volumeMl = parseVolume(all);

  // Name = the first few lines that aren't ABV / volume / boilerplate.
  const nameLines = clean
    .filter((l) => !abvLine.test(l) && !volLine.test(l))
    .filter(
      (l) =>
        !/product of|distilled|bottled|imported|since \d{4}|est\.? \d{4}/i.test(
          l,
        ),
    )
    .filter((l) => /[a-z]/i.test(l) && l.length > 1)
    .slice(0, 3);

  const productName = toTitle(nameLines.join(" ")) || "Unknown bottle";
  const ingredient = normalizeIngredient(all);

  return {
    barcode,
    brand: nameLines[0] ? toTitle(nameLines[0]) : undefined,
    productName,
    ingredient,
    abv: abv !== undefined && abv > 0 && abv < 96 ? abv : undefined,
    volumeMl,
    source: "label",
  };
}

// ---------------------------------------------------------------------------
// Save a confirmed barcode so the next scan (by anyone) is instant.
// ---------------------------------------------------------------------------
export async function saveProduct(p: Product): Promise<void> {
  if (!supabase || !p.barcode || !p.ingredient) return;
  const { error } = await supabase.from("products").upsert(
    {
      barcode: p.barcode,
      brand: p.brand ?? null,
      product_name: p.productName,
      ingredient_key: p.ingredient.key,
      abv: p.abv ?? null,
      volume_ml: p.volumeMl ?? null,
      image_url: p.imageUrl ?? null,
      source: p.source === "pourly" ? "user_scan" : p.source,
    },
    { onConflict: "barcode" },
  );
  if (error) console.warn("saveProduct failed", error.message);
}

// ---------------------------------------------------------------------------
function parseVolume(text: string): number | undefined {
  const m = text.match(/(\d+(?:[.,]\d+)?)\s*(ml|cl|l|ltr|litre|liter)\b/i);
  if (!m) return undefined;
  const n = parseFloat(m[1].replace(",", "."));
  const unit = m[2].toLowerCase();
  const ml = unit === "ml" ? n : unit === "cl" ? n * 10 : n * 1000;
  return ml >= 20 && ml <= 5000 ? Math.round(ml) : undefined;
}

function toTitle(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}
