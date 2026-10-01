import type { ComponentType } from "react";
import { BalloonGlass } from "./BalloonGlass";
import { BeerMug } from "./BeerMug";
import { ChampagneFlute } from "./ChampagneFlute";
import { CoffeeMug } from "./CoffeeMug";
import { CopperMug } from "./CopperMug";
import { CordialGlass } from "./CordialGlass";
import { CoupeGlass } from "./CoupeGlass";
import { HighballGlass } from "./HighballGlass";
import { HurricaneGlass } from "./HurricaneGlass";
import { IrishCoffeeGlass } from "./IrishCoffeeGlass";
import { MargaritaGlass } from "./MargaritaGlass";
import { MartiniGlass } from "./MartiniGlass";
import { MasonJar } from "./MasonJar";
import { PilsnerGlass } from "./PilsnerGlass";
import { PintGlass } from "./PintGlass";
import { Pitcher } from "./Pitcher";
import { PunchBowl } from "./PunchBowl";
import { ShotGlass } from "./ShotGlass";
import { WhiskeyGlass } from "./WhiskeyGlass";
import { WhiskeySourGlass } from "./WhiskeySourGlass";
import { WineGlass } from "./WineGlass";
import { normalizeGlass, type GlassType } from "./glassMapping";
import type { GlassProps } from "./types";

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
export function Glass({ type, ...props }: GlassComponentProps) {
  const key = normalizeGlass(type);
  if (!key) return null;

  const Component = GLASS_COMPONENTS[key];
  return <Component {...props} />;
}
