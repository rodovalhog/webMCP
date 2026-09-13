import React from "react";

export interface MCPContextProps extends React.HTMLAttributes<HTMLDivElement> {
  contextName: string;
  contextData: Record<string, unknown> | string;
  children: React.ReactNode;
}

/**
 * MCPContext Component
 * Wraps DOM subtrees to expose shared domain context (e.g. current course, module, exam session)
 */
export const MCPContext: React.FC<MCPContextProps> = ({
  contextName,
  contextData,
  children,
  className,
  ...props
}) => {
  const contextString = typeof contextData === "object" ? JSON.stringify(contextData) : contextData;

  return (
    <div
      data-mcp-context-container={contextName}
      data-mcp-context={contextString}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};
