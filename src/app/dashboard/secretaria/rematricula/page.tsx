"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  ChevronRight,
  Sparkles,
  Bot,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Calendar,
  Check,
  RotateCcw,
} from "lucide-react";
import { MCPResource } from "@/components/mcp/MCPResource";
import { useAI } from "@/context/AIContext";

export default function SecretariaRematriculaPage() {
  const { setIsOpen, sendMessage } = useAI();
  const [pulseActive, setPulseActive] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleAskAgent = (prompt: string) => {
    setPulseActive(true);
    setIsOpen(true);
    sendMessage(prompt);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* NÍVEL 2: SUBPÁGINA DE REMATRÍCULA (DENTRO DE SECRETARIA)                   */}
      {/* ========================================================================= */}
      <MCPResource
        resource="secretaria_rematricula"
        action="navigate"
        title="Rematrícula de Alunos"
        description="Subpágina de Nível 2: Renovação periódica de matrícula e confirmação de vínculo"
        target="/dashboard/secretaria/rematricula"
        access="student"
        parent="secretaria"
        className={`glass-panel p-6 sm:p-8 rounded-3xl border relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-amber-950/20 to-slate-950 shadow-2xl transition-all duration-500 ${
          pulseActive ? "ring-4 ring-amber-500/80 border-amber-400" : "border-slate-800"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 2-Step Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-400">Dashboard</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/dashboard/secretaria" className="text-blue-400 hover:underline">Secretaria (Nível 1)</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-amber-400 font-bold">Rematrícula</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold font-mono">
              NÍVEL 2: SUBPÁGINA
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
            <ClipboardCheck className="w-4 h-4 text-amber-400" />
            <span>Renovação Semestral de Vínculo Acadêmico</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Rematrícula para o Período 2026/2
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
            Verifique o status das suas disciplinas concluídas e confirme a sua rematrícula para o próximo módulo. O agente de IA do Web MCP audita se existem pendências de documentos ou pré-requisitos antes de liberar a vaga.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <button
              onClick={() => handleAskAgent("Verificar se estou apto para rematrícula na secretaria")}
              className="px-3 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-700/40 text-[11px] font-medium transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Perguntar à IA se estou apto</span>
            </button>
          </div>
        </div>
      </MCPResource>

      {/* Rematrícula Status & Confirmation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MCPResource
            resource="secretaria_rematricula"
            action="submit"
            title="Confirmação de Rematrícula"
            description="Validação de vínculo e submissão da renovação de matrícula"
            target="/dashboard/secretaria/rematricula"
            access="student"
            parent="secretaria"
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Status Acadêmico: Apto para Renovação</span>
              </h2>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-slate-400">Aluno:</span>
                  <span className="font-bold text-white">Guilherme Rodovalho</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-slate-400">Matrícula:</span>
                  <span className="font-mono text-blue-300">2026-ENG-0841</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-slate-400">Curso:</span>
                  <span className="font-bold text-white">Engenharia de Software & IA</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-slate-400">Progresso no Semestre:</span>
                  <span className="font-bold text-emerald-400">72% Concluído</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pendências Financeiras ou de Biblioteca:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    Nenhuma Pendência (Zero)
                  </span>
                </div>
              </div>

              {confirmed ? (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Rematrícula Confirmada com Sucesso!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Seu vínculo acadêmico para o semestre <strong>2026/2</strong> foi renovado. Suas disciplinas já estão vinculadas ao seu painel.
                  </p>
                  <button
                    type="button"
                    onClick={() => setConfirmed(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                  >
                    Desfazer / Testar Novamente
                  </button>
                </div>
              ) : (
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setConfirmed(true)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Rematrícula para 2026/2</span>
                  </button>
                </div>
              )}
            </div>
          </MCPResource>
        </div>

        {/* Sidebar Help Cards */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Validador Semântico MCP</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              O recurso <code className="text-amber-300 font-mono">secretaria_rematricula</code> é consultado pela IA para checar elegibilidade do aluno.
            </p>
            <div className="text-[10px] font-mono text-amber-300 bg-slate-950 p-2 rounded border border-slate-800">
              parent: secretaria &gt; subpage: secretaria_rematricula
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Cronograma Oficial</span>
            </h3>
            <ul className="list-disc pl-4 text-[11px] text-slate-400 space-y-1">
              <li>Período Regular: 01/10 a 30/10</li>
              <li>Ajuste de Matrícula: 01/11 a 10/11</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
