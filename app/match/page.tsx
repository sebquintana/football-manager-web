'use client';

import { useEffect, useState, FormEvent } from 'react';

interface Player {
  id: string;
  name: string;
}

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
      .then(res => res.json())
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

  const updateTeam = (
    team: 'A' | 'B',
    index: number,
    value: string
  ) => {
    if (team === 'A') {
      const copy = [...teamA];
      copy[index] = value;
      setTeamA(copy);
    } else {
      const copy = [...teamB];
      copy[index] = value;
      setTeamB(copy);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 mb-6 shadow-2xl">
          <div className="flex items-center justify-center gap-3">
            <div className="text-4xl">📊</div>
            <h1 className="text-4xl font-bold text-white">
              Cargar Resultado
            </h1>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-white/70">Cargando jugadores...</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Teams Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team A */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-green-400 mb-4 text-center">
                    Equipo A
                  </h2>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i}>
                        <label className="block text-sm font-medium text-white/80 mb-1">
                          Jugador {i + 1}
                        </label>
                        <select
                          value={teamA[i]}
                          onChange={e => updateTeam('A', i, e.target.value)}
                          className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-blue-400 mb-4 text-center">
                    Equipo B
                  </h2>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i}>
                        <label className="block text-sm font-medium text-white/80 mb-1">
                          Jugador {i + 1}
                        </label>
                        <select
                          value={teamB[i]}
                          onChange={e => updateTeam('B', i, e.target.value)}
                          className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4">Detalles del Partido</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Ganador
                    </label>
                    <select 
                      value={winner} 
                      onChange={e => setWinner(e.target.value as 'A' | 'B')}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="A">Equipo A</option>
                      <option value="B">Equipo B</option>
                      <option value="draw">Empate</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Diferencia de Goles
                    </label>
                    <input 
                      type="number" 
                      value={goalDiff} 
                      onChange={e => setGoalDiff(Number(e.target.value))}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Fecha
                    </label>
                    <input 
                      type="date" 
                      value={date} 
                      onChange={e => setDate(e.target.value)}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
              >
                {submitting ? 'Guardando...' : 'Guardar Partido'}
              </button>
            </form>
          )}

          {/* Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl text-center font-medium ${
              message.includes('exitosamente') 
                ? 'bg-green-500/20 border border-green-500/50 text-green-300' 
                : 'bg-red-500/20 border border-red-500/50 text-red-300'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
