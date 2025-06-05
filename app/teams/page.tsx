// app/teams/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function TeamsPage() {
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/players')
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
      const res = await fetch('http://localhost:3000/teams/balanced', {
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
    <main style={{
      maxWidth: 480,
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
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 24, textAlign: 'center', color: '#16a34a' }}>⚽ Generar Equipos Balanceados</h1>
      {loading ? <p>Cargando jugadores...</p> : (
        <form onSubmit={handleSubmit} style={{ width: '100%', marginBottom: 24 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {players.map((p: any) => (
              <label key={p.id} style={{
                display: 'flex', alignItems: 'center', background: selected.includes(p.name) ? '#d1fae5' : '#f3f4f6',
                borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontWeight: 500
              }}>
                <input
                  type="checkbox"
                  checked={selected.includes(p.name)}
                  onChange={() => handleSelect(p.name)}
                  style={{ marginRight: 6 }}
                />
                {p.name}
              </label>
            ))}
          </div>
          <button type="submit" disabled={selected.length < 2 || submitting} style={{
            background: '#2563EB', color: 'white', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, fontSize: 16, cursor: 'pointer', width: '100%'
          }}>
            {submitting ? 'Generando...' : 'Generar Equipos'}
          </button>
        </form>
      )}
      {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}
      {teams.length > 0 && (
        <section style={{ width: '100%' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#2563EB' }}>Resultados</h2>
          {teams.map((t, i) => (
            <div key={i} style={{
              background: '#f9fafb', borderRadius: 8, padding: 12, marginBottom: 12, boxShadow: '0 1px 3px #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: '#16a34a' }}>Equipo A ({t.eloA})</span>
                <span style={{ fontWeight: 600, color: '#dc2626' }}>Equipo B ({t.eloB})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', flex: 1 }}>
                  {t.teamA.map((n: string) => <li key={n}>{n}</li>)}
                </ul>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', flex: 1 }}>
                  {t.teamB.map((n: string) => <li key={n}>{n}</li>)}
                </ul>
              </div>
              <div style={{ textAlign: 'center', marginTop: 6, color: '#64748b', fontSize: 14 }}>
                Diferencia de ELO: <b>{t.difference}</b>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
