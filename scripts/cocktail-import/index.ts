// Imports TheCocktailDB into Supabase and computes each cocktail's flavour.
//
// Run from the project root:
//   npm run import:cocktails                  fetch + import + compute
//   npm run import:cocktails -- --recompute   only recompute flavours
//   npm run import:cocktails -- --refetch     ignore the cache, download again
//
// Reads .env and .env.local:
//   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
//   SUPABASE_SECRET_KEY=sb_secret_...     admin key, needed to write
//   COCKTAILDB_API_KEY=1                  optional; "1" is the free dev key
//
// The .cache folder (downloaded drinks + report.md) is created on the first
// run, in scripts/cocktail-import/.cache. It's gitignored.
//
// Run the SQL in supabase/migrations/20260930120000_cocktail_flavor.sql first.

import { createClient } from "@supabase/supabase-js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { BUILT_IN_INGREDIENTS as BAR_INGREDIENTS } from "../../src/data/ingredients";
import {
  computeFlavor,
  DIMENSIONS,
  normalizeKey,
  type CocktailFlavor,
  type IngredientRow,
  type RecipeLine,
} from "./flavor";
import { INGREDIENT_SEED } from "./ingredient-seed";
import { parseMeasure } from "./measure";

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

// Minimal .env reader (works on any Node version, no dependency).
// Values already set in the shell win over the files.
function loadEnv(file: string) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(
      /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/,
    );
    if (!m) continue;
    const value = m[2].replace(/^(['"])(.*)\1$/, "$2");
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
}
loadEnv(".env.local");
loadEnv(".env");

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

// The secret key bypasses row level security. Anything prefixed EXPO_PUBLIC_
// can be built into the app, so keep it unprefixed. The EXPO_PUBLIC_ name is
// still accepted so the script runs, but it prints a warning.
const SECRET =
  process.env.SUPABASE_SECRET_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_SECRET_KEY;

if (
  !process.env.SUPABASE_SECRET_KEY &&
  process.env.EXPO_PUBLIC_SUPABASE_SECRET_KEY
) {
  console.warn(
    "Warning: EXPO_PUBLIC_SUPABASE_SECRET_KEY can end up inside the app bundle.\n" +
      "Rename it to SUPABASE_SECRET_KEY in your .env.\n",
  );
}

if (!SUPABASE_URL) {
  console.error("Missing EXPO_PUBLIC_SUPABASE_URL in .env / .env.local");
  process.exit(1);
}
if (!SECRET) {
  console.error(
    "Missing SUPABASE_SECRET_KEY in .env / .env.local.\n" +
      "The publishable key (EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY) can't be used here:\n" +
      "the cocktails table only allows reads for it, so every insert would fail.\n" +
      "Copy the secret key from your Supabase project's API keys settings.",
  );
  process.exit(1);
}

const API_KEY = process.env.COCKTAILDB_API_KEY ?? "1";
const API = `https://www.thecocktaildb.com/api/json/v1/${API_KEY}`;

const db = createClient(SUPABASE_URL!, SECRET!, {
  auth: { persistSession: false },
});

// Relative to where you run the script (the project root), so it works
// the same in CommonJS and ES modules.
const CACHE_DIR = join(process.cwd(), "scripts", "cocktail-import", ".cache");
const CACHE_FILE = join(CACHE_DIR, "cocktaildb.json");
const REPORT_FILE = join(CACHE_DIR, "report.md");
mkdirSync(CACHE_DIR, { recursive: true });
const args = new Set(process.argv.slice(2));

// ---------------------------------------------------------------------------
// 1. Fetch TheCocktailDB (cached, so re-runs don't hit the API)
// ---------------------------------------------------------------------------
type RawDrink = Record<string, string | null>;

async function fetchAllDrinks(): Promise<RawDrink[]> {
  if (existsSync(CACHE_FILE) && !args.has("--refetch")) {
    console.log("Using cached drinks (pass --refetch to download again)");
    return JSON.parse(readFileSync(CACHE_FILE, "utf8"));
  }

  const byId = new Map<string, RawDrink>();

  // 1. Full records by first letter. The free key caps each letter at 25.
  const letters = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
  for (const letter of letters) {
    const res = await getJson(`${API}/search.php?f=${letter}`);
    for (const d of drinksOf(res)) byId.set(d.idDrink!, d);
    process.stdout.write(`\r  letters: "${letter}" – ${byId.size} drinks`);
    await sleep(300);
  }
  console.log();

  // 2. Collect IDs through the filter endpoints to find what step 1 missed.
  const ids = new Set<string>();
  const filters: [param: string, field: string][] = [
    ["i", "strIngredient1"],
    ["c", "strCategory"],
    ["g", "strGlass"],
    ["a", "strAlcoholic"],
  ];
  for (const [param, field] of filters) {
    const list = await getJson(`${API}/list.php?${param}=list`);
    for (const row of drinksOf(list)) {
      const value = row[field];
      if (!value) continue;
      const res = await getJson(
        `${API}/filter.php?${param}=${encodeURIComponent(value)}`,
      );
      for (const d of drinksOf(res)) if (d.idDrink) ids.add(d.idDrink);
      process.stdout.write(`\r  filter ${param}: ${ids.size} ids`);
      await sleep(300);
    }
  }
  console.log();

  // 3. Full record for every ID the letter search didn't return.
  const missing = [...ids].filter((id) => !byId.has(id));
  for (const [n, id] of missing.entries()) {
    const res = await getJson(`${API}/lookup.php?i=${id}`);
    const d = drinksOf(res)[0];
    if (d?.idDrink) byId.set(d.idDrink, d);
    process.stdout.write(`\r  lookups: ${n + 1}/${missing.length}`);
    await sleep(300);
  }
  console.log(`\n  ${byId.size} drinks total (${missing.length} via lookup)`);

  const all = [...byId.values()];
  writeFileSync(CACHE_FILE, JSON.stringify(all));
  return all;
}

// The API returns {drinks: null} or {drinks: "None Found"} for no results.
function drinksOf(res: any): RawDrink[] {
  return Array.isArray(res?.drinks) ? res.drinks : [];
}

async function getJson(url: string, tries = 4): Promise<any> {
  for (let n = 1; n <= tries; n++) {
    const res = await fetch(url);
    if (res.ok) {
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    }
    if (n < tries && (res.status === 429 || res.status >= 500)) {
      await sleep(1000 * n);
      continue;
    }
    throw new Error(`${url} -> HTTP ${res.status}`);
  }
}

// ---------------------------------------------------------------------------
// 2. Normalise a CocktailDB record
// ---------------------------------------------------------------------------
type Method =
  | "shake"
  | "stir"
  | "build"
  | "blend"
  | "muddle"
  | "layer"
  | "unknown";

function getMethod(instructions: string | null): Method {
  const t = (instructions ?? "").toLowerCase();
  if (t.includes("blend")) return "blend";
  if (t.includes("shake") || t.includes("shaker")) return "shake";
  if (t.includes("stir")) return "stir";
  if (t.includes("muddle")) return "muddle";
  if (t.includes("layer") || t.includes("float")) return "layer";
  if (t.includes("pour") || t.includes("build") || t.includes("fill"))
    return "build";
  return "unknown";
}

function toRows(d: RawDrink) {
  const lines: (RecipeLine & { position: number })[] = [];
  for (let n = 1; n <= 15; n++) {
    const ingredient = d[`strIngredient${n}`]?.trim();
    if (!ingredient) continue;
    lines.push({
      ingredient: fixName(ingredient),
      measure: d[`strMeasure${n}`]?.trim() || null,
      position: lines.length + 1,
    });
  }

  const cocktail = {
    id: d.idDrink!,
    name: d.strDrink!.trim(),
    image: d.strDrinkThumb ?? null,
    glass: d.strGlass ?? null,
    category: d.strCategory ?? null,
    alcoholic:
      d.strAlcoholic === "Alcoholic" || d.strAlcoholic === "Optional alcohol",
    method: getMethod(d.strInstructions),
    instructions: d.strInstructions ?? null,
    source: "thecocktaildb",
    tags: d.strTags
      ? d.strTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : null,
    iba: d.strIBA ?? null,
    updated_at: new Date().toISOString(),
  };
  return { cocktail, lines };
}

// Collapse spelling variants so one ingredients row covers them.
const RENAMES: Record<string, string> = {
  "angostura bitters": "Angostura bitters",
  "sweet vermouth": "Sweet Vermouth",
  "dry vermouth": "Dry Vermouth",
  "fresh lemon juice": "Lemon juice",
  "fresh lime juice": "Lime juice",
  "simple syrup": "Sugar syrup",
  "club soda": "Soda water",
  "carbonated water": "Soda water",
  "coca-cola": "Cola",
  jägermeister: "Jagermeister",
  "white rum": "Light rum",
};

function fixName(name: string) {
  return RENAMES[normalizeKey(name)] ?? name;
}

// ---------------------------------------------------------------------------
// 3. Supabase helpers
// ---------------------------------------------------------------------------
async function selectAll<T>(table: string, columns: string): Promise<T[]> {
  const out: T[] = [];
  const page = 1000;
  for (let from = 0; ; from += page) {
    const { data, error } = await db
      .from(table)
      .select(columns)
      .range(from, from + page - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...((data ?? []) as T[]));
    if (!data || data.length < page) return out;
  }
}

async function inBatches<T>(
  rows: T[],
  size: number,
  fn: (batch: T[]) => Promise<void>,
) {
  for (let n = 0; n < rows.length; n += size) await fn(rows.slice(n, n + size));
}

function check(error: { message: string } | null, what: string) {
  if (error) throw new Error(`${what}: ${error.message}`);
}

// ---------------------------------------------------------------------------
// 4. Import
// ---------------------------------------------------------------------------
async function importDrinks() {
  const raw = await fetchAllDrinks();
  const parsed = raw.filter((d) => d.idDrink && d.strDrink).map(toRows);
  console.log(`Importing ${parsed.length} cocktails`);

  // 4a. Ingredients: seed rows (unless you've marked them reviewed), then a
  //     blank row for every recipe ingredient we don't know yet.
  const existing = await selectAll<{ key: string; reviewed: boolean }>(
    "ingredients",
    "key, reviewed",
  );
  const reviewed = new Set(
    existing.filter((r) => r.reviewed).map((r) => r.key),
  );
  const known = new Set(existing.map((r) => r.key));

  const seed = INGREDIENT_SEED.filter((r) => !reviewed.has(r.key));
  await inBatches(seed, 200, async (b) => {
    const { error } = await db
      .from("ingredients")
      .upsert(b, { onConflict: "key" });
    check(error, "seed ingredients");
  });
  for (const r of INGREDIENT_SEED) known.add(r.key);

  // Shelf, alcohol type, label and swatch of the built-in bar list are owned
  // by src/data/ingredients.ts, so they're synced even on reviewed rows.
  // Ingredients people added in the app aren't touched.
  const missing = BAR_INGREDIENTS.filter((b) => !known.has(b.key));
  if (missing.length > 0) {
    throw new Error(
      `No ingredients row for: ${missing.map((b) => b.name).join(", ")}. ` +
        `Add them to ingredient-seed.ts.`,
    );
  }
  for (const b of BAR_INGREDIENTS) {
    const { error } = await db
      .from("ingredients")
      .update({
        bar_category: b.category,
        alcohol_type: b.alcoholType ?? null,
        bar_label: b.label,
        swatch: b.swatch,
      })
      .eq("key", b.key);
    check(error, `bar fields for ${b.key}`);
  }

  const unknown = new Map<string, string>();
  for (const { lines } of parsed) {
    for (const l of lines) {
      const key = normalizeKey(l.ingredient);
      if (!known.has(key) && !unknown.has(key)) unknown.set(key, l.ingredient);
    }
  }
  const blanks = [...unknown].map(([key, display_name]) => ({
    key,
    display_name,
  }));
  await inBatches(blanks, 200, async (b) => {
    const { error } = await db
      .from("ingredients")
      .upsert(b, { onConflict: "key", ignoreDuplicates: true });
    check(error, "new ingredients");
  });
  console.log(
    `  ingredients: ${seed.length} from seed, ${blanks.length} new without flavour data`,
  );

  // 4b. Cocktails.
  await inBatches(
    parsed.map((p) => p.cocktail),
    200,
    async (b) => {
      const { error } = await db
        .from("cocktails")
        .upsert(b, { onConflict: "id" });
      check(error, "cocktails");
    },
  );

  // 4c. Recipe lines: replace each cocktail's lines.
  const unitMl = new Map(INGREDIENT_SEED.map((r) => [r.key, r.unit_ml]));
  await inBatches(parsed, 100, async (b) => {
    const ids = b.map((p) => p.cocktail.id);
    const del = await db
      .from("cocktail_ingredients")
      .delete()
      .in("cocktail_id", ids);
    check(del.error, "clear recipe lines");

    const rows = b.flatMap(({ cocktail, lines }) =>
      lines.map((l) => {
        const m = parseMeasure(l.measure);
        const unit = unitMl.get(normalizeKey(l.ingredient));
        const ml = m.ml ?? (m.count !== null && unit ? m.count * unit : null);
        return {
          cocktail_id: cocktail.id,
          ingredient: l.ingredient,
          ingredient_key: normalizeKey(l.ingredient),
          measure: l.measure,
          measure_ml: ml,
          position: l.position,
        };
      }),
    );
    const ins = await db.from("cocktail_ingredients").insert(rows);
    check(ins.error, "insert recipe lines");
  });
  console.log("  cocktails and recipe lines saved");
}

// ---------------------------------------------------------------------------
// 5. Compute flavour for every cocktail in the table (any source)
// ---------------------------------------------------------------------------
type CocktailBase = {
  id: string;
  name: string;
  alcoholic: boolean;
  source: string;
  method: string | null;
};
type LineRow = {
  cocktail_id: string;
  ingredient: string;
  measure: string | null;
  position: number;
};

async function computeAll() {
  const [cocktails, lines, ingredients] = await Promise.all([
    selectAll<CocktailBase>("cocktails", "id, name, alcoholic, source, method"),
    selectAll<LineRow>(
      "cocktail_ingredients",
      "cocktail_id, ingredient, measure, position",
    ),
    selectAll<IngredientRow>("ingredients", "*"),
  ]);

  const ingByKey = new Map(
    ingredients.map((i) => [i.key, { ...i, ...numbers(i) }]),
  );
  const linesBy = new Map<string, LineRow[]>();
  for (const l of lines) {
    const list = linesBy.get(l.cocktail_id) ?? [];
    list.push(l);
    linesBy.set(l.cocktail_id, list);
  }

  const raw = cocktails.map((c) => ({
    base: c,
    flavor: computeFlavor(
      (linesBy.get(c.id) ?? []).sort((a, b) => a.position - b.position),
      ingByKey,
      c.method,
    ),
  }));

  // Raw averages bunch up (most drinks score 0.1–0.4 sweet). Convert each
  // dimension to a percentile so 0.8 means "sweeter than 80% of drinks".
  // Zero stays zero: a drink with no cream isn't "a bit creamy".
  const scaled = percentiles(raw.map((r) => r.flavor));
  const now = new Date().toISOString();

  const rows = raw.map((r, n) => ({
    id: r.base.id,
    name: r.base.name,
    alcoholic: r.base.alcoholic,
    source: r.base.source,
    ...scaled[n],
    abv: r.flavor.abv,
    total_ml: r.flavor.total_ml,
    flavor_computed_at: now,
  }));

  await inBatches(rows, 200, async (b) => {
    const { error } = await db
      .from("cocktails")
      .upsert(b, { onConflict: "id" });
    check(error, "save flavours");
  });
  console.log(`Computed flavour for ${rows.length} cocktails`);

  writeReport(rows, lines, ingByKey);
}

// Supabase returns numeric columns as strings; make them numbers.
function numbers(i: IngredientRow) {
  const out: Record<string, number> = {
    abv: Number(i.abv),
    intensity: Number(i.intensity),
  };
  for (const d of DIMENSIONS) out[d] = Number(i[d]);
  if (i.unit_ml !== null) out.unit_ml = Number(i.unit_ml);
  return out;
}

const SCALED = [...DIMENSIONS, "strong"] as const;
type Scaled = Record<(typeof SCALED)[number], number>;

function percentiles(flavors: CocktailFlavor[]): Scaled[] {
  const out = flavors.map(() => ({}) as Scaled);
  for (const d of SCALED) {
    const nonZero = flavors
      .map((f) => f[d])
      .filter((v) => v > 0)
      .sort((a, b) => a - b);
    flavors.forEach((f, n) => {
      const v = f[d];
      if (v <= 0 || nonZero.length === 0) {
        out[n][d] = 0;
        return;
      }
      // share of non-zero drinks at or below this value
      let lo = 0;
      let hi = nonZero.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (nonZero[mid] <= v) lo = mid + 1;
        else hi = mid;
      }
      out[n][d] = Math.round((lo / nonZero.length) * 1000) / 1000;
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// 6. Report: what to tag next, and a sanity check of the results
// ---------------------------------------------------------------------------
function writeReport(
  rows: ({ id: string; name: string } & Scaled & { abv: number })[],
  lines: LineRow[],
  ingByKey: Map<string, IngredientRow>,
) {
  const uses = new Map<string, number>();
  for (const l of lines) {
    const k = normalizeKey(l.ingredient);
    uses.set(k, (uses.get(k) ?? 0) + 1);
  }

  const noData = [...uses]
    .filter(([k]) => {
      const i = ingByKey.get(k);
      return (
        !i || (i.kind === "other" && DIMENSIONS.every((d) => !i[d]) && !i.abv)
      );
    })
    .sort((a, b) => b[1] - a[1]);

  const unmatchable = [...uses]
    .filter(([k]) => {
      const i = ingByKey.get(k);
      return i && i.availability === "bar" && i.bar_keys.length === 0;
    })
    .sort((a, b) => b[1] - a[1]);

  const top = (d: keyof Scaled) =>
    [...rows]
      .filter((r) => r[d] > 0)
      .sort((a, b) => b[d] - a[d])
      .slice(0, 5)
      .map((r) => r.name)
      .join(", ") || "(none)";

  const md = [
    `# Cocktail import report`,
    ``,
    `${rows.length} cocktails, ${ingByKey.size} ingredients.`,
    ``,
    `## Ingredients with no flavour data (${noData.length})`,
    `Tag these in \`ingredient-seed.ts\` or the \`ingredients\` table, most-used first.`,
    ``,
    ...noData.map(([k, n]) => `- ${k} — ${n} cocktails`),
    ``,
    `## Bar ingredients nobody can add yet (${unmatchable.length})`,
    `These need a bottle, but no entry in \`src/data/ingredients.ts\` maps to them,`,
    `so drinks using them can never show as makeable. Add the common ones to the app list`,
    `and to \`bar_keys\`.`,
    ``,
    ...unmatchable.map(([k, n]) => `- ${k} — ${n} cocktails`),
    ``,
    `## Sanity check: top 5 per dimension`,
    ``,
    ...SCALED.map((d) => `- **${d}**: ${top(d)}`),
    ``,
  ].join("\n");

  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(REPORT_FILE, md);
  console.log(`Report written to ${REPORT_FILE}`);
  console.log(`  ${noData.length} ingredients still need flavour data`);
}

// ---------------------------------------------------------------------------
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (!args.has("--recompute")) await importDrinks();
  await computeAll();
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
