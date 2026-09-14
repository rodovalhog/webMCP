"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { mcpServer } from "@/lib/mcp/server";
import { resolveSafeRoute } from "@/lib/navigation/registry";
import { highlightMCPResource } from "@/lib/mcp-dom/highlighter";
import { useAuth } from "@/context/AuthContext";
import { checkPermission } from "@/lib/mcp/permissions";

interface WebMCPToolDef {
  name: string;
  description: string;
  targetRoute?: string;
  resourceId?: string;
  inputSchema?: Record<string, unknown>;
  execute?: (args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * WebMCPRegistration
 * Exposes ALL platform resources as individual tools to the WebMCP Chrome Extension
 * and the browser's document.modelContext standard.
 */
export function WebMCPRegistration() {
  const router = useRouter();
  const { role } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    // Direct navigation helper with RBAC permission gate
    const navigateTo = (route: string, resId?: string) => {
      if (resId) {
        const check = checkPermission(role, resId, "navigate");
        if (!check.allowed) {
          console.warn(`[WebMCPRegistration] Acesso bloqueado para perfil '${role}' no recurso '${resId}': ${check.reason}`);
          return { success: false, authorized: false, reason: check.reason };
        }
        highlightMCPResource(resId);
      }
      router.push(route);
      setTimeout(() => {
        if (resId) highlightMCPResource(resId);
      }, 400);
      return { success: true, navigatedTo: route };
    };

    // Full catalog of all 18 platform resources as dedicated tools
    const toolDefinitions: WebMCPToolDef[] = [
      {
        name: "ver_certificados",
        description: "Visualizar central com todos os certificados emitidos dos cursos concluídos",
        targetRoute: "/dashboard/certificates",
        resourceId: "certificates",
      },
      {
        name: "ver_certificado_react",
        description: "Abrir certificado oficial e verificado do curso React Avançado",
        targetRoute: "/dashboard/courses/react-avancado/certificate",
        resourceId: "course_certificate",
      },
      {
        name: "meus_cursos",
        description: "Visualizar catálogo e cursos matriculados na plataforma",
        targetRoute: "/dashboard/courses",
        resourceId: "courses",
      },
      {
        name: "abrir_curso_react",
        description: "Acessar curso React Avançado: Hooks, Concorrência, Performance e RSC",
        targetRoute: "/dashboard/courses/react-avancado",
        resourceId: "course_react-avancado",
      },
      {
        name: "abrir_curso_nextjs",
        description: "Acessar curso Next.js 15 & Arquitetura Web moderna",
        targetRoute: "/dashboard/courses/nextjs-architecture",
        resourceId: "course_nextjs-architecture",
      },
      {
        name: "continuar_aula",
        description: "Continuar a última aula em andamento (React Avançado - Hooks Avançados 72%)",
        targetRoute: "/dashboard/courses/react-avancado?lesson=hooks-avancados",
        resourceId: "continue_lesson",
      },
      {
        name: "ver_meu_progresso",
        description: "Acessar estatísticas de progresso, horas dedicadas e ofensiva diária",
        targetRoute: "/dashboard/progress",
        resourceId: "progress",
      },
      {
        name: "abrir_exercicios",
        description: "Abrir laboratório de exercícios práticos e desafios interativos",
        targetRoute: "/dashboard/courses/react-avancado?tab=exercises",
        resourceId: "exercises",
      },
      {
        name: "fazer_avaliacao_final",
        description: "Iniciar prova prática e teórica para emissão do certificado",
        targetRoute: "/dashboard/courses/react-avancado?tab=assessment",
        resourceId: "assessment",
      },
      {
        name: "editar_perfil",
        description: "Acessar formulário de perfil do aluno, avatar e biografia",
        targetRoute: "/dashboard/profile",
        resourceId: "profile",
      },
      {
        name: "configuracoes",
        description: "Configurações da conta, preferências de notificação e IA",
        targetRoute: "/dashboard/settings",
        resourceId: "settings",
      },
      {
        name: "criar_novo_curso",
        description: "Criar novo curso curricular (exige permissão de instrutor)",
        targetRoute: "/dashboard/courses/new",
        resourceId: "create_course",
      },
      {
        name: "painel_admin",
        description: "Painel de controle global (exige permissão de administrador)",
        targetRoute: "/dashboard/admin",
        resourceId: "admin_panel",
      },
      {
        name: "abrir_mcp_inspector",
        description: "Abrir console de desenvolvedor e inspeção do Semantic DOM",
        targetRoute: "/mcp-inspector",
        resourceId: "mcp_inspector",
      },
      {
        name: "abrir_observabilidade",
        description: "Abrir painel de telemetria em tempo real e log de navegações da IA",
        targetRoute: "/observability",
        resourceId: "observability",
      },
      {
        name: "abrir_arquitetura",
        description: "Visualizar diagrama de arquitetura do sistema em camadas",
        targetRoute: "/architecture",
        resourceId: "architecture",
      },
      {
        name: "abrir_documentacao",
        description: "Acessar documentação técnica para desenvolvedores",
        targetRoute: "/docs",
        resourceId: "docs",
      },
      {
        name: "como_funciona_mcp",
        description: "Explicação passo a passo de como funciona a navegação via Web MCP",
        targetRoute: "/how-it-works",
        resourceId: "how_it_works",
      },
      {
        name: "explicacao_tecnica_projeto",
        description: "Explicação técnica profunda da arquitetura do projeto Web MCP, engenharia, RBAC e protocolos",
        targetRoute: "/technical",
        resourceId: "technical",
      },
      {
        name: "teste_gemini_nano",
        description: "Console interativo de teste local do Gemini Nano / Chrome Built-in AI",
        targetRoute: "/ai-test",
        resourceId: "ai_test",
      },
      {
        name: "pagina_inicial",
        description: "Retornar à página inicial da plataforma LearnFlow AI",
        targetRoute: "/",
        resourceId: "home",
      },
      {
        name: "secretaria_academica",
        description: "Acessar a central unificada da Secretaria Acadêmica (Nível 1)",
        targetRoute: "/dashboard/secretaria",
        resourceId: "secretaria",
      },
      {
        name: "secretaria_matricula",
        description: "Acessar a página de Matrícula Regular da Secretaria Acadêmica (Nível 2)",
        targetRoute: "/dashboard/secretaria/matricula",
        resourceId: "secretaria_matricula",
      },
      {
        name: "secretaria_rematricula",
        description: "Acessar a página de Rematrícula Semestral e Renovação (Nível 2)",
        targetRoute: "/dashboard/secretaria/rematricula",
        resourceId: "secretaria_rematricula",
      },
      {
        name: "secretaria_disciplinas",
        description: "Acessar o catálogo e grade curricular de Disciplinas da Secretaria (Nível 2)",
        targetRoute: "/dashboard/secretaria/disciplinas",
        resourceId: "secretaria_disciplinas",
      },
      {
        name: "secretaria_disciplina_matematica",
        description: "Acessar a disciplina de Matemática e Cálculo Diferencial (Nível 3)",
        targetRoute: "/dashboard/secretaria/disciplinas/matematica",
        resourceId: "secretaria_disciplina_matematica",
      },
      {
        name: "secretaria_disciplina_portugues",
        description: "Acessar a disciplina de Língua Portuguesa e Comunicação Técnica (Nível 3)",
        targetRoute: "/dashboard/secretaria/disciplinas/portugues",
        resourceId: "secretaria_disciplina_portugues",
      },
      {
        name: "secretaria_disciplina_ciencias",
        description: "Acessar a disciplina de Ciências da Natureza e Laboratórios (Nível 3)",
        targetRoute: "/dashboard/secretaria/disciplinas/ciencias",
        resourceId: "secretaria_disciplina_ciencias",
      },
      {
        name: "secretaria_disciplina_historia",
        description: "Acessar a disciplina de História e Humanidades (Nível 3)",
        targetRoute: "/dashboard/secretaria/disciplinas/historia",
        resourceId: "secretaria_disciplina_historia",
      },
      {
        name: "pesquisar_recursos",
        description: "Pesquisa recursos no DOM semântico por palavra-chave",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Termo de busca" },
          },
          required: ["query"],
        },
        execute: async (args: Record<string, unknown>) => {
          return await mcpServer.searchResources({ query: String(args.query || ""), role });
        },
      },
      {
        name: "obter_contexto_aluno",
        description: "Retorna dados do aluno ativo, curso atual e progresso",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          return await mcpServer.getCurrentContext();
        },
      },
      {
        name: "navigate_to_resource",
        description: "Navegação genérica parametrizada por resourceId",
        inputSchema: {
          type: "object",
          properties: {
            resourceId: { type: "string", description: "ID do recurso de destino" },
            courseId: { type: "string", description: "ID opcional do curso" },
          },
          required: ["resourceId"],
        },
        execute: async (args: Record<string, unknown>) => {
          const resId = String(args.resourceId || "dashboard");
          const target = resolveSafeRoute(resId, args) || "/dashboard";
          return navigateTo(target, resId);
        },
      },
    ];

    // Prepare internal registry
    const registeredTools: Array<{
      name: string;
      description: string;
      inputSchema: Record<string, unknown>;
      execute: (args: Record<string, unknown>) => Promise<unknown>;
      window: Window;
    }> = [];

    toolDefinitions.forEach((td) => {
      registeredTools.push({
        name: td.name,
        description: td.description,
        inputSchema: td.inputSchema || { type: "object", properties: {} },
        execute: td.execute || (async () => navigateTo(td.targetRoute || "/dashboard", td.resourceId)),
        window: window,
      });
    });

    const doc = document as unknown as {
      modelContext?: {
        registerTool?: (tool: unknown) => void;
        getTools?: (opts?: unknown) => Promise<unknown[]>;
        executeTool?: (tool: { name: string }, args: unknown) => Promise<unknown>;
        ontoolchange?: () => void;
      };
    };

    // Ensure document.modelContext exists
    if (!doc.modelContext) {
      doc.modelContext = {
        async getTools() {
          return registeredTools.map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema,
            execute: t.execute,
            window: window,
            annotations: { readOnlyHint: t.name === "pesquisar_recursos" },
          }));
        },
        async executeTool(tool: { name: string }, args: unknown) {
          const match = registeredTools.find((t) => t.name === tool.name);
          if (match) {
            return await match.execute((args || {}) as Record<string, unknown>);
          }
          return null;
        },
        registerTool(tool: unknown) {
          registeredTools.push(tool as typeof registeredTools[0]);
          if (this.ontoolchange) this.ontoolchange();
        },
      };
    }

    // Register all tools into document.modelContext
    const mc = doc.modelContext;
    if (typeof mc.registerTool === "function") {
      registeredTools.forEach((t) => {
        try {
          mc.registerTool!(t);
        } catch {
          // ignore duplicate tool registration
        }
      });
    }

    if (typeof mc.ontoolchange === "function") {
      mc.ontoolchange();
    }

    // Append declarative form tags for any extension scanner mechanism
    const createdForms: HTMLElement[] = [];
    toolDefinitions.forEach((td) => {
      const f = document.createElement("form");
      f.setAttribute("toolname", td.name);
      f.setAttribute("tooldescription", td.description);
      f.style.display = "none";
      document.body.appendChild(f);
      createdForms.push(f);
    });

    return () => {
      createdForms.forEach((f) => f.remove());
    };
  }, [router, role]);

  return null;
}
