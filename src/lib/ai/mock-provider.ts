import { AccessLevel } from "../mcp/types";
import { AIProvider, AIProviderResponse } from "./types";
import { mcpClient } from "../mcp/client";

/**
 * Intelligent deterministic MockAIProvider.
 * Interacts with MCP Tools directly and simulates genuine agentic tool calling,
 * reasoning, and response generation with zero external API key requirements.
 */
export class MockAIProvider implements AIProvider {
  public name = "LearnFlow Intelligent Heuristic Agent (MCP Native)";

  public async processQuery(
    query: string,
    userRole: AccessLevel,
    currentContext?: Record<string, unknown>
  ): Promise<AIProviderResponse> {
    const q = query.toLowerCase().trim();
    const toolCalls: Array<{ name: string; input: Record<string, unknown>; output: unknown }> = [];

    // Helper to log tool call
    const recordToolCall = (name: string, input: Record<string, unknown>, output: unknown) => {
      toolCalls.push({ name, input, output });
    };

    // ==============================================================
    // 3-LEVEL NESTED PAGES: REQUERIMENTOS > CURSOS > [REACT, ARQUITETURA, NEXT.JS]
    // ==============================================================
    // Nível 3: Subpáginas específicas por tecnologia dentro de Cursos
    if (
      (q.includes("react") && (q.includes("requer") || q.includes("requisit") || q.includes("criteri") || q.includes("critéri") || q.includes("exigênc") || q.includes("exigenc") || q.includes("aprova") || q.includes("sub") || q.includes("pagina") || q.includes("página"))) ||
      q.includes("requerimento react") ||
      q.includes("requerimentos react") ||
      q.includes("requisito react") ||
      q.includes("requisitos react")
    ) {
      const searchRes = await mcpClient.searchResources({ query: "requerimentos react", role: userRole });
      recordToolCall("search_resources", { query: "requerimentos react", role: userRole }, searchRes);
      return {
        message:
          "🧭 **[Nível 3/3: Subpágina Específica]** Identifiquei que você deseja acessar a página do **Curso de React**, que está aninhada dentro da subpágina **Cursos**, contida no menu principal **Requerimentos** (`/dashboard/requirements/courses/react`).\n\nO Web MCP resolveu a rota aninhada em profundidade e está conduzindo você diretamente para os critérios de aprovação deste curso:",
        suggestedResource: "requirements_react",
        toolCalls,
      };
    }

    if (
      ((q.includes("arquitetura") || q.includes("architecture")) && (q.includes("requer") || q.includes("requisit") || q.includes("criteri") || q.includes("critéri") || q.includes("exigênc") || q.includes("exigenc") || q.includes("aprova") || q.includes("sub") || q.includes("pagina") || q.includes("página"))) ||
      q.includes("requerimento arquitetura") ||
      q.includes("requerimentos arquitetura") ||
      q.includes("requisitos arquitetura")
    ) {
      const searchRes = await mcpClient.searchResources({ query: "requerimentos arquitetura", role: userRole });
      recordToolCall("search_resources", { query: "requerimentos arquitetura", role: userRole }, searchRes);
      return {
        message:
          "🧭 **[Nível 3/3: Subpágina Específica]** Identifiquei que você deseja acessar a página do **Curso de Arquitetura de Software**, uma subpágina dentro de **Cursos**, localizada dentro do menu **Requerimentos** (`/dashboard/requirements/courses/architecture`).\n\nNavegando de forma autônoma para os requisitos de Clean Architecture e Web MCP:",
        suggestedResource: "requirements_architecture",
        toolCalls,
      };
    }

    if (
      ((q.includes("next") || q.includes("nextjs") || q.includes("next.js")) && (q.includes("requer") || q.includes("requisit") || q.includes("criteri") || q.includes("critéri") || q.includes("exigênc") || q.includes("exigenc") || q.includes("aprova") || q.includes("sub") || q.includes("pagina") || q.includes("página"))) ||
      q.includes("requerimento next") ||
      q.includes("requerimentos next") ||
      q.includes("requisitos next")
    ) {
      const searchRes = await mcpClient.searchResources({ query: "requerimentos nextjs", role: userRole });
      recordToolCall("search_resources", { query: "requerimentos nextjs", role: userRole }, searchRes);
      return {
        message:
          "🧭 **[Nível 3/3: Subpágina Específica]** Identifiquei que você deseja acessar a página do **Curso de Next.js**, localizada como sub-página de **Cursos** dentro do menu **Requerimentos** (`/dashboard/requirements/courses/nextjs`).\n\nO agente reconheceu a estrutura hierárquica e está direcionando você para as exigências técnicas de Server Components e Deploy:",
        suggestedResource: "requirements_nextjs",
        toolCalls,
      };
    }

    // Nível 2: Subpágina intermediária de Cursos dentro de Requerimentos
    if (
      (q.includes("curso") || q.includes("cursos")) &&
      (q.includes("requer") || q.includes("requisit") || q.includes("exigênc") || q.includes("exigenc") || q.includes("criteri") || q.includes("critéri") || q.includes("subpagina") || q.includes("sub página") || q.includes("sub-pagina"))
    ) {
      const searchRes = await mcpClient.searchResources({ query: "requerimentos cursos", role: userRole });
      recordToolCall("search_resources", { query: "requerimentos cursos", role: userRole }, searchRes);
      return {
        message:
          "📚 **[Nível 2/3: Subpágina Intermediária]** Identifiquei que você solicitou a subpágina **Cursos** que fica dentro do menu **Requerimentos** (`/dashboard/requirements/courses`).\n\nA partir desta página intermediária, você pode navegar pelas subpáginas filhas específicas: **React**, **Arquitetura** e **Next.js**:",
        suggestedResource: "requirements_courses",
        toolCalls,
      };
    }

    // Nível 1: Menu Principal de Requerimentos Acadêmicos
    if (
      q.includes("menu requerimento") ||
      q.includes("menu de requerimento") ||
      q.includes("requerimentos acadêmicos") ||
      q.includes("requerimento academico") ||
      q.includes("requerimentos academicos") ||
      q === "requerimentos" ||
      q === "requerimento" ||
      (q.includes("requerimento") && !q.includes("curso") && !q.includes("react") && !q.includes("arquitetura") && !q.includes("next"))
    ) {
      const searchRes = await mcpClient.searchResources({ query: "requerimentos", role: userRole });
      recordToolCall("search_resources", { query: "requerimentos", role: userRole }, searchRes);
      return {
        message:
          "🏛️ **[Nível 1/3: Menu Principal]** Levando você à central de **Requerimentos Acadêmicos** (`/dashboard/requirements`).\n\nEsta é a página-mãe de nível 1 do menu, que abriga a subpágina de **Cursos** (Nível 2) e os cursos técnicos aninhados (Nível 3):",
        suggestedResource: "academic_requirements",
        toolCalls,
      };
    }

    // ==============================================================
    // 3-LEVEL FEATURE HIERARCHY INTENTS: TRILHAS DE ESPECIALIZAÇÃO
    // ==============================================================
    // Level 3 (Sub-subfuncionalidades específicas):
    if (q.includes("pulso visual") || q.includes("simulador de pulso") || q.includes("pulso autônomo")) {
      const searchRes = await mcpClient.searchResources({ query: "pulso visual", role: userRole });
      recordToolCall("search_resources", { query: "pulso visual", role: userRole }, searchRes);
      return {
        message:
          "🧭 **[Nível 3/3: Ação Específica]** Conduzindo você ao **Simulador de Pulso Visual & Navegação Autônoma**.\n\nEste laboratório de nível 3 demonstra como o Web MCP injeta foco óptico e animação dinâmica no elemento de destino selecionado pelo agente:",
        suggestedResource: "track_mcp_visual_pulse",
        toolCalls,
      };
    }

    if (q.includes("scanner semântico") || q.includes("scanner do dom") || q.includes("tags data-mcp") || q.includes("laboratório de scanner")) {
      const searchRes = await mcpClient.searchResources({ query: "scanner semantico", role: userRole });
      recordToolCall("search_resources", { query: "scanner semantico", role: userRole }, searchRes);
      return {
        message:
          "🧭 **[Nível 3/3: Ação Específica]** Levando você ao **Laboratório de Scanner Semântico do DOM**.\n\nAqui você pode auditar em tempo real as tags semânticas expostas para o agente com higienização estrita de dados:",
        suggestedResource: "track_mcp_scanner_lab",
        toolCalls,
      };
    }

    if (q.includes("orquestrador") || q.includes("tool calling") || q.includes("orquestração de ferramentas")) {
      const searchRes = await mcpClient.searchResources({ query: "orquestrador", role: userRole });
      recordToolCall("search_resources", { query: "orquestrador", role: userRole }, searchRes);
      return {
        message:
          "🧭 **[Nível 3/3: Ação Específica]** Acessando o **Orquestrador de Ferramentas & Intenções**.\n\nVeja como a IA converte comandos textuais em chamadas JSON-RPC estruturadas para o protocolo Web MCP:",
        suggestedResource: "track_mcp_orchestrator",
        toolCalls,
      };
    }

    if (q.includes("pipeline de documentos") || q.includes("ingestão de documentos") || q.includes("pipeline de visão")) {
      const searchRes = await mcpClient.searchResources({ query: "pipeline documentos", role: userRole });
      recordToolCall("search_resources", { query: "pipeline documentos", role: userRole }, searchRes);
      return {
        message:
          "🧭 **[Nível 3/3: Ação Específica]** Abrindo o **Pipeline de Ingestão de Documentos**.\n\nNesta ferramenta de nível 3, o agente recebe o arquivo, higieniza e codifica para Base64 no formato inline_data do Gemini:",
        suggestedResource: "track_vision_pipeline",
        toolCalls,
      };
    }

    if (q.includes("prompt studio") || q.includes("studio de ocr") || q.includes("engenharia de prompt")) {
      const searchRes = await mcpClient.searchResources({ query: "prompt studio", role: userRole });
      recordToolCall("search_resources", { query: "prompt studio", role: userRole }, searchRes);
      return {
        message:
          "🧭 **[Nível 3/3: Ação Específica]** Levando você ao **Prompt Studio para OCR Estruturado**.\n\nAmbiente especializado para calibrar instruções semânticas e extrair JSONs tipados a partir de imagens e formulários:",
        suggestedResource: "track_vision_prompt_studio",
        toolCalls,
      };
    }

    if (q.includes("extrator automático de aluno") || q.includes("extrator de aluno") || q.includes("extrair dados de aluno")) {
      const searchRes = await mcpClient.searchResources({ query: "extrator aluno", role: userRole });
      recordToolCall("search_resources", { query: "extrator aluno", role: userRole }, searchRes);
      return {
        message:
          "🧭 **[Nível 3/3: Ação Específica]** Conduzindo ao **Extrator Automático de Alunos com IA**.\n\nEsta sub-ação processa documentos CNH/RG e prepara o pré-preenchimento autônomo com conformidade de segurança:",
        suggestedResource: "track_vision_student_extractor",
        toolCalls,
      };
    }

    if (q.includes("matriz de guardrails") || q.includes("tabela de permissões") || q.includes("guardrails rbac")) {
      const searchRes = await mcpClient.searchResources({ query: "guardrails", role: userRole });
      recordToolCall("search_resources", { query: "guardrails", role: userRole }, searchRes);
      return {
        message:
          "🧭 **[Nível 3/3: Ação Específica]** Posicionando na **Matriz de Guardrails e Políticas RBAC**.\n\nConsulte a tabela de permissões que impede ações não autorizadas antes mesmo de qualquer navegação ocorrer:",
        suggestedResource: "track_rbac_guardrails",
        toolCalls,
      };
    }

    if (q.includes("inspetor de telemetria") || q.includes("logs mcp") || q.includes("telemetria de agentes")) {
      const searchRes = await mcpClient.searchResources({ query: "telemetria", role: userRole });
      recordToolCall("search_resources", { query: "telemetria", role: userRole }, searchRes);
      return {
        message:
          "🧭 **[Nível 3/3: Ação Específica]** Acessando a área de **Telemetria e Logs MCP em Tempo Real**.\n\nVisualize a latência média, total de invocações e taxa de conformidade dos agentes:",
        suggestedResource: "track_rbac_telemetry",
        toolCalls,
      };
    }

    if (q.includes("emissor de certificado") || q.includes("certificado criptográfico") || q.includes("certificado sha-256")) {
      const searchRes = await mcpClient.searchResources({ query: "emissor certificado", role: userRole });
      recordToolCall("search_resources", { query: "emissor certificado", role: userRole }, searchRes);
      return {
        message:
          "🧭 **[Nível 3/3: Ação Específica]** Levando você ao **Emissor de Certificados Digitais Criptográficos**.\n\nAqui são emitidas credenciais com carimbo de tempo e hash SHA-256 após a conclusão dos módulos práticos:",
        suggestedResource: "track_rbac_certificate_issuer",
        toolCalls,
      };
    }

    // Level 2 (Subfuncionalidades / Módulos):
    if (
      q.includes("módulo de web mcp") ||
      q.includes("módulo web mcp") ||
      q.includes("módulo 1") ||
      q.includes("arquitetura web mcp") ||
      (q.includes("módulo") && q.includes("mcp"))
    ) {
      const searchRes = await mcpClient.searchResources({ query: "mcp architecture", role: userRole });
      recordToolCall("search_resources", { query: "mcp architecture", role: userRole }, searchRes);
      return {
        message:
          "📚 **[Nível 2/3: Subfuncionalidade]** Conduzindo você ao **Módulo 1: Arquitetura Frontend & Web MCP**.\n\nNeste módulo você encontra os laboratórios de Scanner do DOM, Orquestrador de Ferramentas e Pulso Visual:",
        suggestedResource: "track_mcp_architecture",
        toolCalls,
      };
    }

    if (
      q.includes("módulo de visão") ||
      q.includes("módulo visão") ||
      q.includes("módulo 2") ||
      q.includes("visão multimodal") ||
      (q.includes("módulo") && (q.includes("visao") || q.includes("visão")))
    ) {
      const searchRes = await mcpClient.searchResources({ query: "vision multimodal", role: userRole });
      recordToolCall("search_resources", { query: "vision multimodal", role: userRole }, searchRes);
      return {
        message:
          "📚 **[Nível 2/3: Subfuncionalidade]** Conduzindo você ao **Módulo 2: Visão Computacional & IA Multimodal**.\n\nExplore o pipeline de upload, o Prompt Studio de OCR e a extração automática de dados:",
        suggestedResource: "track_vision_multimodal",
        toolCalls,
      };
    }

    if (
      q.includes("módulo de governança") ||
      q.includes("módulo governança") ||
      q.includes("módulo 3") ||
      q.includes("módulo rbac") ||
      (q.includes("módulo") && (q.includes("segurança") || q.includes("rbac")))
    ) {
      const searchRes = await mcpClient.searchResources({ query: "governance rbac", role: userRole });
      recordToolCall("search_resources", { query: "governance rbac", role: userRole }, searchRes);
      return {
        message:
          "📚 **[Nível 2/3: Subfuncionalidade]** Conduzindo você ao **Módulo 3: Governança, RBAC & Telemetria**.\n\nAcesse os guardrails de segurança, a telemetria do protocolo e o emissor de certificados:",
        suggestedResource: "track_governance_rbac",
        toolCalls,
      };
    }

    // Level 1 (Macro Funcionalidade / Trilha Completa):
    if (
      q.includes("trilha de especialização") ||
      q.includes("trilhas de especialização") ||
      q.includes("ver a trilha") ||
      q.includes("trilha completa") ||
      q.includes("academy") ||
      q.includes("central de trilhas") ||
      q.includes("trilha de engenharia") ||
      q.includes("trilhas")
    ) {
      const searchRes = await mcpClient.searchResources({ query: "trilhas", role: userRole });
      recordToolCall("search_resources", { query: "trilhas", role: userRole }, searchRes);
      return {
        message:
          "🏛️ **[Nível 1/3: Macro Funcionalidade]** Levando você à **Central de Trilhas de Especialização & Projetos (Academy Tracks)**!\n\nAqui você tem a visão holística da formação de Engenharia de IA, dividida em 3 módulos principais e 9 laboratórios práticos:",
        suggestedResource: "academy_tracks",
        toolCalls,
      };
    }

    // 0. Check for Student Registration Intent ("cadastrar aluno", "novo aluno", "matrícula")
    if (
      q.includes("cadastrar aluno") ||
      q.includes("novo aluno") ||
      q.includes("matricular") ||
      q.includes("matrícula") ||
      q.includes("cadastro de aluno") ||
      q.includes("formulario de aluno") ||
      q.includes("formulário de aluno") ||
      q.includes("cadastro") && q.includes("aluno")
    ) {
      const searchRes = await mcpClient.searchResources({ query: "cadastrar aluno", role: userRole });
      recordToolCall("search_resources", { query: "cadastrar aluno", role: userRole }, searchRes);

      return {
        message:
          "Preparei o formulário inteligente de cadastro de alunos. O Web MCP já ativou os guardrails de segurança determinando o que posso e o que não posso preencher:",
        suggestedResource: "student_registration",
        toolCalls,
      };
    }

    // 1. Check for Resume/Continue Intent ("continuar", "de onde parei", "última aula")
    if (
      q.includes("continuar") ||
      q.includes("de onde parei") ||
      q.includes("minha aula") ||
      q.includes("estava fazendo")
    ) {
      const userCtx = await mcpClient.getCurrentContext();
      recordToolCall("get_current_context", {}, userCtx);

      return {
        message: `Você parou na aula **${userCtx.activeCourse.lastLesson}** do curso **${userCtx.activeCourse.title}** (Progresso atual: **${userCtx.activeCourse.progress}%**).\n\nDestaquei a aula em andamento para você continuar de imediato:`,
        suggestedResource: "continue_lesson",
        resourceContext: {
          courseId: userCtx.activeCourse.id,
          lessonId: "hooks-avancados",
        },
        toolCalls,
      };
    }

    // 2. Check for Course Creation Intent ("criar curso", "novo curso", "adicionar curso")
    if (
      q.includes("criar curso") ||
      q.includes("novo curso") ||
      q.includes("cadastrar curso") ||
      q.includes("criar um curso")
    ) {
      const searchRes = await mcpClient.searchResources({ query: "criar curso", role: userRole });
      recordToolCall("search_resources", { query: "criar curso", role: userRole }, searchRes);

      if (userRole === "student") {
        return {
          message:
            "Identifiquei sua intenção de criar um curso. No entanto, sua conta está com o perfil de **Aluno** e a política de segurança da plataforma restringe a criação de conteúdo a **Professores** ou **Administradores**.",
          suggestedResource: "create_course",
          toolCalls,
        };
      } else {
        return {
          message:
            "Encontrei a ferramenta de criação de conteúdo para instrutores. Destaquei o atalho no menu principal:",
          suggestedResource: "create_course",
          toolCalls,
        };
      }
    }

    // 3. Check for Certificate Intent ("certificado", "certificados", "diploma")
    if (q.includes("certificado") || q.includes("diploma")) {
      const isSpecificReact = q.includes("react");
      const searchQuery = isSpecificReact ? "react certificado" : "certificados";

      const searchRes = await mcpClient.searchResources({ query: searchQuery, role: userRole });
      recordToolCall("search_resources", { query: searchQuery, role: userRole }, searchRes);

      if (isSpecificReact) {
        return {
          message:
            "Encontrei o certificado oficial do curso **React Avançado**. Você pode acessá-lo diretamente pelo caminho abaixo ou visualizá-lo destacado na interface:",
          suggestedResource: "course_certificate",
          resourceContext: { courseId: "react-avancado" },
          toolCalls,
        };
      }

      return {
        message:
          "Encontrei a sua central de certificados de conclusão. Destaquei o link correspondente no menu de navegação:",
        suggestedResource: "certificates",
        toolCalls,
      };
    }

    // 4. Check for Progress Intent ("progresso", "evolução", "horas", "desempenho")
    if (q.includes("progresso") || q.includes("evolução") || q.includes("horas") || q.includes("desempenho")) {
      const searchRes = await mcpClient.searchResources({ query: "progresso", role: userRole });
      recordToolCall("search_resources", { query: "progresso", role: userRole }, searchRes);

      return {
        message:
          "Encontrei o seu painel de métricas e evolução de aprendizado. Destaquei o recurso no menu:",
        suggestedResource: "progress",
        toolCalls,
      };
    }

    // 5. Check for Profile Intent ("perfil", "minha conta", "meus dados", "alterar perfil", "foto")
    if (q.includes("perfil") || q.includes("minha conta") || q.includes("meus dados") || q.includes("alterar meu perfil")) {
      const searchRes = await mcpClient.searchResources({ query: "perfil", role: userRole });
      recordToolCall("search_resources", { query: "perfil", role: userRole }, searchRes);

      return {
        message:
          "Você pode visualizar e editar seus dados de perfil, foto e biografia na página de Perfil:",
        suggestedResource: "profile",
        toolCalls,
      };
    }

    // 6. Check for Settings Intent ("configurações", "configuração", "preferências", "ajustes", "tema")
    if (q.includes("configur") || q.includes("preferência") || q.includes("ajustes")) {
      const searchRes = await mcpClient.searchResources({ query: "configurações", role: userRole });
      recordToolCall("search_resources", { query: "configurações", role: userRole }, searchRes);

      return {
        message:
          "Encontrei as configurações da sua conta e preferências de notificação:",
        suggestedResource: "settings",
        toolCalls,
      };
    }

    // 7. Check for Courses / Lessons / React Course Intent ("curso de react", "cursos", "aulas")
    if (q.includes("react") || q.includes("curso")) {
      const searchRes = await mcpClient.searchResources({ query: "react", role: userRole });
      recordToolCall("search_resources", { query: "react", role: userRole }, searchRes);

      return {
        message:
          "Encontrei o curso **React Avançado**. Destaquei o cartão do curso na sua grade de estudos:",
        suggestedResource: "course",
        resourceContext: { courseId: "react-avancado" },
        toolCalls,
      };
    }

    // 8. General search via MCP Search Resources
    const generalSearch = await mcpClient.searchResources({ query, role: userRole });
    recordToolCall("search_resources", { query, role: userRole }, generalSearch);

    if (generalSearch.resources.length > 0) {
      const topMatch = generalSearch.resources[0];
      return {
        message: `Identifiquei o recurso **${topMatch.breadcrumbs.join(" → ")}** correspondente à sua busca. Destaquei sua localização na plataforma:`,
        suggestedResource: topMatch.id,
        resourceContext: topMatch.context as Record<string, unknown>,
        toolCalls,
      };
    }

    return {
      message:
        "Não consegui identificar um recurso específico para essa consulta no momento. Você pode tentar perguntas como:\n- *'Onde vejo meu certificado de React?'*\n- *'Quero continuar de onde parei'*\n- *'Onde vejo meu progresso?'*\n- *'Onde altero meu perfil?'*\n- *'Quero criar um curso'*",
      toolCalls,
    };
  }
}
