import { NextRequest, NextResponse } from "next/server";
import { mcpServer } from "@/lib/mcp/server";
import { AccessLevel } from "@/lib/mcp/types";
import { routeRegistry } from "@/lib/navigation/registry";

interface MCPToolInfo {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

const MCP_TOOLS: MCPToolInfo[] = [
  {
    name: "navigate_to_resource",
    description: "Navegador semântico que valida permissões e resolve rotas seguras para recursos da plataforma.",
    inputSchema: {
      type: "object",
      properties: {
        resourceId: {
          type: "string",
          description: "ID do recurso (ex: certificates, courses, progress, settings, profile, continue_lesson)",
        },
        courseId: { type: "string", description: "Identificador opcional do curso" },
      },
      required: ["resourceId"],
    },
  },
  {
    name: "search_resources",
    description: "Pesquisa fuzzy por palavras-chave em recursos semânticos e nós do DOM.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Termo de busca em linguagem natural" },
      },
      required: ["query"],
    },
  },
  {
    name: "get_current_context",
    description: "Consulta contexto do aluno conectado, curso em andamento e progresso.",
    inputSchema: { type: "object", properties: {} },
  },
];

export async function GET() {
  const resourceKeys = Object.keys(routeRegistry);

  return NextResponse.json({
    name: "learnflow-mcp-server",
    version: "1.0.0",
    protocolVersion: "2024-11-05",
    toolsCount: MCP_TOOLS.length,
    resourcesCount: resourceKeys.length,
    tools: MCP_TOOLS,
    resources: resourceKeys.map((key) => ({
      id: key,
      path: routeRegistry[key](),
    })),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, params } = body;
    const role: AccessLevel = params?.role || "student";

    if (method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        result: {
          tools: MCP_TOOLS,
        },
      });
    }

    if (method === "resources/list") {
      const resourceKeys = Object.keys(routeRegistry);
      return NextResponse.json({
        jsonrpc: "2.0",
        result: {
          resources: resourceKeys.map((key) => ({
            id: key,
            path: routeRegistry[key](),
          })),
        },
      });
    }

    if (method === "tools/call") {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};

      if (!toolName) {
        return NextResponse.json(
          { jsonrpc: "2.0", error: { code: -32602, message: "Parâmetro 'name' é obrigatório" } },
          { status: 400 }
        );
      }

      if (toolName === "search_resources") {
        const result = await mcpServer.searchResources({
          query: String(toolArgs.query || ""),
          role,
        });
        return NextResponse.json({
          jsonrpc: "2.0",
          result: { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] },
        });
      }

      if (toolName === "get_current_context") {
        const result = await mcpServer.getCurrentContext();
        return NextResponse.json({
          jsonrpc: "2.0",
          result: { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] },
        });
      }

      if (toolName === "navigate_to_resource") {
        const resId = String(toolArgs.resourceId || "dashboard");
        const navResult = await mcpServer.navigateToResource({
          resourceId: resId,
          role,
          resourceContext: toolArgs,
        });

        return NextResponse.json({
          jsonrpc: "2.0",
          result: {
            content: [{ type: "text", text: JSON.stringify(navResult, null, 2) }],
          },
        });
      }

      return NextResponse.json(
        { jsonrpc: "2.0", error: { code: -32601, message: `Ferramenta não encontrada: ${toolName}` } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32601, message: `Método não suportado: ${method}` } },
      { status: 400 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32603, message: `Erro interno: ${msg}` } },
      { status: 500 }
    );
  }
}
