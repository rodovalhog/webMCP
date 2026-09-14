"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Languages,
  ChevronRight,
  Sparkles,
  Bot,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  BookOpen,
  Calendar,
} from "lucide-react";
import { MCPResource } from "@/components/mcp/MCPResource";
import { useAI } from "@/context/AIContext";

export default function DisciplinaPortuguesPage() {
  const { setIsOpen, sendMessage } = useAI();
  const [pulseActive, setPulseActive] = useState(false);

  const modules = [
    {
      id: "mod-port-1",
      title: "Módulo 1: Redação Técnica e Comunicação Científica",
      description: "Estruturação de artigos científicos, documentação de software e clareza argumentativa.",
      hours: "20h",
    },
    {
      id: "mod-port-2",
      title: "Módulo 2: Gramática Normativa e Semântica Aplicada",
      description: "Concordância, regência, coesão textual e análise do discurso corporativo.",
      hours: "20h",
    },
    {
      id: "mod-port-3",
      title: "Módulo 3: Literatura Brasileira e Produção Crítica",
      description: "Modernismo, contemporaneidade e leitura crítica de textos interdisciplinares.",
      hours: "20h",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* NÍVEL 3: SUBPÁGINA DA DISCIPLINA DE PORTUGUÊS                             */}
      {/* ========================================================================= */}
      <MCPResource
        resource="secretaria_disciplina_portugues"
        action="view"
        title="Disciplina: Português"
        description="Subpágina de Nível 3: Ementa, redação técnica e literatura da disciplina de Português"
        target="/dashboard/secretaria/disciplinas/portugues"
        access="student"
        parent="secretaria_disciplinas"
        className={`glass-panel p-6 sm:p-8 rounded-3xl border relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-emerald-950/20 to-slate-950 shadow-2xl transition-all duration-500 ${
          pulseActive ? "ring-4 ring-emerald-500/80 border-emerald-400" : "border-slate-800"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 3-Step Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-400">Dashboard</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/dashboard/secretaria" className="text-blue-400 hover:underline">Secretaria (Nível 1)</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/dashboard/secretaria/disciplinas" className="text-purple-400 hover:underline">Disciplinas (Nível 2)</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-emerald-400 font-bold">Português</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
              NÍVEL 3: SUBPÁGINA ESPECÍFICA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/secretaria/disciplinas"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar a Disciplinas</span>
            </Link>
          </div>
        </div>

        {/* Header Content */}
        <div className="pt-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
            <Languages className="w-4 h-4 text-emerald-400" />
            <span>Código: POR-201 • Carga Horária: 60 Horas</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Disciplina: Português & Comunicação Técnica
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
            Subpágina de <strong>Nível 3</strong> contendo o plano de ensino, critérios de redação acadêmica e módulos de linguística aplicada. Rota aninhada: <code className="text-emerald-300 font-mono">secretaria &gt; secretaria_disciplinas &gt; secretaria_disciplina_portugues</code>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span className="text-slate-300 font-medium">
              Professora Responsável: <strong>Profa. Dra. Mariana Lima</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-medium">
              Horário: <strong>Terças e Quintas, 19h00 às 20h30</strong>
            </span>
          </div>
        </div>
      </MCPResource>

      {/* Modules & Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Módulos de Aprendizado</span>
          </h2>

          <div className="space-y-3">
            {modules.map((m) => (
              <div
                key={m.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{m.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {m.hours}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status Card */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Desempenho</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold text-emerald-400">Em Curso</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Frequência:</span>
                <span className="font-semibold text-white">100% Presença</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Média Parcial:</span>
                <span className="font-bold text-emerald-400">9.8 / 10.0</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-slate-300">Auditoria Web MCP (Nível 3):</div>
            <div className="text-[10px] font-mono text-emerald-300 bg-slate-950 p-2.5 rounded border border-slate-800 leading-relaxed">
              ID: secretaria_disciplina_portugues<br />
              Parent: secretaria_disciplinas<br />
              Root: secretaria
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
