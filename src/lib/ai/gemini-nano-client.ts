import { AccessLevel } from "../mcp/types";
import { AIProvider, AIProviderResponse } from "./types";
import { mcpClient } from "../mcp/client";
import {
  checkGeminiNanoAvailability as checkNanoCore,
  createGeminiNanoSession,
  getLanguageModelAPI,
  GeminiNanoAvailabilityStatus,
  GeminiNanoSession,
} from "./gemini-nano";

export type GeminiNanoAvailability = "readily" | "after-download" | "no" | "unsupported";

export interface GeminiNanoCheckResult {
  available: boolean;
  status: GeminiNanoAvailability;
  rawStatus?: string;
  message: string;
}

/**
 * Checks whether Google Chrome's built-in Gemini Nano Prompt API is available in this browser.
 * Adapts to the unified checkGeminiNanoAvailability from gemini-nano.ts.
 */
export async function checkGeminiNanoAvailability(): Promise<GeminiNanoCheckResult> {
  if (typeof window === "undefined") {
    return {
      available: false,
      status: "unsupported",
      message: "Execução fora do navegador (SSR).",
    };
  }

  const result = await checkNanoCore("en");

  if (result.status === "available") {
    return {
      available: true,
      status: "readily",
      rawStatus: result.rawStatus,
      message: "Gemini Nano está instalado, ativo e pronto para uso local on-device!",
    };
  } else if (result.status === "downloadable" || result.status === "downloading") {
    return {
      available: false,
      status: "after-download",
      rawStatus: result.rawStatus,
      message:
        "Suportado pelo dispositivo! O modelo Gemini Nano ainda precisa ser baixado (~1.5GB) na página /ai-test antes do uso.",
    };
  } else {
    return {
      available: false,
      status: "no",
      rawStatus: result.rawStatus,
      message:
        result.message ||
        "API Prompt do Chrome não detectada. Habilite 'chrome://flags/#prompt-api-for-gemini-nano' no Chrome 131+ ou Canary.",
    };
  }
}

/**
 * GeminiNanoProvider
 * Runs Google Gemini Nano 100% locally on-device inside Chrome using the built-in Prompt API.
 * Requires ZERO API keys, zero network latency, and operates completely privately.
 */
export class GeminiNanoProvider implements AIProvider {
  public name = "Google Gemini Nano (Chrome On-Device AI)";
  private session: GeminiNanoSession | null = null;

  private async getSession(): Promise<GeminiNanoSession> {
    if (this.session) {
      return this.session;
    }

    this.session = await createGeminiNanoSession({
      outputLanguage: "en",
      temperature: 0.2,
      topK: 3,
    });

    return this.session;
  }

