import React from "react";
import Link from "next/link";
import { MCPResource } from "@/components/mcp/MCPResource";
import { MCPNavigation } from "@/components/mcp/MCPNavigation";
import { MCPAction } from "@/components/mcp/MCPAction";
import {
  PlayCircle,
  Award,
  CheckCircle2,
  FileCode,
  FileCheck,
  ChevronLeft,
  Clock,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tab?: string; lesson?: string }>;
}

export default async function CourseDetailPage({ params, searchParams }: CourseDetailPageProps) {
  const { id } = await params;
  const search = (await searchParams) || {};
  const activeTab = search.tab || "lessons";
  const activeLesson = search.lesson || "hooks-avancados";

  const isReact = id === "react-avancado";
  const courseTitle = isReact ? "React Avançado" : "Next.js 15 & Arquitetura Web";

  const lessons = [
    {
      id: "mental-model",
      title: "1. Modelo Mental do React 19 e Concorrência",
      duration: "24 min",
      completed: true,
    },
    {
      id: "state-management",
      title: "2. Padrões Modernos de Estado Global",
      duration: "35 min",
      completed: true,
    },
    {
      id: "custom-hooks",
      title: "3. Engenharia de Custom Hooks Reutilizáveis",
      duration: "40 min",
      completed: true,
    },
    {
      id: "hooks-avancados",
      title: "4. Hooks Avançados: useMemo, useCallback e Profiler",
      duration: "52 min",
      completed: false,
      current: true,
    },
    {
      id: "server-components",
      title: "5. React Server Components (RSC) em Profundidade",
      duration: "45 min",
      completed: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/courses"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar para Meus Cursos</span>
        </Link>

        {/* Certificate Button */}
        <MCPNavigation
          href={`/dashboard/courses/${id}/certificate`}
          resource="course_certificate"
          resourceId={id}
          description={`Visualizar certificado oficial do curso ${courseTitle}`}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Ver Certificado</span>
        </MCPNavigation>
      </div>

      {/* Course Hero Banner */}
      <MCPResource
        id={`mcp-course-header-${id}`}
        resource="course"
        resourceId={id}
        action="view"
        description={`Visão geral do curso ${courseTitle}`}
        className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Formação Especializada
          </span>
          <span className="text-xs text-slate-400">• 32 Horas • Certificado Incluso</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">{courseTitle}</h1>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Aprenda os fundamentos avançados de renderização, profiler de performance, padrões arquiteturais e como integrar o ecossistema com navegadores semânticos de IA.
        </p>
      </MCPResource>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-sm font-semibold">
        <Link
          href={`/dashboard/courses/${id}?tab=lessons`}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "lessons" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          Aulas & Módulos
        </Link>
        <Link
          href={`/dashboard/courses/${id}?tab=exercises`}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "exercises" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          Exercícios Práticos
        </Link>
        <Link
          href={`/dashboard/courses/${id}?tab=assessment`}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "assessment" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          Avaliação Final
        </Link>
      </div>

      {/* Tab 1: Lessons */}
      {activeTab === "lessons" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Lesson Player Simulator */}
          <div className="lg:col-span-2 space-y-4">
            <MCPResource
              id="mcp-active-player"
              resource="lesson"
              resourceId={activeLesson}
              action="execute"
              description={`Player da aula ativa: ${activeLesson}`}
              className="glass-panel aspect-video rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden bg-slate-950 p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/30">
                <PlayCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Hooks Avançados: useMemo, useCallback & Profiler
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                Player de vídeo interativo LearnFlow. Pratique os conceitos com o simulador de código abaixo.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition">
                  Continuar Vídeo (14:32)
                </button>
                <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition">
                  Material Complementar
                </button>
              </div>
            </MCPResource>
          </div>

          {/* Lessons Playlist */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white px-1">Grade de Aulas</h3>
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`p-3.5 rounded-xl border transition flex items-center justify-between ${
                    lesson.id === activeLesson
                      ? "bg-blue-600/10 border-blue-500/40 text-blue-300"
                      : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {lesson.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : lesson.current ? (
                      <PlayCircle className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <div>
                      <div className="text-xs font-semibold text-white">{lesson.title}</div>
                      <div className="text-[10px] text-slate-500">{lesson.duration}</div>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/courses/${id}?lesson=${lesson.id}`}
                    className="text-xs text-blue-400 hover:underline shrink-0"
                  >
                    Acessar
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Exercises */}
      {activeTab === "exercises" && (
        <MCPResource
          resource="exercises"
          resourceId={id}
          action="execute"
          description="Exercícios práticos de fixação"
          className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4"
        >
          <h3 className="text-lg font-bold text-white">Laboratório de Exercícios</h3>
          <p className="text-xs text-slate-400">
            Resolva desafios interativos com testes automatizados para liberar a avaliação final.
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCode className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-xs font-bold text-white">Desafio: Criando um Hook useDebounce com Clean-up</div>
                <div className="text-[10px] text-slate-400">4 testes unitários • Duração estimada: 25 min</div>
              </div>
            </div>
            <button className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition">
              Abrir Editor
            </button>
          </div>
        </MCPResource>
      )}

      {/* Tab 3: Assessment */}
      {activeTab === "assessment" && (
        <MCPResource
          resource="assessment"
          resourceId={id}
          action="execute"
          description="Avaliação oficial para emissão do certificado"
          className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4"
        >
          <h3 className="text-lg font-bold text-white">Prova de Certificação</h3>
          <p className="text-xs text-slate-400">
            Avaliação final composta por 15 questões de múltipla escolha e 1 desafio prático. Nota de corte: 80%.
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">Exame Teórico-Prático de React Avançado</div>
                <div className="text-[10px] text-slate-400">Tempo limite: 60 minutos • Tentativas restantes: 3</div>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition">
              Iniciar Avaliação
            </button>
          </div>
        </MCPResource>
      )}
    </div>
  );
}
