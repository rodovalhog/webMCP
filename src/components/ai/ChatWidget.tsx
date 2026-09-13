"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAI } from "@/context/AIContext";
import { useAuth } from "@/context/AuthContext";
import { DocumentUploadCard } from "./DocumentUploadCard";
import {
  Sparkles,
  X,
  Send,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Terminal,
  Trash2,
  Cpu,
  Bot,
  CheckCircle2,
  AlertCircle,
  Key,
  Compass,
} from "lucide-react";

export const ChatWidget: React.FC = () => {
  const {
    isOpen,
    setIsOpen,
    toggleChat,
    messages,
    isLoading,
    sendMessage,
    executeNavigation,
    highlightResource,
    clearHistory,
    activeModel,
    setActiveModel,
    apiKey,
    setApiKey,
    providerName,
    autoPilot,
    setAutoPilot,
    actionNotification,
    testConnection,
  } = useAI();

  const { role } = useAuth();
  const [input, setInput] = useState("");
  const [showToolDetails, setShowToolDetails] = useState(false);
  const [showModelConfig, setShowModelConfig] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Quero cadastrar um novo aluno",
    "Me leva para meus certificados",
    "Abre o curso de React Avançado",
    "Quero continuar de onde parei",
    "Onde vejo meu progresso?",
    "Quero criar um curso",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const handleTestKey = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testConnection(activeModel, apiKey);
      setTestResult(res);
    } catch {
      setTestResult({ success: false, message: "Erro de comunicação ao testar API" });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <>
      {/* Floating Action Banner when Agent is autonomously navigating */}
      {actionNotification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-2xl flex items-center gap-3 border border-white/20 animate-bounce">
          <Bot className="w-5 h-5 text-amber-300 animate-spin" />
          <span>{actionNotification}</span>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        id="btn-mcp-chat-trigger"
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-200 border border-white/15"
        aria-label="Abrir assistente semântico LearnFlow AI"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <div className="text-left">
          <div className="font-bold text-xs tracking-wide">AI Navigator</div>
          <div className="text-[10px] text-blue-200 flex items-center gap-1 font-mono">
            <span>{autoPilot ? "🤖 Auto-Pilot ON" : "Manual"}</span>
          </div>
        </div>
      </button>

      {/* Floating Chat Drawer / Panel */}
      {isOpen && (
        <div
          id="mcp-chat-panel"
          className="fixed bottom-24 right-4 sm:right-6 w-[94vw] sm:w-[480px] h-[660px] max-h-[84vh] z-50 glass-panel-glow rounded-2xl flex flex-col overflow-hidden border border-slate-700/80 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-200"
        >
          {/* Header */}
          <div className="p-3.5 border-b border-slate-700/60 bg-slate-900/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-100">LearnFlow AI Agent</h3>
                  <button
                    onClick={() => setShowModelConfig(!showModelConfig)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 flex items-center gap-1 transition"
                    title="Conectar API de IA e Configurar Auto-Pilot"
                  >
                    <span>
                      {activeModel === "mock"
                        ? "Mock Heurístico"
                        : activeModel === "nano"
                        ? "Gemini Nano (Local)"
                        : activeModel === "gemini"
                        ? "Google Gemini"
                        : "OpenAI"}
                    </span>
                    <span>⚙</span>
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="font-semibold text-blue-400 capitalize">{role}</span>
                  </span>
                  <span>•</span>
                  <span className={autoPilot ? "text-emerald-400 font-semibold" : "text-slate-400"}>
                    {autoPilot ? "🤖 Modo Autônomo Ativo" : "Modo Manual"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowToolDetails(!showToolDetails)}
                className={`p-1.5 rounded-lg text-xs transition ${
                  showToolDetails ? "bg-purple-500/20 text-purple-300" : "text-slate-400 hover:bg-slate-800"
                }`}
                title="Visualizar chamadas MCP"
              >
                <Terminal className="w-4 h-4" />
              </button>
              <button
                onClick={clearHistory}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                title="Limpar histórico"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                title="Fechar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Connection & Auto-Pilot Configuration Drawer */}
          {showModelConfig && (
            <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-3 text-xs animate-in fade-in">
              <div className="flex items-center justify-between text-slate-200 font-bold">
                <span className="flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Configurar Motor de IA</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">MCP Tool Calling</span>
              </div>

              {/* Provider Selection */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  onClick={() => {
                    setActiveModel("mock");
                    setTestResult(null);
                  }}
                  className={`py-2 px-1.5 rounded-xl font-medium border text-center transition ${
                    activeModel === "mock"
                      ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750"
                  }`}
                >
                  <div className="text-[11px] font-bold">Mock</div>
                  <div className="text-[9px] text-slate-300 opacity-80">Zero Config</div>
                </button>
                <button
                  onClick={() => {
                    setActiveModel("nano");
                    setTestResult(null);
                  }}
                  className={`py-2 px-1.5 rounded-xl font-medium border text-center transition ${
                    activeModel === "nano"
                      ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750"
                  }`}
                >
                  <div className="text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1">
                    <span>⚡ Gemini Nano</span>
                  </div>
                  <div className="text-[9px] text-amber-200 opacity-90">Chrome Local</div>
                </button>
                <button
                  onClick={() => {
                    setActiveModel("gemini");
                    setTestResult(null);
                  }}
                  className={`py-2 px-1.5 rounded-xl font-medium border text-center transition ${
                    activeModel === "gemini"
                      ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750"
                  }`}
                >
                  <div className="text-[11px] font-bold">Gemini Cloud</div>
                  <div className="text-[9px] text-slate-300 opacity-80">1.5 Flash API</div>
                </button>
                <button
                  onClick={() => {
                    setActiveModel("openai");
                    setTestResult(null);
                  }}
                  className={`py-2 px-1.5 rounded-xl font-medium border text-center transition ${
                    activeModel === "openai"
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750"
                  }`}
                >
                  <div className="text-[11px] font-bold">OpenAI</div>
                  <div className="text-[9px] text-slate-300 opacity-80">GPT-4o Mini</div>
                </button>
              </div>

              {/* Gemini Nano Dedicated Local Box */}
              {activeModel === "nano" && (
                <div className="p-3.5 bg-slate-950 rounded-xl border border-purple-500/40 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-purple-300">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      <span>Gemini Nano On-Device (Chrome Built-in AI)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-mono">
                      Zero Chave de API
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Executa o modelo da Google <strong>100% dentro do seu navegador Chrome</strong>, com privacidade absoluta, zero latência de rede e sem consumir créditos.
                  </p>

                  {/* Primary Link: Open dedicated /ai-test configuration & download page */}
                  <Link
                    href="/ai-test"
                    onClick={() => {
                      setIsOpen(false);
                      setShowModelConfig(false);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition hover:scale-[1.01]"
                  >
                    <Cpu className="w-4 h-4 text-purple-200" />
                    <span>Configurar & Baixar Modelo no Chrome (`/ai-test`)</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                  </Link>

                  <div className="flex items-center justify-between pt-0.5">
                    <button
                      onClick={handleTestKey}
                      disabled={isTesting}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 disabled:opacity-40 text-slate-300 rounded-lg text-[11px] font-semibold transition flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isTesting ? "Verificando..." : "Testar Status Rápido"}</span>
                    </button>
                  </div>

                  {testResult && (
                    <div
                      className={`p-2 rounded-lg text-[11px] flex items-center gap-1.5 ${
                        testResult.success
                          ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
                          : "bg-amber-950/60 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {testResult.success ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      <span>{testResult.message}</span>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <div className="font-semibold text-slate-300">Como ativar no Chrome / Canary:</div>
                    <ol className="list-decimal pl-4 space-y-0.5 font-mono text-[9px] text-slate-400">
                      <li>Acesse <code className="text-amber-300">chrome://flags/#prompt-api-for-gemini-nano</code> e defina como <strong>Enabled</strong>.</li>
                      <li>Acesse <code className="text-amber-300">chrome://flags/#optimization-guide-on-device-model</code> e defina como <strong>Enabled BypassPerfRequirement</strong>.</li>
                      <li>Abra a página <Link href="/ai-test" onClick={() => setIsOpen(false)} className="text-purple-400 underline font-bold">/ai-test</Link> para baixar o modelo.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* API Key Input for Cloud Models */}
              {activeModel !== "mock" && activeModel !== "nano" && (
                <div className="space-y-2 pt-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                    <span>
                      Chave da API ({activeModel === "gemini" ? "Google Gemini API Key" : "OpenAI API Key"}):
                    </span>
                    {activeModel === "gemini" && (
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1"
                      >
                        Obter chave gratuita ↗
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        setTestResult(null);
                      }}
                      placeholder={activeModel === "gemini" ? "AIzaSy..." : "sk-..."}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <button
                      onClick={handleTestKey}
                      disabled={isTesting || !apiKey.trim()}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition"
                    >
                      {isTesting ? "Testando..." : "Testar"}
                    </button>
                  </div>

                  {testResult && (
                    <div
                      className={`p-2 rounded-lg text-[11px] flex items-center gap-1.5 ${
                        testResult.success
                          ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
                          : "bg-rose-950/60 text-rose-300 border border-rose-500/40"
                      }`}
                    >
                      {testResult.success ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span>{testResult.message}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Auto-Pilot Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    <span>Modo Piloto Automático (Ações Autônomas)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    A própria IA navega e executa as ações no site automaticamente para você.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPilot}
                    onChange={(e) => setAutoPilot(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* Active Gemini Nano Banner with direct link to /ai-test */}
          {activeModel === "nano" && (
            <div className="px-3.5 py-1.5 bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border-b border-purple-500/30 flex items-center justify-between text-[11px] text-purple-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Cpu className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Modo Gemini Nano Local Ativo</span>
              </span>
              <Link
                href="/ai-test"
                onClick={() => setIsOpen(false)}
                className="px-2 py-0.5 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 font-bold transition flex items-center gap-1 shrink-0 text-[10px]"
              >
                <span>Configurar no /ai-test</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>
            </div>
          )}

          {/* Quick Prompts Carousel/Bar */}
          <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800/80 overflow-x-auto flex items-center gap-1.5 scrollbar-none text-xs">
            <span className="text-slate-500 text-[11px] font-medium shrink-0 flex items-center gap-1">
              Sugestões:
            </span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition text-[11px]"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>

                  {/* Navigation Card */}
                  {msg.navigationCard && (
                    <div className="mt-3.5 pt-3 border-t border-slate-700/70">
                      <div className="text-[11px] font-semibold uppercase tracking-wider mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {msg.navigationCard.isAuthorized ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Recurso Identificado</span>
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                              <span className="text-rose-400">Autorização Negada</span>
                            </>
                          )}
                        </div>

                        {autoPilot && msg.navigationCard.isAuthorized && (
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                            <span>🤖 Auto-Navegado</span>
                          </span>
                        )}
                      </div>

                      {/* Breadcrumbs path */}
                      <div className="flex flex-wrap items-center gap-1 my-2 text-xs font-medium text-slate-300 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                        {msg.navigationCard.breadcrumbs.map((crumb, i, arr) => (
                          <React.Fragment key={i}>
                            <span className={i === arr.length - 1 ? "text-blue-400 font-bold" : ""}>
                              {crumb}
                            </span>
                            {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-slate-500" />}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Denial Reason or Action Buttons */}
                      {!msg.navigationCard.isAuthorized ? (
                        <div className="mt-2 text-xs text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-900/60">
                          {msg.navigationCard.denialReason}
                        </div>
                      ) : (
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() =>
                              executeNavigation(
                                msg.navigationCard!.targetRoute,
                                msg.navigationCard!.resourceId
                              )
                            }
                            className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
                          >
                            <span>{msg.navigationCard.actionLabel}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => highlightResource(msg.navigationCard!.resourceId)}
                            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600/60 text-xs flex items-center gap-1 transition"
                            title="Destacar no DOM da tela"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Destacar</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Document Upload & OCR Vision Card */}
                  {msg.documentUploadCard?.enabled && (
                    <DocumentUploadCard
                      targetFormRoute={msg.documentUploadCard.targetFormRoute}
                      onAutoFillCompleted={() => {
                        // Navigation is handled in handleFillForm
                      }}
                    />
                  )}

                  {/* Optional Tool Calls inspector for transparency */}
                  {showToolDetails && msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/60 text-[10px] font-mono text-slate-400">
                      <div className="text-purple-400 font-semibold mb-1 flex items-center gap-1">
                        <Terminal className="w-3 h-3" />
                        <span>MCP Tool Calls:</span>
                      </div>
                      {msg.toolCalls.map((t, idx) => (
                        <div key={idx} className="bg-slate-900 p-2 rounded border border-slate-800 my-1 overflow-x-auto">
                          <div className="text-amber-300 font-bold">{t.name}()</div>
                          <pre className="text-slate-400 text-[9px] mt-0.5">{JSON.stringify(t.input)}</pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-slate-800/60 text-slate-400 rounded-2xl w-fit text-xs border border-slate-700/40">
                <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
                <span>O agente está analisando e acionando ferramentas MCP...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              id="mcp-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                autoPilot
                  ? "Ex: Me leva para meus certificados / Abre a aula de React..."
                  : "Pergunte onde fica qualquer recurso..."
              }
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              id="btn-mcp-chat-send"
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-md transition"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
