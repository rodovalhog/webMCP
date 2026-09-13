import { AccessLevel, MCPActionType, SemanticResource, SemanticResourceMap, SemanticTreeNode } from "../mcp/types";

/**
 * Fallback semantic catalogue covering platform structure even prior to DOM hydration.
 * Provides resilient semantic definitions that match the platform structure.
 */
export const FALLBACK_SEMANTIC_RESOURCES: SemanticResourceMap = {
  dashboard: {
    id: "dashboard",
    resource: "dashboard",
    action: "navigate",
    description: "Painel principal do aluno com resumo de cursos, métricas e progresso",
    target: "/dashboard",
    access: "student",
    breadcrumbs: ["Dashboard"],
  },
  my_courses: {
    id: "my_courses",
    resource: "courses",
    action: "navigate",
    description: "Lista de cursos matriculados e catálogo geral de aprendizado",
    target: "/dashboard/courses",
    access: "student",
    parent: "dashboard",
    breadcrumbs: ["Dashboard", "Meus cursos"],
  },
  react_advanced: {
    id: "course_react-avancado",
    resource: "course",
    resourceId: "react-avancado",
    action: "open",
    description: "Curso de React Avançado: Hooks, Server Components, State Management e Performance",
    target: "/dashboard/courses/react-avancado",
    access: "student",
    parent: "my_courses",
    breadcrumbs: ["Dashboard", "Meus cursos", "React Avançado"],
    context: {
      courseId: "react-avancado",
      title: "React Avançado",
      progress: 72,
      lastLesson: "Hooks avançados",
    },
  },
  react_certificate: {
    id: "certificate_react-avancado",
    resource: "course_certificate",
    resourceId: "react-avancado",
    action: "view",
    description: "Certificado de conclusão emitido do curso React Avançado com autenticação digital",
    target: "/dashboard/courses/react-avancado/certificate",
    access: "student",
    parent: "react_advanced",
    breadcrumbs: ["Dashboard", "Meus cursos", "React Avançado", "Certificado"],
    context: { courseId: "react-avancado" },
  },
  certificates: {
    id: "certificates",
    resource: "certificates",
    action: "navigate",
    description: "Central de todos os certificados de cursos e avaliações concluídos",
    target: "/dashboard/certificates",
    access: "student",
    parent: "dashboard",
    breadcrumbs: ["Dashboard", "Certificados"],
  },
  progress: {
    id: "progress",
    resource: "progress",
    action: "navigate",
    description: "Métricas de progresso, horas de estudo, ofensiva diária e pontuação",
    target: "/dashboard/progress",
    access: "student",
    parent: "dashboard",
    breadcrumbs: ["Dashboard", "Meu progresso"],
  },
  continue_lesson: {
    id: "continue_lesson",
    resource: "continue_lesson",
    resourceId: "react-avancado",
    action: "execute",
    description: "Continuar a última aula em andamento (React Avançado - Hooks Avançados)",
    target: "/dashboard/courses/react-avancado?lesson=hooks-avancados",
    access: "student",
    parent: "react_advanced",
    breadcrumbs: ["Dashboard", "Meus cursos", "React Avançado", "Continuar aula"],
    context: {
      courseId: "react-avancado",
      lessonId: "hooks-avancados",
      lessonTitle: "Hooks avançados",
    },
  },
  profile: {
    id: "profile",
    resource: "profile",
    action: "navigate",
    description: "Visualizar e alterar perfil do usuário, nome, email, avatar e bio",
    target: "/dashboard/profile",
    access: "student",
    parent: "dashboard",
    breadcrumbs: ["Dashboard", "Perfil"],
  },
  settings: {
    id: "settings",
    resource: "settings",
    action: "navigate",
    description: "Configurações de preferências da conta, notificações e tema",
    target: "/dashboard/settings",
    access: "student",
    parent: "dashboard",
    breadcrumbs: ["Dashboard", "Configurações"],
  },
  create_course: {
    id: "create_course",
    resource: "create_course",
    action: "create",
    description: "Criar novo curso, cadastrar módulos e aulas (restrito a professores/admins)",
    target: "/dashboard/courses/new",
    access: "teacher",
    parent: "my_courses",
    breadcrumbs: ["Dashboard", "Meus cursos", "Criar curso"],
  },
  admin_panel: {
    id: "admin_panel",
    resource: "admin_panel",
    action: "navigate",
    description: "Painel administrativo de gerenciamento de alunos, relatórios e métricas da plataforma",
    target: "/dashboard/admin",
    access: "admin",
    parent: "dashboard",
    breadcrumbs: ["Dashboard", "Administração"],
  },
  ai_test: {
    id: "ai_test",
    resource: "ai_test",
    action: "navigate",
    description: "Console de teste local e diagnóstico do Gemini Nano / Chrome Built-in AI",
    target: "/ai-test",
    access: "public",
    parent: "dashboard",
    breadcrumbs: ["Dashboard", "Gemini Nano Test"],
  },
  technical: {
    id: "technical",
    resource: "technical",
    action: "navigate",
    description: "Deep-dive técnico e especificações de engenharia do Web MCP",
    target: "/technical",
    access: "public",
    parent: "dashboard",
    breadcrumbs: ["Dashboard", "Deep-Dive Técnico"],
  },
  how_it_works: {
    id: "how_it_works",
    resource: "how_it_works",
    action: "navigate",
    description: "Guia interativo didático passo a passo de funcionamento do Web MCP",
    target: "/how-it-works",
    access: "public",
    parent: "dashboard",
    breadcrumbs: ["Dashboard", "Como Funciona"],
  },
  student_registration: {
    id: "student_registration",
    resource: "student_registration",
    action: "create",
    description: "Formulário de cadastro de aluno com suporte a preenchimento semântico por IA e guardrails MCP",
    target: "/dashboard/students/new",
    access: "student",
    parent: "dashboard",
    breadcrumbs: ["Dashboard", "Cadastrar Aluno"],
  },
  // ==============================================================
  // FUNCIONALIDADE HIERÁRQUICA EM 3 NÍVEIS: TRILHAS DE ESPECIALIZAÇÃO
  // ==============================================================
  // NÍVEL 1: Macro Funcionalidade (Trilha Principal)
  academy_tracks: {
    id: "academy_tracks",
    resource: "academy_tracks",
    action: "navigate",
    description: "Central de Trilhas de Especialização em Engenharia de Software e Inteligência Artificial",
    target: "/dashboard/tracks",
    access: "student",
    parent: "dashboard",
    breadcrumbs: ["Dashboard", "Trilhas de Especialização"],
  },
  // NÍVEL 2: Subfuncionalidades (Módulos da Trilha)
  track_mcp_architecture: {
    id: "track_mcp_architecture",
    resource: "track_mcp_architecture",
    action: "open",
    description: "Módulo 1: Arquitetura Frontend & Protocolo Web MCP no Navegador",
    target: "/dashboard/tracks?module=mcp-architecture",
    access: "student",
    parent: "academy_tracks",
    breadcrumbs: ["Dashboard", "Trilhas de Especialização", "Módulo Web MCP"],
  },
  track_vision_multimodal: {
    id: "track_vision_multimodal",
    resource: "track_vision_multimodal",
    action: "open",
    description: "Módulo 2: Visão Computacional & IA Multimodal com Gemini",
    target: "/dashboard/tracks?module=vision-multimodal",
    access: "student",
    parent: "academy_tracks",
    breadcrumbs: ["Dashboard", "Trilhas de Especialização", "Módulo Visão Multimodal"],
  },
  track_governance_rbac: {
    id: "track_governance_rbac",
    resource: "track_governance_rbac",
    action: "open",
    description: "Módulo 3: Governança de Agentes, RBAC & Telemetria em Tempo Real",
    target: "/dashboard/tracks?module=governance-rbac",
    access: "student",
    parent: "academy_tracks",
    breadcrumbs: ["Dashboard", "Trilhas de Especialização", "Módulo Governança & RBAC"],
  },
  // NÍVEL 3: Sub-subfuncionalidades / Ações Específicas do Módulo Web MCP
  track_mcp_scanner_lab: {
    id: "track_mcp_scanner_lab",
    resource: "track_mcp_scanner_lab",
    action: "execute",
    description: "Laboratório de Scanner Semântico: inspecione e valide tags data-mcp no DOM",
    target: "/dashboard/tracks?module=mcp-architecture&section=scanner-lab",
    access: "student",
    parent: "track_mcp_architecture",
    breadcrumbs: ["Dashboard", "Trilhas de Especialização", "Módulo Web MCP", "Scanner Semântico DOM"],
  },
  track_mcp_orchestrator: {
    id: "track_mcp_orchestrator",
    resource: "track_mcp_orchestrator",
    action: "execute",
    description: "Simulador de Orquestração: teste a conversão de linguagem natural em chamadas de ferramentas",
    target: "/dashboard/tracks?module=mcp-architecture&section=orchestrator",
    access: "student",
    parent: "track_mcp_architecture",
    breadcrumbs: ["Dashboard", "Trilhas de Especialização", "Módulo Web MCP", "Orquestrador de Ferramentas"],
  },
  track_mcp_visual_pulse: {
    id: "track_mcp_visual_pulse",
    resource: "track_mcp_visual_pulse",
    action: "execute",
    description: "Simulador de Pulso Visual: teste o feedback visual e a navegação autônoma em tempo real",
    target: "/dashboard/tracks?module=mcp-architecture&section=visual-pulse",
    access: "student",
    parent: "track_mcp_architecture",
    breadcrumbs: ["Dashboard", "Trilhas de Especialização", "Módulo Web MCP", "Pulso Visual Autônomo"],
  },
  // NÍVEL 3: Sub-subfuncionalidades do Módulo Visão Multimodal
  track_vision_pipeline: {
    id: "track_vision_pipeline",
    resource: "track_vision_pipeline",
    action: "execute",
    description: "Pipeline de Ingestão de Documentos: fluxo de upload e codificação Base64 inline_data",
    target: "/dashboard/tracks?module=vision-multimodal&section=document-pipeline",
    access: "student",
    parent: "track_vision_multimodal",
    breadcrumbs: ["Dashboard", "Trilhas de Especialização", "Módulo Visão Multimodal", "Pipeline de Documentos"],
  },
  track_vision_prompt_studio: {
    id: "track_vision_prompt_studio",
    resource: "track_vision_prompt_studio",
    action: "execute",
    description: "Prompt Studio para OCR: engenharia de prompts para extração de campos estruturados",
    target: "/dashboard/tracks?module=vision-multimodal&section=prompt-studio",
    access: "student",
    parent: "track_vision_multimodal",
    breadcrumbs: ["Dashboard", "Trilhas de Especialização", "Módulo Visão Multimodal", "Prompt Studio OCR"],
  },
  track_vision_student_extractor: {
    id: "track_vision_student_extractor",
    resource: "track_vision_student_extractor",
    action: "execute",
    description: "Extrator Automático de Aluno: extração óptica de dados de CNH e RG para cadastro",
    target: "/dashboard/tracks?module=vision-multimodal&section=student-extractor",
    access: "student",
    parent: "track_vision_multimodal",
    breadcrumbs: ["Dashboard", "Trilhas de Especialização", "Módulo Visão Multimodal", "Extrator de Aluno via IA"],
  },
  // NÍVEL 3: Sub-subfuncionalidades do Módulo Governança & RBAC
  track_rbac_guardrails: {
    id: "track_rbac_guardrails",
    resource: "track_rbac_guardrails",
    action: "view",
    description: "Matriz de Guardrails: regras de permissão e bloqueio de ações não autorizadas",
    target: "/dashboard/tracks?module=governance-rbac&section=guardrails-matrix",
    access: "student",
    parent: "track_governance_rbac",
    breadcrumbs: ["Dashboard", "Trilhas de Especialização", "Módulo Governança & RBAC", "Matriz de Guardrails"],
  },
  track_rbac_telemetry: {
    id: "track_rbac_telemetry",
    resource: "track_rbac_telemetry",
    action: "view",
    description: "Inspetor de Telemetria e Logs MCP: monitoramento de latência e auditoria de decisões do agente",
    target: "/dashboard/tracks?module=governance-rbac&section=telemetry-logs",
    access: "student",
    parent: "track_governance_rbac",
    breadcrumbs: ["Dashboard", "Trilhas de Especialização", "Módulo Governança & RBAC", "Telemetria & Auditoria"],
  },
  track_rbac_certificate_issuer: {
    id: "track_rbac_certificate_issuer",
    resource: "track_rbac_certificate_issuer",
    action: "execute",
    description: "Emissor de Certificados Digitais: emissão criptográfica autenticada com hash SHA-256",
    target: "/dashboard/tracks?module=governance-rbac&section=certificate-issuer",
    access: "student",
    parent: "track_governance_rbac",
    breadcrumbs: ["Dashboard", "Trilhas de Especialização", "Módulo Governança & RBAC", "Emissão de Certificado"],
  },
  // ==============================================================
  // ESTRUTURA ANINHADA DE PÁGINAS: REQUERIMENTOS > CURSOS > CURSO
  // ==============================================================
  // NÍVEL 1: Menu Principal de Requerimentos
  academic_requirements: {
    id: "academic_requirements",
    resource: "academic_requirements",
    action: "navigate",
    description: "Central de Requerimentos Acadêmicos, solicitações e critérios de conclusão de curso",
    target: "/dashboard/requirements",
    access: "student",
    parent: "dashboard",
    breadcrumbs: ["Dashboard", "Requerimentos"],
  },
  // NÍVEL 2: Subpágina de Cursos (dentro de Requerimentos)
  requirements_courses: {
    id: "requirements_courses",
    resource: "requirements_courses",
    action: "navigate",
    description: "Subpágina de Requerimentos de Cursos: exigências pedagógicas e critérios de aprovação",
    target: "/dashboard/requirements/courses",
    access: "student",
    parent: "academic_requirements",
    breadcrumbs: ["Dashboard", "Requerimentos", "Cursos"],
  },
  // NÍVEL 3: Subpáginas Específicas por Curso (dentro de Requerimentos > Cursos)
  requirements_react: {
    id: "requirements_react",
    resource: "requirements_react",
    action: "view",
    description: "Subpágina de Requerimentos do Curso de React: pré-requisitos, entregas de projeto e avaliação",
    target: "/dashboard/requirements/courses/react",
    access: "student",
    parent: "requirements_courses",
    breadcrumbs: ["Dashboard", "Requerimentos", "Cursos", "React"],
  },
  requirements_architecture: {
    id: "requirements_architecture",
    resource: "requirements_architecture",
    action: "view",
    description: "Subpágina de Requerimentos do Curso de Arquitetura: Clean Arch, C4 Model e Web MCP",
    target: "/dashboard/requirements/courses/architecture",
    access: "student",
    parent: "requirements_courses",
    breadcrumbs: ["Dashboard", "Requerimentos", "Cursos", "Arquitetura"],
  },
  requirements_nextjs: {
    id: "requirements_nextjs",
    resource: "requirements_nextjs",
    action: "view",
    description: "Subpágina de Requerimentos do Curso de Next.js: Server Components, Turbopack e Deploy",
    target: "/dashboard/requirements/courses/nextjs",
    access: "student",
    parent: "requirements_courses",
    breadcrumbs: ["Dashboard", "Requerimentos", "Cursos", "Next.js"],
  },
};

