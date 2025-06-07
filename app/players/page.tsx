'use client';

import { useEffect, useState } from 'react';

interface Player {
  id: string;
  name: string;
}

export default function PlayersPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch(`${apiUrl}/players`);
        const data: Player[] = await res.json();
        data.sort((a, b) => a.name.localeCompare(b.name));
        setPlayers(data);
      } catch (err) {
        setError('No se pudieron obtener los jugadores.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <main
      style={{
        maxWidth: 420,
        margin: '48px auto',
        padding: 24,
        background: 'white',
        borderRadius: 12,
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 400,
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 800,
          marginBottom: 24,
          textAlign: 'center',
          color: '#0ea5e9',
        }}
      >
        Jugadores
      </h1>
      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b' }}>Cargando...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {players.map((p) => (
            <li key={p.id} style={{ padding: '4px 0' }}>
              <a href={`/players/${encodeURIComponent(p.name)}`}>{p.name}</a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
