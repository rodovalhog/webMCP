"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AIChatMessage } from "@/lib/mcp/types";
import { aiService } from "@/lib/ai/service";
import { MockAIProvider } from "@/lib/ai/mock-provider";
import { LiveLLMProvider } from "@/lib/ai/llm-provider";
import {
  GeminiNanoProvider,
  checkGeminiNanoAvailability,
  GeminiNanoCheckResult,
} from "@/lib/ai/gemini-nano-client";
import { resolveGeminiModel } from "@/lib/ai/gemini-client";
import { useAuth } from "./AuthContext";
import { highlightMCPResource } from "@/lib/mcp-dom/highlighter";

export type ModelType = "mock" | "gemini" | "openai" | "nano";

interface AIContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleChat: () => void;
  messages: AIChatMessage[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  executeNavigation: (targetRoute: string, resourceId?: string) => void;
  highlightResource: (resourceId: string) => void;
  clearHistory: () => void;
  activeModel: ModelType;
  setActiveModel: (model: ModelType) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  providerName: string;
  autoPilot: boolean;
  setAutoPilot: (enabled: boolean) => void;
  actionNotification: string | null;
  testConnection: (model: ModelType, key: string) => Promise<{ success: boolean; message: string }>;
  nanoStatus: GeminiNanoCheckResult | null;
  refreshNanoStatus: () => Promise<GeminiNanoCheckResult>;
}

