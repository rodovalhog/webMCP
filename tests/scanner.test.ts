import { scanSemanticDOM, buildSemanticTree, FALLBACK_SEMANTIC_RESOURCES } from "../src/lib/mcp-dom/scanner";

describe("MCP DOM Scanner", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("should extract semantic resources from decorated DOM elements", () => {
    document.body.innerHTML = `
      <div id="container">
        <a
          id="cert-link"
          href="/dashboard/certificates"
          data-mcp-resource="certificates"
          data-mcp-action="navigate"
          data-mcp-description="Visualizar certificados dos cursos concluídos"
          data-mcp-access="student"
          data-mcp-parent="dashboard"
        >
          Meus Certificados
        </a>
      </div>
    `;

    const resources = scanSemanticDOM();
    expect(resources["certificates"]).toBeDefined();
    expect(resources["certificates"].action).toBe("navigate");
    expect(resources["certificates"].description).toBe("Visualizar certificados dos cursos concluídos");
    expect(resources["certificates"].access).toBe("student");
  });

  test("should correctly build breadcrumb hierarchy from parent attribute", () => {
    document.body.innerHTML = `
      <div
        data-mcp-resource="courses"
        data-mcp-title="Meus Cursos"
        data-mcp-parent="dashboard"
      ></div>
      <div
        data-mcp-resource="course"
        data-mcp-resource-id="react-avancado"
        data-mcp-title="React Avançado"
        data-mcp-parent="courses"
      ></div>
      <div
        data-mcp-resource="course_certificate"
        data-mcp-resource-id="react-avancado"
        data-mcp-title="Certificado"
        data-mcp-parent="course_react-avancado"
      ></div>
    `;

    const resources = scanSemanticDOM();
    const certResource = resources["course_certificate_react-avancado"];
    expect(certResource).toBeDefined();
    expect(certResource.breadcrumbs).toEqual(["Dashboard", "Meus Cursos", "React Avançado", "Certificado"]);
  });

  test("should fallback gracefully if DOM is empty", () => {
    const resources = scanSemanticDOM();
    expect(resources["dashboard"]).toBeDefined();
    expect(resources["certificates"]).toBeDefined();
    expect(resources["react_advanced"]).toBeDefined();
  });

  test("should assemble a hierarchical semantic tree", () => {
    const tree = buildSemanticTree(FALLBACK_SEMANTIC_RESOURCES);
    expect(tree.length).toBeGreaterThan(0);
    const dashboardNode = tree.find((n) => n.id === "dashboard");
    expect(dashboardNode).toBeDefined();
  });
});
