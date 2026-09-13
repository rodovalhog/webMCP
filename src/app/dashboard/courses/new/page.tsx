"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { MCPResource } from "@/components/mcp/MCPResource";
import { PlusCircle, ShieldAlert, CheckCircle, ChevronLeft } from "lucide-react";

export default function CreateCoursePage() {
  const { role, setRole } = useAuth();
  const isAuthorized = role === "teacher" || role === "admin";

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/dashboard/courses"
        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Voltar para Cursos</span>
      </Link>

      {!isAuthorized ? (
        <div className="glass-panel p-8 rounded-2xl border border-rose-500/30 bg-rose-950/20 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">Acesso Negado: Ação Restrita</h1>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Seu perfil atual é <strong>{role}</strong>. A criação de novos cursos exige credenciais de{" "}
            <strong>Instrutor (Teacher)</strong> ou <strong>Administrador (Admin)</strong>.
          </p>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 max-w-lg mx-auto">
            💡 <strong>Princípio de Segurança AI:</strong> Mesmo que o modelo de linguagem sugira ou
            encontre o elemento semântico, o backend e as rotas validam autorização de forma determinística.
          </div>
          <div className="pt-2">
            <button
              onClick={() => setRole("teacher")}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
            >
              Alternar Papel para Instrutor (Testar Autorização)
            </button>
          </div>
        </div>
      ) : (
        <MCPResource
          id="mcp-create-course-form"
          resource="create_course"
          action="create"
          description="Formulário de cadastro de novo curso e planejamento curricular"
          access="teacher"
          parent="courses"
          className="glass-panel p-8 rounded-2xl border border-purple-500/30 space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Criar Novo Curso</h1>
              <p className="text-xs text-slate-400">
                Área de instrutores autorizados. Cadastre título, módulos e aulas.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Título do Curso</label>
              <input
                type="text"
                placeholder="Ex: Arquitetura de Microfrontends com Next.js"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Descrição Curricular</label>
              <textarea
                rows={3}
                placeholder="Descreva os objetivos de aprendizado..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md transition">
              Salvar e Adicionar Aulas
            </button>
          </div>
        </MCPResource>
      )}
    </div>
  );
}
