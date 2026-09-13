import React from "react";
import Link from "next/link";
import { MCPResource } from "@/components/mcp/MCPResource";
import { MCPAction } from "@/components/mcp/MCPAction";
import { Award, Download, CheckCircle2, ShieldCheck, ChevronLeft, Share2, Sparkles } from "lucide-react";

interface CertificatePageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseCertificatePage({ params }: CertificatePageProps) {
  const { id } = await params;
  const isReact = id === "react-avancado";
  const courseName = isReact ? "React Avançado: Hooks, Performance & Arquitetura" : "Next.js 15 & Arquitetura Web";
  const certificateCode = `LF-CERT-${id.toUpperCase()}-2026-9842`;

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/courses/${id}`}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar para o Curso</span>
        </Link>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition">
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartilhar</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition">
            <Download className="w-3.5 h-3.5" />
            <span>Baixar PDF</span>
          </button>
        </div>
      </div>

      {/* Semantic MCP Certificate Container */}
      <MCPResource
        id={`mcp-certificate-${id}`}
        resource="course_certificate"
        resourceId={id}
        action="view"
        description={`Certificado oficial de conclusão do curso ${courseName}`}
        parent="react_advanced"
        context={{
          courseId: id,
          code: certificateCode,
          student: "Guilherme Rodovalho",
        }}
        className="max-w-4xl mx-auto glass-panel p-8 sm:p-12 rounded-3xl border-2 border-amber-500/30 shadow-2xl relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950"
      >
        {/* Subtle Decorative Background Seal */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Certificate Framing */}
        <div className="border border-amber-500/20 p-8 rounded-2xl space-y-8 text-center relative z-10">
          {/* Logo & Header */}
          <div className="space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Award className="w-8 h-8" />
            </div>
            <div className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
              Certificado de Conclusão e Excelência
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              LearnFlow AI Academy
            </h1>
          </div>

          {/* Body */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-sm text-slate-400">Certificamos solenemente que</p>
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400">
              Guilherme Rodovalho
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              concluiu com êxito todas as exigências acadêmicas, desafios práticos e avaliação final do curso
              de especialização profissional em
            </p>
            <div className="text-xl font-bold text-white py-1">{courseName}</div>
            <p className="text-xs text-slate-400">
              Carga horária total de <strong>32 horas</strong> • Modalidade Imersiva com foco em Arquitetura,
              Performance e AI Navigation Layer.
            </p>
          </div>

          {/* Signatures & Credential ID */}
          <div className="pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center text-left">
            <div>
              <div className="text-[10px] text-slate-500 font-mono">AUTENTICAÇÃO DIGITAL</div>
              <div className="text-xs font-mono text-amber-400 font-bold tracking-wide mt-0.5">
                {certificateCode}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Assinado e Verificado Criptograficamente</span>
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-sm font-serif italic text-slate-300">Dr. Leonardo Silveira</div>
              <div className="text-[11px] text-slate-500">Diretor Acadêmico LearnFlow AI</div>
              <div className="text-[10px] text-slate-500">Emitido em 11 de Setembro de 2026</div>
            </div>
          </div>
        </div>
      </MCPResource>
    </div>
  );
}
