// Starting flavour data for common CocktailDB ingredients.
//
// These values are a DRAFT written by Claude from general bar knowledge, not
// measured data. Every row is imported with reviewed = false. Check them,
// fix what's off (in this file or straight in the Supabase table), and set
// reviewed = true as you go.
//
// Scores are 0..1:
//   sweet  sour  bitter  fruity  herbal  creamy  fizzy
// `intensity` = how strongly 1 ml flavours a drink (bitters, absinthe).
// `unit`      = ml for a bare count ("1" egg white, "6" mint leaves).
// `bar`       = bar_items.ingredient_name values (src/data/ingredients.ts)
//               that satisfy this recipe ingredient.

import type { Availability, Dimension, IngredientRow, Kind } from "./flavor";

type F = [number, number, number, number, number, number, number];
type Opts = {
  abv?: number;
  intensity?: number;
  unit?: number;
  availability?: Availability;
};

const DIMS: Dimension[] = [
  "sweet",
  "sour",
  "bitter",
  "fruity",
  "herbal",
  "creamy",
  "fizzy",
];

function i(
  name: string,
  kind: Kind,
  bar: string[],
  f: F,
  opts: Opts = {},
): IngredientRow {
  const availability: Availability =
    opts.availability ??
    (kind === "garnish"
      ? "garnish"
      : kind === "pantry"
        ? "pantry"
        : bar.length > 0
          ? "bar"
          : ["juice", "dairy", "fresh", "syrup", "other"].includes(kind)
            ? "grocery"
            : "bar");

  const row = {
    key: name.toLowerCase(),
    display_name: name,
    kind,
    availability,
    bar_keys: bar,
    abv: opts.abv ?? 0,
    intensity: opts.intensity ?? 1,
    unit_ml: opts.unit ?? null,
    reviewed: false,
  } as IngredientRow;
  DIMS.forEach((d, n) => (row[d] = f[n]));
  return row;
}

const RUM = ["Rum", "Light rum", "Dark rum", "Spiced rum"];
const WHISKEY = [
  "Bourbon",
  "Rye whiskey",
  "Irish whiskey",
  "Scotch",
  "Blended whiskey",
];

