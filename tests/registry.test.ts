import { resolveSafeRoute, isValidResourceId } from "../src/lib/navigation/registry";

describe("Safe Route Registry", () => {
  test("should resolve certificates resource to /dashboard/certificates", () => {
    const route = resolveSafeRoute("certificates");
    expect(route).toBe("/dashboard/certificates");
  });

  test("should resolve course_certificate with courseId context to specific route", () => {
    const route = resolveSafeRoute("course_certificate", { courseId: "react-avancado" });
    expect(route).toBe("/dashboard/courses/react-avancado/certificate");
  });

  test("should resolve continue_lesson with lessonId parameter", () => {
    const route = resolveSafeRoute("continue_lesson", {
      courseId: "react-avancado",
      lessonId: "hooks-avancados",
    });
    expect(route).toBe("/dashboard/courses/react-avancado?lesson=hooks-avancados");
  });

  test("should reject arbitrary or malicious resource IDs by returning null", () => {
    const maliciousRoute1 = resolveSafeRoute("https://evil-site.com");
    expect(maliciousRoute1).toBeNull();

    const maliciousRoute2 = resolveSafeRoute("javascript:alert(1)");
    expect(maliciousRoute2).toBeNull();

    const unknownRoute = resolveSafeRoute("unknown_random_id");
    expect(unknownRoute).toBeNull();
  });

  test("isValidResourceId should validate presence in registry", () => {
    expect(isValidResourceId("certificates")).toBe(true);
    expect(isValidResourceId("dashboard")).toBe(true);
    expect(isValidResourceId("hacked_url")).toBe(false);
  });
});