/**
 * Parses raw string or object context safely
 */
function parseContextValue(raw: string | null): Record<string, unknown> | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return { value: raw };
  }
}

/**
 * Builds breadcrumbs recursively based on parent links
 */
function buildBreadcrumbs(
  resourceId: string,
  rawMap: Map<string, { name: string; parent?: string }>
): string[] {
  const trail: string[] = [];
  let currentId: string | undefined = resourceId;
  const visited = new Set<string>();

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);
    const item = rawMap.get(currentId);
    if (item) {
      trail.unshift(item.name);
      currentId = item.parent;
    } else if (currentId === "dashboard") {
      trail.unshift("Dashboard");
      break;
    } else {
      break;
    }
  }

  return trail.length > 0 ? trail : ["Dashboard", resourceId];
}

/**
 * Scans the current DOM for elements decorated with data-mcp-* attributes.
 * Transforms raw DOM nodes into a strictly sanitized, minimal SemanticResourceMap.
 * NEVER leaks full HTML, CSS or user PII to the AI layer.
 */
export function scanSemanticDOM(rootElement?: Element | Document): SemanticResourceMap {
  if (typeof window === "undefined") {
    return { ...FALLBACK_SEMANTIC_RESOURCES };
  }

  const root = rootElement || document;
  const elements = root.querySelectorAll<HTMLElement>("[data-mcp-resource]");

  if (elements.length === 0) {
    return { ...FALLBACK_SEMANTIC_RESOURCES };
  }

  const scannedMap: SemanticResourceMap = {};
  const parentLookup = new Map<string, { name: string; parent?: string }>();

  // Pass 1: Collect elements and build name/parent lookup
  elements.forEach((el) => {
    const resource = el.getAttribute("data-mcp-resource");
    if (!resource) return;

    const resourceId = el.getAttribute("data-mcp-resource-id") || undefined;
    const parent = el.getAttribute("data-mcp-parent") || undefined;
    const description = el.getAttribute("data-mcp-description") || el.innerText?.trim() || resource;
    const idKey = resourceId ? `${resource}_${resourceId}` : resource;

    const readableName = el.getAttribute("data-mcp-title") || el.innerText?.split("\n")[0]?.trim() || resource;
    parentLookup.set(idKey, { name: readableName, parent });
  });

  // Pass 2: Extract normalized semantic resources
  elements.forEach((el, index) => {
    const resource = el.getAttribute("data-mcp-resource");
    if (!resource) return;

    const resourceId = el.getAttribute("data-mcp-resource-id") || undefined;
    const action = (el.getAttribute("data-mcp-action") as MCPActionType) || "navigate";
    const description = el.getAttribute("data-mcp-description") || el.innerText?.trim() || resource;
    const access = (el.getAttribute("data-mcp-access") as AccessLevel) || "student";
    const parent = el.getAttribute("data-mcp-parent") || undefined;
    const target = el.getAttribute("data-mcp-target") || (el as HTMLAnchorElement).href || undefined;
    const context = parseContextValue(el.getAttribute("data-mcp-context"));

    const idKey = resourceId ? `${resource}_${resourceId}` : resource;

    // Generate deterministic selector for UI highlighting
    let domSelector: string;
    if (el.id) {
      domSelector = `#${el.id}`;
    } else if (resourceId) {
      domSelector = `[data-mcp-resource="${resource}"][data-mcp-resource-id="${resourceId}"]`;
    } else {
      domSelector = `[data-mcp-resource="${resource}"]`;
    }

    const breadcrumbs = buildBreadcrumbs(idKey, parentLookup);

    scannedMap[idKey] = {
      id: idKey,
      resource,
      resourceId,
      action,
      description,
      target,
      access,
      parent,
      context,
      breadcrumbs,
      domSelector,
    };
  });

  // Merge with fallback catalogue so core navigation is always searchable
  return {
    ...FALLBACK_SEMANTIC_RESOURCES,
    ...scannedMap,
  };
}

