import { EMPTY_FLAVOR, type Flavor } from "@/types/cocktail";
import { createContext, ReactNode, useContext, useState } from "react";

// State shared by the add-personality screens.
// Lives in app/add-personality/_layout.tsx, so it resets when the flow closes.
type AddPersonalityState = {
  flavor: Flavor;
  setFlavor: (f: Flavor) => void;
};

const Ctx = createContext<AddPersonalityState | null>(null);

export function AddPersonalityProvider({ children }: { children: ReactNode }) {
  const [flavor, setFlavor] = useState<Flavor>(EMPTY_FLAVOR);
  return <Ctx.Provider value={{ flavor, setFlavor }}>{children}</Ctx.Provider>;
}

export function useAddPersonality() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error(
      "useAddPersonality must be used inside app/add-personality",
    );
  return ctx;
}
