export type FlavorAspect =
  | "sweet"
  | "sour"
  | "bitter"
  | "fruity"
  | "herbal"
  | "creamy"
  | "fizzy"
  | "strong";

export type TastePersonality = Record<FlavorAspect, number>;
