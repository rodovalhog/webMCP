"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  Network,
  Eye,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Bot,
  Play,
  CheckCircle2,
  Lock,
  Clock,
  ArrowUpRight,
  FileCode,
  Scan,
  Compass,
  Cpu,
  Fingerprint,
  Zap,
  Activity,
  Sliders,
  Terminal,
  Award,
  ExternalLink,
} from "lucide-react";
import { MCPResource } from "@/components/mcp/MCPResource";
import { useAI } from "@/context/AIContext";

type TrackModule = "mcp-architecture" | "vision-multimodal" | "governance-rbac";
type TrackSection =
  | "scanner-lab"
  | "orchestrator"
  | "visual-pulse"
  | "document-pipeline"
  | "prompt-studio"
  | "student-extractor"
  | "guardrails-matrix"
  | "telemetry-logs"
  | "certificate-issuer";

function TracksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setIsOpen, sendMessage } = useAI();

  const moduleParam = (searchParams.get("module") as TrackModule) || "mcp-architecture";
  const sectionParam = searchParams.get("section") as TrackSection | null;

  const [activeModule, setActiveModule] = useState<TrackModule>(moduleParam);
  const [activeSection, setActiveSection] = useState<TrackSection | null>(sectionParam);
  const [pulseActive, setPulseActive] = useState<boolean>(false);
  const [simulatedRole, setSimulatedRole] = useState<"student" | "teacher" | "admin">("student");
  const [generatedHash, setGeneratedHash] = useState<string | null>(null);

  // Sync module state from URL
  useEffect(() => {
    if (moduleParam) {
      setActiveModule(moduleParam);
    }
    if (sectionParam) {
      setActiveSection(sectionParam);
      // Trigger temporary visual pulse
      setPulseActive(true);
      const timer = setTimeout(() => setPulseActive(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [moduleParam, sectionParam]);

  const switchModule = (mod: TrackModule) => {
    setActiveModule(mod);
    setActiveSection(null);
    router.push(`/dashboard/tracks?module=${mod}`);
  };

  // Helper to ask the AI Agent to guide and navigate to each level
  const askAgentToNavigate = (prompt: string) => {
    setIsOpen(true);
    sendMessage(prompt);
  };

  const generateCertificateHash = () => {
    const randomHex = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    setGeneratedHash(`0x${randomHex}`);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* NÍVEL 1: MACRO FUNCIONALIDADE (TRILHA PRINCIPAL)                          */}
      {/* ========================================================================= */}
      <MCPResource
        resource="academy_tracks"
        action="navigate"
        title="Trilhas de Especialização"
        description="Central de Trilhas de Especialização em Engenharia de Software e IA - Funcionalidade Nível 1"
        target="/dashboard/tracks"
        access="student"
        className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-950 to-indigo-950/30 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Level 1 Breadcrumbs & Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-slate-500">Dashboard</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-blue-400 font-bold">Trilhas de Especialização</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold font-mono">
              NÍVEL 1 (MACRO)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                askAgentToNavigate(
                  "Me leva para a Trilha de Especialização e explique como funciona a estrutura em 3 níveis."
                )
              }
              className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <Bot className="w-3.5 h-3.5 text-blue-400" />
              <span>Pedir Ajuda ao Agente para Nível 1</span>
            </button>
          </div>
        </div>

        {/* Level 1 Main Content */}
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold font-mono">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Formação Avançada em IA &amp; Web MCP</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Trilha de Especialização: Engenharia de Agentes Autônomos
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
              Estrutura hierárquica completa em <strong>3 níveis</strong> navegáveis pelo agente inteligente.
              O assistente é capaz de compreender linguagem natural e transportar você para cada módulo ou laboratório específico.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>3 Módulos Técnicos (Nível 2)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>9 Sub-Ações &amp; Labs (Nível 3)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Governança RBAC Ativa</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 font-bold uppercase">Progresso Geral</span>
              <span className="text-emerald-400 font-bold">78% Concluído</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 w-[78%]" />
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between font-mono">
              <span>7 de 9 Labs Validados</span>
              <span>Carga: 120h</span>
            </div>
          </div>
        </div>
      </MCPResource>

      {/* ========================================================================= */}
      {/* NÍVEL 2: SUBFUNCIONALIDADES (MÓDULOS DA TRILHA)                            */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
              Escolha um Módulo da Trilha:
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold font-mono">
              NÍVEL 2 (SUBFUNCIONALIDADE)
            </span>
          </div>

          <span className="text-xs text-slate-500 hidden sm:inline">
            Clique para inspecionar ou peça ao agente
          </span>
        </div>

        {/* 3 Module Cards / Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Module 1: Web MCP */}
          <MCPResource
            resource="track_mcp_architecture"
            parent="academy_tracks"
            action="open"
            title="Módulo 1: Web MCP"
            description="Módulo 1: Arquitetura Frontend & Protocolo Web MCP no Navegador - Nível 2"
            target="/dashboard/tracks?module=mcp-architecture"
            access="student"
            onClick={() => switchModule("mcp-architecture")}
            className={`cursor-pointer p-5 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-4 ${
              activeModule === "mcp-architecture"
                ? "bg-gradient-to-b from-blue-950/50 to-slate-900 border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40"
                : "bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    activeModule === "mcp-architecture"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <Network className="w-5 h-5" />
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  MÓDULO 1
                </span>
              </div>

              <h2 className="text-sm font-bold text-white">
                Arquitetura Frontend &amp; Web MCP
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scanner semântico no DOM, registro de tools para o agente e execução de navegação autônoma.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500">3 Sub-Ações</span>
              <span className="text-blue-400 font-semibold flex items-center gap-1">
                <span>{activeModule === "mcp-architecture" ? "Ativo" : "Explorar"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </MCPResource>

          {/* Module 2: Vision Multimodal */}
          <MCPResource
            resource="track_vision_multimodal"
            parent="academy_tracks"
            action="open"
            title="Módulo 2: Visão Multimodal"
            description="Módulo 2: Visão Computacional & IA Multimodal com Gemini - Nível 2"
            target="/dashboard/tracks?module=vision-multimodal"
            access="student"
            onClick={() => switchModule("vision-multimodal")}
            className={`cursor-pointer p-5 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-4 ${
              activeModule === "vision-multimodal"
                ? "bg-gradient-to-b from-purple-950/50 to-slate-900 border-purple-500/60 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/40"
                : "bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    activeModule === "vision-multimodal"
                      ? "bg-purple-600 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <Eye className="w-5 h-5" />
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  MÓDULO 2
                </span>
              </div>

              <h2 className="text-sm font-bold text-white">
                Visão Computacional &amp; Multimodal
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingestão de imagens em Base64, engenharia de prompt para OCR e extração estruturada de documentos.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500">3 Sub-Ações</span>
              <span className="text-purple-400 font-semibold flex items-center gap-1">
                <span>{activeModule === "vision-multimodal" ? "Ativo" : "Explorar"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </MCPResource>

          {/* Module 3: Governance & RBAC */}
          <MCPResource
            resource="track_governance_rbac"
            parent="academy_tracks"
            action="open"
            title="Módulo 3: Governança RBAC"
            description="Módulo 3: Governança de Agentes, RBAC & Telemetria em Tempo Real - Nível 2"
            target="/dashboard/tracks?module=governance-rbac"
            access="student"
            onClick={() => switchModule("governance-rbac")}
            className={`cursor-pointer p-5 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-4 ${
              activeModule === "governance-rbac"
                ? "bg-gradient-to-b from-emerald-950/50 to-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40"
                : "bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    activeModule === "governance-rbac"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  MÓDULO 3
                </span>
              </div>

              <h2 className="text-sm font-bold text-white">
                Governança, RBAC &amp; Telemetria
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Guardrails de segurança que restringem ações do agente, auditoria de decisões e emissão de certificados.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500">3 Sub-Ações</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span>{activeModule === "governance-rbac" ? "Ativo" : "Explorar"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </MCPResource>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NÍVEL 3: SUB-SUBFUNCIONALIDADES (AÇÕES ESPECÍFICAS DE CADA MÓDULO)         */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase font-bold text-white tracking-wider">
              Ações &amp; Laboratórios Práticos do Módulo:
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
              NÍVEL 3 (SUB-SUBFUNCIONALIDADE)
            </span>
          </div>

          <button
            onClick={() =>
              askAgentToNavigate(
                activeModule === "mcp-architecture"
                  ? "Quero ir para o módulo de Web MCP"
                  : activeModule === "vision-multimodal"
                  ? "Me leva para o módulo de Visão Multimodal"
                  : "Abre o módulo de Governança e RBAC"
              )
            }
            className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Pedir Ajuda ao Agente para Nível 2</span>
          </button>
        </div>

        {/* MODULE 1 CONTENT: 3 LEVEL-3 ITEMS */}
        {activeModule === "mcp-architecture" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 3.1.1: Scanner Semântico */}
            <MCPResource
              resource="track_mcp_scanner_lab"
              parent="track_mcp_architecture"
              action="execute"
              title="Scanner Semântico DOM"
              description="Laboratório de Scanner Semântico: inspecione e valide tags data-mcp no DOM - Nível 3"
              target="/dashboard/tracks?module=mcp-architecture&section=scanner-lab"
              access="student"
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                activeSection === "scanner-lab" || pulseActive
                  ? "bg-slate-900 border-blue-500 ring-2 ring-blue-500/50 shadow-xl shadow-blue-500/10"
                  : "glass-panel border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <Scan className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    NÍVEL 3.1
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  Scanner Semântico do DOM
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Varre o DOM client-side identificando tags <code className="text-blue-300 font-mono">data-mcp-*</code> e gerando o catálogo semântico sem expor dados privados.
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                  <div className="text-emerald-400">✓ 18 Recursos no Catálogo</div>
                  <div className="text-slate-500">• Higienização PII: 100%</div>
                </div>
              </div>

              <button
                onClick={() =>
                  askAgentToNavigate(
                    "Me leva para o laboratório de scanner semântico do DOM"
                  )
                }
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-blue-400" />
                <span>Pedir ao Agente para me levar aqui</span>
              </button>
            </MCPResource>

            {/* 3.1.2: Orquestrador & Tool Calling */}
            <MCPResource
              resource="track_mcp_orchestrator"
              parent="track_mcp_architecture"
              action="execute"
              title="Orquestrador de Ferramentas"
              description="Simulador de Orquestração: teste a conversão de linguagem natural em chamadas de ferramentas - Nível 3"
              target="/dashboard/tracks?module=mcp-architecture&section=orchestrator"
              access="student"
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                activeSection === "orchestrator"
                  ? "bg-slate-900 border-blue-500 ring-2 ring-blue-500/50 shadow-xl shadow-blue-500/10"
                  : "glass-panel border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    NÍVEL 3.2
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  Orquestrador &amp; Tool Calling
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Converte o prompt do usuário em payloads JSON estruturados compatíveis com MCP Server e function calling do Gemini.
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                  <div className="text-purple-400">navigate_to_resource()</div>
                  <div className="text-slate-500">• Formato: JSON-RPC 2.0</div>
                </div>
              </div>

              <button
                onClick={() =>
                  askAgentToNavigate(
                    "Acessa o orquestrador de ferramentas e tool calling"
                  )
                }
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>Pedir ao Agente para me levar aqui</span>
              </button>
            </MCPResource>

            {/* 3.1.3: Simulador de Pulso Visual */}
            <MCPResource
              resource="track_mcp_visual_pulse"
              parent="track_mcp_architecture"
              action="execute"
              title="Simulador de Pulso Visual"
              description="Simulador de Pulso Visual: teste o feedback visual e a navegação autônoma em tempo real - Nível 3"
              target="/dashboard/tracks?module=mcp-architecture&section=visual-pulse"
              access="student"
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                activeSection === "visual-pulse" || pulseActive
                  ? "bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/50 shadow-xl shadow-emerald-500/10"
                  : "glass-panel border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    NÍVEL 3.3
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  Pulso Visual &amp; Foco Autônomo
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aplica foco visual brilhante e scroll suave para guiar a atenção do usuário no elemento acionado pela IA.
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                  <div className="text-emerald-400">highlightMCPResource()</div>
                  <div className="text-slate-500">• Latência visual: &lt; 50ms</div>
                </div>
              </div>

              <button
                onClick={() =>
                  askAgentToNavigate(
                    "Abre o simulador de pulso visual do MCP e destaque a tela"
                  )
                }
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pedir ao Agente para me levar aqui</span>
              </button>
            </MCPResource>
          </div>
        )}

        {/* MODULE 2 CONTENT: 3 LEVEL-3 ITEMS */}
        {activeModule === "vision-multimodal" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 3.2.1: Pipeline de Documentos */}
            <MCPResource
              resource="track_vision_pipeline"
              parent="track_vision_multimodal"
              action="execute"
              title="Pipeline de Ingestão"
              description="Pipeline de Ingestão de Documentos: fluxo de upload e codificação Base64 inline_data - Nível 3"
              target="/dashboard/tracks?module=vision-multimodal&section=document-pipeline"
              access="student"
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                activeSection === "document-pipeline"
                  ? "bg-slate-900 border-purple-500 ring-2 ring-purple-500/50 shadow-xl shadow-purple-500/10"
                  : "glass-panel border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    NÍVEL 3.1
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  Pipeline de Ingestão Base64
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Lê arquivos locais de imagem, valida limites de tamanho e prepara a estrutura <code className="text-purple-300 font-mono">inline_data</code>.
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                  <div className="text-purple-400">Formatos: PNG, JPG, SVG</div>
                  <div className="text-slate-500">• Limite: 10MB</div>
                </div>
              </div>

              <button
                onClick={() =>
                  askAgentToNavigate(
                    "Me leva para o pipeline de documentos de visão"
                  )
                }
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>Pedir ao Agente para me levar aqui</span>
              </button>
            </MCPResource>

            {/* 3.2.2: Prompt Studio para OCR */}
            <MCPResource
              resource="track_vision_prompt_studio"
              parent="track_vision_multimodal"
              action="execute"
              title="Prompt Studio para OCR"
              description="Prompt Studio para OCR: engenharia de prompts para extração de campos estruturados - Nível 3"
              target="/dashboard/tracks?module=vision-multimodal&section=prompt-studio"
              access="student"
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                activeSection === "prompt-studio"
                  ? "bg-slate-900 border-purple-500 ring-2 ring-purple-500/50 shadow-xl shadow-purple-500/10"
                  : "glass-panel border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    NÍVEL 3.2
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  Prompt Studio para OCR
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Calibração de instruções semânticas para forçar saídas estruturadas em JSON com precisão de 99.2%.
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                  <div className="text-blue-400">Temperature: 0.1</div>
                  <div className="text-slate-500">• Saída: JSON Tipado</div>
                </div>
              </div>

              <button
                onClick={() =>
                  askAgentToNavigate(
                    "Abre o prompt studio para OCR estruturado"
                  )
                }
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-blue-400" />
                <span>Pedir ao Agente para me levar aqui</span>
              </button>
            </MCPResource>

            {/* 3.2.3: Extrator Automático de Aluno */}
            <MCPResource
              resource="track_vision_student_extractor"
              parent="track_vision_multimodal"
              action="execute"
              title="Extrator Automático de Aluno"
              description="Extrator Automático de Aluno: extração óptica de dados de CNH e RG para cadastro - Nível 3"
              target="/dashboard/tracks?module=vision-multimodal&section=student-extractor"
              access="student"
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                activeSection === "student-extractor"
                  ? "bg-slate-900 border-purple-500 ring-2 ring-purple-500/50 shadow-xl shadow-purple-500/10"
                  : "glass-panel border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    NÍVEL 3.3
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  Extrator de Aluno via IA
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Lê o documento CNH/RG do aluno e aciona o preenchimento semântico autônomo do formulário cadastral.
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                  <div className="text-emerald-400">Extração: Nome, CPF, Data</div>
                  <div className="text-slate-500">• Confiança: 98.5%</div>
                </div>
              </div>

              <button
                onClick={() =>
                  askAgentToNavigate(
                    "Me leva para o extrator automático de aluno com IA"
                  )
                }
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pedir ao Agente para me levar aqui</span>
              </button>
            </MCPResource>
          </div>
        )}

        {/* MODULE 3 CONTENT: 3 LEVEL-3 ITEMS */}
        {activeModule === "governance-rbac" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 3.3.1: Matriz de Guardrails */}
            <MCPResource
              resource="track_rbac_guardrails"
              parent="track_governance_rbac"
              action="view"
              title="Matriz de Guardrails"
              description="Matriz de Guardrails: regras de permissão e bloqueio de ações não autorizadas - Nível 3"
              target="/dashboard/tracks?module=governance-rbac&section=guardrails-matrix"
              access="student"
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                activeSection === "guardrails-matrix"
                  ? "bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/50 shadow-xl shadow-emerald-500/10"
                  : "glass-panel border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    NÍVEL 3.1
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  Matriz de Guardrails &amp; RBAC
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Define quais ferramentas cada perfil de usuário tem permissão para invocar no protocolo Web MCP.
                </p>

                {/* Interactive role switcher simulator */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Simular Perfil:</span>
                    <select
                      value={simulatedRole}
                      onChange={(e) =>
                        setSimulatedRole(e.target.value as "student" | "teacher" | "admin")
                      }
                      className="bg-slate-900 border border-slate-800 text-xs text-white rounded px-2 py-0.5"
                    >
                      <option value="student">Aluno</option>
                      <option value="teacher">Professor</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  <div className="text-[11px] font-mono">
                    {simulatedRole === "student" ? (
                      <span className="text-amber-400">Bloqueio: create_course, admin_panel</span>
                    ) : simulatedRole === "teacher" ? (
                      <span className="text-blue-400">Permitido: create_course</span>
                    ) : (
                      <span className="text-emerald-400">Permissão Total de Administrador</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  askAgentToNavigate("Abre a matriz de guardrails e políticas RBAC")
                }
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pedir ao Agente para me levar aqui</span>
              </button>
            </MCPResource>

            {/* 3.3.2: Telemetria & Logs */}
            <MCPResource
              resource="track_rbac_telemetry"
              parent="track_governance_rbac"
              action="view"
              title="Telemetria & Logs MCP"
              description="Inspetor de Telemetria e Logs MCP: monitoramento de latência e auditoria de decisões do agente - Nível 3"
              target="/dashboard/tracks?module=governance-rbac&section=telemetry-logs"
              access="student"
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                activeSection === "telemetry-logs"
                  ? "bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/50 shadow-xl shadow-emerald-500/10"
                  : "glass-panel border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    NÍVEL 3.2
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  Telemetria &amp; Logs MCP
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Registra todas as requisições semânticas, tempo de resposta e decisões de roteamento para auditoria em tempo real.
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                  <div className="text-blue-400">Eventos Gravados: 14.820</div>
                  <div className="text-slate-500">• Latência média: 310ms</div>
                </div>
              </div>

              <button
                onClick={() =>
                  askAgentToNavigate("Acessa a telemetria e logs do protocolo MCP")
                }
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-blue-400" />
                <span>Pedir ao Agente para me levar aqui</span>
              </button>
            </MCPResource>

            {/* 3.3.3: Emissor de Certificado */}
            <MCPResource
              resource="track_rbac_certificate_issuer"
              parent="track_governance_rbac"
              action="execute"
              title="Emissor de Certificado"
              description="Emissor de Certificados Digitais: emissão criptográfica autenticada com hash SHA-256 - Nível 3"
              target="/dashboard/tracks?module=governance-rbac&section=certificate-issuer"
              access="student"
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                activeSection === "certificate-issuer"
                  ? "bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/50 shadow-xl shadow-emerald-500/10"
                  : "glass-panel border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    NÍVEL 3.3
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  Emissor de Certificado SHA-256
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gera o hash de conclusão da trilha de 3 níveis, garantindo autenticidade e validação criptográfica.
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Assinatura Digital:</span>
                    <button
                      onClick={generateCertificateHash}
                      className="text-[10px] text-purple-400 hover:text-purple-300 underline"
                    >
                      Gerar Hash
                    </button>
                  </div>
                  <div className="text-purple-300 truncate">
                    {generatedHash || "Clique em 'Gerar Hash' para testar"}
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  askAgentToNavigate(
                    "Me leva para o emissor de certificado criptográfico da trilha"
                  )
                }
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>Pedir ao Agente para me levar aqui</span>
              </button>
            </MCPResource>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TracksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center text-slate-400 font-mono text-xs">
          Carregando Central de Trilhas em 3 Níveis...
        </div>
      }
    >
      <TracksContent />
    </Suspense>
  );
}
