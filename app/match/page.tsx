'use client';

import { useEffect, useState, FormEvent } from 'react';

interface Player {
  id: string;
  name: string;
}

export default function MatchPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);
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
      setTeamA([]);
      setTeamB([]);
      setGoalDiff(0);
      setDate('');
    } catch (err) {
      console.error('Error submitting match', err);
      setMessage('No se pudo cargar el partido');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelect = (setter: (names: string[]) => void) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setter(options);
  };

  return (
    <main style={{
      maxWidth: 480,
      margin: '48px auto',
      padding: 24,
      background: 'white',
      borderRadius: 12,
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      minHeight: 400,
    }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 800,
        marginBottom: 24,
        textAlign: 'center',
        color: '#2563EB',
      }}>Cargar Resultado</h1>
      {loading ? (
        <p>Cargando jugadores...</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600 }}>Equipo A</label>
              <select multiple value={teamA} onChange={handleSelect(setTeamA)} style={{ width: '100%', minHeight: 120 }}>
                {players.map(p => (
                  <option key={p.id} value={p.name} disabled={teamB.includes(p.name)}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600 }}>Equipo B</label>
              <select multiple value={teamB} onChange={handleSelect(setTeamB)} style={{ width: '100%', minHeight: 120 }}>
                {players.map(p => (
                  <option key={p.id} value={p.name} disabled={teamA.includes(p.name)}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            Ganador
            <select value={winner} onChange={e => setWinner(e.target.value as 'A' | 'B')}>
              <option value="A">Equipo A</option>
              <option value="B">Equipo B</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            Diferencia de Gol
            <input type="number" value={goalDiff} onChange={e => setGoalDiff(Number(e.target.value))} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            Fecha
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </label>
          <button type="submit" disabled={submitting} style={{
            background: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '8px 20px',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 12,
          }}>
            {submitting ? 'Guardando...' : 'Guardar Partido'}
          </button>
        </form>
      )}
      {message && <p style={{ textAlign: 'center', marginTop: 16 }}>{message}</p>}
    </main>
  );
}
