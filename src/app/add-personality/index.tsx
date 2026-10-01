import { Button } from "@/components/controls/Button";
import { CircleButton } from "@/components/controls/CircleButton";
import { FlavorEditor } from "@/components/forms/FlavorEditor";
import { AppText } from "@/components/primitivies/AppText";
import { useAddPersonality } from "@/hooks/useAddPersonality";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { saveTaste } from "@/services/profile";
import { colors, radius } from "@/styles/tokens";
import { hasFlavor, TASTES, type Flavor } from "@/types/cocktail";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LIKING = ["Not for me", "A little", "Some", "A lot", "Love it"];

// Set your own taste by hand: how much you like each of the seven tastes.
// Starts from what's already saved, so it doubles as "edit".
export default function AddPersonality() {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const { flavor, setFlavor } = useAddPersonality();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  // Fill in saved scores once (0..100 in the table, 0..1 here).
  const prefilled = useRef(false);
  useEffect(() => {
    if (prefilled.current || !profile) return;
    prefilled.current = true;
    const saved = new Map(profile.taste.map((t) => [t.key, t.value]));
    const next = Object.fromEntries(
      TASTES.map((t) => [t.key, (saved.get(t.key) ?? 0) / 100]),
    ) as Flavor;
    if (hasFlavor(next)) setFlavor(next);
  }, [profile, setFlavor]);

  const close = () =>
    router.canGoBack() ? router.back() : router.replace("/profile");

  const save = async () => {
    if (!user || !hasFlavor(flavor)) return;
    setSaving(true);
    setError(undefined);
    try {
      await saveTaste(user.id, flavor);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      close(); // Profile reloads on focus
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save. Try again.");
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <CircleButton accessibilityLabel="Close" onPress={close}>
          <X size={22} color={colors.cream} strokeWidth={1.75} />
        </CircleButton>

        <View style={styles.titles}>
          <AppText variant="overline" color="amberLight">
            Your taste
          </AppText>
          <AppText variant="display" accessibilityRole="header">
            What do you like?
          </AppText>
          <AppText variant="body" color="cream2">
            Tap how much you like each taste. Pourly uses it to pick drinks for
            you, and keeps learning as you rate them.
          </AppText>
        </View>

        <View style={styles.card}>
          <FlavorEditor
            value={flavor}
            onChange={setFlavor}
            words={LIKING}
            readOnly={loading}
          />
        </View>

        <View style={styles.actions}>
          {error ? (
            <AppText
              variant="caption"
              color="campari"
              accessibilityLiveRegion="polite"
            >
              {error}
            </AppText>
          ) : null}
          <Button
            label="Save my taste"
            onPress={save}
            loading={saving}
            disabled={!hasFlavor(flavor)}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ground },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 28,
  },
  titles: { gap: 8, marginTop: 16 },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  actions: { marginTop: "auto", gap: 12, paddingTop: 8 },
});
