import { Cocktail, CocktailIngredient } from "@/types/cocktail";
import { Step, Vessel } from "@/types/recipe";

// Glasses that are normally served with ice in them.
const ICED_GLASSES = [
  "collins",
  "highball",
  "old-fashioned",
  "rocks",
  "hurricane",
];

export const servedOnIce = (glass: string | null) =>
  ICED_GLASSES.some((g) => glass?.toLowerCase().includes(g) ?? false);

const isTopUp = (i: CocktailIngredient) => i.kind === "mixer";
const isGarnish = (i: CocktailIngredient) => i.kind === "garnish";

export function buildSteps(cocktail: Cocktail): Step[] {
  const { method } = cocktail;
  const glass = cocktail.glass ?? "martini";
  const iced = servedOnIce(glass);

  const sorted = [...cocktail.ingredients].sort(
    (a, b) => a.position - b.position,
  );
  const garnishes = sorted.filter(isGarnish);
  const topUps = sorted.filter(isTopUp);
  const mixed = sorted.filter((i) => !isGarnish(i) && !isTopUp(i));

  const steps: Step[] = [];

  if (method === "shake" || method === "stir") {
    const vessel: Vessel = method === "shake" ? "shaker" : "mixingGlass";
    steps.push({ kind: "prepare", vessel, glass, ice: true });
    mixed.forEach((ingredient) =>
      steps.push({ kind: "add", vessel, ingredient }),
    );
    steps.push({ kind: method });
    steps.push({ kind: "strain", glass, ice: iced });
  } else {
    // "build" and anything unknown: straight into the glass.
    steps.push({ kind: "prepare", vessel: "glass", glass, ice: iced });
    mixed.forEach((ingredient) =>
      steps.push({ kind: "add", vessel: "glass", ingredient }),
    );
  }

  topUps.forEach((ingredient) => steps.push({ kind: "top", ingredient }));
  garnishes.forEach((ingredient) =>
    steps.push({ kind: "garnish", ingredient }),
  );
  steps.push({ kind: "done" });

  return steps;
}

const VESSEL_NAME: Record<Vessel, string> = {
  glass: "glass",
  shaker: "shaker",
  mixingGlass: "mixing glass",
};

const amount = (i: CocktailIngredient) => (i.measure ? `${i.measure} ` : "");

export function describeStep(step: Step): { title: string; body: string } {
  switch (step.kind) {
    case "prepare":
      if (step.vessel === "glass")
        return {
          title: `Get a ${step.glass.toLowerCase()}`,
          body: step.ice ? "Fill it with ice." : "No ice needed.",
        };
      return {
        title: `Fill a ${VESSEL_NAME[step.vessel]} with ice`,
        body: `You'll build the drink in the ${VESSEL_NAME[step.vessel]}, then pour it into a ${step.glass.toLowerCase()}.`,
      };
    case "add":
      return {
        title: `Add ${step.ingredient.name.toLowerCase()}`,
        body: `${amount(step.ingredient)}into the ${VESSEL_NAME[step.vessel]}.`,
      };
    case "shake":
      return {
        title: "Shake",
        body: "Close the shaker and shake hard for 10–15 seconds.",
      };
    case "stir":
      return {
        title: "Stir",
        body: "Stir with a bar spoon for about 20 seconds.",
      };
    case "strain":
      return {
        title: "Strain",
        body: `Pour into the ${step.glass.toLowerCase()}${step.ice ? " over fresh ice" : ""}.`,
      };
    case "top":
      return {
        title: `Top with ${step.ingredient.name.toLowerCase()}`,
        body: step.ingredient.measure
          ? `Add ${step.ingredient.measure}.`
          : "Fill the glass to the top.",
      };
    case "garnish":
      return { title: "Garnish", body: step.ingredient.name };
    case "done":
      return { title: "Enjoy", body: "" };
  }
}