  public async processQuery(
    query: string,
    userRole: AccessLevel,
    currentContext?: Record<string, unknown>
  ): Promise<AIProviderResponse> {
    // 1. Verify model availability state first
    const availability = await checkNanoCore("en");

    // If model is downloadable, downloading, or unavailable, guide user directly to /ai-test
    if (availability.status !== "available") {
      if (availability.status === "downloadable") {
        return {
          message:
            "⚡ [Gemini Nano Local] O modelo ainda precisa ser baixado no Chrome (~1.5GB) para poder responder localmente. Clique no botão abaixo para abrir a página de configuração e iniciar o download!",
          suggestedResource: "ai_test",
          toolCalls: [
            {
              name: "navigate_to_resource",
              input: { resourceId: "ai_test" },
              output: { source: "gemini_nano_setup", status: "download_required" },
            },
          ],
        };
      }

      if (availability.status === "downloading") {
        return {
          message:
            "⚡ [Gemini Nano Local] O modelo está sendo baixado em segundo plano pelo Chrome. Acompanhe o progresso na página de teste!",
          suggestedResource: "ai_test",
          toolCalls: [],
        };
      }

      return {
        message:
          "⚡ [Gemini Nano Local] A API LanguageModel não está ativa no navegador. Acesse a página /ai-test para ver as instruções de ativação das flags no Chrome.",
        suggestedResource: "ai_test",
        toolCalls: [],
      };
    }

    // 2. Model is available! Attempt local inference
    let rawOutput = "";
    try {
      const session = await this.getSession();
      const userCtx = await mcpClient.getCurrentContext();

      const promptWithContext = `You are the LearnFlow AI assistant running locally via Chrome Gemini Nano.
User role: '${userRole}'.
Active student: ${userCtx.user.name}, course: ${userCtx.activeCourse.title} (${userCtx.activeCourse.progress}% completed).
User message: "${query}".

Available system resources:
- certificates: Central de certificados emitidos de cursos concluídos (/dashboard/certificates)
- course_certificate: Certificado oficial do curso React Avançado
- courses: Catálogo de cursos matriculados (/dashboard/courses)
- continue_lesson: Continuar última aula em andamento (Hooks Avançados)
- progress: Métricas de progresso e estatísticas (/dashboard/progress)
- exercises: Exercícios práticos e laboratórios
- assessment: Prova final para certificado
- profile: Dados do perfil e cadastro (/dashboard/profile)
- settings: Configurações da conta (/dashboard/settings)
- admin_panel: Painel administrativo (exige admin)
- mcp_inspector: Console do inspetor MCP (/mcp-inspector)
- observability: Telemetria e métricas (/observability)
- architecture: Arquitetura técnica do sistema (/architecture)
- technical: Deep-dive de engenharia (/technical)
- how_it_works: Guia didático (/how-it-works)
- ai_test: Console de teste do Gemini Nano (/ai-test)
- student_registration: Formulário inteligente de cadastro de aluno com guardrails MCP (/dashboard/students/new)
- academy_tracks: Central de Trilhas de Especialização em Engenharia de Software e IA - Nível 1 (/dashboard/tracks)
- track_mcp_architecture: Módulo 1: Arquitetura Frontend & Protocolo Web MCP - Nível 2 (/dashboard/tracks?module=mcp-architecture)
- track_vision_multimodal: Módulo 2: Visão Computacional & IA Multimodal com Gemini - Nível 2 (/dashboard/tracks?module=vision-multimodal)
- track_governance_rbac: Módulo 3: Governança de Agentes, RBAC & Telemetria - Nível 2 (/dashboard/tracks?module=governance-rbac)
- track_mcp_visual_pulse: Simulador de Pulso Visual Autônomo - Nível 3 (/dashboard/tracks?module=mcp-architecture&section=visual-pulse)
- track_mcp_scanner_lab: Laboratório de Scanner Semântico do DOM - Nível 3 (/dashboard/tracks?module=mcp-architecture&section=scanner-lab)
- track_mcp_orchestrator: Orquestrador de Intenções e Tool Calling - Nível 3 (/dashboard/tracks?module=mcp-architecture&section=orchestrator)
- track_vision_pipeline: Pipeline de Ingestão de Documentos - Nível 3 (/dashboard/tracks?module=vision-multimodal&section=document-pipeline)
- track_vision_prompt_studio: Prompt Studio para OCR Estruturado - Nível 3 (/dashboard/tracks?module=vision-multimodal&section=prompt-studio)
- track_vision_student_extractor: Extrator Automático de Alunos via IA - Nível 3 (/dashboard/tracks?module=vision-multimodal&section=student-extractor)
- track_rbac_guardrails: Matriz de Guardrails e Políticas de Acesso - Nível 3 (/dashboard/tracks?module=governance-rbac&section=guardrails-matrix)
- track_rbac_telemetry: Inspetor de Telemetria e Logs MCP - Nível 3 (/dashboard/tracks?module=governance-rbac&section=telemetry-logs)
- track_rbac_certificate_issuer: Emissor de Certificados Digitais Criptográficos - Nível 3 (/dashboard/tracks?module=governance-rbac&section=certificate-issuer)
- academic_requirements: Menu Principal: Central de Requerimentos Acadêmicos - Nível 1 (/dashboard/requirements)
- requirements_courses: Subpágina de Requerimentos de Cursos contida no menu Requerimentos - Nível 2 (/dashboard/requirements/courses)
- requirements_react: Subpágina de Requerimentos do Curso de React contida em Cursos - Nível 3 (/dashboard/requirements/courses/react)
- requirements_architecture: Subpágina de Requerimentos do Curso de Arquitetura contida em Cursos - Nível 3 (/dashboard/requirements/courses/architecture)
- requirements_nextjs: Subpágina de Requerimentos do Curso de Next.js contida em Cursos - Nível 3 (/dashboard/requirements/courses/nextjs)
- secretaria: Central da Secretaria Acadêmica - Nível 1 (/dashboard/secretaria)
- secretaria_matricula: Subpágina de Matrícula Regular da Secretaria - Nível 2 (/dashboard/secretaria/matricula)
- secretaria_rematricula: Subpágina de Rematrícula Semestral da Secretaria - Nível 2 (/dashboard/secretaria/rematricula)
- secretaria_disciplinas: Subpágina de Disciplinas e Matriz Curricular da Secretaria - Nível 2 (/dashboard/secretaria/disciplinas)
- secretaria_disciplina_matematica: Disciplina de Matemática dentro de Disciplinas na Secretaria - Nível 3 (/dashboard/secretaria/disciplinas/matematica)
- secretaria_disciplina_portugues: Disciplina de Língua Portuguesa dentro de Disciplinas na Secretaria - Nível 3 (/dashboard/secretaria/disciplinas/portugues)
- secretaria_disciplina_ciencias: Disciplina de Ciências dentro de Disciplinas na Secretaria - Nível 3 (/dashboard/secretaria/disciplinas/ciencias)
- secretaria_disciplina_historia: Disciplina de História dentro de Disciplinas na Secretaria - Nível 3 (/dashboard/secretaria/disciplinas/historia)
- home: Página inicial (/)

If the user wants to navigate or access a resource, respond in this format:
[RESPOSTA]: <friendly message in Portuguese explaining the navigation>
[RESOURCE]: <exact resourceId from the list above>

If the user asks a general question (e.g. "quem fez esse site", "como vc pode me ajudar"), answer informatively in Portuguese explaining that LearnFlow AI is an AI-native educational platform built with Web MCP.`;

      rawOutput = await session.prompt(promptWithContext);
    } catch (sessionErr: unknown) {
      console.warn("[Gemini Nano] Fallback during prompt execution:", sessionErr);
      // Fallback message if prompt execution encounters an issue
      rawOutput = "";
    }

    let message = "";
    let suggestedResource: string | undefined = undefined;
    const toolCalls: Array<{ name: string; input: Record<string, unknown>; output: unknown }> = [];

    // Parse structured markers from on-device model output
    const responseMatch = rawOutput.match(/\[RESPOSTA\]:\s*([\s\S]*?)(?=\[RESOURCE\]|$)/i);
    const resourceMatch = rawOutput.match(/\[RESOURCE\]:\s*([a-zA-Z0-9_\-]+)/i);

    if (resourceMatch && resourceMatch[1]) {
      suggestedResource = resourceMatch[1].trim();
    }

    // Heuristic fallback matching for Portuguese queries if Nano returned free text or empty
    if (!suggestedResource) {
      const lower = (query + " " + rawOutput)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/scretaria|secetaria|secreteria|secrataria/g, "secretaria")
        .replace(/rematrocula|rematricla/g, "rematricula")
        .replace(/matrocula|matricla/g, "matricula");

      // Secretaria 3-Level hierarchy checks
      if (lower.includes("matematica") || lower.includes("calculo")) {
        suggestedResource = "secretaria_disciplina_matematica";
      } else if (lower.includes("portugues") || lower.includes("redacao")) {
        suggestedResource = "secretaria_disciplina_portugues";
      } else if (lower.includes("ciencias") || lower.includes("ciencia")) {
        suggestedResource = "secretaria_disciplina_ciencias";
      } else if (lower.includes("historia")) {
        suggestedResource = "secretaria_disciplina_historia";
      } else if (lower.includes("rematricula") || lower.includes("renovacao") || (lower.includes("renovar") && lower.includes("matricula"))) {
        suggestedResource = "secretaria_rematricula";
      } else if (lower.includes("matricula") && !lower.includes("cadastrar aluno") && !lower.includes("novo aluno") && !lower.includes("cadastro de aluno")) {
        suggestedResource = "secretaria_matricula";
      } else if (lower.includes("disciplina") || lower.includes("disciplinas") || lower.includes("grade curricular") || lower.includes("matriz curricular")) {
        suggestedResource = "secretaria_disciplinas";
      } else if (lower.includes("secretaria")) {
        suggestedResource = "secretaria";
      // Nested Requirements 3-Level checks
      } else if ((lower.includes("react") && (lower.includes("requer") || lower.includes("requisit") || lower.includes("criteri") || lower.includes("critéri") || lower.includes("sub") || lower.includes("pagina") || lower.includes("página"))) || lower.includes("requerimento react")) {
        suggestedResource = "requirements_react";
      } else if (((lower.includes("arquitetura") || lower.includes("architecture")) && (lower.includes("requer") || lower.includes("requisit") || lower.includes("criteri") || lower.includes("critéri") || lower.includes("sub") || lower.includes("pagina") || lower.includes("página"))) || lower.includes("requerimento arquitetura")) {
        suggestedResource = "requirements_architecture";
      } else if (((lower.includes("next") || lower.includes("nextjs") || lower.includes("next.js")) && (lower.includes("requer") || lower.includes("requisit") || lower.includes("criteri") || lower.includes("critéri") || lower.includes("sub") || lower.includes("pagina") || lower.includes("página"))) || lower.includes("requerimento next")) {
        suggestedResource = "requirements_nextjs";
      } else if ((lower.includes("curso") || lower.includes("cursos")) && (lower.includes("requer") || lower.includes("requisit") || lower.includes("sub") || lower.includes("pagina") || lower.includes("página"))) {
        suggestedResource = "requirements_courses";
      } else if (lower.includes("requerimento") || lower.includes("requerimentos")) {
        suggestedResource = "academic_requirements";
      // Level 3 checks
      } else if (lower.includes("pulso visual") || lower.includes("simulador de pulso")) {
        suggestedResource = "track_mcp_visual_pulse";
      } else if (lower.includes("scanner semântico") || lower.includes("scanner do dom")) {
        suggestedResource = "track_mcp_scanner_lab";
      } else if (lower.includes("orquestrador")) {
        suggestedResource = "track_mcp_orchestrator";
      } else if (lower.includes("pipeline de documentos")) {
        suggestedResource = "track_vision_pipeline";
      } else if (lower.includes("prompt studio")) {
        suggestedResource = "track_vision_prompt_studio";
      } else if (lower.includes("extrator automático") || lower.includes("extrator de aluno")) {
        suggestedResource = "track_vision_student_extractor";
      } else if (lower.includes("matriz de guardrail") || lower.includes("tabela de permissões")) {
        suggestedResource = "track_rbac_guardrails";
      } else if (lower.includes("telemetria") && lower.includes("mcp")) {
        suggestedResource = "track_rbac_telemetry";
      } else if (lower.includes("emissor de certificado")) {
        suggestedResource = "track_rbac_certificate_issuer";
      // Level 2 checks
      } else if (lower.includes("módulo web mcp") || lower.includes("módulo 1")) {
        suggestedResource = "track_mcp_architecture";
      } else if (lower.includes("módulo visão") || lower.includes("módulo 2") || lower.includes("visão multimodal")) {
        suggestedResource = "track_vision_multimodal";
      } else if (lower.includes("módulo governança") || lower.includes("módulo 3") || lower.includes("módulo rbac")) {
        suggestedResource = "track_governance_rbac";
      // Level 1 checks
      } else if (lower.includes("trilha") || lower.includes("academy") || lower.includes("especialização")) {
        suggestedResource = "academy_tracks";
      } else if (lower.includes("criar curso") || lower.includes("cadastrar curso") || lower.includes("novo curso")) {
        suggestedResource = "create_course";
      } else if ((lower.includes("cadastr") && lower.includes("aluno")) || (lower.includes("matricular") && lower.includes("aluno")) || lower.includes("novo aluno") || lower.includes("form de aluno")) {
        suggestedResource = "student_registration";
      } else if (lower.includes("certificad")) {
        suggestedResource = lower.includes("react") ? "course_certificate" : "certificates";
      } else if (lower.includes("continuar") || lower.includes("aula")) {
        suggestedResource = "continue_lesson";
      } else if (lower.includes("curso")) {
        suggestedResource = "courses";
      } else if (lower.includes("progresso") || lower.includes("estatística")) {
        suggestedResource = "progress";
      } else if (lower.includes("perfil")) {
        suggestedResource = "profile";
      } else if (lower.includes("configura")) {
        suggestedResource = "settings";
      } else if (lower.includes("exercicio") || lower.includes("exercício")) {
        suggestedResource = "exercises";
      } else if (lower.includes("prova") || lower.includes("avaliação")) {
        suggestedResource = "assessment";
      } else if (lower.includes("admin")) {
        suggestedResource = "admin_panel";
      } else if (
        lower.includes("como funciona") ||
        lower.includes("ajudar") ||
        lower.includes("como habilitar") ||
        lower.includes("como ativar") ||
        lower.includes("habilitar mcp") ||
        lower.includes("ativar mcp") ||
        lower.includes("habilitar o web mcp")
      ) {
        suggestedResource = "how_it_works";
      } else if (lower.includes("quem fez") || lower.includes("quem criou") || lower.includes("sobre o site")) {
        suggestedResource = "technical";
      }
    }

