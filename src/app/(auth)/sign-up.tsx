import { AuthLayout } from "@/components/auth/AuthLayout";
import { InlineLink } from "@/components/auth/InlineLink";
import { Button } from "@/components/controls/Button";
import { TextField } from "@/components/forms/TextField";
import { AppText } from "@/components/primitivies/AppText";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { TextInput } from "react-native";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  form?: string;
};

export default function SignUp() {
  const { signUp } = useAuth();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const next: Errors = {};
    if (!name.trim()) next.name = "Tell us what to call you.";
    if (!EMAIL.test(email.trim())) next.email = "Enter a valid email address.";
    if (password.length < MIN_PASSWORD)
      next.password = `Use at least ${MIN_PASSWORD} characters.`;
    setErrors(next);
    if (next.name || next.email || next.password) return;

    console.log("Submitting sign-up form:", { name, email, password });

    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password);
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
      showBack
      title="Make an account."
      subtitle="Pourly learns your taste and remembers what's in your bar."
      footer={
        <InlineLink
          prompt="Already have an account?"
          label="Sign in"
          onPress={() => router.replace("/sign-in")}
        />
      }
    >
      <TextField
        label="Name"
        value={name}
        onChangeText={setName}
        error={errors.name}
        placeholder="What should we call you?"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="givenName"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
        submitBehavior="submit"
      />

      <TextField
        ref={emailRef}
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

      <TextField
        ref={passwordRef}
        label="Password"
        password
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        hint={`At least ${MIN_PASSWORD} characters.`}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={submit}
      />

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
        label="Create account"
        onPress={submit}
        loading={loading}
        fullWidth
      />

      <AppText variant="caption" color="muted" align="center">
        By creating an account you agree to the Terms and Privacy Policy. You
        must be of legal drinking age where you live.
      </AppText>
    </AuthLayout>
  );
}
