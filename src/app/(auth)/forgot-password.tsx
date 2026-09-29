import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/controls/Button";
import { TextField } from "@/components/forms/TextField";
import { AppText } from "@/components/primitivies/AppText";
import { useState } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!EMAIL.test(email.trim()))
      return setError("Enter a valid email address.");
    setError(undefined);
    // TODO: call your backend's reset endpoint here.
    setSent(true);
  };

  return (
    <AuthLayout
      showBack
      title="Reset password."
      subtitle="We'll email you a link to set a new one."
    >
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={error}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="send"
        onSubmitEditing={submit}
      />
      {sent ? (
        <AppText variant="label" color="basil" accessibilityLiveRegion="polite">
          Check your inbox for the link.
        </AppText>
      ) : null}
      <Button
        label={sent ? "Send again" : "Send link"}
        onPress={submit}
        fullWidth
      />
    </AuthLayout>
  );
}
