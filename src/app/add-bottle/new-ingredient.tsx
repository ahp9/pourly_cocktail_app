import { Button } from "@/components/controls/Button";
import { CircleButton } from "@/components/controls/CircleButton";
import { TextField } from "@/components/forms/TextField";
import { AppText } from "@/components/primitivies/AppText";
import { PressableScale } from "@/components/primitivies/PressableScale";
import { DEFAULT_SWATCH, SWATCH_CHOICES } from "@/data/ingredients";
import { useAddBottle } from "@/hooks/useAddBottle";
import { useBarCatalog } from "@/hooks/useBarCatalog";
import { createIngredient } from "@/services/catalog";
import { colors, radius } from "@/styles/tokens";
import {
  BAR_CATEGORIES,
  isAlcoholic,
  type AlcoholType,
  type BarCategory,
} from "@/types/bottle";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { Check, ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Add an ingredient that isn't in the list, e.g. "Brennivín".
// Opened from the search screen with ?name=<what they typed>, and
// ?mode=pick when it came from "Change" on the confirm screen.
export default function NewIngredient() {
  const params = useLocalSearchParams<{ name?: string; mode?: string }>();
  const picking = params.mode === "pick";
  const { draft, setDraft } = useAddBottle();
  const { alcoholTypes } = useBarCatalog();

  const [name, setName] = useState(params.name ?? "");
  const [category, setCategory] = useState<BarCategory>();
  const [alcoholType, setAlcoholType] = useState<AlcoholType>();
  const [swatch, setSwatch] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const alcoholic = category ? isAlcoholic(category) : false;
  const types = alcoholTypes.filter((t) => t.category === category);
  const trimmed = name.trim();
  const ready =
    trimmed.length >= 2 && !!category && (!alcoholic || !!alcoholType);

  const pickCategory = (c: BarCategory) => {
    setCategory(c);
    setAlcoholType(undefined); // types belong to one shelf
  };

  const save = async () => {
    if (!ready || !category) return;
    setSaving(true);
    setError(undefined);
    try {
      const ingredient = await createIngredient({
        name: trimmed,
        category,
        alcoholType: alcoholic ? alcoholType : undefined,
        swatch: swatch ?? DEFAULT_SWATCH[category],
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (picking && draft) {
        setDraft({ ...draft, ingredient });
        router.dismissTo("/add-bottle/confirm");
        return;
      }
      setDraft({ productName: ingredient.label, ingredient, source: "manual" });
      router.replace("/add-bottle/confirm");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't add it. Try again.");
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
            <AppText variant="display" accessibilityRole="header">
              New ingredient
            </AppText>
            <AppText variant="body" color="cream2">
              Add something that isn&apos;t in the list. Others can pick it too.
            </AppText>
          </View>

          <TextField
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Brennivín, yuzu juice…"
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={60}
            returnKeyType="done"
          />

          <Group title="Shelf" hint="Where it goes in My Bar.">
            {BAR_CATEGORIES.map((c) => (
              <Chip
                key={c.key}
                label={c.title}
                selected={category === c.key}
                onPress={() => pickCategory(c.key)}
              />
            ))}
          </Group>

          {alcoholic && (
            <Group
              title="Type of alcohol"
              hint="Pick the closest. “Other” is fine."
            >
              {types.map((t) => (
                <Chip
                  key={t.key}
                  label={t.label}
                  selected={alcoholType === t.key}
                  onPress={() => setAlcoholType(t.key)}
                />
              ))}
            </Group>
          )}

          <Group title="Colour" hint="The little swatch in My Bar.">
            {SWATCH_CHOICES.map((c) => {
              const selected =
                (swatch ?? (category && DEFAULT_SWATCH[category])) === c;
              return (
                <PressableScale
                  key={c}
                  onPress={() => setSwatch(c)}
                  pressedScale={0.94}
                  accessibilityRole="radio"
                  accessibilityLabel={`Colour ${c}`}
                  accessibilityState={{ selected }}
                  style={[
                    styles.swatch,
                    { backgroundColor: c },
                    selected && styles.swatchSelected,
                  ]}
                >
                  {selected ? (
                    <Check size={16} color={colors.onAmber} strokeWidth={2.5} />
                  ) : null}
                </PressableScale>
              );
            })}
          </Group>

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
              label="Add ingredient"
              onPress={save}
              loading={saving}
              disabled={!ready}
              fullWidth
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Group({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ gap: 4 }}>
        <AppText variant="heading">{title}</AppText>
        <AppText variant="caption" color="muted">
          {hint}
        </AppText>
      </View>
      <View style={styles.wrap} accessibilityRole="radiogroup">
        {children}
      </View>
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      pressedScale={0.94}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <AppText variant="label" color={selected ? "onAmber" : "cream"}>
        {label}
      </AppText>
    </PressableScale>
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
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.amber, borderColor: colors.amber },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  swatchSelected: { borderColor: colors.cream },
  actions: { marginTop: "auto", gap: 12, paddingTop: 8 },
});
