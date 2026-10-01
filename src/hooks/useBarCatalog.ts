import {
  getCatalog,
  loadCatalog,
  subscribeCatalog,
  type Catalog,
} from "@/services/catalog";
import { useEffect, useSyncExternalStore } from "react";

// The bar list (built-in + added by people). Shows the built-in list right
// away and re-renders once the table has loaded.
export function useBarCatalog(): Catalog {
  const catalog = useSyncExternalStore(subscribeCatalog, getCatalog);

  useEffect(() => {
    loadCatalog();
  }, []);

  return catalog;
}
