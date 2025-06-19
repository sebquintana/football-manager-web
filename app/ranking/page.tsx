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
    <main className="container mx-auto max-w-lg bg-white rounded-xl shadow-md p-6 mt-12">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6 drop-shadow-sm">
        🏆 Ranking de Jugadores
      </h1>
      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {players.map((player, index) => {
            let itemClass = '';
            if (index === 0)
              itemClass = 'bg-yellow-100 font-bold text-amber-700 rounded-md scale-[1.02] shadow-sm';
            else if (index === 1)
              itemClass = 'bg-gray-100 font-semibold text-gray-700';
            else if (index === 2)
              itemClass = 'bg-orange-100 font-semibold text-orange-700';
            return (
              <li
                key={player.name + player.elo}
                className={`flex items-center justify-between py-2 px-3 transition-all ${itemClass}`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 text-right text-sm">{index + 1}.</span>
                  <span className="text-base min-w-[120px]">{player.name}</span>
                </span>
                <span className="font-mono text-blue-600 text-base border-l border-gray-200 pl-3">
                  {player.elo}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
