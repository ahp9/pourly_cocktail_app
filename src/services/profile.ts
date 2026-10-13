import { supabase } from "@/services/supabase";
import { EMPTY_FLAVOR, TASTES, type Flavor } from "@/types/cocktail";
import type { Profile, ProfileUser } from "@/types/profile";

export async function getProfile(
  user: ProfileUser,
  signal: AbortSignal,
): Promise<Profile> {
  const [taste, personality, recs] = await Promise.all([
    supabase
      .from("taste_scores")
      .select("key, label, value, delta")
      .eq("user_id", user.id)
      .order("created_at")
      .abortSignal(signal),
    supabase
      .from("taste_personality")
      .select("name, description, drinks_rated, updated_at")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("profile_recommendations")
      .select("cocktail_id, cocktail_name, needs, match, accent")
      .eq("user_id", user.id)
      .order("position")
      .abortSignal(signal),
  ]);

  const error = taste.error ?? personality.error ?? recs.error;
  if (error) throw new Error(error.message);

  return {
    user,
    taste: (taste.data ?? []).map((t) => ({
      key: t.key,
      label: t.label,
      value: t.value,
      delta: t.delta ?? undefined,
    })),
    personality: personality.data
      ? {
          name: personality.data.name,
          description: personality.data.description ?? "",
          drinksRated: personality.data.drinks_rated,
          updatedAt: personality.data.updated_at,
        }
      : null,
    recommendations: (recs.data ?? []).map((r) => ({
      id: r.cocktail_id,
      name: r.cocktail_name,
      needs: r.needs ?? "",
      match: r.match,
      accent: r.accent ?? "",
    })),
  };
}

// The user's own taste as 0..1 per taste, or null if they haven't set one.
export async function getTaste(userId: string): Promise<Flavor | null> {
  const { data, error } = await supabase
    .from("taste_scores")
    .select("key, value")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return null;

  const flavor: Flavor = { ...EMPTY_FLAVOR };
  for (const { key } of TASTES) {
    const row = data.find((r) => r.key === key);
    if (row) flavor[key] = row.value / 100;
  }
  return flavor;
}

// The user's own taste, from the personality flow. One taste_scores row per
// taste, value 0..100 like the rest of the table. Needs a unique constraint
// on (user_id, key) for the upsert.
export async function saveTaste(userId: string, flavor: Flavor) {
  const rows = TASTES.map((t) => ({
    user_id: userId,
    key: t.key,
    label: t.label,
    value: Math.round(flavor[t.key] * 100),
  }));

  const { error } = await supabase
    .from("taste_scores")
    .upsert(rows, { onConflict: "user_id,key" });
  if (error) throw new Error(error.message);
}
