"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Sparkles,
  Bot,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileCode2,
  Cpu,
  CornerDownRight,
  BarChart2,
  FolderTree,
} from "lucide-react";
import { MCPResource } from "@/components/mcp/MCPResource";
import { useAI } from "@/context/AIContext";

export default function RequirementsCoursesSubpage() {
  const { setIsOpen, sendMessage } = useAI();
  const [pulseActive, setPulseActive] = useState(false);

  const handleAskAgent = (prompt: string) => {
    setPulseActive(true);
    setIsOpen(true);
    sendMessage(prompt);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* NÍVEL 2: SUBPÁGINA DE CURSOS DENTRO DO MENU REQUERIMENTOS                 */}
      {/* ========================================================================= */}
      <MCPResource
        resource="requirements_courses"
        action="navigate"
        title="Requerimentos de Cursos"
        description="Subpágina de Cursos dentro de Requerimentos Acadêmicos - Nível 2"
        target="/dashboard/requirements/courses"
        access="student"
        className={`glass-panel p-6 sm:p-8 rounded-3xl border relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-purple-950/20 to-slate-950 shadow-2xl transition-all duration-500 ${
          pulseActive ? "ring-4 ring-purple-500/80 border-purple-400" : "border-slate-800"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 3-Step Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-400">Dashboard</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/dashboard/requirements" className="text-blue-400 hover:underline">Requerimentos (Nível 1)</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-purple-400 font-bold">Cursos</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold font-mono">
              NÍVEL 2: SUBPÁGINA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/requirements"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar a Requerimentos</span>
            </Link>
          </div>
        </div>

        {/* Header Content */}
        <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-mono">
              <FolderTree className="w-4 h-4" />
              <span>parent: academic_requirements &gt; subpage: requirements_courses</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              Requerimentos por Curso
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm sm:text-base leading-relaxed">
              Subpágina dedicada à matriz de exigências técnicas por trilha formativa.
              Como uma <strong className="text-purple-300">página dentro de outra página</strong>, ela centraliza as regras acadêmicas e conecta você diretamente às 
              sub-subpáginas de <strong className="text-white">React</strong>, <strong className="text-white">Arquitetura</strong> e <strong className="text-white">Next.js</strong>.
            </p>
          </div>

          <button
            onClick={() =>
              handleAskAgent(
                "O que é exigido nesta subpágina de cursos e quais subpáginas de tecnologias posso acessar a partir daqui?"
              )
            }
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-purple-500/20 transition-all active:scale-95 shrink-0"
          >
            <Bot className="w-4 h-4 text-purple-200" />
            <span>Consultar Agente MCP</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </button>
        </div>

        {/* Tree Navigator Banner */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
              2/3
            </div>
            <div>
              <p className="text-xs text-purple-300 font-mono font-bold">PROFUNDIDADE SEMÂNTICA NÍVEL 2</p>
              <p className="text-sm text-slate-300">
                Página-mãe: <Link href="/dashboard/requirements" className="text-blue-400 hover:underline">Requerimentos</Link> | Subpáginas filhas: 3 cursos especializados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Rotas filhas resolvidas com sucesso</span>
          </div>
        </div>
      </MCPResource>

      {/* ========================================================================= */}
      {/* SELEÇÃO DAS 3 SUB-SUBPÁGINAS DE NÍVEL 3 (REACT, ARQUITETURA, NEXT.JS)     */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            Subpáginas Disponíveis em Cursos (Nível 3)
          </h2>
          <span className="text-xs font-mono text-slate-400">3 sub-rotas ativas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: React Subpage */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">
                  NÍVEL 3: SUBPÁGINA
                </span>
                <span className="text-xs font-mono text-cyan-400">85% Completo</span>
              </div>
              <h3 className="text-xl font-bold text-white">React Avançado</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Requerimentos técnicos para hooks avançados, Web MCP semantic scanning no DOM, tipagem TypeScript estrita e testes funcionais com Jest.
              </p>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                <p className="text-slate-500">Rota física:</p>
                <p className="text-cyan-300">/dashboard/requirements/courses/react</p>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/dashboard/requirements/courses/react"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-all"
              >
                <span>Acessar Página de Requisitos de React</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() =>
                  handleAskAgent("Quero ver os requerimentos de react nesta subpágina")
                }
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition-all"
              >
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pedir ao Agente para me levar</span>
              </button>
            </div>
          </div>

          {/* Card 2: Arquitetura Subpage */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold">
                  NÍVEL 3: SUBPÁGINA
                </span>
                <span className="text-xs font-mono text-indigo-400">92% Completo</span>
              </div>
              <h3 className="text-xl font-bold text-white">Arquitetura de Software</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Clean Architecture, separação de responsabilidades no cliente, orquestração Web MCP, modelo de permissões RBAC e diagramas C4.
              </p>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                <p className="text-slate-500">Rota física:</p>
                <p className="text-indigo-300">/dashboard/requirements/courses/architecture</p>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/dashboard/requirements/courses/architecture"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
              >
                <span>Acessar Página de Requisitos de Arquitetura</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() =>
                  handleAskAgent("Quero ver os requerimentos do curso de arquitetura")
                }
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition-all"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                <span>Pedir ao Agente para me levar</span>
              </button>
            </div>
          </div>

          {/* Card 3: Next.js Subpage */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-bold">
                  NÍVEL 3: SUBPÁGINA
                </span>
                <span className="text-xs font-mono text-purple-400">70% Completo</span>
              </div>
              <h3 className="text-xl font-bold text-white">Next.js 15 & Server Components</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                React Server Components, dynamic streaming com Suspense, App Router navigation e otimizações de Core Web Vitals com Turbopack.
              </p>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                <p className="text-slate-500">Rota física:</p>
                <p className="text-purple-300">/dashboard/requirements/courses/nextjs</p>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/dashboard/requirements/courses/nextjs"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all"
              >
                <span>Acessar Página de Requisitos de Next.js</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() =>
                  handleAskAgent("Quero ver os requerimentos do curso de Next.js")
                }
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition-all"
              >
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>Pedir ao Agente para me levar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
