import { mcpServer } from "../src/lib/mcp/server";

describe("MCP Server Tools", () => {
  test("search_resources should find matching resources by natural language keyword", async () => {
    const result = await mcpServer.searchResources({ query: "certificado" });
    expect(result.resources.length).toBeGreaterThan(0);
    const hasCert = result.resources.some(
      (r) => r.id.includes("certificate") || r.description.toLowerCase().includes("certificado")
    );
    expect(hasCert).toBe(true);
  });

  test("get_resource should return resource details for a valid ID", async () => {
    const result = await mcpServer.getResource({ resourceId: "certificates" });
    expect(result.resource).not.toBeNull();
    expect(result.resource?.action).toBe("navigate");
  });

  test("get_current_context should return learner state and active course", async () => {
    const context = await mcpServer.getCurrentContext();
    expect(context.user.name).toBe("Guilherme Rodovalho");
    expect(context.activeCourse.id).toBe("react-avancado");
    expect(context.activeCourse.progress).toBe(72);
  });

  test("navigate_to_resource should allow authorized student navigation", async () => {
    const nav = await mcpServer.navigateToResource({
      resourceId: "certificates",
      role: "student",
    });
    expect(nav.success).toBe(true);
    expect(nav.authorized).toBe(true);
    expect(nav.resolvedRoute).toBe("/dashboard/certificates");
  });

  test("navigate_to_resource should deny unauthorized action for student", async () => {
    const nav = await mcpServer.navigateToResource({
      resourceId: "create_course",
      role: "student",
    });
    expect(nav.success).toBe(false);
    expect(nav.authorized).toBe(false);
    expect(nav.message).toContain("Você não possui permissão para criar cursos");
  });
});
