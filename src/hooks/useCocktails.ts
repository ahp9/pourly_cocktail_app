import { getCocktail, getRandomCocktails } from "@/services/cocktails";
import type { Cocktail } from "@/types/cocktail";
import { useCallback, useEffect, useState } from "react";

// `count` random cocktails, each with its ingredients filled in.
export function useRandomCocktails(count: number) {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setCocktails(await getRandomCocktails(count));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load cocktails.");
    }
  }, [count]);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const refetch = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return { cocktails, loading, refreshing, error, refetch };
}

// One cocktail by id, with its ingredients.
export function useCocktail(id: string | undefined) {
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setLoading(true);
    getCocktail(id)
      .then((c) => {
        if (!cancelled) {
          setCocktail(c);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Couldn't load cocktail.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { cocktail, loading, error };
}
