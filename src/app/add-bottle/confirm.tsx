import { InlineLink } from "@/components/auth/InlineLink";
import { IngredientRow } from "@/components/bar/IngredientRow";
import { Button } from "@/components/controls/Button";
import { CircleButton } from "@/components/controls/CircleButton";
import { TextField } from "@/components/forms/TextField";
import { AppText } from "@/components/primitivies/AppText";
import { useAddBottle } from "@/hooks/useAddBottle";
import { useAuth } from "@/hooks/useAuth";
import { addToBar } from "@/services/bar";
import { saveProduct } from "@/services/products";
import { colors, radius } from "@/styles/tokens";
import type { ProductSource } from "@/types/bottle";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ChevronLeft, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SOURCE_LABEL: Record<ProductSource, string> = {
  pourly: "Recognised",
  openfoodfacts: "Found by barcode",
  label: "Read from the label",
  manual: "Adding to your bar",
};

export default function Confirm() {
  const { draft, setDraft } = useAddBottle();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  // Opened without a draft (deep link, reload): go back to the start.
  useEffect(() => {
    if (!draft) router.replace("/add-bottle");
  }, [draft]);

  if (!draft) return null;

  const details = [
    draft.brand && draft.brand !== draft.productName ? draft.brand : null,
    draft.abv ? `${draft.abv}%` : null,
    draft.volumeMl ? `${draft.volumeMl} ml` : null,
  ].filter(Boolean);

  const add = async () => {
    if (!user || !draft.ingredient) return;
    setSaving(true);
    setError(undefined);
    try {
      await addToBar(user.id, draft);
      // Teach the shared products table. Doesn't block adding if it fails.
      saveProduct(draft);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.dismissTo("/my-bar");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Try again.",
      );
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <CircleButton accessibilityLabel="Back" onPress={() => router.back()}>
            <ChevronLeft size={24} color={colors.cream} strokeWidth={1.75} />
          </CircleButton>

          <View style={styles.titles}>
            <AppText variant="overline" color="amberLight">
              {SOURCE_LABEL[draft.source]}
            </AppText>
            <AppText variant="display" accessibilityRole="header">
              Is this right?
            </AppText>
          </View>

          {/* Bottle card */}
          <View style={styles.card}>
            <View style={styles.thumb}>
              {draft.imageUrl ? (
                <Image
                  source={{ uri: draft.imageUrl }}
                  style={styles.image}
                  resizeMode="contain"
                />
              ) : (
                <View
                  style={[
                    styles.bottle,
                    {
                      backgroundColor:
                        draft.ingredient?.swatch ?? colors.raised,
                    },
                  ]}
                />
              )}
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <AppText variant="heading" numberOfLines={2}>
                {draft.productName}
              </AppText>
              {details.length > 0 && (
                <AppText variant="caption" color="muted">
                  {details.join(" · ")}
                </AppText>
              )}
            </View>
          </View>

          {draft.source !== "manual" && (
            <TextField
              label="Name"
              value={draft.productName}
              onChangeText={(productName) =>
                setDraft({ ...draft, productName })
              }
              hint="Fix it if the label was read wrong."
              autoCapitalize="words"
              returnKeyType="done"
            />
          )}

          {/* What recipes see */}
          <View style={{ gap: 12 }}>
            <View style={{ gap: 4 }}>
              <AppText variant="heading">Counts as</AppText>
              <AppText variant="caption" color="muted">
                This is what Pourly looks for in recipes.
              </AppText>
            </View>

            {draft.ingredient ? (
              <IngredientRow
                label={draft.ingredient.label}
                swatch={draft.ingredient.swatch}
                selected
                trailing={
                  <InlineLink
                    label="Change"
                    onPress={() =>
                      router.push({
                        pathname: "/add-bottle",
                        params: { mode: "pick" },
                      })
                    }
                  />
                }
              />
            ) : (
              <IngredientRow
                label="Choose an ingredient"
                caption="We couldn't tell what this is."
                onPress={() =>
                  router.push({
                    pathname: "/add-bottle",
                    params: { mode: "pick" },
                  })
                }
                trailing={
                  <Plus
                    size={20}
                    color={colors.amberLight}
                    strokeWidth={1.75}
                  />
                }
              />
            )}
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
              label="Add to My Bar"
              onPress={add}
              loading={saving}
              disabled={!draft.ingredient}
              fullWidth
            />
            {draft.source !== "manual" && (
              <Button
                label="Scan again"
                variant="secondary"
                onPress={() => router.replace("/add-bottle/scan")}
                fullWidth
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    gap: 24,
  },
  titles: { gap: 8, marginTop: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 20,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  thumb: {
    width: 64,
    height: 80,
    borderRadius: radius.thumb,
    backgroundColor: colors.raised,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  bottle: { width: 22, height: 56, borderRadius: 6 },
  actions: { marginTop: "auto", gap: 12, paddingTop: 8 },
});
