import { checkPermission } from "../src/lib/mcp/permissions";

describe("Permission Validation Engine", () => {
  test("should allow student to access standard student resources", () => {
    const checkCert = checkPermission("student", "certificates");
    expect(checkCert.allowed).toBe(true);

    const checkProgress = checkPermission("student", "progress");
    expect(checkProgress.allowed).toBe(true);

    const checkCourse = checkPermission("student", "course");
    expect(checkCourse.allowed).toBe(true);
  });

  test("should deny student access to teacher-only resources like create_course", () => {
    const result = checkPermission("student", "create_course", "create");
    expect(result.allowed).toBe(false);
    expect(result.requiredRole).toBe("teacher");
    expect(result.reason).toContain("Você não possui permissão para criar cursos");
  });

  test("should allow teacher to access create_course", () => {
    const result = checkPermission("teacher", "create_course", "create");
    expect(result.allowed).toBe(true);
  });

  test("should deny student access to student_registration and allow teacher/admin", () => {
    const studentResult = checkPermission("student", "student_registration", "create");
    expect(studentResult.allowed).toBe(false);
    expect(studentResult.requiredRole).toBe("teacher");
    expect(studentResult.reason).toContain("Você não possui permissão para cadastrar alunos");

    const teacherResult = checkPermission("teacher", "student_registration", "create");
    expect(teacherResult.allowed).toBe(true);

    const adminResult = checkPermission("admin", "student_registration", "create");
    expect(adminResult.allowed).toBe(true);
  });

  test("should deny student and teacher access to admin_panel", () => {
    const studentCheck = checkPermission("student", "admin_panel");
    expect(studentCheck.allowed).toBe(false);

    const teacherCheck = checkPermission("teacher", "admin_panel");
    expect(teacherCheck.allowed).toBe(false);

    const adminCheck = checkPermission("admin", "admin_panel");
    expect(adminCheck.allowed).toBe(true);
  });
});