    if (responseMatch && responseMatch[1]) {
      message = responseMatch[1].trim();
    } else if (rawOutput) {
      message = rawOutput.replace(/\[ACTION\]:.*|\[RESOURCE\]:.*/gi, "").trim();
    }

    // If message is still empty, synthesize an intelligent context-aware response
    if (!message) {
      const lower = query.toLowerCase();
      if (lower.includes("criar curso") || lower.includes("cadastrar curso")) {
        if (userRole === "student") {
          message = "Você não possui permissão para criar cursos. Essa ação é restrita a instrutores e administradores.";
        } else {
          message = "Preparei a tela de criação de novos cursos para instrutores:";
        }
      } else if (lower.includes("cadastr") || lower.includes("matrícul") || lower.includes("aluno")) {
        if (userRole === "student") {
          message = "Você não possui permissão para cadastrar alunos. Essa ação é restrita a instrutores e administradores.";
        } else {
          message = "Preparei o formulário de cadastro de aluno com governança de guardrails MCP. Você pode conferir os campos e preenchê-lo pelo botão abaixo:";
        }
      } else if (lower.includes("certificad")) {
        message = "Localizei sua central de certificados emitidos. Você pode acessá-la pelo botão abaixo:";
      } else if (
        lower.includes("como habilitar") ||
        lower.includes("como ativar") ||
        lower.includes("habilitar mcp") ||
        lower.includes("ativar mcp") ||
        lower.includes("como funciona")
      ) {
        message = "O Web MCP funciona nativamente via DOM neste app, através de extensões de navegador compatíveis, localmente via Gemini Nano (com flags no Chrome) e via chaves Cloud. Preparei o guia explicativo para você:";
      } else if (lower.includes("quem fez")) {
        message = "Este site foi desenvolvido para demonstrar o LearnFlow AI com o Web MCP Semantic Navigator, permitindo navegação semântica via inteligência artificial on-device e cloud!";
      } else if (lower.includes("como vc pode me ajudar") || lower.includes("ajudar")) {
        message = "Eu sou seu assistente de navegação semântica! Você pode me pedir para acessar cursos, certificados, progresso ou aulas, e eu levarei você diretamente ao local certo.";
      } else if (suggestedResource) {
        message = `Identifiquei sua solicitação e preparei o acesso seguro para o recurso '${suggestedResource}'.`;
      } else {
        message = "Processe o seu comando localmente via Gemini Nano. Como posso te ajudar a navegar pela plataforma?";
      }
    }

    if (suggestedResource) {
      toolCalls.push({
        name: "navigate_to_resource",
        input: { resourceId: suggestedResource },
        output: { source: "gemini_nano_on_device", status: "executed" },
      });
    }

    return {
      message: `⚡ [Gemini Nano On-Device] ${message}`,
      suggestedResource,
      toolCalls,
    };
  }

  public destroy(): void {
    if (this.session && typeof this.session.destroy === "function") {
      this.session.destroy();
      this.session = null;
    }
  }
}
