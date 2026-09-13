/**
 * Gemini Nano / Chrome Built-in AI Client Module
 * 
 * Provides direct, client-side access to Chrome's native Prompt API (LanguageModel).
 * Operates 100% locally on-device with zero API keys, zero backend network calls,
 * and zero remote fallback in this module.
 */

// Normalized availability status as required by the specification
export type GeminiNanoAvailabilityStatus =
  | "unavailable"
  | "downloadable"
  | "downloading"
  | "available";

export interface GeminiNanoAvailabilityResult {
  status: GeminiNanoAvailabilityStatus;
  rawStatus: string;
  supportedLanguages: string[];
  outputLanguage: string;
  message: string;
}

export interface GeminiNanoSessionOptions {
  outputLanguage?: string;
  temperature?: number;
  topK?: number;
  signal?: AbortSignal;
  onDownloadProgress?: (loadedBytes: number, totalBytes: number, percent: number) => void;
}

export interface GeminiNanoSession {
  prompt(text: string): Promise<string>;
  promptStreaming?(text: string): AsyncIterable<string>;
  destroy(): void;
  maxTokens?: number;
  tokensLeft?: number;
  tokensSoFar?: number;
}

// Global Chrome LanguageModel interface definitions
interface ChromeLanguageModelMonitor {
  addEventListener(
    type: "downloadprogress",
    listener: (e: { loaded: number; total: number }) => void
  ): void;
}

interface ChromeLanguageModelStatic {
  availability(options?: {
    outputLanguage?: string;
    expectedOutputs?: Array<{ type: string; languages: string[] }>;
  }): Promise<string>;
  create(options?: {
    outputLanguage?: string;
    expectedOutputs?: Array<{ type: string; languages: string[] }>;
    temperature?: number;
    topK?: number;
    signal?: AbortSignal;
    monitor?: (m: ChromeLanguageModelMonitor) => void;
  }): Promise<GeminiNanoSession>;
}

declare global {
  interface Window {
    LanguageModel?: ChromeLanguageModelStatic;
  }
}

/**
 * Diagnostic logger that prints only in development mode or in browser console
 */
function logNano(message: string, ...args: unknown[]) {
  if (process.env.NODE_ENV !== "production" || typeof window !== "undefined") {
    console.log(`[Gemini Nano] ${message}`, ...args);
  }
}

/**
 * Safely resolves the LanguageModel constructor in browser environment.
 * Supports window.LanguageModel, globalThis.LanguageModel, and window.ai.languageModel.
 * Always returns null during SSR.
 */
export function getLanguageModelAPI(): ChromeLanguageModelStatic | null {
  if (typeof window === "undefined") {
    return null;
  }

  const win = window as unknown as {
    LanguageModel?: ChromeLanguageModelStatic;
    ai?: {
      languageModel?: ChromeLanguageModelStatic;
      assistant?: ChromeLanguageModelStatic;
    };
  };

  // 1. Modern WICG standard: global LanguageModel or window.LanguageModel
  if (typeof win.LanguageModel !== "undefined" && typeof win.LanguageModel.availability === "function") {
    return win.LanguageModel;
  }

  // 2. Global scope check
  const globalRef = globalThis as unknown as { LanguageModel?: ChromeLanguageModelStatic };
  if (typeof globalRef.LanguageModel !== "undefined" && typeof globalRef.LanguageModel.availability === "function") {
    return globalRef.LanguageModel;
  }

  // 3. Fallback: window.ai.languageModel
  if (win.ai?.languageModel && typeof (win.ai.languageModel as unknown as ChromeLanguageModelStatic).availability === "function") {
    return win.ai.languageModel as unknown as ChromeLanguageModelStatic;
  }

  // 4. Legacy fallback: window.ai.assistant
  if (win.ai?.assistant && typeof (win.ai.assistant as unknown as ChromeLanguageModelStatic).availability === "function") {
    return win.ai.assistant as unknown as ChromeLanguageModelStatic;
  }

  return null;
}

/**
 * Checks whether the Chrome Gemini Nano Prompt API is available in the current browser.
 * Configures explicit output language as "en" to satisfy Chrome's safety and quality requirement.
 */
