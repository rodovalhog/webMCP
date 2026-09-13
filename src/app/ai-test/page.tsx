"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Cpu,
  RefreshCw,
  Download,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Terminal,
  ChevronLeft,
  Copy,
  Check,
  Zap,
  UploadCloud,
  Image as ImageIcon,
  Key,
  Layers,
  FileCode,
  FileText,
  BarChart3,
  Trash2,
  Eye,
  Sliders,
  Send,
  Info,
} from "lucide-react";
import {
  checkGeminiNanoAvailability,
  createGeminiNanoSession,
  GeminiNanoAvailabilityStatus,
  GeminiNanoSession,
} from "@/lib/ai/gemini-nano";
import {
  VISION_PRESETS,
  VisionPreset,
  interpretImageWithGemini,
  fileToDataUrl,
  VisionInterpretationResult,
} from "@/lib/ai/vision-client";

type ActiveTab = "vision" | "nano";

export default function GeminiAiTestPage() {
  // Active Navigation Tab: Defaults to Vision to directly fulfill the user's request
  const [activeTab, setActiveTab] = useState<ActiveTab>("vision");

  // ==========================================
  // STATE: GEMINI MULTIMODAL VISION
  // ==========================================
  const [selectedImage, setSelectedImage] = useState<string | null>(VISION_PRESETS[0].dataUrl);
  const [imageMeta, setImageMeta] = useState<{
    name: string;
    sizeKb: number;
    mimeType: string;
    isPreset?: boolean;
    presetId?: string;
  }>({
    name: "cnh_digital_brasileira.svg",
    sizeKb: 14,
    mimeType: "image/svg+xml",
    isPreset: true,
    presetId: "cnh_document",
  });

  const [visionPrompt, setVisionPrompt] = useState<string>(
    "Faça o OCR completo deste documento: extraia nome completo, CPF, data de nascimento, filiação, categoria e validade em formato estruturado."
  );
  const [selectedModel, setSelectedModel] = useState<string>("gemini-2.0-flash");
  const [customApiKey, setCustomApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  const [visionResult, setVisionResult] = useState<VisionInterpretationResult | null>(null);
  const [isAnalyzingVision, setIsAnalyzingVision] = useState<boolean>(false);
  const [visionError, setVisionError] = useState<string | null>(null);
  const [visionCopied, setVisionCopied] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load stored API key if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem("learnflow_ai_key") || "";
      if (stored) {
        setCustomApiKey(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    try {
      if (key.trim()) {
        localStorage.setItem("learnflow_ai_key", key.trim());
      } else {
        localStorage.removeItem("learnflow_ai_key");
      }
    } catch {
      // ignore
    }
  };

  // Handle image file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    await processSelectedFile(file);
  };

  const processSelectedFile = async (file: File) => {
    try {
      setVisionError(null);
      const { dataUrl, mimeType, sizeKb } = await fileToDataUrl(file);
      setSelectedImage(dataUrl);
      setImageMeta({
        name: file.name,
        sizeKb,
        mimeType,
        isPreset: false,
      });
      // Suggest general prompt if empty
      if (!visionPrompt.trim()) {
        setVisionPrompt("Analise detalhadamente esta imagem, identifique os elementos principais e descreva o conteúdo.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setVisionError(`Falha ao ler imagem: ${msg}`);
    }
  };

  // Handle Drag & Drop
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        await processSelectedFile(file);
      } else {
        setVisionError("Por favor selecione um arquivo de imagem válido (PNG, JPEG, WEBP ou SVG).");
      }
    }
  };

  const selectPreset = (preset: VisionPreset) => {
    setSelectedImage(preset.dataUrl);
    setImageMeta({
      name: `${preset.id}.svg`,
      sizeKb: 12,
      mimeType: preset.mimeType,
      isPreset: true,
      presetId: preset.id,
    });
    setVisionPrompt(preset.suggestedPrompt);
    setVisionError(null);
  };

  // Execute Gemini Multimodal Vision interpretation
  const handleAnalyzeVision = async () => {
    if (!selectedImage) {
      setVisionError("Por favor carregue ou selecione uma imagem para ser analisada.");
      return;
    }
    if (!visionPrompt.trim()) {
      setVisionError("Por favor digite uma pergunta ou instrução para a IA.");
      return;
    }

    setIsAnalyzingVision(true);
    setVisionError(null);
    setVisionResult(null);

    try {
      const result = await interpretImageWithGemini({
        imageBase64: selectedImage,
        mimeType: imageMeta.mimeType,
        prompt: visionPrompt,
        apiKey: customApiKey,
        model: selectedModel,
      });

      setVisionResult(result);
      if (result.error) {
        setVisionError(result.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setVisionError(`Erro ao interpretar imagem com a IA: ${msg}`);
    } finally {
      setIsAnalyzingVision(false);
    }
  };

  const copyVisionText = () => {
    if (!visionResult?.text) return;
    navigator.clipboard.writeText(visionResult.text);
    setVisionCopied(true);
    setTimeout(() => setVisionCopied(false), 2000);
  };

  // ==========================================
  // STATE: GEMINI NANO ON-DEVICE (PROMPT API)
  // ==========================================
  const [status, setStatus] = useState<GeminiNanoAvailabilityStatus | "checking">("checking");
  const [statusMessage, setStatusMessage] = useState<string>("Verificando disponibilidade do Gemini Nano no navegador...");
  const [rawStatus, setRawStatus] = useState<string>("");
  const [downloadProgress, setDownloadProgress] = useState<{
    loaded: number;
    total: number;
    percent: number;
  } | null>(null);

  const [promptInput, setPromptInput] = useState<string>("Explain what cache-control is");
  const [responseOutput, setResponseOutput] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [executionDurationMs, setExecutionDurationMs] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [session, setSession] = useState<GeminiNanoSession | null>(null);

  const runAvailabilityCheck = useCallback(async () => {
    setStatus("checking");
    setErrorMessage(null);
    try {
      const result = await checkGeminiNanoAvailability("en");
      setStatus(result.status);
      setStatusMessage(result.message);
      setRawStatus(result.rawStatus);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatus("unavailable");
      setStatusMessage(`Falha ao verificar API: ${msg}`);
      setErrorMessage(msg);
    }
  }, []);

  useEffect(() => {
    runAvailabilityCheck();
  }, [runAvailabilityCheck]);

  useEffect(() => {
    return () => {
      if (session && typeof session.destroy === "function") {
        session.destroy();
      }
    };
  }, [session]);

  const handleDownloadModel = async () => {
    setIsDownloading(true);
    setErrorMessage(null);
    setDownloadProgress({ loaded: 0, total: 100, percent: 0 });

    try {
      setStatusMessage("Iniciando download do modelo Gemini Nano no navegador...");
      const createdSession = await createGeminiNanoSession({
        outputLanguage: "en",
        onDownloadProgress: (loaded, total, percent) => {
          setDownloadProgress({ loaded, total, percent });
          setStatus("downloading");
          setStatusMessage(`Baixando componentes do modelo: ${percent}% concluído...`);
        },
      });

      setSession(createdSession);
      setStatus("available");
      setStatusMessage("Modelo Gemini Nano baixado com sucesso e pronto para uso!");
      setDownloadProgress(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Falha durante o download/instanciação do modelo: ${msg}`);
      setStatusMessage("Ocorreu um erro ao baixar ou instanciar o modelo.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExecutePrompt = async () => {
    if (!promptInput.trim()) return;

    setIsExecuting(true);
    setErrorMessage(null);
    setResponseOutput("");
    const startTime = performance.now();

    try {
      let activeSession = session;
      if (!activeSession) {
        setStatusMessage("Criando sessão local no idioma inglês ('en')...");
        activeSession = await createGeminiNanoSession({ outputLanguage: "en" });
        setSession(activeSession);
      }

      setStatusMessage("Executando inferência local on-device via LanguageModel...");
      const result = await activeSession.prompt(promptInput);
      const duration = Math.round(performance.now() - startTime);

      setResponseOutput(result);
      setExecutionDurationMs(duration);
      setStatusMessage("Inferência local concluída com sucesso!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Erro durante a execução do prompt: ${msg}`);
      setStatusMessage("Falha na geração local.");
    } finally {
      setIsExecuting(false);
    }
  };

  const copyResponse = () => {
    if (!responseOutput) return;
    navigator.clipboard.writeText(responseOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-8">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto space-y-4 border-b border-slate-800 pb-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/technical"
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 transition"
            >
              Arquitetura Técnica
            </Link>
            <Link
              href="/how-it-works"
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-600/30 transition"
            >
              Como Funciona
            </Link>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Laboratório de IA &amp; Visão Computacional</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Gemini AI Test Console &amp; Vision Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            Envie imagens para interpretação multimodal com a IA do Gemini (OCR de documentos, análise de diagramas,
            leitura de código e métricas) ou teste o modelo local Gemini Nano no navegador.
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab("vision")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 border ${
              activeTab === "vision"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg shadow-purple-500/20"
                : "bg-slate-900/80 hover:bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Interpretação de Imagem (Gemini Multimodal)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-mono">NOVO</span>
          </button>

          <button
            onClick={() => setActiveTab("nano")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 border ${
              activeTab === "nano"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/20"
                : "bg-slate-900/80 hover:bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Gemini Nano On-Device (Prompt API)</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: GEMINI MULTIMODAL VISION */}
      {activeTab === "vision" && (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Top Info Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-slate-900/40 border border-blue-500/20 text-xs text-slate-300 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white">Como Funciona o Envio de Imagens:</span>
              <p className="text-slate-400 leading-relaxed">
                A imagem selecionada é convertida para <strong>Base64</strong> e enviada no formato multimodal{" "}
                <code className="text-purple-300 font-mono">inline_data</code> para o Gemini. Se você tiver uma chave da Google
                AI configurada, o modelo de nuvem <code className="text-blue-300 font-mono">gemini-2.0-flash</code> processará a inferência.
                Caso não possua chave, nosso <strong>Motor Inteligente LearnFlow Vision OCR</strong> garante a interpretação imediata.
              </p>
            </div>
          </div>

          {/* Grid Layout: Left Column (Image & Presets) | Right Column (Prompt & Controls) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Image Upload & Preview */}
            <div className="lg:col-span-6 space-y-4">
              {/* Presets Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white font-mono uppercase">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Amostras Prontas (1 Clique):</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">Escolha para testar</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {VISION_PRESETS.map((preset) => {
                    const isCurrent = imageMeta.isPreset && imageMeta.presetId === preset.id;
                    const IconComp =
                      preset.id === "cnh_document"
                        ? FileText
                        : preset.id === "architecture_diagram"
                        ? Layers
                        : preset.id === "code_snippet"
                        ? FileCode
                        : BarChart3;

                    return (
                      <button
                        key={preset.id}
                        onClick={() => selectPreset(preset)}
                        className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
                          isCurrent
                            ? "bg-purple-600/15 border-purple-500/50 text-purple-200 ring-1 ring-purple-500/30"
                            : "bg-slate-900/80 hover:bg-slate-900 border-slate-800 text-slate-300"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                            isCurrent ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-xs font-semibold truncate">{preset.title}</div>
                          <div className="text-[10px] text-slate-400 truncate">{preset.category}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-3xl border-2 border-dashed p-6 text-center transition flex flex-col items-center justify-center gap-3 ${
                  isDragOver
                    ? "border-purple-500 bg-purple-950/20"
                    : "border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
                  <UploadCloud className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-white">
                    Arraste e solte sua imagem aqui ou <span className="text-blue-400 underline">clique para procurar</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Suporta PNG, JPG, WEBP e SVG (até 10MB)
                  </p>
                </div>
              </div>

              {/* Live Preview Card */}
              {selectedImage && (
                <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white font-mono uppercase">Preview da Imagem:</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                        {imageMeta.name} • {imageMeta.sizeKb}KB
                      </span>
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setVisionResult(null);
                        }}
                        title="Remover imagem"
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 flex items-center justify-center p-2 min-h-[220px] max-h-[340px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedImage}
                      alt="Imagem para interpretação"
                      className="max-h-[300px] w-auto object-contain rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Prompt & Gemini Controls */}
            <div className="lg:col-span-6 space-y-4">
              {/* Prompt Card */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span>O que você quer que o Gemini interprete?</span>
                  </label>

                  <button
                    onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono transition"
                  >
                    <Key className="w-3 h-3" />
                    <span>{showApiKeyInput ? "Ocultar Chave" : "Configurar API Key"}</span>
                  </button>
                </div>

                {/* Optional API Key & Model Configuration */}
                {showApiKeyInput && (
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
                        <Sliders className="w-3 h-3 text-purple-400" />
                        <span>Configuração da Nuvem Google Gemini</span>
                      </span>
                      <span className="text-[10px] text-slate-500">Opcional</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-mono">Chave de API do Gemini:</label>
                      <input
                        type="password"
                        value={customApiKey}
                        onChange={(e) => handleSaveApiKey(e.target.value)}
                        placeholder="AIzaSy... (ou deixe vazio para usar o motor local)"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-purple-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-mono">Modelo Multimodal:</label>
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-sans text-white focus:border-purple-500 outline-none"
                      >
                        <option value="gemini-2.0-flash">gemini-2.0-flash (Recomendado / Mais rápido)</option>
                        <option value="gemini-1.5-flash-latest">gemini-1.5-flash-latest</option>
                        <option value="gemini-3.6-flash">gemini-3.6-flash (Flagship 2026)</option>
                        <option value="gemini-1.5-pro">gemini-1.5-pro (Raciocínio Profundo)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Quick Prompts Chips */}
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">
                    Sugestões Rápidas de Prompt:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "📄 OCR Completo", prompt: "Faça o OCR completo de todos os textos, números e campos visíveis nesta imagem." },
                      { label: "🧠 Explicar Arquitetura", prompt: "Explique detalhadamente cada elemento deste diagrama e o fluxo de comunicação entre as partes." },
                      { label: "🔍 Identificar Elementos", prompt: "Identifique todos os elementos visuais, paleta de cores, componentes e estrutura desta imagem." },
                      { label: "📝 Estruturar em JSON", prompt: "Extraia todos os dados essenciais desta imagem e formate como um objeto JSON estruturado e válido." },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setVisionPrompt(item.prompt)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-white transition"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Textarea */}
                <textarea
                  value={visionPrompt}
                  onChange={(e) => setVisionPrompt(e.target.value)}
                  rows={4}
                  disabled={isAnalyzingVision}
                  placeholder="Escreva o que você deseja que a IA faça com esta imagem..."
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-sans text-white focus:border-purple-500 outline-none transition disabled:opacity-50"
                />

                {/* Execute Button */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {customApiKey.trim() ? "Google Gemini Cloud Vision" : "Modo Autônomo / Vision OCR Ativo"}
                    </span>
                  </div>

                  <button
                    onClick={handleAnalyzeVision}
                    disabled={isAnalyzingVision || !selectedImage || !visionPrompt.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-purple-500/25 disabled:opacity-40 transition flex items-center gap-2"
                  >
                    {isAnalyzingVision ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Interpretando com Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Interpretar Imagem</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Error Banner */}
                {visionError && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-900/80 text-rose-300 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-bold">Aviso / Erro:</div>
                      <p className="text-[11px] text-rose-300/90 leading-relaxed">{visionError}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Vision Output Results Card */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Resultado da Interpretação Gemini:</span>
                    </span>

                    {visionResult && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{visionResult.durationMs}ms</span>
                      </span>
                    )}
                  </div>

                  {visionResult?.text && (
                    <button
                      onClick={copyVisionText}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[11px] text-slate-300 transition flex items-center gap-1.5"
                    >
                      {visionCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{visionCopied ? "Copiado!" : "Copiar"}</span>
                    </button>
                  )}
                </div>

                {visionResult && (
                  <div className="flex flex-wrap items-center gap-2 pb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
                      Modelo: <strong>{visionResult.modelUsed}</strong>
                    </span>
                    {visionResult.metadata?.mimeType && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {visionResult.metadata.mimeType} (~{visionResult.metadata.imageSizeKb}KB)
                      </span>
                    )}
                  </div>
                )}

                <div className="min-h-[200px] max-h-[460px] overflow-y-auto p-4 rounded-2xl bg-slate-950 border border-slate-800/80 font-sans text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {isAnalyzingVision ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-purple-400 animate-pulse">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      <span className="font-mono text-xs">
                        A IA do Gemini está inspecionando cada pixel, texto e padrão da imagem...
                      </span>
                    </div>
                  ) : visionResult?.text ? (
                    <div className="whitespace-pre-wrap space-y-2">
                      {visionResult.text}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-600 text-center gap-2">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <p className="italic">
                        Nenhuma interpretação gerada ainda. Escolha ou faça upload de uma imagem e clique em "Interpretar Imagem".
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: GEMINI NANO ON-DEVICE (PROMPT API) */}
      {activeTab === "nano" && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Status Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-md ${
                    status === "available"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : status === "downloadable" || status === "downloading"
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      : status === "checking"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse"
                      : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                  }`}
                >
                  {status === "available" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : status === "downloadable" ? (
                    <Download className="w-5 h-5" />
                  ) : status === "downloading" ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : status === "checking" ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">
                    Status do Modelo no Navegador
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white capitalize font-mono">
                      {status === "checking" ? "Verificando..." : status}
                    </span>
                    {rawStatus && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                        raw: {rawStatus}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={runAvailabilityCheck}
                  disabled={status === "checking" || isDownloading || isExecuting}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-50 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${status === "checking" ? "animate-spin" : ""}`} />
                  <span>Verificar Modelo</span>
                </button>

                {status === "downloadable" && (
                  <button
                    onClick={handleDownloadModel}
                    disabled={isDownloading}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-xs font-bold text-white shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloading ? "Baixando Modelo..." : "Baixar Modelo (~1.5GB)"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Download Progress Bar if active */}
            {downloadProgress && (
              <div className="space-y-1.5 p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                <div className="flex justify-between text-xs font-mono text-amber-300">
                  <span>Baixando Gemini Nano...</span>
                  <span>{downloadProgress.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${Math.max(5, downloadProgress.percent)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {downloadProgress.loaded > 0 &&
                    `${Math.round(downloadProgress.loaded / 1024 / 1024)}MB de ${Math.round(
                      downloadProgress.total / 1024 / 1024
                    )}MB transferidos`}
                </div>
              </div>
            )}

            {/* Description status message */}
            <div className="text-xs text-slate-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>{statusMessage}</span>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-900/80 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Ocorreu um problema:</div>
                  <p className="text-[11px] text-rose-300/90 font-mono">{errorMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Prompt Execution Interface */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span>Prompt para o Gemini Nano:</span>
              </label>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                Idioma de Saída: <strong>en</strong>
              </span>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                "Explain what cache-control is",
                "What is Model Context Protocol?",
                "Summarize how browser cookies work",
                "Compare client-side rendering with SSR",
              ].map((suggest) => (
                <button
                  key={suggest}
                  onClick={() => setPromptInput(suggest)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-200 transition"
                >
                  {suggest}
                </button>
              ))}
            </div>

            {/* Text Area */}
            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              rows={3}
              disabled={isExecuting}
              placeholder="Digite sua pergunta ou instrução em inglês (ex: Explain what cache-control is)..."
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-sans text-white focus:border-purple-500 outline-none transition disabled:opacity-50"
            />

            {/* Execution Button Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Execução 100% on-device (sem chaves nem backend)</span>
              </div>

              <button
                onClick={handleExecutePrompt}
                disabled={isExecuting || !promptInput.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-purple-500/25 disabled:opacity-40 transition flex items-center justify-center gap-2"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gerando Localmente...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Executar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Response Area */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase font-mono">
                  Resposta Gerada pelo Modelo Local:
                </span>
                {executionDurationMs !== null && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{executionDurationMs}ms</span>
                  </span>
                )}
              </div>

              {responseOutput && (
                <button
                  onClick={copyResponse}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[11px] text-slate-300 transition flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copiado!" : "Copiar"}</span>
                </button>
              )}
            </div>

            <div className="min-h-[140px] p-4 rounded-2xl bg-slate-950 border border-slate-800/80 font-sans text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto">
              {isExecuting ? (
                <div className="flex items-center gap-2 text-purple-400 font-mono animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processando inferência nos núcleos de IA locais...</span>
                </div>
              ) : responseOutput ? (
                <div className="whitespace-pre-wrap">{responseOutput}</div>
              ) : (
                <span className="text-slate-600 italic">
                  A resposta gerada pelo modelo Gemini Nano do navegador aparecerá aqui após clicar em "Executar".
                </span>
              )}
            </div>
          </div>

          {/* Requirements & Troubleshooting Instructions Card */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4 text-xs text-slate-400">
            <div className="font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>Requisitos e Instruções para Ativação do Gemini Nano no Chrome</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
              <div className="space-y-1.5">
                <div className="font-semibold text-blue-300">1. Flags Necessárias no Chrome:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>
                    Abra <code className="text-blue-300">chrome://flags/#prompt-api-for-gemini-nano</code> e selecione{" "}
                    <strong>Enabled</strong>.
                  </li>
                  <li>
                    Abra <code className="text-blue-300">chrome://flags/#optimization-guide-on-device-model</code> e selecione{" "}
                    <strong>Enabled BypassPerfRequirement</strong>.
                  </li>
                  <li>Reinicie completamente o navegador.</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <div className="font-semibold text-purple-300">2. Diagnóstico Interno:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>
                    Acesse <code className="text-purple-300">chrome://on-device-internals</code> para conferir o status do modelo.
                  </li>
                  <li>
                    Acesse <code className="text-purple-300">chrome://components</code> e busque por{" "}
                    <strong>Optimization Guide On Device Model</strong> clicando em "Verificar atualizações".
                  </li>
                  <li>Espaço livre em disco recomendado: no mínimo 2GB.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
