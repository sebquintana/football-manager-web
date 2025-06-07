'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface HistoryEntry {
  oldElo: number;
  newElo: number;
  changedAt: string;
  matchId: string;
  teamAPlayers: string[];
  teamBPlayers: string[];
}

interface MateSynergy {
  mate: string;
  victories: number;
  matches: number;
  winRate: number;
}

interface Synergies {
  bestMate: string | null;
  worstMate: string | null;
  mates: MateSynergy[];
}

interface Player {
  id: string;
  name: string;
  elo: number;
  initialElo: number;
  totalMatchesPlayed: number;
  winCount: number;
  lossCount: number;
  drawCount: number;
  goalsFor: number;
  goalsAgainst: number;
  history: HistoryEntry[];
  synergies?: Synergies;
}


export default function PlayerDetailPage() {
  const { name } = useParams<{ name: string }>();
  const playerName = decodeURIComponent(name);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [synergies, setSynergies] = useState<MateSynergy[]>([]);
  const [bestMate, setBestMate] = useState<string | null>(null);
  const [worstMate, setWorstMate] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await fetch(`${apiUrl}/players/${encodeURIComponent(playerName)}`);
        if (!res.ok) throw new Error('request failed');
        const data: Player = await res.json();
        setPlayer(data);
        if (data.synergies) {
          setSynergies(data.synergies.mates);
          setBestMate(data.synergies.bestMate);
          setWorstMate(data.synergies.worstMate);
        } else {
          setSynergies([]);
          setBestMate(null);
          setWorstMate(null);
        }
      } catch (err) {
        setError('No se pudo obtener la información del jugador.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [name]);

  return (
    <main
      style={{
        maxWidth: 480,
        margin: '48px auto',
        padding: 24,
        background: 'white',
        borderRadius: 12,
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        minHeight: 400,
      }}
    >
      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b' }}>Cargando...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
      ) : player ? (
        <>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              marginBottom: 16,
              textAlign: 'center',
              color: '#0ea5e9',
            }}
          >
            {player.name}
          </h1>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.6 }}>
            <li>
              <b>ELO actual:</b> {player.elo}
            </li>
            <li>
              <b>Partidos jugados:</b> {player.totalMatchesPlayed}
            </li>
            <li>
              <b>Ganados:</b> {player.winCount}
            </li>
            <li>
              <b>Perdidos:</b> {player.lossCount}
            </li>
            <li>
              <b>Empatados:</b> {player.drawCount}
            </li>
            <li>
              <b>Goles a favor:</b> {player.goalsFor}
            </li>
            <li>
              <b>Goles en contra:</b> {player.goalsAgainst}
            </li>
          </ul>
          <h2
            style={{
              fontWeight: 700,
              marginTop: 24,
              marginBottom: 12,
              color: '#0f172a',
              fontSize: '1.25rem',
            }}
          >
            Sinergias
          </h2>
          {synergies.length > 0 ? (
            <>
              <p style={{ margin: '4px 0 12px' }}>
                <b>Mejor compañero:</b> {bestMate}
                {worstMate && (
                  <>
                    {' | '}<b>Peor compañero:</b> {worstMate}
                  </>
                )}
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', paddingBottom: 4 }}>Compañero</th>
                    <th style={{ textAlign: 'right', paddingBottom: 4 }}>Victorias</th>
                    <th style={{ textAlign: 'right', paddingBottom: 4 }}>Partidos</th>
                    <th style={{ textAlign: 'right', paddingBottom: 4 }}>% Victoria</th>
                  </tr>
                </thead>
                <tbody>
                  {synergies.map((s) => (
                    <tr key={s.mate}>
                      <td style={{ padding: '2px 0' }}>{s.mate}</td>
                      <td style={{ textAlign: 'right', padding: '2px 0' }}>{s.victories}</td>
                      <td style={{ textAlign: 'right', padding: '2px 0' }}>{s.matches}</td>
                      <td
                        style={{
                          textAlign: 'right',
                          padding: '2px 0',
                          background: `rgb(${Math.round(255 * (1 - s.winRate / 100))},${Math.round(255 * (s.winRate / 100))},150)`,
                        }}
                      >
                        {s.winRate.toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p style={{ color: '#64748b' }}>Aún no se registran sinergias.</p>
          )}
          <h2
            style={{
              fontWeight: 700,
              marginTop: 24,
              marginBottom: 12,
              color: '#0f172a',
              fontSize: '1.25rem',
            }}
          >
            Historial
          </h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {player.history.map((h) => (
              <li
                key={h.matchId}
                style={{ borderBottom: '1px solid #e5e7eb', padding: '8px 0' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{new Date(h.changedAt).toLocaleDateString()}</span>
                  <span>
                    {h.newElo} ({h.newElo - h.oldElo > 0 ? '+' : ''}
                    {h.newElo - h.oldElo})
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, marginBottom: 2 }}>Equipo A</p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {h.teamAPlayers.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, marginBottom: 2 }}>Equipo B</p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {h.teamBPlayers.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </main>
  );
}
