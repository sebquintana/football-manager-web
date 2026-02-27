// app/teams/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Bell, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamOption {
  teamA: string[];
  teamB: string[];
  eloA: number;
  eloB: number;
  difference: number;
  balanceScore: number;
  teamAMetrics: { avgElo: number; avgWinRate: number; victoryProbability: number };
  teamBMetrics: { avgElo: number; avgWinRate: number; victoryProbability: number };
  synergyWarnings?: string[];
}

export default function TeamsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedSynergies, setExpandedSynergies] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch(`${apiUrl}/players`)
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = (name: string) => {
    setSelected(sel =>
      sel.includes(name) ? sel.filter(n => n !== name) : [...sel, name]
    );
  };

  const toggleSynergyExpansion = (index: number) => {
    setExpandedSynergies(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setTeams([]);
    try {
      const res = await fetch(`${apiUrl}/teams/balanced`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerNames: selected })
      });
      if (!res.ok) throw new Error('Error generando equipos');
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error('Error generating teams:', err);
      setError('No se pudieron generar los equipos.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full -m-4">
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80 border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-2 px-4 flex-1">
          <SidebarTrigger className="-ml-1 text-white" />
          <Separator
            orientation="vertical"
            className="mr-2 h-4 bg-white/20"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/" className="text-white/70">
                  Football Manager
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-white/50" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">
                  Equipos
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2 px-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notificaciones"
            className="text-white hover:bg-white/10"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-auto">
        <div className="p-4">
          <div className="max-w-6xl mx-auto">
            {/* Header Card - Más compacto */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 mb-4 shadow-2xl">
              <div className="flex items-center justify-center gap-3">
                <div className="text-3xl">⚽</div>
                <h1 className="text-3xl font-bold text-white">
                  Generar Equipos Balanceados
                </h1>
              </div>
            </div>

            {/* Players Selection - Más compacto */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/10 mb-4">
              {loading ? (
                <div className="text-center py-6">
                  <div className="text-white/70">Cargando jugadores...</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-3">Seleccionar Jugadores</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                      {players.map((p: any) => (
                        <label
                          key={p.id}
                          className={`
                            flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 border text-sm
                            ${selected.includes(p.name) 
                              ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                              : 'bg-slate-700/40 border-slate-600/30 text-white/80 hover:bg-slate-600/40 hover:border-slate-500/50'
                            }
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(p.name)}
                            onChange={() => handleSelect(p.name)}
                            className="w-3 h-3 rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="font-medium truncate">{p.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={selected.length < 2 || submitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                  >
                    {submitting ? 'Generando...' : `Generar Equipos (${selected.length} jugadores)`}
                  </button>
                </form>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-4">
                <p className="text-red-300 text-center text-sm">{error}</p>
              </div>
            )}

            {/* Results - Layout optimizado para 10 opciones */}
            {teams.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4 text-center">Opciones de Equipos Balanceados</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  {teams.map((t, i) => {
                    // Calcular ELO total de cada equipo con nuevos nombres
                    const teamAElo = t.eloA || 0;
                    const teamBElo = t.eloB || 0;
                    const higherEloTeam = teamAElo > teamBElo ? 'A' : teamBElo > teamAElo ? 'B' : null;
                    
                    // Probabilidades de victoria
                    const teamAWinProb = t.teamAMetrics?.victoryProbability || 0;
                    const teamBWinProb = t.teamBMetrics?.victoryProbability || 0;
                    const favoriteTeam = teamAWinProb > teamBWinProb ? 'A' : 'B';
                    
                    // Balance Score para ranking
                    const balanceScore = t.balanceScore || 0;
                    const isTopBalance = i < 3; // Top 3 opciones mejor balanceadas
                    
                    return (
                      <div
                        key={`team-option-${i}-${t.difference}`}
                        className={`border border-slate-600/30 rounded-lg p-3 backdrop-blur-sm transition-all hover:bg-slate-700/50 ${
                          isTopBalance 
                            ? 'bg-slate-700/60 border-blue-500/30' 
                            : 'bg-slate-700/40'
                        }`}
                      >
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-blue-400">#{i + 1}</h3>
                            {isTopBalance && (
                              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                                ⭐ Top
                              </span>
                            )}
                            {higherEloTeam && (
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                higherEloTeam === 'A' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {higherEloTeam} (+{Math.abs(teamAElo - teamBElo)})
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {/* Team A */}
                          <div className={`border rounded p-2 ${
                            higherEloTeam === 'A' 
                              ? 'bg-green-500/15 border-green-500/40' 
                              : 'bg-green-500/10 border-green-500/30'
                          }`}>
                            <div className="text-center mb-2">
                              <h4 className="text-green-400 font-bold text-sm flex items-center justify-center gap-1">
                                Equipo A
                                {favoriteTeam === 'A' && <span className="text-xs">🔥</span>}
                              </h4>
                              <div className="text-xs text-green-300/80 space-y-0.5">
                                <div>ELO: {teamAElo}</div>
                                <div>Avg: {(t.teamAMetrics?.avgElo || 0).toFixed(0)}</div>
                                <div>WR: {((t.teamAMetrics?.avgWinRate || 0) * 100).toFixed(0)}%</div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {t.teamA.map((name: string) => (
                                <div key={name} className="text-white/90 text-center py-0.5 px-1 bg-green-500/20 rounded text-xs">
                                  {name}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Team B */}
                          <div className={`border rounded p-2 ${
                            higherEloTeam === 'B' 
                              ? 'bg-blue-500/15 border-blue-500/40' 
                              : 'bg-blue-500/10 border-blue-500/30'
                          }`}>
                            <div className="text-center mb-2">
                              <h4 className="text-blue-400 font-bold text-sm flex items-center justify-center gap-1">
                                Equipo B
                                {favoriteTeam === 'B' && <span className="text-xs">🔥</span>}
                              </h4>
                              <div className="text-xs text-blue-300/80 space-y-0.5">
                                <div>ELO: {teamBElo}</div>
                                <div>Avg: {(t.teamBMetrics?.avgElo || 0).toFixed(0)}</div>
                                <div>WR: {((t.teamBMetrics?.avgWinRate || 0) * 100).toFixed(0)}%</div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {t.teamB.map((name: string) => (
                                <div key={name} className="text-white/90 text-center py-0.5 px-1 bg-blue-500/20 rounded text-xs">
                                  {name}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Synergy Warnings - Desplegable */}
                        {t.synergyWarnings && t.synergyWarnings.length > 0 && (
                          <div className="mt-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs">
                            <button
                              onClick={() => toggleSynergyExpansion(i)}
                              className="w-full p-2 flex items-center justify-between hover:bg-yellow-500/20 transition-colors rounded"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-yellow-400 font-semibold">⚠️ Sinergias Bajas</span>
                                <span className="text-yellow-300/60">({t.synergyWarnings.length})</span>
                              </div>
                              {expandedSynergies[i] ? (
                                <ChevronUp className="h-3 w-3 text-yellow-400" />
                              ) : (
                                <ChevronDown className="h-3 w-3 text-yellow-400" />
                              )}
                            </button>
                            {expandedSynergies[i] && (
                              <div className="px-2 pb-2">
                                <div className="text-yellow-300/80 space-y-1 max-h-32 overflow-y-auto">
                                  {t.synergyWarnings.map((warning, idx) => (
                                    <div key={idx} className="text-xs leading-relaxed">
                                      {warning.replace('Equipo A: ', '🟢 ').replace('Equipo B: ', '🔵 ')}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Summary Stats */}
                <div className="mt-4 p-3 bg-slate-700/30 border border-slate-600/30 rounded-lg">
                  <div className="text-center text-xs text-white/60">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-green-400 font-semibold">Mejor Balance</div>
                        <div>#{teams.findIndex(t => t.balanceScore === Math.min(...teams.map(team => team.balanceScore))) + 1}</div>
                      </div>
                      <div>
                        <div className="text-blue-400 font-semibold">Menor Diferencia ELO</div>
                        <div>#{teams.findIndex(t => t.difference === Math.min(...teams.map(team => team.difference))) + 1}</div>
                      </div>
                      <div>
                        <div className="text-purple-400 font-semibold">Menos Advertencias</div>
                        <div>#{teams.findIndex(t => (t.synergyWarnings?.length || 0) === Math.min(...teams.map(team => team.synergyWarnings?.length || 0))) + 1}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
