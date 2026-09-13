import { FALLBACK_SEMANTIC_RESOURCES } from "../src/lib/mcp-dom/scanner";
import { resolveSafeRoute } from "../src/lib/navigation/registry";
import { checkPermission } from "../src/lib/mcp/permissions";
import { MockAIProvider } from "../src/lib/ai/mock-provider";

describe("3-Level Nested Page Hierarchy: Requerimentos > Cursos > [React, Arquitetura, Next.js]", () => {
  const provider = new MockAIProvider();

  describe("1. Resource Hierarchy & Semantic Breadcrumbs", () => {
    it("defines Level 1 Menu Requerimentos correctly", () => {
      const res = FALLBACK_SEMANTIC_RESOURCES["academic_requirements"];
      expect(res).toBeDefined();
      expect(res.id).toBe("academic_requirements");
      expect(res.target).toBe("/dashboard/requirements");
      expect(res.parent).toBe("dashboard");
      expect(res.breadcrumbs).toEqual(["Dashboard", "Requerimentos"]);
    });

    it("defines Level 2 Subpágina Cursos with parent referencing academic_requirements", () => {
      const res = FALLBACK_SEMANTIC_RESOURCES["requirements_courses"];
      expect(res).toBeDefined();
      expect(res.id).toBe("requirements_courses");
      expect(res.target).toBe("/dashboard/requirements/courses");
      expect(res.parent).toBe("academic_requirements");
      expect(res.breadcrumbs).toEqual(["Dashboard", "Requerimentos", "Cursos"]);
    });

    it("defines Level 3 Subpáginas Específicas with parent referencing requirements_courses and 4 breadcrumbs", () => {
      const reactRes = FALLBACK_SEMANTIC_RESOURCES["requirements_react"];
      const archRes = FALLBACK_SEMANTIC_RESOURCES["requirements_architecture"];
      const nextRes = FALLBACK_SEMANTIC_RESOURCES["requirements_nextjs"];

      expect(reactRes).toBeDefined();
      expect(reactRes.parent).toBe("requirements_courses");
      expect(reactRes.target).toBe("/dashboard/requirements/courses/react");
      expect(reactRes.breadcrumbs).toEqual(["Dashboard", "Requerimentos", "Cursos", "React"]);

      expect(archRes).toBeDefined();
      expect(archRes.parent).toBe("requirements_courses");
      expect(archRes.target).toBe("/dashboard/requirements/courses/architecture");
      expect(archRes.breadcrumbs).toEqual(["Dashboard", "Requerimentos", "Cursos", "Arquitetura"]);

      expect(nextRes).toBeDefined();
      expect(nextRes.parent).toBe("requirements_courses");
      expect(nextRes.target).toBe("/dashboard/requirements/courses/nextjs");
      expect(nextRes.breadcrumbs).toEqual(["Dashboard", "Requerimentos", "Cursos", "Next.js"]);
    });
  });

  describe("2. Safe Route Registry Resolution", () => {
    it("resolves Level 1 routes", () => {
      expect(resolveSafeRoute("academic_requirements")).toBe("/dashboard/requirements");
      expect(resolveSafeRoute("requirements")).toBe("/dashboard/requirements");
    });

    it("resolves Level 2 subpage route", () => {
      expect(resolveSafeRoute("requirements_courses")).toBe("/dashboard/requirements/courses");
    });

    it("resolves Level 3 sub-subpage routes", () => {
      expect(resolveSafeRoute("requirements_react")).toBe("/dashboard/requirements/courses/react");
      expect(resolveSafeRoute("requirements_architecture")).toBe("/dashboard/requirements/courses/architecture");
      expect(resolveSafeRoute("requirements_nextjs")).toBe("/dashboard/requirements/courses/nextjs");
    });
  });

  describe("3. RBAC Permissions Enforcement", () => {
    const resources = [
      "academic_requirements",
      "requirements_courses",
      "requirements_react",
      "requirements_architecture",
      "requirements_nextjs",
    ];

    it("authorizes student role to access all 3 levels", () => {
      resources.forEach((resourceId) => {
        const check = checkPermission("student", resourceId);
        expect(check.allowed).toBe(true);
      });
    });

    it("blocks unauthenticated public access", () => {
      resources.forEach((resourceId) => {
        const check = checkPermission("public", resourceId);
        expect(check.allowed).toBe(false);
      });
    });
  });

  describe("4. Autonomous AI Intent Identification and Hierarchy Understanding", () => {
    it("identifies Level 3 React requirements and explains page-within-page hierarchy", async () => {
      const res = await provider.processQuery("Quero ver os requerimentos de react", "student");
      expect(res.suggestedResource).toBe("requirements_react");
      expect(res.message).toContain("Nível 3/3");
      expect(res.message).toContain("React");
      expect(res.message).toContain("/dashboard/requirements/courses/react");
    });

    it("identifies Level 3 Architecture requirements", async () => {
      const res = await provider.processQuery("Me mostre os requisitos de arquitetura de software", "student");
      expect(res.suggestedResource).toBe("requirements_architecture");
      expect(res.message).toContain("Nível 3/3");
      expect(res.message).toContain("Arquitetura");
      expect(res.message).toContain("/dashboard/requirements/courses/architecture");
    });

    it("identifies Level 3 Next.js requirements", async () => {
      const res = await provider.processQuery("Quais são os requerimentos do curso de Next.js?", "student");
      expect(res.suggestedResource).toBe("requirements_nextjs");
      expect(res.message).toContain("Nível 3/3");
      expect(res.message).toContain("Next.js");
      expect(res.message).toContain("/dashboard/requirements/courses/nextjs");
    });

    it("identifies Level 2 Courses subpage inside requirements", async () => {
      const res = await provider.processQuery("Quero abrir a subpágina de cursos dentro de requerimentos", "student");
      expect(res.suggestedResource).toBe("requirements_courses");
      expect(res.message).toContain("Nível 2/3");
      expect(res.message).toContain("/dashboard/requirements/courses");
    });

    it("identifies Level 1 Academic requirements main menu", async () => {
      const res = await provider.processQuery("Me leve ao menu de requerimentos acadêmicos", "student");
      expect(res.suggestedResource).toBe("academic_requirements");
      expect(res.message).toContain("Nível 1/3");
      expect(res.message).toContain("/dashboard/requirements");
    });
  });
});
