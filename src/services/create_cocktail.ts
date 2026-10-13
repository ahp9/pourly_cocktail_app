import { getMakeableCocktails } from "@/services/cocktails";
import { getTaste } from "@/services/profile";
import { cocktailFlavor } from "@/styles/taste";
import {
  EMPTY_FLAVOR,
  hasFlavor,
  TASTES,
  type Cocktail,
  type Flavor,
  type Taste,
} from "@/types/cocktail";

// A drink the user rated before, 1 (bad) to 5 (great).
export type RatedDrink = {
  cocktailId: string;
  rating: number;
  flavor: Flavor;
};

export type CocktailMatch = {
  cocktail: Cocktail;
  score: number; // 0..1
};

const WEIGHT_CHOSEN = 0.5;
const WEIGHT_TASTE = 0.3;
const WEIGHT_RATED = 0.2;

// Ratings count for half their weight after this many drinks, so one or two
// ratings don't steer everything.
const RATINGS_HALF = 5;

// At or below this, the drink isn't suggested again.
const DISLIKED = 2;
const NEUTRAL_RATING = 3;

// The strongest value of each taste among the drinks. Raw flavours bunch up
// low (most drinks are 0.1-0.4 sweet), so everything is compared to the
// strongest drink on offer instead: 1 means "the sweetest one you can make".
function strongest(flavors: Flavor[]): Flavor {
  const max: Flavor = { ...EMPTY_FLAVOR };
  for (const flavor of flavors) {
    for (const { key } of TASTES) max[key] = Math.max(max[key], flavor[key]);
  }
  return max;
}

function relative(flavor: Flavor, max: Flavor): Flavor {
  const out: Flavor = { ...EMPTY_FLAVOR };
  for (const { key } of TASTES) {
    out[key] = max[key] > 0 ? Math.min(1, flavor[key] / max[key]) : 0;
  }
  return out;
}

function similarity(a: Flavor, b: Flavor): number | null {
  let dot = 0;
  let lengthA = 0;
  let lengthB = 0;
  for (const { key } of TASTES) {
    dot += a[key] * b[key];
    lengthA += a[key] ** 2;
    lengthB += b[key] ** 2;
  }
  if (lengthA === 0 || lengthB === 0) return null;
  return dot / Math.sqrt(lengthA * lengthB);
}

function chosenScore(flavor: Flavor, chosen: Taste[]): number | null {
  if (chosen.length === 0) return null;
  return chosen.reduce((sum, taste) => sum + flavor[taste], 0) / chosen.length;
}

// What the ratings say they like: each rated drink's flavour, added when it
// was rated above neutral and subtracted when below. 5 counts +1, 1 counts -1.
function likedFlavor(rated: RatedDrink[], max: Flavor): Flavor {
  const liked: Flavor = { ...EMPTY_FLAVOR };
  for (const drink of rated) {
    const pull = (drink.rating - NEUTRAL_RATING) / 2;
    const flavor = relative(drink.flavor, max);
    for (const { key } of TASTES) liked[key] += pull * flavor[key];
  }
  return liked;
}

/**
 * Scores `cocktails` and returns them best first. Drinks with no flavour
 * data, and drinks the user already rated badly, are left out.
 */
export function rankCocktails(
  cocktails: Cocktail[],
  chosen: Taste[],
  taste: Flavor | null,
  rated: RatedDrink[] = [],
): CocktailMatch[] {
  const withFlavor = cocktails.flatMap((cocktail) => {
    const flavor = cocktailFlavor(cocktail.ingredients);
    return flavor ? [{ cocktail, flavor }] : [];
  });

  const max = strongest(withFlavor.map((c) => c.flavor));
  const liked = likedFlavor(rated, max);
  const disliked = new Set(
    rated.filter((r) => r.rating <= DISLIKED).map((r) => r.cocktailId),
  );
  const ratedWeight =
    WEIGHT_RATED * (rated.length / (rated.length + RATINGS_HALF));

  return withFlavor
    .filter(({ cocktail }) => !disliked.has(cocktail.id))
    .map(({ cocktail, flavor }) => {
      const f = relative(flavor, max);

      const parts: [weight: number, value: number | null][] = [
        [WEIGHT_CHOSEN, chosenScore(f, chosen)],
        // Tastes are never negative, so this one is already 0..1.
        [WEIGHT_TASTE, hasFlavor(taste) ? similarity(f, taste) : null],
        [ratedWeight, toUnit(similarity(f, liked))],
      ];

      let total = 0;
      let weights = 0;
      for (const [weight, value] of parts) {
        if (value === null) continue;
        total += weight * value;
        weights += weight;
      }

      return { cocktail, score: weights > 0 ? total / weights : 0 };
    })
    .sort((a, b) => b.score - a.score);
}

// -1..1 to 0..1.
const toUnit = (value: number | null) =>
  value === null ? null : (value + 1) / 2;

/**
 * The drinks the user can make from their bar, best match first, for the
 * flavours picked on the create screen.
 */
export async function findCocktails(
  userId: string,
  chosen: Taste[],
  rated: RatedDrink[] = [],
): Promise<CocktailMatch[]> {
  const [cocktails, taste] = await Promise.all([
    getMakeableCocktails(),
    getTaste(userId),
  ]);

  return rankCocktails(cocktails, chosen, taste, rated);
}
