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
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/ranking`);
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
    <main style={{
      maxWidth: 420,
      margin: '48px auto',
      padding: 24,
      background: 'white',
      borderRadius: 12,
      boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: 400
    }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: 800,
        marginBottom: 24,
        textAlign: 'center',
        color: '#2563EB',
        textShadow: '0 1px 2px #e0e7ef'
      }}>🏆 Ranking de Jugadores</h1>
      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b' }}>Cargando...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
          {players.map((player, index) => {
            let rowStyle = {};
            if (index === 0) rowStyle = { background: '#FEF9C3', fontWeight: 'bold', color: '#B45309', borderRadius: '0.375rem', transform: 'scale(1.05)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' };
            else if (index === 1) rowStyle = { background: '#F3F4F6', fontWeight: 600, color: '#374151' };
            else if (index === 2) rowStyle = { background: '#FFF7ED', fontWeight: 600, color: '#C2410C' };
            return (
              <li
                key={player.name + player.elo}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.5rem', marginBottom: '0.25rem', ...rowStyle }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem', width: 28, textAlign: 'right' }}>{index + 1}.</span>
                  <span style={{ fontSize: '1rem', minWidth: 120 }}>{player.name}</span>
                </span>
                <span style={{ fontFamily: 'monospace', color: '#2563EB', fontSize: '1rem', marginLeft: 16, minWidth: 48, textAlign: 'right', borderLeft: '1px solid #e5e7eb', paddingLeft: 12 }}>{player.elo}</span>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
