"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ChevronRight,
  Bot,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Globe,
  Gauge,
} from "lucide-react";
import { MCPResource } from "@/components/mcp/MCPResource";
import { useAI } from "@/context/AIContext";

export default function NextjsRequirementsPage() {
  const { setIsOpen, sendMessage } = useAI();
  const [pulseActive, setPulseActive] = useState(false);

  const handleAskAgent = (prompt: string) => {
    setPulseActive(true);
    setIsOpen(true);
    sendMessage(prompt);
  };

  const requirements = [
    {
      id: "req-next-1",
      title: "React Server Components (RSC) & Fronteiras 'use client'",
      description: "Construção de arquitetura híbrida mantendo a lógica pesada e acesso a dados estritamente no servidor, minimizando o bundle do cliente.",
      status: "completed",
      grade: "9.2",
      validator: "Prof. Diego Santos",
    },
    {
      id: "req-next-2",
      title: "Otimização de Core Web Vitals (LCP < 1.2s, INP < 100ms)",
      description: "Carregamento otimizado de fontes do Google com next/font, otimização automática de imagens com next/image e eliminação de Layout Shift.",
      status: "completed",
      grade: "9.8",
      validator: "Lighthouse CI",
    },
    {
      id: "req-next-3",
      title: "App Router: Estrutura de Rotas Aninhadas e Paralelas",
      description: "Modelagem hierárquica em múltiplos níveis (/dashboard/requirements/courses/nextjs) integradas com o scanner semântico Web MCP.",
      status: "completed",
      grade: "10.0",
      validator: "Web MCP Scanner",
    },
    {
      id: "req-next-4",
      title: "Streaming SSR com React Suspense & Edge Deployment",
      description: "Implementação de streaming progressivo de conteúdo com fallbacks visuais esqueléticos e preparação de build de produção com Turbopack.",
      status: "in_review",
      grade: "Pendente",
      validator: "Banca de Deploy",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* NÍVEL 3: SUBPÁGINA DO CURSO DE NEXT.JS (DENTRO DE CURSOS > REQUERIMENTOS) */}
      {/* ========================================================================= */}
      <MCPResource
        resource="requirements_nextjs"
        action="view"
        title="Requerimentos: Next.js 15"
        description="Subpágina de Nível 3 contendo as exigências de conclusão do Curso de Next.js 15 e Server Components"
        target="/dashboard/requirements/courses/nextjs"
        access="student"
        className={`glass-panel p-6 sm:p-8 rounded-3xl border relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-purple-950/20 to-slate-950 shadow-2xl transition-all duration-500 ${
          pulseActive ? "ring-4 ring-purple-500/80 border-purple-400" : "border-slate-800"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 4-Step Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-400">Dashboard</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/dashboard/requirements" className="text-blue-400 hover:underline">Requerimentos</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/dashboard/requirements/courses" className="text-purple-400 hover:underline">Cursos</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-purple-400 font-bold">Next.js</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold font-mono">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-mono">
              <Globe className="w-4 h-4" />
              <span>resource: requirements_nextjs (parent: requirements_courses)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              Requerimentos: Next.js 15
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm sm:text-base leading-relaxed">
              Subpágina técnica de <strong className="text-purple-400">Nível 3</strong>. O agente Web MCP compreende a rota completa: 
              Menu Requerimentos → Subpágina Cursos → Next.js, provendo roteamento seguro e contextualizado.
            </p>
          </div>

          <button
            onClick={() =>
              handleAskAgent(
                "O que falta para eu concluir os requerimentos de Next.js nesta subpágina?"
              )
            }
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium text-sm shadow-lg shadow-purple-500/20 transition-all active:scale-95 shrink-0"
          >
            <Bot className="w-4 h-4 text-purple-200" />
            <span>Auditar com Agente IA</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </button>
        </div>

        {/* Status Metrics Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div>
            <p className="text-xs text-slate-500 font-mono">Status Geral</p>
            <p className="text-base font-bold text-amber-400 mt-0.5">70% Concluído</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono">Critérios Cumpridos</p>
            <p className="text-base font-bold text-white mt-0.5">3 de 4</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono">Média Geral</p>
            <p className="text-base font-bold text-purple-400 mt-0.5">9.6 / 10.0</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono">Certificado Apto?</p>
            <p className="text-base font-bold text-amber-400 mt-0.5">Aguardando Streaming</p>
          </div>
        </div>
      </MCPResource>

      {/* Lista de Requerimentos Detalhados */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Gauge className="w-5 h-5 text-purple-400" />
          Exigências de Desempenho e Arquitetura Server-Side
        </h2>

        <div className="space-y-4">
          {requirements.map((req, idx) => (
            <div
              key={req.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold">
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
          <Link href="/dashboard/requirements/courses/react" className="text-cyan-400 hover:underline mx-1">
            React
          </Link>
          <span>•</span>
          <Link href="/dashboard/requirements/courses/architecture" className="text-indigo-400 hover:underline mx-1">
            Arquitetura
          </Link>
        </div>

        <Link
          href="/dashboard/requirements/courses"
          className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1"
        >
          <span>Subir para Nível 2 (Cursos)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
