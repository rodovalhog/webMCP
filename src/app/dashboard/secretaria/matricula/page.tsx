"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  ChevronRight,
  Sparkles,
  Bot,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  AlertCircle,
  Upload,
  Send,
  UserCheck,
} from "lucide-react";
import { MCPResource } from "@/components/mcp/MCPResource";
import { useAI } from "@/context/AIContext";

export default function SecretariaMatriculaPage() {
  const { setIsOpen, sendMessage } = useAI();
  const [pulseActive, setPulseActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    curso: "Engenharia de Software & IA",
    turno: "Noturno",
  });

  const handleAskAgent = (prompt: string) => {
    setPulseActive(true);
    setIsOpen(true);
    sendMessage(prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* NÍVEL 2: SUBPÁGINA DE MATRÍCULA (DENTRO DE SECRETARIA)                     */}
      {/* ========================================================================= */}
      <MCPResource
        resource="secretaria_matricula"
        action="navigate"
        title="Matrícula de Alunos"
        description="Subpágina de Nível 2: Inscrição e matrícula de alunos na Secretaria Acadêmica"
        target="/dashboard/secretaria/matricula"
        access="student"
        parent="secretaria"
        className={`glass-panel p-6 sm:p-8 rounded-3xl border relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-emerald-950/20 to-slate-950 shadow-2xl transition-all duration-500 ${
          pulseActive ? "ring-4 ring-emerald-500/80 border-emerald-400" : "border-slate-800"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* 2-Step Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-400">Dashboard</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/dashboard/secretaria" className="text-blue-400 hover:underline">Secretaria (Nível 1)</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-emerald-400 font-bold">Matrícula</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Processo Seletivo & Ingresso 2026/2</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Formulário de Matrícula de Aluno
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
            Preencha os dados cadastrais para formalizar a matrícula. Esta subpágina de <strong>Nível 2</strong> é monitorada pelo Web MCP com guardrails de validação estritos.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <button
              onClick={() => handleAskAgent("Como funciona o processo de matrícula na secretaria?")}
              className="px-3 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/40 text-[11px] font-medium transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Pedir auxílio à IA para preencher</span>
            </button>
          </div>
        </div>
      </MCPResource>

      {/* Matrícula Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MCPResource
            resource="secretaria_matricula"
            action="submit"
            title="Formulário Semântico de Matrícula"
            description="Submissão de dados cadastrais e seleção de turma para matrícula"
            target="/dashboard/secretaria/matricula"
            access="student"
            parent="secretaria"
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6"
          >
            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">Solicitação de Matrícula Enviada!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  A Secretaria Acadêmica recebeu sua ficha para o curso <strong>{formData.curso}</strong>. O comprovante foi enviado para seu e-mail cadastrado.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                >
                  Fazer Outra Matrícula
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Nome Completo do Aluno</label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Ex: João da Silva Santos"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">CPF</label>
                    <input
                      type="text"
                      required
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      placeholder="000.000.000-00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">E-mail para Contato</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="aluno@learnflow.ai"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Curso Pretendido</label>
                    <select
                      value={formData.curso}
                      onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option>Engenharia de Software & IA</option>
                      <option>React & Arquitetura Web</option>
                      <option>Next.js & Cloud Computing</option>
                      <option>Ciência da Computação Aplicada</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Turno de Preferência</label>
                    <select
                      value={formData.turno}
                      onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option>Noturno (19h às 22h30)</option>
                      <option>Matutino (08h às 11h30)</option>
                      <option>EAD / Flexível</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirmar Envio da Matrícula</span>
                  </button>
                </div>
              </form>
            )}
          </MCPResource>
        </div>

        {/* Sidebar Info Cards */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Guardrails do Web MCP</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              O agente audita os campos obrigatórios antes do envio. Qualquer aluno autenticado pode submeter seu formulário de ingresso.
            </p>
            <div className="text-[10px] font-mono text-emerald-300 bg-slate-950 p-2 rounded border border-slate-800">
              parent: secretaria &gt; subpage: secretaria_matricula
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Prazos do Semestre</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Início das aulas presenciais e online: <strong>03 de Novembro de 2026</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
