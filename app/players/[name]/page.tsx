'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/page-header';

// ...existing code...

interface HistoryEntry {
  oldElo: number;
  newElo: number;
  changedAt: string;
  matchId: string;
  teamAPlayers: string[];
  teamBPlayers: string[];
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
      } catch (err) {
        setError('No se pudo obtener la información del jugador.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [name, apiUrl]);

  let streakLabel = '';
  let streakEmoji = '';
  if (player?.streaks) {
    if (player.streaks.currentType === 'win') {
      streakLabel = 'Victorias';
      streakEmoji = '🟢';
    } else if (player.streaks.currentType === 'loss') {
      streakLabel = 'Derrotas';
      streakEmoji = '🔴';
    } else {
      streakLabel = 'Empates';
      streakEmoji = '🟡';
    }
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title={player?.name || 'Jugador'} showSearch={false} />
      <div className="flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
      {loading ? (
          <div className="text-center py-8">
            <div className="text-white/70">Cargando...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-400">{error}</div>
          </div>
        ) : player ? (
          <>
            {/* Header Card */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 mb-6 shadow-2xl">
              <div className="flex items-center justify-center gap-4">
                <div className="text-5xl">👤</div>
                <h1 className="text-4xl font-bold text-white">
                  {player.name}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stats Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  📊 Estadísticas
                </h2>
                <div className="space-y-6">
                  {/* Estadísticas Principales - Más grandes y destacadas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/40 rounded-xl p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent"></div>
                      <div className="relative">
                        <div className="text-3xl font-bold text-blue-300 mb-1">{player.elo}</div>
                        <div className="text-white/80 text-sm font-medium flex items-center justify-center gap-1">
                          🎯 ELO Actual
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-xl p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent"></div>
                      <div className="relative">
                        <div className="text-3xl font-bold text-green-300 mb-1">{player.winRate.toFixed(1)}%</div>
                        <div className="text-white/80 text-sm font-medium flex items-center justify-center gap-1">
                          🏆 % Victorias
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Partidos y Resultados */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                      ⚽ Partidos
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-purple-500/15 border border-purple-500/30 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-purple-300">{player.totalMatchesPlayed}</div>
                        <div className="text-white/70 text-xs">Total</div>
                      </div>
                      <div className="bg-green-500/15 border border-green-500/30 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-green-300">{player.winCount}</div>
                        <div className="text-white/70 text-xs">Ganados</div>
                      </div>
                      <div className="bg-red-500/15 border border-red-500/30 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-red-300">{player.lossCount}</div>
                        <div className="text-white/70 text-xs">Perdidos</div>
                      </div>
                      <div className="bg-yellow-500/15 border border-yellow-500/30 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-yellow-300">{player.drawCount}</div>
                        <div className="text-white/70 text-xs">Empates</div>
                      </div>
                    </div>
                  </div>

                  {/* Goles y Asistencia */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                      🥅 Rendimiento
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-700/40 border border-slate-600/40 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-cyan-300">{player.goalsFor}</div>
                        <div className="text-white/70 text-xs">Goles a favor</div>
                      </div>
                      <div className="bg-slate-700/40 border border-slate-600/40 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-orange-300">{player.goalsAgainst}</div>
                        <div className="text-white/70 text-xs">Goles en contra</div>
                      </div>
                      <div className="bg-slate-700/40 border border-slate-600/40 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-indigo-300">
                          {player.attendanceRate != null ? player.attendanceRate + '%' : '-'}
                        </div>
                        <div className="text-white/70 text-xs">Asistencia</div>
                      </div>
                    </div>
                  </div>

                  {/* Rachas */}
                  {player.streaks && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                        🔥 Rachas
                      </h3>
                      <div className="bg-gradient-to-r from-slate-700/40 to-slate-600/40 border border-slate-600/50 rounded-xl p-4">
                        <div className="text-center mb-4">
                          <div className="text-sm text-white/60 mb-2">Racha actual</div>
                          <div className="flex items-center justify-center gap-3">
                            <span style={{ fontSize: '2rem' }}>{streakEmoji}</span>
                            <div>
                              <div className="text-2xl font-bold text-white">
                                {player.streaks.currentCount}
                              </div>
                              <div className="text-sm text-white/80">{streakLabel}</div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-green-500/15 border border-green-500/30 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-green-300">{player.streaks.maxWinStreak}</div>
                            <div className="text-white/70 text-xs">Mejor racha victorias</div>
                          </div>
                          <div className="bg-red-500/15 border border-red-500/30 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-red-300">{player.streaks.maxLossStreak}</div>
                            <div className="text-white/70 text-xs">Peor racha derrotas</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Synergies Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  🤝 Sinergias
                </h2>
                {synergies.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
                      <div className="text-sm text-white/60 mb-2">Compañeros destacados</div>
                      <div className="space-y-2">
                        {bestMate && (
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">👑</span>
                            <span className="text-white font-medium">{bestMate}</span>
                          </div>
                        )}
                        {worstMate && (
                          <div className="flex items-center gap-2">
                            <span className="text-red-400">💔</span>
                            <span className="text-white font-medium">{worstMate}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {synergies.map((s) => (
                        <div
                          key={s.mate}
                          className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">{s.mate}</span>
                            <span 
                              className={`text-sm px-2 py-1 rounded ${
                                s.winRate >= 70 ? 'bg-green-500/20 text-green-400' :
                                s.winRate >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {s.winRate.toFixed(0)}%
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-center">
                              <div className="text-green-400 font-medium">{s.victories}</div>
                              <div className="text-white/60 text-xs">Victorias</div>
                            </div>
                            <div className="text-center">
                              <div className="text-red-400 font-medium">{s.losses}</div>
                              <div className="text-white/60 text-xs">Derrotas</div>
                            </div>
                            <div className="text-center">
                              <div className="text-yellow-400 font-medium">{s.draws}</div>
                              <div className="text-white/60 text-xs">Empates</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-white/60">Aún no se registran sinergias.</div>
                  </div>
                )}
              </div>
            </div>

            {/* History Card */}
            <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                📈 Historial
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {player.history.map((h) => (
                  <div
                    key={h.matchId}
                    className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-blue-400 font-mono text-sm">
                        {new Date(h.changedAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono">
                          {h.newElo}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded font-mono ${
                          h.newElo - h.oldElo > 0 
                            ? 'bg-green-500/20 text-green-400' 
                            : h.newElo - h.oldElo < 0
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {h.newElo - h.oldElo > 0 ? '+' : ''}
                          {h.newElo - h.oldElo}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
                        <h4 className="text-green-400 font-medium mb-2">Equipo A</h4>
                        <div className="space-y-1">
                          {h.teamAPlayers.map((p) => (
                            <div 
                              key={p} 
                              className={`text-sm px-2 py-1 rounded ${
                                p === player.name 
                                  ? 'bg-green-500/30 text-green-300 font-medium' 
                                  : 'text-white/80'
                              }`}
                            >
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                        <h4 className="text-blue-400 font-medium mb-2">Equipo B</h4>
                        <div className="space-y-1">
                          {h.teamBPlayers.map((p) => (
                            <div 
                              key={p} 
                              className={`text-sm px-2 py-1 rounded ${
                                p === player.name 
                                  ? 'bg-blue-500/30 text-blue-300 font-medium' 
                                  : 'text-white/80'
                              }`}
                            >
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
        </div>
      </div>
    </div>
  );
}
