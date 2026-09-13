"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  MessageSquare,
  Layers,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  CheckCircle2,
  Eye,
  Activity,
  Lightbulb,
  MousePointerClick,
  HelpCircle,
  Code2,
  Lock,
  Play,
  RotateCcw,
} from "lucide-react";

import InteractiveFlowchart from "@/components/mcp/InteractiveFlowchart";

interface StepSimulation {
  id: string;
  userPrompt: string;
  userRole: "student" | "admin";
  toolName: string;
  resourceId: string;
  targetRoute: string;
  authorized: boolean;
  explanation: string;
  aiThought: string;
  payloadSent: string;
  buttonLabel: string;
}

const SIMULATIONS: StepSimulation[] = [
  {
    id: "certificates",
    userPrompt: "Onde vejo meus certificados?",
    userRole: "student",
    toolName: "navigate_to_resource",
    resourceId: "certificates",
    targetRoute: "/dashboard/certificates",
    authorized: true,
    explanation:
      "A IA reconhece a intenção de consultar certificados, consulta as ferramentas MCP declaradas na página, valida permissões de aluno e disponibiliza o botão seguro para navegação.",
    aiThought:
      "O usuário pediu para ver certificados. A ferramenta 'navigate_to_resource' com resourceId='certificates' atende perfeitamente à solicitação.",
    payloadSent: JSON.stringify(
      { tool: "navigate_to_resource", arguments: { resourceId: "certificates" } },
      null,
      2
    ),
    buttonLabel: "Ir para Central de Certificados",
  },
  {
    id: "admin-denied",
    userPrompt: "Quero acessar o painel de administrador para gerenciar alunos",
    userRole: "student",
    toolName: "navigate_to_resource",
    resourceId: "admin_panel",
    targetRoute: "/dashboard/admin",
    authorized: false,
    explanation:
      "A IA entende o pedido, mas o Servidor MCP atua como guardião de segurança (RBAC) e bloqueia a ação porque o usuário logado possui papel de 'student' (aluno) e o recurso exige 'admin'.",
    aiThought:
      "O usuário pediu o painel administrativo. Vou solicitar a ferramenta com resourceId='admin_panel'. O servidor MCP decidirá se autoriza.",
    payloadSent: JSON.stringify(
      { tool: "navigate_to_resource", arguments: { resourceId: "admin_panel" } },
      null,
      2
    ),
    buttonLabel: "Ação Bloqueada: Requer Papel Administrador",
  },
  {
    id: "continue-lesson",
    userPrompt: "Quero continuar a aula que estava fazendo",
    userRole: "student",
    toolName: "navigate_to_resource",
    resourceId: "continue_lesson",
    targetRoute: "/dashboard/courses/react-avancado?lesson=hooks-avancados",
    authorized: true,
    explanation:
      "O MCP consulta o contexto do aluno ativo (React Avançado - 72%), monta a URL exata com o parâmetro da aula pendente e entrega o botão pronto para retomar os estudos.",
    aiThought:
      "Consultei o contexto do aluno via MCP: curso ativo é 'react-avancado' e aula pendente é 'hooks-avancados'. Invocando 'continue_lesson'.",
    payloadSent: JSON.stringify(
      {
        tool: "navigate_to_resource",
        arguments: { resourceId: "continue_lesson", courseId: "react-avancado", lessonId: "hooks-avancados" },
      },
      null,
      2
    ),
    buttonLabel: "Retomar Aula: Hooks Avançados",
  },
];

