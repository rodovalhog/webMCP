import { validateAgentFormGuardrail, checkPermission, ResourceAccessRequirements } from "../src/lib/mcp/permissions";
import { resolveSafeRoute } from "../src/lib/navigation/registry";
import { FALLBACK_SEMANTIC_RESOURCES } from "../src/lib/mcp-dom/scanner";

describe("Student Registration Form & Web MCP Guardrails", () => {
  describe("Resource Registration & Route Resolution", () => {
    it("should register student_registration in ResourceAccessRequirements with teacher access", () => {
      expect(ResourceAccessRequirements["student_registration"]).toBeDefined();
      expect(ResourceAccessRequirements["student_registration"].minRole).toBe("teacher");
    });

    it("should DENY student role to navigate to student_registration", () => {
      const check = checkPermission("student", "student_registration", "navigate");
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain("Você não possui permissão para cadastrar alunos");
    });

    it("should allow teacher and admin role to navigate to student_registration", () => {
      const teacherCheck = checkPermission("teacher", "student_registration", "navigate");
      expect(teacherCheck.allowed).toBe(true);

      const adminCheck = checkPermission("admin", "student_registration", "navigate");
      expect(adminCheck.allowed).toBe(true);
    });

    it("should resolve student_registration to /dashboard/students/new", () => {
      const route = resolveSafeRoute("student_registration");
      expect(route).toBe("/dashboard/students/new");
    });

    it("should be present in FALLBACK_SEMANTIC_RESOURCES with teacher access", () => {
      expect(FALLBACK_SEMANTIC_RESOURCES["student_registration"]).toBeDefined();
      expect(FALLBACK_SEMANTIC_RESOURCES["student_registration"].target).toBe("/dashboard/students/new");
      expect(FALLBACK_SEMANTIC_RESOURCES["student_registration"].access).toBe("teacher");
    });
  });

  describe("Agent Form Guardrails (What the agent CAN and CANNOT do)", () => {
    it("ALLOWS agent to fill regular text fields (name, email, phone, bio)", () => {
      const nameCheck = validateAgentFormGuardrail("fullName", "Lucas Santos", "student");
      expect(nameCheck.allowed).toBe(true);
      expect(nameCheck.guardrail).toBe("FIELD_FILL_ALLOWED");

      const emailCheck = validateAgentFormGuardrail("email", "lucas@exemplo.com", "student");
      expect(emailCheck.allowed).toBe(true);

      const phoneCheck = validateAgentFormGuardrail("phone", "(11) 99999-8888", "student");
      expect(phoneCheck.allowed).toBe(true);

      const bioCheck = validateAgentFormGuardrail("bio", "Estudante interessado em React", "student");
      expect(bioCheck.allowed).toBe(true);
    });

    it("ALLOWS agent to set role as student", () => {
      const roleCheck = validateAgentFormGuardrail("role", "student", "student");
      expect(roleCheck.allowed).toBe(true);
    });

    it("BLOCKS agent from elevating role to admin (RBAC Guardrail)", () => {
      const adminCheck = validateAgentFormGuardrail("role", "admin", "student");
      expect(adminCheck.allowed).toBe(false);
      expect(adminCheck.guardrail).toBe("RBAC_ROLE_ELEVATION_PROHIBITED");
      expect(adminCheck.reason).toContain("NÃO tem permissão para conceder privilégios de Administrador");
    });

    it("BLOCKS agent from elevating role to teacher (RBAC Guardrail)", () => {
      const teacherCheck = validateAgentFormGuardrail("role", "teacher", "student");
      expect(teacherCheck.allowed).toBe(false);
      expect(teacherCheck.guardrail).toBe("RBAC_ROLE_ELEVATION_PROHIBITED");
    });

    it("BLOCKS agent from automatically checking legal/LGPD terms (Consent Guardrail)", () => {
      const consentCheck = validateAgentFormGuardrail("terms_accepted", true, "student");
      expect(consentCheck.allowed).toBe(false);
      expect(consentCheck.guardrail).toBe("CONSENT_BYPASS_PROHIBITED");
      expect(consentCheck.reason).toContain("NÃO pode assinar ou marcar o aceite dos Termos de Uso");

      const lgpdCheck = validateAgentFormGuardrail("lgpd_consent", true, "student");
      expect(lgpdCheck.allowed).toBe(false);
      expect(lgpdCheck.guardrail).toBe("CONSENT_BYPASS_PROHIBITED");
    });

    it("BLOCKS agent from touching financial or payment fields (PCI-DSS Guardrail)", () => {
      const cardCheck = validateAgentFormGuardrail("credit_card", "4111222233334444", "student");
      expect(cardCheck.allowed).toBe(false);
      expect(cardCheck.guardrail).toBe("FINANCIAL_DATA_RESTRICTED");

      const cvvCheck = validateAgentFormGuardrail("cvv", "123", "student");
      expect(cvvCheck.allowed).toBe(false);
    });

    it("BLOCKS agent from force overwriting existing students", () => {
      const overwriteCheck = validateAgentFormGuardrail("force_overwrite", true, "student");
      expect(overwriteCheck.allowed).toBe(false);
      expect(overwriteCheck.guardrail).toBe("DATA_OVERWRITE_PROTECTED");
    });
  });
});
