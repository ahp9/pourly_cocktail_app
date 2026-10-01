import { InlineLink } from "@/components/auth/InlineLink";
import { IngredientRow } from "@/components/bar/IngredientRow";
import { Button } from "@/components/controls/Button";
import { CircleButton } from "@/components/controls/CircleButton";
import { Chip, ChoiceGroup, Swatches } from "@/components/forms/Choices";
import { TextField } from "@/components/forms/TextField";
import { AppText } from "@/components/primitivies/AppText";
import { DEFAULT_SWATCH, SWATCH_CHOICES } from "@/data/ingredients";
import { useAddBottle } from "@/hooks/useAddBottle";
import { useAuth } from "@/hooks/useAuth";
import { useBarCatalog } from "@/hooks/useBarCatalog";
import { addToBar } from "@/services/bar";
import { createIngredient } from "@/services/catalog";
import { saveProduct } from "@/services/products";
import { colors, radius } from "@/styles/tokens";
import {
  BAR_CATEGORIES,
  isAlcoholic,
  type AlcoholType,
  type BarCategory,
  type Ingredient,
  type Product,
  type ProductSource,
} from "@/types/bottle";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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

// One screen for every way into the bar:
// - scanned and matched: check the name, fill in what the scan missed
// - scanned, no match: set it up as a new ingredient right here
// - typed a name that isn't in the list (source "manual"): same, minus the
//   scan bits
// The fields follow the shelf. Spirits get brand, % and size. Mint gets a
// name, a shelf and a colour.
export default function Confirm() {
  const params = useLocalSearchParams<{ newName?: string }>();
  const { draft, setDraft } = useAddBottle();
  const { user } = useAuth();
  const { ingredients = [], alcoholTypes } = useBarCatalog();

  // Bottle fields. Numbers stay strings while typing and are parsed on save.
  const [name, setName] = useState(draft?.productName ?? "");
  const [brand, setBrand] = useState(draft?.brand ?? "");
  const [abvText, setAbvText] = useState(
    draft?.abv != null ? String(draft.abv) : "",
  );
  const [volumeText, setVolumeText] = useState(
    draft?.volumeMl != null ? String(draft.volumeMl) : "",
  );

  // New-ingredient fields. Only used when nothing matched.
  const [newName, setNewName] = useState(
    params.newName ?? draft?.productName ?? "",
  );
  const [newCategory, setNewCategory] = useState<BarCategory>();
  const [alcoholType, setAlcoholType] = useState<AlcoholType>();
  const [swatch, setSwatch] = useState<string>();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  // Opened without a draft (deep link, reload): go back to the start.
  useEffect(() => {
    if (!draft) router.replace("/add-bottle");
  }, [draft]);

  // "New ingredient" in the picker comes back here with ?newName=.
  const manual = draft?.source === "manual";
  useEffect(() => {
    if (!params.newName) return;
    if (manual) setName(params.newName);
    else setNewName(params.newName);
  }, [params.newName, manual]);

  const matched = draft?.ingredient ?? null;
  const creating = !matched;
  const category = matched?.category ?? newCategory;
  const alcoholic = category ? isAlcoholic(category) : false;
  const bottled = !!category && category !== "fresh";
  const ingredientName = (manual ? name : newName).trim();

  // An existing ingredient that looks like this bottle.
  const match = useMemo(
    () =>
      creating
        ? findIngredient([brand, name, newName].join(" "), ingredients)
        : null,
    [creating, brand, name, newName, ingredients],
  );

  // On arrival, an exact name match fills in the ingredient on its own.
  // Runs once, so picking "New ingredient" later isn't undone.
  const autoMatched = useRef(false);
  useEffect(() => {
    if (autoMatched.current || !draft || ingredients.length === 0) return;
    autoMatched.current = true;
    if (!draft.ingredient && match?.exact) {
      setDraft({ ...draft, ingredient: match.ingredient });
    }
  }, [draft, ingredients.length, match, setDraft]);

  if (!draft) return null;

  const abv = alcoholic ? parseNumber(abvText) : undefined;
  const volumeMl = bottled ? parseNumber(volumeText) : undefined;
  const abvOk = abv === undefined || (abv > 0 && abv <= 100);
  const volumeOk =
    volumeMl === undefined || (volumeMl > 0 && volumeMl <= 10000);

  const types = alcoholTypes.filter((t) => t.category === newCategory);
  const newSwatch = swatch ?? (newCategory && DEFAULT_SWATCH[newCategory]);

  const ingredientReady =
    !!matched ||
    (ingredientName.length >= 2 &&
      !!newCategory &&
      (!alcoholic || !!alcoholType));
  const ready = name.trim().length >= 2 && ingredientReady && abvOk && volumeOk;

  const trimmedBrand = brand.trim();
  const details = [
    trimmedBrand && trimmedBrand !== name.trim() ? trimmedBrand : null,
    abv && abvOk ? `${abv}%` : null,
    volumeMl && volumeOk ? `${Math.round(volumeMl)} ml` : null,
  ].filter(Boolean);

  const pickCategory = (c: BarCategory) => {
    setNewCategory(c);
    setAlcoholType(undefined); // types belong to one shelf
  };

  const useIngredient = (ingredient: Ingredient) =>
    setDraft({ ...draft, ingredient });

  const openPicker = () =>
    router.push({ pathname: "/add-bottle", params: { mode: "pick" } });

  const add = async () => {
    if (!user || !ready) return;
    setSaving(true);
    setError(undefined);
    try {
      let ingredient = matched;
      if (!ingredient) {
        if (!newCategory || !newSwatch) return;
        ingredient = await createIngredient({
          name: ingredientName,
          category: newCategory,
          alcoholType: alcoholic ? alcoholType : undefined,
          swatch: newSwatch,
        });
        // Keep it on the draft so a retry doesn't create it twice.
        setDraft({ ...draft, ingredient });
      }

      const product: Product = {
        ...draft,
        ingredient,
        productName: name.trim(),
        brand: bottled ? trimmedBrand || undefined : undefined,
        abv,
        volumeMl: volumeMl !== undefined ? Math.round(volumeMl) : undefined,
      };

      await addToBar(user.id, product);
      // Teach the shared products table. Doesn't block adding if it fails.
      saveProduct(product);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.dismissTo("/my-bar");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Try again.",
      );
    } finally {
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
              {manual && creating ? "New ingredient" : "Is this right?"}
            </AppText>
          </View>

          {/* Bottle card, updates as you type */}
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
                        matched?.swatch ?? newSwatch ?? colors.raised,
                    },
                  ]}
                />
              )}
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <AppText variant="heading" numberOfLines={2}>
                {name.trim() || "Unnamed"}
              </AppText>
              {details.length > 0 && (
                <AppText variant="caption" color="muted">
                  {details.join(" · ")}
                </AppText>
              )}
            </View>
          </View>

          <TextField
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder={manual ? "Brennivín, yuzu juice…" : undefined}
            hint={manual ? undefined : "Fix it if the label was read wrong."}
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={80}
            returnKeyType="done"
          />

          {/* What recipes see */}
          <Section
            title="Counts as"
            hint={
              matched
                ? "This is what Pourly looks for in recipes."
                : "Not in the list yet. Add it here and others can pick it too."
            }
          >
            {matched ? (
              <IngredientRow
                label={matched.label}
                swatch={matched.swatch}
                selected
                trailing={<InlineLink label="Change" onPress={openPicker} />}
              />
            ) : (
              <>
                {match && (
                  <IngredientRow
                    label={match.ingredient.label}
                    swatch={match.ingredient.swatch}
                    caption="Already in Pourly"
                    trailing={
                      <InlineLink
                        label="Use"
                        onPress={() => useIngredient(match.ingredient)}
                      />
                    }
                  />
                )}

                {!manual && (
                  <TextField
                    label="Ingredient name"
                    value={newName}
                    onChangeText={setNewName}
                    hint="What recipes call it, e.g. Brennivín."
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={60}
                    returnKeyType="done"
                  />
                )}

                <ChoiceGroup title="Shelf" hint="Where it goes in My Bar.">
                  {BAR_CATEGORIES.map((c) => (
                    <Chip
                      key={c.key}
                      label={c.title}
                      selected={newCategory === c.key}
                      onPress={() => pickCategory(c.key)}
                    />
                  ))}
                </ChoiceGroup>

                {alcoholic && (
                  <ChoiceGroup
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
                  </ChoiceGroup>
                )}

                {newCategory && (
                  <ChoiceGroup
                    title="Colour"
                    hint="The little swatch in My Bar."
                  >
                    <Swatches
                      choices={SWATCH_CHOICES}
                      value={newSwatch}
                      onChange={setSwatch}
                    />
                  </ChoiceGroup>
                )}

                <InlineLink
                  label="Pick from the list instead"
                  onPress={openPicker}
                />
              </>
            )}
          </Section>

          {/* Fill in what the scan missed. Hidden for fresh things. */}
          {bottled && (
            <Section title="Bottle" hint="Optional. Fill in what's missing.">
              <TextField
                label="Brand"
                value={brand}
                onChangeText={setBrand}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={60}
                returnKeyType="done"
              />
              <View style={styles.row}>
                {alcoholic && (
                  <View style={{ flex: 1 }}>
                    <TextField
                      label="Alcohol %"
                      value={abvText}
                      onChangeText={setAbvText}
                      placeholder="40"
                      keyboardType="decimal-pad"
                      maxLength={5}
                      hint={abvOk ? undefined : "Between 0 and 100."}
                    />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <TextField
                    label="Size (ml)"
                    value={volumeText}
                    onChangeText={setVolumeText}
                    placeholder="700"
                    keyboardType="number-pad"
                    maxLength={5}
                    hint={volumeOk ? undefined : "Up to 10,000 ml."}
                  />
                </View>
              </View>
            </Section>
          )}

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
              disabled={!ready}
              fullWidth
            />
            {!manual && (
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

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 4 }}>
        <AppText variant="heading">{title}</AppText>
        <AppText variant="caption" color="muted">
          {hint}
        </AppText>
      </View>
      {children}
    </View>
  );
}

