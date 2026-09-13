/**
 * Highlights a resource in the active DOM when found by the AI navigator.
 * Applies a pulsating glow, smooth scroll into view, and a floating badge.
 */
export function highlightMCPResource(resourceId: string): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  // Normalize ID (handle formats like "certificates" or "course_react-avancado" or "react-avancado")
  const cleanId = resourceId.trim();

  // Try multiple selector patterns to reliably match the element
  const selectors = [
    `[data-mcp-resource="${cleanId}"]`,
    `[data-mcp-resource-id="${cleanId}"]`,
    `[data-mcp-resource="${cleanId.replace('course_', '')}"]`,
    `[data-mcp-resource="course"][data-mcp-resource-id="${cleanId.replace('course_', '')}"]`,
    `[data-mcp-resource="course_certificate"][data-mcp-resource-id="${cleanId.replace('certificate_', '')}"]`,
    `#mcp-${cleanId}`,
  ];

  let targetElement: HTMLElement | null = null;
  for (const selector of selectors) {
    try {
      const match = document.querySelector<HTMLElement>(selector);
      if (match) {
        targetElement = match;
        break;
      }
    } catch {
      // ignore selector syntax errors
    }
  }

  if (!targetElement) {
    return false;
  }

  // Smoothly center the element in view
  targetElement.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });

  // Remove existing highlights
  document.querySelectorAll(".mcp-highlight-pulse").forEach((el) => {
    el.classList.remove("mcp-highlight-pulse");
  });
  document.querySelectorAll(".mcp-highlight-badge").forEach((el) => {
    el.remove();
  });

  // Add highlighting class
  targetElement.classList.add("mcp-highlight-pulse");

  // Create temporary floating badge
  const badge = document.createElement("div");
  badge.className = "mcp-highlight-badge";
  badge.innerHTML = `
    <span class="mcp-badge-icon">✦</span>
    <span>Recurso identificado pela IA</span>
  `;

  // Position badge relative to element
  const originalPosition = window.getComputedStyle(targetElement).position;
  if (originalPosition === "static") {
    targetElement.style.position = "relative";
  }
  targetElement.appendChild(badge);

  // Auto remove after 5 seconds
  setTimeout(() => {
    targetElement?.classList.remove("mcp-highlight-pulse");
    badge.remove();
    if (originalPosition === "static") {
      targetElement.style.position = "";
    }
  }, 5000);

  return true;
}
