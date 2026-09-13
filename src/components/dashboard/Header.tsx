"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useAI } from "@/context/AIContext";
import { AccessLevel } from "@/lib/mcp/types";
import {
  Sparkles,
  Search,
  Shield,
  GraduationCap,
  Briefcase,
  UserCheck,
  ExternalLink,
} from "lucide-react";

export const Header: React.FC = () => {
  const { user, role, setRole } = useAuth();
  const { toggleChat } = useAI();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Brand & Concept Title */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
              LearnFlow <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Web MCP Semantic Navigator
            </div>
          </div>
        </Link>
      </div>

      {/* Global AI Search Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={toggleChat}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 transition group shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
            <span>Pergunte como navegar ou encontrar qualquer recurso...</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Actions & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Interactive Role Switcher for Evaluators */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 px-2 hidden sm:flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Papel:</span>
          </span>
          <button
            onClick={() => setRole("student")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              role === "student"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Mudar papel para Aluno"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Aluno</span>
          </button>
          <button
            onClick={() => setRole("teacher")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              role === "teacher"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Mudar papel para Instrutor (Pode criar cursos)"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Instrutor</span>
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              role === "admin"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Mudar papel para Administrador"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>

        {/* Landing Page Link */}
        <Link
          href="/"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Ver Landing Page"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full border border-blue-500/40 object-cover"
          />
        </div>
      </div>
    </header>
  );
};
