"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code2,
  ChevronRight,
  Sparkles,
  Bot,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileCode2,
  Zap,
  Award,
  Compass,
} from "lucide-react";
import { MCPResource } from "@/components/mcp/MCPResource";
import { useAI } from "@/context/AIContext";

export default function ReactRequirementsPage() {
  const { setIsOpen, sendMessage } = useAI();
  const [pulseActive, setPulseActive] = useState(false);

  const handleAskAgent = (prompt: string) => {
    setPulseActive(true);
    setIsOpen(true);
    sendMessage(prompt);
  };

  const requirements = [
    {
      id: "req-react-1",
      title: "Hooks Customizados & Arquitetura Reativa",
      description: "Implementação de hooks reutilizáveis com gerenciamento de estado local, memoização com useMemo/useCallback e tipagem estrita via Zod.",
      status: "completed",
      grade: "10.0",
      validator: "Prof. Diego Santos",
    },
    {
      id: "req-react-2",
      title: "Scanner Semântico do DOM & Protocolo Web MCP",
      description: "Instrumentação de tags data-mcp-resource, data-mcp-action e data-mcp-access em componentes React para descoberta autônoma por agentes de IA.",
      status: "completed",
      grade: "9.8",
      validator: "Validador Web MCP",
    },
    {
      id: "req-react-3",
      title: "Testes Unitários de Componentes (Jest / RTL)",
      description: "Cobertura de código superior a 80% em formulários com guardrails, validações condicionais e renderização assíncrona.",
      status: "completed",
      grade: "8.5",
      validator: "Pipeline CI/CD",
    },
    {
      id: "req-react-4",
      title: "Projeto Prático: Dashboard Multi-nível Reativo",
      description: "Construção de interface imersiva com navegação em árvore, suporte a temas dark-mode e pulso visual guiado por IA.",
      status: "in_review",
      grade: "Pendente",
      validator: "Banca Avaliadora",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* NÍVEL 3: SUBPÁGINA DO CURSO DE REACT (DENTRO DE CURSOS > REQUERIMENTOS)   */}
      {/* ========================================================================= */}
      <MCPResource
        resource="requirements_react"
        action="view"
        title="Requerimentos: React Avançado"
        description="Subpágina de Nível 3 contendo as exigências de conclusão do Curso de React Avançado"
        target="/dashboard/requirements/courses/react"
        access="student"
        className={`glass-panel p-6 sm:p-8 rounded-3xl border relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-cyan-950/20 to-slate-950 shadow-2xl transition-all duration-500 ${
          pulseActive ? "ring-4 ring-cyan-500/80 border-cyan-400" : "border-slate-800"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 4-Step Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-400">Dashboard</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/dashboard/requirements" className="text-blue-400 hover:underline">Requerimentos</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/dashboard/requirements/courses" className="text-purple-400 hover:underline">Cursos</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-cyan-400 font-bold">React</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold font-mono">
              NÍVEL 3: SUBPÁGINA ESPECÍFICA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/requirements/courses"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Subpágina Cursos (Nível 2)</span>
            </Link>
          </div>
        </div>

        {/* Header Content */}
        <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-mono">
              <Code2 className="w-4 h-4" />
              <span>resource: requirements_react (parent: requirements_courses)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              Requerimentos: React Avançado
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm sm:text-base leading-relaxed">
              Você está na subpágina de <strong className="text-cyan-400">Nível 3</strong>. O agente Web MCP compreende que esta rota 
              pertence à subpágina <strong className="text-purple-300">Cursos</strong>, que por sua vez está abrigada no menu principal <strong className="text-blue-400">Requerimentos</strong>.
            </p>
          </div>

          <button
            onClick={() =>
              handleAskAgent(
                "Explique meus critérios de aprovação no curso de React e me diga o que falta entregar"
              )
            }
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/20 transition-all active:scale-95 shrink-0"
          >
            <Bot className="w-4 h-4 text-cyan-200" />
            <span>Auditar com Agente IA</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </button>
        </div>

        {/* Status Metrics Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div>
            <p className="text-xs text-slate-500 font-mono">Status Geral</p>
            <p className="text-base font-bold text-emerald-400 mt-0.5">85% Concluído</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono">Critérios Cumpridos</p>
            <p className="text-base font-bold text-white mt-0.5">3 de 4</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono">Média Atual</p>
            <p className="text-base font-bold text-cyan-400 mt-0.5">9.4 / 10.0</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono">Certificado Liberado?</p>
            <p className="text-base font-bold text-amber-400 mt-0.5">Aguardando Capstone</p>
          </div>
        </div>
      </MCPResource>

      {/* Lista de Requerimentos Detalhados */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          Critérios de Avaliação e Entregáveis Obrigatórios
        </h2>

        <div className="space-y-4">
          {requirements.map((req, idx) => (
            <div
              key={req.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold">
                    Requisito {idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-white">{req.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                  {req.description}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                  <span>Validador: {req.validator}</span>
                  <span>•</span>
                  <span>Nota: {req.grade}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                {req.status === "completed" ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Aprovado
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Em Revisão
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navegação entre Subpáginas Irmãs */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400">
          <span>Subpáginas irmãs do Nível 3: </span>
          <Link href="/dashboard/requirements/courses/architecture" className="text-indigo-400 hover:underline mx-1">
            Arquitetura
          </Link>
          <span>•</span>
          <Link href="/dashboard/requirements/courses/nextjs" className="text-purple-400 hover:underline mx-1">
            Next.js
          </Link>
        </div>

        <Link
          href="/dashboard/requirements/courses"
          className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
        >
          <span>Subir para Nível 2 (Cursos)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
