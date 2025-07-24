'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  }, [apiUrl, playerName]);

  let streakLabel = '';
  let streakEmoji = '';
  let streakColor = '';
  if (player?.streaks) {
    if (player.streaks.currentType === 'win') {
      streakLabel = 'Victorias';
      streakEmoji = '🟢';
      streakColor = '#16a34a';
    } else if (player.streaks.currentType === 'loss') {
      streakLabel = 'Derrotas';
      streakEmoji = '🔴';
      streakColor = '#dc2626';
    } else {
      streakLabel = 'Empates';
      streakEmoji = '🟡';
      streakColor = '#eab308';
    }
  }

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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/players" className="text-white/70">
                  Jugadores
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-white/50" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">
                  {player?.name || 'Jugador'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-auto">
        <div className="p-6">
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
                  {/* Main Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-1">{player.elo}</div>
                      <div className="text-white/70 text-sm">ELO Actual</div>
                      <div className="text-xs text-blue-300 mt-1">
                        {player.elo >= player.initialElo ? '+' : ''}{player.elo - player.initialElo} desde inicio
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-green-400 mb-1">{player.winRate.toFixed(1)}%</div>
                      <div className="text-white/70 text-sm">% Victorias</div>
                      <div className="w-full bg-slate-600/50 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-400 h-1.5 rounded-full transition-all duration-1000"
                          style={{ width: `${player.winRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-1">{player.totalMatchesPlayed}</div>
                      <div className="text-white/70 text-sm">Partidos</div>
                      <div className="text-xs text-purple-300 mt-1">
                        {player.attendanceRate != null ? `${player.attendanceRate}% asistencia` : 'Sin datos asistencia'}
                      </div>
                    </div>
                  </div>

                  {/* Match Results with improved design */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-green-500/15 to-green-600/15 border border-green-500/40 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">{player.winCount}</div>
                      <div className="text-white/70 text-sm">Ganados</div>
                      <div className="text-xs text-green-300 mt-1">
                        {player.totalMatchesPlayed > 0 ? `${((player.winCount / player.totalMatchesPlayed) * 100).toFixed(1)}%` : '0%'}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-500/15 to-red-600/15 border border-red-500/40 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-red-400 mb-1">{player.lossCount}</div>
                      <div className="text-white/70 text-sm">Perdidos</div>
                      <div className="text-xs text-red-300 mt-1">
                        {player.totalMatchesPlayed > 0 ? `${((player.lossCount / player.totalMatchesPlayed) * 100).toFixed(1)}%` : '0%'}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/15 to-yellow-600/15 border border-yellow-500/40 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400 mb-1">{player.drawCount}</div>
                      <div className="text-white/70 text-sm">Empates</div>
                      <div className="text-xs text-yellow-300 mt-1">
                        {player.totalMatchesPlayed > 0 ? `${((player.drawCount / player.totalMatchesPlayed) * 100).toFixed(1)}%` : '0%'}
                      </div>
                    </div>
                  </div>

                  {/* Streaks with enhanced design */}
                  {player.streaks && (
                    <div className="space-y-4">
                      <div className="bg-slate-700/40 border border-slate-600/40 rounded-xl p-4">
                        <div className="text-white/60 text-sm mb-2">Racha actual</div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span style={{ color: streakColor, fontSize: '1.5rem' }}>{streakEmoji}</span>
                            <div>
                              <div className="text-xl font-bold text-white">
                                {player.streaks.currentCount}
                              </div>
                              <div className="text-sm text-white/60">{streakLabel}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-green-500/15 to-green-600/15 border border-green-500/40 rounded-xl p-4 text-center">
                          <div className="text-xl font-bold text-green-400 mb-1">{player.streaks.maxWinStreak}</div>
                          <div className="text-white/70 text-sm">Mejor racha</div>
                          <div className="text-green-400 text-lg">🔥</div>
                        </div>
                        <div className="bg-gradient-to-br from-red-500/15 to-red-600/15 border border-red-500/40 rounded-xl p-4 text-center">
                          <div className="text-xl font-bold text-red-400 mb-1">{player.streaks.maxLossStreak}</div>
                          <div className="text-white/70 text-sm">Peor racha</div>
                          <div className="text-red-400 text-lg">💀</div>
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
                  <div className="space-y-6">
                    {/* Top Partners Section */}
                    <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
                      <div className="text-sm text-white/60 mb-3">Compañeros destacados</div>
                      <div className="space-y-3">
                        {bestMate && (
                          <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">👑</span>
                              <span className="text-white font-medium">{bestMate}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-green-400 font-bold">
                                {synergies.find(s => s.mate === bestMate)?.winRate.toFixed(0)}%
                              </div>
                              <div className="text-xs text-white/60">Mejor sinergia</div>
                            </div>
                          </div>
                        )}
                        {worstMate && (
                          <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">💔</span>
                              <span className="text-white font-medium">{worstMate}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-red-400 font-bold">
                                {synergies.find(s => s.mate === worstMate)?.winRate.toFixed(0)}%
                              </div>
                              <div className="text-xs text-white/60">Peor sinergia</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* All Synergies with improved visualization */}
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      <div className="text-sm text-white/60 mb-2">Todos los compañeros</div>
                      {synergies
                        .sort((a, b) => b.winRate - a.winRate)
                        .map((s) => {
                          const totalMatches = s.victories + s.losses + s.draws;
                          const winRateColor = s.winRate >= 70 ? 'green' : s.winRate >= 40 ? 'yellow' : 'red';
                          
                          return (
                            <div
                              key={s.mate}
                              className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4 hover:bg-slate-700/40 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-white text-lg">{s.mate}</span>
                                  <span className="text-xs text-white/50 bg-slate-600/50 px-2 py-1 rounded">
                                    {totalMatches} partidos
                                  </span>
                                </div>
                                <div className="text-right">
                                  <div className={`text-lg font-bold ${
                                    winRateColor === 'green' ? 'text-green-400' :
                                    winRateColor === 'yellow' ? 'text-yellow-400' :
                                    'text-red-400'
                                  }`}>
                                    {s.winRate.toFixed(0)}%
                                  </div>
                                </div>
                              </div>

                              {/* Visual Win Rate Bar - Full Width */}
                              <div className="mb-3">
                                <div className="w-full bg-slate-600/50 rounded-full h-3">
                                  <div 
                                    className={`h-3 rounded-full transition-all duration-500 ${
                                      winRateColor === 'green' ? 'bg-gradient-to-r from-green-500 to-green-400' :
                                      winRateColor === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                                      'bg-gradient-to-r from-red-500 to-red-400'
                                    }`}
                                    style={{ width: `${Math.max(s.winRate, 5)}%` }}
                                  ></div>
                                </div>
                              </div>

                              {/* Match Results Grid */}
                              <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                  <div className="text-green-400 font-bold text-xl">{s.victories}</div>
                                  <div className="text-white/60 text-xs">Victorias</div>
                                </div>
                                <div className="text-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                  <div className="text-red-400 font-bold text-xl">{s.losses}</div>
                                  <div className="text-white/60 text-xs">Derrotas</div>
                                </div>
                                <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                  <div className="text-yellow-400 font-bold text-xl">{s.draws}</div>
                                  <div className="text-white/60 text-xs">Empates</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🤝</div>
                    <div className="text-white/60 text-lg">Aún no se registran sinergias</div>
                    <div className="text-white/40 text-sm mt-2">Juega más partidos para ver tus compañeros favoritos</div>
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
      </main>
    </div>
  );
}
