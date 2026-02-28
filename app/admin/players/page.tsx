'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { PageHeader } from '@/components/page-header';

interface Player {
  id: string;
  name: string;
  elo: number;
}

export default function AdminPlayersPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const { getToken } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingElo, setEditingElo] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/players`)
      .then((r) => r.json())
      .then(setPlayers)
      .finally(() => setLoading(false));
  }, [apiUrl]);

  const startEdit = (player: Player) => {
    setEditingId(player.id);
    setEditingElo(player.elo);
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveElo = async (playerId: string) => {
    setSaving(true);
    try {
      const token = await getToken();
      const res = await fetch(`${apiUrl}/players/${playerId}/elo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ elo: editingElo }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPlayers((prev) =>
        prev.map((p) => (p.id === playerId ? { ...p, elo: editingElo } : p)),
      );
      setEditingId(null);
      setMessage({ text: 'ELO actualizado', ok: true });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ text: 'Error al actualizar ELO', ok: false });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Admin — Jugadores" showSearch={false} />
      <div className="flex-1 bg-black overflow-auto p-4">
        <div className="max-w-2xl mx-auto">
          {message && (
            <div
              className={`mb-4 p-3 rounded-xl text-sm text-center font-medium ${
                message.ok
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-zinc-500">Cargando...</div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-zinc-800">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
                  Editar ELO
                </h2>
              </div>
              <div className="divide-y divide-zinc-800">
                {players
                  .sort((a, b) => b.elo - a.elo)
                  .map((player) => (
                    <div key={player.id} className="flex items-center justify-between px-4 py-3">
                      <span className="text-white font-medium">{player.name}</span>
                      {editingId === player.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editingElo}
                            onChange={(e) => setEditingElo(Number(e.target.value))}
                            className="w-24 px-2 py-1 bg-zinc-800 border border-zinc-600 rounded-lg text-white text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => saveElo(player.id)}
                            disabled={saving}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-400 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-40"
                          >
                            {saving ? '...' : 'Guardar'}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-medium rounded-lg transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-blue-400 font-mono font-semibold tabular-nums">
                            {player.elo}
                          </span>
                          <button
                            onClick={() => startEdit(player)}
                            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            Editar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
