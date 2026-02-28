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
      .then(data => { setPlayers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = (name: string) => {
    setSelected(sel =>
      sel.includes(name) ? sel.filter(n => n !== name) : [...sel, name]
    );
  };

  const toggleSynergyExpansion = (index: number) => {
    setExpandedSynergies(prev => ({ ...prev, [index]: !prev[index] }));
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
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/80 border-b border-zinc-800">
        <div className="flex items-center gap-2 px-4 flex-1">
          <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-white" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-800" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/" className="text-zinc-500 hover:text-white text-sm">
                  Football Manager
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-zinc-700" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white text-sm font-medium">Equipos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2 px-4">
          <Button variant="ghost" size="icon" aria-label="Notificaciones" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 bg-black overflow-auto">
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-6">Generar Equipos</h1>

            {/* Player selection */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4">
              {loading ? (
                <div className="text-center py-6 text-zinc-500">Cargando jugadores...</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">
                      Seleccionar Jugadores
                    </h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                      {players.map((p: any) => (
                        <label
                          key={p.id}
                          className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer border text-sm transition-colors ${
                            selected.includes(p.name)
                              ? 'bg-blue-500/10 border-blue-500/50 text-blue-300'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(p.name)}
                            onChange={() => handleSelect(p.name)}
                            className="w-3 h-3 rounded accent-blue-500"
                          />
                          <span className="font-medium truncate text-xs">{p.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={selected.length < 2 || submitting}
                    className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Generando...' : `Generar Equipos (${selected.length} jugadores)`}
                  </button>
                </form>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
                <p className="text-red-400 text-center text-sm">{error}</p>
              </div>
            )}

            {/* Results */}
            {teams.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h2 className="text-lg font-bold text-white mb-4">Opciones Balanceadas</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  {teams.map((t, i) => {
                    const teamAElo = t.eloA || 0;
                    const teamBElo = t.eloB || 0;
                    const higherEloTeam = teamAElo > teamBElo ? 'A' : teamBElo > teamAElo ? 'B' : null;
                    const teamAWinProb = t.teamAMetrics?.victoryProbability || 0;
                    const teamBWinProb = t.teamBMetrics?.victoryProbability || 0;
                    const favoriteTeam = teamAWinProb > teamBWinProb ? 'A' : 'B';
                    const isTopBalance = i < 3;

                    return (
                      <div
                        key={`team-option-${i}-${t.difference}`}
                        className={`border rounded-xl p-3 ${
                          isTopBalance
                            ? 'bg-zinc-800 border-blue-500/30'
                            : 'bg-zinc-800/60 border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-bold text-zinc-400">#{i + 1}</span>
                          {isTopBalance && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400">Top</span>
                          )}
                          {higherEloTeam && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              higherEloTeam === 'A' ? 'bg-green-500/15 text-green-400' : 'bg-blue-500/15 text-blue-400'
                            }`}>
                              Equipo {higherEloTeam} +{Math.abs(teamAElo - teamBElo)}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className={`border rounded-lg p-2.5 ${
                            higherEloTeam === 'A' ? 'bg-green-500/10 border-green-500/30' : 'bg-zinc-700/50 border-zinc-700'
                          }`}>
                            <div className="text-xs font-semibold text-green-400 mb-1 flex items-center gap-1">
                              Equipo A {favoriteTeam === 'A' && '🔥'}
                            </div>
                            <div className="text-xs text-zinc-500 mb-2">
                              ELO {teamAElo} · WR {((t.teamAMetrics?.avgWinRate || 0) * 100).toFixed(0)}%
                            </div>
                            <div className="space-y-1">
                              {t.teamA.map((name: string) => (
                                <div key={name} className="text-xs text-zinc-200">{name}</div>
                              ))}
                            </div>
                          </div>

                          <div className={`border rounded-lg p-2.5 ${
                            higherEloTeam === 'B' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-zinc-700/50 border-zinc-700'
                          }`}>
                            <div className="text-xs font-semibold text-blue-400 mb-1 flex items-center gap-1">
                              Equipo B {favoriteTeam === 'B' && '🔥'}
                            </div>
                            <div className="text-xs text-zinc-500 mb-2">
                              ELO {teamBElo} · WR {((t.teamBMetrics?.avgWinRate || 0) * 100).toFixed(0)}%
                            </div>
                            <div className="space-y-1">
                              {t.teamB.map((name: string) => (
                                <div key={name} className="text-xs text-zinc-200">{name}</div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {t.synergyWarnings && t.synergyWarnings.length > 0 && (
                          <div className="mt-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                            <button
                              onClick={() => toggleSynergyExpansion(i)}
                              className="w-full px-3 py-2 flex items-center justify-between text-xs hover:bg-yellow-500/10 transition-colors rounded-lg"
                            >
                              <span className="text-yellow-400 font-medium">Sinergias bajas ({t.synergyWarnings.length})</span>
                              {expandedSynergies[i] ? (
                                <ChevronUp className="h-3 w-3 text-yellow-400" />
                              ) : (
                                <ChevronDown className="h-3 w-3 text-yellow-400" />
                              )}
                            </button>
                            {expandedSynergies[i] && (
                              <div className="px-3 pb-2 text-xs text-yellow-300/70 space-y-1 max-h-28 overflow-y-auto">
                                {t.synergyWarnings.map((warning, idx) => (
                                  <div key={idx}>{warning.replace('Equipo A: ', '🟢 ').replace('Equipo B: ', '🔵 ')}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-3 gap-4 text-center text-xs text-zinc-500">
                  <div>
                    <div className="text-green-400 font-medium mb-1">Mejor Balance</div>
                    <div>#{teams.findIndex(t => t.balanceScore === Math.min(...teams.map(team => team.balanceScore))) + 1}</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-medium mb-1">Menor Δ ELO</div>
                    <div>#{teams.findIndex(t => t.difference === Math.min(...teams.map(team => team.difference))) + 1}</div>
                  </div>
                  <div>
                    <div className="text-yellow-400 font-medium mb-1">Menos Alertas</div>
                    <div>#{teams.findIndex(t => (t.synergyWarnings?.length || 0) === Math.min(...teams.map(team => team.synergyWarnings?.length || 0))) + 1}</div>
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