export async function checkGeminiNanoAvailability(
  targetLanguage: string = "en"
): Promise<GeminiNanoAvailabilityResult> {
  // Never execute during SSR
  if (typeof window === "undefined") {
    return {
      status: "unavailable",
      rawStatus: "ssr",
      supportedLanguages: ["de", "en", "es", "fr", "ja"],
      outputLanguage: targetLanguage,
      message: "Execução no servidor (SSR). O Gemini Nano só roda no client/navegador.",
    };
  }

  const modelApi = getLanguageModelAPI();

  if (!modelApi) {
    logNano("availability: unavailable (API not found)");
    return {
      status: "unavailable",
      rawStatus: "unsupported",
      supportedLanguages: ["de", "en", "es", "fr", "ja"],
      outputLanguage: targetLanguage,
      message:
        "API LanguageModel não detectada. Habilite a flag chrome://flags/#prompt-api-for-gemini-nano no Chrome 131+ ou Canary.",
    };
  }

  try {
    let rawStatus: string;

    // Call availability specifying output language to avoid Chrome's warning:
    // "No output language was specified in a LanguageModel API request."
    try {
      rawStatus = await modelApi.availability({
        expectedOutputs: [{ type: "text", languages: [targetLanguage] }],
      });
    } catch {
      try {
        rawStatus = await modelApi.availability({
          outputLanguage: targetLanguage,
        });
      } catch {
        // Fallback to calling without args if the browser engine expects zero args
        rawStatus = await modelApi.availability();
      }
    }

    logNano(`availability: ${rawStatus}`);

    // Map Chrome's various status strings to the required unified type:
    // "unavailable" | "downloadable" | "downloading" | "available"
    let status: GeminiNanoAvailabilityStatus = "unavailable";
    let message = "";

    const normalized = String(rawStatus).toLowerCase();

    if (normalized === "available" || normalized === "readily") {
      status = "available";
      message = "Modelo Gemini Nano pronto e disponível para inferência local imediata.";
    } else if (normalized === "downloadable" || normalized === "after-download") {
      status = "downloadable";
      message = "Modelo Gemini Nano suportado pelo dispositivo, pronto para ser baixado (~1.5GB a 2GB).";
    } else if (normalized === "downloading") {
      status = "downloading";
      message = "Download do modelo Gemini Nano em andamento no navegador.";
    } else {
      status = "unavailable";
      message = "Modelo Gemini Nano não suportado pelo hardware ou desativado nas flags do navegador.";
    }

    return {
      status,
      rawStatus,
      supportedLanguages: ["de", "en", "es", "fr", "ja"],
      outputLanguage: targetLanguage,
      message,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logNano("availability check error:", errorMsg);
    return {
      status: "unavailable",
      rawStatus: "error",
      supportedLanguages: ["de", "en", "es", "fr", "ja"],
      outputLanguage: targetLanguage,
      message: `Erro ao verificar disponibilidade: ${errorMsg}`,
    };
  }
}

/**
 * Creates a Gemini Nano session using the local Chrome Prompt API.
 * Configures the output language explicitly as "en" and attaches download progress monitoring when needed.
 */
export async function createGeminiNanoSession(
  options: GeminiNanoSessionOptions = {}
): Promise<GeminiNanoSession> {
  if (typeof window === "undefined") {
    throw new Error("createGeminiNanoSession não pode ser executado durante o SSR.");
  }

  const modelApi = getLanguageModelAPI();
  if (!modelApi) {
    throw new Error(
      "API LanguageModel não está disponível neste navegador. Verifique chrome://flags/#prompt-api-for-gemini-nano."
    );
  }

  const outputLang = options.outputLanguage || "en";
  logNano("creating session", { outputLanguage: outputLang });

  // Build creation options including monitor callback if provided
  const createOptions: Parameters<ChromeLanguageModelStatic["create"]>[0] = {
    outputLanguage: outputLang,
    expectedOutputs: [{ type: "text", languages: [outputLang] }],
    temperature: options.temperature,
    topK: options.topK,
    signal: options.signal,
  };

  if (options.onDownloadProgress) {
    createOptions.monitor = (monitor) => {
      monitor.addEventListener("downloadprogress", (e) => {
        const loaded = e.loaded || 0;
        const total = e.total || 0;
        const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;
        logNano(`download progress: ${loaded}/${total} (${percent}%)`);
        if (options.onDownloadProgress) {
          options.onDownloadProgress(loaded, total, percent);
        }
      });
    };
  }

  let session: GeminiNanoSession;

  try {
    session = await modelApi.create(createOptions);
  } catch (err1) {
    logNano("initial session creation failed, retrying with simplified options:", err1);
    try {
      // Fallback with only outputLanguage
      session = await modelApi.create({
        outputLanguage: outputLang,
        temperature: options.temperature,
        topK: options.topK,
      });
    } catch (err2) {
      logNano("secondary session creation failed, retrying with raw options:", err2);
      session = await modelApi.create();
    }
  }

  // Wrap prompt method to provide diagnostic logging
  const originalPrompt = session.prompt.bind(session);
  session.prompt = async (text: string): Promise<string> => {
    logNano("prompt started", { promptLength: text.length });
    const startTime = performance.now();
    try {
      const response = await originalPrompt(text);
      const durationMs = Math.round(performance.now() - startTime);
      logNano("prompt completed", { durationMs, responseLength: response.length });
      return response;
    } catch (promptError) {
      logNano("prompt error:", promptError);
      throw promptError;
    }
  };

  return session;
}

/**
 * AIProvider Abstraction as specified in step 9
 */
export interface AIProvider {
  isAvailable(): Promise<boolean>;
  getStatus(): Promise<string>;
  generate(prompt: string): Promise<string>;
}

/**
 * GeminiNanoProvider
 * Implementation of AIProvider exclusively utilizing Chrome's local Gemini Nano model.
 */
export class GeminiNanoProvider implements AIProvider {
  private activeSession: GeminiNanoSession | null = null;
  private targetLanguage: string;

  constructor(targetLanguage: string = "en") {
    this.targetLanguage = targetLanguage;
  }

  public async isAvailable(): Promise<boolean> {
    const result = await checkGeminiNanoAvailability(this.targetLanguage);
    return result.status === "available";
  }

  public async getStatus(): Promise<string> {
    const result = await checkGeminiNanoAvailability(this.targetLanguage);
    return result.status;
  }

  public async generate(prompt: string): Promise<string> {
    if (!this.activeSession) {
      this.activeSession = await createGeminiNanoSession({
        outputLanguage: this.targetLanguage,
      });
    }

    return await this.activeSession.prompt(prompt);
  }

  public destroy(): void {
    if (this.activeSession && typeof this.activeSession.destroy === "function") {
      this.activeSession.destroy();
      this.activeSession = null;
    }
  }
}
