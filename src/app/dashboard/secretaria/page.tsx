"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ChevronRight,
  Sparkles,
  Bot,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  BookOpen,
  Calendar,
  Users,
  ClipboardCheck,
  Calculator,
  Languages,
} from "lucide-react";
import { MCPResource } from "@/components/mcp/MCPResource";
import { useAI } from "@/context/AIContext";

export default function SecretariaAcademicaPage() {
  const { setIsOpen, sendMessage } = useAI();
  const [pulseActive, setPulseActive] = useState(false);

  const handleAskAgent = (prompt: string) => {
    setPulseActive(true);
    setIsOpen(true);
    sendMessage(prompt);
  };

  const sections = [
    {
      id: "matricula",
      title: "Matrícula de Novos Alunos",
      description: "Abertura de novas matrículas, submissão de documentação cadastral e ingresso de calouros.",
      badge: "Nível 2 • Matrícula",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      href: "/dashboard/secretaria/matricula",
      resource: "secretaria_matricula",
      stats: "24 vagas disponíveis • 2026/2",
      icon: Users,
      actionLabel: "Acessar Portal de Matrícula",
      agentPrompt: "Quero fazer matrícula na secretaria",
    },
    {
      id: "rematricula",
      title: "Rematrícula Periódica",
      description: "Renovação semestral de vínculo acadêmico, confirmação de turma e verificação de pendências.",
      badge: "Nível 2 • Rematrícula",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      href: "/dashboard/secretaria/rematricula",
      resource: "secretaria_rematricula",
      stats: "Prazo regular até 30/10",
      icon: ClipboardCheck,
      actionLabel: "Acessar Renovação de Matrícula",
      agentPrompt: "Ver rematrícula na secretaria",
    },
    {
      id: "disciplinas",
      title: "Grade de Disciplinas",
      description: "Catálogo da matriz curricular com subpáginas específicas de Matemática, Português, Ciências e História.",
      badge: "Nível 2 • 4 Subpáginas Nível 3",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      href: "/dashboard/secretaria/disciplinas",
      resource: "secretaria_disciplinas",
      stats: "4 disciplinas disponíveis",
      icon: BookOpen,
      actionLabel: "Explorar Matriz de Disciplinas",
      agentPrompt: "Quero ver as disciplinas da secretaria",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* NÍVEL 1: MENU PRINCIPAL DA SECRETARIA ACADÊMICA                           */}
      {/* ========================================================================= */}
      <MCPResource
        resource="secretaria"
        action="navigate"
        title="Central da Secretaria Acadêmica"
        description="Página-mãe de Nível 1: Gestão de Matrícula, Rematrícula e Grade de Disciplinas Curriculares"
        target="/dashboard/secretaria"
        access="student"
        className={`glass-panel p-6 sm:p-8 rounded-3xl border relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-blue-950/20 to-slate-950 shadow-2xl transition-all duration-500 ${
          pulseActive ? "ring-4 ring-blue-500/80 border-blue-400" : "border-slate-800"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1-Step Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-400">Dashboard</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-blue-400 font-bold">Secretaria Acadêmica</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold font-mono">
              NÍVEL 1: MENU PRINCIPAL
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Semestre 2026/2 Ativo</span>
            </span>
          </div>
        </div>

        {/* Header Content */}
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Estrutura Hierárquica em 3 Níveis • Web MCP</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Secretaria Acadêmica & Gestão Escolar
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
              Bem-vindo à central de atendimento acadêmico. Aqui você pode navegar de forma autônoma ou solicitar auxílio ao agente de IA para realizar sua <strong>Matrícula</strong>, renovar sua <strong>Rematrícula</strong> ou acessar o detalhamento de <strong>Disciplinas específicas</strong> (Matemática, Português, Ciências e História).
            </p>

            {/* Quick Agent Navigator Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Bot className="w-3.5 h-3.5 text-blue-400" />
                <span>Testar IA:</span>
              </span>
              <button
                onClick={() => handleAskAgent("Quero fazer matrícula na secretaria")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition"
              >
                &ldquo;Quero fazer matrícula&rdquo;
              </button>
              <button
                onClick={() => handleAskAgent("Ver rematrícula na secretaria")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition"
              >
                &ldquo;Ver rematrícula&rdquo;
              </button>
              <button
                onClick={() => handleAskAgent("Quero ver a disciplina de matemática na secretaria")}
                className="px-2.5 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-700/50 text-[11px] font-semibold transition"
              >
                ⚡ &ldquo;Disciplina de matemática&rdquo; (Nível 3)
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px] font-semibold uppercase">Matrículas Ativas</div>
              <div className="text-xl font-bold text-white">1.420</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 100% regulares
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px] font-semibold uppercase">Disciplinas</div>
              <div className="text-xl font-bold text-purple-400">4 Matrizes</div>
              <div className="text-[10px] text-purple-300">Nível 3 Aninhado</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px] font-semibold uppercase">Prazo Rematrícula</div>
              <div className="text-xl font-bold text-amber-400">16 Dias</div>
              <div className="text-[10px] text-amber-300 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Fim: 30 de Outubro
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px] font-semibold uppercase">Protocolo</div>
              <div className="text-xl font-bold text-blue-400">Web MCP</div>
              <div className="text-[10px] text-blue-300">Totalmente auditável</div>
            </div>
          </div>
        </div>
      </MCPResource>

      {/* ========================================================================= */}
      {/* SEÇÕES DE NÍVEL 2 DISPONÍVEIS                                             */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Subpáginas e Departamentos da Secretaria (Nível 2)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Selecione o serviço desejado ou peça ao assistente para conduzi-lo até a subpágina:
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">3 rotas de nível 2</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <MCPResource
                key={section.id}
                resource={section.resource}
                action="navigate"
                title={section.title}
                description={section.description}
                target={section.href}
                access="student"
                parent="secretaria"
                className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${section.badgeColor}`}>
                      {section.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {section.description}
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 font-mono border-t border-slate-800/80">
                    {section.stats}
                  </div>
                </div>

                <div className="pt-5 space-y-2">
                  <Link
                    href={section.href}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>{section.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleAskAgent(section.agentPrompt)}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-blue-300 border border-slate-800 text-[10px] font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Pedir ao agente: &ldquo;{section.agentPrompt}&rdquo;</span>
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
