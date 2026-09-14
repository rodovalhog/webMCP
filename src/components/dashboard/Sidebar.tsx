"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MCPNavigation } from "@/components/mcp/MCPNavigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  BarChart3,
  User,
  Settings,
  PlusCircle,
  ShieldAlert,
  TerminalSquare,
  Network,
  Activity,
  FileCode2,
  Sparkles,
  Compass,
  Cpu,
  UserPlus,
  Layers,
  FileCheck,
  GraduationCap,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { role } = useAuth();
  const [secretariaOpen, setSecretariaOpen] = useState(pathname.startsWith("/dashboard/secretaria"));
  const [disciplinasOpen, setDisciplinasOpen] = useState(pathname.startsWith("/dashboard/secretaria/disciplinas"));

  useEffect(() => {
    if (pathname.startsWith("/dashboard/secretaria")) {
      setSecretariaOpen(true);
    }
    if (pathname.startsWith("/dashboard/secretaria/disciplinas")) {
      setDisciplinasOpen(true);
    }
  }, [pathname]);

  const mainNavItems = [
    {
      href: "/dashboard",
      resource: "dashboard",
      title: "Dashboard",
      description: "Visão geral da plataforma e últimos cursos acessados",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/requirements",
      resource: "academic_requirements",
      title: "Requerimentos",
      description: "Central de exigências pedagógicas e aprovação em 3 níveis",
      icon: FileCheck,
      badge: "3 Níveis",
    },
    {
      href: "/dashboard/tracks",
      resource: "academy_tracks",
      title: "Trilhas & Projetos",
      description: "Funcionalidade hierárquica em 3 níveis com navegação autônoma do agente",
      icon: Layers,
      badge: "3 Níveis",
    },
    {
      href: "/dashboard/courses",
      resource: "courses",
      title: "Meus Cursos",
      description: "Cursos matriculados, aulas e trilhas de especialização",
      icon: BookOpen,
    },
    {
      href: "/dashboard/certificates",
      resource: "certificates",
      title: "Certificados",
      description: "Certificados de conclusão autenticados dos cursos finalizados",
      icon: Award,
    },
    {
      href: "/dashboard/progress",
      resource: "progress",
      title: "Meu Progresso",
      description: "Métricas detalhadas de evolução, horas e pontuações",
      icon: BarChart3,
    },
    {
      href: "/dashboard/profile",
      resource: "profile",
      title: "Meu Perfil",
      description: "Gerenciamento de dados cadastrais e avatar",
      icon: User,
    },
    {
      href: "/dashboard/settings",
      resource: "settings",
      title: "Configurações",
      description: "Preferências de notificação, tema e segurança da conta",
      icon: Settings,
    },
  ];

  const portfolioNavItems = [
    {
      href: "/mcp-inspector",
      title: "MCP Inspector",
      icon: TerminalSquare,
      badge: "DevConsole",
    },
    {
      href: "/architecture",
      title: "Arquitetura",
      icon: Network,
      badge: "Layers",
    },
    {
      href: "/observability",
      title: "Observabilidade",
      icon: Activity,
      badge: "Telemetry",
    },
    {
      href: "/how-it-works",
      title: "Como Funciona o MCP",
      icon: Compass,
      badge: "Guia",
    },
    {
      href: "/technical",
      title: "Deep-Dive Técnico",
      icon: Cpu,
      badge: "Engenharia",
    },
    {
      href: "/ai-test",
      title: "Teste Gemini Nano",
      icon: Sparkles,
      badge: "Nano Local",
    },
    {
      href: "/docs",
      title: "Documentação",
      icon: FileCode2,
      badge: "Spec",
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-xl flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Brand Navigation Section */}
      <div className="p-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200 tracking-wide">AI Navigation Layer</div>
            <div className="text-[10px] text-blue-400 font-mono">Semantic DOM + MCP</div>
          </div>
        </div>
      </div>

      {/* Main Student Navigation (Equipped with MCP Navigation semantic attributes) */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Plataforma de Ensino
        </div>

        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <MCPNavigation
              key={item.href}
              href={item.href}
              resource={item.resource}
              title={item.title}
              description={item.description}
              access="student"
              parent="dashboard"
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {item.badge}
                </span>
              )}
            </MCPNavigation>
          );
        })}

        {/* Secretaria Acadêmica Hierarchical Navigation (3 Níveis com Submenus) */}
        <div className="pt-1.5 pb-1">
          <div className="flex items-center justify-between rounded-xl">
            <MCPNavigation
              href="/dashboard/secretaria"
              resource="secretaria"
              title="Secretaria Acadêmica"
              description="Central da Secretaria: matrícula, rematrícula e grade de disciplinas curriculares"
              access="student"
              parent="dashboard"
              className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname.startsWith("/dashboard/secretaria") && pathname === "/dashboard/secretaria"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold shadow-sm"
                  : pathname.startsWith("/dashboard/secretaria")
                  ? "text-blue-300 font-semibold bg-slate-900/60"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className={`w-4 h-4 ${pathname.startsWith("/dashboard/secretaria") ? "text-blue-400" : "text-slate-400"}`} />
                <span>Secretaria</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                3 Níveis
              </span>
            </MCPNavigation>

            <button
              type="button"
              onClick={() => setSecretariaOpen(!secretariaOpen)}
              className="p-2 ml-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title={secretariaOpen ? "Recolher submenus da Secretaria" : "Expandir submenus da Secretaria"}
            >
              {secretariaOpen ? <ChevronDown className="w-4 h-4 text-blue-400" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Submenus Nível 2 */}
          {secretariaOpen && (
            <div className="ml-4 pl-3 border-l border-slate-800 space-y-1 my-1 animate-in fade-in duration-200">
              {/* Matrícula (Nível 2) */}
              <MCPNavigation
                href="/dashboard/secretaria/matricula"
                resource="secretaria_matricula"
                title="Matrícula de Alunos"
                description="Formulário de ingresso e matrícula de alunos"
                access="student"
                parent="secretaria"
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                  pathname === "/dashboard/secretaria/matricula"
                    ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Matrícula</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400">Nível 2</span>
              </MCPNavigation>

              {/* Rematrícula (Nível 2) */}
              <MCPNavigation
                href="/dashboard/secretaria/rematricula"
                resource="secretaria_rematricula"
                title="Rematrícula Periódica"
                description="Renovação semestral de matrícula"
                access="student"
                parent="secretaria"
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                  pathname === "/dashboard/secretaria/rematricula"
                    ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Rematrícula</span>
                </div>
                <span className="text-[9px] font-mono text-amber-400">Nível 2</span>
              </MCPNavigation>

              {/* Disciplinas (Nível 2 com submenu para Nível 3) */}
              <div>
                <div className="flex items-center justify-between rounded-lg">
                  <MCPNavigation
                    href="/dashboard/secretaria/disciplinas"
                    resource="secretaria_disciplinas"
                    title="Grade de Disciplinas"
                    description="Subpágina intermediária de catálogo de disciplinas"
                    access="student"
                    parent="secretaria"
                    className={`flex-1 flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                      pathname === "/dashboard/secretaria/disciplinas"
                        ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>Disciplinas</span>
                    </div>
                    <span className="text-[9px] font-mono text-purple-400">Nível 2</span>
                  </MCPNavigation>

                  <button
                    type="button"
                    onClick={() => setDisciplinasOpen(!disciplinasOpen)}
                    className="p-1 text-slate-500 hover:text-purple-300 transition"
                    title={disciplinasOpen ? "Recolher disciplinas" : "Expandir disciplinas"}
                  >
                    {disciplinasOpen ? <ChevronDown className="w-3.5 h-3.5 text-purple-400" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Submenus Nível 3 (Dentro de Disciplinas) */}
                {disciplinasOpen && (
                  <div className="ml-3 pl-2.5 border-l border-purple-800/40 space-y-1 my-1 animate-in fade-in duration-150">
                    <MCPNavigation
                      href="/dashboard/secretaria/disciplinas/matematica"
                      resource="secretaria_disciplina_matematica"
                      title="Disciplina Matemática"
                      description="Ementa e notas de Matemática"
                      access="student"
                      parent="secretaria_disciplinas"
                      className={`flex items-center justify-between px-2 py-1 rounded text-[11px] transition ${
                        pathname === "/dashboard/secretaria/disciplinas/matematica"
                          ? "bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-900"
                      }`}
                    >
                      <span>📐 Matemática</span>
                      <span className="text-[8px] font-mono text-blue-400">N3</span>
                    </MCPNavigation>

                    <MCPNavigation
                      href="/dashboard/secretaria/disciplinas/portugues"
                      resource="secretaria_disciplina_portugues"
                      title="Disciplina Português"
                      description="Ementa e redação de Português"
                      access="student"
                      parent="secretaria_disciplinas"
                      className={`flex items-center justify-between px-2 py-1 rounded text-[11px] transition ${
                        pathname === "/dashboard/secretaria/disciplinas/portugues"
                          ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-900"
                      }`}
                    >
                      <span>✍️ Português</span>
                      <span className="text-[8px] font-mono text-emerald-400">N3</span>
                    </MCPNavigation>

                    <MCPNavigation
                      href="/dashboard/secretaria/disciplinas/ciencias"
                      resource="secretaria_disciplina_ciencias"
                      title="Disciplina Ciências"
                      description="Laboratórios de Ciências"
                      access="student"
                      parent="secretaria_disciplinas"
                      className={`flex items-center justify-between px-2 py-1 rounded text-[11px] transition ${
                        pathname === "/dashboard/secretaria/disciplinas/ciencias"
                          ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-900"
                      }`}
                    >
                      <span>🧪 Ciências</span>
                      <span className="text-[8px] font-mono text-purple-400">N3</span>
                    </MCPNavigation>

                    <MCPNavigation
                      href="/dashboard/secretaria/disciplinas/historia"
                      resource="secretaria_disciplina_historia"
                      title="Disciplina História"
                      description="História contemporânea"
                      access="student"
                      parent="secretaria_disciplinas"
                      className={`flex items-center justify-between px-2 py-1 rounded text-[11px] transition ${
                        pathname === "/dashboard/secretaria/disciplinas/historia"
                          ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-900"
                      }`}
                    >
                      <span>🏛️ História</span>
                      <span className="text-[8px] font-mono text-amber-400">N3</span>
                    </MCPNavigation>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role-Specific Demonstrations */}
        <div className="pt-4 px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Ações com Controle de Acesso
        </div>

        {/* Create Course Link (Requires Teacher) */}
        <MCPNavigation
          href="/dashboard/courses/new"
          resource="create_course"
          title="Criar Curso"
          description="Cadastrar novos cursos e módulos didáticos (requer perfil professor)"
          access="teacher"
          parent="courses"
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            pathname === "/dashboard/courses/new"
              ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
          }`}
        >
          <div className="flex items-center gap-3">
            <PlusCircle className="w-4 h-4 text-purple-400" />
            <span>Criar Curso</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Prof
          </span>
        </MCPNavigation>

        {/* Student Registration Link (Requires Teacher) */}
        <MCPNavigation
          href="/dashboard/students/new"
          resource="student_registration"
          title="Cadastrar Aluno"
          description="Formulário inteligente de matrícula com guardrails para agentes de IA (requer perfil professor)"
          access="teacher"
          parent="dashboard"
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            pathname === "/dashboard/students/new"
              ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
          }`}
        >
          <div className="flex items-center gap-3">
            <UserPlus className="w-4 h-4 text-purple-400" />
            <span>Cadastrar Aluno</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Prof
          </span>
        </MCPNavigation>

        {/* Admin Panel Link (Requires Admin) */}
        <MCPNavigation
          href="/dashboard/admin"
          resource="admin_panel"
          title="Painel Admin"
          description="Gestão de usuários e relatórios globais (requer perfil admin)"
          access="admin"
          parent="dashboard"
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            pathname === "/dashboard/admin"
              ? "bg-amber-600/20 text-amber-400 border border-amber-500/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
          }`}
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Painel Admin</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Admin
          </span>
        </MCPNavigation>

        {/* Portfolio Tools & Developer Showcase */}
        <div className="pt-4 px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Portfólio & Engenharia
        </div>

        {portfolioNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                <span>{item.title}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {item.badge}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Role Indicator Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400">Perfil Ativo:</div>
            <div className="text-xs font-bold text-slate-200 capitalize">{role}</div>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>
    </aside>
  );
};
