// app/ranking/page.tsx
'use client';

import { useEffect, useState } from 'react';

type Player = {
  name: string;
  elo: number;
};

export default function RankingPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      try {
        const res = await fetch(`${apiUrl}/players/ranking`);
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error('Error fetching ranking', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-6 shadow-2xl">
          <div className="flex items-center justify-center gap-3">
            <div className="text-4xl">🏆</div>
            <h1 className="text-4xl font-bold text-white">
              Ranking de Jugadores
            </h1>
          </div>
        </div>

        {/* Ranking List */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-white/70">Cargando...</div>
            </div>
          ) : (
            <div className="space-y-3">
              {players.map((player, index) => {
                let bgClass = '';
                let textColor = '';
                let borderColor = '';
                
                if (index === 0) {
                  bgClass = 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20';
                  textColor = 'text-yellow-300';
                  borderColor = 'border-yellow-500/30';
                } else if (index === 1) {
                  bgClass = 'bg-gradient-to-r from-gray-400/20 to-slate-400/20';
                  textColor = 'text-gray-300';
                  borderColor = 'border-gray-500/30';
                } else if (index === 2) {
                  bgClass = 'bg-gradient-to-r from-amber-600/20 to-orange-600/20';
                  textColor = 'text-amber-300';
                  borderColor = 'border-amber-600/30';
                } else {
                  bgClass = 'bg-slate-700/30';
                  textColor = 'text-white/90';
                  borderColor = 'border-slate-600/30';
                }

                return (
                  <div
                    key={player.name + player.elo}
                    className={`${bgClass} ${borderColor} border rounded-xl p-4 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`text-2xl font-bold ${textColor} min-w-[3rem] text-center`}>
                          {index + 1}.
                        </div>
                        <div className={`text-lg font-medium ${textColor}`}>
                          {player.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400 font-mono">
                          {player.elo}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
