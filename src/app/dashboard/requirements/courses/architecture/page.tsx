"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  ChevronRight,
  Sparkles,
  Bot,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  Network,
  GitBranch,
} from "lucide-react";
import { MCPResource } from "@/components/mcp/MCPResource";
import { useAI } from "@/context/AIContext";

export default function ArchitectureRequirementsPage() {
  const { setIsOpen, sendMessage } = useAI();
  const [pulseActive, setPulseActive] = useState(false);

  const handleAskAgent = (prompt: string) => {
    setPulseActive(true);
    setIsOpen(true);
    sendMessage(prompt);
  };

  const requirements = [
    {
      id: "req-arch-1",
      title: "Clean Architecture & Separação Estrita de Camadas",
      description: "Desacoplamento do domínio de regras de negócio das bibliotecas externas e frameworks de interface. Inversão de dependências e interfaces abstratas.",
      status: "completed",
      grade: "9.7",
      validator: "Prof. Alexandre Lima",
    },
    {
      id: "req-arch-2",
      title: "Protocolo Web MCP & Gates de Governança RBAC",
      description: "Implementação de autorização declarativa em 5 níveis (public, authenticated, student, teacher, admin) antes de qualquer mutação de estado ou navegação.",
      status: "completed",
      grade: "10.0",
      validator: "Audit Engine",
    },
    {
      id: "req-arch-3",
      title: "Documentação C4 Model (Context, Container, Component)",
      description: "Elaboração de diagramas interativos de arquitetura explicando o fluxo bidirecional de mensagens entre o cliente Web MCP e os agentes de IA.",
      status: "completed",
      grade: "9.0",
      validator: "Banca Técnica",
    },
    {
      id: "req-arch-4",
      title: "Benchmark de Telemetria e Latência de Agentes",
      description: "Coleta e exibição de métricas de execução de ferramentas MCP com latência inferior a 100ms no navegador para o Gemini Nano local.",
      status: "completed",
      grade: "9.5",
      validator: "Telemetry Pipeline",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* NÍVEL 3: SUBPÁGINA DO CURSO DE ARQUITETURA (DENTRO DE CURSOS > REQUERIMENTOS) */}
      {/* ========================================================================= */}
      <MCPResource
        resource="requirements_architecture"
        action="view"
        title="Requerimentos: Arquitetura de Software"
        description="Subpágina de Nível 3 contendo as exigências de conclusão do Curso de Arquitetura de Software e Web MCP"
        target="/dashboard/requirements/courses/architecture"
        access="student"
        className={`glass-panel p-6 sm:p-8 rounded-3xl border relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-indigo-950/20 to-slate-950 shadow-2xl transition-all duration-500 ${
          pulseActive ? "ring-4 ring-indigo-500/80 border-indigo-400" : "border-slate-800"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 4-Step Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-400">Dashboard</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/dashboard/requirements" className="text-blue-400 hover:underline">Requerimentos</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/dashboard/requirements/courses" className="text-purple-400 hover:underline">Cursos</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-indigo-400 font-bold">Arquitetura</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold font-mono">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-mono">
              <Network className="w-4 h-4" />
              <span>resource: requirements_architecture (parent: requirements_courses)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              Requerimentos: Arquitetura de Software
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm sm:text-base leading-relaxed">
              Página de <strong className="text-indigo-400">Nível 3</strong> dedicada aos padrões de arquitetura de alta resiliência. 
              O MCP reconhece o aninhamento profundo: Menu Requerimentos → Subpágina Cursos → Arquitetura.
            </p>
          </div>

          <button
            onClick={() =>
              handleAskAgent(
                "Explique os requisitos de arquitetura de software e verifique meu progresso de aprovação"
              )
            }
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95 shrink-0"
          >
            <Bot className="w-4 h-4 text-indigo-200" />
            <span>Auditar com Agente IA</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </button>
        </div>

        {/* Status Metrics Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div>
            <p className="text-xs text-slate-500 font-mono">Status Geral</p>
            <p className="text-base font-bold text-emerald-400 mt-0.5">92% Concluído</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono">Critérios Cumpridos</p>
            <p className="text-base font-bold text-white mt-0.5">4 de 4</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono">Média Geral</p>
            <p className="text-base font-bold text-indigo-400 mt-0.5">9.6 / 10.0</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono">Certificado Apto?</p>
            <p className="text-base font-bold text-emerald-400 mt-0.5">Elegível para Emissão</p>
          </div>
        </div>
      </MCPResource>

      {/* Lista de Requerimentos Detalhados */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-indigo-400" />
          Exigências Estruturais e Auditorias
        </h2>

        <div className="space-y-4">
          {requirements.map((req, idx) => (
            <div
              key={req.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold">
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
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Aprovado
                </span>
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
          <Link href="/dashboard/requirements/courses/nextjs" className="text-purple-400 hover:underline mx-1">
            Next.js
          </Link>
        </div>

        <Link
          href="/dashboard/requirements/courses"
          className="text-xs font-mono text-indigo-400 hover:underline flex items-center gap-1"
        >
          <span>Subir para Nível 2 (Cursos)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
