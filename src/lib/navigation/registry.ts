import { z } from "zod";

/**
 * Route context schema for type-safe parameter validation
 */
export const RouteContextSchema = z.object({
  courseId: z.string().optional(),
  lessonId: z.string().optional(),
  tab: z.string().optional(),
  filter: z.string().optional(),
});

export type RouteContext = z.infer<typeof RouteContextSchema>;

/**
 * Route resolver function type
 */
export type RouteResolver = (ctx?: RouteContext) => string;

/**
 * Safe Route Registry definition.
 * Maps known resource IDs to deterministic path functions.
 * Arbitrary URLs from LLM outputs are NEVER allowed or executed.
 */
export const routeRegistry: Record<string, RouteResolver> = {
  dashboard: () => "/dashboard",
  
  my_courses: () => "/dashboard/courses",
  courses: () => "/dashboard/courses",
  
  course: (ctx) => {
    const courseId = ctx?.courseId || "react-avancado";
    return `/dashboard/courses/${encodeURIComponent(courseId)}`;
  },
  
  course_certificate: (ctx) => {
    const courseId = ctx?.courseId || "react-avancado";
    return `/dashboard/courses/${encodeURIComponent(courseId)}/certificate`;
  },
  
  certificates: () => "/dashboard/certificates",
  
  progress: () => "/dashboard/progress",
  
  profile: () => "/dashboard/profile",
  
  settings: () => "/dashboard/settings",
  
  create_course: () => "/dashboard/courses/new",
  
  continue_lesson: (ctx) => {
    const courseId = ctx?.courseId || "react-avancado";
    const lessonId = ctx?.lessonId || "hooks-avancados";
    return `/dashboard/courses/${encodeURIComponent(courseId)}?lesson=${encodeURIComponent(lessonId)}`;
  },
  
  exercises: (ctx) => {
    const courseId = ctx?.courseId || "react-avancado";
    return `/dashboard/courses/${encodeURIComponent(courseId)}?tab=exercises`;
  },
  
  assessment: (ctx) => {
    const courseId = ctx?.courseId || "react-avancado";
    return `/dashboard/courses/${encodeURIComponent(courseId)}?tab=assessment`;
  },

  admin_panel: () => "/dashboard/admin",
  
  mcp_inspector: () => "/mcp-inspector",
  observability: () => "/observability",
  architecture: () => "/architecture",
  docs: () => "/docs",
  home: () => "/",
  course_nextjs: () => "/dashboard/courses/nextjs-architecture",
  how_it_works: () => "/how-it-works",
  technical: () => "/technical",
  tech_overview: () => "/technical",
  ai_test: () => "/ai-test",
  student_registration: () => "/dashboard/students/new",

  // 3-Level Feature Hierarchy Routes
  academy_tracks: () => "/dashboard/tracks",
  tracks: () => "/dashboard/tracks",
  track_mcp_architecture: () => "/dashboard/tracks?module=mcp-architecture",
  track_vision_multimodal: () => "/dashboard/tracks?module=vision-multimodal",
  track_governance_rbac: () => "/dashboard/tracks?module=governance-rbac",

  // Level 3 specific section routes
  track_mcp_scanner_lab: () => "/dashboard/tracks?module=mcp-architecture&section=scanner-lab",
  track_mcp_orchestrator: () => "/dashboard/tracks?module=mcp-architecture&section=orchestrator",
  track_mcp_visual_pulse: () => "/dashboard/tracks?module=mcp-architecture&section=visual-pulse",

  track_vision_pipeline: () => "/dashboard/tracks?module=vision-multimodal&section=document-pipeline",
  track_vision_prompt_studio: () => "/dashboard/tracks?module=vision-multimodal&section=prompt-studio",
  track_vision_student_extractor: () => "/dashboard/tracks?module=vision-multimodal&section=student-extractor",

  track_rbac_guardrails: () => "/dashboard/tracks?module=governance-rbac&section=guardrails-matrix",
  track_rbac_telemetry: () => "/dashboard/tracks?module=governance-rbac&section=telemetry-logs",
  track_rbac_certificate_issuer: () => "/dashboard/tracks?module=governance-rbac&section=certificate-issuer",

  // 3-Level Nested Page Hierarchy Routes: Requerimentos > Cursos > [React | Arquitetura | Next.js]
  academic_requirements: () => "/dashboard/requirements",
  requirements: () => "/dashboard/requirements",
  requirements_courses: () => "/dashboard/requirements/courses",
  requirements_react: () => "/dashboard/requirements/courses/react",
  requirements_architecture: () => "/dashboard/requirements/courses/architecture",
  requirements_nextjs: () => "/dashboard/requirements/courses/nextjs",
};

/**
 * Safely resolves a resourceId and its context to an application route.
 * Returns null if the resourceId is not registered in the whitelist.
 */
export function resolveSafeRoute(resourceId: string, context?: Record<string, unknown>): string | null {
  const normalizedId = resourceId.trim().toLowerCase();
  const resolver = routeRegistry[normalizedId];

  if (!resolver) {
    return null;
  }

  try {
    const parsedContext = context ? RouteContextSchema.parse(context) : undefined;
    return resolver(parsedContext);
  } catch {
    // If context parsing fails, attempt fallback with empty context
    return resolver();
  }
}

/**
 * Validates whether a resourceId exists in the safe registry
 */
export function isValidResourceId(resourceId: string): boolean {
  const normalizedId = resourceId.trim().toLowerCase();
  return normalizedId in routeRegistry;
}
