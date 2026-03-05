'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useAuth } from '@clerk/nextjs';
import { PageHeader } from '@/components/page-header';
import { ChevronDown, ChevronUp } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const selectClass = "w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const labelClass = "block text-xs font-medium text-zinc-400 mb-1.5";

// ---- types ----

interface Player {
  id: string;
  name: string;
}

interface TeamOption {
  teamA: string[];
  teamB: string[];
  eloA: number;
  eloB: number;
  difference: number;
  balanceScore: number;
  teamAMetrics: { avgElo: number; avgWinRate: number; victoryProbability: number };
  teamBMetrics: { avgElo: number; avgWinRate: number; victoryProbability: number };
  synergyWarnings?: string[];
}

interface PendingMatch {
  id: string;
  teamANames: string[];
  teamBNames: string[];
  createdAt: string;
}

// ---- TeamOptionCard ----

function TeamOptionCard({
  option,
  index,
  onSelect,
  onSaveForLater,
  savingPending,
}: {
  option: TeamOption;
  index: number;
  onSelect: () => void;
  onSaveForLater: () => void;
  savingPending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isTop = index < 3;
  const higherElo = option.eloA > option.eloB ? 'A' : option.eloB > option.eloA ? 'B' : null;
  const favorite = option.teamAMetrics.victoryProbability > option.teamBMetrics.victoryProbability ? 'A' : 'B';

  return (
    <div className={`border rounded-xl p-3 ${isTop ? 'bg-zinc-800 border-blue-500/30' : 'bg-zinc-800/60 border-zinc-700'}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold text-zinc-400">#{index + 1}</span>
        {isTop && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400">Top</span>}
        {higherElo && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${higherElo === 'A' ? 'bg-green-500/15 text-green-400' : 'bg-blue-500/15 text-blue-400'}`}>
            Equipo {higherElo} +{Math.abs(option.eloA - option.eloB)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className={`border rounded-lg p-2.5 ${higherElo === 'A' ? 'bg-green-500/10 border-green-500/30' : 'bg-zinc-700/50 border-zinc-700'}`}>
          <div className="text-xs font-semibold text-green-400 mb-1">Equipo A {favorite === 'A' && '🔥'}</div>
          <div className="text-xs text-zinc-500 mb-1.5">ELO {option.eloA} · WR {((option.teamAMetrics?.avgWinRate || 0) * 100).toFixed(0)}%</div>
          <div className="space-y-1">{option.teamA.map(n => <div key={n} className="text-xs text-zinc-200">{n}</div>)}</div>
        </div>
        <div className={`border rounded-lg p-2.5 ${higherElo === 'B' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-zinc-700/50 border-zinc-700'}`}>
          <div className="text-xs font-semibold text-blue-400 mb-1">Equipo B {favorite === 'B' && '🔥'}</div>
          <div className="text-xs text-zinc-500 mb-1.5">ELO {option.eloB} · WR {((option.teamBMetrics?.avgWinRate || 0) * 100).toFixed(0)}%</div>
          <div className="space-y-1">{option.teamB.map(n => <div key={n} className="text-xs text-zinc-200">{n}</div>)}</div>
        </div>
      </div>

      {option.synergyWarnings && option.synergyWarnings.length > 0 && (
        <div className="mb-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="w-full px-3 py-2 flex items-center justify-between text-xs hover:bg-yellow-500/10 transition-colors rounded-lg"
          >
            <span className="text-yellow-400 font-medium">Sinergias bajas ({option.synergyWarnings.length})</span>
            {open ? <ChevronUp className="h-3 w-3 text-yellow-400" /> : <ChevronDown className="h-3 w-3 text-yellow-400" />}
          </button>
          {open && (
            <div className="px-3 pb-2 text-xs text-yellow-300/70 space-y-1 max-h-28 overflow-y-auto">
              {option.synergyWarnings.map((w, i) => <div key={i}>{w.replace('Equipo A: ', '🟢 ').replace('Equipo B: ', '🔵 ')}</div>)}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onSaveForLater}
          disabled={savingPending}
          className="py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-semibold transition-colors disabled:opacity-40"
        >
          {savingPending ? 'Guardando...' : 'Guardar para después'}
        </button>
        <button
          type="button"
          onClick={onSelect}
          className="py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold transition-colors"
        >
          Cargar resultado →
        </button>
      </div>
    </div>
  );
}

// ---- main page ----

export default function MatchPage() {
  const { getToken } = useAuth();

  const [players, setPlayers] = useState<Player[]>([]);
  const [pendingMatch, setPendingMatch] = useState<PendingMatch | null>(null);
  const [pendingInfo, setPendingInfo] = useState<string | null>(null);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pendingMatchId, setPendingMatchId] = useState<string | null>(null);

  // step 1
  const [selected, setSelected] = useState<string[]>([]);

  // step 2
  const [teamOptions, setTeamOptions] = useState<TeamOption[]>([]);
  const [generatingTeams, setGeneratingTeams] = useState(false);
  const [generatingError, setGeneratingError] = useState<string | null>(null);
  const [savingPending, setSavingPending] = useState(false);

  // step 3
  const [teamA, setTeamA] = useState<string[]>(Array(5).fill(''));
  const [teamB, setTeamB] = useState<string[]>(Array(5).fill(''));
  const [winner, setWinner] = useState<'A' | 'B' | 'draw'>('A');
  const [goalDiff, setGoalDiff] = useState(0);
  const [date, setDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const [playersRes, pendingRes] = await Promise.allSettled([
          fetch(`${API_URL}/players`),
          fetch(`${API_URL}/match/pending/latest`, { headers: authHeaders }),
        ]);

        if (playersRes.status === 'fulfilled' && playersRes.value.ok) {
          setPlayers(await playersRes.value.json());
        }
        if (pendingRes.status === 'fulfilled') {
          if (pendingRes.value.ok) {
            setPendingMatch(await pendingRes.value.json());
            setPendingInfo(null);
          } else if (pendingRes.value.status === 404) {
            setPendingInfo('No hay partidos pendientes guardados.');
          } else if (pendingRes.value.status === 401 || pendingRes.value.status === 403) {
            setPendingInfo('No se pudo cargar el pendiente: iniciá sesión con un usuario admin.');
          } else {
            setPendingInfo('No se pudo cargar el partido pendiente.');
          }
        } else {
          setPendingInfo('No se pudo cargar el partido pendiente.');
        }
      } finally {
        setLoadingPlayers(false);
      }
    };
    load();
  }, []);

  const togglePlayer = (name: string) => {
    setSelected(s => s.includes(name) ? s.filter(n => n !== name) : [...s, name]);
  };

  const handleGenerateTeams = async (e: FormEvent) => {
    e.preventDefault();
    setGeneratingTeams(true);
    setGeneratingError(null);
    try {
      const res = await fetch(`${API_URL}/teams/balanced`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerNames: selected }),
      });
      if (!res.ok) throw new Error('Error');
      setTeamOptions(await res.json());
      setStep(2);
    } catch {
      setGeneratingError('No se pudieron generar los equipos.');
    } finally {
      setGeneratingTeams(false);
    }
  };

  const pad5 = (arr: string[]) => {
    const copy = [...arr];
    while (copy.length < 5) copy.push('');
    return copy.slice(0, 5);
  };

  const loadIntoStep3 = (a: string[], b: string[], matchId?: string) => {
    setTeamA(pad5(a));
    setTeamB(pad5(b));
    setPendingMatchId(matchId ?? null);
    setStep(3);
  };

  const handleSaveForLater = async (option: TeamOption) => {
    setSavingPending(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/match/pending`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ teamANames: option.teamA, teamBNames: option.teamB }),
      });
      if (!res.ok) throw new Error('Error');
      const saved: PendingMatch = await res.json();
      setPendingMatch(saved);
      setPendingInfo(null);
      setStep(1);
      setSelected([]);
      setTeamOptions([]);
      setMessage('Equipos guardados. Vas a poder cargar el resultado más tarde.');
      setTimeout(() => setMessage(null), 5000);
    } catch {
      setMessage('No se pudieron guardar los equipos.');
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setSavingPending(false);
    }
  };

  const handleDiscardPending = async () => {
    if (!pendingMatch) return;
    const token = await getToken();
    try {
      await fetch(`${API_URL}/match/pending/${pendingMatch.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } finally {
      setPendingMatch(null);
      setPendingInfo('No hay partidos pendientes guardados.');
    }
  };

  const handleSubmitResult = async (e: FormEvent) => {
    e.preventDefault();
    if (teamA.some(n => !n) || teamB.some(n => !n)) {
      setMessage('Completá los 5 jugadores por equipo');
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const token = await getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const body = {
        teamANames: teamA,
        teamBNames: teamB,
        winner,
        goalDifference: goalDiff,
        date: date ? `${date}T00:00:00` : new Date().toISOString(),
      };

      let res: Response;
      if (pendingMatchId) {
        res = await fetch(`${API_URL}/match/pending/${pendingMatchId}/result`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ ...body, id: pendingMatchId }),
        });
      } else {
        res = await fetch(`${API_URL}/match`, { method: 'POST', headers, body: JSON.stringify(body) });
      }

      if (!res.ok) throw new Error('Error');

      setPendingMatch(null);
      setPendingMatchId(null);
      setStep(1);
      setSelected([]);
      setTeamA(Array(5).fill(''));
      setTeamB(Array(5).fill(''));
      setGoalDiff(0);
      setDate('');
      setMessage('Partido cargado exitosamente');
      setTimeout(() => setMessage(null), 4000);
    } catch {
      setMessage('No se pudo cargar el partido');
    } finally {
      setSubmitting(false);
    }
  };

  const updateTeamSlot = (team: 'A' | 'B', index: number, value: string) => {
    if (team === 'A') { const c = [...teamA]; c[index] = value; setTeamA(c); }
    else { const c = [...teamB]; c[index] = value; setTeamB(c); }
  };

  // ---- step indicator ----

  const StepDot = ({ n, label }: { n: number; label: string }) => (
    <div className={`flex items-center gap-2 text-sm ${step === n ? 'text-white font-semibold' : step > n ? 'text-zinc-500' : 'text-zinc-600'}`}>
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        step === n ? 'bg-blue-500 text-white' : step > n ? 'bg-zinc-700 text-zinc-500' : 'bg-zinc-800 text-zinc-600'
      }`}>{n}</span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Cargar Resultado" showSearch={false} />

      <div className="flex-1 bg-black overflow-auto p-4">
        <div className="max-w-4xl mx-auto">

          {/* Pending match banner */}
          {pendingMatch && step === 1 && (
            <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="text-yellow-400 font-semibold text-sm mb-1">Partido pendiente guardado</p>
                  <p className="text-zinc-400 text-xs break-words">
                    {new Date(pendingMatch.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} ·{' '}
                    <span className="text-green-400">{pendingMatch.teamANames.join(', ')}</span>
                    {' vs '}
                    <span className="text-blue-400">{pendingMatch.teamBNames.join(', ')}</span>
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => loadIntoStep3(pendingMatch.teamANames, pendingMatch.teamBNames, pendingMatch.id)}
                    className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-semibold rounded-lg transition-colors"
                  >
                    Cargar resultado
                  </button>
                  <button
                    onClick={handleDiscardPending}
                    className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Descartar
                  </button>
                </div>
              </div>
            </div>
          )}

          {!pendingMatch && pendingInfo && step === 1 && (
            <div className="mb-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-xs text-zinc-400">
              {pendingInfo}
            </div>
          )}

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-6">
            <StepDot n={1} label="Jugadores" />
            <div className="h-px flex-1 bg-zinc-800" />
            <StepDot n={2} label="Equipos" />
            <div className="h-px flex-1 bg-zinc-800" />
            <StepDot n={3} label="Resultado" />
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-1">Seleccionar Jugadores</h2>
              <p className="text-zinc-600 text-xs mb-4">{selected.length} seleccionados</p>

              {loadingPlayers ? (
                <div className="text-center py-8 text-zinc-500">Cargando jugadores...</div>
              ) : (
                <form onSubmit={handleGenerateTeams} className="space-y-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    {players.map(p => (
                      <label
                        key={p.id}
                        className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer border text-sm transition-colors ${
                          selected.includes(p.name)
                            ? 'bg-blue-500/10 border-blue-500/50 text-blue-300'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected.includes(p.name)}
                          onChange={() => togglePlayer(p.name)}
                          className="w-3 h-3 rounded accent-blue-500"
                        />
                        <span className="font-medium truncate text-xs">{p.name}</span>
                      </label>
                    ))}
                  </div>

                  {generatingError && <p className="text-red-400 text-sm text-center">{generatingError}</p>}

                  <button
                    type="submit"
                    disabled={selected.length < 2 || generatingTeams}
                    className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {generatingTeams ? 'Generando...' : `Generar equipos (${selected.length} seleccionados)`}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Opciones Balanceadas</h2>
                <button type="button" onClick={() => setStep(1)} className="text-xs text-zinc-500 hover:text-white transition-colors">
                  ← Volver
                </button>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {teamOptions.map((option, i) => (
                  <TeamOptionCard
                    key={`opt-${i}`}
                    option={option}
                    index={i}
                    onSelect={() => loadIntoStep3(option.teamA, option.teamB)}
                    onSaveForLater={() => handleSaveForLater(option)}
                    savingPending={savingPending}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <form onSubmit={handleSubmitResult} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Ingresar Resultado</h2>
                {!pendingMatchId && (
                  <button type="button" onClick={() => setStep(2)} className="text-xs text-zinc-500 hover:text-white transition-colors">
                    ← Volver
                  </button>
                )}
              </div>

              {pendingMatchId && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2 text-xs text-yellow-400">
                  Resultado del partido pendiente · podés modificar los equipos antes de confirmar
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Team A */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-green-400 mb-4 uppercase tracking-wide">Equipo A</h3>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i}>
                        <label className={labelClass}>Jugador {i + 1}</label>
                        <select value={teamA[i]} onChange={e => updateTeamSlot('A', i, e.target.value)} className={selectClass}>
                          <option value="">Seleccionar jugador</option>
                          {players.map(p => (
                            <option
                              key={p.id}
                              value={p.name}
                              disabled={(teamA.includes(p.name) && teamA[i] !== p.name) || teamB.includes(p.name)}
                            >
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team B */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-wide">Equipo B</h3>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i}>
                        <label className={labelClass}>Jugador {i + 1}</label>
                        <select value={teamB[i]} onChange={e => updateTeamSlot('B', i, e.target.value)} className={selectClass}>
                          <option value="">Seleccionar jugador</option>
                          {players.map(p => (
                            <option
                              key={p.id}
                              value={p.name}
                              disabled={(teamB.includes(p.name) && teamB[i] !== p.name) || teamA.includes(p.name)}
                            >
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">Detalles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Ganador</label>
                    <select value={winner} onChange={e => setWinner(e.target.value as 'A' | 'B' | 'draw')} className={selectClass}>
                      <option value="A">Equipo A</option>
                      <option value="B">Equipo B</option>
                      <option value="draw">Empate</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Diferencia de Goles</label>
                    <input type="number" value={goalDiff} onChange={e => setGoalDiff(Number(e.target.value))} className={selectClass} min="0" />
                  </div>
                  <div>
                    <label className={labelClass}>Fecha</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className={selectClass} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Guardando...' : 'Confirmar Partido'}
              </button>
            </form>
          )}

          {/* Message toast */}
          {message && (
            <div className={`mt-4 p-4 rounded-xl text-center text-sm font-medium ${
              message.includes('exitosamente') || message.includes('guardados')
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
              {message}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
