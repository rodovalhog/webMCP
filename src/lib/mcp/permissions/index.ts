import { z } from "zod";
import { AccessLevel, AccessLevelSchema } from "../types";

/**
 * Role hierarchy levels
 */
const ROLE_HIERARCHY: Record<AccessLevel, number> = {
  public: 0,
  authenticated: 1,
  student: 2,
  teacher: 3,
  admin: 4,
};

/**
 * Granular permissions mapped per resource and action
 */
export const ResourceAccessRequirements: Record<string, { minRole: AccessLevel; description: string }> = {
  // Public resources
  landing_page: { minRole: "public", description: "Página inicial informativa" },
  docs: { minRole: "public", description: "Documentação do sistema" },
  architecture: { minRole: "public", description: "Diagrama de arquitetura" },
  technical: { minRole: "public", description: "Deep-dive técnico de engenharia" },
  how_it_works: { minRole: "public", description: "Guia interativo didático do Web MCP" },
  ai_test: { minRole: "public", description: "Console de teste e diagnóstico do Gemini Nano" },

  // Student / Authenticated resources
  dashboard: { minRole: "student", description: "Painel do aluno" },
  courses: { minRole: "student", description: "Catálogo e cursos matriculados" },
  my_courses: { minRole: "student", description: "Meus cursos matriculados" },
  course: { minRole: "student", description: "Visualizar curso e aulas" },
  continue_lesson: { minRole: "student", description: "Continuar aula em andamento" },
  exercises: { minRole: "student", description: "Resolver exercícios" },
  assessment: { minRole: "student", description: "Fazer avaliações" },
  certificates: { minRole: "student", description: "Visualizar certificados emitidos" },
  course_certificate: { minRole: "student", description: "Visualizar certificado do curso" },
  progress: { minRole: "student", description: "Visualizar métricas de progresso" },
  profile: { minRole: "student", description: "Gerenciar dados do perfil" },
  settings: { minRole: "student", description: "Configurações da conta" },
  mcp_inspector: { minRole: "student", description: "Console do inspetor MCP" },
  observability: { minRole: "student", description: "Dashboard de observabilidade" },
  student_registration: { minRole: "student", description: "Formulário de cadastro e matrícula de novos alunos" },

  // 3-Level Tracks & Projects
  academy_tracks: { minRole: "student", description: "Central de Trilhas de Especialização e Projetos (Nível 1)" },
  track_mcp_architecture: { minRole: "student", description: "Módulo Web MCP & Arquitetura (Nível 2)" },
  track_vision_multimodal: { minRole: "student", description: "Módulo de Visão Computacional (Nível 2)" },
  track_governance_rbac: { minRole: "student", description: "Módulo de Governança & RBAC (Nível 2)" },

  track_mcp_scanner_lab: { minRole: "student", description: "Laboratório de Scanner Semântico do DOM (Nível 3)" },
  track_mcp_orchestrator: { minRole: "student", description: "Orquestrador de Intenções e Chamadas (Nível 3)" },
  track_mcp_visual_pulse: { minRole: "student", description: "Simulador de Pulso Visual Autônomo (Nível 3)" },

  track_vision_pipeline: { minRole: "student", description: "Pipeline de Ingestão de Documentos (Nível 3)" },
  track_vision_prompt_studio: { minRole: "student", description: "Prompt Studio para OCR (Nível 3)" },
  track_vision_student_extractor: { minRole: "student", description: "Extrator Automático de Aluno (Nível 3)" },

  track_rbac_guardrails: { minRole: "student", description: "Matriz de Guardrails e Políticas (Nível 3)" },
  track_rbac_telemetry: { minRole: "student", description: "Inspetor de Telemetria e Logs MCP (Nível 3)" },
  track_rbac_certificate_issuer: { minRole: "student", description: "Emissor de Certificado Criptográfico (Nível 3)" },

  // 3-Level Nested Page Hierarchy: Requerimentos > Cursos > Subpáginas
  academic_requirements: { minRole: "student", description: "Central de Requerimentos Acadêmicos (Nível 1)" },
  requirements: { minRole: "student", description: "Central de Requerimentos Acadêmicos (Nível 1)" },
  requirements_courses: { minRole: "student", description: "Subpágina de Requerimentos de Cursos (Nível 2)" },
  requirements_react: { minRole: "student", description: "Subpágina de Requerimentos de React (Nível 3)" },
  requirements_architecture: { minRole: "student", description: "Subpágina de Requerimentos de Arquitetura (Nível 3)" },
  requirements_nextjs: { minRole: "student", description: "Subpágina de Requerimentos de Next.js (Nível 3)" },

  // Teacher restricted resources
  create_course: { minRole: "teacher", description: "Criar novo curso na plataforma" },
  edit_course: { minRole: "teacher", description: "Editar conteúdo e módulos do curso" },
  grade_assessments: { minRole: "teacher", description: "Corrigir avaliações de alunos" },

  // Admin restricted resources
  admin_panel: { minRole: "admin", description: "Painel de administração geral" },
  delete_user: { minRole: "admin", description: "Remover usuários da plataforma" },
  manage_system: { minRole: "admin", description: "Gerenciar configurações do sistema" },
};

