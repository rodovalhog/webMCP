import {
  AccessLevel,
  GetNavigationContextParams,
  GetResourceParams,
  NavigateToResourceParams,
  NavigationResult,
  SearchResourcesParams,
  SemanticResource,
} from "./types";
import { scanSemanticDOM } from "../mcp-dom/scanner";
import { checkPermission } from "./permissions";
import { resolveSafeRoute } from "../navigation/registry";
import { telemetry } from "../observability/telemetry";
import { highlightMCPResource } from "../mcp-dom/highlighter";

/**
 * In-process Model Context Protocol (MCP) Server.
 * Exposes standardized tools for semantic navigation, context inspection, and safe routing.
 */
export class MCPServer {
  /**
   * Tool: search_resources
   * Performs semantic fuzzy search across known and scanned DOM resources.
   */
  public async searchResources(params: SearchResourcesParams): Promise<{ resources: SemanticResource[] }> {
    const startTime = performance.now();
    const map = scanSemanticDOM();
    const query = params.query.toLowerCase().trim();
    const userRole = params.role || "student";

    const allResources = Object.values(map);

    // Normalize and compute matching score
    const scored = allResources
      .map((item) => {
        let score = 0;
        const desc = item.description.toLowerCase();
        const id = item.id.toLowerCase();
        const resName = item.resource.toLowerCase();
        const breadcrumbs = item.breadcrumbs.map((b) => b.toLowerCase()).join(" ");

        if (id === query || resName === query) score += 100;
        if (id.includes(query)) score += 50;
        if (resName.includes(query)) score += 40;
        if (breadcrumbs.includes(query)) score += 30;
        if (desc.includes(query)) score += 25;

        // Keyword tokens matching
        const tokens = query.split(/\s+/).filter(Boolean);
        for (const token of tokens) {
          if (desc.includes(token)) score += 10;
          if (breadcrumbs.includes(token)) score += 10;
          if (id.includes(token)) score += 15;
        }

        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);

    // Filter results to only include resources authorized for the userRole
    const authorized = scored.filter((item) => {
      const check = checkPermission(userRole, item.id, item.action);
      return check.allowed;
    });

    const duration = Math.round(performance.now() - startTime);

    if (authorized.length > 0) {
      telemetry.track("ai.navigation.resource_found", {
        query: params.query,
        resourceId: authorized[0].id,
        durationMs: duration,
        userRole,
      });
    } else {
      telemetry.track("ai.navigation.resource_not_found", {
        query: params.query,
        durationMs: duration,
        userRole,
      });
    }

    return { resources: authorized };
  }

  /**
   * Tool: get_resource
   * Retrieves specific semantic resource by ID
   */
  public async getResource(params: GetResourceParams): Promise<{ resource: SemanticResource | null }> {
    const map = scanSemanticDOM();
    const resource = map[params.resourceId] || null;
    return { resource };
  }

  /**
   * Tool: get_navigation_context
   * Returns current active location, hierarchy, and available actions
   */
  public async getNavigationContext(params: GetNavigationContextParams): Promise<{
    currentRoute: string;
    breadcrumbs: string[];
    availableResources: SemanticResource[];
  }> {
    const map = scanSemanticDOM();
    const currentRoute = params.currentRoute || (typeof window !== "undefined" ? window.location.pathname : "/dashboard");

    // Identify current resource matching route
    const currentItem = Object.values(map).find((res) => res.target === currentRoute);
    const breadcrumbs = currentItem ? currentItem.breadcrumbs : ["Dashboard"];

    return {
      currentRoute,
      breadcrumbs,
      availableResources: Object.values(map),
    };
  }

  /**
   * Tool: navigate_to_resource
   * Evaluates permissions, verifies safe route registry, highlights the DOM element,
   * and returns an authorized navigation result.
   */
  public async navigateToResource(params: NavigateToResourceParams): Promise<NavigationResult> {
    const startTime = performance.now();
    const userRole: AccessLevel = params.role || "student";
    const map = scanSemanticDOM();

    // Look up resource
    let resource = map[params.resourceId];
    if (!resource) {
      // Try fuzzy search or prefix match
      const found = Object.values(map).find(
        (r) => r.id === params.resourceId || r.resource === params.resourceId || r.resourceId === params.resourceId
      );
      if (found) resource = found;
    }

    const breadcrumbs = resource?.breadcrumbs || ["Dashboard", params.resourceId];
    const action = resource?.action || "navigate";

    // 1. Check authorization gate
    const authCheck = checkPermission(userRole, params.resourceId, action);
    const duration = Math.round(performance.now() - startTime);

    if (!authCheck.allowed) {
      telemetry.track("ai.navigation.denied", {
        resourceId: params.resourceId,
        durationMs: duration,
        userRole,
        metadata: { reason: authCheck.reason, requiredRole: authCheck.requiredRole },
      });

      return {
        success: false,
        resourceId: params.resourceId,
        action,
        breadcrumbs,
        authorized: false,
        requiredRole: authCheck.requiredRole,
        userRole,
        message: authCheck.reason || "Acesso não autorizado para esta função.",
      };
    }

    // 2. Resolve safe route through typed registry (NEVER from raw LLM string)
    const resolvedRoute = resolveSafeRoute(params.resourceId, params.resourceContext) || resource?.target || "/dashboard";

    // 3. Highlight element in DOM if rendered on client
    let highlightSelector: string | undefined;
    if (typeof window !== "undefined") {
      const highlighted = highlightMCPResource(params.resourceId);
      if (highlighted && resource?.domSelector) {
        highlightSelector = resource.domSelector;
      }
    }

    telemetry.track("ai.navigation.executed", {
      resourceId: params.resourceId,
      resolvedRoute,
      durationMs: duration,
      userRole,
    });

    return {
      success: true,
      resourceId: params.resourceId,
      resolvedRoute,
      action,
      breadcrumbs,
      authorized: true,
      userRole,
      message: `Navegação autorizada para ${breadcrumbs.join(" → ")}`,
      highlightSelector,
    };
  }

  /**
   * Tool: get_current_context
   * Returns simulated learner state (active course, progress, last lesson)
   */
  public async getCurrentContext(): Promise<{
    user: { name: string; role: AccessLevel; email: string };
    activeCourse: { id: string; title: string; progress: number; lastLesson: string };
    totalCertificates: number;
  }> {
    return {
      user: {
        name: "Guilherme Rodovalho",
        role: "student",
        email: "guilherme@learnflow.ai",
      },
      activeCourse: {
        id: "react-avancado",
        title: "React Avançado",
        progress: 72,
        lastLesson: "Hooks avançados",
      },
      totalCertificates: 3,
    };
  }
}

export const mcpServer = new MCPServer();
