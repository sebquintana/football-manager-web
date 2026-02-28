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
import { Bell, ChevronDown } from "lucide-react";
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
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
                <BreadcrumbPage className="text-white text-sm font-medium">Partidos</BreadcrumbPage>
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
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-6">Partidos</h1>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              {loading ? (
                <div className="text-center py-12 text-zinc-500">Cargando...</div>
              ) : error ? (
                <div className="text-center py-12 text-red-400">{error}</div>
              ) : (
                <div>
                  {matches.map((match, index) => {
                    const expanded = expandedId === match.id;
                    const isWinnerA = match.winner === "A";

                    return (
                      <div
                        key={match.id}
                        className={index !== matches.length - 1 ? 'border-b border-zinc-800' : ''}
                      >
                        <button
                          onClick={() => setExpandedId(expanded ? null : match.id)}
                          className="w-full px-5 py-4 text-left hover:bg-zinc-800 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span className="text-zinc-500 text-sm tabular-nums min-w-[5.5rem]">
                                {new Date(match.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                              <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${
                                isWinnerA
                                  ? 'bg-green-500/15 text-green-400'
                                  : 'bg-blue-500/15 text-blue-400'
                              }`}>
                                Equipo {match.winner}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-zinc-500 text-xs">
                                +{match.goalDifference}
                              </span>
                              <ChevronDown className={`h-4 w-4 text-zinc-600 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                        </button>

                        {expanded && (
                          <div className="border-t border-zinc-800 px-5 py-4 bg-zinc-800/40">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className={`text-xs font-semibold mb-2 ${isWinnerA ? 'text-green-400' : 'text-zinc-500'}`}>
                                  Equipo A {isWinnerA && '· Ganador'}
                                </div>
                                <div className="space-y-1">
                                  {match.teamAPlayers.map((player) => (
                                    <div key={player} className="text-sm text-zinc-300">{player}</div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div className={`text-xs font-semibold mb-2 ${!isWinnerA ? 'text-blue-400' : 'text-zinc-500'}`}>
                                  Equipo B {!isWinnerA && '· Ganador'}
                                </div>
                                <div className="space-y-1">
                                  {match.teamBPlayers.map((player) => (
                                    <div key={player} className="text-sm text-zinc-300">{player}</div>
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
