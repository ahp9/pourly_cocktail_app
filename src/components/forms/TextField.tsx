import { AppText } from "@/components/primitivies/AppText";
import { Eye, EyeOff } from "lucide-react-native";
import { forwardRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { colors, fonts, radius } from "../../styles/tokens";

type Props = Omit<TextInputProps, "style" | "placeholderTextColor"> & {
  label: string;
  error?: string;
  hint?: string;
  password?: boolean;
};

export const TextField = forwardRef<TextInput, Props>(function TextField(
  { label, error, hint, password, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const borderColor = error
    ? colors.campari
    : focused
      ? colors.amber
      : colors.line;
  const helper = error ?? hint;

  return (
    <View style={styles.wrap}>
      <AppText variant="label" color="cream2">
        {label}
      </AppText>

      <View
        style={[
          styles.box,
          { borderColor },
          focused && !error && { backgroundColor: colors.amberTint },
        ]}
      >
        <TextInput
          ref={ref}
          {...rest}
          accessibilityLabel={label}
          accessibilityHint={helper}
          secureTextEntry={password && hidden}
          placeholderTextColor={colors.muted}
          selectionColor={colors.amber}
          cursorColor={colors.amber}
          keyboardAppearance="dark"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={styles.input}
        />

        {password && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            style={styles.trailing}
          >
            {hidden ? (
              <Eye size={22} color={colors.muted} strokeWidth={1.75} />
            ) : (
              <EyeOff size={22} color={colors.muted} strokeWidth={1.75} />
            )}
          </Pressable>
        )}
      </View>

      {helper ? (
        <AppText variant="caption" color={error ? "campari" : "muted"}>
          {helper}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  box: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.tile,
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingRight: 16,
    color: colors.cream,
    fontFamily: fonts.sans400,
    fontSize: 17,
  },
  trailing: { paddingHorizontal: 16, height: "100%", justifyContent: "center" },
});
