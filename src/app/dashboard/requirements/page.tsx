"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileCheck,
  BookOpen,
  ChevronRight,
  Sparkles,
  Bot,
  Layers,
  GraduationCap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  CornerDownRight,
  Award,
} from "lucide-react";
import { MCPResource } from "@/components/mcp/MCPResource";
import { useAI } from "@/context/AIContext";

export default function AcademicRequirementsPage() {
  const { setIsOpen, sendMessage } = useAI();
  const [pulseLevel, setPulseLevel] = useState<number | null>(null);

  const handleAskAgent = (prompt: string, level: number) => {
    setPulseLevel(level);
    setIsOpen(true);
    sendMessage(prompt);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* NÍVEL 1: MENU PRINCIPAL DE REQUERIMENTOS ACADÊMICOS                       */}
      {/* ========================================================================= */}
      <MCPResource
        resource="academic_requirements"
        action="navigate"
        title="Requerimentos Acadêmicos"
        description="Central Principal de Requerimentos Acadêmicos e Regras de Aprovação - Nível 1"
        target="/dashboard/requirements"
        access="student"
        className={`glass-panel p-6 sm:p-8 rounded-3xl border relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-950 to-indigo-950/30 shadow-2xl transition-all duration-500 ${
          pulseLevel === 1 ? "ring-4 ring-blue-500/80 border-blue-400" : "border-slate-800"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Level 1 Breadcrumbs & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-slate-500">Dashboard</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-blue-400 font-bold">Requerimentos</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold font-mono">
              NÍVEL 1: MENU PRINCIPAL
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Web MCP Semântico Ativo
            </span>
          </div>
        </div>

        {/* Header Content */}
        <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-mono">
              <FileCheck className="w-4 h-4" />
              <span>menu_item: academic_requirements</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              Requerimentos Acadêmicos
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm sm:text-base leading-relaxed">
              Central de acompanhamento de exigências, pré-requisitos e critérios de conclusão. 
              Esta página de Nível 1 abriga a subpágina de <strong className="text-slate-200">Cursos</strong> (Nível 2), 
              que por sua vez engloba as subpáginas de <strong className="text-slate-200">React</strong>, <strong className="text-slate-200">Arquitetura</strong> e <strong className="text-slate-200">Next.js</strong> (Nível 3).
            </p>
          </div>

          <button
            onClick={() =>
              handleAskAgent(
                "Explique como funciona a estrutura de páginas de requerimentos e me leve para a subpágina de cursos",
                1
              )
            }
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95 shrink-0"
          >
            <Bot className="w-4 h-4 text-blue-200" />
            <span>Pedir Ajuda ao Agente</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </button>
        </div>

        {/* Visual Diagram of the 3-Level Page Hierarchy */}
        <div className="mt-8 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Hierarquia de Páginas Aninhadas do Web MCP (3 Níveis de Profundidade)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Active Page */}
            <div className="p-4 rounded-xl bg-blue-950/40 border-2 border-blue-500/40 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                  NÍVEL 1 (ESTA PÁGINA)
                </span>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              </div>
              <p className="font-bold text-white text-sm">/dashboard/requirements</p>
              <p className="text-xs text-slate-400 mt-1">Menu Requerimentos Gerais & Governança</p>
            </div>

            {/* Step 2: Courses Subpage */}
            <Link
              href="/dashboard/requirements/courses"
              className="p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 hover:border-purple-500/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                  NÍVEL 2 (SUBPÁGINA)
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="font-bold text-slate-200 group-hover:text-white text-sm">/dashboard/requirements/courses</p>
              <p className="text-xs text-slate-400 mt-1">Subpágina de Cursos com Matriz Técnica</p>
            </Link>

            {/* Step 3: Specific Courses */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  NÍVEL 3 (SUB-SUBPÁGINAS)
                </span>
                <span className="text-[10px] font-mono text-slate-500">3 cursos</span>
              </div>
              <div className="space-y-1 text-xs font-mono">
                <Link href="/dashboard/requirements/courses/react" className="block text-cyan-400 hover:underline">
                  ↳ .../courses/react
                </Link>
                <Link href="/dashboard/requirements/courses/architecture" className="block text-indigo-400 hover:underline">
                  ↳ .../courses/architecture
                </Link>
                <Link href="/dashboard/requirements/courses/nextjs" className="block text-purple-400 hover:underline">
                  ↳ .../courses/nextjs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </MCPResource>

      {/* ========================================================================= */}
      {/* SEÇÃO PRINCIPAL: PORTAL PARA A SUBPÁGINA DE CURSOS (NÍVEL 2)              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Banner para a Subpágina de Cursos */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
              <BookOpen className="w-4 h-4" />
              <span>Subpágina de Nível 2</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Requerimentos por Cursos</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Acesse o catálogo com as especificações exigidas para cada disciplina do programa de Engenharia de IA. 
              Ao entrar nesta subpágina, você encontrará os critérios detalhados para <strong className="text-white">React</strong>, <strong className="text-white">Arquitetura de Software</strong> e <strong className="text-white">Next.js</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard/requirements/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/20 transition-all"
            >
              <span>Acessar Subpágina de Cursos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() =>
                handleAskAgent(
                  "Quero ver a subpágina de cursos dentro de requerimentos",
                  2
                )
              }
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition-all"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Pedir ao Agente para me levar</span>
            </button>
          </div>
        </div>

        {/* Resumo de Requisitos Institucionais */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Award className="w-4 h-4" />
            <span>Critérios Institucionais Gerais</span>
          </div>
          <h3 className="text-lg font-bold text-white">Regras de Conclusão</h3>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Frequência mínima de 75% em aulas síncronas e workshops práticos.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Nota média mínima 7.0 em todos os laboratórios individuais.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Entrega do projeto Capstone com protocolo Web MCP validado.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Auditoria semântica aprovada no scanner do DOM com 0 falhas RBAC.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Atalhos Rápidos para as Subpáginas de Nível 3 */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <CornerDownRight className="w-4 h-4 text-cyan-400" />
          Acesso Direto às Subpáginas de Cursos (Nível 3)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* React */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  NÍVEL 3
                </span>
                <span className="text-xs text-emerald-400 font-mono">85% Atingido</span>
              </div>
              <h4 className="text-base font-bold text-white">Requerimentos de React</h4>
              <p className="text-xs text-slate-400">
                Hooks customizados, Web MCP semantic tags, ciclo de vida e estado global.
              </p>
            </div>

            <div className="space-y-2">
              <Link
                href="/dashboard/requirements/courses/react"
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all"
              >
                <span>Abrir Subpágina React</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => handleAskAgent("Me leve para os requerimentos do curso de React", 3)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] transition-all"
              >
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pedir ao Agente</span>
              </button>
            </div>
          </div>

          {/* Arquitetura */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  NÍVEL 3
                </span>
                <span className="text-xs text-emerald-400 font-mono">92% Atingido</span>
              </div>
              <h4 className="text-base font-bold text-white">Requerimentos de Arquitetura</h4>
              <p className="text-xs text-slate-400">
                Clean Architecture, Governança RBAC e desacoplamento de agentes autônomos.
              </p>
            </div>

            <div className="space-y-2">
              <Link
                href="/dashboard/requirements/courses/architecture"
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-all"
              >
                <span>Abrir Subpágina Arquitetura</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => handleAskAgent("Me leve para os requerimentos do curso de arquitetura", 3)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] transition-all"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                <span>Pedir ao Agente</span>
              </button>
            </div>
          </div>

          {/* Next.js */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  NÍVEL 3
                </span>
                <span className="text-xs text-amber-400 font-mono">70% Atingido</span>
              </div>
              <h4 className="text-base font-bold text-white">Requerimentos de Next.js</h4>
              <p className="text-xs text-slate-400">
                Server Components, streaming SSR, Core Web Vitals e renderização híbrida.
              </p>
            </div>

            <div className="space-y-2">
              <Link
                href="/dashboard/requirements/courses/nextjs"
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold border border-purple-500/30 transition-all"
              >
                <span>Abrir Subpágina Next.js</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => handleAskAgent("Me leve para os requerimentos do curso de Next.js", 3)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] transition-all"
              >
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>Pedir ao Agente</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
