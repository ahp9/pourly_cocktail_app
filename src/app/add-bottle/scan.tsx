import { Button } from "@/components/controls/Button";
import { CircleButton } from "@/components/controls/CircleButton";
import { AppText } from "@/components/primitivies/AppText";
import { useAddBottle } from "@/hooks/useAddBottle";
import { OcrUnavailableError, readLabel } from "@/services/ocr";
import { identifyByBarcode, identifyByLabel } from "@/services/products";
import { colors, radius } from "@/styles/tokens";
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Mode = "barcode" | "label";
type Status =
  | { kind: "idle" }
  | { kind: "busy"; message: string }
  | { kind: "unknownBarcode" }
  | { kind: "error"; message: string };

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const locked = useRef(false);
  const { setDraft, unknownBarcode, setUnknownBarcode } = useAddBottle();

  const [mode, setMode] = useState<Mode>("barcode");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const close = () =>
    router.canGoBack() ? router.back() : router.replace("/my-bar");
  const searchInstead = () => router.replace("/add-bottle");

  // --- Barcode -------------------------------------------------------------
  const onBarcode = async ({ data }: BarcodeScanningResult) => {
    if (locked.current) return;
    locked.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStatus({ kind: "busy", message: "Looking it up…" });

    const product = await identifyByBarcode(data);
    if (product) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setDraft(product);
      router.replace("/add-bottle/confirm");
      return;
    }

    setUnknownBarcode(data);
    setStatus({ kind: "unknownBarcode" });
  };

  // --- Label ---------------------------------------------------------------
  const onCapture = async () => {
    if (locked.current || !camera.current) return;
    locked.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStatus({ kind: "busy", message: "Reading the label…" });

    try {
      const photo = await camera.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: true,
      });
      if (!photo) throw new Error("No photo");
      const lines = await readLabel(photo.uri);

      if (lines.length === 0) {
        locked.current = false;
        setStatus({
          kind: "error",
          message: "Couldn't read any text. Get closer to the front label.",
        });
        return;
      }

      setDraft(identifyByLabel(lines, unknownBarcode));
      router.replace("/add-bottle/confirm");
    } catch (e) {
      locked.current = false;
      setStatus({
        kind: "error",
        message:
          e instanceof OcrUnavailableError
            ? e.message
            : "Something went wrong reading the label. Try again.",
      });
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setStatus({ kind: "idle" });
    locked.current = false;
  };

  // --- Permission states ----------------------------------------------------
  if (!permission) return <View style={styles.black} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permission}>
        <View style={{ gap: 12 }}>
          <AppText variant="title">Camera access</AppText>
          <AppText variant="body" color="cream2">
            Pourly uses the camera to read barcodes and labels. Photos stay on
            your phone.
          </AppText>
        </View>
        <View style={{ gap: 12 }}>
          <Button
            label={permission.canAskAgain ? "Allow camera" : "Open settings"}
            onPress={
              permission.canAskAgain
                ? requestPermission
                : () => Linking.openSettings()
            }
            fullWidth
          />
          <Button
            label="Search instead"
            variant="secondary"
            onPress={searchInstead}
            fullWidth
          />
        </View>
      </SafeAreaView>
    );
  }

  const busy = status.kind === "busy";
  const scanning = mode === "barcode" && status.kind === "idle";

  return (
    <View style={styles.black}>
      <CameraView
        ref={camera}
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
        }}
        onBarcodeScanned={scanning ? onBarcode : undefined}
      />

      {/* Frame */}
      <View style={styles.frameWrap} pointerEvents="none">
        <View
          style={[
            styles.frame,
            mode === "barcode" ? styles.frameBarcode : styles.frameLabel,
          ]}
        />
      </View>

      <SafeAreaView
        style={styles.overlay}
        edges={["top", "bottom"]}
        pointerEvents="box-none"
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <CircleButton accessibilityLabel="Close" onPress={close}>
            <X size={22} color={colors.cream} strokeWidth={1.75} />
          </CircleButton>

          <View style={styles.segment} accessibilityRole="tablist">
            {(["barcode", "label"] as const).map((m) => (
              <Pressable
                key={m}
                onPress={() => switchMode(m)}
                disabled={busy}
                accessibilityRole="tab"
                accessibilityState={{ selected: mode === m }}
                style={[styles.segmentItem, mode === m && styles.segmentActive]}
              >
                <AppText
                  variant="label"
                  color={mode === m ? "onAmber" : "cream2"}
                >
                  {m === "barcode" ? "Barcode" : "Label"}
                </AppText>
              </Pressable>
            ))}
          </View>

          <View style={{ width: 48 }} />
        </View>

        {/* Bottom panel */}
        <View style={styles.bottom}>
          {status.kind === "unknownBarcode" ? (
            <View style={styles.sheet} accessibilityLiveRegion="polite">
              <AppText variant="heading">Barcode not recognised.</AppText>
              <AppText variant="body" color="cream2">
                Point the camera at the front label and we'll read the name
                instead.
              </AppText>
              <Button
                label="Scan label instead"
                onPress={() => switchMode("label")}
                fullWidth
              />
              <Button
                label="Search manually"
                variant="secondary"
                onPress={searchInstead}
                fullWidth
              />
            </View>
          ) : (
            <>
              <View style={styles.hint} accessibilityLiveRegion="polite">
                {busy && <ActivityIndicator color={colors.amber} />}
                <AppText
                  variant="label"
                  color={status.kind === "error" ? "campari" : "cream"}
                  align="center"
                >
                  {status.kind === "busy"
                    ? status.message
                    : status.kind === "error"
                      ? status.message
                      : mode === "barcode"
                        ? "Line up the barcode inside the frame."
                        : "Fit the front label in the frame, then tap."}
                </AppText>
              </View>

              {mode === "label" && (
                <Pressable
                  onPress={onCapture}
                  disabled={busy}
                  accessibilityRole="button"
                  accessibilityLabel="Read label"
                  style={({ pressed }) => [
                    styles.shutter,
                    (pressed || busy) && { opacity: 0.7 },
                  ]}
                >
                  <View style={styles.shutterInner} />
                </Pressable>
              )}

              <Pressable
                onPress={searchInstead}
                hitSlop={12}
                accessibilityRole="link"
              >
                <AppText variant="label" color="amberLight">
                  Search instead
                </AppText>
              </Pressable>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  black: { flex: 1, backgroundColor: "#000" },
  permission: {
    flex: 1,
    backgroundColor: colors.ground,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "space-between",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  segment: {
    flexDirection: "row",
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: "rgba(22, 18, 14, 0.8)",
    borderWidth: 1,
    borderColor: colors.line,
  },
  segmentItem: {
    minHeight: 40,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentActive: { backgroundColor: colors.amber },
  frameWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    borderWidth: 2,
    borderColor: colors.amber,
    borderRadius: radius.card,
  },
  frameBarcode: { width: 290, height: 170 },
  frameLabel: { width: 260, height: 360 },
  bottom: {
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: "rgba(22, 18, 14, 0.8)",
  },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: colors.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.amber,
  },
  sheet: {
    alignSelf: "stretch",
    gap: 12,
    padding: 20,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