export const PermissionCheckInputSchema = z.object({
  userRole: AccessLevelSchema,
  resourceId: z.string(),
  action: z.string().optional(),
});

export interface PermissionCheckResult {
  allowed: boolean;
  userRole: AccessLevel;
  requiredRole: AccessLevel;
  reason?: string;
}

/**
 * Validates whether a user with a given role is authorized to access a resource.
 * This acts as the gatekeeper BEFORE navigation or execution occurs.
 */
export function checkPermission(
  userRole: AccessLevel,
  resourceId: string,
  action: string = "navigate"
): PermissionCheckResult {
  const normalizedId = resourceId.trim().toLowerCase();
  const rule = ResourceAccessRequirements[normalizedId];

  // If resource not in strict dictionary, default to requiring student access
  const requiredRole: AccessLevel = rule ? rule.minRole : "student";

  const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 2;

  if (userLevel >= requiredLevel) {
    return {
      allowed: true,
      userRole,
      requiredRole,
    };
  }

  // Denied reasons for clear UX and audit logs
  let reason = `Acesso negado: O perfil '${userRole}' não possui autorização para '${action}' no recurso '${resourceId}'.`;
  if (normalizedId === "create_course" && userRole === "student") {
    reason = "Você não possui permissão para criar cursos. Essa ação é restrita a instrutores e administradores.";
  } else if (normalizedId === "admin_panel" || normalizedId === "delete_user") {
    reason = "Acesso negado: Este recurso requer permissões administrativas.";
  }

  return {
    allowed: false,
    userRole,
    requiredRole,
    reason,
  };
}

export interface FormGuardrailCheckResult {
  allowed: boolean;
  field: string;
  guardrail: string;
  reason?: string;
}

/**
 * Validates agent action against strict Web MCP form guardrails.
 * Explicitly governs what the agent CAN and CANNOT do in the student registration form.
 */
export function validateAgentFormGuardrail(
  field: string,
  value: unknown,
  userRole: AccessLevel = "student"
): FormGuardrailCheckResult {
  const normField = field.trim().toLowerCase();

  // 1. RBAC Guardrail: Agent CANNOT elevate role to admin or teacher
  if (normField === "role") {
    const targetRole = String(value).toLowerCase();
    if (targetRole === "admin" || targetRole === "teacher") {
      return {
        allowed: false,
        field: "role",
        guardrail: "RBAC_ROLE_ELEVATION_PROHIBITED",
        reason: "O agente NÃO tem permissão para conceder privilégios de Administrador ou Instrutor. O perfil deve ser mantido como 'student'.",
      };
    }
  }

  // 2. Consent Guardrail: Agent CANNOT sign or check legal terms / LGPD on behalf of human
  if (normField === "terms_accepted" || normField === "lgpd_consent") {
    if (Boolean(value) === true) {
      return {
        allowed: false,
        field: normField,
        guardrail: "CONSENT_BYPASS_PROHIBITED",
        reason: "O agente NÃO pode assinar ou marcar o aceite dos Termos de Uso e LGPD. O consentimento legal requer ação humana expressa.",
      };
    }
  }

  // 3. Financial/PCI Guardrail: Agent CANNOT modify or submit payment/credit card details
  if (normField === "credit_card" || normField === "payment_method" || normField === "cvv") {
    return {
      allowed: false,
      field: normField,
      guardrail: "FINANCIAL_DATA_RESTRICTED",
      reason: "O agente NÃO pode manipular dados financeiros, de faturamento ou cartões de crédito (Conformidade PCI-DSS).",
    };
  }

  // 4. Overwrite Guardrail: Agent CANNOT force overwrite existing students
  if (normField === "force_overwrite" && Boolean(value) === true) {
    return {
      allowed: false,
      field: normField,
      guardrail: "DATA_OVERWRITE_PROTECTED",
      reason: "O agente NÃO pode sobrescrever registros de alunos existentes sem autorização manual.",
    };
  }

  // Permitted fields for the agent: name, email, phone, course, level, bio
  return {
    allowed: true,
    field: normField,
    guardrail: "FIELD_FILL_ALLOWED",
  };
}
