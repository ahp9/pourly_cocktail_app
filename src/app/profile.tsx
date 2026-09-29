import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

import { Cocktail } from "@/types/cocktail";
import { normalizeCocktailData, searchCocktails } from "../services/cocktails";

export default function Profile() {
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCocktail() {
      try {
        const results = await searchCocktails("margarita");

        const normalizedCocktail = normalizeCocktailData(results[0]);

        console.log("Normalized cocktail:", normalizedCocktail);

        setCocktail(normalizedCocktail);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadCocktail();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cocktail && (
        <>
          {cocktail.image && (
            <Image source={{ uri: cocktail.image }} style={styles.image} />
          )}

          <Text style={styles.title}>{cocktail.name}</Text>

          <Text>Method: {cocktail.method}</Text>

          {cocktail.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              {ingredient.ingredient} - {ingredient.measure}
            </Text>
          ))}

          <Text style={styles.instructions}>{cocktail.instructions}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  image: {
    width: 250,
    height: 250,
    borderRadius: 12,
    alignSelf: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 12,
    color: "#333",
  },

  ingredient: {
    fontSize: 18,
    marginBottom: 4,
    color: "#555",
  },

  instructions: {
    marginTop: 20,
    lineHeight: 22,
    color: "#666",
  },
});
