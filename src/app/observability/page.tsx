"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { telemetry } from "@/lib/observability/telemetry";
import { TelemetryEvent, TelemetryEventType } from "@/lib/mcp/types";
import {
  Activity,
  Search,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Clock,
  Trash2,
  ChevronLeft,
  Filter,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

export default function ObservabilityPage() {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [metrics, setMetrics] = useState(telemetry.getMetrics());
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    setEvents(telemetry.getEvents());
    setMetrics(telemetry.getMetrics());

    // Subscribe to live telemetry events
    const unsubscribe = telemetry.subscribe((newEvent) => {
      setEvents(telemetry.getEvents());
      setMetrics(telemetry.getMetrics());
    });

    return () => unsubscribe();
  }, []);

  const handleClear = () => {
    telemetry.clear();
    setEvents([]);
    setMetrics(telemetry.getMetrics());
  };

  const filteredEvents =
    filterType === "all" ? events : events.filter((e) => e.event === filterType);

  const getEventBadge = (type: TelemetryEventType) => {
    switch (type) {
      case "ai.navigation.executed":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            EXECUTED
          </span>
        );
      case "ai.navigation.resource_found":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            FOUND
          </span>
        );
      case "ai.navigation.resource_not_found":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-700 text-slate-300 border border-slate-600">
            NOT_FOUND
          </span>
        );
      case "ai.navigation.denied":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            DENIED
          </span>
        );
      case "ai.navigation.requested":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            REQUESTED
          </span>
        );
      case "ai.navigation.error":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-600 text-white">
            ERROR
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-400" />
            <span>Painel de Observabilidade & Telemetria</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Monitoramento em tempo real de requisições de navegação semântica, latência de inferência,
            taxa de acerto de recursos e bloqueios do gate de autorização.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Limpar Histórico</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Perguntas</span>
              <Search className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">{metrics.totalRequests}</div>
            <div className="text-[10px] text-slate-500 font-mono">Total de queries</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Encontrados</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{metrics.resourcesFound}</div>
            <div className="text-[10px] text-emerald-500/80 font-mono">Semantic match</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Taxa Sucesso</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300">{metrics.successRate}%</div>
            <div className="text-[10px] text-slate-500 font-mono">Precisão de busca</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Navegações</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-400">{metrics.navigationsExecuted}</div>
            <div className="text-[10px] text-slate-500 font-mono">Transições de tela</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Ações Negadas</span>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400">{metrics.actionsDenied}</div>
            <div className="text-[10px] text-rose-400/80 font-mono">Gate de segurança</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Tempo Médio</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{metrics.avgDurationMs}ms</div>
            <div className="text-[10px] text-slate-500 font-mono">Latência E2E</div>
          </div>
        </div>

        {/* Telemetry Stream Log */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Fluxo de Eventos em Tempo Real (Event Stream)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Eventos gerados pelo cliente MCP, scanner semântico e motor de autorização.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="all">Todos os Eventos</option>
                <option value="ai.navigation.requested">requested</option>
                <option value="ai.navigation.resource_found">resource_found</option>
                <option value="ai.navigation.executed">executed</option>
                <option value="ai.navigation.denied">denied</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Status / Tipo</th>
                  <th className="py-2.5 px-3">Horário</th>
                  <th className="py-2.5 px-3">Consulta / Recurso</th>
                  <th className="py-2.5 px-3">Papel</th>
                  <th className="py-2.5 px-3">Rota Resolvida</th>
                  <th className="py-2.5 px-3 text-right">Latência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                      Nenhum evento registrado com o filtro selecionado.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-900/50 transition">
                      <td className="py-3 px-3">{getEventBadge(evt.event)}</td>
                      <td className="py-3 px-3 text-slate-400">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-3 text-slate-200">
                        {evt.query ? (
                          <span className="font-sans italic text-slate-300">"{evt.query}"</span>
                        ) : (
                          <span className="text-blue-400">{evt.resourceId}</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 capitalize font-sans">
                          {evt.userRole}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-emerald-400 font-mono">
                        {evt.resolvedRoute || "—"}
                      </td>
                      <td className="py-3 px-3 text-right text-amber-400">
                        {evt.durationMs > 0 ? `${evt.durationMs}ms` : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
