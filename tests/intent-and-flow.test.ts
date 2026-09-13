import { aiService } from "../src/lib/ai/service";

describe("AI Semantic Navigation E2E Integration Flow", () => {
  test("Flow 1: User asks for React certificate -> AI identifies resource -> generates assisted navigation card", async () => {
    const userPrompt = "Onde vejo meu certificado do React?";
    const response = await aiService.handleUserMessage(userPrompt, "student");

    expect(response.sender).toBe("assistant");
    expect(response.navigationCard).toBeDefined();
    expect(response.navigationCard?.isAuthorized).toBe(true);
    expect(response.navigationCard?.targetRoute).toBe("/dashboard/courses/react-avancado/certificate");
    expect(response.navigationCard?.breadcrumbs).toContain("React Avançado");
    expect(response.navigationCard?.breadcrumbs).toContain("Certificado");
  });

  test("Flow 2: User asks to continue learning -> AI uses learner context -> provides continue lesson action", async () => {
    const userPrompt = "Quero continuar a aula que estava fazendo";
    const response = await aiService.handleUserMessage(userPrompt, "student");

    expect(response.content).toContain("Hooks avançados");
    expect(response.content).toContain("72%");
    expect(response.navigationCard?.resourceId).toBe("continue_lesson");
    expect(response.navigationCard?.targetRoute).toContain("lesson=hooks-avancados");
  });

  test("Flow 3: User asks to create a course as student -> AI identifies intent -> Auth Gate denies action", async () => {
    const userPrompt = "Quero criar um curso";
    const response = await aiService.handleUserMessage(userPrompt, "student");

    expect(response.navigationCard).toBeDefined();
    expect(response.navigationCard?.isAuthorized).toBe(false);
    expect(response.navigationCard?.denialReason).toContain("Você não possui permissão para criar cursos");
  });

  test("Flow 4: User asks to create a course as teacher -> AI identifies intent -> Auth Gate authorizes action", async () => {
    const userPrompt = "Quero criar um curso";
    const response = await aiService.handleUserMessage(userPrompt, "teacher");

    expect(response.navigationCard).toBeDefined();
    expect(response.navigationCard?.isAuthorized).toBe(true);
    expect(response.navigationCard?.targetRoute).toBe("/dashboard/courses/new");
  });
});
