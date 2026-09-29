import { AuthLayout } from "@/components/auth/AuthLayout";
import { InlineLink } from "@/components/auth/InlineLink";
import { Button } from "@/components/controls/Button";
import { TextField } from "@/components/forms/TextField";
import { AppText } from "@/components/primitivies/AppText";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { colors } from "../../styles/tokens";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignIn() {
  const { signIn } = useAuth();
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const next: typeof errors = {};
    if (!EMAIL.test(email.trim())) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (next.email || next.password) return;

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      // No navigation needed: the guard in app/_layout.tsx swaps to the tabs.
    } catch (e) {
      setErrors({
        form:
          e instanceof Error ? e.message : "Something went wrong. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Sign in to see what you can make tonight."
      footer={
        <InlineLink
          prompt="New to Pourly?"
          label="Create an account"
          onPress={() => router.replace("/(auth)/sign-up")}
        />
      }
    >
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        submitBehavior="submit"
      />

      <View style={{ gap: 4 }}>
        <TextField
          ref={passwordRef}
          label="Password"
          password
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <View style={{ alignSelf: "flex-end" }}>
          <InlineLink
            label="Forgot password?"
            onPress={() => router.push("/forgot-password")}
          />
        </View>
      </View>

      {errors.form ? (
        <AppText
          variant="caption"
          color="campari"
          accessibilityLiveRegion="polite"
        >
          {errors.form}
        </AppText>
      ) : null}

      <Button
        label="Sign in"
        onPress={submit}
        loading={loading}
        fullWidth
        iconRight={
          <ArrowRight size={22} color={colors.onAmber} strokeWidth={1.75} />
        }
      />
    </AuthLayout>
  );
}
