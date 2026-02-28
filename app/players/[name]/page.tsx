'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/page-header';

interface HistoryEntry {
  oldElo: number;
  newElo: number;
  changedAt: string;
  matchId?: string;
  teamAPlayers?: string[];
  teamBPlayers?: string[];
}

interface MateSynergy {
  mate: string;
  victories: number;
  losses: number;
  draws: number;
  matches: number;
  winRate: number;
}

interface Synergies {
  bestMate: string | null;
  worstMate: string | null;
  mates: MateSynergy[];
}

interface Player {
  id: string;
  name: string;
  elo: number;
  initialElo: number;
  winRate: number;
  totalMatchesPlayed: number;
  winCount: number;
  lossCount: number;
  drawCount: number;
  goalsFor: number;
  goalsAgainst: number;
  history: HistoryEntry[];
  synergies?: Synergies;
  streaks?: {
    currentType: 'win' | 'loss' | 'draw';
    currentCount: number;
    maxWinStreak: number;
    maxLossStreak: number;
  };
  attendanceRate?: number | null;
}

const statCell = "bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center";

export default function PlayerDetailPage() {
  const { name } = useParams<{ name: string }>();
  const playerName = decodeURIComponent(name);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [synergies, setSynergies] = useState<MateSynergy[]>([]);
  const [bestMate, setBestMate] = useState<string | null>(null);
  const [worstMate, setWorstMate] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await fetch(`${apiUrl}/players/${encodeURIComponent(playerName)}`);
        if (!res.ok) throw new Error('request failed');
        const data: Player = await res.json();
        setPlayer(data);
        if (data.synergies) {
          setSynergies(data.synergies.mates);
          setBestMate(data.synergies.bestMate);
          setWorstMate(data.synergies.worstMate);
        } else {
          setSynergies([]);
          setBestMate(null);
          setWorstMate(null);
        }
      } catch {
        setError('No se pudo obtener la información del jugador.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [name, apiUrl]);

  let streakLabel = '';
  let streakColor = 'text-zinc-400';
  if (player?.streaks) {
    if (player.streaks.currentType === 'win') { streakLabel = 'victorias'; streakColor = 'text-green-400'; }
    else if (player.streaks.currentType === 'loss') { streakLabel = 'derrotas'; streakColor = 'text-red-400'; }
    else { streakLabel = 'empates'; streakColor = 'text-yellow-400'; }
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={player?.name || 'Jugador'} showSearch={false} />
      <div className="flex-1 bg-black overflow-auto p-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-zinc-500">Cargando...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-400">{error}</div>
          ) : player ? (
            <>
              {/* Hero */}
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-white tracking-tight">{player.name}</h1>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-5xl font-bold text-blue-400 tabular-nums">{player.elo}</span>
                  <span className="text-zinc-500 text-sm">ELO</span>
                  <span className="text-2xl font-semibold text-green-400 tabular-nums ml-4">{player.winRate.toFixed(1)}%</span>
                  <span className="text-zinc-500 text-sm">victorias</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Stats */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">Estadísticas</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                      <div className={statCell}>
                        <div className="text-lg font-bold text-white">{player.totalMatchesPlayed}</div>
                        <div className="text-zinc-500 text-xs mt-1">Jugados</div>
                      </div>
                      <div className={statCell}>
                        <div className="text-lg font-bold text-green-400">{player.winCount}</div>
                        <div className="text-zinc-500 text-xs mt-1">Ganados</div>
                      </div>
                      <div className={statCell}>
                        <div className="text-lg font-bold text-red-400">{player.lossCount}</div>
                        <div className="text-zinc-500 text-xs mt-1">Perdidos</div>
                      </div>
                      <div className={statCell}>
                        <div className="text-lg font-bold text-yellow-400">{player.drawCount}</div>
                        <div className="text-zinc-500 text-xs mt-1">Empates</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className={statCell}>
                        <div className="text-lg font-bold text-white">{player.goalsFor}</div>
                        <div className="text-zinc-500 text-xs mt-1">Goles a favor</div>
                      </div>
                      <div className={statCell}>
                        <div className="text-lg font-bold text-white">{player.goalsAgainst}</div>
                        <div className="text-zinc-500 text-xs mt-1">En contra</div>
                      </div>
                      <div className={statCell}>
                        <div className="text-lg font-bold text-white">
                          {player.attendanceRate != null ? `${player.attendanceRate}%` : '—'}
                        </div>
                        <div className="text-zinc-500 text-xs mt-1">Asistencia</div>
                      </div>
                    </div>

                    {player.streaks && (
                      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                        <div className="text-xs text-zinc-500 mb-2">Racha actual</div>
                        <div className={`text-2xl font-bold ${streakColor}`}>
                          {player.streaks.currentCount} <span className="text-base font-normal">{streakLabel}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div>
                            <div className="text-xs text-zinc-500">Mejor racha</div>
                            <div className="text-green-400 font-semibold">{player.streaks.maxWinStreak} victorias</div>
                          </div>
                          <div>
                            <div className="text-xs text-zinc-500">Peor racha</div>
                            <div className="text-red-400 font-semibold">{player.streaks.maxLossStreak} derrotas</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Synergies */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">Sinergias</h2>
                  {synergies.length > 0 ? (
                    <div className="space-y-3">
                      {(bestMate || worstMate) && (
                        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 space-y-2">
                          {bestMate && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-500">Mejor compañero</span>
                              <span className="text-green-400 font-medium text-sm">{bestMate}</span>
                            </div>
                          )}
                          {worstMate && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-500">Peor compañero</span>
                              <span className="text-red-400 font-medium text-sm">{worstMate}</span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="space-y-2 max-h-72 overflow-y-auto">
                        {synergies.map((s) => (
                          <div key={s.mate} className="flex items-center justify-between px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl">
                            <span className="text-white text-sm font-medium">{s.mate}</span>
                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                              <span>{s.victories}V · {s.losses}D · {s.draws}E</span>
                              <span className={`font-semibold ${
                                s.winRate >= 60 ? 'text-green-400' :
                                s.winRate >= 40 ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>{s.winRate.toFixed(0)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-zinc-600">Sin sinergias registradas</div>
                  )}
                </div>
              </div>

              {/* History */}
              <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">Historial</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {player.history.map((h, idx) => {
                    const diff = h.newElo - h.oldElo;
                    const isReset = h.matchId?.startsWith('season-reset');
                    return (
                      <div key={h.matchId ?? idx} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-zinc-500 text-sm">
                            {isReset
                              ? `Reset temporada ${h.matchId?.replace('season-reset-', '')}`
                              : new Date(h.changedAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-mono font-semibold">{h.newElo}</span>
                            <span className={`text-sm font-mono px-2 py-0.5 rounded-lg ${
                              diff > 0 ? 'bg-green-500/10 text-green-400' :
                              diff < 0 ? 'bg-red-500/10 text-red-400' :
                              'bg-zinc-700 text-zinc-400'
                            }`}>
                              {diff > 0 ? '+' : ''}{diff}
                            </span>
                          </div>
                        </div>
                        {h.teamAPlayers && h.teamBPlayers ? (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs text-green-400 font-medium mb-1.5">Equipo A</div>
                              <div className="space-y-1">
                                {h.teamAPlayers.map((p) => (
                                  <div key={p} className={`text-xs px-2 py-1 rounded-lg ${
                                    p === player.name ? 'bg-green-500/10 text-green-300 font-medium' : 'text-zinc-400'
                                  }`}>{p}</div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-blue-400 font-medium mb-1.5">Equipo B</div>
                              <div className="space-y-1">
                                {h.teamBPlayers.map((p) => (
                                  <div key={p} className={`text-xs px-2 py-1 rounded-lg ${
                                    p === player.name ? 'bg-blue-500/10 text-blue-300 font-medium' : 'text-zinc-400'
                                  }`}>{p}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
