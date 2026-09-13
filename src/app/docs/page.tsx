"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileCode2,
  BookOpen,
  Shield,
  Zap,
  Terminal,
  Layers,
  ChevronLeft,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";

export default function DocsPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <FileCode2 className="w-8 h-8 text-blue-400" />
            <span>Documentação Técnica do AI Navigation Layer</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Guia completo de arquitetura, contratos de atributos semânticos, integração de ferramentas MCP,
            políticas de segurança e otimizações de performance.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-12 leading-relaxed text-sm">
        {/* Section 1: O que é AI Navigation Layer */}
        <section className="space-y-3 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-2.5 text-blue-400 font-bold uppercase text-xs tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>01. Visão Geral & Conceito</span>
          </div>
          <h2 className="text-xl font-bold text-white">O que é o AI Navigation Layer?</h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            O <strong>AI Navigation Layer</strong> é uma camada de engenharia que torna aplicações web
            compreensíveis e navegáveis por agentes de inteligência artificial sem necessidade de automações
            frágeis de tela (screen scraping) nem envio de código HTML massivo para modelos de linguagem.
          </p>
          <p className="text-slate-300 text-xs sm:text-sm">
            Através de metadados semânticos padronizados no DOM integrados a um servidor local do{" "}
            <strong>Model Context Protocol (MCP)</strong>, o agente descobre ferramentas disponíveis,
            entende a hierarquia da tela e conduz o usuário com segurança até o recurso desejado.
          </p>
        </section>

        {/* Section 2: Contrato Semântico */}
        <section className="space-y-4 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-2.5 text-purple-400 font-bold uppercase text-xs tracking-wider">
            <Layers className="w-4 h-4" />
            <span>02. Padrão de Semântica no DOM</span>
          </div>
          <h2 className="text-xl font-bold text-white">Atributos do Contrato MCP</h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Componentes visuais são decorados com atributos padronizados <code>data-mcp-*</code>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-blue-400 text-xs">data-mcp-resource</div>
              <p className="text-xs text-slate-400">
                Identifica o tipo de recurso de negócio (ex: <code>certificates</code>, <code>course</code>, <code>progress</code>).
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-blue-400 text-xs">data-mcp-resource-id</div>
              <p className="text-xs text-slate-400">
                Identificador específico da instância do recurso (ex: <code>react-avancado</code>).
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-blue-400 text-xs">data-mcp-action</div>
              <p className="text-xs text-slate-400">
                Ação permitida sobre o recurso: <code>navigate</code>, <code>open</code>, <code>view</code>, <code>execute</code>, <code>create</code>.
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-blue-400 text-xs">data-mcp-description</div>
              <p className="text-xs text-slate-400">
                Descrição semântica de alto nível destinada à compreensão do agente de IA.
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-blue-400 text-xs">data-mcp-access</div>
              <p className="text-xs text-slate-400">
                Nível de acesso esperado: <code>public</code>, <code>student</code>, <code>teacher</code>, <code>admin</code>.
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-blue-400 text-xs">data-mcp-parent</div>
              <p className="text-xs text-slate-400">
                Identificador do recurso pai, utilizado pelo scanner para construir a árvore e breadcrumbs.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Como criar um MCPResource */}
        <section className="space-y-4 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold uppercase text-xs tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>03. Guia de Implementação</span>
          </div>
          <h2 className="text-xl font-bold text-white">Como criar um &lt;MCPResource /&gt;</h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Para tornar qualquer componente existente navegável pela IA, envolva-o com <code>MCPResource</code> ou use <code>MCPNavigation</code>:
          </p>

          <pre className="bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`import { MCPResource } from "@/components/mcp/MCPResource";
import { MCPNavigation } from "@/components/mcp/MCPNavigation";

export function CertificateBadge() {
  return (
    <MCPResource
      resource="course_certificate"
      resourceId="react-avancado"
      action="view"
      description="Visualizar certificado emitido do curso React Avançado"
      parent="course_react-avancado"
      access="student"
      context={{ courseId: "react-avancado" }}
    >
      <MCPNavigation
        href="/dashboard/courses/react-avancado/certificate"
        resource="course_certificate"
        description="Acessar certificado"
      >
        <span>Ver Certificado</span>
      </MCPNavigation>
    </MCPResource>
  );
}`}
          </pre>
        </section>

        {/* Section 4: Segurança */}
        <section className="space-y-4 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-2.5 text-amber-400 font-bold uppercase text-xs tracking-wider">
            <Shield className="w-4 h-4" />
            <span>04. Segurança & Autorização</span>
          </div>
          <h2 className="text-xl font-bold text-white">Princípios Fundamentais de Segurança</h2>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30">
              <strong className="text-amber-400">1. A IA NUNCA é camada de autorização:</strong> O fato de um
              recurso estar visível no DOM ou ter sido mencionado em uma conversa não concede permissão de
              execução. O motor de autorização verifica o papel do usuário (RBAC) com validação estrita antes
              de permitir a navegação ou mutação.
            </div>

            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30">
              <strong className="text-blue-400">2. Safe Route Registry vs. URLs arbitrárias:</strong> A IA
              retorna apenas tokens tipados (<code>resourceId</code>). As URLs são resolvidas
              exclusivamente no código do cliente através do <code>routeRegistry</code>. Isso extingue riscos
              de Open Redirect, Server-Side Request Forgery (SSRF) ou injeção de links maliciosos gerados pelo modelo.
            </div>
          </div>
        </section>

        {/* Section 5: Performance & Tokens */}
        <section className="space-y-4 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-2.5 text-cyan-400 font-bold uppercase text-xs tracking-wider">
            <Zap className="w-4 h-4" />
            <span>05. Economia de Tokens & Performance</span>
          </div>
          <h2 className="text-xl font-bold text-white">Por que não enviar todo o HTML para a IA?</h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Uma página web típica carrega entre <strong>15.000 e 80.000 tokens</strong> de HTML, SVG, estilos inline
            e scripts. Enviar esse volume para cada consulta do usuário provoca:
          </p>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Custo proibitivo de API por requisição.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Latência elevada (2 a 5 segundos extras de processamento).</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Risco de vazamento de dados confidenciais (PII) renderizados na tela.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Alucinação do modelo por excesso de ruído visual.</span>
            </li>
          </ul>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
            Com o MCP DOM Scanner, o payload enviado ao agente é reduzido para menos de <strong>350 tokens</strong>,
            representando uma <strong>economia de 96% a 99%</strong> de consumo computacional.
          </div>
        </section>
      </div>
    </div>
  );
}
