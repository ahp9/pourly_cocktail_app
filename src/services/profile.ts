import { supabase } from "@/services/supabase";
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
