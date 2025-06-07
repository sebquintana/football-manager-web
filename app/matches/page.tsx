"use client";

import { useEffect, useState } from "react";

interface Match {
  id: string;
  date: string;
  winner: "A" | "B";
  goalDifference: number;
  teamAPlayers: string[];
  teamBPlayers: string[];
}

export default function MatchesPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const [matches, setMatches] = useState<Match[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`${apiUrl}/matches/summary`);
        const data: Match[] = await res.json();
        data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setMatches(data);
      } catch (err) {
        setError("No se pudieron obtener los partidos.");
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
        margin: "48px auto",
        padding: 24,
        background: "white",
        borderRadius: 12,
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        minHeight: 400,
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          marginBottom: 24,
          textAlign: "center",
          color: "#0f172a",
        }}
      >
        Partidos Jugados
      </h1>
      {loading ? (
        <p style={{ textAlign: "center" }}>Cargando...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {matches.map((m, i) => {
            const expanded = expandedId === m.id;
            return (
              <li
                key={m.id}
                style={{ borderBottom: "1px solid #e5e7eb", fontSize: 14 }}
              >
                <button
                  onClick={() => setExpandedId(expanded ? null : m.id)}
                  style={{
                    all: "unset",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "4px 0",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ flex: 1 }}>
                    {new Date(m.date).toLocaleDateString()}
                  </span>
                  <span style={{ flex: 1, textAlign: "center" }}>
                    Ganador: Equipo {m.winner}
                  </span>
                  <span style={{ width: 70, textAlign: "right" }}>
                    Dif: {m.goalDifference}
                  </span>
                </button>
                {expanded && (
                  <div style={{ display: "flex", gap: 16, padding: "8px 0" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, marginBottom: 4 }}>
                        Equipo A
                      </p>
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {m.teamAPlayers.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, marginBottom: 4 }}>
                        Equipo B
                      </p>
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {m.teamBPlayers.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
