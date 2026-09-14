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
  HelpCircle,
  Globe,
  Compass,
  BookOpen,
  Terminal,
  Copy,
  Check,
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
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2500);
    }
  };

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

      {/* Informative Guide: How to Enable Web MCP */}
      <MCPResource
        id="mcp-how-to-enable-guide"
        resource="settings"
        action="view"
        description="Informativo e instruções detalhadas de como habilitar e usar o Web MCP em 4 modalidades"
        parent="dashboard"
        className="glass-panel p-6 sm:p-8 rounded-2xl border border-amber-500/30 space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Informativo: Como Habilitar o Web MCP</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Guia Oficial
                </span>
              </div>
              <p className="text-xs text-slate-400">
                O Web MCP conecta modelos de IA ao DOM da aplicação web. Veja como ativá-lo nas 4 modalidades suportadas:
              </p>
            </div>
          </div>
          <Link
            href="/how-it-works"
            className="hidden sm:flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Guia Didático Completo ↗</span>
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Nativo no App */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-sm text-blue-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>1. Nativo no App (Zero Setup)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                Já Ativo
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              O LearnFlow já implementa o Web MCP diretamente no código-fonte via atributos semânticos <code className="text-blue-300 font-mono">data-mcp-resource</code> e <code className="text-blue-300 font-mono">data-mcp-role</code>.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-400">
              <li>Funciona de imediato com o motor <strong>Mock Heurístico</strong> (sem chave).</li>
              <li>Ative o <strong>Modo Piloto Automático</strong> para navegação autônoma pelo agente.</li>
            </ul>
          </div>

          {/* Card 2: Extensão de Navegador Web MCP */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>2. Extensão WebMCP (Chrome/Edge)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                Compatível W3C
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Para quem usa extensões de IA no navegador que consom o protocolo oficial Web MCP:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-400">
              <li>O app expõe <code className="text-emerald-300 font-mono">window.document.modelContext</code> com 21 tools.</li>
              <li>Tags <code className="text-emerald-300 font-mono">&lt;form toolname=&quot;...&quot;&gt;</code> são descobertas automaticamente pela sua extensão.</li>
            </ul>
            <div className="pt-1">
              <Link
                href="/mcp-inspector"
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Inspecionar 21 tools no MCP Inspector ↗</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Gemini Nano */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-sm text-amber-300">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>3. Gemini Nano On-Device (Chrome Local)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                100% Local
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Execute a IA no seu próprio dispositivo, sem internet e com total privacidade:
            </p>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
                <span className="truncate mr-2 font-mono text-[11px] text-amber-300">chrome://flags/#prompt-api-for-gemini-nano</span>
                <button
                  onClick={() => handleCopy("chrome://flags/#prompt-api-for-gemini-nano")}
                  className="shrink-0 text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px]"
                >
                  {copiedText === "chrome://flags/#prompt-api-for-gemini-nano" ? (
                    <span className="text-emerald-400 font-bold">Copiado!</span>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
                <span className="truncate mr-2 font-mono text-[11px] text-amber-300">chrome://flags/#optimization-guide-on-device-model</span>
                <button
                  onClick={() => handleCopy("chrome://flags/#optimization-guide-on-device-model")}
                  className="shrink-0 text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px]"
                >
                  {copiedText === "chrome://flags/#optimization-guide-on-device-model" ? (
                    <span className="text-emerald-400 font-bold">Copiado!</span>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="pt-1">
              <Link
                href="/ai-test"
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Configurar e baixar na página /ai-test ↗</span>
              </Link>
            </div>
          </div>

          {/* Card 4: Provedores Cloud */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-sm text-purple-300">
                <Key className="w-4 h-4 text-purple-400" />
                <span>4. Modelos Cloud (Gemini / OpenAI)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-semibold">
                Alta Capacidade
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Conecte modelos em nuvem para respostas ultra sofisticadas e raciocínio avançado:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-400">
              <li>Insira sua API Key no card de modelos acima.</li>
              <li>Obtenha sua chave gratuita no <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 underline">Google AI Studio ↗</a>.</li>
              <li>Sua chave é armazenada com segurança no seu navegador via <code className="text-purple-300 font-mono">localStorage</code>.</li>
            </ul>
          </div>
        </div>
      </MCPResource>

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
