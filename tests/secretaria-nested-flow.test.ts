import { aiService } from "../src/lib/ai/service";
import { MockAIProvider } from "../src/lib/ai/mock-provider";
import { checkPermission } from "../src/lib/mcp/permissions";
import { resolveSafeRoute } from "../src/lib/navigation/registry";
import { FALLBACK_SEMANTIC_RESOURCES } from "../src/lib/mcp-dom/scanner";

describe("Secretaria 3-Level Deep Hierarchical Navigation & Typo Resilience Flow", () => {
  beforeEach(() => {
    aiService.setProvider(new MockAIProvider());
  });

  describe("Permissions and Registry Integrity for all 9 Secretaria Resources", () => {
    const resources = [
      "secretaria",
      "secretaria_academica",
      "secretaria_matricula",
      "secretaria_rematricula",
      "secretaria_disciplinas",
      "secretaria_disciplina_matematica",
      "secretaria_disciplina_portugues",
      "secretaria_disciplina_ciencias",
      "secretaria_disciplina_historia",
    ];

    it.each(resources)("should allow student role to navigate to %s", (resId) => {
      const perm = checkPermission("student", resId, "navigate");
      expect(perm.allowed).toBe(true);
      expect(resolveSafeRoute(resId)).toBeDefined();
    });

    it("should have valid breadcrumbs and tree relationships in scanner registry", () => {
      expect(FALLBACK_SEMANTIC_RESOURCES["secretaria"].breadcrumbs).toEqual(["Dashboard", "Secretaria"]);
      expect(FALLBACK_SEMANTIC_RESOURCES["secretaria_matricula"].parent).toBe("secretaria");
      expect(FALLBACK_SEMANTIC_RESOURCES["secretaria_rematricula"].parent).toBe("secretaria");
      expect(FALLBACK_SEMANTIC_RESOURCES["secretaria_disciplinas"].parent).toBe("secretaria");
      expect(FALLBACK_SEMANTIC_RESOURCES["secretaria_disciplina_matematica"].parent).toBe("secretaria_disciplinas");
      expect(FALLBACK_SEMANTIC_RESOURCES["secretaria_disciplina_portugues"].parent).toBe("secretaria_disciplinas");
    });
  });

  describe("Autonomous AI Agent Navigation - Level 1: Secretaria Principal", () => {
    it("navigates to /dashboard/secretaria when user asks for secretaria", async () => {
      const res = await aiService.handleUserMessage("Quero ir para a secretaria acadêmica", "student");
      expect(res.navigationCard).toBeDefined();
      expect(res.navigationCard?.isAuthorized).toBe(true);
      expect(res.navigationCard?.targetRoute).toBe("/dashboard/secretaria");
    });

    it("handles phonetic typos in secretaria (e.g. scretaria)", async () => {
      const res = await aiService.handleUserMessage("quero acessar os recursos da scretaria", "student");
      expect(res.navigationCard).toBeDefined();
      expect(res.navigationCard?.isAuthorized).toBe(true);
      expect(res.navigationCard?.targetRoute).toBe("/dashboard/secretaria");
    });
  });

  describe("Autonomous AI Agent Navigation - Level 2: Submenus de Secretaria", () => {
    it("navigates to /dashboard/secretaria/matricula for regular matricula queries", async () => {
      const res = await aiService.handleUserMessage("Quero fazer minha matrícula", "student");
      expect(res.navigationCard).toBeDefined();
      expect(res.navigationCard?.isAuthorized).toBe(true);
      expect(res.navigationCard?.targetRoute).toBe("/dashboard/secretaria/matricula");
    });

    it("navigates to /dashboard/secretaria/rematricula for rematricula queries", async () => {
      const res = await aiService.handleUserMessage("Quero fazer a rematrícula semestral", "student");
      expect(res.navigationCard).toBeDefined();
      expect(res.navigationCard?.isAuthorized).toBe(true);
      expect(res.navigationCard?.targetRoute).toBe("/dashboard/secretaria/rematricula");
    });

    it("handles typo in rematricula (e.g. rematrocula)", async () => {
      const res = await aiService.handleUserMessage("como faço minha rematrocula?", "student");
      expect(res.navigationCard).toBeDefined();
      expect(res.navigationCard?.isAuthorized).toBe(true);
      expect(res.navigationCard?.targetRoute).toBe("/dashboard/secretaria/rematricula");
    });

    it("navigates to /dashboard/secretaria/disciplinas for general disciplines catalog", async () => {
      const res = await aiService.handleUserMessage("Quero ver as disciplinas e matriz curricular", "student");
      expect(res.navigationCard).toBeDefined();
      expect(res.navigationCard?.isAuthorized).toBe(true);
      expect(res.navigationCard?.targetRoute).toBe("/dashboard/secretaria/disciplinas");
    });
  });

  describe("Autonomous AI Agent Navigation - Level 3: Disciplinas Filhas Aninhadas", () => {
    it("navigates to /dashboard/secretaria/disciplinas/matematica", async () => {
      const res = await aiService.handleUserMessage("Quero ver a disciplina de matemática", "student");
      expect(res.navigationCard).toBeDefined();
      expect(res.navigationCard?.isAuthorized).toBe(true);
      expect(res.navigationCard?.targetRoute).toBe("/dashboard/secretaria/disciplinas/matematica");
    });

    it("navigates to /dashboard/secretaria/disciplinas/portugues", async () => {
      const res = await aiService.handleUserMessage("Quero ver a matéria de português", "student");
      expect(res.navigationCard).toBeDefined();
      expect(res.navigationCard?.isAuthorized).toBe(true);
      expect(res.navigationCard?.targetRoute).toBe("/dashboard/secretaria/disciplinas/portugues");
    });

    it("navigates to /dashboard/secretaria/disciplinas/ciencias", async () => {
      const res = await aiService.handleUserMessage("Me leva para ciências", "student");
      expect(res.navigationCard).toBeDefined();
      expect(res.navigationCard?.isAuthorized).toBe(true);
      expect(res.navigationCard?.targetRoute).toBe("/dashboard/secretaria/disciplinas/ciencias");
    });

    it("navigates to /dashboard/secretaria/disciplinas/historia", async () => {
      const res = await aiService.handleUserMessage("Quero ver o cronograma de história", "student");
      expect(res.navigationCard).toBeDefined();
      expect(res.navigationCard?.isAuthorized).toBe(true);
      expect(res.navigationCard?.targetRoute).toBe("/dashboard/secretaria/disciplinas/historia");
    });
  });

  describe("User exact prompt scenario with typos and combined intent", () => {
    it("handles 'estou tentando acessar os recurso da scretaria que no casso e rematrocula ou matricula' without RBAC blocking", async () => {
      const prompt = "estou tentando acessar os recurso da scretaria que no casso e rematrocula ou matricula";
      const res = await aiService.handleUserMessage(prompt, "student");

      expect(res.navigationCard).toBeDefined();
      expect(res.navigationCard?.isAuthorized).toBe(true);
      expect(res.navigationCard?.targetRoute).toMatch(/\/dashboard\/secretaria\/(rematricula|matricula)/);
      expect(res.navigationCard?.denialReason).toBeUndefined();
    });

    it("keeps teacher administrative student registration protected for 'Quero cadastrar um novo aluno'", async () => {
      const studentRes = await aiService.handleUserMessage("Quero cadastrar um novo aluno", "student");
      expect(studentRes.navigationCard?.isAuthorized).toBe(false);
      expect(studentRes.navigationCard?.denialReason).toContain("Você não possui permissão para cadastrar alunos");

      const teacherRes = await aiService.handleUserMessage("Quero cadastrar um novo aluno", "teacher");
      expect(teacherRes.navigationCard?.isAuthorized).toBe(true);
      expect(teacherRes.navigationCard?.targetRoute).toBe("/dashboard/students/new");
    });
  });
});
