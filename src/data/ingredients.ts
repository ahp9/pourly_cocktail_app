// The built-in bar list: what ships with the app.
//
// The live list is the `ingredients` table (rows with a bar_category), which
// also holds ingredients people add themselves. This file is
//   - the starting data: the cocktail import copies shelf, alcohol type,
//     label and swatch from here into the table, and
//   - the offline fallback, until src/services/catalog.ts has loaded the table.
// The regexes only live here. Ingredients people add are matched by name.

import type {
  AlcoholTypeOption,
  BarCategory,
  Ingredient,
} from "@/types/bottle";

// Starting rows of the `alcohol_types` table (same keys as the migration).
// Add new types as rows in the table; add them here too if a built-in
// ingredient below needs one.
export const BUILT_IN_ALCOHOL_TYPES = [
  { key: "vodka", label: "Vodka", category: "spirits" },
  { key: "gin", label: "Gin", category: "spirits" },
  { key: "rum", label: "Rum", category: "spirits" },
  { key: "tequila", label: "Tequila", category: "spirits" },
  { key: "mezcal", label: "Mezcal", category: "spirits" },
  { key: "whiskey", label: "Whiskey", category: "spirits" },
  { key: "brandy", label: "Brandy", category: "spirits" },
  { key: "cachaca", label: "Cachaça", category: "spirits" },
  { key: "pisco", label: "Pisco", category: "spirits" },
  { key: "aquavit", label: "Aquavit", category: "spirits" },
  { key: "absinthe", label: "Absinthe", category: "spirits" },
  { key: "other_spirit", label: "Other spirit", category: "spirits" },
  { key: "orange_liqueur", label: "Orange liqueur", category: "liqueurs" },
  { key: "fruit_liqueur", label: "Fruit liqueur", category: "liqueurs" },
  { key: "herbal_liqueur", label: "Herbal liqueur", category: "liqueurs" },
  { key: "cream_liqueur", label: "Cream liqueur", category: "liqueurs" },
  { key: "coffee_liqueur", label: "Coffee liqueur", category: "liqueurs" },
  { key: "nut_liqueur", label: "Nut liqueur", category: "liqueurs" },
  { key: "anise_liqueur", label: "Anise liqueur", category: "liqueurs" },
  { key: "bitter_aperitif", label: "Bitter aperitif", category: "liqueurs" },
  { key: "amaro", label: "Amaro", category: "liqueurs" },
  { key: "other_liqueur", label: "Other liqueur", category: "liqueurs" },
  { key: "sparkling_wine", label: "Sparkling wine", category: "wine" },
  { key: "vermouth", label: "Vermouth", category: "wine" },
  { key: "aromatised_wine", label: "Aromatised wine", category: "wine" },
  { key: "other_wine", label: "Other wine", category: "wine" },
] as const satisfies readonly AlcoholTypeOption[];

type BuiltInAlcoholType = (typeof BUILT_IN_ALCOHOL_TYPES)[number]["key"];

// Swatch for a new ingredient until someone picks one.
export const DEFAULT_SWATCH: Record<BarCategory, string> = {
  spirits: "#B8843E",
  liqueurs: "#C9453B",
  wine: "#E6D8A0",
  mixers: "#DCE4E8",
  juices: "#F2A03D",
  fresh: "#8FB86A",
};

// Colours offered when someone adds an ingredient.
export const SWATCH_CHOICES = [
  "#EDE8DC",
  "#E6D38A",
  "#E6A24A",
  "#E5793A",
  "#C9453B",
  "#7A2140",
  "#4B1530",
  "#8FB86A",
  "#2F7FC1",
  "#B8843E",
  "#6B3A1E",
  "#3A2418",
];

export type BuiltInEntry = Ingredient & { match: RegExp };

type AlcoholicCategory = Extract<BarCategory, "spirits" | "liqueurs" | "wine">;
type OtherCategory = Exclude<BarCategory, AlcoholicCategory>;