//                                                     sweet sour bitt fruit herb cream fizz
export const INGREDIENT_SEED: IngredientRow[] = [
  // ---- Spirits -----------------------------------------------------------
  i("Vodka", "spirit", ["Vodka"], [0, 0, 0, 0, 0, 0, 0], { abv: 40 }),
  i("Absolut Citron", "spirit", ["Vodka"], [0.05, 0.1, 0, 0.4, 0, 0, 0], {
    abv: 40,
  }),
  i("Absolut Vodka", "spirit", ["Vodka"], [0, 0, 0, 0, 0, 0, 0], { abv: 40 }),
  i("Lemon vodka", "spirit", ["Vodka"], [0.05, 0.1, 0, 0.4, 0, 0, 0], {
    abv: 40,
  }),
  i("Gin", "spirit", ["Gin"], [0, 0, 0.1, 0.1, 0.8, 0, 0], { abv: 40 }),
  i("Sloe gin", "liqueur", ["Sloe gin"], [0.6, 0.1, 0.1, 0.8, 0.2, 0, 0], {
    abv: 26,
  }),
  i("Rum", "spirit", RUM, [0.15, 0, 0, 0.1, 0, 0, 0], { abv: 40 }),
  i("Light rum", "spirit", ["Light rum", "Rum"], [0.1, 0, 0, 0.05, 0, 0, 0], {
    abv: 40,
  }),
  i("White rum", "spirit", ["Light rum", "Rum"], [0.1, 0, 0, 0.05, 0, 0, 0], {
    abv: 40,
  }),
  i(
    "Gold rum",
    "spirit",
    ["Rum", "Dark rum", "Light rum"],
    [0.2, 0, 0, 0.1, 0, 0, 0],
    { abv: 40 },
  ),
  i(
    "Dark rum",
    "spirit",
    ["Dark rum", "Rum"],
    [0.3, 0, 0.05, 0.1, 0.05, 0, 0],
    { abv: 40 },
  ),
  i(
    "Añejo rum",
    "spirit",
    ["Dark rum", "Rum"],
    [0.25, 0, 0.05, 0.1, 0.05, 0, 0],
    { abv: 40 },
  ),
  i(
    "Spiced rum",
    "spirit",
    ["Spiced rum", "Rum"],
    [0.35, 0, 0, 0.1, 0.3, 0, 0],
    { abv: 35 },
  ),
  i(
    "151 proof rum",
    "spirit",
    ["Rum", "Dark rum"],
    [0.15, 0, 0.05, 0.05, 0, 0, 0],
    { abv: 75 },
  ),
  i(
    "Bacardi Limon",
    "spirit",
    ["Light rum", "Rum"],
    [0.2, 0.1, 0, 0.5, 0, 0, 0],
    { abv: 35 },
  ),
  i("Malibu rum", "liqueur", ["Malibu rum"], [0.7, 0, 0, 0.5, 0, 0.3, 0], {
    abv: 21,
  }),
  i("Coconut rum", "liqueur", ["Malibu rum"], [0.7, 0, 0, 0.5, 0, 0.3, 0], {
    abv: 21,
  }),
  i("Cachaca", "spirit", ["Cachaca"], [0.1, 0, 0, 0.15, 0.1, 0, 0], {
    abv: 40,
  }),
  i("Tequila", "spirit", ["Tequila"], [0.05, 0, 0.05, 0.05, 0.4, 0, 0], {
    abv: 40,
  }),
  i("Mezcal", "spirit", ["Mezcal"], [0.05, 0, 0.15, 0.05, 0.4, 0, 0], {
    abv: 42,
  }),
  i("Pisco", "spirit", ["Pisco"], [0.1, 0, 0, 0.35, 0.1, 0, 0], { abv: 40 }),
  i("Whiskey", "spirit", WHISKEY, [0.15, 0, 0.1, 0.05, 0.1, 0, 0], { abv: 40 }),
  i("Bourbon", "spirit", ["Bourbon"], [0.25, 0, 0.1, 0.05, 0.1, 0, 0], {
    abv: 43,
  }),
  i(
    "Rye whiskey",
    "spirit",
    ["Rye whiskey", "Bourbon"],
    [0.1, 0, 0.15, 0, 0.25, 0, 0],
    { abv: 45 },
  ),
  i(
    "Irish whiskey",
    "spirit",
    ["Irish whiskey"],
    [0.15, 0, 0.05, 0.1, 0.05, 0, 0],
    { abv: 40 },
  ),
  i("Scotch", "spirit", ["Scotch"], [0.1, 0, 0.2, 0.05, 0.15, 0, 0], {
    abv: 40,
  }),
  i("Blended whiskey", "spirit", WHISKEY, [0.15, 0, 0.1, 0.05, 0.1, 0, 0], {
    abv: 40,
  }),
  i(
    "Johnnie Walker",
    "spirit",
    ["Scotch", "Blended whiskey"],
    [0.1, 0, 0.2, 0.05, 0.15, 0, 0],
    { abv: 40 },
  ),
  i(
    "Jack Daniels",
    "spirit",
    ["Bourbon", "Blended whiskey"],
    [0.25, 0, 0.1, 0.05, 0.1, 0, 0],
    { abv: 40 },
  ),
  i(
    "Crown Royal",
    "spirit",
    ["Blended whiskey"],
    [0.2, 0, 0.05, 0.05, 0.05, 0, 0],
    { abv: 40 },
  ),
  i("Brandy", "spirit", ["Brandy", "Cognac"], [0.2, 0, 0.05, 0.3, 0.05, 0, 0], {
    abv: 40,
  }),
  i("Cognac", "spirit", ["Cognac", "Brandy"], [0.2, 0, 0.05, 0.3, 0.05, 0, 0], {
    abv: 40,
  }),
  i("Apple brandy", "spirit", ["Brandy"], [0.2, 0.05, 0, 0.6, 0, 0, 0], {
    abv: 40,
  }),
  i("Applejack", "spirit", ["Brandy"], [0.2, 0.05, 0, 0.6, 0, 0, 0], {
    abv: 40,
  }),
  i("Apricot brandy", "liqueur", [], [0.7, 0.05, 0, 0.8, 0, 0, 0], { abv: 24 }),
  i("Cherry brandy", "liqueur", [], [0.7, 0.05, 0.05, 0.8, 0, 0, 0], {
    abv: 24,
  }),
  i("Absinthe", "spirit", ["Absinthe"], [0.1, 0, 0.3, 0, 1, 0, 0], {
    abv: 60,
    intensity: 3,
  }),
  i("Everclear", "spirit", ["Vodka"], [0, 0, 0, 0, 0, 0, 0], { abv: 95 }),
  i("Aquavit", "spirit", [], [0, 0, 0.1, 0, 0.8, 0, 0], { abv: 40 }),

  // ---- Liqueurs & aperitifs ------------------------------------------------
  i(
    "Triple sec",
    "liqueur",
    ["Cointreau", "Grand Marnier"],
    [0.8, 0.05, 0.1, 0.8, 0, 0, 0],
    { abv: 30 },
  ),
  i("Cointreau", "liqueur", ["Cointreau"], [0.7, 0.05, 0.1, 0.8, 0, 0, 0], {
    abv: 40,
  }),
  i(
    "Grand Marnier",
    "liqueur",
    ["Grand Marnier", "Cointreau"],
    [0.7, 0, 0.1, 0.7, 0, 0, 0],
    { abv: 40 },
  ),
  i(
    "Blue Curacao",
    "liqueur",
    ["Blue Curacao"],
    [0.85, 0.05, 0.1, 0.7, 0, 0, 0],
    { abv: 25 },
  ),
  i(
    "Curacao",
    "liqueur",
    ["Blue Curacao", "Cointreau"],
    [0.8, 0.05, 0.1, 0.7, 0, 0, 0],
    { abv: 25 },
  ),
  i("Amaretto", "liqueur", ["Amaretto"], [0.9, 0, 0.1, 0.2, 0.1, 0.1, 0], {
    abv: 28,
  }),
  i("Kahlua", "liqueur", ["Kahlua"], [0.9, 0, 0.3, 0, 0, 0.1, 0], { abv: 20 }),
  i("Coffee liqueur", "liqueur", ["Kahlua"], [0.9, 0, 0.3, 0, 0, 0.1, 0], {
    abv: 20,
  }),
  i("Tia maria", "liqueur", ["Kahlua"], [0.85, 0, 0.3, 0, 0, 0.1, 0], {
    abv: 20,
  }),
  i(
    "Baileys irish cream",
    "liqueur",
    ["Baileys irish cream"],
    [0.8, 0, 0.05, 0, 0, 1, 0],
    { abv: 17 },
  ),
  i(
    "Irish cream",
    "liqueur",
    ["Baileys irish cream"],
    [0.8, 0, 0.05, 0, 0, 1, 0],
    { abv: 17 },
  ),
  i("Aperol", "liqueur", ["Aperol"], [0.6, 0.05, 0.5, 0.6, 0.2, 0, 0], {
    abv: 11,
  }),
  i("Campari", "liqueur", ["Campari"], [0.45, 0, 0.9, 0.4, 0.4, 0, 0], {
    abv: 25,
  }),
  i(
    "Sweet Vermouth",
    "wine",
    ["Sweet Vermouth"],
    [0.6, 0.05, 0.3, 0.3, 0.5, 0, 0],
    { abv: 16 },
  ),
  i("Dry Vermouth", "wine", ["Dry Vermouth"], [0.1, 0.1, 0.2, 0.1, 0.6, 0, 0], {
    abv: 18,
  }),
  i(
    "Vermouth",
    "wine",
    ["Sweet Vermouth", "Dry Vermouth"],
    [0.35, 0.05, 0.25, 0.2, 0.55, 0, 0],
    { abv: 17 },
  ),
  i("Lillet Blanc", "wine", ["Lillet Blanc"], [0.5, 0.1, 0.2, 0.5, 0.3, 0, 0], {
    abv: 17,
  }),
  i("Lillet", "wine", ["Lillet Blanc"], [0.5, 0.1, 0.2, 0.5, 0.3, 0, 0], {
    abv: 17,
  }),
  i(
    "Green Chartreuse",
    "liqueur",
    ["Green Chartreuse"],
    [0.5, 0, 0.3, 0, 1, 0, 0],
    { abv: 55, intensity: 1.5 },
  ),
  i(
    "Yellow Chartreuse",
    "liqueur",
    ["Green Chartreuse"],
    [0.7, 0, 0.2, 0.1, 0.8, 0, 0],
    { abv: 40 },
  ),
  i("Chartreuse", "liqueur", ["Green Chartreuse"], [0.55, 0, 0.3, 0, 1, 0, 0], {
    abv: 55,
    intensity: 1.5,
  }),
  i("Benedictine", "liqueur", [], [0.75, 0, 0.2, 0.1, 0.8, 0, 0], { abv: 40 }),
  i(
    "Maraschino liqueur",
    "liqueur",
    ["Maraschino liqueur"],
    [0.7, 0, 0.1, 0.6, 0.2, 0, 0],
    { abv: 32, intensity: 1.3 },
  ),
  i("St. Germain", "liqueur", ["St. Germain"], [0.8, 0.05, 0, 0.7, 0.3, 0, 0], {
    abv: 20,
  }),
  i(
    "Elderflower cordial",
    "syrup",
    ["St. Germain"],
    [0.9, 0.1, 0, 0.6, 0.3, 0, 0],
  ),
  i(
    "Chambord raspberry liqueur",
    "liqueur",
    ["Chambord raspberry liqueur"],
    [0.85, 0.1, 0, 1, 0, 0, 0],
    { abv: 16 },
  ),
  i(
    "Raspberry liqueur",
    "liqueur",
    ["Chambord raspberry liqueur"],
    [0.85, 0.1, 0, 1, 0, 0, 0],
    { abv: 16 },
  ),
  i(
    "Creme de Cassis",
    "liqueur",
    ["Creme de Cassis"],
    [0.9, 0.1, 0, 1, 0, 0, 0],
    { abv: 16 },
  ),
  i(
    "Midori melon liqueur",
    "liqueur",
    ["Midori melon liqueur"],
    [0.9, 0, 0, 0.9, 0, 0, 0],
    { abv: 20 },
  ),
  i(
    "Peach schnapps",
    "liqueur",
    ["Peach schnapps"],
    [0.85, 0, 0, 0.9, 0, 0, 0],
    { abv: 20 },
  ),
  i("Peach brandy", "liqueur", ["Peach schnapps"], [0.7, 0, 0, 0.8, 0, 0, 0], {
    abv: 30,
  }),
  i("Galliano", "liqueur", ["Galliano"], [0.85, 0, 0.1, 0.1, 0.7, 0.05, 0], {
    abv: 30,
  }),
  i("Frangelico", "liqueur", ["Frangelico"], [0.85, 0, 0.05, 0, 0.1, 0.2, 0], {
    abv: 20,
  }),
  i("Drambuie", "liqueur", ["Drambuie"], [0.8, 0, 0.1, 0.1, 0.5, 0, 0], {
    abv: 40,
  }),
  i("Jägermeister", "liqueur", ["Jagermeister"], [0.6, 0, 0.5, 0, 0.9, 0, 0], {
    abv: 35,
  }),
  i("Jagermeister", "liqueur", ["Jagermeister"], [0.6, 0, 0.5, 0, 0.9, 0, 0], {
    abv: 35,
  }),
  i("Sambuca", "liqueur", ["Sambuca"], [0.85, 0, 0.1, 0, 0.9, 0, 0], {
    abv: 40,
  }),
  i("Anis", "liqueur", ["Sambuca", "Absinthe"], [0.6, 0, 0.1, 0, 0.9, 0, 0], {
    abv: 40,
  }),
  i("Anisette", "liqueur", ["Sambuca"], [0.8, 0, 0.1, 0, 0.9, 0, 0], {
    abv: 25,
  }),
  i("Pernod", "liqueur", ["Absinthe", "Sambuca"], [0.4, 0, 0.2, 0, 1, 0, 0], {
    abv: 40,
    intensity: 2,
  }),
  i("Ricard", "liqueur", ["Absinthe", "Sambuca"], [0.4, 0, 0.2, 0, 1, 0, 0], {
    abv: 45,
    intensity: 2,
  }),
  i("Ouzo", "liqueur", ["Sambuca"], [0.4, 0, 0.1, 0, 1, 0, 0], {
    abv: 40,
    intensity: 1.5,
  }),
  i(
    "Amaro Montenegro",
    "liqueur",
    ["Amaro Nonino"],
    [0.6, 0, 0.6, 0.3, 0.6, 0, 0],
    { abv: 23 },
  ),
  i(
    "Amaro Nonino",
    "liqueur",
    ["Amaro Nonino"],
    [0.5, 0, 0.6, 0.3, 0.6, 0, 0],
    { abv: 35 },
  ),
  i("Fernet-Branca", "liqueur", [], [0.2, 0, 1, 0, 1, 0, 0], {
    abv: 39,
    intensity: 2,
  }),
  i("Limoncello", "liqueur", ["Limoncello"], [0.85, 0.3, 0.05, 0.8, 0, 0, 0], {
    abv: 30,
  }),
  i("Passoa", "liqueur", ["Passoa"], [0.85, 0.2, 0, 1, 0, 0, 0], { abv: 17 }),
  i("Creme de Cacao", "liqueur", [], [0.9, 0, 0.1, 0, 0, 0.3, 0], { abv: 25 }),
  i("White Creme de Menthe", "liqueur", [], [0.9, 0, 0, 0, 0.9, 0, 0], {
    abv: 24,
  }),
  i("Green Creme de Menthe", "liqueur", [], [0.9, 0, 0, 0, 0.9, 0, 0], {
    abv: 24,
  }),
  i("Creme de Menthe", "liqueur", [], [0.9, 0, 0, 0, 0.9, 0, 0], { abv: 24 }),
  i("Creme de Banane", "liqueur", [], [0.9, 0, 0, 0.9, 0, 0.1, 0], { abv: 20 }),
  i("Southern Comfort", "liqueur", [], [0.7, 0, 0.05, 0.5, 0.1, 0, 0], {
    abv: 35,
  }),
  i("Goldschlager", "liqueur", [], [0.85, 0, 0, 0, 0.5, 0, 0], { abv: 43 }),
  i("Butterscotch schnapps", "liqueur", [], [0.95, 0, 0, 0, 0, 0.3, 0], {
    abv: 20,
  }),
  i("Peppermint schnapps", "liqueur", [], [0.8, 0, 0, 0, 0.9, 0, 0], {
    abv: 30,
  }),
  i("Apple schnapps", "liqueur", [], [0.85, 0.15, 0, 0.9, 0, 0, 0], {
    abv: 20,
  }),
  i("Strawberry schnapps", "liqueur", [], [0.85, 0, 0, 0.9, 0, 0, 0], {
    abv: 20,
  }),
  i("Advocaat", "liqueur", [], [0.8, 0, 0, 0, 0, 1, 0], { abv: 17 }),
  i("Cherry Heering", "liqueur", [], [0.8, 0.05, 0.1, 0.9, 0.1, 0, 0], {
    abv: 24,
  }),

  // ---- Bitters ----------------------------------------------------------
  i(
    "Angostura bitters",
    "bitters",
    ["Angostura bitters"],
    [0.1, 0, 1, 0.1, 0.8, 0, 0],
    { abv: 44, intensity: 8 },
  ),
  i(
    "Bitters",
    "bitters",
    ["Angostura bitters", "Orange bitters"],
    [0.1, 0, 1, 0.1, 0.8, 0, 0],
    { abv: 44, intensity: 8 },
  ),
  i(
    "Orange bitters",
    "bitters",
    ["Orange bitters", "Angostura bitters"],
    [0.05, 0, 0.9, 0.5, 0.4, 0, 0],
    { abv: 40, intensity: 8 },
  ),
  i(
    "Peychaud bitters",
    "bitters",
    ["Angostura bitters"],
    [0.2, 0, 0.8, 0.3, 0.8, 0, 0],
    { abv: 35, intensity: 8 },
  ),

  // ---- Wine, beer, cider -------------------------------------------------
  i(
    "Champagne",
    "wine",
    ["Champagne", "Prosecco"],
    [0.1, 0.3, 0.05, 0.3, 0, 0, 1],
    { abv: 12 },
  ),
  i(
    "Prosecco",
    "wine",
    ["Prosecco", "Champagne"],
    [0.25, 0.25, 0, 0.4, 0, 0, 1],
    { abv: 11 },
  ),
  i(
    "Sparkling wine",
    "wine",
    ["Prosecco", "Champagne"],
    [0.2, 0.25, 0, 0.35, 0, 0, 1],
    { abv: 11 },
  ),
  i("Red wine", "wine", [], [0.1, 0.2, 0.25, 0.6, 0.1, 0, 0], { abv: 13 }),
  i("White wine", "wine", [], [0.15, 0.3, 0.05, 0.5, 0.1, 0, 0], { abv: 12 }),
  i("Port", "wine", [], [0.8, 0.05, 0.1, 0.8, 0, 0, 0], { abv: 20 }),
  i("Sherry", "wine", [], [0.3, 0.1, 0.15, 0.3, 0.2, 0, 0], { abv: 17 }),
  i("Dry sherry", "wine", [], [0.05, 0.15, 0.15, 0.2, 0.2, 0, 0], { abv: 16 }),
  i("Beer", "wine", [], [0.1, 0, 0.4, 0, 0.2, 0, 0.8], {
    abv: 5,
    availability: "grocery",
  }),
  i("Lager", "wine", [], [0.1, 0, 0.35, 0, 0.2, 0, 0.8], {
    abv: 5,
    availability: "grocery",
  }),
  i("Ale", "wine", [], [0.15, 0, 0.5, 0.1, 0.2, 0, 0.7], {
    abv: 5,
    availability: "grocery",
  }),
  i("Guinness stout", "wine", [], [0.15, 0, 0.6, 0, 0.1, 0.3, 0.4], {
    abv: 4.2,
    availability: "grocery",
  }),
  i("Cider", "wine", [], [0.5, 0.3, 0.05, 0.8, 0, 0, 0.8], {
    abv: 5,
    availability: "grocery",
  }),

  // ---- Mixers -------------------------------------------------------------
  i("Tonic water", "mixer", ["Tonic water"], [0.45, 0.05, 0.6, 0.1, 0.1, 0, 1]),
  i("Soda water", "mixer", ["Soda water"], [0, 0, 0, 0, 0, 0, 1]),
  i("Carbonated water", "mixer", ["Soda water"], [0, 0, 0, 0, 0, 0, 1]),
  i("Club soda", "mixer", ["Soda water"], [0, 0, 0, 0, 0, 0, 1]),
  i("Sparkling water", "mixer", ["Soda water"], [0, 0, 0, 0, 0, 0, 1]),
  i(
    "Ginger beer",
    "mixer",
    ["Ginger beer", "Ginger ale"],
    [0.6, 0.1, 0.1, 0.1, 0.4, 0, 0.9],
  ),
  i(
    "Ginger ale",
    "mixer",
    ["Ginger ale", "Ginger beer"],
    [0.7, 0.05, 0, 0.1, 0.2, 0, 1],
  ),
  i("Cola", "mixer", ["Cola"], [0.85, 0.1, 0.05, 0, 0.1, 0, 1]),
  i("Coca-Cola", "mixer", ["Cola"], [0.85, 0.1, 0.05, 0, 0.1, 0, 1]),
  i("Pepsi Cola", "mixer", ["Cola"], [0.85, 0.1, 0.05, 0, 0.1, 0, 1]),
  i("7-Up", "mixer", [], [0.85, 0.2, 0, 0.4, 0, 0, 1], {
    availability: "grocery",
  }),
  i("Sprite", "mixer", [], [0.85, 0.2, 0, 0.4, 0, 0, 1], {
    availability: "grocery",
  }),
  i("Lemon-lime soda", "mixer", [], [0.85, 0.2, 0, 0.4, 0, 0, 1], {
    availability: "grocery",
  }),
  i("Lemonade", "mixer", [], [0.75, 0.5, 0, 0.6, 0, 0, 0.3], {
    availability: "grocery",
  }),
  i("Pink lemonade", "mixer", [], [0.8, 0.45, 0, 0.7, 0, 0, 0.3], {
    availability: "grocery",
  }),
  i("Red Bull", "mixer", [], [0.85, 0.2, 0.05, 0.3, 0, 0, 0.9], {
    availability: "grocery",
  }),
  i("Sweet and sour", "syrup", [], [0.7, 0.7, 0, 0.4, 0, 0, 0]),
  i("Sour mix", "syrup", [], [0.7, 0.7, 0, 0.4, 0, 0, 0]),

  // ---- Juices ---------------------------------------------------------------
  i("Lime juice", "juice", ["Lime"], [0.05, 1, 0.05, 0.5, 0, 0, 0]),
  i("Lemon juice", "juice", ["Lemon"], [0.05, 1, 0.05, 0.5, 0, 0, 0]),
  i("Fresh lime juice", "juice", ["Lime"], [0.05, 1, 0.05, 0.5, 0, 0, 0]),
  i("Fresh lemon juice", "juice", ["Lemon"], [0.05, 1, 0.05, 0.5, 0, 0, 0]),
  i("Lime juice cordial", "syrup", ["Lime"], [0.8, 0.6, 0, 0.5, 0, 0, 0]),
  i("Rose's lime juice", "syrup", ["Lime"], [0.8, 0.6, 0, 0.5, 0, 0, 0]),
  i("Orange juice", "juice", [], [0.55, 0.35, 0, 0.9, 0, 0, 0]),
  i("Pineapple juice", "juice", [], [0.65, 0.35, 0, 1, 0, 0.05, 0]),
  i("Cranberry juice", "juice", [], [0.45, 0.45, 0.15, 0.9, 0, 0, 0]),
  i("Grapefruit juice", "juice", [], [0.3, 0.55, 0.35, 0.85, 0, 0, 0]),
  i("Apple juice", "juice", [], [0.7, 0.3, 0, 0.9, 0, 0, 0]),
  i("Passion fruit juice", "juice", [], [0.6, 0.5, 0, 1, 0, 0, 0]),
  i("Mango juice", "juice", [], [0.75, 0.2, 0, 1, 0, 0.1, 0]),
  i("Peach nectar", "juice", [], [0.8, 0.15, 0, 1, 0, 0.1, 0]),
  i("Tomato juice", "juice", [], [0.2, 0.35, 0.05, 0.3, 0.4, 0, 0]),
  i("Clamato juice", "juice", [], [0.2, 0.3, 0.05, 0.2, 0.5, 0, 0]),

  // ---- Syrups & sweeteners ---------------------------------------------------
  i("Sugar syrup", "syrup", ["Sugar syrup"], [1, 0, 0, 0, 0, 0, 0]),
  i("Simple syrup", "syrup", ["Sugar syrup"], [1, 0, 0, 0, 0, 0, 0]),
  i("Grenadine", "syrup", ["Grenadine"], [1, 0.1, 0, 0.7, 0, 0, 0]),
  i("Orgeat syrup", "syrup", ["Orgeat syrup"], [0.95, 0, 0, 0.1, 0.1, 0.3, 0]),
  i("Honey syrup", "syrup", [], [1, 0, 0, 0.1, 0.1, 0, 0], {
    availability: "pantry",
  }),
  i("Honey", "syrup", [], [1, 0, 0, 0.1, 0.1, 0, 0], {
    availability: "pantry",
    intensity: 1.5,
  }),
  i("Maple syrup", "syrup", [], [1, 0, 0.05, 0, 0.1, 0, 0], {
    availability: "grocery",
  }),
  i("Agave syrup", "syrup", [], [1, 0, 0, 0.05, 0.1, 0, 0], {
    availability: "grocery",
  }),
  i("Raspberry syrup", "syrup", [], [0.95, 0.1, 0, 1, 0, 0, 0]),
  i("Passion fruit syrup", "syrup", [], [0.9, 0.2, 0, 1, 0, 0, 0]),
  i("Falernum", "syrup", [], [0.85, 0.1, 0, 0.3, 0.5, 0, 0], { abv: 11 }),
  i("Sugar", "pantry", [], [1, 0, 0, 0, 0, 0, 0]),
  i("Powdered sugar", "pantry", [], [1, 0, 0, 0, 0, 0, 0]),
  i("Brown sugar", "pantry", [], [1, 0, 0, 0, 0.1, 0, 0]),

  // ---- Dairy, egg, coconut, coffee -----------------------------------------------
  i("Cream", "dairy", [], [0.15, 0, 0, 0, 0, 1, 0]),
  i("Heavy cream", "dairy", [], [0.15, 0, 0, 0, 0, 1, 0]),
  i("Light cream", "dairy", [], [0.15, 0, 0, 0, 0, 0.9, 0]),
  i("Whipping cream", "dairy", [], [0.15, 0, 0, 0, 0, 1, 0]),
  i("Whipped cream", "dairy", [], [0.4, 0, 0, 0, 0, 1, 0], {
    availability: "garnish",
  }),
  i("Half-and-half", "dairy", [], [0.15, 0, 0, 0, 0, 0.8, 0]),
  i("Milk", "dairy", [], [0.2, 0, 0, 0, 0, 0.7, 0]),
  i("Vanilla ice-cream", "dairy", [], [0.9, 0, 0, 0, 0, 1, 0]),
  i("Egg white", "dairy", [], [0, 0, 0, 0, 0, 0.6, 0], { unit: 30 }),
  i("Egg yolk", "dairy", [], [0.1, 0, 0, 0, 0, 1, 0], { unit: 18 }),
  i("Egg", "dairy", [], [0.1, 0, 0, 0, 0, 0.9, 0], { unit: 50 }),
  i("Coconut cream", "dairy", [], [0.8, 0, 0, 0.5, 0, 1, 0]),
  i("Cream of coconut", "dairy", [], [0.85, 0, 0, 0.5, 0, 1, 0]),
  i("Coconut milk", "dairy", [], [0.3, 0, 0, 0.4, 0, 0.8, 0]),
  i("Coffee", "mixer", [], [0, 0.1, 0.8, 0, 0.1, 0, 0], {
    availability: "pantry",
  }),
  i("Espresso", "mixer", [], [0, 0.15, 0.9, 0, 0.1, 0, 0], {
    availability: "pantry",
    intensity: 1.3,
  }),
  i("Hot chocolate", "mixer", [], [0.8, 0, 0.2, 0, 0, 0.8, 0], {
    availability: "grocery",
  }),
  i("Chocolate syrup", "syrup", [], [0.95, 0, 0.2, 0, 0, 0.4, 0]),
  i("Tea", "mixer", [], [0, 0.05, 0.3, 0, 0.4, 0, 0], {
    availability: "pantry",
  }),

  // ---- Fresh produce (counted, e.g. "6 leaves") ------------------------------------------
  i("Lime", "fresh", ["Lime"], [0.05, 0.9, 0.1, 0.5, 0.05, 0, 0], { unit: 15 }),
  i("Lemon", "fresh", ["Lemon"], [0.05, 0.9, 0.1, 0.5, 0.05, 0, 0], {
    unit: 15,
  }),
  i("Orange", "fresh", [], [0.5, 0.3, 0.05, 0.9, 0, 0, 0], { unit: 10 }),
  i("Mint", "fresh", ["Mint"], [0.05, 0, 0.05, 0, 1, 0, 0], {
    unit: 2,
    intensity: 6,
  }),
  i("Basil", "fresh", ["Basil"], [0.05, 0, 0.05, 0, 1, 0, 0], {
    unit: 1,
    intensity: 4,
  }),
  i("Cucumber", "fresh", [], [0.1, 0, 0.05, 0.3, 0.6, 0, 0], { unit: 10 }),
  i("Ginger", "fresh", [], [0.1, 0, 0.1, 0, 0.6, 0, 0], {
    unit: 3,
    intensity: 3,
  }),
  i("Strawberries", "fresh", [], [0.6, 0.2, 0, 1, 0, 0, 0], { unit: 15 }),
  i("Raspberries", "fresh", [], [0.5, 0.35, 0, 1, 0, 0, 0], { unit: 3 }),
  i("Blackberries", "fresh", [], [0.5, 0.3, 0.05, 1, 0, 0, 0], { unit: 4 }),
  i("Blueberries", "fresh", [], [0.6, 0.2, 0, 1, 0, 0, 0], { unit: 1 }),
  i("Banana", "fresh", [], [0.8, 0, 0, 0.9, 0, 0.5, 0], { unit: 60 }),
  i("Pineapple", "fresh", [], [0.65, 0.35, 0, 1, 0, 0, 0], { unit: 30 }),
  i("Mango", "fresh", [], [0.8, 0.15, 0, 1, 0, 0.2, 0], { unit: 60 }),
  i("Peach", "fresh", [], [0.7, 0.15, 0, 1, 0, 0, 0], { unit: 60 }),
  i("Apple", "fresh", [], [0.6, 0.3, 0, 0.9, 0, 0, 0], { unit: 30 }),
  i("Kiwi", "fresh", [], [0.5, 0.45, 0, 1, 0, 0, 0], { unit: 40 }),
  i("Passion fruit", "fresh", [], [0.5, 0.6, 0, 1, 0, 0, 0], { unit: 15 }),
  i("Watermelon", "fresh", [], [0.6, 0.05, 0, 1, 0, 0, 0], { unit: 60 }),
  i("Jalapeno", "fresh", [], [0, 0, 0.1, 0.1, 0.5, 0, 0], {
    unit: 2,
    intensity: 4,
  }),

  // ---- Savoury & spice ----------------------------------------------------------------------
  i("Tabasco sauce", "other", [], [0, 0.2, 0.1, 0, 0.4, 0, 0], {
    availability: "pantry",
    intensity: 5,
  }),
  i("Worcestershire sauce", "other", [], [0.2, 0.2, 0.2, 0, 0.5, 0, 0], {
    availability: "pantry",
    intensity: 3,
  }),
  i("Hot sauce", "other", [], [0, 0.2, 0.1, 0, 0.4, 0, 0], {
    availability: "pantry",
    intensity: 5,
  }),

  // ---- Pantry: always available, no flavour weight ------------------------------------
  ...[
    "Ice",
    "Crushed ice",
    "Water",
    "Hot water",
    "Salt",
    "Pepper",
    "Black pepper",
    "Celery salt",
    "Nutmeg",
    "Cinnamon",
    "Cloves",
    "Allspice",
    "Vanilla extract",
    "Cocoa powder",
  ].map((n) => i(n, "pantry", [], [0, 0, 0, 0, 0, 0, 0])),

  // ---- Garnish: optional, never blocks a drink --------------------------------------
  ...[
    "Cherry",
    "Maraschino cherry",
    "Olive",
    "Olives",
    "Lemon peel",
    "Lime peel",
    "Orange peel",
    "Orange spiral",
    "Lemon twist",
    "Lime wedge",
    "Lemon wedge",
    "Celery",
    "Cocktail onion",
    "Grated chocolate",
    "Chocolate",
    "Sprinkles",
    "Coconut flakes",
  ].map((n) => i(n, "garnish", [], [0, 0, 0, 0, 0, 0, 0])),
];