export default function HowItWorksPage() {
  const [selectedSim, setSelectedSim] = useState<StepSimulation>(SIMULATIONS[0]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const runSimulation = (sim: StepSimulation) => {
    setSelectedSim(sim);
    setCurrentStep(1);
    setIsSimulating(true);

    let step = 1;
    const interval = setInterval(() => {
      step += 1;
      if (step <= 5) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-12">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto space-y-4 border-b border-slate-800 pb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar ao Dashboard</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Explicação Visual & Interativa</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Como Funciona a Navegação via Web MCP?
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Descubra o passo a passo exato do que acontece nos bastidores desde o momento em que você faz uma
              pergunta em linguagem natural até o clique no botão que o Web MCP gera para levar você ao lugar certo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="#interactive-flowchart"
              className="px-3.5 py-2 rounded-xl bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600/30 text-xs font-semibold text-blue-300 transition flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ver Fluxograma</span>
            </a>
            <Link
              href="/mcp-inspector"
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5 shadow-sm"
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Inspetor</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold text-white transition flex items-center gap-1.5 shadow-md"
            >
              <Play className="w-4 h-4" />
              <span>Testar no Site</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Analogia do Dia a Dia */}
      <section className="max-w-5xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">A Analogia do Restaurante de Luxo</h2>
            <p className="text-xs text-slate-400">Para entender o conceito em 30 segundos sem termos técnicos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
              <span>1. Você é o Cliente</span>
            </div>
            <p>
              Você chega ao restaurante e diz: <em>"Quero comer algo com massa e queijo artesanal"</em>. Você não
              precisa saber a receita secreta nem entrar na cozinha para procurar as panelas.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="font-bold text-purple-300 text-sm flex items-center gap-1.5">
              <span>2. O Garçom Inteligente (A IA)</span>
            </div>
            <p>
              O garçom entende o seu gosto e consulta o <strong>Cardápio Padronizado (MCP)</strong>. Ele não inventa um
              prato imaginário: ele seleciona exatamente o código oficial <code>PRATO #42: Fettuccine Alfredo</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
              <span>3. A Cozinha Segura (Web MCP)</span>
            </div>
            <p>
              A cozinha confere seu pedido, checa se você tem autorização, prepara a mesa exata e entrega o prato na
              sua frente com uma plaquinha iluminada. Você só precisa saborear!
            </p>
          </div>
        </div>
      </section>

      {/* Fluxograma Interativo do Web MCP */}
      <section className="max-w-5xl mx-auto">
        <InteractiveFlowchart />
      </section>

      {/* Simulador Interativo do Ciclo de Vida */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Compass className="w-6 h-6 text-blue-400" />
              <span>Simulador Interativo do Ciclo de Vida</span>
            </h2>
            <p className="text-xs text-slate-400">
              Escolha uma situação real abaixo e clique para ver cada fase se acendendo em tempo real.
            </p>
          </div>

          {/* Situation Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {SIMULATIONS.map((sim) => (
              <button
                key={sim.id}
                onClick={() => runSimulation(sim)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  selectedSim.id === sim.id
                    ? "bg-blue-600 text-white border-blue-500 shadow-md"
                    : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
                }`}
              >
                {sim.id === "certificates"
                  ? "Caso A: Certificados (Autorizado)"
                  : sim.id === "admin-denied"
                  ? "Caso B: Painel Admin (Bloqueado)"
                  : "Caso C: Retomar Aula"}
              </button>
            ))}
          </div>
        </div>

        {/* 5-Step Visual Stepper Tracker */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { step: 1, title: "1. Pergunta", desc: "Usuário expressa a intenção", icon: MessageSquare },
            { step: 2, title: "2. Semântica", desc: "MCP descobre os recursos", icon: Layers },
            { step: 3, title: "3. Raciocínio", desc: "IA emite a chamada de ferramenta", icon: Cpu },
            { step: 4, title: "4. Guardião", desc: "Validação RBAC & Rota Segura", icon: Lock },
            { step: 5, title: "5. Navegação", desc: "Transição e realce no DOM", icon: MousePointerClick },
          ].map((item) => (
            <div
              key={item.step}
              onClick={() => setCurrentStep(item.step)}
              className={`p-4 rounded-2xl border transition cursor-pointer relative overflow-hidden ${
                currentStep === item.step
                  ? "bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10"
                  : currentStep > item.step
                  ? "bg-slate-900/90 border-emerald-500/40 text-slate-200"
                  : "bg-slate-900/40 border-slate-800/80 text-slate-500 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <item.icon
                  className={`w-5 h-5 ${
                    currentStep === item.step
                      ? "text-blue-400 animate-pulse"
                      : currentStep > item.step
                      ? "text-emerald-400"
                      : "text-slate-600"
                  }`}
                />
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    currentStep === item.step
                      ? "bg-blue-500 text-white font-bold"
                      : currentStep > item.step
                      ? "bg-emerald-500/20 text-emerald-400 font-bold"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {currentStep > item.step ? "✓" : `0${item.step}`}
                </span>
              </div>
              <div className="font-bold text-xs text-white">{item.title}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Active Step Detailed Inspector View */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                {currentStep}
              </span>
              <div>
                <h3 className="font-bold text-base text-white">
                  {currentStep === 1 && "Fase 1: O Usuário Faz a Pergunta em Linguagem Humana"}
                  {currentStep === 2 && "Fase 2: A Camada de Semântica Invisível (Semantic DOM Layer)"}
                  {currentStep === 3 && "Fase 3: O Raciocínio da IA & Seleção de Ferramenta (Tool Calling)"}
                  {currentStep === 4 && "Fase 4: O Guardião de Permissões & Roteador Determinístico"}
                  {currentStep === 5 && "Fase 5: O Clique no Botão, Navegação & Realce Visual"}
                </h3>
                <p className="text-xs text-slate-400">
                  {currentStep === 1 && "Entrada livre por texto ou voz via Chat / Plugin WebMCP"}
                  {currentStep === 2 && "Como o site ensina a IA sem enviar código HTML massivo"}
                  {currentStep === 3 && "A IA escolhe a ferramenta com parâmetros estritos sem alucinar URLs"}
                  {currentStep === 4 && "Validação de perfil de segurança (RBAC) e resolução de rotas válidas"}
                  {currentStep === 5 && "A experiência final entregue na tela com efeito glow e foco"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold text-slate-200 transition"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                disabled={currentStep === 5}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-xs font-semibold text-white transition"
              >
                Próximo Passo →
              </button>
            </div>
          </div>

          {/* Step 1 Visualizer */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  Tudo começa com uma <strong>pergunta livre</strong> feita pelo usuário no chat da aplicação ou pela
                  extensão WebMCP.
                </p>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Mensagem digitada:
                  </div>
                  <div className="text-sm font-bold text-blue-300">"{selectedSim.userPrompt}"</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1 border-t border-slate-800">
                    <span>Papel ativo:</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold">
                      {selectedSim.userRole}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                  <strong>💡 O Segredo do MCP:</strong> O navegador <em>não</em> envia todo o HTML da página para a IA.
                  Enviar o HTML gastaria centenas de milhares de tokens, custaria caro e seria lento. O site apenas envia
                  a pergunta e o contexto leve do aluno!
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2">
                <div className="text-slate-500 font-bold">// Dados enviados ao provedor de IA</div>
                <pre className="text-blue-300 bg-slate-900 p-3 rounded-xl overflow-x-auto">
{`{
  "userMessage": "${selectedSim.userPrompt}",
  "userRole": "${selectedSim.userRole}",
  "student": "Guilherme Rodovalho",
  "activeCourse": "React Avançado (72%)"
}`}
                </pre>
              </div>
            </div>
          )}

          {/* Step 2 Visualizer */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  Para a IA saber onde cada botão e página ficam, o código da aplicação é decorado com{" "}
                  <strong>Atributos Semânticos no HTML</strong>:
                </p>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-amber-400 font-bold text-xs">Contrato Semântico Declarativo:</div>
                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    <li>
                      <code className="text-blue-400">data-mcp-resource</code>: Identificador único (ex:{" "}
                      <code>"{selectedSim.resourceId}"</code>).
                    </li>
                    <li>
                      <code className="text-purple-400">data-mcp-action</code>: Ação esperada (ex: <code>"view"</code>,{" "}
                      <code>"navigate"</code>).
                    </li>
                    <li>
                      <code className="text-emerald-400">data-mcp-description</code>: Descrição em português amigável
                      para a IA.
                    </li>
                  </ul>
                </div>
                <p className="text-[11px] text-slate-400">
                  Um scanner interno em JavaScript (ou o parser nativo C++ do Chrome Canary) lê essas tags e cria o
                  catálogo oficial de ferramentas da página.
                </p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2">
                <div className="text-slate-500 font-bold">// Como o botão está escrito no HTML do site</div>
                <pre className="text-purple-300 bg-slate-900 p-3 rounded-xl overflow-x-auto text-[10px]">
{`<div
  data-mcp-id="mcp-${selectedSim.resourceId}"
  data-mcp-resource="${selectedSim.resourceId}"
  data-mcp-action="navigate"
  data-mcp-description="Acesso ao recurso ${selectedSim.resourceId}"
>
  <!-- Conteúdo visual do componente -->
</div>`}
                </pre>
              </div>
            </div>
          )}

          {/* Step 3 Visualizer */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  O modelo de linguagem (Google Gemini 3.6, Gemini Nano ou OpenAI) lê a pergunta e o catálogo de
                  ferramentas.
                </p>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-purple-400 font-bold text-xs">Raciocínio Interno da IA:</div>
                  <p className="italic text-slate-300 text-[11px]">"{selectedSim.aiThought}"</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                  <strong>🔒 Zero Alucinação:</strong> A IA é instruída estritamente para não gerar links soltos em texto.
                  Ela só pode disparar uma <strong>Chamada de Função Estruturada (Tool Call)</strong> com os nomes das
                  ferramentas previamente aprovadas.
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2">
                <div className="text-slate-500 font-bold">// Chamada de ferramenta emitida pela IA</div>
                <pre className="text-emerald-300 bg-slate-900 p-3 rounded-xl overflow-x-auto">
{selectedSim.payloadSent}
                </pre>
              </div>
            </div>
          )}

          {/* Step 4 Visualizer */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  A chamada emitida pela IA não vai direto para o navegador. Ela passa primeiro pelo{" "}
                  <strong>Servidor MCP (Gatekeeper)</strong> para duas validações cruciais:
                </p>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {selectedSim.authorized ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">1. Autorização RBAC Aprovada</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        <span className="text-rose-400">1. Acesso Negado por Permissão</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {selectedSim.authorized
                      ? `O usuário com papel '${selectedSim.userRole}' possui autorização concedida para navegar até '${selectedSim.resourceId}'.`
                      : `Bloqueado! O recurso '${selectedSim.resourceId}' exige permissão de 'admin'. O aluno não pode acessar este painel.`}
                  </p>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                    <span className="font-bold text-blue-400">2. Roteamento Determinístico:</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      O identificador <code>"{selectedSim.resourceId}"</code> é convertido com segurança para a rota{" "}
                      <code className="text-white">{selectedSim.targetRoute}</code>. URLs maliciosas como{" "}
                      <code>javascript:...</code> são rejeitadas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2">
                <div className="text-slate-500 font-bold">// Resposta emitida pelo Servidor MCP</div>
                <pre className={`p-3 rounded-xl overflow-x-auto ${selectedSim.authorized ? "text-emerald-300 bg-slate-900" : "text-rose-300 bg-rose-950/40 border border-rose-900"}`}>
{`{
  "authorized": ${selectedSim.authorized},
  "resourceId": "${selectedSim.resourceId}",
  "resolvedRoute": "${selectedSim.targetRoute}",
  "userRole": "${selectedSim.userRole}",
  "status": "${selectedSim.authorized ? "success" : "denied"}"
}`}
                </pre>
              </div>
            </div>
          )}

          {/* Step 5 Visualizer */}
          {currentStep === 5 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  Agora a mágica acontece na tela do usuário! O sistema gera o{" "}
                  <strong>Card de Ação Interativo com o Botão Oficial</strong>:
                </p>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Resultado entregue no Chat ou Plugin:</span>
                    <span className="text-[10px] text-slate-400 font-mono">Feedback Imediato</span>
                  </div>

                  {/* The Actual Simulated Button */}
                  <div className="pt-2">
                    {selectedSim.authorized ? (
                      <div className="space-y-2">
                        <Link
                          href={selectedSim.targetRoute}
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition hover:scale-[1.02]"
                        >
                          <span>{selectedSim.buttonLabel}</span>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <p className="text-[10px] text-slate-400 text-center">
                          ✦ Ao clicar, a página navega instantaneamente e aplica o efeito <strong>Glow Pulsante</strong>{" "}
                          no item procurado.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs font-semibold flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{selectedSim.buttonLabel}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] flex items-center gap-2">
                  <Activity className="w-4 h-4 shrink-0" />
                  <span>
                    A navegação inteira é auditada em tempo real no painel de <strong>Telemetria & Observabilidade</strong>{" "}
                    (registrando tempo em ms e taxa de sucesso).
                  </span>
                </div>
              </div>

              {/* Simulated UI Preview */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-slate-400 text-[11px] font-bold flex items-center justify-between">
                  <span>Prévia do Elemento no DOM (Destacado):</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    .mcp-highlight-pulse
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border-2 border-blue-500 shadow-lg shadow-blue-500/30 space-y-2 relative animate-pulse">
                  <div className="absolute -top-3 right-3 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold shadow">
                    ✦ Localizado pelo Web MCP
                  </div>
                  <div className="font-bold text-white text-xs">
                    {selectedSim.id === "certificates"
                      ? "Certificado React Avançado (Emitido)"
                      : selectedSim.id === "continue-lesson"
                      ? "Aula: Hooks Avançados (useTransition, useDeferredValue)"
                      : "Recurso Protegido"}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Elemento centralizado na tela com rolagem suave automática e anel de foco.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tabela Resumo das 7 Etapas */}
      <section className="max-w-5xl mx-auto space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>Visão Geral: Da Pergunta à Execução da Ação</span>
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 glass-panel">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="p-3.5">Passo</th>
                <th className="p-3.5">Quem Executa?</th>
                <th className="p-3.5">O que Acontece?</th>
                <th className="p-3.5">Garantia de Engenharia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-900/40 transition">
                <td className="p-3.5 font-bold text-blue-400">1. Pergunta</td>
                <td className="p-3.5 text-white font-medium">Usuário Humano</td>
                <td className="p-3.5">Digita o que procura em linguagem natural no chat ou plugin.</td>
                <td className="p-3.5 text-emerald-400">Zero necessidade de decorar menus ou URLs.</td>
              </tr>
              <tr className="hover:bg-slate-900/40 transition">
                <td className="p-3.5 font-bold text-purple-400">2. Descoberta</td>
                <td className="p-3.5 text-white font-medium">Contrato Semantic DOM</td>
                <td className="p-3.5">Atributos <code>data-mcp-*</code> e formulários revelam a estrutura da tela.</td>
                <td className="p-3.5 text-emerald-400">Não vaza código HTML pesado para a IA (economiza 95% de tokens).</td>
              </tr>
              <tr className="hover:bg-slate-900/40 transition">
                <td className="p-3.5 font-bold text-amber-400">3. Raciocínio</td>
                <td className="p-3.5 text-white font-medium">LLM (Gemini / Nano / OpenAI)</td>
                <td className="p-3.5">Interpreta o significado e aciona a ferramenta correspondente via Tool Call.</td>
                <td className="p-3.5 text-emerald-400">A IA não cria links arbitrários (Zero Alucinação).</td>
              </tr>
              <tr className="hover:bg-slate-900/40 transition">
                <td className="p-3.5 font-bold text-rose-400">4. Segurança</td>
                <td className="p-3.5 text-white font-medium">Servidor MCP (RBAC Gatekeeper)</td>
                <td className="p-3.5">Valida se o usuário tem o papel de acesso exigido para aquela ação.</td>
                <td className="p-3.5 text-emerald-400">Alunos nunca acessam telas proibidas de administrador.</td>
              </tr>
              <tr className="hover:bg-slate-900/40 transition">
                <td className="p-3.5 font-bold text-indigo-400">5. Roteamento</td>
                <td className="p-3.5 text-white font-medium">Registry Determinístico</td>
                <td className="p-3.5">O <code>resourceId</code> é convertido na rota interna exata do Next.js.</td>
                <td className="p-3.5 text-emerald-400">Blindado contra injeções de script ou links externos suspeitos.</td>
              </tr>
              <tr className="hover:bg-slate-900/40 transition">
                <td className="p-3.5 font-bold text-emerald-400">6. Ação Visual</td>
                <td className="p-3.5 text-white font-medium">DOM Highlighter & Navegador</td>
                <td className="p-3.5">O botão aciona a transição de tela e aplica brilho pulsante no elemento certo.</td>
                <td className="p-3.5 text-emerald-400">O usuário encontra o recurso em menos de 1 segundo.</td>
              </tr>
              <tr className="hover:bg-slate-900/40 transition">
                <td className="p-3.5 font-bold text-cyan-400">7. Telemetria</td>
                <td className="p-3.5 text-white font-medium">Event Bus de Observabilidade</td>
                <td className="p-3.5">Grava latência, intenção, modelo e resultado para auditoria contínua.</td>
                <td className="p-3.5 text-emerald-400">100% observável com gráficos e logs em tempo real.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Perguntas Frequentes Didáticas */}
      <section className="max-w-5xl mx-auto space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>Perguntas Frequentes (FAQ)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm">Qual a diferença entre o botão manual e o Auto-Pilot?</h3>
            <p className="leading-relaxed text-slate-400">
              No <strong>Modo Manual</strong>, a IA monta o card com a rota segura e aguarda seu clique para navegar. No{" "}
              <strong>Modo Auto-Pilot (Piloto Automático)</strong>, se a ação for autorizada, o próprio agente executa o
              clique e a transição automaticamente por você após 800 milissegundos!
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm">O que o plugin oficial do Google WebMCP faz?</h3>
            <p className="leading-relaxed text-slate-400">
              O plugin oficial do Chrome Canary lê a API nativa <code>document.modelContext</code> e lista todos os 21
              recursos da nossa aplicação em uma tabela lateral. Ele permite que desenvolvedores inspecionem os schemas
              JSON e executem as ferramentas de navegação manualmente ou com Gemini.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm">A IA tem permissão para alterar meus dados sem eu saber?</h3>
            <p className="leading-relaxed text-slate-400">
              Não. O MCP implementa marcadores de segurança como <code>readOnlyHint</code> e gates de permissão estritos.
              Apenas ações de navegação segura e leitura de contexto são liberadas autonomamente; alterações cadastrais
              exigem interação explícita do usuário.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm">E se a IA inventar uma rota que não existe?</h3>
            <p className="leading-relaxed text-slate-400">
              O sistema possui um <strong>Registro Seguro Fechado (Safe Route Registry)</strong>. Qualquer saída que não
              corresponda estritamente a um ID pré-registrado na aplicação é descartada pelo servidor MCP, impedindo
              erros 404 e tentativas de injeção de links maliciosos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Bar */}
      <section className="max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">Pronto para ver o Web MCP em ação?</h3>
          <p className="text-xs text-slate-400">
            Abra o chat flutuante no canto inferior direito ou navegue pelo Dashboard da plataforma.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/mcp-inspector"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white border border-slate-700 transition"
          >
            Explorar Inspetor MCP
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition"
          >
            Ir para o Dashboard →
          </Link>
        </div>
      </section>
    </div>
  );
}
