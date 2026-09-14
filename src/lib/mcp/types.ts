import { z } from "zod";

/**
 * Access levels for resources and actions
 */
export type AccessLevel = "public" | "authenticated" | "student" | "teacher" | "admin";

export const AccessLevelSchema = z.enum([
  "public",
  "authenticated",
  "student",
  "teacher",
  "admin",
]);

/**
 * Valid action verbs for MCP elements
 */
export type MCPActionType = "navigate" | "open" | "view" | "execute" | "create" | "delete" | "edit" | "submit";

export const MCPActionTypeSchema = z.enum([
  "navigate",
  "open",
  "view",
  "execute",
  "create",
  "delete",
  "edit",
  "submit",
]);

/**
 * Semantic Resource representation extracted from the DOM
 */
export interface SemanticResource {
  id: string;
  resource: string;
  resourceId?: string;
  action: MCPActionType;
  description: string;
  target?: string;
  context?: Record<string, unknown> | string;
  access: AccessLevel;
  parent?: string;
  breadcrumbs: string[];
  domSelector?: string;
}

export const SemanticResourceSchema = z.object({
  id: z.string(),
  resource: z.string(),
  resourceId: z.string().optional(),
  action: MCPActionTypeSchema,
  description: z.string(),
  target: z.string().optional(),
  context: z.union([z.record(z.string(), z.unknown()), z.string()]).optional(),
  access: AccessLevelSchema,
  parent: z.string().optional(),
  breadcrumbs: z.array(z.string()),
  domSelector: z.string().optional(),
});

/**
 * Map of scanned resources indexed by unique semantic ID
 */
export type SemanticResourceMap = Record<string, SemanticResource>;

/**
 * Hierarchical tree node for the MCP Inspector & Navigation hierarchy
 */
export interface SemanticTreeNode {
  id: string;
  resource: string;
  name: string;
  description: string;
  action: MCPActionType;
  target?: string;
  access: AccessLevel;
  children: SemanticTreeNode[];
}

/**
 * MCP Tool definitions and payloads
 */
export interface SearchResourcesParams {
  query: string;
  context?: Record<string, unknown>;
  role?: AccessLevel;
}

export const SearchResourcesSchema = z.object({
  query: z.string().min(1),
  context: z.record(z.string(), z.unknown()).optional(),
  role: AccessLevelSchema.optional().default("student"),
});

export interface GetResourceParams {
  resourceId: string;
}

export const GetResourceSchema = z.object({
  resourceId: z.string().min(1),
});

export interface NavigateToResourceParams {
  resourceId: string;
  resourceContext?: Record<string, unknown>;
  role?: AccessLevel;
}

export const NavigateToResourceSchema = z.object({
  resourceId: z.string().min(1),
  resourceContext: z.record(z.string(), z.unknown()).optional(),
  role: AccessLevelSchema.optional().default("student"),
});

export interface GetNavigationContextParams {
  currentRoute?: string;
  role?: AccessLevel;
}

export interface NavigationResult {
  success: boolean;
  resourceId: string;
  resolvedRoute?: string;
  action: MCPActionType;
  breadcrumbs: string[];
  authorized: boolean;
  requiredRole?: AccessLevel;
  userRole: AccessLevel;
  message: string;
  highlightSelector?: string;
}

/**
 * Observability & Telemetry Events
 */
export type TelemetryEventType =
  | "ai.navigation.requested"
  | "ai.navigation.resource_found"
  | "ai.navigation.resource_not_found"
  | "ai.navigation.executed"
  | "ai.navigation.denied"
  | "ai.navigation.error";

export interface TelemetryEvent {
  id: string;
  event: TelemetryEventType;
  timestamp: number;
  query?: string;
  resourceId?: string;
  resolvedRoute?: string;
  durationMs: number;
  source: "chat" | "inspector" | "system";
  userRole: AccessLevel;
  metadata?: Record<string, unknown>;
}

/**
 * AI Message representation
 */
export interface AIChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  navigationCard?: {
    title: string;
    resourceId: string;
    breadcrumbs: string[];
    actionLabel: string;
    targetRoute: string;
    isAuthorized: boolean;
    denialReason?: string;
  };
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
