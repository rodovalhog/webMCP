"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MCPResource } from "@/components/mcp/MCPResource";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Briefcase, FileText, CheckCircle2, Shield } from "lucide-react";

const ProfileSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Formato de e-mail inválido"),
  headline: z.string().min(5, "Título profissional deve ter pelo menos 5 caracteres"),
  bio: z.string().max(250, "Bio não pode ultrapassar 250 caracteres"),
  github: z.string().optional(),
});

type ProfileFormData = z.infer<typeof ProfileSchema>;

export default function ProfilePage() {
  const { user, role } = useAuth();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      headline: "Desenvolvedor Full Stack & AI Enthusiast",
      bio: "Focado em ecossistemas React, Next.js, TypeScript e arquitetura de agentes autônomos com MCP.",
      github: "https://github.com/guilhermerodovalho",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    // Simulate API update
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Meu Perfil de Aprendizado</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Atualize suas informações pessoais, dados de contato e preferências profissionais.
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Perfil atualizado com sucesso! As alterações já estão disponíveis no contexto do sistema.</span>
        </div>
      )}

      {/* Semantic MCP Profile Container */}
      <MCPResource
        id="mcp-profile-form-container"
        resource="profile"
        action="edit"
        description="Formulário de edição e gerenciamento de perfil do usuário"
        parent="dashboard"
        className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6"
      >
        {/* User Card Summary */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full border-2 border-blue-500/50 object-cover shadow-md"
          />
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-lg font-bold text-white">{user.name}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono text-blue-400">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30 capitalize">
                Papel: {role}
              </span>
            </div>
          </div>
        </div>

        {/* Form with React Hook Form + Zod */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Nome Completo</span>
              </label>
              <input
                {...register("name")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              {errors.name && <p className="text-[11px] text-rose-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>E-mail</span>
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              {errors.email && <p className="text-[11px] text-rose-400">{errors.email.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Título Profissional</span>
            </label>
            <input
              {...register("headline")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            {errors.headline && <p className="text-[11px] text-rose-400">{errors.headline.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Biografia Curta</span>
            </label>
            <textarea
              {...register("bio")}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
            />
            {errors.bio && <p className="text-[11px] text-rose-400">{errors.bio.message}</p>}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition"
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </MCPResource>
    </div>
  );
}
