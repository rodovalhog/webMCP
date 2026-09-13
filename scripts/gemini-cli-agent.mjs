#!/usr/bin/env node

/**
 * Gemini CLI Agent (Outside the Browser)
 * Run from macOS Terminal:
 *   node scripts/gemini-cli-agent.mjs "Onde vejo meus certificados?"
 * Or interactively:
 *   node scripts/gemini-cli-agent.mjs
 */

import readline from "readline";

const API_KEY = process.env.GEMINI_API_KEY || "";
const MCP_ENDPOINT = process.env.MCP_ENDPOINT || "http://localhost:3000/api/mcp";

if (!API_KEY) {
  console.error("\x1b[31m[ERRO]\x1b[0m Nenhuma chave GEMINI_API_KEY informada.");
  console.error("Execute definindo a variável de ambiente:");
  console.error("  export GEMINI_API_KEY=\"sua_chave_do_google_aqui\"");
  console.error("  node scripts/gemini-cli-agent.mjs \"sua pergunta\"\n");
  process.exit(1);
}

// 1. Fetch available tools from the web application's MCP endpoint
async function fetchTools() {
  try {
    const res = await fetch(MCP_ENDPOINT);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("\x1b[33m[Aviso]\x1b[0m Não foi possível consultar http://localhost:3000/api/mcp. Usando ferramentas padrão.");
    return {
      tools: [
        {
          name: "navigate_to_resource",
          description: "Navega para qualquer recurso do LearnFlow",
          inputSchema: { type: "object", properties: { resourceId: { type: "string" } }, required: ["resourceId"] }
        },
        {
          name: "search_resources",
          description: "Busca recursos no catálogo",
          inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] }
        },
        {
          name: "get_current_context",
          description: "Consulta o aluno e curso atual",
          inputSchema: { type: "object", properties: {} }
        }
      ]
    };
  }
}

// 2. Call Google Gemini API directly from Node.js with candidate model fallback
async function askGemini(prompt, tools) {
  const candidateModels = ["gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash-002", "gemini-1.5-flash", "gemini-pro"];

  const functionDeclarations = tools.map((t) => ({
    name: t.name,
    description: t.description,
    parameters: {
      type: "OBJECT",
      properties: t.inputSchema?.properties || {},
      required: t.inputSchema?.required || [],
    },
  }));

  const systemInstruction = `Você é o agente autônomo LearnFlow AI operando diretamente no Terminal (Backend).
Você tem acesso às ferramentas do MCP da aplicação educacional LearnFlow.
Quando o usuário pedir para acessar algo, responda de forma prestativa e indique a ferramenta 'navigate_to_resource' com o 'resourceId' apropriado (ex: certificates, courses, progress, settings, profile, continue_lesson).`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemInstruction}\n\nComando do usuário: "${prompt}"` }],
      },
    ],
    tools: [{ function_declarations: functionDeclarations }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 400 },
  };

  let lastError = "";

  for (const model of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const candidate = data.candidates?.[0];
        const parts = candidate?.content?.parts || [];

        let text = "";
        const functionCalls = [];

        for (const p of parts) {
          if (p.text) text += p.text;
          if (p.functionCall) functionCalls.push(p.functionCall);
        }

        return { text, functionCalls, model };
      }

      const text = await res.text();
      lastError = `[${model}] ${text}`;
      if (res.status === 404) continue;
      throw new Error(`Erro Gemini (${res.status}): ${text}`);
    } catch (err) {
      if (!err.message.includes("404")) throw err;
      lastError = err.message;
    }
  }

  throw new Error(`Nenhum modelo Gemini compatível encontrado. Detalhes: ${lastError}`);
}

async function main() {
  console.log("\x1b[36m=====================================================\x1b[0m");
  console.log("\x1b[1m✦ LearnFlow AI — Agente Gemini no Terminal (CLI)\x1b[0m");
  console.log("Executando \x1b[32mfora do navegador\x1b[0m via Node.js + Google Gemini");
  console.log("\x1b[36m=====================================================\x1b[0m\n");

  const mcpData = await fetchTools();
  console.log(`\x1b[90m✓ Carregadas ${mcpData.tools?.length || 3} ferramentas MCP do servidor.\x1b[0m\n`);

  const initialQuery = process.argv.slice(2).join(" ").trim();

  if (initialQuery) {
    await processQuery(initialQuery, mcpData.tools);
    process.exit(0);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Digite sua pergunta ou 'sair' para encerrar:\n");
  const promptUser = () => {
    rl.question("\x1b[35mUsuário>\x1b[0m ", async (input) => {
      const q = input.trim();
      if (!q || q.toLowerCase() === "sair" || q.toLowerCase() === "exit") {
        rl.close();
        return;
      }
      await processQuery(q, mcpData.tools);
      console.log("");
      promptUser();
    });
  };

  promptUser();
}

async function processQuery(query, tools) {
  try {
    process.stdout.write("\x1b[90mConsultando Gemini fora do navegador...\x1b[0m\r");
    const res = await askGemini(query, tools);

    console.log("\x1b[32m✦ Gemini:\x1b[0m " + (res.text || "Comando processado."));

    if (res.functionCalls.length > 0) {
      console.log("\n\x1b[33m⚡ Ferramentas MCP Chamadas pelo Gemini:\x1b[0m");
      res.functionCalls.forEach((fc) => {
        console.log(`  → \x1b[1m${fc.name}\x1b[0m com parâmetros: ${JSON.stringify(fc.args)}`);
      });
    }
  } catch (err) {
    console.error("\x1b[31mErro:\x1b[0m", err.message);
  }
}

main();
