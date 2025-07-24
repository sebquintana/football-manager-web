"use client";

import { useEffect, useState } from "react";
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

interface Match {
  id: string;
  date: string;
  winner: "A" | "B";
  goalDifference: number;
  teamAPlayers: string[];
  teamBPlayers: string[];
}

export default function MatchesPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const [matches, setMatches] = useState<Match[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`${apiUrl}/matches/summary`);
        const data: Match[] = await res.json();
        data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setMatches(data);
      } catch (err) {
        setError("No se pudieron obtener los partidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

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
                  Partidos
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
          <div className="max-w-3xl mx-auto">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-6 shadow-2xl">
              <div className="flex items-center justify-center gap-3">
                <div className="text-4xl">🏟️</div>
                <h1 className="text-4xl font-bold text-white">
                  Partidos Jugados
                </h1>
              </div>
            </div>

        {/* Matches List */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-white/70">Cargando...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-400">{error}</div>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match, index) => {
                const expanded = expandedId === match.id;
                const isWinnerA = match.winner === "A";
                
                return (
                  <div
                    key={match.id}
                    className="bg-slate-700/40 border border-slate-600/30 rounded-xl backdrop-blur-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedId(expanded ? null : match.id)}
                      className="w-full p-4 text-left hover:bg-slate-600/40 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-blue-400 font-mono text-sm min-w-[6rem]">
                            {new Date(match.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white/80">Ganador:</span>
                            <span className={`font-bold px-2 py-1 rounded text-sm ${
                              isWinnerA 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              Equipo {match.winner}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-white/60 text-sm">Diferencia:</span>
                            <span className="text-white font-mono ml-2">
                              {match.goalDifference}
                            </span>
                          </div>
                          <div className={`text-white/60 transition-transform duration-200 ${
                            expanded ? 'rotate-180' : ''
                          }`}>
                            ▼
                          </div>
                        </div>
                      </div>
                    </button>
                    
                    {expanded && (
                      <div className="border-t border-slate-600/30 p-4 bg-slate-800/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Team A */}
                          <div className={`rounded-lg p-4 border ${
                            isWinnerA 
                              ? 'bg-green-500/10 border-green-500/30' 
                              : 'bg-slate-700/30 border-slate-600/30'
                          }`}>
                            <div className="flex items-center gap-2 mb-3">
                              <h3 className={`font-bold ${
                                isWinnerA ? 'text-green-400' : 'text-white/80'
                              }`}>
                                Equipo A
                              </h3>
                              {isWinnerA && <span className="text-green-400">👑</span>}
                            </div>
                            <div className="space-y-2">
                              {match.teamAPlayers.map((player) => (
                                <div
                                  key={player}
                                  className={`text-center py-1 px-2 rounded text-sm ${
                                    isWinnerA 
                                      ? 'bg-green-500/20 text-green-300' 
                                      : 'bg-slate-700/50 text-white/90'
                                  }`}
                                >
                                  {player}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Team B */}
                          <div className={`rounded-lg p-4 border ${
                            !isWinnerA 
                              ? 'bg-blue-500/10 border-blue-500/30' 
                              : 'bg-slate-700/30 border-slate-600/30'
                          }`}>
                            <div className="flex items-center gap-2 mb-3">
                              <h3 className={`font-bold ${
                                !isWinnerA ? 'text-blue-400' : 'text-white/80'
                              }`}>
                                Equipo B
                              </h3>
                              {!isWinnerA && <span className="text-blue-400">👑</span>}
                            </div>
                            <div className="space-y-2">
                              {match.teamBPlayers.map((player) => (
                                <div
                                  key={player}
                                  className={`text-center py-1 px-2 rounded text-sm ${
                                    !isWinnerA 
                                      ? 'bg-blue-500/20 text-blue-300' 
                                      : 'bg-slate-700/50 text-white/90'
                                  }`}
                                >
                                  {player}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
          </div>
        </div>
      </main>
    </div>
  );
}
