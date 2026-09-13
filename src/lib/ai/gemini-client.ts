import { AccessLevel } from "../mcp/types";
import { AIProviderResponse } from "./types";
import { mcpClient } from "../mcp/client";

/**
 * Gemini tool declarations matching the MCP server tools
 */
const GEMINI_MCP_TOOLS = [
  {
    function_declarations: [
      {
        name: "navigate_to_resource",
        description: "Executa a navegação da tela para um recurso ou página na plataforma LearnFlow.",
        parameters: {
          type: "OBJECT",
          properties: {
            resourceId: {
              type: "STRING",
              description:
                "ID do recurso a navegar. Exemplos: 'academic_requirements' (Menu Requerimentos Nível 1), 'requirements_courses' (Subpágina Cursos Nível 2), 'requirements_react' (Requerimentos React Nível 3), 'requirements_architecture' (Requerimentos Arquitetura Nível 3), 'requirements_nextjs' (Requerimentos Next.js Nível 3), 'academy_tracks' (Trilha de Especialização Nível 1), 'track_mcp_architecture' (Módulo Web MCP Nível 2), 'track_vision_multimodal' (Módulo Visão Multimodal Nível 2), 'track_governance_rbac' (Módulo Governança Nível 2), 'track_mcp_visual_pulse' (Simulador de Pulso Visual Nível 3), 'certificates', 'courses', 'progress', 'profile', 'continue_lesson', 'student_registration'",
            },
            courseId: {
              type: "STRING",
              description: "Identificador opcional do curso relacionado (ex: 'react-avancado', 'nextjs-architecture')",
            },
          },
          required: ["resourceId"],
        },
      },
      {
        name: "search_resources",
        description: "Pesquisa recursos, páginas ou ferramentas disponíveis na plataforma educacional.",
        parameters: {
          type: "OBJECT",
          properties: {
            query: {
              type: "STRING",
              description: "Termo de busca em linguagem natural",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_current_context",
        description: "Consulta o estado atual do aluno, curso matriculado, última aula assistida e progresso.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
    ],
  },
];

let cachedResolvedModel: string | null = null;

/**
 * Discovers available models for the given API key via Google's ModelService.ListModels.
 * Picks the most modern Flash model available for the account.
 */
export async function resolveGeminiModel(apiKey: string): Promise<string> {
  if (cachedResolvedModel && cachedResolvedModel !== "gemini-2.5-flash") {
    return cachedResolvedModel;
  }

  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("learnflow_gemini_model");
    if (saved && saved !== "gemini-2.5-flash") {
      cachedResolvedModel = saved;
      return saved;
    }
    // Purge deprecated model
    if (saved === "gemini-2.5-flash") {
      localStorage.removeItem("learnflow_gemini_model");
    }
  }

  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`;
    const res = await fetch(listUrl);
    if (res.ok) {
      const data = await res.json();
      const models: Array<{ name: string; supportedGenerationMethods?: string[] }> = data.models || [];
      const generateModels = models
        .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
        .map((m) => m.name.replace(/^models\//, ""));

      // Priority list: gemini-3.6-flash is the modern 2026 flagship
      const preferred = [
        "gemini-3.6-flash",
        "gemini-3.0-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash-002",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash",
        "gemini-2.0-flash-exp",
        "gemini-1.5-pro",
      ];

      for (const pref of preferred) {
        if (generateModels.includes(pref)) {
          cachedResolvedModel = pref;
          if (typeof window !== "undefined") {
            localStorage.setItem("learnflow_gemini_model", pref);
          }
          return pref;
        }
      }

      // If no exact preferred match, find any flash model (excluding deprecated 2.5)
      const anyFlash = generateModels.find((m) => m.includes("flash") && m !== "gemini-2.5-flash");
      if (anyFlash) {
        cachedResolvedModel = anyFlash;
        return anyFlash;
      }
      const anyGemini = generateModels.find((m) => m.includes("gemini") && m !== "gemini-2.5-flash");
      if (anyGemini) {
        cachedResolvedModel = anyGemini;
        return anyGemini;
      }
    }
  } catch {
    // ignore list error and fallback to default
  }

  return "gemini-3.6-flash";
}

/**
 * Executes a query with Google Gemini API using native Function/Tool Calling
 */
export async function callGeminiWithTools(
  apiKey: string,
  userMessage: string,
  userRole: AccessLevel,
  modelName?: string
): Promise<AIProviderResponse> {
  const toolCalls: Array<{ name: string; input: Record<string, unknown>; output: unknown }> = [];

  const userCtx = await mcpClient.getCurrentContext();

  const systemInstruction = `Você é o agente autônomo LearnFlow AI Semantic Navigator.
Você opera no frontend da plataforma educacional e tem permissão para USAR AS FERRAMENTAS para navegar e realizar ações para o usuário.
Papel do usuário: '${userRole}'.
Aluno: ${userCtx.user.name}, Curso ativo: ${userCtx.activeCourse.title} (Progresso: ${userCtx.activeCourse.progress}%, última aula: ${userCtx.activeCourse.lastLesson}).

SE O USUÁRIO PEDIR PARA IR, ABRIR, NAVEGAR OU VER QUALQUER COISA:
- Invoque a ferramenta 'navigate_to_resource' com o resourceId correto (ex: 'certificates', 'course_certificate', 'courses', 'progress', 'profile', 'settings', 'continue_lesson', 'create_course').
- Se for sobre curso de React, inclua courseId='react-avancado'.
- Responda em português amigável explicando que você está navegando até o local para ele.`;

  // Determine candidate models with gemini-3.6-flash first
  const resolved = modelName && modelName !== "gemini-2.5-flash" ? modelName : await resolveGeminiModel(apiKey);
  const candidateModels = Array.from(
    new Set([
      "gemini-3.6-flash",
      resolved,
      "gemini-3.0-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-002",
      "gemini-1.5-flash",
      "gemini-pro",
    ])
  ).filter((m) => m !== "gemini-2.5-flash");

  let lastError = "";
  let responseData: Record<string, unknown> | null = null;

  for (let i = 0; i < candidateModels.length; i++) {
    const model = candidateModels[i];
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemInstruction}\n\nComando do usuário: "${userMessage}"` }],
            },
          ],
          tools: GEMINI_MCP_TOOLS,
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 600,
          },
        }),
      });

      if (response.ok) {
        responseData = await response.json();
        cachedResolvedModel = model;
        if (typeof window !== "undefined") {
          localStorage.setItem("learnflow_gemini_model", model);
        }
        break;
      }

      const errorBody = await response.text();
      lastError = `[${model}] HTTP ${response.status}: ${errorBody}`;

      // If Google explicitly told us which model to use in the error message, add it!
      const advised = errorBody.match(/use models\/([a-zA-Z0-9_.-]+)/i);
      if (advised && advised[1] && !candidateModels.includes(advised[1])) {
        candidateModels.push(advised[1]);
      }

      // If error is 404 (model not found / deprecated), try next candidate!
      if (response.status === 404) {
        continue;
      } else {
        // Other critical error (e.g. 400 or 403 API key invalid)
        throw new Error(`Gemini API retornou erro: ${errorBody}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes("404")) {
        throw err;
      }
      lastError = String(err);
    }
  }

  if (!responseData) {
    throw new Error(`Falha ao invocar Gemini API com os modelos disponíveis. Detalhes: ${lastError}`);
  }

  const data = responseData as { candidates?: Array<{ content?: { parts?: Array<{ text?: string; functionCall?: { name: string; args?: Record<string, unknown> } }> } }> };
  const candidate = data.candidates?.[0];
  const parts = candidate?.content?.parts || [];

  let textResponse = "";
  let suggestedResource: string | undefined = undefined;
  let resourceContext: Record<string, unknown> | undefined = undefined;

  for (const part of parts) {
    if (part.text) {
      textResponse += part.text;
    }
    if (part.functionCall) {
      const fnName = part.functionCall.name;
      const fnArgs = part.functionCall.args || {};

      if (fnName === "navigate_to_resource") {
        suggestedResource = fnArgs.resourceId ? String(fnArgs.resourceId) : undefined;
        if (fnArgs.courseId) {
          resourceContext = { courseId: String(fnArgs.courseId) };
        }
        toolCalls.push({
          name: fnName,
          input: fnArgs,
          output: { status: "executed", resourceId: suggestedResource },
        });
      } else if (fnName === "search_resources") {
        const res = await mcpClient.searchResources({ query: String(fnArgs.query || ""), role: userRole });
        toolCalls.push({ name: fnName, input: fnArgs, output: res });
        if (res.resources.length > 0 && !suggestedResource) {
          suggestedResource = res.resources[0].id;
        }
      } else if (fnName === "get_current_context") {
        toolCalls.push({ name: fnName, input: {}, output: userCtx });
      }
    }
  }

  if (!textResponse.trim()) {
    if (suggestedResource) {
      textResponse = `Entendido! Estou acionando a ferramenta e levando você diretamente para o recurso solicitado.`;
    } else {
      textResponse = "Analisei a plataforma mas não localizei uma ação direta para esse comando. Tente me pedir: 'Me leva para os certificados', 'Quero continuar a aula', ou 'Onde vejo meu progresso?'.";
    }
  }

  return {
    message: textResponse,
    suggestedResource,
    resourceContext,
    toolCalls,
  };
}
