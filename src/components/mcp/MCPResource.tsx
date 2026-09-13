import React from "react";
import { AccessLevel, MCPActionType } from "@/lib/mcp/types";

export interface MCPResourceProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  resource: string;
  resourceId?: string;
  action?: MCPActionType;
  description: string;
  access?: AccessLevel;
  parent?: string;
  context?: Record<string, unknown> | string;
  target?: string;
  title?: string;
  children: React.ReactNode;
}

/**
 * MCPResource Component
 * Exposes declarative AI-navigable metadata directly to the DOM via data-mcp-* attributes.
 */
export const MCPResource: React.FC<MCPResourceProps> = ({
  as: Component = "div",
  resource,
  resourceId,
  action = "navigate",
  description,
  access = "student",
  parent,
  context,
  target,
  title,
  children,
  className,
  ...props
}) => {
  const contextString = typeof context === "object" ? JSON.stringify(context) : context;

  return (
    <Component
      data-mcp-resource={resource}
      data-mcp-resource-id={resourceId}
      data-mcp-action={action}
      data-mcp-description={description}
      data-mcp-access={access}
      data-mcp-parent={parent}
      data-mcp-context={contextString}
      data-mcp-target={target}
      data-mcp-title={title}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};
