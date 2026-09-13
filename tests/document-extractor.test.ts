import {
  analyzeDocumentImage,
  SAMPLE_DOCUMENTS,
  ExtractedStudentData,
} from "../src/lib/ai/document-extractor";

describe("Document Extractor & OCR Vision Module", () => {
  it("should have valid CNH and RG sample presets", () => {
    expect(SAMPLE_DOCUMENTS.cnh_demo).toBeDefined();
    expect(SAMPLE_DOCUMENTS.cnh_demo.fullName).toBe("Gabriel Henrique Silveira");
    expect(SAMPLE_DOCUMENTS.cnh_demo.document).toBe("412.890.341-20");
    expect(SAMPLE_DOCUMENTS.cnh_demo.documentType).toBe("CNH");

    expect(SAMPLE_DOCUMENTS.rg_demo).toBeDefined();
    expect(SAMPLE_DOCUMENTS.rg_demo.fullName).toBe("Beatriz Lima Mendonça");
    expect(SAMPLE_DOCUMENTS.rg_demo.document).toBe("389.201.765-88");
    expect(SAMPLE_DOCUMENTS.rg_demo.documentType).toBe("RG");
  });

  it("should analyze sample CNH preset and return structured registration fields", async () => {
    const data: ExtractedStudentData = await analyzeDocumentImage("cnh_demo");
    expect(data.fullName).toBe("Gabriel Henrique Silveira");
    expect(data.document).toBe("412.890.341-20");
    expect(data.email).toContain("@");
    expect(data.phone).toContain("11");
    expect(data.confidence).toBeGreaterThan(0.9);
    expect(data.extractedFieldsCount).toBe(6);
  });

  it("should analyze sample RG preset and return structured registration fields", async () => {
    const data: ExtractedStudentData = await analyzeDocumentImage("rg_demo");
    expect(data.fullName).toBe("Beatriz Lima Mendonça");
    expect(data.document).toBe("389.201.765-88");
    expect(data.documentType).toBe("RG");
    expect(data.confidence).toBeGreaterThan(0.9);
  });

  it("should synthesize structured student fields when custom file name is passed", async () => {
    const data = await analyzeDocumentImage("cnh_rodrigo_albuquerque.jpg", "cnh_rodrigo_albuquerque.jpg");
    expect(data.fullName).toContain("Rodrigo");
    expect(data.documentType).toBe("CNH");
    expect(data.document).toBeDefined();
    expect(data.courseId).toBeDefined();
  });
});
