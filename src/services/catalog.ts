// The bar list: every ingredient someone can have in their bar.
//
// Starts as the built-in list in src/data/ingredients.ts, then loads the
// `ingredients` table (rows with a bar_category), which also holds
// ingredients people have added. Screens re-render through useBarCatalog().

import {
  BUILT_IN_ALCOHOL_TYPES,
  BUILT_IN_INGREDIENTS,
  DEFAULT_SWATCH,
} from "@/data/ingredients";
import { supabase } from "@/services/supabase";
import type {
  AlcoholType,
  AlcoholTypeOption,
  BarCategory,
  Ingredient,
} from "@/types/bottle";

type Entry = Ingredient & { match: RegExp; aliases: string[] };

export type Catalog = {
  ingredients: Ingredient[];
  alcoholTypes: AlcoholTypeOption[];
  loaded: boolean; // false = still the built-in list
};

type IngredientRow = {
  key: string;
  display_name: string;
  bar_label: string | null;
  bar_category: BarCategory;
  alcohol_type: AlcoholType | null;
  swatch: string | null;
  aliases: string[] | null;
  created_by: string | null;
};

const INGREDIENT_COLUMNS =
  "key, display_name, bar_label, bar_category, alcohol_type, swatch, aliases, created_by";

const BUILT_IN = new Map(BUILT_IN_INGREDIENTS.map((i) => [i.key, i]));

let entries: Entry[] = BUILT_IN_INGREDIENTS.map((i) => ({ ...i, aliases: [] }));
let snapshot: Catalog = build(entries, [...BUILT_IN_ALCOHOL_TYPES], false);
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

// ---------------------------------------------------------------------------
// Reading
// ---------------------------------------------------------------------------
export function getCatalog(): Catalog {
  return snapshot;
}

export function subscribeCatalog(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function ingredientByKey(key: string): Ingredient | null {
  const k = key.trim().toLowerCase();
  return snapshot.ingredients.find((i) => i.key === k) ?? null;
}

export function alcoholTypeLabel(key: AlcoholType | null | undefined) {
  if (!key) return undefined;
  return snapshot.alcoholTypes.find((t) => t.key === key)?.label ?? key;
}

// Text from a barcode lookup or a label -> the ingredient recipes use.
export function normalizeIngredient(text: string): Ingredient | null {
  const hit = entries.find((i) => i.match.test(text));
  return hit ? strip(hit) : null;
}

// For manual search and the "Change" picker.
export function searchIngredients(query: string): Ingredient[] {
  const q = query.trim().toLowerCase();
  if (!q) return snapshot.ingredients;
  return entries
    .filter((i) =>
      [i.label, i.name, ...i.aliases].some((t) => t.toLowerCase().includes(q)),
    )
    .map(strip);
}

// True if `name` is already in the list, so "Add …" isn't offered.
export function hasIngredientNamed(name: string): boolean {
  const q = name.trim().toLowerCase();
  return entries.some((i) =>
    [i.key, i.label, ...i.aliases].some((t) => t.toLowerCase() === q),
  );
}

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------
export function loadCatalog(force = false): Promise<void> {
  if (!supabase) return Promise.resolve();
  if (loading && !force) return loading;
  const db = supabase;

  loading = (async () => {
    const [ingredients, types] = await Promise.all([
      db
        .from("ingredients")
        .select(INGREDIENT_COLUMNS)
        .not("bar_category", "is", null)
        .returns<IngredientRow[]>(),
      db
        .from("alcohol_types")
        .select("key, label, category")
        .order("position")
        .returns<AlcoholTypeOption[]>(),
    ]);

    if (ingredients.error || types.error) {
      console.warn(
        "loadCatalog failed:",
        (ingredients.error ?? types.error)?.message,
      );
      loading = null; // try again next time
      return;
    }

    entries = merge(ingredients.data ?? []);
    publish(build(entries, types.data ?? [], true));
  })();

  return loading;
}

// ---------------------------------------------------------------------------
// Adding
// ---------------------------------------------------------------------------
export type NewIngredient = {
  name: string;
  category: BarCategory;
  alcoholType?: AlcoholType;
  swatch?: string;
};

// Adds an ingredient for everyone. If one with the same name exists, you
// get that one back instead of a duplicate.
export async function createIngredient(
  input: NewIngredient,
): Promise<Ingredient> {
  if (!supabase) throw new Error("Not connected.");

  const { data, error } = await supabase
    .rpc("create_bar_ingredient", {
      p_name: input.name,
      p_bar_category: input.category,
      p_alcohol_type: input.alcoholType ?? null,
      p_swatch: input.swatch ?? null,
    })
    .returns<IngredientRow[]>()
    .single();

  if (error || !data) {
    console.error("createIngredient error:", error);
    throw new Error(error?.message ?? "Couldn't add it. Try again.");
  }

  const entry = toEntry(data);
  entries = [entry, ...entries.filter((i) => i.key !== entry.key)];
  publish(build(entries, snapshot.alcoholTypes, snapshot.loaded));
  return strip(entry);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function publish(next: Catalog) {
  snapshot = next;
  listeners.forEach((l) => l());
}

function build(
  list: Entry[],
  alcoholTypes: AlcoholTypeOption[],
  loaded: boolean,
): Catalog {
  // Sorted by name for the picker; `entries` keeps matching order.
  const ingredients = list
    .map(strip)
    .sort((x, y) => x.label.localeCompare(y.label));
  return { ingredients, alcoholTypes, loaded };
}

function strip({
  match: _match,
  aliases: _aliases,
  ...ingredient
}: Entry): Ingredient {
  return ingredient;
}

function toEntry(row: IngredientRow): Entry {
  const builtIn = BUILT_IN.get(row.key);
  const aliases = row.aliases ?? [];
  const label = row.bar_label ?? builtIn?.label ?? row.display_name;
  return {
    key: row.key,
    name: row.display_name,
    label,
    category: row.bar_category,
    alcoholType: row.alcohol_type ?? undefined,
    swatch: row.swatch ?? builtIn?.swatch ?? DEFAULT_SWATCH[row.bar_category],
    custom: row.created_by != null,
    aliases,
    match: builtIn?.match ?? nameMatcher([row.display_name, label, ...aliases]),
  };
}

// Matching order: ingredients added by people first (their names are
// specific, like "Brennivín"), longest name first, then the built-in list in
// its hand-tuned order. Built-ins missing from the table stay as a fallback.
function merge(rows: IngredientRow[]): Entry[] {
  const fromDb = new Map(rows.map((r) => [r.key, toEntry(r)]));
  const added = [...fromDb.values()]
    .filter((e) => !BUILT_IN.has(e.key))
    .sort((x, y) => y.name.length - x.name.length);
  const builtIns = BUILT_IN_INGREDIENTS.map(
    (b) => fromDb.get(b.key) ?? { ...b, aliases: [] },
  );
  return [...added, ...builtIns];
}

// Whole-word match on any of the names. \b doesn't work for letters like
// "á", so word edges are "not a letter or digit".
function nameMatcher(names: string[]): RegExp {
  const terms = [...new Set(names.map((n) => n.trim()).filter(Boolean))]
    .sort((x, y) => y.length - x.length)
    .map((n) =>
      n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+"),
    );
  return new RegExp(
    `(?:^|[^\\p{L}\\p{N}])(?:${terms.join("|")})(?:$|[^\\p{L}\\p{N}])`,
    "iu",
  );
}
