"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Network,
  User,
  MessageSquare,
  Sparkles,
  Server,
  Layers,
  ShieldCheck,
  Database,
  ChevronLeft,
  ArrowDown,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface LayerStep {
  id: string;
  number: string;
  name: string;
  icon: React.ElementType;
  color: string;
  summary: string;
  details: string[];
  payloadExample?: string;
  guarantee: string;
}

export default function ArchitecturePage() {
  const [selectedLayerId, setSelectedLayerId] = useState<string>("semantic-dom");

  const layers: LayerStep[] = [
    {
      id: "user",
      number: "01",
      name: "User & Interaction",
      icon: User,
      color: "from-blue-500 to-cyan-500",
      summary: "Usuário interage através de linguagem natural livre dentro da plataforma.",
      details: [
        "Linguagem natural em português ou inglês (ex: 'Onde vejo meu certificado de React?').",
        "Não exige que o usuário decore menus, rotas profundas ou árvores de navegação complexas.",
        "Integração contextual: o usuário pode estar em qualquer tela da aplicação.",
      ],
      guarantee: "Sem atrito de navegação ou curva de aprendizado para novas funcionalidades.",
    },
    {
      id: "chat-ui",
      number: "02",
      name: "AI Chat Interface",
      icon: MessageSquare,
      color: "from-indigo-500 to-blue-500",
      summary: "Interface conversacional reativa equipada com cards de ação e caminhos em breadcrumbs.",
      details: [
        "Apresenta caminho hierárquico estruturado (Dashboard → Meus cursos → React Avançado → Certificado).",
        "Dispara chamadas de navegação segura através do roteador cliente do Next.js.",
        "Executa gatilho de destaque visual no DOM da página ativa.",
      ],
      guarantee: "Transparência total ao usuário com confirmação visual antes de navegar.",
    },
    {
      id: "ai-agent",
      number: "03",
      name: "AI Agent & Intent Parser",
      icon: Sparkles,
      color: "from-purple-500 to-indigo-500",
      summary: "Agente inteligente que interpreta a intenção e orquestra chamadas às ferramentas MCP.",
      details: [
        "Arquitetura plugável: pode operar com MockAIProvider, Gemini ou OpenAI.",
        "Recebe o resumo semântico dos recursos em vez do HTML bruto (economia de até 96% de tokens).",
        "Decide quais ferramentas MCP acionar para responder à dúvida do usuário.",
      ],
      payloadExample: `// Intent extraída pelo Agente:\n{\n  "intent": "search_resource",\n  "target": "course_certificate",\n  "course": "react-avancado"\n}`,
      guarantee: "Zero dependência fixa de um único provedor de LLM.",
    },
    {
      id: "mcp-client",
      number: "04",
      name: "MCP Client",
      icon: Server,
      color: "from-fuchsia-500 to-purple-500",
      summary: "Cliente leve que traduz as intenções do agente em chamadas tipadas do protocolo MCP.",
      details: [
        "Invoca as ferramentas search_resources, get_resource, navigate_to_resource.",
        "Garante passagem segura de contexto sem expor chaves privadas ou dados de outros usuários.",
      ],
      guarantee: "Conformidade com os padrões do Model Context Protocol.",
    },
    {
      id: "mcp-server",
      number: "05",
      name: "MCP Server (In-App)",
      icon: Server,
      color: "from-pink-500 to-rose-500",
      summary: "Servidor MCP embutido responsável por expor as ferramentas de navegação e busca semântica.",
      details: [
        "search_resources: pesquisa difusa contra a base semântica do DOM.",
        "get_current_context: fornece contexto do aluno (curso ativo, progresso, última aula).",
        "navigate_to_resource: avalia permissões e resolve rota segura no frontend.",
      ],
      payloadExample: `// Chamada de ferramenta MCP:\nmcpServer.searchResources({\n  query: "certificado",\n  role: "student"\n});`,
      guarantee: "Desacoplamento entre a lógica de IA e o código da interface visual.",
    },
    {
      id: "semantic-dom",
      number: "06",
      name: "Semantic DOM & Scanner",
      icon: Layers,
      color: "from-emerald-500 to-teal-500",
      summary: "Camada de anotação declarativa em HTML que transforma o DOM em um mapa semântico.",
      details: [
        "Componentes React reutilizáveis: <MCPResource />, <MCPAction />, <MCPNavigation />.",
        "Atributos data-mcp-resource, data-mcp-action, data-mcp-description, data-mcp-access.",
        "Scanner filtra e higieniza os nós para que nenhum HTML desnecessário chegue à IA.",
      ],
      payloadExample: `<!-- Elemento Declarativo -->\n<a\n  href="/dashboard/certificates"\n  data-mcp-resource="certificates"\n  data-mcp-action="navigate"\n  data-mcp-description="Visualizar certificados emitidos"\n>\n  Certificados\n</a>`,
      guarantee: "Zero vazamento de dados confidenciais (PII) e economia massiva de tokens.",
    },
    {
      id: "auth-engine",
      number: "07",
      name: "Application & Authorization Gate",
      icon: ShieldCheck,
      color: "from-amber-500 to-orange-500",
      summary: "Verificação de segurança e permissões por perfil (public, student, teacher, admin).",
      details: [
        "A IA NUNCA é a autoridade de segurança. O backend/aplicação valida as permissões.",
        "Mesmo que um recurso esteja no DOM ou a IA recomende, ações proibidas são bloqueadas.",
        "Exemplo: Alunos que pedem para 'criar curso' são rejeitados com ai.navigation.denied.",
      ],
      payloadExample: `// Verificação determinística de autorização:\nconst check = checkPermission(userRole, "create_course");\nif (!check.allowed) {\n  telemetry.track("ai.navigation.denied", { reason: check.reason });\n  return rejectionResponse;\n}`,
      guarantee: "Impossibilidade de bypass de segurança por alucinação ou prompt injection do LLM.",
    },
    {
      id: "backend",
      number: "08",
      name: "Backend & Safe Route Registry",
      icon: Database,
      color: "from-blue-600 to-indigo-600",
      summary: "Execução determinística através do Route Registry e serviços da aplicação.",
      details: [
        "Rotas mapeadas estritamente: resolveSafeRoute(resourceId, context).",
        "A IA nunca gera URLs livres (impede SSRF, XSS e redirecionamentos arbitrários).",
        "Registro de eventos na camada de Observabilidade para auditoria em tempo real.",
      ],
      payloadExample: `const routeRegistry = {\n  certificates: () => "/dashboard/certificates",\n  course: (ctx) => \`/dashboard/courses/\${ctx.courseId}\`,\n  course_certificate: (ctx) => \`/dashboard/courses/\${ctx.courseId}/certificate\`\n};`,
      guarantee: "Navegação 100% segura e previsível sob qualquer circunstância.",
    },
  ];

  const currentLayer = layers.find((l) => l.id === selectedLayerId) || layers[5];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Network className="w-8 h-8 text-indigo-400" />
            <span>Arquitetura do AI Navigation Layer</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Entenda como cada camada colabora para transformar uma aplicação web em um sistema
            navegável por agentes de IA com segurança, observabilidade e eficiência de tokens.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Architecture Flow Pipeline (Left Column) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
            Fluxo Completo de Execução
          </div>

          {layers.map((layer, index) => {
            const isSelected = layer.id === selectedLayerId;
            const Icon = layer.icon;

            return (
              <React.Fragment key={layer.id}>
                <button
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-slate-900 border-blue-500 shadow-lg shadow-blue-500/10 scale-[1.02]"
                      : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${layer.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-blue-400">
                          {layer.number}
                        </span>
                        <h2 className="text-sm font-bold text-white">{layer.name}</h2>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{layer.summary}</p>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full font-mono ${
                      isSelected
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold"
                        : "text-slate-600"
                    }`}
                  >
                    Detalhamento
                  </span>
                </button>

                {index < layers.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ArrowDown className="w-4 h-4 text-slate-700" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Layer Deep Dive (Right Column) */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 sticky top-8">
          <div className="flex items-start justify-between border-b border-slate-800 pb-5">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-blue-400">
                CAMADA {currentLayer.number} DE 08
              </span>
              <h2 className="text-2xl font-black text-white">{currentLayer.name}</h2>
              <p className="text-xs text-slate-300">{currentLayer.summary}</p>
            </div>
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentLayer.color} flex items-center justify-center text-white shadow-lg`}
            >
              <currentLayer.icon className="w-6 h-6" />
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Como Esta Camada Opera
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentLayer.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Code or Payload Example */}
          {currentLayer.payloadExample && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Exemplo de Código / Carga de Dados
              </h3>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                {currentLayer.payloadExample}
              </pre>
            </div>
          )}

          {/* Security & Architectural Guarantee */}
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center gap-3">
            <Lock className="w-5 h-5 text-blue-400 shrink-0" />
            <div className="text-xs text-slate-300">
              <strong className="text-blue-300">Garantia Arquitetural:</strong> {currentLayer.guarantee}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
