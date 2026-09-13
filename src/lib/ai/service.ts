import { AccessLevel, AIChatMessage } from "../mcp/types";
import { AIProvider } from "./types";
import { MockAIProvider } from "./mock-provider";
import { mcpClient } from "../mcp/client";
import { telemetry } from "../observability/telemetry";

export class AIService {
  private provider: AIProvider;

  constructor(provider?: AIProvider) {
    this.provider = provider || new MockAIProvider();
  }

  public setProvider(provider: AIProvider): void {
    this.provider = provider;
  }

  public getProviderName(): string {
    return this.provider.name;
  }

  public async handleUserMessage(
    userMessage: string,
    userRole: AccessLevel,
    currentContext?: Record<string, unknown>
  ): Promise<AIChatMessage> {
    const startTime = performance.now();

    // 1. Log incoming request in observability telemetry
    telemetry.track("ai.navigation.requested", {
      query: userMessage,
      durationMs: 0,
      source: "chat",
      userRole,
    });

    try {
      // 2. Delegate to AI Provider to deduce intent and select MCP tools
      const providerRes = await this.provider.processQuery(userMessage, userRole, currentContext);

      let navigationCard: AIChatMessage["navigationCard"] = undefined;

      // 3. If AI suggested a resource, evaluate safe navigation through MCP Server
      if (providerRes.suggestedResource) {
        const navResult = await mcpClient.navigateToResource({
          resourceId: providerRes.suggestedResource,
          resourceContext: providerRes.resourceContext,
          role: userRole,
        });

        navigationCard = {
          title: navResult.breadcrumbs[navResult.breadcrumbs.length - 1] || providerRes.suggestedResource,
          resourceId: navResult.resourceId,
          breadcrumbs: navResult.breadcrumbs,
          actionLabel: navResult.authorized ? "Ir para recurso" : "Ação bloqueada",
          targetRoute: navResult.resolvedRoute || "/dashboard",
          isAuthorized: navResult.authorized,
          denialReason: !navResult.authorized ? navResult.message : undefined,
        };
      }

      const totalDuration = Math.round(performance.now() - startTime);

      const isStudentRegistration =
        providerRes.suggestedResource === "student_registration" ||
        (userMessage.toLowerCase().includes("cadastr") && userMessage.toLowerCase().includes("aluno")) ||
        userMessage.toLowerCase().includes("matrícul");

      const documentUploadCard =
        providerRes.documentUploadCard ||
        (isStudentRegistration
          ? {
              enabled: true,
              title: "Extração Inteligente por Documento (RG/CNH)",
              description: "Envie uma foto do documento para que eu extraia os dados e preencha o formulário automaticamente.",
              targetFormRoute: "/dashboard/students/new",
            }
          : undefined);

      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        content: providerRes.message,
        timestamp: Date.now(),
        navigationCard,
        documentUploadCard,
        toolCalls: providerRes.toolCalls,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Erro no processamento da IA";
      console.error("[AIService] Erro ao processar mensagem do usuário:", err);

      telemetry.track("ai.navigation.error", {
        query: userMessage,
        durationMs: Math.round(performance.now() - startTime),
        source: "chat",
        userRole,
        metadata: { error: errorMsg, provider: this.provider.name },
      });

      const isNano = this.provider.name.toLowerCase().includes("nano") || errorMsg.toLowerCase().includes("languagemodel");

      if (isNano) {
        return {
          id: `msg-${Date.now()}`,
          sender: "assistant",
          content: "⚡ [Gemini Nano Local] O modelo local on-device ainda não concluiu o download (~1.5GB) no Chrome ou requer inicialização. Acesse a página de teste para acompanhar o download e habilitar a Prompt API.",
          timestamp: Date.now(),
          navigationCard: {
            title: "Configurar Gemini Nano Local",
            resourceId: "ai_test",
            breadcrumbs: ["Configurações", "Gemini Nano Test"],
            actionLabel: "Abrir /ai-test",
            targetRoute: "/ai-test",
            isAuthorized: true,
          },
        };
      }

      return {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        content: `Desculpe, ocorreu uma instabilidade ao consultar o serviço de IA (${errorMsg}). Tente novamente ou use os botões de navegação rápida.`,
        timestamp: Date.now(),
      };
    }
  }
}

export const aiService = new AIService();
