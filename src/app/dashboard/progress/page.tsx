"use client";

import React from "react";
import { MCPResource } from "@/components/mcp/MCPResource";
import { BarChart3, Clock, Flame, Award, CheckCircle2, TrendingUp, Calendar } from "lucide-react";

export default function ProgressPage() {
  const weeklyData = [
    { day: "Seg", hours: 3.2, active: true },
    { day: "Ter", hours: 4.5, active: true },
    { day: "Qua", hours: 2.8, active: true },
    { day: "Qui", hours: 5.1, active: true },
    { day: "Sex", hours: 3.9, active: true },
    { day: "Sáb", hours: 6.0, active: true },
    { day: "Dom", hours: 1.5, active: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Meu Progresso & Desempenho</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Métricas consolidadas de horas de estudo, ofensiva semanal e conclusão de módulos.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MCPResource
          resource="progress"
          action="view"
          description="Total de horas de estudo acumuladas"
          className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Horas Totais</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white">48.5h</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14% vs. semana passada</span>
          </div>
        </MCPResource>

        <MCPResource
          resource="progress"
          action="view"
          description="Ofensiva diária ininterrupta de estudo"
          className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ofensiva Diária</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">18 Dias</div>
          <div className="text-[11px] text-amber-400">Recorde pessoal do mês!</div>
        </MCPResource>

        <MCPResource
          resource="progress"
          action="view"
          description="Taxa média de aprovação nos questionários"
          className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Acurácia em Testes</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">92.4%</div>
          <div className="text-[11px] text-slate-400">38 exercícios resolvidos</div>
        </MCPResource>

        <MCPResource
          resource="progress"
          action="view"
          description="Certificados conquistados na plataforma"
          className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Certificados</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">3</div>
          <div className="text-[11px] text-purple-400">React, TypeScript, MCP</div>
        </MCPResource>
      </div>

      {/* Weekly Activity Chart Simulation */}
      <MCPResource
        resource="progress"
        action="view"
        description="Gráfico de horas diárias dedicadas na semana corrente"
        className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Dedicação Semanal (Últimos 7 dias)</span>
          </h2>
          <span className="text-xs text-slate-400">Média: 3.8 horas/dia</span>
        </div>

        <div className="grid grid-cols-7 gap-3 items-end h-48 pt-6 border-b border-slate-800 pb-2">
          {weeklyData.map((d, i) => {
            const heightPercent = Math.min(100, Math.round((d.hours / 6.5) * 100));
            return (
              <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[11px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                  {d.hours}h
                </span>
                <div
                  className="w-full max-w-[40px] bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all duration-300 group-hover:brightness-125 shadow-lg shadow-blue-500/10"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-xs font-semibold text-slate-300">{d.day}</span>
              </div>
            );
          })}
        </div>
      </MCPResource>
    </div>
  );
}
