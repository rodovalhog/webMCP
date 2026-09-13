import { scanSemanticDOM, FALLBACK_SEMANTIC_RESOURCES } from "../src/lib/mcp-dom/scanner";
import { resolveSafeRoute } from "../src/lib/navigation/registry";
import { MockAIProvider } from "../src/lib/ai/mock-provider";

describe("3-Level Feature Hierarchy & Agent Navigation", () => {
  const provider = new MockAIProvider();

  describe("1. Semantic Resource Structure & Hierarchy", () => {
    it("registers Level 1 macro feature (academy_tracks)", () => {
      const res = FALLBACK_SEMANTIC_RESOURCES["academy_tracks"];
      expect(res).toBeDefined();
      expect(res.id).toBe("academy_tracks");
      expect(res.action).toBe("navigate");
      expect(res.breadcrumbs).toEqual(["Dashboard", "Trilhas de Especialização"]);
    });

    it("registers Level 2 sub-features (modules) with parent referencing Level 1", () => {
      const mcp = FALLBACK_SEMANTIC_RESOURCES["track_mcp_architecture"];
      const vision = FALLBACK_SEMANTIC_RESOURCES["track_vision_multimodal"];
      const gov = FALLBACK_SEMANTIC_RESOURCES["track_governance_rbac"];

      expect(mcp).toBeDefined();
      expect(mcp.parent).toBe("academy_tracks");
      expect(mcp.breadcrumbs.length).toBe(3);

      expect(vision).toBeDefined();
      expect(vision.parent).toBe("academy_tracks");
      expect(vision.breadcrumbs.length).toBe(3);

      expect(gov).toBeDefined();
      expect(gov.parent).toBe("academy_tracks");
      expect(gov.breadcrumbs.length).toBe(3);
    });

    it("registers Level 3 sub-subfeatures (actions/labs) with parent referencing Level 2", () => {
      const pulse = FALLBACK_SEMANTIC_RESOURCES["track_mcp_visual_pulse"];
      const scanner = FALLBACK_SEMANTIC_RESOURCES["track_mcp_scanner_lab"];
      const promptStudio = FALLBACK_SEMANTIC_RESOURCES["track_vision_prompt_studio"];
      const guardrails = FALLBACK_SEMANTIC_RESOURCES["track_rbac_guardrails"];

      expect(pulse).toBeDefined();
      expect(pulse.parent).toBe("track_mcp_architecture");
      expect(pulse.breadcrumbs.length).toBe(4);

      expect(scanner).toBeDefined();
      expect(scanner.parent).toBe("track_mcp_architecture");

      expect(promptStudio).toBeDefined();
      expect(promptStudio.parent).toBe("track_vision_multimodal");

      expect(guardrails).toBeDefined();
      expect(guardrails.parent).toBe("track_governance_rbac");
    });
  });

  describe("2. Safe Route Resolution across all 3 Levels", () => {
    it("resolves Level 1 route", () => {
      expect(resolveSafeRoute("academy_tracks")).toBe("/dashboard/tracks");
      expect(resolveSafeRoute("tracks")).toBe("/dashboard/tracks");
    });

    it("resolves Level 2 routes with module query params", () => {
      expect(resolveSafeRoute("track_mcp_architecture")).toBe("/dashboard/tracks?module=mcp-architecture");
      expect(resolveSafeRoute("track_vision_multimodal")).toBe("/dashboard/tracks?module=vision-multimodal");
      expect(resolveSafeRoute("track_governance_rbac")).toBe("/dashboard/tracks?module=governance-rbac");
    });

    it("resolves Level 3 routes with section query params", () => {
      expect(resolveSafeRoute("track_mcp_visual_pulse")).toBe(
        "/dashboard/tracks?module=mcp-architecture&section=visual-pulse"
      );
      expect(resolveSafeRoute("track_mcp_scanner_lab")).toBe(
        "/dashboard/tracks?module=mcp-architecture&section=scanner-lab"
      );
      expect(resolveSafeRoute("track_vision_prompt_studio")).toBe(
        "/dashboard/tracks?module=vision-multimodal&section=prompt-studio"
      );
      expect(resolveSafeRoute("track_rbac_guardrails")).toBe(
        "/dashboard/tracks?module=governance-rbac&section=guardrails-matrix"
      );
    });
  });

  describe("3. Agent Navigation & Multi-Level Intent Handling", () => {
    it("guides user to Level 1 when asking about the track or academy", async () => {
      const res = await provider.processQuery("Me leva para a trilha de especialização", "student");
      expect(res.suggestedResource).toBe("academy_tracks");
      expect(res.message).toContain("Nível 1/3");
    });

    it("guides user to Level 2 when asking about specific modules", async () => {
      const resMcp = await provider.processQuery("Quero ir para o módulo de web mcp", "student");
      expect(resMcp.suggestedResource).toBe("track_mcp_architecture");
      expect(resMcp.message).toContain("Nível 2/3");

      const resVision = await provider.processQuery("Me leva para o módulo de visão multimodal", "student");
      expect(resVision.suggestedResource).toBe("track_vision_multimodal");
      expect(resVision.message).toContain("Nível 2/3");

      const resGov = await provider.processQuery("Abre o módulo de governança e rbac", "student");
      expect(resGov.suggestedResource).toBe("track_governance_rbac");
      expect(resGov.message).toContain("Nível 2/3");
    });

    it("guides user to Level 3 when asking for a specific sub-action or lab", async () => {
      const resPulse = await provider.processQuery("Abre o simulador de pulso visual", "student");
      expect(resPulse.suggestedResource).toBe("track_mcp_visual_pulse");
      expect(resPulse.message).toContain("Nível 3/3");

      const resScanner = await provider.processQuery("Quero fazer o laboratório de scanner semântico do dom", "student");
      expect(resScanner.suggestedResource).toBe("track_mcp_scanner_lab");
      expect(resScanner.message).toContain("Nível 3/3");

      const resPrompt = await provider.processQuery("Me leva para o prompt studio de ocr", "student");
      expect(resPrompt.suggestedResource).toBe("track_vision_prompt_studio");
      expect(resPrompt.message).toContain("Nível 3/3");

      const resGuardrails = await provider.processQuery("Mostra a matriz de guardrails", "student");
      expect(resGuardrails.suggestedResource).toBe("track_rbac_guardrails");
      expect(resGuardrails.message).toContain("Nível 3/3");
    });
  });
});
