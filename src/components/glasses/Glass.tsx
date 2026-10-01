import { GlassType, normalizeGlass } from "@/components/glasses/glassMapping";
import { GlassProps } from "@/types/glasses";
import type { ComponentType } from "react";

import { BalloonGlass } from "@/components/glasses/BalloonGlass";
import { BeerMug } from "@/components/glasses/BeerMug";
import { ChampagneFlute } from "@/components/glasses/ChampagneFlute";
import { CoffeeMug } from "@/components/glasses/CoffeeMug";
import { CopperMug } from "@/components/glasses/CopperMug";
import { CordialGlass } from "@/components/glasses/CordialGlass";
import { CoupeGlass } from "@/components/glasses/CoupeGlass";
import { HighballGlass } from "@/components/glasses/HighballGlass";
import { HurricaneGlass } from "@/components/glasses/HurricaneGlass";
import { IrishCoffeeGlass } from "@/components/glasses/IrishCoffeeGlass";
import { MargaritaGlass } from "@/components/glasses/MargaritaGlass";
import { MartiniGlass } from "@/components/glasses/MartiniGlass";
import { MasonJar } from "@/components/glasses/MasonJar";
import { PilsnerGlass } from "@/components/glasses/PilsnerGlass";
import { PintGlass } from "@/components/glasses/PintGlass";
import { Pitcher } from "@/components/glasses/Pitcher";
import { PunchBowl } from "@/components/glasses/PunchBowl";
import { ShotGlass } from "@/components/glasses/ShotGlass";
import { WhiskeyGlass } from "@/components/glasses/WhiskeyGlass";
import { WhiskeySourGlass } from "@/components/glasses/WhiskeySourGlass";
import { WineGlass } from "@/components/glasses/WineGlass";

export const GLASS_COMPONENTS: Record<GlassType, ComponentType<GlassProps>> = {
  whiskey: WhiskeyGlass,
  copperMug: CopperMug,
  beerMug: BeerMug,
  pint: PintGlass,
  pilsner: PilsnerGlass,
  irishCoffee: IrishCoffeeGlass,
  coupe: CoupeGlass,
  wine: WineGlass,
  whiskeySour: WhiskeySourGlass,
  balloon: BalloonGlass,
  margarita: MargaritaGlass,
  highball: HighballGlass,
  pitcher: Pitcher,
  hurricane: HurricaneGlass,
  coffeeMug: CoffeeMug,
  masonJar: MasonJar,
  champagne: ChampagneFlute,
  martini: MartiniGlass,
  shot: ShotGlass,
  cordial: CordialGlass,
  punchBowl: PunchBowl,
};

export type GlassComponentProps = GlassProps & {
  /** A GlassType key ("whiskey") or a raw database name ("Old-fashioned glass"). */
  // `string & {}` keeps autocomplete for GlassType while accepting any string.
  type: GlassType | (string & {});
};

/** Renders the right glass for a type or raw name. Returns null for unknown names. */
export function CocktailGlass({
  glass,
  ...props
}: GlassProps & { glass: string | null }) {
  const type = glass ? normalizeGlass(glass) : undefined;

  if (glass && !type && __DEV__) {
    console.warn(`No glass for "${glass}". Add it to GLASS_NAME_MAP.`);
  }

  // Most CocktailDB drinks use a cocktail glass, so that's the fallback
  const Glass = GLASS_COMPONENTS[type ?? "martini"];
  return <Glass {...props} />;
}
