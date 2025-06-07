'use client';

import { useEffect, useState } from 'react';

interface Match {
  id: string;
  date: string;
  winner: 'A' | 'B';
  goalDifference: number;
}

export default function MatchesPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`${apiUrl}/matches/summary`);
        const data: Match[] = await res.json();
        data.sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setMatches(data);
      } catch (err) {
        setError('No se pudieron obtener los partidos.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <main
      style={{
        maxWidth: 480,
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
          color: '#0f172a',
        }}
      >
        Partidos Jugados
      </h1>
      {loading ? (
        <p style={{ textAlign: 'center' }}>Cargando...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {matches.map((m, i) => (
            <li
              key={m.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 0',
                borderBottom: '1px solid #e5e7eb',
                fontSize: 14,
              }}
            >
              <span style={{ width: 24 }}>{i + 1}.</span>
              <span style={{ flex: 1 }}>
                {new Date(m.date).toLocaleDateString()}
              </span>
              <span style={{ flex: 1, textAlign: 'center' }}>
                Ganador: Equipo {m.winner}
              </span>
              <span style={{ width: 70, textAlign: 'right' }}>
                Dif: {m.goalDifference}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
