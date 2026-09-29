import { CircleButton } from "@/components/controls/CircleButton";
import { AppText } from "@/components/primitivies/AppText";
import { colors, fonts } from "@/styles/tokens";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: string;
  subtitle: string;
  showBack?: boolean;
  children: ReactNode; // the form
  footer?: ReactNode; // "New to Pourly? Create an account"
};

export function AuthLayout({
  title,
  subtitle,
  showBack,
  children,
  footer,
}: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            {showBack ? (
              <CircleButton
                accessibilityLabel="Back"
                onPress={() =>
                  router.canGoBack()
                    ? router.back()
                    : router.replace("/sign-in")
                }
              >
                <ChevronLeft
                  size={24}
                  color={colors.cream}
                  strokeWidth={1.75}
                />
              </CircleButton>
            ) : (
              <AppText style={styles.wordmark} accessibilityRole="header">
                Pourly
              </AppText>
            )}
          </View>

          <View style={styles.header}>
            <AppText variant="display" accessibilityRole="header">
              {title}
            </AppText>
            <AppText variant="body" color="cream2">
              {subtitle}
            </AppText>
          </View>

          <View style={styles.form}>{children}</View>

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ground },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  topBar: { height: 48, justifyContent: "center", marginBottom: 40 },
  wordmark: {
    fontFamily: fonts.serifItalic,
    fontSize: 36,
    lineHeight: 40,
    color: colors.cream,
  },
  header: { gap: 12, marginBottom: 32 },
  form: { gap: 20 },
  footer: { marginTop: "auto", paddingTop: 32, alignItems: "center" },
});
