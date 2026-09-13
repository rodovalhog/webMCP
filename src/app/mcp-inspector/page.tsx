"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { scanSemanticDOM, buildSemanticTree, FALLBACK_SEMANTIC_RESOURCES } from "@/lib/mcp-dom/scanner";
import { mcpServer } from "@/lib/mcp/server";
import { routeRegistry, resolveSafeRoute } from "@/lib/navigation/registry";
import { SemanticResource, SemanticResourceMap } from "@/lib/mcp/types";
import { useAuth } from "@/context/AuthContext";
import {
  TerminalSquare,
  Search,
  Play,
  ArrowRight,
  Code2,
  Layers,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

export default function MCPInspectorPage() {
  const { role } = useAuth();
  const [resources, setResources] = useState<SemanticResourceMap>(FALLBACK_SEMANTIC_RESOURCES);
  const [selectedResourceId, setSelectedResourceId] = useState<string>("certificates");
  const [activeTab, setActiveTab] = useState<"dom-vs-json" | "tool-runner" | "route-registry" | "semantic-tree">("dom-vs-json");

  // Tool runner state
  const [toolName, setToolName] = useState("search_resources");
  const [toolQuery, setToolQuery] = useState("certificado");
  const [toolResult, setToolResult] = useState<unknown>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Route tester state
  const [testResourceId, setTestResourceId] = useState("course_certificate");
  const [testContext, setTestContext] = useState('{"courseId": "react-avancado"}');
  const [resolvedResult, setResolvedResult] = useState<string | null>(null);

  // Scan current DOM
  const refreshScan = () => {
    const scanned = scanSemanticDOM();
    setResources(scanned);
  };

  useEffect(() => {
    refreshScan();
  }, []);

  const selectedItem: SemanticResource | undefined = resources[selectedResourceId] || Object.values(resources)[0];

  // Execute selected MCP Tool live
  const handleExecuteTool = async () => {
    setIsExecuting(true);
    try {
      if (toolName === "search_resources") {
        const res = await mcpServer.searchResources({ query: toolQuery, role });
        setToolResult(res);
      } else if (toolName === "get_resource") {
        const res = await mcpServer.getResource({ resourceId: toolQuery });
        setToolResult(res);
      } else if (toolName === "navigate_to_resource") {
        const res = await mcpServer.navigateToResource({
          resourceId: toolQuery,
          role,
        });
        setToolResult(res);
      } else if (toolName === "get_current_context") {
        const res = await mcpServer.getCurrentContext();
        setToolResult(res);
      }
    } catch (err) {
      setToolResult({ error: String(err) });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleTestRoute = () => {
    try {
      const parsedCtx = testContext ? JSON.parse(testContext) : undefined;
      const route = resolveSafeRoute(testResourceId, parsedCtx);
      setResolvedResult(route);
    } catch {
      const route = resolveSafeRoute(testResourceId);
      setResolvedResult(route);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Dashboard</span>
            </Link>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Developer Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <TerminalSquare className="w-8 h-8 text-blue-400" />
            <span>MCP Semantic Inspector</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Inspeção em tempo real da camada semântica: veja como marcações no DOM são extraídas,
            sanitizadas e consumidas pelo servidor MCP sem envio de HTML bruto para o LLM.
          </p>
        </div>

        <button
          onClick={refreshScan}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          <span>Escanear DOM Novamente</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs sm:text-sm font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab("dom-vs-json")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition shrink-0 ${
              activeTab === "dom-vs-json" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>DOM vs. Semantic JSON</span>
          </button>
          <button
            onClick={() => setActiveTab("tool-runner")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition shrink-0 ${
              activeTab === "tool-runner" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Play className="w-4 h-4" />
            <span>MCP Tool Playground</span>
          </button>
          <button
            onClick={() => setActiveTab("route-registry")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition shrink-0 ${
              activeTab === "route-registry" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Safe Route Resolver</span>
          </button>
          <button
            onClick={() => setActiveTab("semantic-tree")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition shrink-0 ${
              activeTab === "semantic-tree" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Árvore Semântica</span>
          </button>
        </div>

        {/* TAB 1: DOM vs. Semantic JSON */}
        {activeTab === "dom-vs-json" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of scanned resources */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Recursos Detectados ({Object.keys(resources).length})
              </h2>
              <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
                {Object.values(resources).map((res) => (
                  <button
                    key={res.id}
                    onClick={() => setSelectedResourceId(res.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-center justify-between border ${
                      selectedResourceId === res.id
                        ? "bg-blue-600/20 border-blue-500/40 text-blue-300 font-semibold"
                        : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <div className="truncate max-w-[190px]">
                      <div className="font-mono text-white truncate">{res.id}</div>
                      <div className="text-[10px] text-slate-400 truncate">{res.description}</div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase">
                      {res.action}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison view */}
            <div className="lg:col-span-2 space-y-6">
              {/* HTML DOM Snippet */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Marcação Declarativa no DOM (HTML)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Decorated Component</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto leading-relaxed">
                  {`<!-- Elemento React / DOM renderizado -->\n<a\n  href="${selectedItem?.target || '/dashboard'}"\n  data-mcp-resource="${selectedItem?.resource}"${
                    selectedItem?.resourceId ? `\n  data-mcp-resource-id="${selectedItem.resourceId}"` : ""
                  }\n  data-mcp-action="${selectedItem?.action}"\n  data-mcp-description="${selectedItem?.description}"\n  data-mcp-access="${selectedItem?.access}"${
                    selectedItem?.parent ? `\n  data-mcp-parent="${selectedItem.parent}"` : ""
                  }\n>\n  ${selectedItem?.breadcrumbs[selectedItem.breadcrumbs.length - 1] || selectedItem?.resource}\n</a>`}
                </div>
              </div>

              {/* Extracted Semantic JSON */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Representação Semântica Extraída (Semantic DOM)</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Zero HTML Leak
                  </span>
                </div>
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                  {JSON.stringify(selectedItem, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MCP Tool Playground */}
        {activeTab === "tool-runner" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Config */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Executar Ferramenta MCP
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Ferramenta Selecionada</label>
                <select
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option value="search_resources">search_resources</option>
                  <option value="get_resource">get_resource</option>
                  <option value="navigate_to_resource">navigate_to_resource</option>
                  <option value="get_current_context">get_current_context</option>
                </select>
              </div>

              {toolName !== "get_current_context" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">
                    {toolName === "search_resources" ? "Query de Busca" : "resourceId"}
                  </label>
                  <input
                    type="text"
                    value={toolQuery}
                    onChange={(e) => setToolQuery(e.target.value)}
                    placeholder="Ex: certificado, progresso, course_react-avancado"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div>
                  <strong>Papel ativo para execução:</strong>{" "}
                  <span className="font-mono text-blue-400 capitalize">{role}</span>
                </div>
                <p>
                  O servidor MCP aplicará verificação de permissão e resolução determinística de rota.
                </p>
              </div>

              <button
                onClick={handleExecuteTool}
                disabled={isExecuting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition"
              >
                <Play className="w-4 h-4" />
                <span>{isExecuting ? "Executando..." : "Disparar Chamada MCP"}</span>
              </button>
            </div>

            {/* Output View */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Resposta do Servidor MCP
                </h3>
                {Boolean(toolResult) && (
                  <span className="text-[10px] font-mono text-emerald-400">Status 200 OK</span>
                )}
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto min-h-[260px] max-h-[460px] leading-relaxed">
                {toolResult ? JSON.stringify(toolResult, null, 2) : "// Clique em 'Disparar Chamada MCP' para testar..."}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: Safe Route Resolver */}
        {activeTab === "route-registry" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Simulador de Resolução de Rotas
              </h2>
              <p className="text-xs text-slate-400">
                A IA nunca gera URLs arbitrárias. Ela retorna um <code>resourceId</code> e parâmetros
                contextuais que são mapeados exclusivamente pelo nosso registro seguro.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">resourceId</label>
                <input
                  type="text"
                  value={testResourceId}
                  onChange={(e) => setTestResourceId(e.target.value)}
                  placeholder="Ex: course_certificate, my_courses, invalid_resource"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Contexto (JSON)</label>
                <input
                  type="text"
                  value={testContext}
                  onChange={(e) => setTestContext(e.target.value)}
                  placeholder='{"courseId": "react-avancado"}'
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <button
                onClick={handleTestRoute}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
              >
                Resolver Rota Segura
              </button>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Resultado da Resolução
              </h3>

              {resolvedResult ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Rota Autorizada e Registrada</span>
                  </div>
                  <div className="text-sm font-mono text-white bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {resolvedResult}
                  </div>
                </div>
              ) : resolvedResult === null ? (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                  Insira os parâmetros e clique em Resolver Rota.
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 space-y-1">
                  <strong>Bloqueado:</strong> O resourceId fornecido não existe no registro permitido. A
                  aplicação recusa navegar para destinos desconhecidos.
                </div>
              )}

              <div className="pt-2">
                <div className="text-xs font-bold text-slate-300 mb-2">Rotas Registradas no Registry:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                  {Object.keys(routeRegistry).map((key) => (
                    <div key={key} className="bg-slate-900 p-2 rounded border border-slate-800">
                      {key}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Semantic Tree */}
        {activeTab === "semantic-tree" && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Árvore de Recursos Hierárquica
            </h2>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
              <div className="text-blue-400 font-bold">Dashboard</div>
              <div className="pl-4 border-l border-slate-800 space-y-1 mt-1">
                <div>├── Courses (Meus Cursos)</div>
                <div className="pl-6 border-l border-slate-800 space-y-1">
                  <div>├── React Avançado</div>
                  <div className="pl-6 border-l border-slate-800 space-y-1">
                    <div>├── Lessons (Aulas & Módulos)</div>
                    <div>├── Exercises (Exercícios Práticos)</div>
                    <div>├── Assessment (Avaliação)</div>
                    <div className="text-amber-400">└── Certificate (Certificado Oficial)</div>
                  </div>
                  <div>├── Next.js 15 & Arquitetura</div>
                  <div className="text-purple-400">└── Criar Curso (Restrito a Professores)</div>
                </div>
                <div>├── Progress (Meu Progresso)</div>
                <div>├── Certificates (Central de Certificados)</div>
                <div>├── Profile (Meu Perfil)</div>
                <div>├── Settings (Configurações)</div>
                <div className="text-amber-400">└── Admin Panel (Restrito a Administradores)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
