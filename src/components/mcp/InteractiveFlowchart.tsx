"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Layers,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  Compass,
  MousePointerClick,
  Activity,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Lock,
  ExternalLink,
  Code2,
  Zap,
  Info,
  Terminal,
  Clock,
  ArrowRight,
} from "lucide-react";

export type ScenarioId = "certificates" | "admin_denied" | "autopilot" | "continue_lesson";

interface ScenarioConfig {
  id: ScenarioId;
  label: string;
  badge: string;
  badgeColor: string;
  description: string;
  userPrompt: string;
  userRole: "student" | "admin";
  resourceId: string;
  targetRoute: string;
  authorized: boolean;
  isAutoPilot?: boolean;
  nodesData: Record<
    number,
    {
      statusText: string;
      inputDesc: string;
      processDesc: string;
      outputDesc: string;
      codeSnippet: string;
      codeLang: string;
      securityNote: string;
    }
  >;
  finalButton: {
    label: string;
    route: string;
    highlightId: string;
  };
}

const SCENARIOS: Record<ScenarioId, ScenarioConfig> = {
  certificates: {
    id: "certificates",
    label: "Caso 1: Certificados (Autorizado)",
    badge: "Fluxo Padrão",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    description: "O aluno pergunta sobre seus certificados. O Web MCP localiza o recurso, autoriza e gera o botão seguro com realce visual na tela.",
    userPrompt: "Onde vejo meus certificados?",
    userRole: "student",
    resourceId: "certificates",
    targetRoute: "/dashboard/certificates",
    authorized: true,
    nodesData: {
      1: {
        statusText: "Entrada em Linguagem Natural",
        inputDesc: "Texto livre digitado no Chat ou comando recebido da Extensão Chrome Canary.",
        processDesc: "O frontend captura o prompt do usuário e anexa o perfil ativo (aluno logado).",
        outputDesc: "Payload estruturado { query: 'Onde vejo meus certificados?', role: 'student' }.",
        codeSnippet: `// 1. Mensagem enviada pelo usuário
{
  "query": "Onde vejo meus certificados?",
  "user": "Guilherme Rodovalho",
  "role": "student",
  "source": "ChatWidget"
}`,
        codeLang: "json",
        securityNote: "Nenhum HTML cru da página é enviado para a IA neste momento, poupando 95% de tokens!",
      },
      2: {
        statusText: "Catálogo Semantic DOM Extraído",
        inputDesc: "Árvore do DOM contendo atributos data-mcp-* e document.modelContext.",
        processDesc: "O scanner localiza elementos semânticos e disponibiliza as ferramentas oficiais de navegação.",
        outputDesc: "Ferramenta declarada: navigate_to_resource(resourceId='certificates').",
        codeSnippet: `<!-- 2. Como o recurso de certificados está anotado no HTML -->
<div 
  data-mcp-resource="certificates"
  data-mcp-description="Central de Certificados e Diplomas emitidos"
  data-mcp-access="student"
  data-mcp-target="/dashboard/certificates"
>
  <!-- Card Visual de Certificados -->
</div>`,
        codeLang: "html",
        securityNote: "A semântica é declarativa: apenas as rotas e ações explicitamente anotadas são expostas.",
      },
      3: {
        statusText: "Raciocínio & Function Calling da IA",
        inputDesc: "Pergunta do usuário + Lista de schemas JSON das ferramentas MCP.",
        processDesc: "O modelo (Gemini 3.6 Flash ou Gemini Nano) seleciona a ferramenta exata sem alucinar links.",
        outputDesc: "Chamada de ferramenta: { tool: 'navigate_to_resource', arguments: { resourceId: 'certificates' } }.",
        codeSnippet: `// 3. Chamada de função estruturada emitida pelo Gemini
{
  "name": "navigate_to_resource",
  "args": {
    "resourceId": "certificates"
  }
}`,
        codeLang: "json",
        securityNote: "Zero alucinação: a IA é impedida de inventar URLs soltas como 'https://site.com/fake-cert'.",
      },
      4: {
        statusText: "Validação de Permissão (RBAC) APROVADA",
        inputDesc: "Chamada de ferramenta + Perfil 'student' do usuário conectado.",
        processDesc: "O Servidor MCP verifica se 'student' tem permissão para acessar o recurso 'certificates'.",
        outputDesc: "Aprovado: 200 OK - Permissão concedida.",
        codeSnippet: `// 4. Validador de Segurança RBAC do Servidor MCP
const isAuthorized = checkResourcePermission("certificates", "student");
// Retorna: true (Recurso liberado para alunos)`,
        codeLang: "typescript",
        securityNote: "O controle de acesso é executado no servidor/cliente de aplicação, nunca pela própria IA.",
      },
      5: {
        statusText: "Roteamento Determinístico (Safe Registry)",
        inputDesc: "Identificador 'certificates' aprovado pelo gatekeeper.",
        processDesc: "O Registry converte o resourceId em uma rota interna estrita do Next.js.",
        outputDesc: "Rota resolvida: '/dashboard/certificates'.",
        codeSnippet: `// 5. Mapeamento estrito na tabela Safe Route Registry
const ROUTES_MAP = {
  certificates: "/dashboard/certificates",
  courses: "/dashboard/courses",
  progress: "/dashboard/progress"
};
const safeUrl = ROUTES_MAP["certificates"]; // "/dashboard/certificates"`,
        codeLang: "typescript",
        securityNote: "Garante que nenhuma injeção de script (ex: javascript:alert(1)) possa ser executada.",
      },
      6: {
        statusText: "Geração de Botão & Realce no DOM",
        inputDesc: "Rota validada '/dashboard/certificates'.",
        processDesc: "O Chat renderiza o botão interativo. Ao clicar, a rota é acionada e o item recebe .mcp-highlight-pulse.",
        outputDesc: "Card com botão 'Ir para Central de Certificados' pronto para clique.",
        codeSnippet: `// 6. Realce visual executado no DOM ao chegar na tela
import { highlightMCPResource } from "@/lib/mcp-dom/highlighter";

highlightMCPResource("certificates");
// Aplica anel pulsante azul e rola a tela suavemente até o elemento`,
        codeLang: "typescript",
        securityNote: "O usuário tem total controle sobre a ação com confirmação visual clara.",
      },
      7: {
        statusText: "Telemetria & Auditoria Gravada",
        inputDesc: "Evento de navegação bem-sucedido.",
        processDesc: "O barramento de observabilidade grava latência, ID do modelo e taxa de sucesso.",
        outputDesc: "Evento persistido no histórico de auditoria em tempo real.",
        codeSnippet: `// 7. Registro de telemetria emitido no Event Bus
telemetry.emit({
  event: "ai.navigation.executed",
  resourceId: "certificates",
  route: "/dashboard/certificates",
  latencyMs: 240,
  status: "success"
});`,
        codeLang: "typescript",
        securityNote: "100% de rastreabilidade de todas as ações mediadas por inteligência artificial.",
      },
    },
    finalButton: {
      label: "Ir para Central de Certificados",
      route: "/dashboard/certificates",
      highlightId: "certificates",
    },
  },

  admin_denied: {
    id: "admin_denied",
    label: "Caso 2: Painel Admin (Bloqueio RBAC)",
    badge: "Segurança Ativa",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    description: "O aluno tenta navegar para o painel de administrador. A IA reconhece o pedido, mas o Guardião MCP bloqueia a ação por falta de permissão.",
    userPrompt: "Quero acessar o painel de administrador para gerenciar alunos",
    userRole: "student",
    resourceId: "admin_panel",
    targetRoute: "/dashboard/admin",
    authorized: false,
    nodesData: {
      1: {
        statusText: "Entrada em Linguagem Natural",
        inputDesc: "Pergunta solicitando acesso administrativo restrito.",
        processDesc: "O frontend anexa a identidade do aluno ativo: role='student'.",
        outputDesc: "Payload { query: 'acessar painel de administrador', role: 'student' }.",
        codeSnippet: `// 1. Mensagem de tentativa do usuário
{
  "query": "Quero acessar o painel de administrador",
  "role": "student"
}`,
        codeLang: "json",
        securityNote: "Mesmo que o usuário peça com insistência ('jailbreak'), a segurança está no servidor!",
      },
      2: {
        statusText: "Catálogo Semantic DOM",
        inputDesc: "Catálogo de recursos declarados na aplicação.",
        processDesc: "O recurso 'admin_panel' existe no catálogo, mas possui a marcação data-mcp-access='admin'.",
        outputDesc: "Recurso identificado: admin_panel (requer role='admin').",
        codeSnippet: `<!-- 2. Recurso anotado como restrito no DOM -->
<div 
  data-mcp-resource="admin_panel"
  data-mcp-access="admin"
  data-mcp-description="Painel de administração geral do sistema"
/>`,
        codeLang: "html",
        securityNote: "O atributo data-mcp-access explicita o nível de autorização mínimo necessário.",
      },
      3: {
        statusText: "Raciocínio & Chamada de Ferramenta",
        inputDesc: "A IA interpreta que a intenção se refere ao painel de administração.",
        processDesc: "Emite a chamada de ferramenta para 'admin_panel'. A IA não julga a permissão; ela delega ao Guardião.",
        outputDesc: "Chamada de ferramenta: { tool: 'navigate_to_resource', args: { resourceId: 'admin_panel' } }.",
        codeSnippet: `// 3. A IA emite a intenção estruturada
{
  "name": "navigate_to_resource",
  "args": {
    "resourceId": "admin_panel"
  }
}`,
        codeLang: "json",
        securityNote: "A IA não deve ser a guardiã da segurança; o servidor MCP é o responsável pela autorização.",
      },
      4: {
        statusText: "Guardião RBAC: ACESSO NEGADO (403)",
        inputDesc: "Pedido para 'admin_panel' feito por usuário com role='student'.",
        processDesc: "O validador RBAC detecta divergência: 'student' !== 'admin'. Interrompe o fluxo imediatamente.",
        outputDesc: "Erro 403: Forbidden - Ação bloqueada pelo sistema de segurança.",
        codeSnippet: `// 4. Bloqueio imediato no Servidor MCP
if (resource.requiredRole === "admin" && user.role !== "admin") {
  throw new MCPPermissionDeniedError(
    "Acesso Negado: Este recurso requer perfil Administrador."
  );
}`,
        codeLang: "typescript",
        securityNote: "A execução é cancelada antes de tocar em qualquer rota ou componente da tela!",
      },
      5: {
        statusText: "Roteamento Cancelado (Registry Desativado)",
        inputDesc: "Fluxo interrompido no nó anterior.",
        processDesc: "O Safe Route Registry nem chega a ser consultado para proteger o endereço real.",
        outputDesc: "Rota não liberada.",
        codeSnippet: `// 5. Registry protegido
// Nenhuma rota é resolvida ou exposta para o cliente.`,
        codeLang: "typescript",
        securityNote: "Rotas confidenciais de administração não são vazadas no navegador do aluno.",
      },
      6: {
        statusText: "Exibição de Card com Alerta de Segurança",
        inputDesc: "Resposta com status 'denied'.",
        processDesc: "O Chat exibe um banner vermelho de bloqueio informando que a ação requer privilégios de administrador.",
        outputDesc: "Botão desativado com ícone de escudo de alerta.",
        codeSnippet: `// 6. UI exibe feedback de bloqueio seguro
<div className="bg-rose-950/40 border border-rose-900 text-rose-300">
  <ShieldAlert /> Ação Bloqueada: Requer Papel Administrador
</div>`,
        codeLang: "typescript",
        securityNote: "O usuário é informado com transparência sem expor dados internos sensíveis.",
      },
      7: {
        statusText: "Auditoria de Segurança Registrada",
        inputDesc: "Registro do evento de tentativa não autorizada.",
        processDesc: "O Event Bus grava o incidente com timestamp e ID do usuário para monitoramento de conformidade.",
        outputDesc: "Log de segurança salvo: { event: 'navigation.denied', reason: 'insufficient_role' }.",
        codeSnippet: `// 7. Telemetria de incidente de segurança
telemetry.emit({
  event: "ai.security.denied",
  resourceId: "admin_panel",
  attemptedBy: "student",
  status: "blocked"
});`,
        codeLang: "typescript",
        securityNote: "Tentativas indevidas ficam registradas no painel de Observabilidade para auditoria SOC2 / LGPD.",
      },
    },
    finalButton: {
      label: "Acesso Bloqueado: Requer Perfil Administrador",
      route: "#",
      highlightId: "blocked",
    },
  },

  autopilot: {
    id: "autopilot",
    label: "Caso 3: Modo Auto-Pilot (Navegação Autônoma)",
    badge: "Execução Autônoma",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    description: "No Modo Auto-Pilot ativado, a IA reconhece o pedido, o MCP autoriza e executa a transição de rota automaticamente sem necessidade de clique manual!",
    userPrompt: "Me leve até a lista de todos os cursos disponíveis",
    userRole: "student",
    resourceId: "courses",
    targetRoute: "/dashboard/courses",
    authorized: true,
    isAutoPilot: true,
    nodesData: {
      1: {
        statusText: "Entrada via Comando Direto",
        inputDesc: "Usuário com toggle Auto-Pilot ativado pede: 'Me leve até a lista de cursos'.",
        processDesc: "O assistente detecta o modo de assistência autônoma ligado.",
        outputDesc: "Payload { query: 'Me leve até cursos', autoPilot: true }.",
        codeSnippet: `// 1. Comando emitido com flag Auto-Pilot
{
  "query": "Me leve até a lista de todos os cursos",
  "autoPilot": true,
  "role": "student"
}`,
        codeLang: "json",
        securityNote: "O usuário pode desativar o Auto-Pilot a qualquer momento no cabeçalho do chat.",
      },
      2: {
        statusText: "Catálogo Semantic DOM",
        inputDesc: "Elementos da página mapeados.",
        processDesc: "O recurso 'courses' é localizado no catálogo de navegação com permissão pública/aluno.",
        outputDesc: "Recurso 'courses' validado.",
        codeSnippet: `<!-- 2. Tag Semântica do Catálogo de Cursos -->
<nav data-mcp-resource="courses" data-mcp-target="/dashboard/courses">
  Meus Cursos
</nav>`,
        codeLang: "html",
        securityNote: "Apenas ferramentas marcadas com 'readOnlyHint: true' ou navegação segura podem rodar no Auto-Pilot.",
      },
      3: {
        statusText: "Decisão do Cérebro LLM",
        inputDesc: "Comando do usuário interpretado.",
        processDesc: "O Gemini aciona 'navigate_to_resource' com resourceId='courses'.",
        outputDesc: "Tool call: navigate_to_resource('courses').",
        codeSnippet: `// 3. Tool Call com flag de navegação direta
{
  "name": "navigate_to_resource",
  "args": { "resourceId": "courses" }
}`,
        codeLang: "json",
        securityNote: "Nenhuma ação destrutiva (como deletar ou comprar) pode ser executada em Auto-Pilot sem confirmação.",
      },
      4: {
        statusText: "Guardião RBAC & Checagem Auto-Pilot",
        inputDesc: "Verificação de permissão e política de autonomia.",
        processDesc: "O MCP confirma que o usuário é aluno e que 'courses' é seguro para transição autônoma.",
        outputDesc: "Autorização de execução autônoma concedida.",
        codeSnippet: `// 4. Checagem de segurança de transição autônoma
const canAutoExecute = isNavigationSafe("courses") && isAuthorized;
// true: liberado para transição automática`,
        codeLang: "typescript",
        securityNote: "Políticas de segurança impedem que ações de escrita (POST/PUT) rodem sem intervenção humana.",
      },
      5: {
        statusText: "Roteador Determinístico Safe Registry",
        inputDesc: "Resolução do ID 'courses'.",
        processDesc: "Mapeado deterministicamente para '/dashboard/courses'.",
        outputDesc: "URL segura pronta para o roteador Next.js.",
        codeSnippet: `// 5. Resolução da rota
const targetUrl = resolveSafeRoute("courses"); // "/dashboard/courses"`,
        codeLang: "typescript",
        securityNote: "Garantia estrita de que a rota pertence ao mesmo domínio seguro da aplicação.",
      },
      6: {
        statusText: "Contagem Regressiva & Disparo do Roteador",
        inputDesc: "URL segura + temporizador de 800ms.",
        processDesc: "O sistema exibe o badge '✦ Executando no Piloto Automático em 800ms...' e dispara router.push().",
        outputDesc: "Transição de tela instantânea e elemento destacado na chegada.",
        codeSnippet: `// 6. Disparo do Piloto Automático no navegador
setTimeout(() => {
  router.push("/dashboard/courses");
  highlightMCPResource("courses");
}, 800);`,
        codeLang: "typescript",
        securityNote: "O delay de 800ms oferece tempo hábil para o usuário cancelar caso deseje.",
      },
      7: {
        statusText: "Telemetria de Autonomia Registrada",
        inputDesc: "Execução autônoma concluída com sucesso.",
        processDesc: "O barramento grava o evento sob a métrica de 'assisted_navigation_autonomous'.",
        outputDesc: "Auditoria gravada em 180ms.",
        codeSnippet: `// 7. Evento de autonomia registrado
telemetry.emit({
  event: "ai.autopilot.executed",
  resourceId: "courses",
  durationMs: 180
});`,
        codeLang: "typescript",
        securityNote: "Métricas de Auto-Pilot permitem monitorar se os usuários estão economizando tempo na navegação.",
      },
    },
    finalButton: {
      label: "Navegando Automaticamente para Cursos...",
      route: "/dashboard/courses",
      highlightId: "courses",
    },
  },

  continue_lesson: {
    id: "continue_lesson",
    label: "Caso 4: Retomar Aula (Contexto Dinâmico)",
    badge: "Deep-Link Contextual",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    description: "O aluno pede para continuar onde parou. O Web MCP consulta o progresso atual no contexto da sessão e monta a URL exata com os parâmetros da aula.",
    userPrompt: "Quero continuar a aula que estava fazendo",
    userRole: "student",
    resourceId: "continue_lesson",
    targetRoute: "/dashboard/courses/react-avancado?lesson=hooks-avancados",
    authorized: true,
    nodesData: {
      1: {
        statusText: "Entrada Contextual",
        inputDesc: "Pergunta genérica do aluno: 'Quero continuar a aula que estava fazendo'.",
        processDesc: "O assistente não precisa perguntar 'qual aula?'; ele consulta o contexto ativo.",
        outputDesc: "Prompt associado ao estado do aluno.",
        codeSnippet: `// 1. Mensagem recebida
{
  "query": "Quero continuar a aula que estava fazendo",
  "studentContext": {
    "activeCourse": "react-avancado",
    "lastLesson": "hooks-avancados",
    "progress": "72%"
  }
}`,
        codeLang: "json",
        securityNote: "A IA usa o contexto da sessão ativa sem precisar fazer novas requisições pesadas.",
      },
      2: {
        statusText: "Catálogo Semantic DOM & Context Providers",
        inputDesc: "Contêineres com data-mcp-context e estado do player de vídeo.",
        processDesc: "O MCP extrai os identificadores da aula em andamento da sessão do aluno.",
        outputDesc: "Parâmetros identificados: courseId='react-avancado', lessonId='hooks-avancados'.",
        codeSnippet: `<!-- 2. Contexto injetado na árvore do Web MCP -->
<div 
  data-mcp-context="active-student-session"
  data-mcp-course-id="react-avancado"
  data-mcp-lesson-id="hooks-avancados"
/>`,
        codeLang: "html",
        securityNote: "Contextos são escopados por sessão e não vazam informações entre alunos.",
      },
      3: {
        statusText: "Chamada Parametrizada da IA",
        inputDesc: "Contexto + Raciocínio do Gemini.",
        processDesc: "A IA emite a tool call com os parâmetros dinâmicos corretos.",
        outputDesc: "Tool call com argumentos completos de curso e aula.",
        codeSnippet: `// 3. Tool call com query params exatos
{
  "name": "navigate_to_resource",
  "args": {
    "resourceId": "continue_lesson",
    "courseId": "react-avancado",
    "lessonId": "hooks-avancados"
  }
}`,
        codeLang: "json",
        securityNote: "Os parâmetros são tipados e validados por schema Zod antes de prosseguir.",
      },
      4: {
        statusText: "Guardião RBAC: Matrícula Ativa Confirmada",
        inputDesc: "Validação de permissão e checagem de matrícula no curso.",
        processDesc: "O MCP confirma que o aluno está regularmente matriculado em 'react-avancado'.",
        outputDesc: "Acesso autorizado: 200 OK.",
        codeSnippet: `// 4. Validação de matrícula ativa no curso
const isEnrolled = checkStudentEnrollment("react-avancado", student.id);
// true: aluno possui acesso liberado ao conteúdo`,
        codeLang: "typescript",
        securityNote: "Impede que usuários acessem aulas de cursos nos quais não estão matriculados.",
      },
      5: {
        statusText: "Construção de Deep-Link no Registry",
        inputDesc: "Parâmetros { courseId, lessonId }.",
        processDesc: "O Registry monta a URL final com query string sanitizada.",
        outputDesc: "URL: '/dashboard/courses/react-avancado?lesson=hooks-avancados'.",
        codeSnippet: `// 5. Montagem segura de Deep-Link
const route = \`/dashboard/courses/\${encodeURIComponent(courseId)}?lesson=\${encodeURIComponent(lessonId)}\`;
// "/dashboard/courses/react-avancado?lesson=hooks-avancados"`,
        codeLang: "typescript",
        securityNote: "Todos os parâmetros são codificados com encodeURIComponent para prevenir injeções.",
      },
      6: {
        statusText: "Card de Retomada Imediata Renderizado",
        inputDesc: "URL profunda pronta.",
        processDesc: "O card exibe o progresso (72%) e o botão direto para a aula de Hooks Avançados.",
        outputDesc: "Botão pronto com efeito glow e foco no player de aula.",
        codeSnippet: `// 6. Botão de ação direta renderizado
<Link href={route} className="btn-continue-lesson">
  Retomar: Hooks Avançados (72%)
</Link>`,
        codeLang: "typescript",
        securityNote: "Economiza até 6 cliques que o aluno teria que fazer procurando no índice!",
      },
      7: {
        statusText: "Métrica de Reengajamento Gravada",
        inputDesc: "Evento de retomada de estudos.",
        processDesc: "A plataforma grava métrica de retenção pedagógica no Event Bus.",
        outputDesc: "Evento registrado com sucesso em 210ms.",
        codeSnippet: `// 7. Telemetria pedagógica
telemetry.emit({
  event: "ai.learning.lesson_resumed",
  courseId: "react-avancado",
  lessonId: "hooks-avancados",
  progress: 72
});`,
        codeLang: "typescript",
        securityNote: "Ajuda a medir a eficácia da IA em aumentar a taxa de conclusão de cursos.",
      },
    },
    finalButton: {
      label: "Retomar Aula: Hooks Avançados (72%)",
      route: "/dashboard/courses/react-avancado?lesson=hooks-avancados",
      highlightId: "continue_lesson",
    },
  },
};

