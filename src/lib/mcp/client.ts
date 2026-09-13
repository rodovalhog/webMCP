import {
  AccessLevel,
  GetNavigationContextParams,
  GetResourceParams,
  NavigateToResourceParams,
  NavigationResult,
  SearchResourcesParams,
  SemanticResource,
} from "./types";
import { mcpServer } from "./server";

/**
 * MCP Client: Abstraction used by the AI Agent / Service to interact with the MCP Server.
 */
export class MCPClient {
  public async searchResources(params: SearchResourcesParams): Promise<{ resources: SemanticResource[] }> {
    try {
      return await mcpServer.searchResources(params);
    } catch (error) {
      console.error("[MCPClient] searchResources error:", error);
      return { resources: [] };
    }
  }

  public async getResource(params: GetResourceParams): Promise<{ resource: SemanticResource | null }> {
    try {
      return await mcpServer.getResource(params);
    } catch (error) {
      console.error("[MCPClient] getResource error:", error);
      return { resource: null };
    }
  }

  public async getNavigationContext(params: GetNavigationContextParams): Promise<{
    currentRoute: string;
    breadcrumbs: string[];
    availableResources: SemanticResource[];
  }> {
    try {
      return await mcpServer.getNavigationContext(params);
    } catch (error) {
      console.error("[MCPClient] getNavigationContext error:", error);
      return {
        currentRoute: "/dashboard",
        breadcrumbs: ["Dashboard"],
        availableResources: [],
      };
    }
  }

  public async navigateToResource(params: NavigateToResourceParams): Promise<NavigationResult> {
    try {
      return await mcpServer.navigateToResource(params);
    } catch (error) {
      console.error("[MCPClient] navigateToResource error:", error);
      return {
        success: false,
        resourceId: params.resourceId,
        action: "navigate",
        breadcrumbs: ["Dashboard", params.resourceId],
        authorized: false,
        userRole: params.role || "student",
        message: "Erro interno ao executar navegação MCP.",
      };
    }
  }

  public async getCurrentContext(): Promise<{
    user: { name: string; role: AccessLevel; email: string };
    activeCourse: { id: string; title: string; progress: number; lastLesson: string };
    totalCertificates: number;
  }> {
    return await mcpServer.getCurrentContext();
  }
}

export const mcpClient = new MCPClient();
