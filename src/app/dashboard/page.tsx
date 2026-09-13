"use client";

import React from "react";
import Link from "next/link";
import { MCPResource } from "@/components/mcp/MCPResource";
import { MCPAction } from "@/components/mcp/MCPAction";
import { MCPNavigation } from "@/components/mcp/MCPNavigation";
import { useAuth } from "@/context/AuthContext";
import { useAI } from "@/context/AIContext";
import {
  PlayCircle,
  Award,
  BarChart3,
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  FileCheck,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { toggleChat, sendMessage } = useAI();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
              Plataforma AI-Native
            </span>
            <span className="text-xs text-slate-400 font-mono">Semantic DOM Ativo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bem-vindo de volta, {user.name} 👋
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Sua jornada de aprendizado está potencializada pelo **MCP Semantic Navigator**. Pergunte ao agente para navegar ou clique nos recursos abaixo.
          </p>
        </div>

        <button
          onClick={toggleChat}
          className="relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/20 transition group shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition" />
          <span>Fazer pergunta ao Navigator</span>
        </button>
      </div>

      {/* Hero Continue Learning Card (Decorated with data-mcp-resource="continue_lesson") */}
      <MCPResource
        id="mcp-continue-lesson-card"
        resource="continue_lesson"
        resourceId="react-avancado"
        action="execute"
        description="Continuar a aula em andamento: Hooks Avançados do curso React Avançado"
        parent="dashboard"
        context={{
          courseId: "react-avancado",
          lesson: "Hooks avançados",
          progress: 72,
        }}
        className="glass-panel p-6 rounded-2xl border border-slate-700/80 shadow-xl relative overflow-hidden transition-all hover:border-blue-500/40"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Continuar de onde parou</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              React Avançado: Hooks, Performance & Arquitetura
            </h2>
            <p className="text-xs text-slate-400">
              Módulo 3: Hooks Customizados e Otimizações de Renderização • Aula 4:{" "}
              <strong className="text-slate-200">useMemo, useCallback & Profiler</strong>
            </p>

            {/* Progress bar */}
            <div className="pt-2 space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>Progresso do curso</span>
                <span className="text-blue-400 font-bold">72% concluído</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: "72%" }}
                />
              </div>
            </div>
          </div>

          <MCPNavigation
            href="/dashboard/courses/react-avancado?lesson=hooks-avancados"
            resource="continue_lesson"
            resourceId="react-avancado"
            action="execute"
            description="Abrir player da aula Hooks Avançados"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition shrink-0"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Continuar Aula</span>
          </MCPNavigation>
        </div>
      </MCPResource>

      {/* Metrics Row: Certificates & Progress (Decorated with MCP metadata) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <MCPResource
          id="mcp-card-progress"
          resource="progress"
          action="navigate"
          description="Visualizar estatísticas completas de progresso e ofensiva de estudo"
          parent="dashboard"
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <MCPNavigation
              href="/dashboard/progress"
              resource="progress"
              description="Acessar página de progresso"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Detalhes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </MCPNavigation>
          </div>
          <div>
            <div className="text-2xl font-black text-white">48.5h</div>
            <div className="text-xs text-slate-400">Tempo de estudo acumulado</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14% em relação à semana passada</span>
          </div>
        </MCPResource>

        {/* Certificates Card */}
        <MCPResource
          id="mcp-card-certificates"
          resource="certificates"
          action="navigate"
          description="Acessar todos os certificados emitidos e autenticações digitais"
          parent="dashboard"
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <MCPNavigation
              href="/dashboard/certificates"
              resource="certificates"
              description="Acessar página de certificados"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </MCPNavigation>
          </div>
          <div>
            <div className="text-2xl font-black text-white">3 Certificados</div>
            <div className="text-xs text-slate-400">Emitidos com validação criptográfica</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Disponível para download em PDF</span>
          </div>
        </MCPResource>

        {/* Exercises / Assessment Card */}
        <MCPResource
          id="mcp-card-assessments"
          resource="assessment"
          action="navigate"
          description="Acessar avaliações práticas e simulados para validação de competências"
          parent="dashboard"
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <MCPNavigation
              href="/dashboard/courses/react-avancado?tab=assessment"
              resource="assessment"
              resourceId="react-avancado"
              description="Realizar avaliação prática de React"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Iniciar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </MCPNavigation>
          </div>
          <div>
            <div className="text-2xl font-black text-white">Prova Prática</div>
            <div className="text-xs text-slate-400">Avaliação final de React Avançado pendente</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <span>Nota mínima para certificação: 80%</span>
          </div>
        </MCPResource>
      </div>

      {/* Enrolled Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Meus Cursos em Andamento</h3>
            <p className="text-xs text-slate-400">
              Cursos matriculados com semântica de navegação exposta ao MCP
            </p>
          </div>
          <MCPNavigation
            href="/dashboard/courses"
            resource="courses"
            description="Ver catálogo completo de cursos"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Ver catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </MCPNavigation>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course 1: React Avançado */}
          <MCPResource
            id="mcp-course-card-react-avancado"
            resource="course"
            resourceId="react-avancado"
            action="open"
            description="Curso React Avançado: Hooks customizados, Performance, SSR e Server Components"
            parent="courses"
            context={{ courseId: "react-avancado", progress: 72 }}
            className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Frontend Specialist
                </span>
                <h4 className="text-base font-bold text-white">React Avançado</h4>
                <p className="text-xs text-slate-400">
                  Domine renderização, concurrency, custom hooks e padrões avançados de arquitetura.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-950/60 px-2 py-1 rounded border border-blue-800/60">
                72%
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
              <MCPNavigation
                href="/dashboard/courses/react-avancado/certificate"
                resource="course_certificate"
                resourceId="react-avancado"
                description="Visualizar certificado emitido do curso React Avançado"
                parent="course_react-avancado"
                className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Certificado</span>
              </MCPNavigation>

              <MCPNavigation
                href="/dashboard/courses/react-avancado"
                resource="course"
                resourceId="react-avancado"
                action="open"
                description="Acessar o curso React Avançado e suas aulas"
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
              >
                Acessar Curso
              </MCPNavigation>
            </div>
          </MCPResource>

          {/* Course 2: Next.js & Arquitetura Web */}
          <MCPResource
            id="mcp-course-card-nextjs"
            resource="course"
            resourceId="nextjs-architecture"
            action="open"
            description="Curso Next.js 15 e Arquitetura Web: App Router, Server Actions, Caching e Edge Runtime"
            parent="courses"
            context={{ courseId: "nextjs-architecture", progress: 45 }}
            className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Fullstack & Edge
                </span>
                <h4 className="text-base font-bold text-white">Next.js 15 & Arquitetura</h4>
                <p className="text-xs text-slate-400">
                  Desenvolvimento moderno com App Router, Streaming SSR, Turbopack e Cloudflare Workers.
                </p>
              </div>
              <span className="text-xs font-bold text-purple-400 bg-purple-950/60 px-2 py-1 rounded border border-purple-800/60">
                45%
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>12 aulas restantes</span>
              </span>

              <MCPNavigation
                href="/dashboard/courses/nextjs-architecture"
                resource="course"
                resourceId="nextjs-architecture"
                action="open"
                description="Acessar o curso Next.js 15 e Arquitetura"
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                Acessar Curso
              </MCPNavigation>
            </div>
          </MCPResource>
        </div>
      </div>
    </div>
  );
}