/**
 * Builds a hierarchical tree from a flat SemanticResourceMap
 */
export function buildSemanticTree(map: SemanticResourceMap): SemanticTreeNode[] {
  const nodes = new Map<string, SemanticTreeNode>();
  const rootNodes: SemanticTreeNode[] = [];

  // Create tree nodes
  Object.values(map).forEach((res) => {
    nodes.set(res.id, {
      id: res.id,
      resource: res.resource,
      name: res.breadcrumbs[res.breadcrumbs.length - 1] || res.resource,
      description: res.description,
      action: res.action,
      target: res.target,
      access: res.access,
      children: [],
    });
  });

  // Assemble hierarchy
  Object.values(map).forEach((res) => {
    const currentNode = nodes.get(res.id);
    if (!currentNode) return;

    if (res.parent && nodes.has(res.parent)) {
      const parentNode = nodes.get(res.parent);
      parentNode?.children.push(currentNode);
    } else if (res.id !== "dashboard") {
      // If no explicit parent, attach to dashboard if exists, or treat as root
      const dashboardNode = nodes.get("dashboard");
      if (dashboardNode && res.id !== "dashboard") {
        dashboardNode.children.push(currentNode);
      } else {
        rootNodes.push(currentNode);
      }
    } else {
      rootNodes.unshift(currentNode);
    }
  });

  return rootNodes;
}
