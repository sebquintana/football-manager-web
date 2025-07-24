// app/teams/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function TeamsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/players`)
      .then(res => res.json())
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
      setError('No se pudieron generar los equipos.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 mb-6 shadow-2xl">
          <div className="flex items-center justify-center gap-3">
            <div className="text-4xl">⚽</div>
            <h1 className="text-4xl font-bold text-white">
              Generar Equipos Balanceados
            </h1>
          </div>
        </div>

        {/* Players Selection */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10 mb-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-white/70">Cargando jugadores...</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Seleccionar Jugadores</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {players.map((p: any) => (
                    <label
                      key={p.id}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border
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
                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="font-medium">{p.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={selected.length < 2 || submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
              >
                {submitting ? 'Generando...' : `Generar Equipos (${selected.length} jugadores)`}
              </button>
            </form>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 mb-6">
            <p className="text-red-300 text-center">{error}</p>
          </div>
        )}

        {/* Results */}
        {teams.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Opciones de Equipos</h2>
            <div className="space-y-4">
              {teams.map((t, i) => (
                <div
                  key={i}
                  className="bg-slate-700/40 border border-slate-600/30 rounded-xl p-6 backdrop-blur-sm"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-blue-400">Opción {i + 1}</h3>
                    <p className="text-sm text-white/60">Diferencia de ELO: <span className="text-white font-mono">{t.difference}</span></p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Team A */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <h4 className="text-center font-bold text-green-400 mb-3">Equipo A</h4>
                      <ul className="space-y-2">
                        {t.teamA.map((name: string) => (
                          <li key={name} className="text-white/90 text-center py-1 px-2 bg-green-500/20 rounded">
                            {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Team B */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="text-center font-bold text-blue-400 mb-3">Equipo B</h4>
                      <ul className="space-y-2">
                        {t.teamB.map((name: string) => (
                          <li key={name} className="text-white/90 text-center py-1 px-2 bg-blue-500/20 rounded">
                            {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
