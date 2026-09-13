import {
  checkGeminiNanoAvailability,
  createGeminiNanoSession,
  getLanguageModelAPI,
  GeminiNanoProvider,
} from "../src/lib/ai/gemini-nano";

describe("Gemini Nano / Chrome Built-in AI Module", () => {
  const originalWindow = global.window;

  beforeEach(() => {
    // Reset window between tests
    delete (global as any).window.LanguageModel;
    delete (global as any).window.ai;
  });

  afterAll(() => {
    global.window = originalWindow;
  });

  describe("1. Browser without support / SSR", () => {
    it("returns unavailable when window.LanguageModel is not defined", async () => {
      const result = await checkGeminiNanoAvailability();
      expect(result.status).toBe("unavailable");
      expect(result.rawStatus).toBe("unsupported");
      expect(result.message).toContain("não detectada");
    });

    it("returns null for getLanguageModelAPI when no API exists", () => {
      expect(getLanguageModelAPI()).toBeNull();
    });

    it("throws error when trying to create session without browser API", async () => {
      await expect(createGeminiNanoSession()).rejects.toThrow("API LanguageModel não está disponível");
    });
  });

  describe("2. Model in downloadable state", () => {
    it("correctly identifies and maps 'downloadable' or 'after-download'", async () => {
      (global as any).window.LanguageModel = {
        availability: jest.fn().mockResolvedValue("downloadable"),
        create: jest.fn(),
      };

      const result = await checkGeminiNanoAvailability();
      expect(result.status).toBe("downloadable");
      expect(result.rawStatus).toBe("downloadable");
      expect(result.outputLanguage).toBe("en");
      expect(result.message).toContain("pronto para ser baixado");
    });

    it("supports monitor callback for download progress", async () => {
      const mockPrompt = jest.fn().mockResolvedValue("Cache-Control header specifies...");
      const mockDestroy = jest.fn();

      (global as any).window.LanguageModel = {
        availability: jest.fn().mockResolvedValue("downloadable"),
        create: jest.fn().mockImplementation((options) => {
          if (options?.monitor) {
            options.monitor({
              addEventListener: (_event: string, cb: (e: any) => void) => {
                cb({ loaded: 500, total: 1000 });
              },
            });
          }
          return Promise.resolve({
            prompt: mockPrompt,
            destroy: mockDestroy,
          });
        }),
      };

      let progressCalled = false;
      const session = await createGeminiNanoSession({
        onDownloadProgress: (loaded, total, percent) => {
          progressCalled = true;
          expect(loaded).toBe(500);
          expect(total).toBe(1000);
          expect(percent).toBe(50);
        },
      });

      expect(progressCalled).toBe(true);
      expect(session).toBeDefined();
    });
  });

  describe("3. Model in available state", () => {
    it("correctly identifies and maps 'available' or 'readily'", async () => {
      (global as any).window.LanguageModel = {
        availability: jest.fn().mockResolvedValue("available"),
        create: jest.fn(),
      };

      const result = await checkGeminiNanoAvailability();
      expect(result.status).toBe("available");
      expect(result.rawStatus).toBe("available");
      expect(result.message).toContain("pronto e disponível");
    });

    it("creates session and executes prompt successfully", async () => {
      const mockPrompt = jest.fn().mockResolvedValue("Local answer from Gemini Nano");
      const mockDestroy = jest.fn();

      (global as any).window.LanguageModel = {
        availability: jest.fn().mockResolvedValue("available"),
        create: jest.fn().mockResolvedValue({
          prompt: mockPrompt,
          destroy: mockDestroy,
        }),
      };

      const session = await createGeminiNanoSession({ outputLanguage: "en" });
      const response = await session.prompt("Explain what cache-control is");

      expect(mockPrompt).toHaveBeenCalledWith("Explain what cache-control is");
      expect(response).toBe("Local answer from Gemini Nano");
    });
  });

  describe("4. Error handling during session creation", () => {
    it("handles error during session creation gracefully", async () => {
      (global as any).window.LanguageModel = {
        availability: jest.fn().mockResolvedValue("available"),
        create: jest.fn().mockRejectedValue(new Error("GPU out of memory")),
      };

      await expect(createGeminiNanoSession()).rejects.toThrow("GPU out of memory");
    });
  });

  describe("5. Error handling during prompt execution", () => {
    it("propagates error when prompt execution fails", async () => {
      const mockPrompt = jest.fn().mockRejectedValue(new Error("Execution timed out"));

      (global as any).window.LanguageModel = {
        availability: jest.fn().mockResolvedValue("available"),
        create: jest.fn().mockResolvedValue({
          prompt: mockPrompt,
          destroy: jest.fn(),
        }),
      };

      const session = await createGeminiNanoSession();
      await expect(session.prompt("Any text")).rejects.toThrow("Execution timed out");
    });
  });

  describe("6. AIProvider abstraction (GeminiNanoProvider)", () => {
    it("implements AIProvider contract and executes generate()", async () => {
      const mockPrompt = jest.fn().mockResolvedValue("Response from GeminiNanoProvider");
      (global as any).window.LanguageModel = {
        availability: jest.fn().mockResolvedValue("available"),
        create: jest.fn().mockResolvedValue({
          prompt: mockPrompt,
          destroy: jest.fn(),
        }),
      };

      const provider = new GeminiNanoProvider("en");
      const isAvail = await provider.isAvailable();
      expect(isAvail).toBe(true);

      const status = await provider.getStatus();
      expect(status).toBe("available");

      const result = await provider.generate("Explain what cache-control is");
      expect(result).toBe("Response from GeminiNanoProvider");

      provider.destroy();
    });
  });
});
