export class OcrUnavailableError extends Error {
  constructor() {
    super(
      "Label reading needs a development build. Search for the bottle instead.",
    );
    this.name = "OcrUnavailableError";
  }
}

export async function readLabel(imageUri: string): Promise<string[]> {
  let TextRecognition: typeof import("@react-native-ml-kit/text-recognition").default;
  try {
    TextRecognition = require("@react-native-ml-kit/text-recognition").default;
  } catch {
    throw new OcrUnavailableError();
  }
  if (!TextRecognition?.recognize) throw new OcrUnavailableError();

  const result = await TextRecognition.recognize(imageUri);
  // Blocks come top-to-bottom; the brand is usually in the first ones.
  return result.blocks.flatMap((b) => b.lines.map((l) => l.text));
}
