import type { BarCategory, Ingredient } from "@/types/bottle";

type Entry = Ingredient & { match: RegExp };

const e = (
  name: string,
  label: string,
  category: BarCategory,
  swatch: string,
  match: RegExp,
): Entry => ({ name, label, category, swatch, match });

// Order matters: specific names come before generic ones, so
// "sloe gin" wins over "gin" and "irish cream" wins over "irish whiskey".
// `name` is the ingredient name TheCocktailDB uses.
export const INGREDIENTS: Entry[] = [
  // Liqueurs
  e(
    "Baileys irish cream",
    "Irish cream",
    "liqueurs",
    "#C9A77C",
    /baileys|irish cream/i,
  ),
  e(
    "Kahlua",
    "Coffee liqueur",
    "liqueurs",
    "#4A2F22",
    /kahl[uú]a|coffee liqu|tia maria|espresso liqu/i,
  ),
  e("Amaretto", "Amaretto", "liqueurs", "#9B5A2A", /amaretto|disaronno/i),
  e("Aperol", "Aperol", "liqueurs", "#E5793A", /aperol/i),
  e("Campari", "Campari", "liqueurs", "#C9453B", /campari/i),
  e(
    "Cointreau",
    "Triple sec",
    "liqueurs",
    "#E6A24A",
    /cointreau|triple sec|combier/i,
  ),
  e("Grand Marnier", "Grand Marnier", "liqueurs", "#D07A2E", /grand marnier/i),
  e("Blue Curacao", "Blue curaçao", "liqueurs", "#2F7FC1", /blue cura[cç]ao/i),
  e("Green Chartreuse", "Chartreuse", "liqueurs", "#7FA64A", /chartreuse/i),
  e(
    "Maraschino liqueur",
    "Maraschino",
    "liqueurs",
    "#E9E1D2",
    /maraschino|luxardo/i,
  ),
  e(
    "St. Germain",
    "Elderflower liqueur",
    "liqueurs",
    "#E6D38A",
    /st[.\s-]*germain|elderflower liqu/i,
  ),
  e(
    "Chambord raspberry liqueur",
    "Raspberry liqueur",
    "liqueurs",
    "#6B1E3A",
    /chambord|raspberry liqu/i,
  ),
  e("Creme de Cassis", "Crème de cassis", "liqueurs", "#4B1530", /cassis/i),
  e(
    "Midori melon liqueur",
    "Melon liqueur",
    "liqueurs",
    "#7BC043",
    /midori|melon liqu/i,
  ),
  e(
    "Peach schnapps",
    "Peach schnapps",
    "liqueurs",
    "#F0A868",
    /peach schnapps/i,
  ),
  e("Galliano", "Galliano", "liqueurs", "#E6C45C", /galliano/i),
  e(
    "Frangelico",
    "Hazelnut liqueur",
    "liqueurs",
    "#A0673A",
    /frangelico|hazelnut liqu/i,
  ),
  e("Drambuie", "Drambuie", "liqueurs", "#C08A3E", /drambuie/i),
  e("Jagermeister", "Jägermeister", "liqueurs", "#3B2A1E", /j[aä]germeister/i),
  e("Sambuca", "Sambuca", "liqueurs", "#E9E6DF", /sambuca/i),
  e(
    "Amaro Nonino",
    "Amaro",
    "liqueurs",
    "#8A4B2A",
    /amaro|averna|montenegro|nonino|fernet/i,
  ),
  e("Limoncello", "Limoncello", "liqueurs", "#E6D84A", /limoncello/i),
  e(
    "Sweet Vermouth",
    "Sweet vermouth",
    "liqueurs",
    "#7A2E35",
    /(sweet|rosso|red) vermouth|vermouth rosso|carpano|antica formula/i,
  ),
  e(
    "Dry Vermouth",
    "Dry vermouth",
    "liqueurs",
    "#D9D2B4",
    /(dry|extra dry|bianco) vermouth|vermouth (dry|bianco)|noilly/i,
  ),
  e("Lillet Blanc", "Lillet", "liqueurs", "#E8C77A", /lillet/i),

  // Spirits
  e("Sloe gin", "Sloe gin", "spirits", "#7A2140", /sloe gin/i),
  e(
    "Gin",
    "Gin",
    "spirits",
    "#D6E4EA",
    /\bgin\b|gordon'?s|tanqueray|bombay|hendrick|beefeater/i,
  ),
  e(
    "Vodka",
    "Vodka",
    "spirits",
    "#DDE3E8",
    /vodka|absolut|smirnoff|grey goose|reyka|ketel/i,
  ),
  e(
    "Spiced rum",
    "Spiced rum",
    "spirits",
    "#9A5B2C",
    /spiced rum|captain morgan|kraken/i,
  ),
  e("Malibu rum", "Coconut rum", "spirits", "#F2EEE6", /malibu|coconut rum/i),
  e(
    "Dark rum",
    "Dark rum",
    "spirits",
    "#6B3A1E",
    /(dark|black|gold|aged|a[ñn]ejo) rum|myers|gosling/i,
  ),
  e(
    "Light rum",
    "White rum",
    "spirits",
    "#EDE8DC",
    /(white|light|silver|blanco|carta blanca) rum|bacardi/i,
  ),
  e("Rum", "Rum", "spirits", "#B07A3E", /\brum\b|\bron\b|rhum/i),
  e("Mezcal", "Mezcal", "spirits", "#D8D0B0", /mezcal/i),
  e(
    "Tequila",
    "Tequila",
    "spirits",
    "#DCC98E",
    /tequila|patr[oó]n|jose cuervo|olmeca/i,
  ),
  e("Cachaca", "Cachaça", "spirits", "#E4DCC4", /cacha[cç]a/i),
  e("Pisco", "Pisco", "spirits", "#E6E0CC", /pisco/i),
  e(
    "Bourbon",
    "Bourbon",
    "spirits",
    "#B8702E",
    /bourbon|jim beam|maker'?s mark|buffalo trace|wild turkey|woodford/i,
  ),
  e("Rye whiskey", "Rye whiskey", "spirits", "#A8662C", /\brye\b/i),
  e(
    "Irish whiskey",
    "Irish whiskey",
    "spirits",
    "#C0843A",
    /irish whiske?y|jameson|bushmills|tullamore/i,
  ),
  e(
    "Scotch",
    "Scotch",
    "spirits",
    "#B27A36",
    /scotch|single malt|johnnie walker|glen|laphroaig|talisker/i,
  ),
  e(
    "Blended whiskey",
    "Whiskey",
    "spirits",
    "#B8843E",
    /whiske?y|jack daniel/i,
  ),
  e(
    "Cognac",
    "Cognac",
    "spirits",
    "#A0562A",
    /cognac|hennessy|r[eé]my martin|courvoisier/i,
  ),
  e("Brandy", "Brandy", "spirits", "#A8602E", /brandy|armagnac|calvados/i),
  e("Absinthe", "Absinthe", "spirits", "#8FB86A", /absinthe/i),
  e(
    "Passoa",
    "Passion fruit liqueur",
    "liqueurs",
    "#e64a88",
    /passo[aã]|passion[\s-]*fruit liqu/i,
  ),

  // Mixers
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
  e("Prosecco", "Prosecco", "mixers", "#E8DC9A", /prosecco/i),
  e(
    "Champagne",
    "Champagne",
    "mixers",
    "#E6D8A0",
    /champagne|cava|cr[eé]mant/i,
  ),
  e("Grenadine", "Grenadine", "mixers", "#B0263A", /grenadine/i),
  e("Orgeat syrup", "Orgeat", "mixers", "#E9D8B8", /orgeat/i),
  e(
    "Sugar syrup",
    "Simple syrup",
    "mixers",
    "#EDE6D6",
    /simple syrup|sugar syrup|gomme/i,
  ),

  // Fresh
  e("Lime", "Lime", "fresh", "#8FB86A", /\blime\b/i),
  e("Lemon", "Lemon", "fresh", "#E6C45C", /\blemon\b/i),
  e("Mint", "Mint", "fresh", "#5FA05A", /\bmint\b/i),
  e("Basil", "Basil", "fresh", "#6FA04A", /\bbasil\b/i),
];

const strip = ({ match: _match, ...ingredient }: Entry): Ingredient =>
  ingredient;

// Text from a barcode lookup or a label -> the ingredient recipes use.
export function normalizeIngredient(text: string): Ingredient | null {
  const hit = INGREDIENTS.find((i) => i.match.test(text));
  return hit ? strip(hit) : null;
}

// For manual search and the "Change" picker.
export function searchIngredients(query: string): Ingredient[] {
  const q = query.trim().toLowerCase();
  const all = INGREDIENTS.map(strip);
  if (!q) return all;
  return all.filter(
    (i) =>
      i.label.toLowerCase().includes(q) || i.name.toLowerCase().includes(q),
  );
}
