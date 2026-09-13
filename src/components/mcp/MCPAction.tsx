import React from "react";
import { AccessLevel, MCPActionType } from "@/lib/mcp/types";

export interface MCPActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  resource: string;
  resourceId?: string;
  action: MCPActionType;
  description: string;
  access?: AccessLevel;
  parent?: string;
  context?: Record<string, unknown> | string;
  children: React.ReactNode;
}

/**
 * MCPAction Component
 * Specifically marks interactive action buttons with semantic metadata for AI execution.
 */
export const MCPAction: React.FC<MCPActionProps> = ({
  resource,
  resourceId,
  action,
  description,
  access = "student",
  parent,
  context,
  children,
  className,
  ...props
}) => {
  const contextString = typeof context === "object" ? JSON.stringify(context) : context;

  return (
    <button
      data-mcp-resource={resource}
      data-mcp-resource-id={resourceId}
      data-mcp-action={action}
      data-mcp-description={description}
      data-mcp-access={access}
      data-mcp-parent={parent}
      data-mcp-context={contextString}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};
