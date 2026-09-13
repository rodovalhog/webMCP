# 🌐 LearnFlow AI — Web MCP Semantic Navigator & On-Device AI Platform

> **AI Navigation Layer & Autonomous Agentic Web**: Transformando aplicações web em ecossistemas nativamente compreensíveis e navegáveis por agentes de IA através do **Model Context Protocol (MCP)**, **Chrome Built-in AI (Gemini Nano on-device)** e **Visão Multimodal com Gemini**.

[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/Protocol-Model_Context_Protocol-purple?style=flat)](https://modelcontextprotocol.io/)
[![Chrome AI](https://img.shields.io/badge/Chrome_Built--in_AI-Gemini_Nano-4285F4?style=flat&logo=googlechrome)](https://developer.chrome.com/docs/ai/built-in)
[![Gemini Vision](https://img.shields.io/badge/Google_Gemini-Multimodal_Vision-EA4335?style=flat&logo=googlegemini)](https://ai.google.dev/)
[![Tests](https://img.shields.io/badge/Tests-75%20Passed-emerald?style=flat)](#testes-automatizados)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📌 Sobre o Projeto

O **LearnFlow AI** é uma plataforma educacional corporativa desenvolvida para demonstrar a fronteira da engenharia de software frontend: **aplicações web preparadas para agentes de inteligência artificial autônomos**.

Diferente de abordagens tradicionais frágeis (como automações visuais por screen scraping ou injeção de dezenas de milhares de tokens de HTML cru no contexto de um LLM), este projeto implementa um **AI Navigation Layer**:
1. **Contrato Semântico no DOM**: Componentes visuais expõem atributos declarativos padronizados (`data-mcp-*`).
2. **Scanner Semântico Ultracompacto**: Higieniza a árvore DOM, remove dados sensíveis (PII) e extrai um mapa semântico ultraleve (redução de 98% no consumo de tokens).
3. **Servidor Web MCP Integrado**: Expõe ferramentas RPC para o agente inspecionar o estado, pesquisar rotas e solicitar navegação.
4. **IA Local no Browser (Chrome Built-in AI / Gemini Nano)**: Inferência 100% on-device via `window.ai` / `window.LanguageModel`, operando com zero latência de rede, privacidade absoluta e sem necessidade de API Keys.
5. **Visão Computacional & OCR Multimodal (Gemini 2.5 Flash / Pro)**: Processamento e extração estruturada de dados a partir de fotos de documentos (CNH/RG/Diplomas) para preenchimento autônomo com guardrails.
6. **Hierarquia de Páginas em Múltiplos Níveis (3 Níveis de Profundidade)**: O agente reconhece estruturas aninhadas ("página dentro de outra página", como **Requerimentos → Cursos → [React | Arquitetura | Next.js]** e **Trilhas → Módulos → Laboratórios**), navegando de forma contextualizada.
7. **Governança & Segurança RBAC**: A IA **nunca** atua como camada de autorização. O sistema emprega resolução segura de rotas em whitelist e gates determinísticos de permissão.

---

## 🏗️ Diagrama de Arquitetura

```mermaid
flowchart TD
    User([Usuário / Pergunta em Linguagem Natural]) -->|Input Texto / Imagem| ChatUI[AI Chat Widget & Document Ingestor]
    ChatUI --> AIService[AI Service Orchestrator]
    
    subgraph AI Providers Engine
        AIService --> Nano[Chrome Built-in AI / Gemini Nano (Local Browser)]
        AIService --> Gemini[Google Gemini Multimodal API (Vision & Pro)]
        AIService --> Mock[LearnFlow Deterministic Heuristic Provider]
    end

    subgraph Browser Semantic DOM
        HTML[React Components com data-mcp-*] --> Scanner[MCP DOM Semantic Scanner]
        Scanner --> SemanticMap[Lightweight Semantic Resources Map]
    end

    subgraph Model Context Protocol Engine
        SemanticMap --> MCPServer[In-App Web MCP Server]
        AIProviders -->|Tool Calls (JSON-RPC)| MCPClient[MCP Client]
        MCPClient -->|search_resources / navigate_to_resource| MCPServer
    end

    subgraph Security & Governance Layer
        MCPServer --> IntentValidator[Zod Schema Validator]
        IntentValidator --> AuthEngine[RBAC Policy Gate (Public / Student / Teacher / Admin)]
        AuthEngine -->|Autorizado| SafeRegistry[Safe Route Registry (Whitelist)]
        AuthEngine -->|Bloqueado| DenyGuardrail[ai.navigation.denied Event]
        SafeRegistry --> ClientRouter[Next.js Client Router (Turbopack)]
        SafeRegistry --> VisualPulse[DOM Visual Pulse Highlighter]
    end

    ClientRouter --> TelemetryBus[Observability & Event Bus]
    DenyGuardrail --> TelemetryBus
```

---

## ✨ Principais Funcionalidades

### 1. 🤖 Gemini Nano On-Device (Chrome Built-in AI)
* Executa nativamente no browser do usuário através da nova Prompt API do Chrome (`window.ai` / `window.LanguageModel`).
* Suporte completo aos ciclos de vida do modelo: `available`, `downloadable`, `downloading` e `unavailable`.
* Zero custos de API, zero dependência de servidores externos e total privacidade de dados.
* Console dedicado de diagnóstico e benchmark local em `/ai-test`.

### 2. 👁️ Visão Multimodal & OCR de Documentos
* Ingestão e upload de imagens (PNG, JPG, WebP) de documentos estudantis e identificações oficiais (CNH, RG).
* Pipeline de codificação Base64 e formatação no padrão `inline_data` para modelos Gemini Multimodais.
* Extração estruturada em JSON tipado: Nome, CPF, Data de Nascimento, Filiação e Categoria.
* Preenchimento automático inteligente no formulário de matrícula em `/dashboard/students/new`.

### 3. 🛡️ Formulário Inteligente com Guardrails para Agentes
* Formulário de cadastro com proteção contra edição indevida de campos sensíveis por agentes autônomos.
* Matriz de campos permitidos vs. proibidos: o agente pode preencher dados cadastrais básicos validados, mas é expressamente impedido de alterar campos protegidos (como percentual de bolsa, matrícula interna e registros de auditoria).

### 4. 🗂️ Arquitetura de Páginas Aninhadas em 3 Níveis
O agente compreende hierarquias profundas de navegação, discernindo relações pai-filho:
* **Nível 1 (Menu Principal)**: `/dashboard/requirements` — Central de Requerimentos Acadêmicos.
* **Nível 2 (Subpágina)**: `/dashboard/requirements/courses` — Requerimentos por Cursos.
* **Nível 3 (Sub-subpáginas Específicas)**:
  * `/dashboard/requirements/courses/react` — Critérios de Aprovação em React Avançado.
  * `/dashboard/requirements/courses/architecture` — Critérios de Arquitetura de Software & MCP.
  * `/dashboard/requirements/courses/nextjs` — Critérios de Server Components & Performance.
* **Academy Tracks (`/dashboard/tracks`)**: 3 Módulos de Especialização e 9 Laboratórios práticos com foco óptico animado (Pulso Visual).

### 5. 🔒 Segurança & RBAC Rigoroso
* **Nenhum `router.push(arbitraryUrl)`**: A aplicação bloqueia integralmente qualquer tentativa de redirecionamento para URLs não registradas na whitelist.
* **Prevenção de Prompt Injection**: Comandos maliciosos do usuário que tentem forçar o agente a executar ações administrativas ou pular etapas pedagógicas são bloqueados deterministicamente pelo guardrail no código.
* **Telemetria Criptografada**: Todos os eventos MCP geram hashes SHA-256 e são monitorados em tempo real no dashboard de observabilidade em `/observability`.

---

## 🧩 Contrato de Atributos Semânticos (DOM Layer)

| Atributo | Tipo | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `data-mcp-resource` | `string` | Nome identificador do recurso de negócio | `"academic_requirements"`, `"requirements_react"` |
| `data-mcp-action` | `enum` | Ação suportada pelo nó no DOM | `"navigate"`, `"view"`, `"execute"`, `"edit"` |
| `data-mcp-description`| `string` | Descrição técnica de alto nível para o LLM | `"Subpágina de Requerimentos do Curso de React"` |
| `data-mcp-access` | `enum` | Nível mínimo de acesso no RBAC | `"public"`, `"student"`, `"teacher"`, `"admin"` |
| `data-mcp-parent` | `string` | ID do recurso pai para construção de breadcrumbs | `"requirements_courses"`, `"academic_requirements"` |
| `data-mcp-context` | `JSON` | Metadados contextuais adicionais | `{"courseId": "react", "level": 3}` |

---

## 🛠️ Stack Tecnológica

* **Framework**: [Next.js 15+](https://nextjs.org/) com App Router e Turbopack.
* **Linguagem**: [TypeScript 5](https://www.typescriptlang.org/) (Tipagem estrita em ponta a ponta).
* **Interface & Estilização**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), Glassmorphism e Dark Mode nativo.
* **Ícones**: [Lucide React](https://lucide.dev/).
* **Protocolo de IA**: [Model Context Protocol (MCP)](https://modelcontextprotocol.io/).
* **Modelos de IA Suportados**:
  * **Google Gemini Nano** (Chrome Built-in AI, execução local on-device).
  * **Google Gemini 2.5 Flash / Pro** (Visão multimodal e tool calling).
  * **LearnFlow Native Heuristic Provider** (Determinístico, sem dependência externa).
* **Validação de Schemas**: [Zod](https://zod.dev/).
* **Testes**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* **Node.js**: Versão 20 ou superior recomendada.
* **Navegador**: Google Chrome Canary ou Dev (para testar a flag do Chrome Built-in AI / Gemini Nano).

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/web-mcp-semantic-navigator.git
cd web-mcp-semantic-navigator

# 2. Instale as dependências
npm install
# ou
yarn install

# 3. Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Habilitando o Gemini Nano Local (Chrome Built-in AI)
Para testar a inferência local sem API Key:
1. Abra o Chrome (versão 128+) e acesse `chrome://flags`.
2. Habilite **Enables optimization guide on device** para `Enabled BypassPerfRequirement`.
3. Habilite **Prompt API for Gemini Nano** para `Enabled`.
4. Reinicie o navegador e abra `/ai-test` para verificar o status `available`.

---

## 🧪 Testes Automatizados

O projeto possui uma suíte rigorosa de 75 testes automatizados cobrindo todas as camadas do sistema:

```bash
npm test
```

```text
PASS tests/nested-requirements.test.ts (13 tests)
PASS tests/three-level-tracks.test.ts (12 tests)
PASS tests/student-form.test.ts (8 tests)
PASS tests/gemini-nano.test.ts (9 tests)
PASS tests/vision-client.test.ts (7 tests)
PASS tests/document-extractor.test.ts (4 tests)
PASS tests/scanner.test.ts (5 tests)
PASS tests/registry.test.ts (5 tests)
PASS tests/permissions.test.ts (5 tests)
PASS tests/mcp-tools.test.ts (4 tests)
PASS tests/intent-and-flow.test.ts (3 tests)

Test Suites: 11 passed, 11 total
Tests:       75 passed, 75 total
Snapshots:   0 total
Time:        5.794 s
```

---

## 🗺️ Mapa de Rotas do Projeto

| Rota | Descrição | Nível |
| :--- | :--- | :--- |
| `/` | Landing Page informativa do protocolo Web MCP | Público |
| `/technical` | Deep-dive de engenharia, C4 Model e benchmarks | Público |
| `/how-it-works` | Simulador interativo do ciclo de navegação semântica | Público |
| `/ai-test` | Console de testes do Gemini Nano e Visão Multimodal | Público |
| `/dashboard` | Painel principal do aluno | Nível 1 |
| `/dashboard/requirements` | Central de Requerimentos Acadêmicos | Nível 1 |
| `/dashboard/requirements/courses` | Subpágina de Requerimentos por Cursos | Nível 2 |
| `/dashboard/requirements/courses/react` | Requerimentos do Curso de React | Nível 3 |
| `/dashboard/requirements/courses/architecture` | Requerimentos de Arquitetura de Software | Nível 3 |
| `/dashboard/requirements/courses/nextjs` | Requerimentos de Next.js 15 & RSC | Nível 3 |
| `/dashboard/tracks` | Central de Trilhas em 3 Níveis com Pulso Visual | Nível 1 a 3 |
| `/dashboard/students/new` | Formulário inteligente de cadastro com guardrails | Aluno |
| `/dashboard/courses` | Catálogo e grade curricular | Aluno |
| `/dashboard/certificates` | Central de certificados autenticados | Aluno |
| `/dashboard/progress` | Métricas de estudo e horas cumpridas | Aluno |
| `/mcp-inspector` | Console interativo de inspeção do DOM vs. JSON | Dev / Aluno |
| `/observability` | Dashboard de telemetria, latência e logs de auditoria | Aluno / Admin |
| `/dashboard/admin` | Painel de controle de permissões (Protegido por RBAC) | Admin |

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja `LICENSE` para mais detalhes.
