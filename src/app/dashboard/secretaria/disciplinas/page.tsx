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
  Calculator,
  Languages,
  FlaskConical,
  History,
  GraduationCap,
  Users,
} from "lucide-react";
import { MCPResource } from "@/components/mcp/MCPResource";
import { useAI } from "@/context/AIContext";

export default function SecretariaDisciplinasSubpage() {
  const { setIsOpen, sendMessage } = useAI();
  const [pulseActive, setPulseActive] = useState(false);

  const handleAskAgent = (prompt: string) => {
    setPulseActive(true);
    setIsOpen(true);
    sendMessage(prompt);
  };

  const disciplines = [
    {
      id: "matematica",
      title: "Matemática",
      description: "Cálculo diferencial, álgebra linear, trigonometria e fundamentos de lógica matemática para IA.",
      hours: "80 Horas",
      professor: "Prof. Dr. Ricardo Farias",
      badge: "Nível 3 • Matemática",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      href: "/dashboard/secretaria/disciplinas/matematica",
      resource: "secretaria_disciplina_matematica",
      icon: Calculator,
      agentPrompt: "Quero ver a disciplina de matemática na secretaria",
    },
    {
      id: "portugues",
      title: "Português",
      description: "Comunicação técnica, redação corporativa, análise textual e literatura contemporânea.",
      hours: "60 Horas",
      professor: "Profa. Dra. Mariana Lima",
      badge: "Nível 3 • Português",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      href: "/dashboard/secretaria/disciplinas/portugues",
      resource: "secretaria_disciplina_portugues",
      icon: Languages,
      agentPrompt: "Quero ver a disciplina de português na secretaria",
    },
    {
      id: "ciencias",
      title: "Ciências",
      description: "Laboratórios práticos, física aplicada, química analítica e introdução à metodologia científica.",
      hours: "60 Horas",
      professor: "Prof. Dr. Fernando Rocha",
      badge: "Nível 3 • Ciências",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      href: "/dashboard/secretaria/disciplinas/ciencias",
      resource: "secretaria_disciplina_ciencias",
      icon: FlaskConical,
      agentPrompt: "Quero ver a disciplina de ciências na secretaria",
    },
    {
      id: "historia",
      title: "História",
      description: "História geral, evolução tecnológica da sociedade, patrimônio cultural e geopolítica moderna.",
      hours: "40 Horas",
      professor: "Profa. Ma. Beatriz Alencar",
      badge: "Nível 3 • História",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      href: "/dashboard/secretaria/disciplinas/historia",
      resource: "secretaria_disciplina_historia",
      icon: History,
      agentPrompt: "Quero ver a disciplina de história na secretaria",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* NÍVEL 2: SUBPÁGINA INTERMEDIÁRIA DE DISCIPLINAS (SECRETARIA)              */}
      {/* ========================================================================= */}
      <MCPResource
        resource="secretaria_disciplinas"
        action="navigate"
        title="Grade de Disciplinas da Secretaria"
        description="Subpágina intermediária de Nível 2: Catálogo de disciplinas da Secretaria Acadêmica"
        target="/dashboard/secretaria/disciplinas"
        access="student"
        parent="secretaria"
        className={`glass-panel p-6 sm:p-8 rounded-3xl border relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-purple-950/20 to-slate-950 shadow-2xl transition-all duration-500 ${
          pulseActive ? "ring-4 ring-purple-500/80 border-purple-400" : "border-slate-800"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 2-Step Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-400">Dashboard</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/dashboard/secretaria" className="text-blue-400 hover:underline">Secretaria (Nível 1)</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-purple-400 font-bold">Disciplinas</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold font-mono">
              NÍVEL 2: SUBPÁGINA INTERMEDIÁRIA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/secretaria"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar à Secretaria</span>
            </Link>
          </div>
        </div>

        {/* Header Content */}
        <div className="pt-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Matriz Curricular & Disciplinas Ativas</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Disciplinas da Secretaria Acadêmica
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
            Abaixo estão as disciplinas organizadas em subpáginas de <strong>Nível 3</strong>. O agente de IA reconhece cada matéria individualmente e guia você diretamente até a página detalhada da disciplina desejada:
          </p>

          {/* Quick Agent Navigator Prompts */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span>Testar IA para Nível 3:</span>
            </span>
            <button
              onClick={() => handleAskAgent("Quero ver a disciplina de matemática na secretaria")}
              className="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-blue-200 border border-blue-700/50 text-[11px] font-semibold transition"
            >
              📐 &ldquo;Matemática&rdquo;
            </button>
            <button
              onClick={() => handleAskAgent("Quero ver a disciplina de português na secretaria")}
              className="px-2.5 py-1 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-200 border border-emerald-700/50 text-[11px] font-semibold transition"
            >
              ✍️ &ldquo;Português&rdquo;
            </button>
            <button
              onClick={() => handleAskAgent("Quero ver a disciplina de ciências na secretaria")}
              className="px-2.5 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-700/50 text-[11px] font-semibold transition"
            >
              🧪 &ldquo;Ciências&rdquo;
            </button>
            <button
              onClick={() => handleAskAgent("Quero ver a disciplina de história na secretaria")}
              className="px-2.5 py-1 rounded-lg bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 border border-amber-700/50 text-[11px] font-semibold transition"
            >
              🏛️ &ldquo;História&rdquo;
            </button>
          </div>
        </div>
      </MCPResource>

      {/* ========================================================================= */}
      {/* CARDS DE NÍVEL 3: DISCIPLINAS ESPECÍFICAS                                */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Disciplinas Ofertadas (Subpáginas de Nível 3)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Clique para acessar a subpágina específica da disciplina ou solicite ao agente:
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">4 rotas de nível 3</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {disciplines.map((d) => {
            const Icon = d.icon;
            return (
              <MCPResource
                key={d.id}
                resource={d.resource}
                action="view"
                title={`Disciplina: ${d.title}`}
                description={d.description}
                target={d.href}
                access="student"
                parent="secretaria_disciplinas"
                className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${d.badgeColor}`}>
                      {d.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
                      <span>{d.title}</span>
                      <span className="text-[11px] font-mono font-normal text-slate-400">({d.hours})</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {d.description}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span>Responsável: <strong>{d.professor}</strong></span>
                    <span className="text-[10px] text-purple-400 font-mono">Nível 3</span>
                  </div>
                </div>

                <div className="pt-5 space-y-2">
                  <Link
                    href={d.href}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-purple-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>Ver Detalhes da Disciplina</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleAskAgent(d.agentPrompt)}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-purple-300 border border-slate-800 text-[10px] font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Pedir à IA: &ldquo;{d.agentPrompt}&rdquo;</span>
                  </button>
                </div>
              </MCPResource>
            );
          })}
        </div>
      </div>
    </div>
  );
}
