import {
  parseBase64Data,
  VISION_PRESETS,
  interpretImageWithGemini,
} from "../src/lib/ai/vision-client";

describe("Gemini Multimodal Vision Client", () => {
  it("parses data URLs and extracts mimeType and base64Data", () => {
    const rawData = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const dataUrl = `data:image/png;base64,${rawData}`;

    const parsed = parseBase64Data(dataUrl);
    expect(parsed.mimeType).toBe("image/png");
    expect(parsed.base64Data).toBe(rawData);
  });

  it("handles raw base64 string without data prefix", () => {
    const raw = "SGVsbG8gV29ybGQ=";
    const parsed = parseBase64Data(raw, "image/jpeg");
    expect(parsed.mimeType).toBe("image/jpeg");
    expect(parsed.base64Data).toBe(raw);
  });

  it("contains preset sample images with valid data URLs", () => {
    expect(VISION_PRESETS.length).toBeGreaterThanOrEqual(4);
    const cnh = VISION_PRESETS.find((p) => p.id === "cnh_document");
    expect(cnh).toBeDefined();
    expect(cnh?.title).toContain("CNH");
    expect(cnh?.dataUrl).toContain("data:image/svg+xml");

    const diagram = VISION_PRESETS.find((p) => p.id === "architecture_diagram");
    expect(diagram).toBeDefined();
    expect(diagram?.title).toContain("Arquitetura");
  });

  it("performs local vision fallback when no API key is set", async () => {
    const cnhPreset = VISION_PRESETS.find((p) => p.id === "cnh_document")!;
    const result = await interpretImageWithGemini({
      imageBase64: cnhPreset.dataUrl,
      prompt: "Faça o OCR completo dos dados deste documento",
    });

    expect(result.success).toBe(true);
    expect(result.text).toContain("GABRIEL HENRIQUE SILVEIRA");
    expect(result.text).toContain("412.890.341-20");
    expect(result.modelUsed).toContain("Vision Multimodal");
    expect(result.metadata?.isLocalFallback).toBe(true);
  });

  it("performs local vision fallback for diagram architecture", async () => {
    const diagram = VISION_PRESETS.find((p) => p.id === "architecture_diagram")!;
    const result = await interpretImageWithGemini({
      imageBase64: diagram.dataUrl,
      prompt: "Explique a arquitetura desta imagem",
    });

    expect(result.success).toBe(true);
    expect(result.text).toContain("Web MCP");
    expect(result.text).toContain("navigate_to_resource");
  });

  it("attempts Google Gemini API call when API key is provided", async () => {
    const fakeKey = "AIzaSyFakeKeyForTest12345";
    const originalFetch = global.fetch;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: "Esta imagem foi analisada com sucesso pelo Gemini Cloud 2.0 Flash." }],
            },
          },
        ],
      }),
    } as unknown as Response);

    try {
      const result = await interpretImageWithGemini({
        imageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==",
        prompt: "Descreva a imagem",
        apiKey: fakeKey,
      });

      expect(result.success).toBe(true);
      expect(result.text).toContain("Gemini Cloud 2.0 Flash");
      expect(result.modelUsed).toContain("Google Gemini Cloud");
      expect(result.metadata?.isLocalFallback).toBe(false);
    } finally {
      global.fetch = originalFetch;
    }
  });
});
