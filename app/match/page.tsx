'use client';

import { useEffect, useState, FormEvent } from 'react';
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

interface Player {
  id: string;
  name: string;
}

const selectClass = "w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const labelClass = "block text-xs font-medium text-zinc-400 mb-1.5";

export default function MatchPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamA, setTeamA] = useState<string[]>(Array(5).fill(""));
  const [teamB, setTeamB] = useState<string[]>(Array(5).fill(""));
  const [winner, setWinner] = useState<'A' | 'B'>('A');
  const [goalDiff, setGoalDiff] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/players`)
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(data => setPlayers(data))
      .catch(err => console.error('Error fetching players', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (teamA.some(n => !n) || teamB.some(n => !n)) {
      setMessage('Selecciona 5 jugadores por equipo');
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch(`${apiUrl}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamANames: teamA,
          teamBNames: teamB,
          winner,
          goalDifference: goalDiff,
          date: date ? `${date}T00:00:00` : undefined,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setMessage('Partido cargado exitosamente');
      setTimeout(() => setMessage(null), 4000);
      setTeamA(Array(5).fill(""));
      setTeamB(Array(5).fill(""));
      setGoalDiff(0);
      setDate('');
    } catch (err) {
      console.error('Error submitting match', err);
      setMessage('No se pudo cargar el partido');
    } finally {
      setSubmitting(false);
    }
  };

  const updateTeam = (team: 'A' | 'B', index: number, value: string) => {
    if (team === 'A') {
      const copy = [...teamA]; copy[index] = value; setTeamA(copy);
    } else {
      const copy = [...teamB]; copy[index] = value; setTeamB(copy);
    }
  };

  return (
    <div className="flex flex-col h-full -m-4">
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
                <BreadcrumbPage className="text-white text-sm font-medium">Cargar Resultado</BreadcrumbPage>
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-6">Cargar Resultado</h1>

            {loading ? (
              <div className="text-center py-12 text-zinc-500">Cargando jugadores...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Teams */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Team A */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                    <h2 className="text-sm font-semibold text-green-400 mb-4 uppercase tracking-wide">Equipo A</h2>
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i}>
                          <label className={labelClass}>Jugador {i + 1}</label>
                          <select
                            value={teamA[i]}
                            onChange={e => updateTeam('A', i, e.target.value)}
                            className={selectClass}
                          >
                            <option value="">Seleccionar jugador</option>
                            {players.map(p => (
                              <option
                                key={p.id}
                                value={p.name}
                                disabled={
                                  (teamA.includes(p.name) && teamA[i] !== p.name) ||
                                  teamB.includes(p.name)
                                }
                              >
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team B */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                    <h2 className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-wide">Equipo B</h2>
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i}>
                          <label className={labelClass}>Jugador {i + 1}</label>
                          <select
                            value={teamB[i]}
                            onChange={e => updateTeam('B', i, e.target.value)}
                            className={selectClass}
                          >
                            <option value="">Seleccionar jugador</option>
                            {players.map(p => (
                              <option
                                key={p.id}
                                value={p.name}
                                disabled={
                                  (teamB.includes(p.name) && teamB[i] !== p.name) ||
                                  teamA.includes(p.name)
                                }
                              >
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Match Details */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">Detalles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Ganador</label>
                      <select value={winner} onChange={e => setWinner(e.target.value as 'A' | 'B')} className={selectClass}>
                        <option value="A">Equipo A</option>
                        <option value="B">Equipo B</option>
                        <option value="draw">Empate</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Diferencia de Goles</label>
                      <input
                        type="number"
                        value={goalDiff}
                        onChange={e => setGoalDiff(Number(e.target.value))}
                        className={selectClass}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Fecha</label>
                      <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className={selectClass}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Guardando...' : 'Guardar Partido'}
                </button>
              </form>
            )}

            {message && (
              <div className={`mt-4 p-4 rounded-xl text-center text-sm font-medium ${
                message.includes('exitosamente')
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
