"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
  Layers,
  Network,
  Activity,
  Award,
  CheckCircle2,
  Code2,
  Lock,
  Compass,
} from "lucide-react";
import { useAI } from "@/context/AIContext";

export default function LandingPage() {
  const { toggleChat } = useAI();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <span className="font-black text-lg tracking-tight text-white">
              LearnFlow <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition">Como Funciona</a>
            <a href="#benefits" className="hover:text-white transition">Benefícios</a>
            <a href="#dx" className="hover:text-white transition">Developer Experience</a>
            <Link href="/architecture" className="hover:text-white transition">Arquitetura</Link>
            <Link href="/mcp-inspector" className="hover:text-white transition">MCP Inspector</Link>
            <Link href="/observability" className="hover:text-white transition">Observabilidade</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition flex items-center gap-1.5"
            >
              <span>Acessar Plataforma</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs text-slate-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-semibold text-blue-400">AI Navigation Layer</span>
            <span className="text-slate-500">•</span>
            <span>Semantic DOM + MCP + Safe Execution</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Make your web application{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              AI-navigable.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Dê a agentes de IA uma compreensão semântica profunda da sua aplicação através de uma
            camada nativa no DOM integrada ao protocolo MCP. Sem scrapers frágeis, sem envio de HTML
            bruto e com segurança determinística.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Experimentar Demonstração</span>
            </Link>
            <Link
              href="/architecture"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <Network className="w-4 h-4 text-slate-400" />
              <span>Ver Arquitetura Técnica</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Showcase Preview Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-20">
        <div className="glass-panel-glow p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-mono text-blue-400 font-bold uppercase">Demonstração Interativa</div>
              <h2 className="text-xl font-bold text-white">Como o usuário vivencia a IA navegando pela aplicação</h2>
            </div>
            <button
              onClick={toggleChat}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Abrir AI Navigator Chat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Simulation Dialogue */}
            <div className="space-y-4">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-slate-500">USUÁRIO PERGUNTA:</div>
                <div className="text-sm font-semibold text-white">"Onde vejo meu certificado de React?"</div>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-2xl border border-blue-500/30 space-y-3">
                <div className="text-[11px] font-mono text-blue-400 flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RESPOSTA DO ASSISTENTE COM NAVEGAÇÃO ASSISTIDA:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Encontrei seu certificado emitido com autenticação digital. Destaquei sua localização na tela:
                </p>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-blue-300 flex items-center gap-1 flex-wrap">
                  <span>Dashboard</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>Meus cursos</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>React Avançado</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span className="font-bold text-amber-400">Certificado</span>
                </div>
                <div className="pt-1 flex items-center gap-2">
                  <Link
                    href="/dashboard/courses/react-avancado/certificate"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Abrir Certificado</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Visual Highlighting Representation */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="text-xs font-mono text-slate-500 uppercase">
                DESTAQUE VISUAL DINÂMICO NO DOM
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
                  Dashboard
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
                  Meus Cursos
                </div>
                <div className="p-3.5 rounded-xl bg-blue-900/30 border-2 border-blue-500 text-white font-bold flex items-center justify-between relative shadow-lg shadow-blue-500/20">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Certificados</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500 text-white animate-pulse">
                    ✦ AI Target
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
                  Meu Progresso
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section id="how-it-works" className="py-20 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center space-y-2">
            <div className="text-xs font-mono text-blue-400 uppercase font-bold">Arquitetura de 5 Passos</div>
            <h2 className="text-3xl font-extrabold text-white">Como o Sistema Opera</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Cada componente da aplicação colabora para uma experiência de navegação assistida ultra-eficiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: "01",
                title: "Semantic HTML",
                desc: "Elementos decorados com atributos declarativos data-mcp-*.",
                icon: Code2,
              },
              {
                step: "02",
                title: "DOM Scanner",
                desc: "Biblioteca cliente que extrai apenas os metadados de recursos essenciais.",
                icon: Layers,
              },
              {
                step: "03",
                title: "MCP Server",
                desc: "Expõe ferramentas padronizadas para pesquisa difusa e contexto.",
                icon: Terminal,
              },
              {
                step: "04",
                title: "AI Agent",
                desc: "Dedução de intenção via prompts leves sem HTML massivo.",
                icon: Sparkles,
              },
              {
                step: "05",
                title: "Safe Navigation",
                desc: "Roteador determinístico e validação estrita de permissões.",
                icon: ShieldCheck,
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative group hover:border-blue-500/50 transition"
              >
                <div className="text-2xl font-black text-slate-700 group-hover:text-blue-500 transition font-mono">
                  {s.step}
                </div>
                <s.icon className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="benefits" className="py-20 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="text-center space-y-2">
            <div className="text-xs font-mono text-purple-400 uppercase font-bold">Vantagens de Engenharia</div>
            <h2 className="text-3xl font-extrabold text-white">Por que o AI Navigation Layer?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">96% de Economia de Tokens</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Em vez de despejar dezenas de milhares de tokens de HTML cru no modelo, apenas as tags
                semânticas limpas são transferidas.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Zero Bypass de Autorização</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A IA nunca decide quem tem acesso. Todas as requisições passam por verificação RBAC antes da
                resolução da rota.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Total Observabilidade</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitore latências, buscas semânticas, recursos encontrados e bloqueios de segurança através
                de um barramento de telemetria nativo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Experience (DX) Code Snippet */}
      <section id="dx" className="py-20 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="text-xs font-mono text-emerald-400 uppercase font-bold">Developer Experience</div>
            <h2 className="text-3xl font-extrabold text-white">Simplicidade de Adoção</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Adicione semântica a qualquer elemento React com uma API declarativa idêntica a tags HTML convencionais.
            </p>
          </div>

          <pre className="bg-slate-950 p-6 rounded-3xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed shadow-2xl">
{`<MCPResource
  resource="certificates"
  action="navigate"
  description="Visualizar certificados emitidos dos cursos concluídos"
  access="student"
  parent="dashboard"
>
  <Link href="/dashboard/certificates">
    Meus Certificados
  </Link>
</MCPResource>`}
          </pre>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="font-bold text-slate-300">
            LearnFlow AI — Web MCP Semantic Navigator Portfolio Project
          </div>
          <div className="flex justify-center gap-6 text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
            <Link href="/mcp-inspector" className="hover:text-white transition">Inspector</Link>
            <Link href="/architecture" className="hover:text-white transition">Arquitetura</Link>
            <Link href="/observability" className="hover:text-white transition">Observabilidade</Link>
            <Link href="/docs" className="hover:text-white transition">Documentação</Link>
          </div>
          <div>Desenvolvido com Next.js, React, TypeScript, Tailwind CSS e Model Context Protocol.</div>
        </div>
      </footer>
    </div>
  );
}
