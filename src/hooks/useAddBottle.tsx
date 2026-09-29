import type { Product } from "@/types/bottle";
import { createContext, ReactNode, useContext, useState } from "react";

// State shared by the add-bottle screens (search, scan, confirm).
// Lives in app/add-bottle/_layout.tsx, so it resets when the flow closes.
type AddBottleState = {
  draft: Product | null;
  setDraft: (p: Product | null) => void;
  // A barcode nobody recognised. Kept so it's saved with the label result.
  unknownBarcode?: string;
  setUnknownBarcode: (b?: string) => void;
};

const Ctx = createContext<AddBottleState | null>(null);

export function AddBottleProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<Product | null>(null);
  const [unknownBarcode, setUnknownBarcode] = useState<string>();
  return (
    <Ctx.Provider
      value={{ draft, setDraft, unknownBarcode, setUnknownBarcode }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAddBottle() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAddBottle must be used inside app/add-bottle");
  return ctx;
}