const NODES_CONFIG = [
  {
    id: 1,
    title: "1. Usuário & Prompt",
    subtitle: "Linguagem Natural",
    icon: MessageSquare,
    badge: "Entrada Humana",
    color: "from-blue-600 to-cyan-600",
    borderActive: "border-blue-500 shadow-blue-500/40",
    textHighlight: "text-blue-400",
  },
  {
    id: 2,
    title: "2. Semantic DOM",
    subtitle: "data-mcp-* & modelContext",
    icon: Layers,
    badge: "Scanner MCP",
    color: "from-cyan-600 to-teal-600",
    borderActive: "border-cyan-500 shadow-cyan-500/40",
    textHighlight: "text-cyan-400",
  },
  {
    id: 3,
    title: "3. Cérebro da IA",
    subtitle: "Gemini 3.6 / Nano",
    icon: Cpu,
    badge: "Function Calling",
    color: "from-purple-600 to-indigo-600",
    borderActive: "border-purple-500 shadow-purple-500/40",
    textHighlight: "text-purple-400",
  },
  {
    id: 4,
    title: "4. Guardião RBAC",
    subtitle: "Segurança de Acesso",
    icon: ShieldCheck,
    badge: "Gatekeeper",
    color: "from-emerald-600 to-green-600",
    borderActive: "border-emerald-500 shadow-emerald-500/40",
    textHighlight: "text-emerald-400",
  },
  {
    id: 5,
    title: "5. Safe Registry",
    subtitle: "Roteamento Fechado",
    icon: Compass,
    badge: "Whitelist Next.js",
    color: "from-amber-600 to-orange-600",
    borderActive: "border-amber-500 shadow-amber-500/40",
    textHighlight: "text-amber-400",
  },
  {
    id: 6,
    title: "6. Execução Visual",
    subtitle: "Botão + .mcp-highlight",
    icon: MousePointerClick,
    badge: "Feedback no DOM",
    color: "from-indigo-600 to-blue-600",
    borderActive: "border-indigo-500 shadow-indigo-500/40",
    textHighlight: "text-indigo-400",
  },
  {
    id: 7,
    title: "7. Observabilidade",
    subtitle: "Telemetria em ms",
    icon: Activity,
    badge: "Auditoria em Tempo Real",
    color: "from-teal-600 to-emerald-600",
    borderActive: "border-teal-500 shadow-teal-500/40",
    textHighlight: "text-teal-400",
  },
];

