import { useAddBottle } from "@/hooks/useAddBottle";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";

// Creating an ingredient now happens on the confirm screen. This route stays
// so the search screen's "New ingredient" link keeps working: it sets up the
// draft and hands over.
//   ?name=<what they typed>
//   ?mode=pick when it came from "Change" on the confirm screen
export default function NewIngredient() {
  const { name = "", mode } = useLocalSearchParams<{
    name?: string;
    mode?: string;
  }>();
  const { draft, setDraft } = useAddBottle();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    if (mode === "pick" && draft) {
      // Back to the existing confirm screen, with no ingredient chosen.
      setDraft({ ...draft, ingredient: null });
      router.dismissTo({
        pathname: "/add-bottle/confirm",
        params: { newName: name },
      });
      return;
    }

    setDraft({ productName: name, ingredient: null, source: "manual" });
    router.replace("/add-bottle/confirm");
  }, [draft, mode, name, setDraft]);

  return null;
}