// Bottles with alcohol: always say what kind of alcohol it is.
const a = (
  name: string,
  label: string,
  category: AlcoholicCategory,
  alcoholType: BuiltInAlcoholType,
  swatch: string,
  match: RegExp,
): BuiltInEntry => ({
  key: name.toLowerCase(),
  name,
  label,
  category,
  alcoholType,
  swatch,
  match,
});

// Everything else: mixers, juices, fresh produce.
const e = (
  name: string,
  label: string,
  category: OtherCategory,
  swatch: string,
  match: RegExp,
): BuiltInEntry => ({
  key: name.toLowerCase(),
  name,
  label,
  category,
  swatch,
  match,
});

// Order matters: specific names come before generic ones, so
// "sloe gin" wins over "gin", "irish cream" wins over "irish whiskey",
// "orange juice" wins over "orange", and "Fine Champagne Cognac" hits cognac
// before champagne. My Bar groups by `category`, so file order is only
// about matching.
// `name` is the ingredient name TheCocktailDB uses.
export const BUILT_IN_INGREDIENTS: BuiltInEntry[] = [
  // Liqueurs
  a(
    "Baileys irish cream",
    "Irish cream",
    "liqueurs",
    "cream_liqueur",
    "#C9A77C",
    /baileys|irish cream/i,
  ),
  a(
    "Kahlua",
    "Coffee liqueur",
    "liqueurs",
    "coffee_liqueur",
    "#4A2F22",
    /kahl[uú]a|coffee liqu|tia maria|espresso liqu/i,
  ),
  a(
    "Amaretto",
    "Amaretto",
    "liqueurs",
    "nut_liqueur",
    "#9B5A2A",
    /amaretto|disaronno/i,
  ),
  a("Aperol", "Aperol", "liqueurs", "bitter_aperitif", "#E5793A", /aperol/i),
  a("Campari", "Campari", "liqueurs", "bitter_aperitif", "#C9453B", /campari/i),
  a(
    "Grand Marnier",
    "Grand Marnier",
    "liqueurs",
    "orange_liqueur",
    "#D07A2E",
    /grand marnier/i,
  ),
  a(
    "Blue Curacao",
    "Blue curaçao",
    "liqueurs",
    "orange_liqueur",
    "#2F7FC1",
    /blue cura[cç]ao/i,
  ),
  // After Grand Marnier and curaçao: "orange liqueur" is the catch-all.
  a(
    "Cointreau",
    "Triple sec",
    "liqueurs",
    "orange_liqueur",
    "#E6A24A",
    /cointreau|triple sec|combier|orange liqu/i,
  ),
  a(
    "Green Chartreuse",
    "Chartreuse",
    "liqueurs",
    "herbal_liqueur",
    "#7FA64A",
    /chartreuse/i,
  ),
  a(
    "Maraschino liqueur",
    "Maraschino",
    "liqueurs",
    "fruit_liqueur",
    "#E9E1D2",
    /maraschino|luxardo/i,
  ),
  a(
    "St. Germain",
    "Elderflower liqueur",
    "liqueurs",
    "herbal_liqueur",
    "#E6D38A",
    /st[.\s-]*germain|elderflower liqu/i,
  ),
  a(
    "Chambord raspberry liqueur",
    "Raspberry liqueur",
    "liqueurs",
    "fruit_liqueur",
    "#6B1E3A",
    /chambord|raspberry liqu/i,
  ),
  a(
    "Creme de Cassis",
    "Crème de cassis",
    "liqueurs",
    "fruit_liqueur",
    "#4B1530",
    /cassis/i,
  ),
  a(
    "Midori melon liqueur",
    "Melon liqueur",
    "liqueurs",
    "fruit_liqueur",
    "#7BC043",
    /midori|melon liqu/i,
  ),
  a(
    "Peach schnapps",
    "Peach schnapps",
    "liqueurs",
    "fruit_liqueur",
    "#F0A868",
    /peach schnapps/i,
  ),
  a(
    "Passoa",
    "Passion fruit liqueur",
    "liqueurs",
    "fruit_liqueur",
    "#E64A88",
    /passo[aã]|passion[\s-]*fruit liqu/i,
  ),
  a(
    "Galliano",
    "Galliano",
    "liqueurs",
    "herbal_liqueur",
    "#E6C45C",
    /galliano/i,
  ),
  a(
    "Frangelico",
    "Hazelnut liqueur",
    "liqueurs",
    "nut_liqueur",
    "#A0673A",
    /frangelico|hazelnut liqu/i,
  ),
  a(
    "Drambuie",
    "Drambuie",
    "liqueurs",
    "herbal_liqueur",
    "#C08A3E",
    /drambuie/i,
  ),
  a(
    "Jagermeister",
    "Jägermeister",
    "liqueurs",
    "herbal_liqueur",
    "#3B2A1E",
    /j[aä]germeister/i,
  ),
  a("Sambuca", "Sambuca", "liqueurs", "anise_liqueur", "#E9E6DF", /sambuca/i),
  a(
    "Amaro Nonino",
    "Amaro",
    "liqueurs",
    "amaro",
    "#8A4B2A",
    /amaro|averna|montenegro|nonino|fernet/i,
  ),
  a(
    "Limoncello",
    "Limoncello",
    "liqueurs",
    "fruit_liqueur",
    "#E6D84A",
    /limoncello/i,
  ),
  a(
    "Sloe gin",
    "Sloe gin",
    "liqueurs",
    "fruit_liqueur",
    "#7A2140",
    /sloe gin/i,
  ),

  // Wine: fortified and aromatised (sparkling comes after the spirits)
  a(
    "Sweet Vermouth",
    "Sweet vermouth",
    "wine",
    "vermouth",
    "#7A2E35",
    /(sweet|rosso|red) vermouth|vermouth rosso|carpano|antica formula/i,
  ),
  a(
    "Dry Vermouth",
    "Dry vermouth",
    "wine",
    "vermouth",
    "#D9D2B4",
    /(dry|extra dry|bianco) vermouth|vermouth (dry|bianco)|noilly/i,
  ),
  a("Lillet Blanc", "Lillet", "wine", "aromatised_wine", "#E8C77A", /lillet/i),

  // Spirits
  a(
    "Gin",
    "Gin",
    "spirits",
    "gin",
    "#D6E4EA",
    /\bgin\b|gordon'?s|tanqueray|bombay|hendrick|beefeater/i,
  ),
  a(
    "Vodka",
    "Vodka",
    "spirits",
    "vodka",
    "#DDE3E8",
    /vodka|absolut|smirnoff|grey goose|reyka|ketel/i,
  ),
  a(
    "Spiced rum",
    "Spiced rum",
    "spirits",
    "rum",
    "#9A5B2C",
    /spiced rum|captain morgan|kraken/i,
  ),
  a(
    "Malibu rum",
    "Coconut rum",
    "spirits",
    "rum",
    "#F2EEE6",
    /malibu|coconut rum/i,
  ),
  a(
    "Dark rum",
    "Dark rum",
    "spirits",
    "rum",
    "#6B3A1E",
    /(dark|black|gold|aged|a[ñn]ejo) rum|myers|gosling/i,
  ),
  a(
    "Light rum",
    "White rum",
    "spirits",
    "rum",
    "#EDE8DC",
    /(white|light|silver|blanco|carta blanca) rum|bacardi/i,
  ),
  a("Rum", "Rum", "spirits", "rum", "#B07A3E", /\brum\b|\bron\b|rhum/i),
  a("Mezcal", "Mezcal", "spirits", "mezcal", "#D8D0B0", /mezcal/i),
  a(
    "Tequila",
    "Tequila",
    "spirits",
    "tequila",
    "#DCC98E",
    /tequila|patr[oó]n|jose cuervo|olmeca/i,
  ),
  a("Cachaca", "Cachaça", "spirits", "cachaca", "#E4DCC4", /cacha[cç]a/i),
  a("Pisco", "Pisco", "spirits", "pisco", "#E6E0CC", /pisco/i),
  a(
    "Bourbon",
    "Bourbon",
    "spirits",
    "whiskey",
    "#B8702E",
    /bourbon|jim beam|maker'?s mark|buffalo trace|wild turkey|woodford/i,
  ),
  a("Rye whiskey", "Rye whiskey", "spirits", "whiskey", "#A8662C", /\brye\b/i),
  a(
    "Irish whiskey",
    "Irish whiskey",
    "spirits",
    "whiskey",
    "#C0843A",
    /irish whiske?y|jameson|bushmills|tullamore/i,
  ),
  a(
    "Scotch",
    "Scotch",
    "spirits",
    "whiskey",
    "#B27A36",
    /scotch|single malt|johnnie walker|glen|laphroaig|talisker/i,
  ),
  a(
    "Blended whiskey",
    "Whiskey",
    "spirits",
    "whiskey",
    "#B8843E",
    /whiske?y|jack daniel/i,
  ),
  a(
    "Cognac",
    "Cognac",
    "spirits",
    "brandy",
    "#A0562A",
    /cognac|hennessy|r[eé]my martin|courvoisier/i,
  ),
  a(
    "Brandy",
    "Brandy",
    "spirits",
    "brandy",
    "#A8602E",
    /brandy|armagnac|calvados/i,
  ),
  a("Absinthe", "Absinthe", "spirits", "absinthe", "#8FB86A", /absinthe/i),

  // Wine: sparkling
  a("Prosecco", "Prosecco", "wine", "sparkling_wine", "#E8DC9A", /prosecco/i),
  a(
    "Champagne",
    "Champagne",
    "wine",
    "sparkling_wine",
    "#E6D8A0",
    /champagne|cava|cr[eé]mant|sparkling wine|spumante/i,
  ),

  // Mixers: bitters, sodas, syrups
  e(
    "Angostura bitters",
    "Angostura bitters",
    "mixers",
    "#8A2A1E",
    /angostura|aromatic bitters/i,
  ),
  e("Orange bitters", "Orange bitters", "mixers", "#E5793A", /orange bitters/i),
  e("Tonic water", "Tonic", "mixers", "#DDE8EA", /tonic/i),
  e("Ginger beer", "Ginger beer", "mixers", "#D8B26A", /ginger beer/i),
  e("Ginger ale", "Ginger ale", "mixers", "#E0C27A", /ginger ale/i),
  e(
    "Soda water",
    "Soda",
    "mixers",
    "#DCE4E8",
    /soda water|club soda|sparkling water|seltzer/i,
  ),
  e("Cola", "Cola", "mixers", "#3A2418", /\bcola\b|coca-cola|pepsi/i),
  e("Grenadine", "Grenadine", "mixers", "#B0263A", /grenadine/i),
  e("Orgeat syrup", "Orgeat", "mixers", "#E9D8B8", /orgeat/i),
  e(
    "Sugar syrup",
    "Simple syrup",
    "mixers",
    "#EDE6D6",
    /simple syrup|sugar syrup|gomme/i,
  ),

  // Juices: before Fresh, so "orange juice" doesn't match "orange"
  e("Orange juice", "Orange juice", "juices", "#F2A03D", /orange juice/i),
  e(
    "Pineapple juice",
    "Pineapple juice",
    "juices",
    "#F2D35C",
    /pineapple juice/i,
  ),
  e("Cranberry juice", "Cranberry juice", "juices", "#A3233A", /cranberry/i),
  e(
    "Grapefruit juice",
    "Grapefruit juice",
    "juices",
    "#E8826A",
    /grapefruit juice/i,
  ),
  e("Apple juice", "Apple juice", "juices", "#E3C46B", /\bapple juice/i),
  e("Lime juice", "Lime juice", "juices", "#C9D97A", /lime juice/i),
  e("Lemon juice", "Lemon juice", "juices", "#F0E08A", /lemon juice/i),

  // Fresh: whole fruit and herbs
  e("Orange", "Orange", "fresh", "#F28C28", /\boranges?\b/i),
  e("Lime", "Lime", "fresh", "#8FB86A", /\blimes?\b/i),
  e("Lemon", "Lemon", "fresh", "#E6C45C", /\blemons?\b/i),
  e("Mint", "Mint", "fresh", "#5FA05A", /\bmint\b/i),
  e("Basil", "Basil", "fresh", "#6FA04A", /\bbasil\b/i),
];
