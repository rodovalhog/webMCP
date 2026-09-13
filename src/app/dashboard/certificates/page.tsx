"use client";

import React from "react";
import Link from "next/link";
import { MCPResource } from "@/components/mcp/MCPResource";
import { MCPNavigation } from "@/components/mcp/MCPNavigation";
import { Award, Download, ExternalLink, Calendar, CheckCircle2, Sparkles } from "lucide-react";

export default function CertificatesHubPage() {
  const certificates = [
    {
      id: "react-avancado",
      title: "React Avançado: Hooks, Performance & Arquitetura",
      date: "11/09/2026",
      hours: "32h",
      code: "LF-CERT-REACT-AVANCADO-2026-9842",
      badge: "Frontend Specialist",
    },
    {
      id: "typescript-expert",
      title: "TypeScript Ninja: Arquitetura e Tipagem Estática",
      date: "04/08/2026",
      hours: "18h",
      code: "LF-CERT-TYPESCRIPT-2026-3310",
      badge: "Type Systems",
    },
    {
      id: "mcp-ai-engineering",
      title: "AI Agents & Model Context Protocol (MCP)",
      date: "15/07/2026",
      hours: "24h",
      code: "LF-CERT-MCP-AGENT-2026-1189",
      badge: "AI Engineering",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Central de Certificados</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualize, compartilhe e faça download dos seus certificados oficiais com verificação digital.
            </p>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <MCPResource
            key={cert.id}
            id={`mcp-cert-item-${cert.id}`}
            resource="course_certificate"
            resourceId={cert.id}
            action="view"
            description={`Visualizar certificado oficial de ${cert.title}`}
            parent="certificates"
            context={{ courseId: cert.id, code: cert.code }}
            className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {cert.badge}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {cert.date}
                </span>
              </div>

              <h2 className="text-base font-bold text-white leading-snug">{cert.title}</h2>
              <div className="text-xs text-slate-400">Carga Horária: {cert.hours}</div>
              <div className="text-[10px] font-mono text-slate-500 bg-slate-900/80 p-1.5 rounded border border-slate-800 break-all">
                {cert.code}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Autenticado</span>
              </span>

              <MCPNavigation
                href={`/dashboard/courses/${cert.id}/certificate`}
                resource="course_certificate"
                resourceId={cert.id}
                description={`Acessar certificado de ${cert.title}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
              >
                <span>Visualizar</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </MCPNavigation>
            </div>
          </MCPResource>
        ))}
      </div>
    </div>
  );
}
