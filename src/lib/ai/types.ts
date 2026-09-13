import { AccessLevel, AIChatMessage } from "../mcp/types";

export interface AIIntentResult {
  intent: "search" | "navigate" | "resume" | "create" | "query_progress" | "query_certificates" | "general";
  targetResource?: string;
  courseId?: string;
  query: string;
  confidence: number;
}

export interface AIProviderResponse {
  message: string;
  suggestedResource?: string;
  resourceContext?: Record<string, unknown>;
  documentUploadCard?: {
    enabled: boolean;
    title: string;
    description: string;
    targetFormRoute: string;
  };
  toolCalls?: Array<{
    name: string;
    input: Record<string, unknown>;
    output: unknown;
  }>;
}

export interface AIProvider {
  name: string;
  processQuery(query: string, userRole: AccessLevel, context?: Record<string, unknown>): Promise<AIProviderResponse>;
}
