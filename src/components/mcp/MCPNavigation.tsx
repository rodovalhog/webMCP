import React from "react";
import Link from "next/link";
import { AccessLevel, MCPActionType } from "@/lib/mcp/types";

export interface MCPNavigationProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  resource: string;
  resourceId?: string;
  action?: MCPActionType;
  description: string;
  access?: AccessLevel;
  parent?: string;
  title?: string;
  children: React.ReactNode;
}

/**
 * MCPNavigation Component
 * Wraps Next.js Link with semantic MCP navigation metadata
 */
export const MCPNavigation: React.FC<MCPNavigationProps> = ({
  href,
  resource,
  resourceId,
  action = "navigate",
  description,
  access = "student",
  parent,
  title,
  children,
  className,
  ...props
}) => {
  return (
    <Link
      href={href}
      data-mcp-resource={resource}
      data-mcp-resource-id={resourceId}
      data-mcp-action={action}
      data-mcp-description={description}
      data-mcp-access={access}
      data-mcp-parent={parent}
      data-mcp-target={href}
      data-mcp-title={title}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
};
