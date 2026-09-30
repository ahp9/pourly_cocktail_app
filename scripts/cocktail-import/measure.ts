// Turns CocktailDB measure strings into millilitres.
//
// CocktailDB measures are free text: "1 1/2 oz", "2 cl", "Juice of 1/2",
// "1 dash", "Top up", "2 parts", "1 tblsp", or null. We only need a rough
// volume, because it's used to weight the flavour average.

export type MeasureResult = {
  ml: number | null; // null = no volume unit; caller uses count or a default
  count: number | null; // bare count: "1" egg white, "6" mint leaves, "1 slice"
  garnish: boolean; // measure literally says "garnish"
};

const OZ = 29.5735;

// ml per unit. Order matters: longer names first so "tblsp" wins over "tsp".
const UNITS: [RegExp, number][] = [
  [/\b(?:oz|ounces?)\b/, OZ],
  [/\bcl\b/, 10],
  [/\bml\b/, 1],
  [/\bdl\b/, 100],
  [/\b(?:l|liters?|litres?)\b/, 1000],
  [/\b(?:tbl?sp|tbsp|tablespoons?|tbs)\b/, 15],
  [/\b(?:tsp|teaspoons?)\b/, 5],
  [/\bjiggers?\b/, 44],
  [/\bshots?\b/, 30],
  [/\bcups?\b/, 240],
  [/\bpints?\b/, 473],
  [/\bparts?\b/, 30], // recipes in "parts" use parts throughout, so ratios hold
  [/\bdash(?:es)?\b/, 1],
  [/\bdrops?\b/, 0.1],
  [/\b(?:splash(?:es)?)\b/, 10],
  [/\bpinch(?:es)?\b/, 0.5],
  [/\bcubes?\b/, 4], // sugar cube
  [/\b(?:bottles?)\b/, 330],
  [/\b(?:cans?)\b/, 330],
  [/\b(?:glass(?:es)?)\b/, 150],
];

const FILL = /\b(?:top(?:\s*up)?|fill|to fill|top with|full glass)\b/;
const GARNISH = /\bgarnish\b/;
const JUICE_OF = /juice of\s*(.+)/;

const UNICODE_FRACTIONS: Record<string, string> = {
  "½": " 1/2",
  "⅓": " 1/3",
  "⅔": " 2/3",
  "¼": " 1/4",
  "¾": " 3/4",
  "⅛": " 1/8",
};

// "1 1/2" -> 1.5, "1/2" -> 0.5, "1.5" -> 1.5, "1-2" -> 1.5
export function parseQuantity(text: string): number | null {
  const t = text.replace(/[½⅓⅔¼¾⅛]/g, (c) => UNICODE_FRACTIONS[c]).trim();

  const range = t.match(/(\d+(?:[.,]\d+)?)\s*(?:-|to)\s*(\d+(?:[.,]\d+)?)/);
  if (range) return (num(range[1]) + num(range[2])) / 2;

  const mixed = t.match(/(\d+)\s+(\d+)\s*\/\s*(\d+)/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);

  const frac = t.match(/(\d+)\s*\/\s*(\d+)/);
  if (frac) return Number(frac[1]) / Number(frac[2]);

  const dec = t.match(/(\d+(?:[.,]\d+)?)/);
  if (dec) return num(dec[1]);

  return null;
}

function num(s: string) {
  return Number(s.replace(",", "."));
}

export function parseMeasure(
  measure: string | null | undefined,
): MeasureResult {
  if (!measure || !measure.trim())
    return { ml: null, count: null, garnish: false };
  const m = measure.toLowerCase().trim();

  // "Juice of 1/2" (a lemon/lime): about 15 ml per half fruit.
  const juiceOf = m.match(JUICE_OF);
  if (juiceOf) {
    const q = parseQuantity(juiceOf[1]) ?? 1;
    return { ml: Math.round(q * 30), count: null, garnish: false };
  }

  const qty = parseQuantity(m);

  for (const [re, ml] of UNITS) {
    if (re.test(m)) {
      return { ml: round((qty ?? 1) * ml), count: null, garnish: false };
    }
  }

  if (FILL.test(m)) return { ml: 90, count: null, garnish: false };
  if (GARNISH.test(m)) return { ml: 0, count: null, garnish: true };

  // No volume unit ("1", "6 leaves", "1 slice", "Twist of"): a count of
  // something. The caller multiplies it by the ingredient's unit_ml.
  return { ml: null, count: qty ?? 1, garnish: false };
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}
