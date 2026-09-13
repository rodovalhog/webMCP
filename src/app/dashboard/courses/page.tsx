"use client";

import React, { useState } from "react";
import { MCPResource } from "@/components/mcp/MCPResource";
import { MCPNavigation } from "@/components/mcp/MCPNavigation";
import { MCPAction } from "@/components/mcp/MCPAction";
import { BookOpen, Search, Filter, Star, Clock, Award, CheckCircle } from "lucide-react";

export default function CoursesPage() {
  const [filter, setFilter] = useState("all");

  const courses = [
    {
      id: "react-avancado",
      title: "React Avançado",
      tag: "Frontend",
      category: "frontend",
      description: "Hooks customizados, concorrência, otimização com Profiler e Server Components.",
      duration: "32 horas",
      rating: "4.9",
      enrolled: true,
      progress: 72,
      certificateAvailable: true,
    },
    {
      id: "nextjs-architecture",
      title: "Next.js 15 & Arquitetura Web",
      tag: "Fullstack",
      category: "fullstack",
      description: "App Router moderno, Server Actions, Edge Middleware e Turbopack.",
      duration: "28 horas",
      rating: "4.8",
      enrolled: true,
      progress: 45,
      certificateAvailable: false,
    },
    {
      id: "mcp-ai-engineering",
      title: "AI Agents & Model Context Protocol (MCP)",
      tag: "AI Engineering",
      category: "ai",
      description: "Construa sistemas agentic integrados ao DOM e ferramentas locais via protocolo MCP.",
      duration: "24 horas",
      rating: "5.0",
      enrolled: false,
      progress: 0,
      certificateAvailable: false,
    },
    {
      id: "typescript-expert",
      title: "TypeScript Ninja: Tipagem Avançada",
      tag: "Language",
      category: "frontend",
      description: "Conditional types, template literals, type guards e metaprogramação estática.",
      duration: "18 horas",
      rating: "4.9",
      enrolled: false,
      progress: 0,
      certificateAvailable: false,
    },
  ];

  const filteredCourses = filter === "all" ? courses : courses.filter((c) => c.category === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <span>Cursos & Trilhas de Aprendizado</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Explore seus cursos em andamento ou descubra novas formações especializadas.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === "all" ? "bg-blue-600 text-white font-medium" : "text-slate-400 hover:text-white"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter("frontend")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === "frontend" ? "bg-blue-600 text-white font-medium" : "text-slate-400 hover:text-white"
            }`}
          >
            Frontend
          </button>
          <button
            onClick={() => setFilter("fullstack")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === "fullstack" ? "bg-blue-600 text-white font-medium" : "text-slate-400 hover:text-white"
            }`}
          >
            Fullstack
          </button>
          <button
            onClick={() => setFilter("ai")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === "ai" ? "bg-blue-600 text-white font-medium" : "text-slate-400 hover:text-white"
            }`}
          >
            AI Engineering
          </button>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((c) => (
          <MCPResource
            key={c.id}
            id={`mcp-course-item-${c.id}`}
            resource="course"
            resourceId={c.id}
            action="open"
            description={`Acessar curso ${c.title}`}
            parent="courses"
            context={{ courseId: c.id, category: c.category }}
            className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {c.tag}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{c.rating}</span>
                </div>
              </div>

              <h2 className="text-lg font-bold text-white">{c.title}</h2>
              <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {c.duration}
                </span>
                {c.enrolled && (
                  <span className="flex items-center gap-1 text-blue-400 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {c.progress}% concluído
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {c.certificateAvailable ? (
                <MCPNavigation
                  href={`/dashboard/courses/${c.id}/certificate`}
                  resource="course_certificate"
                  resourceId={c.id}
                  description={`Ver certificado de conclusão do curso ${c.title}`}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition font-semibold"
                >
                  <Award className="w-4 h-4" />
                  <span>Certificado Liberado</span>
                </MCPNavigation>
              ) : (
                <span className="text-xs text-slate-500">Certificado após conclusão</span>
              )}

              <MCPNavigation
                href={`/dashboard/courses/${c.id}`}
                resource="course"
                resourceId={c.id}
                action="open"
                description={`Acessar grade de aulas do curso ${c.title}`}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
              >
                Acessar Conteúdo
              </MCPNavigation>
            </div>
          </MCPResource>
        ))}
      </div>
    </div>
  );
}
