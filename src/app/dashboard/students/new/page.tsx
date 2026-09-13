"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MCPResource } from "@/components/mcp/MCPResource";
import { useAuth } from "@/context/AuthContext";
import { validateAgentFormGuardrail, FormGuardrailCheckResult } from "@/lib/mcp/permissions";
import { telemetry } from "@/lib/observability/telemetry";
import { DocumentUploadCard } from "@/components/ai/DocumentUploadCard";
import { ExtractedStudentData } from "@/lib/ai/document-extractor";
import {
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Bot,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  Terminal,
  RotateCcw,
  Lock,
  Check,
  Users,
  GraduationCap,
  ScanLine,
} from "lucide-react";

interface StudentFormState {
  fullName: string;
  email: string;
  phone: string;
  document: string;
  courseId: string;
  level: string;
  bio: string;
  role: "student" | "teacher" | "admin";
  termsAccepted: boolean;
}

const INITIAL_FORM: StudentFormState = {
  fullName: "",
  email: "",
  phone: "",
  document: "",
  courseId: "react-avancado",
  level: "intermediario",
  bio: "",
  role: "student",
  termsAccepted: false,
};

interface AgentLogEntry {
  id: string;
  timestamp: string;
  type: "info" | "success" | "guardrail_blocked" | "validation_error";
  message: string;
  field?: string;
}

