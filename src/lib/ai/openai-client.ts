import { AccessLevel } from "../mcp/types";
import { AIProviderResponse } from "./types";
import { mcpClient } from "../mcp/client";

const OPENAI_MCP_TOOLS = [
  {
    type: "function",
    function: {
      name: "navigate_to_resource",
      description: "Executa a navegação para um recurso ou página na plataforma LearnFlow.",
      parameters: {
        type: "object",
        properties: {
          resourceId: {
            type: "string",
            description: "ID do recurso: 'certificates', 'course_certificate', 'courses', 'progress', 'profile', 'settings', 'continue_lesson', 'create_course'",
          },
          courseId: {
            type: "string",
            description: "Identificador opcional do curso (ex: 'react-avancado')",
          },
        },
        required: ["resourceId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_resources",
      description: "Pesquisa recursos e páginas disponíveis na plataforma educacional.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Termo de busca em linguagem natural",
          },
        },
        required: ["query"],
      },
    },
  },
];

export async function callOpenAIWithTools(
  apiKey: string,
  userMessage: string,
  userRole: AccessLevel,
  modelName: string = "gpt-4o-mini"
): Promise<AIProviderResponse> {
  const toolCalls: Array<{ name: string; input: Record<string, unknown>; output: unknown }> = [];
  const userCtx = await mcpClient.getCurrentContext();

  const systemMessage = `Você é o agente autônomo LearnFlow AI Semantic Navigator.
Você opera no frontend da plataforma educacional e tem permissão para USAR AS FERRAMENTAS para navegar e realizar ações para o usuário.
Papel do usuário: '${userRole}'. Aluno: ${userCtx.user.name}, Curso ativo: ${userCtx.activeCourse.title} (Progresso: ${userCtx.activeCourse.progress}%, última aula: ${userCtx.activeCourse.lastLesson}).

SE O USUÁRIO PEDIR PARA IR, ABRIR, NAVEGAR OU VER QUALQUER COISA:
Invoque a ferramenta 'navigate_to_resource' com o resourceId correto.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      tools: OPENAI_MCP_TOOLS,
      tool_choice: "auto",
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API retornou erro ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0];
  const msg = choice?.message;

  let textResponse = msg?.content || "";
  let suggestedResource: string | undefined = undefined;
  let resourceContext: Record<string, unknown> | undefined = undefined;

  if (msg?.tool_calls && msg.tool_calls.length > 0) {
    for (const tool of msg.tool_calls) {
      if (tool.function?.name === "navigate_to_resource") {
        try {
          const args = JSON.parse(tool.function.arguments);
          suggestedResource = args.resourceId;
          if (args.courseId) resourceContext = { courseId: args.courseId };
          toolCalls.push({ name: tool.function.name, input: args, output: { status: "executed", resourceId: suggestedResource } });
        } catch {
          // ignore
        }
      }
    }
  }

  if (!textResponse.trim()) {
    if (suggestedResource) {
      textResponse = `Entendido! Estou acionando a ferramenta e levando você diretamente para o recurso solicitado.`;
    } else {
      textResponse = "Analisei a plataforma mas não localizei uma ação direta para esse comando.";
    }
  }

  return {
    message: textResponse,
    suggestedResource,
    resourceContext,
    toolCalls,
  };
}
