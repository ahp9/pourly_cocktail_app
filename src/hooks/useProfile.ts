import { useAuth } from "@/hooks/useAuth";
import { getProfile } from "@/services/profile";
import type { Profile } from "@/types/profile";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

type State = {
  profile: Profile | null;
  loading: boolean; // first load, nothing to show yet
  refreshing: boolean; // reload with data already on screen
  error: string | null;
};

// Loads the profile, and reloads it every time the Profile tab comes into
// focus, so the taste bars are fresh after the user rates a drink.
export function useProfile() {
  const { user } = useAuth();
  const [state, setState] = useState<State>({
    profile: null,
    loading: true,
    refreshing: false,
    error: null,
  });
  const inFlight = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setState((s) => ({ ...s, loading: false, refreshing: false }));
      return;
    }

    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

    setState((s) => ({
      ...s,
      loading: s.profile === null,
      refreshing: s.profile !== null,
      error: null,
    }));

    try {
      const profile = await getProfile(
        { id: user.id, name: user.name, email: user.email },
        controller.signal,
      );
      if (controller.signal.aborted) return;
      setState({ profile, loading: false, refreshing: false, error: null });
    } catch (e) {
      if (controller.signal.aborted) return;
      setState((s) => ({
        ...s,
        loading: false,
        refreshing: false,
        error:
          e instanceof Error ? e.message : "Something went wrong. Try again.",
      }));
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  useEffect(() => () => inFlight.current?.abort(), []);

  return { ...state, refetch: load };
}
