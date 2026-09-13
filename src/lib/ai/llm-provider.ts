import { AccessLevel } from "../mcp/types";
import { AIProvider, AIProviderResponse } from "./types";
import { callGeminiWithTools } from "./gemini-client";
import { callOpenAIWithTools } from "./openai-client";

export class LiveLLMProvider implements AIProvider {
  public name: string;
  private providerType: "gemini" | "openai";
  private apiKey: string;
  private model: string;

  constructor(providerType: "gemini" | "openai", apiKey: string, model?: string) {
    this.providerType = providerType;
    this.apiKey = apiKey;
    this.name = providerType === "gemini" ? "Google Gemini (MCP Tool Calling)" : "OpenAI (MCP Tool Calling)";
    this.model = model || (providerType === "gemini" ? "gemini-1.5-flash" : "gpt-4o-mini");
  }

  public async processQuery(
    query: string,
    userRole: AccessLevel,
    currentContext?: Record<string, unknown>
  ): Promise<AIProviderResponse> {
    if (this.providerType === "gemini") {
      if (this.apiKey) {
        return await callGeminiWithTools(this.apiKey, query, userRole, this.model);
      }

      // Backend route fallback (uses GEMINI_API_KEY in server .env.local)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, role: userRole, model: this.model }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      return {
        message: data.content,
        suggestedResource: data.suggestedResource,
        resourceContext: data.resourceContext,
        toolCalls: data.toolCalls || [],
      };
    } else {
      return await callOpenAIWithTools(this.apiKey, query, userRole, this.model);
    }
  }
}
