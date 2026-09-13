"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { MCPResource } from "@/components/mcp/MCPResource";
import { ShieldAlert, Users, Trash2, ChevronLeft, ShieldCheck } from "lucide-react";

export default function AdminPage() {
  const { role, setRole } = useAuth();
  const isAdmin = role === "admin";

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/dashboard"
        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Voltar para Dashboard</span>
      </Link>

      {!isAdmin ? (
        <div className="glass-panel p-8 rounded-2xl border border-amber-500/30 bg-amber-950/20 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">Acesso Administrativo Restrito</h1>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Seu perfil atual é <strong>{role}</strong>. Este módulo requer permissões de{" "}
            <strong>Administrador do Sistema</strong>.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setRole("admin")}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
            >
              Alternar Papel para Admin (Testar Permissão)
            </button>
          </div>
        </div>
      ) : (
        <MCPResource
          id="mcp-admin-panel"
          resource="admin_panel"
          action="navigate"
          description="Painel administrativo de gerenciamento de alunos, relatórios e permissões"
          access="admin"
          parent="dashboard"
          className="glass-panel p-8 rounded-2xl border border-amber-500/30 space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Painel de Administração Global</h1>
              <p className="text-xs text-slate-400">
                Acesso de administrador confirmado. Gestão de usuários e parâmetros de segurança.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Usuários Recentes</h3>
            <div className="space-y-2">
              {[
                { name: "Maria Clara Santos", email: "maria@empresa.com", role: "student" },
                { name: "Prof. Roberto Mendes", email: "roberto@learnflow.ai", role: "teacher" },
              ].map((u, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{u.name}</div>
                    <div className="text-[10px] text-slate-400">{u.email} • Papel: {u.role}</div>
                  </div>
                  <button className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg text-xs transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </MCPResource>
      )}
    </div>
  );
}
