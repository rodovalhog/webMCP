import { NextRequest, NextResponse } from "next/server";
import { AccessLevel } from "@/lib/mcp/types";
import { callGeminiWithTools } from "@/lib/ai/gemini-client";

/**
 * Backend API Route: /api/chat
 * Executes Gemini AI processing on the Node.js backend server, completely outside the browser.
 * Reads GEMINI_API_KEY from environment variables (.env.local) or request payload.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message || "";
    const role: AccessLevel = body.role || "student";
    const apiKey = body.apiKey || process.env.GEMINI_API_KEY || "";
    const model = body.model || undefined;

    if (!message.trim()) {
      return NextResponse.json({ error: "Mensagem não pode ser vazia" }, { status: 400 });
    }

    if (!apiKey.trim()) {
      return NextResponse.json(
        {
          error:
            "Nenhuma chave GEMINI_API_KEY configurada no servidor (.env.local) nem enviada na requisição.",
        },
        { status: 401 }
      );
    }

    // Call Gemini with tools from Node.js runtime
    const aiResponse = await callGeminiWithTools(apiKey.trim(), message, role, model);

    return NextResponse.json({
      success: true,
      sender: "assistant",
      content: aiResponse.message,
      suggestedResource: aiResponse.suggestedResource,
      resourceContext: aiResponse.resourceContext,
      toolCalls: aiResponse.toolCalls,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error("[/api/chat error]", errMessage);
    return NextResponse.json(
      { error: `Erro no processamento do Gemini no servidor: ${errMessage}` },
      { status: 500 }
    );
  }
}