export default function NewStudentPage() {
  const { role: currentUserRole } = useAuth();
  const [form, setForm] = useState<StudentFormState>(INITIAL_FORM);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [guardrailAlert, setGuardrailAlert] = useState<FormGuardrailCheckResult | null>(null);
  const [agentLogs, setAgentLogs] = useState<AgentLogEntry[]>([]);
  const [registeredStudents, setRegisteredStudents] = useState<Array<StudentFormState & { id: string; registeredAt: string }>>([
    {
      id: "std-1",
      fullName: "Mariana Costa",
      email: "mariana.costa@tech.edu.br",
      phone: "(11) 98765-4321",
      document: "452.128.990-12",
      courseId: "react-avancado",
      level: "avancado",
      bio: "Desenvolvedora Frontend focada em arquitetura de componentes.",
      role: "student",
      termsAccepted: true,
      registeredAt: "Hoje, 10:15",
    },
  ]);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [showDocumentUploader, setShowDocumentUploader] = useState(false);
  const [importedDocumentNotice, setImportedDocumentNotice] = useState<string | null>(null);

  const applyExtractedStudentData = (data: ExtractedStudentData) => {
    addLog("info", `📄 Extração de Documento detectada: Carregando dados de ${data.fullName}...`);

    setForm((prev) => ({
      ...prev,
      fullName: data.fullName || prev.fullName,
      email: data.email || prev.email,
      phone: data.phone || prev.phone,
      document: data.document || prev.document,
      courseId: data.courseId || prev.courseId,
      level: data.level || prev.level,
      bio: data.bio || prev.bio,
      role: "student", // Strictly preserved as student by guardrail
      termsAccepted: false, // Strictly requires human consent
    }));

    setImportedDocumentNotice(
      `Dados extraídos com sucesso do documento ${data.documentType} (${data.fileName || "arquivo"})! Revise as informações e marque o aceite de termos.`
    );

    addLog(
      "success",
      `✓ [OCR Vision]: Dados extraídos do documento '${data.documentType}' preenchidos com sucesso (Confiança: ${Math.round(data.confidence * 100)}%).`
    );

    telemetry.track("ai.navigation.executed", {
      resourceId: "student_registration",
      durationMs: 400,
      source: "system",
      userRole: currentUserRole,
      metadata: { action: "form_hydrated_from_document", documentType: data.documentType },
    });
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("learnflow_extracted_student_data");
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.removeItem("learnflow_extracted_student_data");
        applyExtractedStudentData(parsed);
      }
    } catch {
      // ignore
    }

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<ExtractedStudentData>;
      if (customEvent.detail) {
        applyExtractedStudentData(customEvent.detail);
      }
    };

    window.addEventListener("learnflow:fill_extracted_student", handler);
    return () => {
      window.removeEventListener("learnflow:fill_extracted_student", handler);
    };
  }, []);

  const addLog = (type: AgentLogEntry["type"], message: string, field?: string) => {
    const entry: AgentLogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString("pt-BR"),
      type,
      message,
      field,
    };
    setAgentLogs((prev) => [entry, ...prev].slice(0, 15));
  };

  // Simulates valid agent filling with deterministic field-by-field validation
  const handleAgentValidFill = async () => {
    if (isAgentTyping) return;
    setIsAgentTyping(true);
    setGuardrailAlert(null);
    setSubmissionSuccess(null);

    addLog("info", "🤖 Agente MCP ativado: Analisando esquema semântico do formulário...");

    const steps = [
      {
        field: "fullName",
        label: "Nome Completo",
        value: "Lucas Gabriel Santos",
        desc: "Preenchendo nome do aluno...",
      },
      {
        field: "email",
        label: "E-mail",
        value: "lucas.santos@exemplo.com.br",
        desc: "Validando formato de e-mail institucional...",
      },
      {
        field: "phone",
        label: "Telefone",
        value: "(11) 99421-8890",
        desc: "Formatando telefone com DDD...",
      },
      {
        field: "document",
        label: "CPF/Documento",
        value: "389.412.871-04",
        desc: "Validando integridade de documento...",
      },
      {
        field: "courseId",
        label: "Curso de Entrada",
        value: "react-avancado",
        desc: "Selecionando curso 'React Avançado' no catálogo...",
      },
      {
        field: "level",
        label: "Nível de Experiência",
        value: "intermediario",
        desc: "Configurando nível 'Intermediário'...",
      },
      {
        field: "bio",
        label: "Biografia",
        value: "Estudante focado em arquitetura frontend, Web MCP e desenvolvimento com TypeScript.",
        desc: "Registrando objetivos de aprendizagem do aluno...",
      },
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setActiveField(step.field);

      // Web MCP Guardrail check before each field fill
      const check = validateAgentFormGuardrail(step.field, step.value, currentUserRole);
      if (!check.allowed) {
        addLog("guardrail_blocked", `Tentativa bloqueada no campo ${step.field}: ${check.reason}`, step.field);
        continue;
      }

      await new Promise((resolve) => setTimeout(resolve, 380));

      setForm((prev) => ({
        ...prev,
        [step.field]: step.value,
      }));

      addLog("success", `✓ Campo '${step.label}' preenchido e validado com sucesso`, step.field);
      telemetry.track("ai.navigation.executed", {
        resourceId: "student_registration",
        durationMs: 15,
        source: "system",
        userRole: currentUserRole,
        metadata: { field: step.field, action: "agent_auto_fill" },
      });
    }

    setActiveField(null);
    setIsAgentTyping(false);
    addLog("info", "🛡️ [Guardrail MCP Ativo]: Termos legais e perfil mantidos sem alteração forçada. Pronto para revisão humana!");
  };

  // Simulates a malicious or accidental guardrail violation attempt by the AI
  const handleSimulateGuardrailViolation = async () => {
    if (isAgentTyping) return;
    setIsAgentTyping(true);
    setSubmissionSuccess(null);

    addLog("info", "⚠️ Simulação: Prompt solicitando que o agente torne o novo aluno um Administrador e force o aceite de termos...");

    await new Promise((resolve) => setTimeout(resolve, 400));
    setActiveField("role");

    // 1. RBAC Guardrail Check: AI trying to elevate role to admin
    const roleCheck = validateAgentFormGuardrail("role", "admin", currentUserRole);

    if (!roleCheck.allowed) {
      setGuardrailAlert(roleCheck);
      addLog("guardrail_blocked", `🛑 BLOQUEIO MCP: ${roleCheck.reason}`, "role");

      telemetry.track("ai.navigation.denied", {
        resourceId: "student_registration",
        durationMs: 8,
        source: "system",
        userRole: currentUserRole,
        metadata: {
          field: "role",
          targetValue: "admin",
          guardrail: roleCheck.guardrail,
          reason: roleCheck.reason,
        },
      });

      // Keep role as student
      setForm((prev) => ({ ...prev, role: "student" }));
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    setActiveField("termsAccepted");

    // 2. Consent Guardrail Check: AI trying to check LGPD consent without human action
    const consentCheck = validateAgentFormGuardrail("terms_accepted", true, currentUserRole);
    if (!consentCheck.allowed) {
      addLog("guardrail_blocked", `🛑 BLOQUEIO MCP: ${consentCheck.reason}`, "terms_accepted");

      telemetry.track("ai.navigation.denied", {
        resourceId: "student_registration",
        durationMs: 6,
        source: "system",
        userRole: currentUserRole,
        metadata: {
          field: "terms_accepted",
          targetValue: true,
          guardrail: consentCheck.guardrail,
          reason: consentCheck.reason,
        },
      });

      setForm((prev) => ({ ...prev, termsAccepted: false }));
    }

    setActiveField(null);
    setIsAgentTyping(false);
  };

  const handleResetForm = () => {
    setForm(INITIAL_FORM);
    setGuardrailAlert(null);
    setActiveField(null);
    setSubmissionSuccess(null);
    addLog("info", "Formulário resetado para os valores padrão.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      addLog("validation_error", "Erro: Preencha todos os campos obrigatórios antes de cadastrar.");
      return;
    }

    if (!form.termsAccepted) {
      addLog("validation_error", "Erro: O aceite dos Termos de Uso e LGPD é obrigatório pelo usuário humano.");
      setGuardrailAlert({
        allowed: false,
        field: "termsAccepted",
        guardrail: "HUMAN_CONSENT_REQUIRED",
        reason: "O formulário não pode ser submetido sem que o usuário humano marque expressamente o aceite dos Termos de Uso.",
      });
      return;
    }

    const newStudent = {
      ...form,
      id: `std-${Date.now()}`,
      registeredAt: "Agora mesmo",
    };

    setRegisteredStudents((prev) => [newStudent, ...prev]);
    setSubmissionSuccess(`Aluno "${form.fullName}" matriculado com sucesso no curso ${form.courseId}!`);
    addLog("success", `🎉 Aluno '${form.fullName}' cadastrado com sucesso no sistema!`);

    telemetry.track("ai.navigation.executed", {
      resourceId: "student_registration",
      durationMs: 40,
      source: "system",
      userRole: currentUserRole,
      metadata: {
        action: "student_registered",
        studentName: form.fullName,
        courseId: form.courseId,
        role: form.role,
      },
    });

    setForm(INITIAL_FORM);
    setGuardrailAlert(null);
  };

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      {/* Top Breadcrumb & Title */}
      <div>
        <Link
          href="/dashboard"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar ao Dashboard</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  Cadastro de Aluno
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    Web MCP Form Layer
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Formulário semântico com governança de agentes autônomos e guardrails de segurança ativos.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Simulation Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              id="btn-import-document"
              type="button"
              onClick={() => setShowDocumentUploader(!showDocumentUploader)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition ${
                showDocumentUploader
                  ? "bg-purple-600 text-white border-purple-500 shadow-md"
                  : "bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border-purple-500/40"
              }`}
            >
              <ScanLine className="w-4 h-4 text-purple-300" />
              <span>{showDocumentUploader ? "Fechar Scanner" : "📷 Importar de Documento (RG/CNH)"}</span>
            </button>

            <button
              id="btn-agent-valid-fill"
              type="button"
              onClick={handleAgentValidFill}
              disabled={isAgentTyping}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 disabled:opacity-50 transition"
            >
              <Bot className="w-4 h-4" />
              <span>{isAgentTyping ? "Agente Preenchendo..." : "🤖 Preenchimento Válido pelo Agente"}</span>
            </button>

            <button
              id="btn-simulate-guardrail-violation"
              type="button"
              onClick={handleSimulateGuardrailViolation}
              disabled={isAgentTyping}
              className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-2 disabled:opacity-50 transition"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>🛡️ Simular Violação de Guardrail</span>
            </button>

            <button
              type="button"
              onClick={handleResetForm}
              disabled={isAgentTyping}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs transition"
              title="Limpar campos"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Document Uploader if active */}
      {showDocumentUploader && (
        <div className="animate-in fade-in slide-in-from-top-3">
          <DocumentUploadCard
            onAutoFillCompleted={(data) => {
              applyExtractedStudentData(data);
              setShowDocumentUploader(false);
            }}
          />
        </div>
      )}

      {/* Imported from Document Notice */}
      {importedDocumentNotice && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-200 text-xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <ScanLine className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="font-medium">{importedDocumentNotice}</div>
          </div>
          <button
            type="button"
            onClick={() => setImportedDocumentNotice(null)}
            className="text-[10px] text-indigo-300 hover:text-white px-2 py-1 rounded bg-indigo-900/50 border border-indigo-700/50 transition"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Success Banner */}
      {submissionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="flex-1 font-medium">{submissionSuccess}</div>
        </div>
      )}

      {/* Interactive Guardrail Comparison Board (O que o Agente PODE vs NÃO PODE fazer) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Can do card */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span>O QUE O AGENTE PODE FAZER (Ações Autorizadas)</span>
          </div>

          <ul className="space-y-2 text-[11px] text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Preencher dados textuais:</strong> Nome, e-mail institucional, telefone com DDD e biografia.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Selecionar trilhas pedagógicas:</strong> Escolher curso no catálogo homologado e nível de proficiência.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Validação semântica:</strong> Conferir formato de e-mail, máscara de telefone e consistência de campos.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Interação via Chat:</strong> Extrair entidades e preencher o formulário quando solicitado pelo usuário.</span>
            </li>
          </ul>
        </div>

        {/* Cannot do card */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10 space-y-3">
          <div className="flex items-center gap-2.5 text-rose-400 font-bold text-xs">
            <div className="w-6 h-6 rounded-lg bg-rose-500/20 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <span>O QUE O AGENTE NÃO PODE FAZER (Guardrails Estritos)</span>
          </div>

          <ul className="space-y-2 text-[11px] text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">🛑</span>
              <span><strong>Elevação de privilégios:</strong> O agente é proibido de conceder permissão de Admin ou Instrutor.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">🛑</span>
              <span><strong>Bypass de consentimento legal:</strong> Proibido assinar ou marcar termos LGPD sem ação humana explícita.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">🛑</span>
              <span><strong>Manipulação de dados financeiros:</strong> Proibido manipular números de cartão ou faturamento (PCI-DSS).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">🛑</span>
              <span><strong>Sobrescrita silenciosa:</strong> Proibido deletar ou sobrescrever cadastros existentes sem confirmação.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Active Guardrail Violation Alert */}
      {guardrailAlert && !guardrailAlert.allowed && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-3.5 animate-in fade-in zoom-in-95">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-rose-300 flex items-center gap-2">
              <span>Intervenção de Segurança Web MCP: Guardrail Acionado</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30">
                {guardrailAlert.guardrail}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{guardrailAlert.reason}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Form + Real-Time MCP Agent Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: The Student Registration Form */}
        <div className="lg:col-span-2">
          <MCPResource
            id="mcp-student-registration-form"
            resource="student_registration"
            action="create"
            description="Formulário de cadastro de aluno com suporte a preenchimento semântico por IA e guardrails MCP"
            access="student"
            parent="dashboard"
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Dados Pessoais */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4 text-blue-400" />
                    <span>1. Dados Cadastrais & Contato</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Agente Autorizado
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome Completo */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Nome Completo *</span>
                      {activeField === "fullName" && (
                        <span className="text-[10px] text-blue-400 font-mono animate-pulse">
                          🤖 Agente escrevendo...
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Lucas Gabriel Santos"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      data-mcp-field="full_name"
                      data-mcp-allowed="true"
                      data-mcp-guardrail="Preenchimento livre por agente"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs text-white focus:outline-none transition-all ${
                        activeField === "fullName"
                          ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-950/20"
                          : "border-slate-700/80 focus:border-blue-500"
                      }`}
                    />
                  </div>

                  {/* E-mail Institucional */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>E-mail Institucional *</span>
                      {activeField === "email" && (
                        <span className="text-[10px] text-blue-400 font-mono animate-pulse">
                          🤖 Agente escrevendo...
                        </span>
                      )}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="lucas.santos@exemplo.com.br"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      data-mcp-field="email"
                      data-mcp-allowed="true"
                      data-mcp-guardrail="Validação sintática obrigatória"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs text-white focus:outline-none transition-all ${
                        activeField === "email"
                          ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-950/20"
                          : "border-slate-700/80 focus:border-blue-500"
                      }`}
                    />
                  </div>

                  {/* Telefone / WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Telefone / WhatsApp *</span>
                      {activeField === "phone" && (
                        <span className="text-[10px] text-blue-400 font-mono animate-pulse">
                          🤖 Agente escrevendo...
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="(11) 99421-8890"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      data-mcp-field="phone"
                      data-mcp-allowed="true"
                      data-mcp-guardrail="Formatação telefônica com DDD"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs text-white focus:outline-none transition-all ${
                        activeField === "phone"
                          ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-950/20"
                          : "border-slate-700/80 focus:border-blue-500"
                      }`}
                    />
                  </div>

                  {/* Documento / CPF */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>CPF / Documento</span>
                      {activeField === "document" && (
                        <span className="text-[10px] text-blue-400 font-mono animate-pulse">
                          🤖 Agente escrevendo...
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={form.document}
                      onChange={(e) => setForm({ ...form, document: e.target.value })}
                      data-mcp-field="document"
                      data-mcp-allowed="true"
                      data-mcp-guardrail="Documento de identificação do aluno"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs text-white focus:outline-none transition-all ${
                        activeField === "document"
                          ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-950/20"
                          : "border-slate-700/80 focus:border-blue-500"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Trilha e Matrícula Acadêmica */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>2. Matrícula & Trilha de Ensino</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Agente Autorizado
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Curso Escolhido */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Curso Homologado</label>
                    <select
                      value={form.courseId}
                      onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                      data-mcp-field="course_id"
                      data-mcp-allowed="true"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="react-avancado">React Avançado (Hooks, Server Components)</option>
                      <option value="nextjs-architecture">Next.js 16 Architecture & Turbopack</option>
                      <option value="typescript-pro">TypeScript Pro: Generics & Type Guards</option>
                      <option value="ai-engineering">Engenharia de IA com Web MCP & Gemini Nano</option>
                    </select>
                  </div>

                  {/* Nível */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Nível Pedagógico</label>
                    <select
                      value={form.level}
                      onChange={(e) => setForm({ ...form, level: e.target.value })}
                      data-mcp-field="level"
                      data-mcp-allowed="true"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="iniciante">Iniciante (Primeiros Passos)</option>
                      <option value="intermediario">Intermediário (Prática em Projetos)</option>
                      <option value="avancado">Avançado (Arquitetura & Produção)</option>
                    </select>
                  </div>

                  {/* Bio / Metas */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Biografia & Objetivos de Aprendizado</span>
                      {activeField === "bio" && (
                        <span className="text-[10px] text-blue-400 font-mono animate-pulse">
                          🤖 Agente escrevendo...
                        </span>
                      )}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Descreva as metas do aluno para personalização da trilha..."
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      data-mcp-field="bio"
                      data-mcp-allowed="true"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs text-white focus:outline-none transition-all ${
                        activeField === "bio"
                          ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-950/20"
                          : "border-slate-700/80 focus:border-blue-500"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Controle de Permissão & RBAC Guardrail */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>3. Perfil de Acesso & Segurança RBAC</span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    <ShieldAlert className="w-3 h-3" />
                    Guardrail Estrito
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-white">Perfil Atribuído ao Novo Cadastro</div>
                      <div className="text-[11px] text-slate-400">
                        O Agente de IA só pode criar com perfil <strong>Aluno (Student)</strong>. Elevação para Instrutor ou Admin exige ação manual autorizada.
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer bg-slate-900 px-3 py-1.5 rounded-xl border border-blue-500/40">
                        <input
                          type="radio"
                          name="student_role"
                          checked={form.role === "student"}
                          onChange={() => setForm({ ...form, role: "student" })}
                          className="text-blue-500"
                        />
                        <span>Aluno (Padrão)</span>
                      </label>

                      <label
                        className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-rose-500/40"
                        title="Bloqueado para o agente autônomo"
                      >
                        <input
                          type="radio"
                          name="student_role"
                          checked={form.role === "admin"}
                          onChange={() => {
                            if (currentUserRole !== "admin") {
                              setGuardrailAlert({
                                allowed: false,
                                field: "role",
                                guardrail: "RBAC_ROLE_ELEVATION_PROHIBITED",
                                reason: "A concessão do cargo de Administrador requer credenciais ativas de Administrador no sistema.",
                              });
                              return;
                            }
                            setForm({ ...form, role: "admin" });
                          }}
                          className="text-rose-500"
                        />
                        <span className="flex items-center gap-1">
                          <span>Admin</span>
                          <Lock className="w-3 h-3 text-rose-400" />
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Termos LGPD & Ação Humana Obrigatória */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>4. Consentimento Legal & LGPD</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 flex items-center gap-1 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                    <Lock className="w-3 h-3" />
                    Ação Humana Obrigatória
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-purple-950/10 border border-purple-500/30 flex items-start gap-3">
                  <input
                    id="chk-terms-accepted"
                    type="checkbox"
                    checked={form.termsAccepted}
                    onChange={(e) => {
                      setForm({ ...form, termsAccepted: e.target.checked });
                      if (e.target.checked && guardrailAlert?.field === "termsAccepted") {
                        setGuardrailAlert(null);
                      }
                    }}
                    data-mcp-field="terms_accepted"
                    data-mcp-allowed="false"
                    data-mcp-guardrail="Bypass de consentimento estritamente proibido para agentes"
                    className="mt-1 w-4 h-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="chk-terms-accepted" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
                    Declaro que o aluno consente com o tratamento de dados pessoais conforme a <strong>Lei Geral de Proteção de Dados (LGPD)</strong> e aceita as diretrizes de integridade da plataforma.
                    <span className="block text-[11px] text-purple-300/80 mt-1">
                      🔒 <strong>Regra de IA:</strong> O assistente de IA NÃO PODE assinar esta caixa automaticamente. A confirmação deve partir de um clique humano voluntário.
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <div className="text-[11px] text-slate-400">
                  * Campos de preenchimento obrigatório para emissão de certificado
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Concluir Matrícula do Aluno
                </button>
              </div>
            </form>
          </MCPResource>
        </div>

        {/* Right Col: Real-Time Agent Telemetry & Log Console */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">Console do Agente MCP</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Live Audit
              </span>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed">
              Auditoria em tempo real de cada tool call emitida pelo agente semântico, registrando campos preenchidos e guardrails acionados.
            </div>

            {/* Log Stream Container */}
            <div className="h-80 overflow-y-auto space-y-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-[10px]">
              {agentLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-4">
                  <Bot className="w-6 h-6 mb-2 opacity-40 animate-pulse" />
                  <span>Aguardando ativação do agente...</span>
                  <span className="text-[9px] mt-1 text-slate-600">
                    Clique em &quot;Preenchimento Válido&quot; ou &quot;Simular Violação&quot; acima.
                  </span>
                </div>
              ) : (
                agentLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2 rounded-lg border text-[10px] leading-tight ${
                      log.type === "success"
                        ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                        : log.type === "guardrail_blocked"
                        ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
                        : log.type === "validation_error"
                        ? "bg-amber-950/30 border-amber-500/30 text-amber-300"
                        : "bg-slate-900 border-slate-800 text-blue-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] opacity-70 mb-0.5">
                      <span>{log.type.toUpperCase()}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div>{log.message}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recently Registered Students Card */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Alunos Matriculados</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {registeredStudents.length} total
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {registeredStudents.map((std) => (
                <div
                  key={std.id}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{std.fullName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{std.registeredAt}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{std.email}</div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">
                      {std.courseId}
                    </span>
                    <span className="text-slate-500 capitalize">• {std.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
