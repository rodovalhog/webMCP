"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calculator,
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
  UserCheck,
} from "lucide-react";
import { MCPResource } from "@/components/mcp/MCPResource";
import { useAI } from "@/context/AIContext";

export default function DisciplinaMatematicaPage() {
  const { setIsOpen, sendMessage } = useAI();
  const [pulseActive, setPulseActive] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const handleAskAgent = (prompt: string) => {
    setPulseActive(true);
    setIsOpen(true);
    sendMessage(prompt);
  };

  const modules = [
    {
      id: "mod-1",
      title: "Módulo 1: Álgebra Linear para Aprendizado de Máquina",
      description: "Vetores, matrizes, transformações lineares, autovalores, autovetores e decomposição SVD.",
      hours: "25h",
      status: "completed",
    },
    {
      id: "mod-2",
      title: "Módulo 2: Cálculo Diferencial e Integral",
      description: "Limites, derivadas parciais, gradiente descendente e otimização de funções de custo.",
      hours: "30h",
      status: "in_progress",
    },
    {
      id: "mod-3",
      title: "Módulo 3: Probabilidade e Estatística Descritiva",
      description: "Distribuições normais, probabilidade condicional, teorema de Bayes e testes de hipóteses.",
      hours: "25h",
      status: "upcoming",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* NÍVEL 3: SUBPÁGINA DA DISCIPLINA DE MATEMÁTICA                           */}
      {/* ========================================================================= */}
      <MCPResource
        resource="secretaria_disciplina_matematica"
        action="view"
        title="Disciplina: Matemática"
        description="Subpágina de Nível 3: Ementa, módulos, notas e horários da disciplina de Matemática"
        target="/dashboard/secretaria/disciplinas/matematica"
        access="student"
        parent="secretaria_disciplinas"
        className={`glass-panel p-6 sm:p-8 rounded-3xl border relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-blue-950/20 to-slate-950 shadow-2xl transition-all duration-500 ${
          pulseActive ? "ring-4 ring-blue-500/80 border-blue-400" : "border-slate-800"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 3-Step Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-400">Dashboard</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/dashboard/secretaria" className="text-blue-400 hover:underline">Secretaria (Nível 1)</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/dashboard/secretaria/disciplinas" className="text-purple-400 hover:underline">Disciplinas (Nível 2)</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-blue-400 font-bold">Matemática</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold font-mono">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium">
            <Calculator className="w-4 h-4 text-blue-400" />
            <span>Código: MAT-301 • Carga Horária: 80 Horas</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Disciplina: Matemática para Ciência de Dados & IA
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
            Esta é a subpágina de <strong>Nível 3</strong> da disciplina de Matemática. O Web MCP resolve esta rota aninhada em profundidade com metadados semânticos completos: <code className="text-blue-300 font-mono">secretaria &gt; secretaria_disciplinas &gt; secretaria_disciplina_matematica</code>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span className="text-slate-300 font-medium">
              Professor Responsável: <strong>Prof. Dr. Ricardo Farias</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-medium">
              Horário: <strong>Segundas e Quartas, 19h00 às 21h00</strong>
            </span>
          </div>
        </div>
      </MCPResource>

      {/* Modules & Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Plano de Ensino & Módulos da Disciplina</span>
          </h2>

          <div className="space-y-3">
            {modules.map((m, idx) => (
              <div
                key={m.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-blue-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{m.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {m.hours}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status & Enrollment Card */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Situação na Disciplina</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold text-emerald-400">Matriculado Regularmente</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Frequência:</span>
                <span className="font-semibold text-white">96% Presença</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Média Parcial:</span>
                <span className="font-bold text-blue-400">9.4 / 10.0</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setEnrolled(!enrolled)}
                className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 ${
                  enrolled
                    ? "bg-emerald-600 text-white"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{enrolled ? "Inscrição Confirmada" : "Confirmar Presença na Turma"}</span>
              </button>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-slate-300">Auditoria Web MCP (Nível 3):</div>
            <div className="text-[10px] font-mono text-blue-300 bg-slate-950 p-2.5 rounded border border-slate-800 leading-relaxed">
              ID: secretaria_disciplina_matematica<br />
              Parent: secretaria_disciplinas<br />
              Root: secretaria
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