// "37,5" and "37.5" both work. Empty → undefined, junk → NaN (fails checks).
function parseNumber(text: string): number | undefined {
  const t = text.replace(",", ".").trim();
  if (!t) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
}

const normalise = (s: string) =>
  s
    .toLocaleLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

// Exact: the text is an ingredient's key, name or label.
// Otherwise: the longest ingredient name found as whole words in the text,
// so "Baileys Original Irish Cream" finds "Irish cream".
function findIngredient(
  text: string,
  ingredients: Ingredient[],
): { ingredient: Ingredient; exact: boolean } | null {
  const t = normalise(text);
  if (t.length < 2) return null;
  const padded = ` ${t} `;

  let best: { ingredient: Ingredient; length: number } | null = null;
  for (const ingredient of ingredients) {
    const names = [ingredient.key, ingredient.name, ingredient.label].map(
      normalise,
    );
    for (const n of names) {
      if (n === t) return { ingredient, exact: true };
      if (
        n.length >= 3 &&
        padded.includes(` ${n} `) &&
        (!best || n.length > best.length)
      ) {
        best = { ingredient, length: n.length };
      }
    }
  }
  return best ? { ingredient: best.ingredient, exact: false } : null;
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
  row: { flexDirection: "row", gap: 12 },
  actions: { marginTop: "auto", gap: 12, paddingTop: 8 },
});
