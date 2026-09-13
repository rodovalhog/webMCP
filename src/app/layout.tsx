import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AIProvider } from "@/context/AIContext";
import { ChatWidget } from "@/components/ai/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LearnFlow AI — Web MCP Semantic Navigator",
  description:
    "AI Navigation Layer: Model Context Protocol (MCP) Semantic DOM integration for intelligent, safe, and observable web navigation.",
};

import { WebMCPRegistration } from "@/components/mcp/WebMCPRegistration";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full dark`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var toolsCatalog = [
                  { name: 'ver_certificados', desc: 'Central de certificados emitidos de todos os cursos concluídos', route: '/dashboard/certificates' },
                  { name: 'ver_certificado_react', desc: 'Acessar certificado oficial e verificado do curso React Avançado', route: '/dashboard/courses/react-avancado/certificate' },
                  { name: 'meus_cursos', desc: 'Listar catálogo e cursos matriculados pelo aluno', route: '/dashboard/courses' },
                  { name: 'abrir_curso_react', desc: 'Acessar curso React Avançado: Concorrência, RSC e Hooks', route: '/dashboard/courses/react-avancado' },
                  { name: 'abrir_curso_nextjs', desc: 'Acessar curso Next.js 15 & Arquitetura Web moderna', route: '/dashboard/courses/nextjs-architecture' },
                  { name: 'continuar_aula', desc: 'Continuar a última aula em andamento (React Avançado - 72%)', route: '/dashboard/courses/react-avancado?lesson=hooks-avancados' },
                  { name: 'ver_meu_progresso', desc: 'Visualizar estatísticas de progresso, horas dedicadas e ofensiva', route: '/dashboard/progress' },
                  { name: 'abrir_exercicios', desc: 'Acessar laboratório de exercícios práticos e desafios interativos', route: '/dashboard/courses/react-avancado?tab=exercises' },
                  { name: 'fazer_avaliacao_final', desc: 'Iniciar avaliação final e prova para emissão de certificado', route: '/dashboard/courses/react-avancado?tab=assessment' },
                  { name: 'editar_perfil', desc: 'Acessar formulário de perfil do aluno, avatar e biografia', route: '/dashboard/profile' },
                  { name: 'configuracoes', desc: 'Configurações da conta, preferências e chaves de API da IA', route: '/dashboard/settings' },
                  { name: 'criar_novo_curso', desc: 'Criar novo curso curricular (permissão de instrutor)', route: '/dashboard/courses/new' },
                  { name: 'painel_admin', desc: 'Painel de controle administrativo global (permissão de admin)', route: '/dashboard/admin' },
                  { name: 'abrir_mcp_inspector', desc: 'Console interativo do Web MCP com mapa semântico e ferramentas', route: '/mcp-inspector' },
                  { name: 'abrir_observabilidade', desc: 'Painel de telemetria em tempo real, métricas e log de eventos', route: '/observability' },
                  { name: 'abrir_arquitetura', desc: 'Visualizar diagrama de arquitetura do sistema em camadas', route: '/architecture' },
                  { name: 'abrir_documentacao', desc: 'Acessar documentação técnica para desenvolvedores', route: '/docs' },
                  { name: 'como_funciona_mcp', desc: 'Explicação passo a passo de como funciona a navegação via Web MCP', route: '/how-it-works' },
                  { name: 'pagina_inicial', desc: 'Retornar à página inicial da plataforma LearnFlow AI', route: '/' }
                ];

                var allTools = [];

                toolsCatalog.forEach(function(item) {
                  allTools.push({
                    name: item.name,
                    description: item.desc,
                    inputSchema: { type: 'object', properties: {} },
                    window: window,
                    async execute() {
                      window.location.href = item.route;
                      return { success: true, navigatedTo: item.route };
                    }
                  });
                });

                allTools.push({
                  name: 'pesquisar_recursos',
                  description: 'Pesquisar recursos semânticos no DOM da aplicação por palavra-chave',
                  inputSchema: {
                    type: 'object',
                    properties: { query: { type: 'string', description: 'Termo de busca (ex: certificado, curso, aula)' } },
                    required: ['query']
                  },
                  window: window,
                  annotations: { readOnlyHint: true },
                  async execute(args) {
                    var q = (args && args.query ? String(args.query).toLowerCase() : '');
                    var matches = toolsCatalog.filter(function(t) {
                      return t.name.toLowerCase().indexOf(q) !== -1 || t.desc.toLowerCase().indexOf(q) !== -1;
                    });
                    return { query: q, totalMatches: matches.length, results: matches };
                  }
                });

                allTools.push({
                  name: 'obter_contexto_aluno',
                  description: 'Retorna informações contextuais do aluno conectado, matrícula ativa e progresso',
                  inputSchema: { type: 'object', properties: {} },
                  window: window,
                  annotations: { readOnlyHint: true },
                  async execute() {
                    return {
                      aluno: 'Guilherme Rodovalho',
                      role: 'student',
                      cursoAtivo: 'React Avançado: Concorrência, RSC e Performance',
                      progresso: 72,
                      proximaAula: 'Hooks Avançados (useTransition, useDeferredValue)',
                      ofensivaDias: 14,
                      horasEstudadas: 38
                    };
                  }
                });

                allTools.push({
                  name: 'navigate_to_resource',
                  description: 'Navegador semântico genérico parametrizado por resourceId',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      resourceId: { type: 'string', description: 'ID do recurso (certificates, courses, progress, settings, profile, assessment)' },
                      courseId: { type: 'string', description: 'ID opcional do curso' }
                    },
                    required: ['resourceId']
                  },
                  window: window,
                  async execute(args) {
                    var map = {
                      certificates: '/dashboard/certificates',
                      course_certificate: '/dashboard/courses/react-avancado/certificate',
                      courses: '/dashboard/courses',
                      progress: '/dashboard/progress',
                      profile: '/dashboard/profile',
                      settings: '/dashboard/settings',
                      admin_panel: '/dashboard/admin',
                      mcp_inspector: '/mcp-inspector',
                      observability: '/observability',
                      architecture: '/architecture',
                      docs: '/docs',
                      how_it_works: '/how-it-works'
                    };
                    var target = (args && map[args.resourceId]) || '/dashboard';
                    window.location.href = target;
                    return { success: true, target: target };
                  }
                });

                function syncModelContext() {
                  if (typeof document === 'undefined') return;

                  if (!document.modelContext) {
                    document.modelContext = {
                      async getTools() { return allTools; },
                      async executeTool(tool, args) {
                        var match = allTools.find(function(t) { return t.name === tool.name; });
                        if (match && typeof match.execute === 'function') {
                          return await match.execute(args || {});
                        }
                        return null;
                      },
                      registerTool(tool) {
                        allTools.push(tool);
                        if (typeof this.ontoolchange === 'function') this.ontoolchange();
                      }
                    };
                  }

                  if (typeof document.modelContext.registerTool === 'function') {
                    allTools.forEach(function(t) {
                      try {
                        document.modelContext.registerTool(t);
                      } catch (e) {
                        // ignore duplicate
                      }
                    });
                  }

                  if (typeof document.modelContext.ontoolchange === 'function') {
                    try { document.modelContext.ontoolchange(); } catch(e) {}
                  }
                }

                syncModelContext();
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', syncModelContext);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {/* Declarative WebMCP Forms for native Blink C++ Parser & WebMCP Extensions */}
        <div
          style={{ display: "none" }}
          aria-hidden="true"
          id="webmcp-declarative-registry"
          dangerouslySetInnerHTML={{
            __html: `
              <form toolname="ver_certificados" tooldescription="Central de certificados emitidos de todos os cursos concluídos" action="/dashboard/certificates" method="get" toolautosubmit></form>
              <form toolname="ver_certificado_react" tooldescription="Acessar certificado oficial e verificado do curso React Avançado" action="/dashboard/courses/react-avancado/certificate" method="get" toolautosubmit></form>
              <form toolname="meus_cursos" tooldescription="Listar catálogo e cursos matriculados pelo aluno" action="/dashboard/courses" method="get" toolautosubmit></form>
              <form toolname="abrir_curso_react" tooldescription="Acessar curso React Avançado: Concorrência, RSC e Hooks" action="/dashboard/courses/react-avancado" method="get" toolautosubmit></form>
              <form toolname="abrir_curso_nextjs" tooldescription="Acessar curso Next.js 15 & Arquitetura Web moderna" action="/dashboard/courses/nextjs-architecture" method="get" toolautosubmit></form>
              <form toolname="continuar_aula" tooldescription="Continuar a última aula em andamento (React Avançado - 72%)" action="/dashboard/courses/react-avancado?lesson=hooks-avancados" method="get" toolautosubmit></form>
              <form toolname="ver_meu_progresso" tooldescription="Visualizar estatísticas de progresso, horas dedicadas e ofensiva" action="/dashboard/progress" method="get" toolautosubmit></form>
              <form toolname="abrir_exercicios" tooldescription="Acessar laboratório de exercícios práticos e desafios interativos" action="/dashboard/courses/react-avancado?tab=exercises" method="get" toolautosubmit></form>
              <form toolname="fazer_avaliacao_final" tooldescription="Iniciar avaliação final e prova para emissão de certificado" action="/dashboard/courses/react-avancado?tab=assessment" method="get" toolautosubmit></form>
              <form toolname="editar_perfil" tooldescription="Acessar formulário de perfil do aluno, avatar e biografia" action="/dashboard/profile" method="get" toolautosubmit></form>
              <form toolname="configuracoes" tooldescription="Configurações da conta, preferências e chaves de API da IA" action="/dashboard/settings" method="get" toolautosubmit></form>
              <form toolname="criar_novo_curso" tooldescription="Criar novo curso curricular (permissão de instrutor)" action="/dashboard/courses/new" method="get" toolautosubmit></form>
              <form toolname="painel_admin" tooldescription="Painel de controle administrativo global (permissão de admin)" action="/dashboard/admin" method="get" toolautosubmit></form>
              <form toolname="abrir_mcp_inspector" tooldescription="Console interativo do Web MCP com mapa semântico e ferramentas" action="/mcp-inspector" method="get" toolautosubmit></form>
              <form toolname="abrir_observabilidade" tooldescription="Painel de telemetria em tempo real, métricas e log de eventos" action="/observability" method="get" toolautosubmit></form>
              <form toolname="abrir_arquitetura" tooldescription="Visualizar diagrama de arquitetura do sistema em camadas" action="/architecture" method="get" toolautosubmit></form>
              <form toolname="abrir_documentacao" tooldescription="Acessar documentação técnica para desenvolvedores" action="/docs" method="get" toolautosubmit></form>
              <form toolname="como_funciona_mcp" tooldescription="Explicação passo a passo de como funciona a navegação via Web MCP" action="/how-it-works" method="get" toolautosubmit></form>
              <form toolname="pagina_inicial" tooldescription="Retornar à página inicial da plataforma LearnFlow AI" action="/" method="get" toolautosubmit></form>
            `,
          }}
        />

        <AuthProvider>
          <AIProvider>
            <WebMCPRegistration />
            {children}
            <ChatWidget />
          </AIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
