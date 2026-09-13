"use client";

import React from "react";
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
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { role } = useAuth();

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
      href: "/dashboard/students/new",
      resource: "student_registration",
      title: "Cadastrar Aluno",
      description: "Formulário inteligente de matrícula com guardrails para agentes de IA",
      icon: UserPlus,
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
