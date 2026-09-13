# Suporte Experimental ao Gemini Nano / Chrome Built-in AI

Guia de engenharia para utilização do modelo local **Gemini Nano** diretamente no navegador através da **Prompt API (LanguageModel)** do Google Chrome.

---

## 1. Visão Geral

O Gemini Nano é o modelo de inteligência artificial on-device mais eficiente da Google, projetado para rodar localmente no hardware do cliente (CPU/GPU/NPU).

### Principais Vantagens:
- **Zero API Keys**: Não requer cadastro no Google AI Studio nem tokens de API.
- **Zero Tráfego de Rede**: As perguntas e respostas não saem da máquina do usuário.
- **Privacidade Total**: Ideal para processamento de dados confidenciais ou ambientes offline.
- **Latência Preditível**: Elimina idas e vindas de rede (*round-trips* HTTP).

---

## 2. Requisitos do Chrome

Para que a API nativa `LanguageModel` funcione no seu navegador, certifique-se de atender aos seguintes pré-requisitos:

1. **Versão do Navegador**:
   - Google Chrome 131+ ou Google Chrome Canary atualizado.
2. **Hardware**:
   - Apple Silicon (M1/M2/M3/M4) ou processador com suporte a AVX2 / GPU dedicada com pelo menos 4GB de VRAM.
   - Pelo menos **22 GB de espaço livre em disco** para que o Chrome autorize o download dos binários do modelo (o modelo em si ocupa cerca de 1.5GB a 2.0GB, mas o Chrome exige margem de segurança de armazenamento).
3. **Flags do Chrome Habilitadas**:
   - Acesse `chrome://flags/#prompt-api-for-gemini-nano` e marque como **Enabled**.
   - Acesse `chrome://flags/#optimization-guide-on-device-model` e marque como **Enabled BypassPerfRequirement** (essencial para garantir que o Chrome não bloqueie o modelo por critérios rígidos de bateria ou hardware).
   - Clique em **Relaunch** para reiniciar completamente o Chrome.

---

## 3. Como Verificar o Status no Chrome

### A. Diagnóstico Interno do Modelo (`chrome://on-device-internals`)
1. Digite `chrome://on-device-internals` na barra de endereços do Chrome.
2. Na aba **Model Status**, verifique se o modelo está listado como:
   - `Model available`
   - `Model downloaded` ou `Download pending`
3. Na aba **Performance**, confira o provedor de execução (Metal no Mac, DirectML no Windows ou Vulkan no Linux).

### B. Forçar o Download dos Componentes (`chrome://components`)
Caso o modelo não tenha baixado automaticamente:
1. Digite `chrome://components` na barra de endereços.
2. Localize o componente **Optimization Guide On Device Model**.
3. Clique em **Check for update** (Verificar atualizações).
4. O status mudará para *Downloading* e, em seguida, *Up to date*.

### C. Teste Rápido no DevTools
Abra o DevTools (F12 ou Cmd+Option+I), acerte na aba **Console** e digite:
```javascript
await LanguageModel.availability();
```
O retorno esperado será:
- `'available'` ou `'readily'`: Modelo pronto para uso local.
- `'downloadable'` ou `'after-download'`: Suportado, pronto para download via chamada de criação.
- `'unavailable'` ou `'no'`: Verifique as flags e o espaço em disco.

---

## 4. Configuração de Idioma de Saída (Output Language)

Quando executamos `await LanguageModel.availability()`, o Chrome exibe o seguinte aviso:

```text
No output language was specified in a LanguageModel API request.
An output language should be specified to ensure optimal output quality and properly attest to output safety.

Supported languages:
[de, en, es, fr, ja]
```

### Idiomas Atualmente Suportados:
- Alemão (`de`)
- **Inglês (`en`)** *(Recomendado para melhor qualidade e segurança)*
- Espanhol (`es`)
- Francês (`fr`)
- Japonês (`ja`)

### Como Nossa Implementação Resolve Isso:
No módulo [`src/lib/ai/gemini-nano.ts`](file:///Users/guilhermerodovalho/Desktop/WEB-MCP-PROJETO/src/lib/ai/gemini-nano.ts), configuramos explicitamente o idioma de saída como `"en"` nas chamadas de disponibilidade e criação:

```typescript
// Configuração explícita de idioma de saída
const session = await modelApi.create({
  outputLanguage: "en",
  expectedOutputs: [{ type: "text", languages: ["en"] }]
});
```

Isso garante conformidade total com a especificação da Prompt API e remove o aviso do console.

---

## 5. Como Testar no Projeto (`/ai-test`)

Disponibilizamos uma página interativa dedicada em:
👉 **[http://localhost:3000/ai-test](http://localhost:3000/ai-test)**

### Passos de Teste:
1. Abra [http://localhost:3000/ai-test](http://localhost:3000/ai-test).
2. O console verificará automaticamente o status via `checkGeminiNanoAvailability()`.
3. Se o status for **Downloadable**, clique em **"Baixar Modelo (~1.5GB)"** e acompanhe a barra de progresso.
4. Quando o status estiver **Available**, digite um prompt em inglês (ex: *"Explain what cache-control is"*).
5. Clique em **"Executar"**.
6. A resposta será gerada localmente pelo Gemini Nano com o tempo de execução exibido em milissegundos.

---

## 6. Arquitetura do Código

### 1. Módulo Client-Side (`src/lib/ai/gemini-nano.ts`)
- `checkGeminiNanoAvailability()`: Detecta o `LanguageModel` e normaliza os estados para `"unavailable" | "downloadable" | "downloading" | "available"`.
- `createGeminiNanoSession()`: Cria a sessão local com monitoramento de progresso de download e logs de diagnóstico no modo desenvolvimento:
  - `[Gemini Nano] availability: available`
  - `[Gemini Nano] creating session`
  - `[Gemini Nano] prompt started`
  - `[Gemini Nano] prompt completed`

### 2. Abstração `AIProvider`
```typescript
export interface AIProvider {
  isAvailable(): Promise<boolean>;
  getStatus(): Promise<string>;
  generate(prompt: string): Promise<string>;
}

export class GeminiNanoProvider implements AIProvider {
  // Executa exclusivamente no modelo local sem fallback remoto
}
```

---

## 7. Limitações Atuais da Implementação

1. **Client-Only (Zero SSR)**: As APIs da Prompt API só existem no contexto de janela do navegador. Qualquer tentativa de execução no Node.js/Next.js SSR retorna `unavailable`.
2. **Idiomas do Modelo Base**: O Gemini Nano atualmente atesta conformidade e segurança para `de`, `en`, `es`, `fr`, `ja`. Prompts em inglês (`en`) apresentam a maior precisão técnica.
3. **Download Inicial**: Na primeira execução em máquinas novas, o Chrome pode levar de 1 a 3 minutos para concluir o download do modelo dependendo da velocidade da conexão.