export default function InteractiveFlowchart() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioId>("certificates");
  const [activeNodeId, setActiveNodeId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1 = 1400ms, 2 = 700ms
  const [highlightSimulated, setHighlightSimulated] = useState<boolean>(false);

  const scenario = SCENARIOS[selectedScenarioId];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle Play/Pause
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = playbackSpeed === 1 ? 1400 : 700;
      timerRef.current = setInterval(() => {
        setActiveNodeId((prev) => {
          // If scenario is denied and we are at node 4, stop or loop
          if (!scenario.authorized && prev === 4) {
            setIsPlaying(false);
            return 4;
          }

          if (prev >= 7) {
            setIsPlaying(false);
            return 7;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, scenario.authorized]);

  const handleSelectScenario = (id: ScenarioId) => {
    setSelectedScenarioId(id);
    setActiveNodeId(1);
    setIsPlaying(false);
    setHighlightSimulated(false);
  };

  const handleTogglePlay = () => {
    if (activeNodeId >= 7 || (!scenario.authorized && activeNodeId >= 4)) {
      setActiveNodeId(1);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepNext = () => {
    setIsPlaying(false);
    setActiveNodeId((prev) => {
      if (!scenario.authorized && prev >= 4) return 4;
      return Math.min(7, prev + 1);
    });
  };

  const handleStepPrev = () => {
    setIsPlaying(false);
    setActiveNodeId((prev) => Math.max(1, prev - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveNodeId(1);
    setHighlightSimulated(false);
  };

  const activeNodeData = scenario.nodesData[activeNodeId] || scenario.nodesData[1];
  const activeNodeConfig = NODES_CONFIG.find((n) => n.id === activeNodeId) || NODES_CONFIG[0];

  return (
    <div className="w-full space-y-6" id="interactive-flowchart">
      {/* Top Banner & Scenario Selector */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-blue-500/30 space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Visualizador de Arquitetura em Tempo Real</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Fluxograma Interativo: Do Prompt à Tela</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Assista a informação viajar através de cada camada do Web MCP ou clique nos nós para inspecionar os
              dados reais trafegados.
            </p>
          </div>

          {/* Controls Cluster */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 bg-slate-950/80 p-2 rounded-2xl border border-slate-800 shadow-inner">
            {/* Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md ${
                isPlaying
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
              title={isPlaying ? "Pausar Simulação" : "Iniciar Reprodução Automática"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? "Pausar" : "Animar Fluxo"}</span>
            </button>

            {/* Prev Step */}
            <button
              onClick={handleStepPrev}
              disabled={activeNodeId === 1}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 text-slate-300 transition"
              title="Passo Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Step Counter Indicator */}
            <div className="px-2.5 py-1 text-xs font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              Nó {activeNodeId} / 7
            </div>

            {/* Next Step */}
            <button
              onClick={handleStepNext}
              disabled={activeNodeId === 7 || (!scenario.authorized && activeNodeId === 4)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 text-slate-300 transition"
              title="Próximo Passo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Reiniciar Fluxo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed Toggle */}
            <button
              onClick={() => setPlaybackSpeed((s) => (s === 1 ? 2 : 1))}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition"
              title="Alternar Velocidade"
            >
              {playbackSpeed}x
            </button>
          </div>
        </div>

        {/* Scenario Selection Tabs */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Escolha um Cenário para Testar:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => {
              const sc = SCENARIOS[id];
              const isSelected = selectedScenarioId === id;
              return (
                <button
                  key={id}
                  onClick={() => handleSelectScenario(id)}
                  className={`p-3 rounded-2xl text-left border transition relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "bg-slate-900 border-blue-500 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10"
                      : "bg-slate-950/60 border-slate-800 hover:bg-slate-900/80 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sc.badgeColor}`}>
                        {sc.badge}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      )}
                    </div>
                    <div className="font-bold text-xs text-white pt-1">{sc.label}</div>
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    "{sc.userPrompt}"
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Flowchart Canvas (Horizontal Grid / Flow) */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 space-y-4 overflow-x-auto">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Fluxo de Execução Sequencial Web MCP (Clique em qualquer nó para inspecionar):</span>
          </div>
          {isPlaying && (
            <div className="flex items-center gap-1.5 text-blue-400 font-mono text-[11px] animate-pulse">
              <Activity className="w-3.5 h-3.5" />
              <span>Simulação ativa...</span>
            </div>
          )}
        </div>

        {/* Nodes Track */}
        <div className="relative min-w-[920px] py-4">
          <div className="grid grid-cols-7 gap-3 relative z-10">
            {NODES_CONFIG.map((node, index) => {
              const isActive = activeNodeId === node.id;
              const isPast = activeNodeId > node.id;
              const isBlockedNode = !scenario.authorized && node.id === 4;
              const isBlockedPast = !scenario.authorized && node.id > 4;

              // Determine icon
              const IconComponent = isBlockedNode ? ShieldAlert : node.icon;

              return (
                <div key={node.id} className="flex flex-col items-center relative">
                  {/* The Node Card */}
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      if (!scenario.authorized && node.id > 4) {
                        setActiveNodeId(4);
                      } else {
                        setActiveNodeId(node.id);
                      }
                    }}
                    disabled={isBlockedPast}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 relative group ${
                      isActive
                        ? isBlockedNode
                          ? "bg-rose-950/80 border-rose-500 shadow-xl shadow-rose-500/20 scale-105 ring-2 ring-rose-500/30"
                          : "bg-slate-900 border-blue-500 shadow-xl shadow-blue-500/20 scale-105 ring-2 ring-blue-500/30"
                        : isPast && !isBlockedPast
                        ? "bg-slate-900/90 border-emerald-500/40 hover:border-emerald-500"
                        : isBlockedPast
                        ? "bg-slate-950/40 border-slate-900 opacity-30 cursor-not-allowed"
                        : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                    }`}
                  >
                    {/* Top Status & Badge */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition ${
                          isActive
                            ? isBlockedNode
                              ? "bg-rose-500 text-white animate-pulse"
                              : "bg-gradient-to-br " + node.color + " text-white shadow-md animate-pulse"
                            : isPast && !isBlockedPast
                            ? "bg-emerald-500/20 text-emerald-400"
                            : isBlockedPast
                            ? "bg-slate-900 text-slate-600"
                            : "bg-slate-800 text-slate-400 group-hover:text-slate-200"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>

                      {/* State Pill */}
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isActive
                            ? isBlockedNode
                              ? "bg-rose-500 text-white font-black"
                              : "bg-blue-500 text-white font-black"
                            : isPast && !isBlockedPast
                            ? "bg-emerald-500/20 text-emerald-400"
                            : isBlockedPast
                            ? "bg-slate-900 text-slate-600"
                            : "bg-slate-900 text-slate-500"
                        }`}
                      >
                        {isBlockedNode && isActive
                          ? "403"
                          : isPast && !isBlockedPast
                          ? "✓"
                          : isBlockedPast
                          ? "✕"
                          : `0${node.id}`}
                      </span>
                    </div>

                    {/* Node Title */}
                    <div
                      className={`font-bold text-xs truncate ${
                        isActive
                          ? isBlockedNode
                            ? "text-rose-300"
                            : "text-white"
                          : isPast && !isBlockedPast
                          ? "text-slate-200"
                          : isBlockedPast
                          ? "text-slate-600"
                          : "text-slate-400"
                      }`}
                    >
                      {node.title}
                    </div>

                    {/* Node Subtitle */}
                    <div className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">
                      {isBlockedNode ? "Bloqueio RBAC" : node.subtitle}
                    </div>

                    {/* Bottom Micro status */}
                    <div className="mt-2.5 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9px]">
                      <span
                        className={`font-medium ${
                          isActive
                            ? isBlockedNode
                              ? "text-rose-400 font-bold"
                              : "text-blue-400 font-bold"
                            : isPast && !isBlockedPast
                            ? "text-emerald-400"
                            : "text-slate-500"
                        }`}
                      >
                        {isActive
                          ? isBlockedNode
                            ? "Bloqueado!"
                            : "Ativo..."
                          : isPast && !isBlockedPast
                          ? "Concluído"
                          : isBlockedPast
                          ? "Ignorado"
                          : "Pendente"}
                      </span>
                    </div>

                    {/* Pulsing Active Indicator Glow */}
                    {isActive && (
                      <div
                        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full ${
                          isBlockedNode ? "bg-rose-500 shadow-lg shadow-rose-500" : "bg-blue-500 shadow-lg shadow-blue-500"
                        }`}
                      />
                    )}
                  </button>

                  {/* Connecting Arrow to Next Node (if not last) */}
                  {index < NODES_CONFIG.length - 1 && (
                    <div className="absolute top-1/2 -right-3 -translate-y-1/2 z-20 pointer-events-none hidden sm:block">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition duration-300 ${
                          isPast && (!isBlockedNode || index < 3)
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : isActive && !isBlockedNode
                            ? "bg-blue-500 text-white shadow-md shadow-blue-500/50 animate-pulse"
                            : isBlockedNode && index === 3
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-slate-900 text-slate-700 border border-slate-800"
                        }`}
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deep-Dive Inspection Panel for Active/Selected Node */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
        {/* Node Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                !scenario.authorized && activeNodeId === 4
                  ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                  : "bg-gradient-to-br " + activeNodeConfig.color + " text-white border-white/10 shadow-lg"
              }`}
            >
              {!scenario.authorized && activeNodeId === 4 ? (
                <ShieldAlert className="w-6 h-6" />
              ) : (
                <activeNodeConfig.icon className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase tracking-wider font-mono">
                  Camada 0{activeNodeId}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    !scenario.authorized && activeNodeId === 4
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}
                >
                  {activeNodeData.statusText}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                {activeNodeConfig.title}: {activeNodeConfig.subtitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleStepPrev}
              disabled={activeNodeId === 1}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 text-xs font-semibold text-slate-300 transition"
            >
              ← Anterior
            </button>
            <button
              onClick={handleStepNext}
              disabled={activeNodeId === 7 || (!scenario.authorized && activeNodeId === 4)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-xs font-bold text-white transition shadow-md shadow-blue-500/20"
            >
              Próximo Passo →
            </button>
          </div>
        </div>

        {/* 3-Column Inspection (Input -> Internal Processing -> Output) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Input */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>1. Entrada (Input)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{activeNodeData.inputDesc}</p>
          </div>

          {/* Column 2: Process */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>2. Processamento Interno</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{activeNodeData.processDesc}</p>
          </div>

          {/* Column 3: Output */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>3. Saída (Output)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{activeNodeData.outputDesc}</p>
          </div>
        </div>

        {/* Live Code / JSON Inspector & Security Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Code Viewer (2 Cols) */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-bold flex items-center gap-1.5 text-slate-300">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>Código / Payload Trafegado nesta Camada:</span>
              </span>
              <span className="font-mono text-[10px] uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                {activeNodeData.codeLang}
              </span>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200 overflow-x-auto shadow-inner">
              <pre className="text-blue-300 leading-relaxed whitespace-pre font-mono">
                {activeNodeData.codeSnippet}
              </pre>
            </div>
          </div>

          {/* Security & Action Preview (1 Col) */}
          <div className="space-y-4">
            {/* Security Guarantee Card */}
            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 space-y-2">
              <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Garantia de Engenharia:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{activeNodeData.securityNote}</p>
            </div>

            {/* Interactive Result Card for Final Node */}
            {activeNodeId >= 5 && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Resultado Entregue ao Usuário:</span>
                  <span className="text-[10px] font-mono text-slate-400">Nó 06 / 07</span>
                </div>

                {scenario.authorized ? (
                  <div className="space-y-2.5">
                    <Link
                      href={scenario.finalButton.route}
                      onClick={() => setHighlightSimulated(true)}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition hover:scale-[1.02]"
                    >
                      <span>{scenario.finalButton.label}</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                      ✦ Clicar neste botão leva diretamente ao destino com o efeito{" "}
                      <code className="text-blue-400">.mcp-highlight-pulse</code> ativo.
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-900/80 text-rose-300 text-xs font-semibold flex items-center gap-2.5">
                    <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400" />
                    <span>Acesso Bloqueado: Esta ação requer papel 'admin'. O aluno não pode navegar.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
