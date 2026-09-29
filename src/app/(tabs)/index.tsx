import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { MintGlass } from "@/components/images/ming-glass";
import { spacing, typography } from "@/styles";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCocktail() {
      try {
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
      <View style={styles.hero}>
        <MintGlass width={250} height={250} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>What are we drinking?</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
  },

  hero: {
    alignItems: "center",
    marginTop: spacing.sp56,
  },

  content: {
    marginTop: 24,
    alignItems: "center",
  },

  subtitle: {
    fontSize: 18,
    color: "#666",
  },

  title: {
    fontSize: typography.display.fontSize,
    marginBottom: 12,
    color: typography.display.color,
    fontFamily: typography.display.fontFamily,
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