const INITIAL_MESSAGES: AIChatMessage[] = [
  {
    id: "welcome-1",
    sender: "assistant",
    content:
      "Olá! Eu sou o **LearnFlow Semantic Navigator** com capacidade de **Ações Autônomas**.\n\nVocê pode me pedir: *'Me leva para meus certificados'*, *'Abre o curso de React'* ou *'Quero continuar de onde parei'*. Eu encontro o recurso e **executo a navegação por você no site**!",
    timestamp: Date.now() - 10000,
  },
];

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModelState] = useState<ModelType>("mock");
  const [apiKey, setApiKeyState] = useState<string>("");
  const [providerName, setProviderName] = useState<string>("LearnFlow Agent (Heurístico MCP)");
  const [autoPilot, setAutoPilotState] = useState<boolean>(true);
  const [actionNotification, setActionNotification] = useState<string | null>(null);
  const [nanoStatus, setNanoStatus] = useState<GeminiNanoCheckResult | null>(null);

  const router = useRouter();
  const { role } = useAuth();

  const refreshNanoStatus = useCallback(async () => {
    const res = await checkGeminiNanoAvailability();
    setNanoStatus(res);
    return res;
  }, []);

  useEffect(() => {
    try {
      const savedModel = localStorage.getItem("learnflow_ai_model") as ModelType;
      const savedKey = localStorage.getItem("learnflow_ai_key") || "";
      const savedAutoPilot = localStorage.getItem("learnflow_ai_autopilot");

      if (savedModel) setActiveModelState(savedModel);
      if (savedKey) setApiKeyState(savedKey);
      if (savedAutoPilot !== null) setAutoPilotState(savedAutoPilot === "true");

      refreshNanoStatus();
    } catch {
      // ignore
    }
  }, [refreshNanoStatus]);

  // Sync provider instance when model or key changes
  useEffect(() => {
    if (activeModel === "nano") {
      const nano = new GeminiNanoProvider();
      aiService.setProvider(nano);
      setProviderName(nano.name);
    } else if (activeModel === "gemini" && apiKey.trim()) {
      const live = new LiveLLMProvider("gemini", apiKey.trim());
      aiService.setProvider(live);
      setProviderName(live.name);
    } else if (activeModel === "openai" && apiKey.trim()) {
      const live = new LiveLLMProvider("openai", apiKey.trim());
      aiService.setProvider(live);
      setProviderName(live.name);
    } else {
      const mock = new MockAIProvider();
      aiService.setProvider(mock);
      setProviderName(mock.name);
    }
  }, [activeModel, apiKey]);

  const setActiveModel = (model: ModelType) => {
    setActiveModelState(model);
    try {
      localStorage.setItem("learnflow_ai_model", model);
    } catch {
      // ignore
    }
  };

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    try {
      localStorage.setItem("learnflow_ai_key", key);
    } catch {
      // ignore
    }
  };

  const setAutoPilot = (enabled: boolean) => {
    setAutoPilotState(enabled);
    try {
      localStorage.setItem("learnflow_ai_autopilot", String(enabled));
    } catch {
      // ignore
    }
  };

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const highlightResource = useCallback((resourceId: string) => {
    highlightMCPResource(resourceId);
  }, []);

  const executeNavigation = useCallback(
    (targetRoute: string, resourceId?: string) => {
      if (resourceId) {
        highlightMCPResource(resourceId);
      }
      router.push(targetRoute);
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setIsOpen(false);
      }
    },
    [router]
  );

  const testConnection = async (
    model: ModelType,
    key: string
  ): Promise<{ success: boolean; message: string }> => {
    if (model === "mock") {
      return { success: true, message: "Mock Heurístico conectado e pronto para operação." };
    }
    if (model === "nano") {
      const check = await checkGeminiNanoAvailability();
      setNanoStatus(check);
      if (!check.available) {
        return { success: false, message: check.message };
      }
      return { success: true, message: check.message };
    }
    if (!key.trim()) {
      return { success: false, message: "Por favor, insira uma Chave de API válida." };
    }

    try {
      if (model === "gemini") {
        const activeModel = await resolveGeminiModel(key.trim());
        const candidates = Array.from(
          new Set(["gemini-3.6-flash", activeModel, "gemini-3.0-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash"])
        ).filter((m) => m !== "gemini-2.5-flash");

        let successModel = "";
        let lastErr = "";

        for (let i = 0; i < candidates.length; i++) {
          const candidate = candidates[i];
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${key.trim()}`;
          try {
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: "ping" }] }],
                generationConfig: { maxOutputTokens: 5 },
              }),
            });

            if (res.ok) {
              successModel = candidate;
              localStorage.setItem("learnflow_gemini_model", candidate);
              break;
            }

            const errBody = await res.text();
            lastErr = errBody;

            // If Google specifically suggested a model, push to test next!
            const advised = errBody.match(/use models\/([a-zA-Z0-9_.-]+)/i);
            if (advised && advised[1] && !candidates.includes(advised[1])) {
              candidates.push(advised[1]);
            }
          } catch (e: unknown) {
            lastErr = String(e);
          }
        }

        if (!successModel) {
          throw new Error(lastErr);
        }

        return { success: true, message: `Conexão com Google Gemini realizada com sucesso! (Modelo: ${successModel})` };
      } else {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key.trim()}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "ping" }],
            max_tokens: 5,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return { success: true, message: "Conexão com OpenAI realizada com sucesso!" };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, message: `Falha ao conectar na API: ${msg}` };
    }
  };

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMsg: AIChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const response = await aiService.handleUserMessage(content, role);
        setMessages((prev) => [...prev, response]);

        // Autonomously perform action if autoPilot is enabled and action is authorized!
        if (response.navigationCard?.resourceId && response.navigationCard.isAuthorized) {
          const targetRoute = response.navigationCard.targetRoute;
          const resourceId = response.navigationCard.resourceId;

          // 1. Highlight on current page if element is visible
          highlightMCPResource(resourceId);

          // 2. If Auto-Pilot is enabled, automatically navigate for the user!
          if (autoPilot && targetRoute) {
            setActionNotification(`✦ Agente executando ação: Navegando para ${response.navigationCard.title}...`);

            setTimeout(() => {
              executeNavigation(targetRoute, resourceId);
              setTimeout(() => {
                highlightMCPResource(resourceId);
                setActionNotification(null);
              }, 400);
            }, 800);
          }
        }
      } catch (err) {
        console.error("Failed to process AI message:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, role, autoPilot, executeNavigation]
  );

  const clearHistory = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
  }, []);

  return (
    <AIContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleChat,
        messages,
        isLoading,
        sendMessage,
        executeNavigation,
        highlightResource,
        clearHistory,
        activeModel,
        setActiveModel,
        apiKey,
        setApiKey,
        providerName,
        autoPilot,
        setAutoPilot,
        actionNotification,
        testConnection,
        nanoStatus,
        refreshNanoStatus,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
}
