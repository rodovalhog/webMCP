"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MCPResource } from "@/components/mcp/MCPResource";
import { useAI } from "@/context/AIContext";
import {
  Settings,
  Bell,
  Cpu,
  Bot,
  Key,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function SettingsPage() {
  const {
    activeModel,
    setActiveModel,
    apiKey,
    setApiKey,
    autoPilot,
    setAutoPilot,
    testConnection,
  } = useAI();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoHighlight, setAutoHighlight] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testConnection(activeModel, apiKey);
      setTestResult(res);
    } catch {
      setTestResult({ success: false, message: "Erro ao testar a conexão com a API." });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Configurações & Conexão de IA</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Conecte sua API de IA favorita (Gemini / OpenAI) e ative o modo autônomo de execução.
            </p>
          </div>
        </div>
      </div>

      {/* AI Connection & Model Config Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-blue-500/30 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Conexão de Modelo de IA (LLM)</h2>
              <p className="text-xs text-slate-400">
                Escolha o motor que interpretará seus comandos de voz/texto e executará as ações no site.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            MCP Tool Calling
          </span>
        </div>

        {/* Model Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Selecione o Provedor de IA:</label>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <button
              onClick={() => {
                setActiveModel("mock");
                setTestResult(null);
              }}
              className={`p-4 rounded-xl border text-left transition ${
                activeModel === "mock"
                  ? "bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10 text-white"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="text-xs font-bold">Mock Heurístico</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Zero configuração, offline e sem custos de API.
              </div>
            </button>

            <button
              onClick={() => {
                setActiveModel("nano");
                setTestResult(null);
              }}
              className={`p-4 rounded-xl border text-left transition ${
                activeModel === "nano"
                  ? "bg-amber-600/20 border-amber-500 shadow-lg shadow-amber-500/10 text-white"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Gemini Nano</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                100% no navegador (Chrome On-Device AI). Sem API Key.
              </div>
            </button>

            <button
              onClick={() => {
                setActiveModel("gemini");
                setTestResult(null);
              }}
              className={`p-4 rounded-xl border text-left transition ${
                activeModel === "gemini"
                  ? "bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/10 text-white"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="text-xs font-bold text-purple-300">Google Gemini (Cloud)</div>
              <div className="text-[10px] text-slate-400 mt-1">
                gemini-1.5-flash com Tool Calling oficial via Cloud.
              </div>
            </button>

            <button
              onClick={() => {
                setActiveModel("openai");
                setTestResult(null);
              }}
              className={`p-4 rounded-xl border text-left transition ${
                activeModel === "openai"
                  ? "bg-emerald-600/20 border-emerald-500 shadow-lg shadow-emerald-500/10 text-white"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="text-xs font-bold text-emerald-300">OpenAI (Cloud)</div>
              <div className="text-[10px] text-slate-400 mt-1">
                gpt-4o-mini com chamada nativa de funções.
              </div>
            </button>
          </div>
        </div>

        {/* Gemini Nano On-Device Details */}
        {activeModel === "nano" && (
          <div className="p-6 bg-slate-950 rounded-xl border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Google Gemini Nano (On-Device Built-in AI)</h3>
                  <p className="text-xs text-slate-400">
                    O modelo de linguagem executa diretamente na memória da sua GPU/CPU através do Google Chrome.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Zero Custos • Zero Chave
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/ai-test"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-purple-500/20"
              >
                <Cpu className="w-4 h-4" />
                <span>Configurar & Baixar Modelo no Chrome (`/ai-test`)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={handleTest}
                disabled={isTesting}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-40 text-slate-200 text-xs font-semibold transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isTesting ? "Testando Chrome AI..." : "Testar Status Rápido"}</span>
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  testResult.success
                    ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
                    : "bg-amber-950/60 text-amber-300 border border-amber-500/40"
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="font-bold text-amber-300">Como habilitar o Gemini Nano no Chrome (Canary ou Chrome 131+):</div>
              <ol className="list-decimal pl-5 space-y-1 text-slate-400">
                <li>Abra uma nova aba e vá para <code className="text-amber-200 bg-slate-950 px-1 py-0.5 rounded font-mono">chrome://flags/#prompt-api-for-gemini-nano</code> e selecione <strong>Enabled</strong>.</li>
                <li>Vá para <code className="text-amber-200 bg-slate-950 px-1 py-0.5 rounded font-mono">chrome://flags/#optimization-guide-on-device-model</code> e selecione <strong>Enabled BypassPerfRequirement</strong>.</li>
                <li>Clique em <strong>Relaunch</strong> para reiniciar o Chrome.</li>
                <li>Abra <code className="text-amber-200 bg-slate-950 px-1 py-0.5 rounded font-mono">chrome://components</code> e clique em <em>Check for update</em> no componente <strong>Optimization Guide On Device Model</strong> até concluir o download.</li>
              </ol>
            </div>
          </div>
        )}

        {/* API Key Input */}
        {activeModel !== "mock" && activeModel !== "nano" && (
          <div className="space-y-2 p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>
                Chave de API ({activeModel === "gemini" ? "Gemini API Key" : "OpenAI API Key"}):
              </span>
              {activeModel === "gemini" && (
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline text-[11px]"
                >
                  Obter chave gratuita no Google AI Studio ↗
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
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                onClick={handleTest}
                disabled={isTesting || !apiKey.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold transition"
              >
                {isTesting ? "Testando..." : "Testar Conexão"}
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  testResult.success
                    ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
                    : "bg-rose-950/60 text-rose-300 border border-rose-500/40"
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <p className="text-[11px] text-slate-500">
              🔒 Sua chave de API fica armazenada estritamente no seu navegador (localStorage) e nunca é enviada a nenhum backend terceiro.
            </p>
          </div>
        )}

        {/* Auto-Pilot Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="space-y-1">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Modo Piloto Automático (Ações Autônomas no Site)</span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-xl">
              Quando ativado, a própria IA não apenas responde onde o recurso está, mas <strong>navega, abre telas e executa a ação automaticamente para você</strong>.
            </p>
          </div>
          <input
            type="checkbox"
            checked={autoPilot}
            onChange={(e) => setAutoPilot(e.target.checked)}
            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700"
          />
        </div>
      </div>

      {/* Semantic MCP General Settings */}
      <MCPResource
        id="mcp-settings-container"
        resource="settings"
        action="edit"
        description="Painel de configurações gerais e preferências do assistente MCP"
        parent="dashboard"
        className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6"
      >
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
            Preferências Visuais & Notificações
          </h3>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>Destacar Automaticamente Elementos no DOM</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Aplica anel pulsante e rolagem suave quando a IA localiza um elemento no menu ou tela.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoHighlight}
              onChange={(e) => setAutoHighlight(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Notificações por E-mail</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Receba lembretes semanais sobre cursos matriculados e novos certificados emitidos.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700"
            />
          </div>
        </div>
      </MCPResource>
    </div>
  );
}
