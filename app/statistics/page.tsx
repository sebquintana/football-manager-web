'use client'

import { useState, useEffect, useCallback } from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ── Types ─────────────────────────────────────────────────────────────────────

interface AttendanceStats {
  highestAttendance: { players: string[]; rate: number }
  lowestAttendance: { players: string[]; rate: number }
  averageAttendance: number
  totalMatches: number
  activePlayers: number
}

interface EloStats {
  distribution: { range: string; count: number; players: string[] }[]
  biggestGainer: { players: string[]; gain: number }
  biggestLoser: { players: string[]; loss: number }
  mostConsistent: { player: string; variance: number }
  averageElo: number
  eloRange: { min: number; max: number }
}

interface GoalStats {
  averageGoalDifference: number
  biggestWin: { difference: number; matchId: string; date: string }
  resultDistribution: { difference: number; count: number; percentage: number }[]
  maxGoalDifference: number
  closestMatches: number
  blowouts: number
}

interface ResultStats {
  totalMatches: number
  decisiveWins: number
  narrowWins: number
  draws: number
  drawPercentage: number
  competitiveBalance: number
  averageMatchIntensity: number
}

interface StreakStats {
  longestWinStreak: { player: string; streak: number }
  longestLossStreak: { player: string; streak: number }
  mostStreaky: { player: string; variance: number }
  mostConsistent: { player: string; variance: number }
}

interface SynergyStats {
  bestDuos: { players: [string, string]; winRate: number; matches: number }[]
  worstDuos: { players: [string, string]; winRate: number; matches: number }[]
  mostCompatible: { player: string; averageSynergy: number }
  leastCompatible: { player: string; averageSynergy: number }
  teamImprovers: { player: string; teamImpact: number }[]
}

interface SeasonPlayerStat {
  player: string
  value: number
  wins?: number
  played?: number
}

interface TopPerformersStats {
  byWinRate: SeasonPlayerStat[]
  byWins: SeasonPlayerStat[]
  bySeasonalElo: SeasonPlayerStat[]
}

interface GeneralStatisticsDto {
  attendance: AttendanceStats
  elo: EloStats
  goals: GoalStats
  results: ResultStats
  streaks: StreakStats
  synergies: SynergyStats
  topPerformers: TopPerformersStats
  generatedAt: string
  totalPlayers: number
  totalMatches: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function eloBarColor(range: string): string {
  if (range.includes('+') || parseInt(range) >= 1050) return '#22c55e'
  if (range.startsWith('950') || parseInt(range) < 950) return '#ef4444'
  if (range.startsWith('1000') || range.startsWith('1050')) return '#3b82f6'
  return '#eab308'
}

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 2024 + 1 }, (_, i) => 2024 + i)

const MEDAL = ['🥇', '🥈', '🥉']

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-4">
      {children}
    </h2>
  )
}

function StatChip({
  label,
  value,
  sub,
}: {
  label: string
  value: React.ReactNode
  sub?: string
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
      <span className="text-2xl font-bold text-white tabular-nums">{value}</span>
      {sub && <span className="text-xs text-zinc-500">{sub}</span>}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StatisticsPage() {
  const [season, setSeason] = useState<number>(CURRENT_YEAR)
  const [stats, setStats] = useState<GeneralStatisticsDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (year: number) => {
    setLoading(true)
    setError(null)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    try {
      const res = await fetch(`${apiUrl}/statistics/general?season=${year}`)
      if (!res.ok) throw new Error(`Statistics: HTTP ${res.status}`)
      setStats(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(season)
  }, [season, fetchData])

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/80 border-b border-zinc-800">
        <div className="flex items-center gap-2 px-4 flex-1">
          <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-white" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-800" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/" className="text-zinc-500 hover:text-white text-sm">
                  Football Manager
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-zinc-700" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white text-sm font-medium">
                  Estadísticas
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 bg-black overflow-auto">
        <div className="p-6 max-w-4xl mx-auto space-y-10">

          {/* Title + season selector */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">Estadísticas</h1>
            <select
              value={season}
              onChange={(e) => setSeason(Number(e.target.value))}
              className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  Temporada {y}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="text-center py-20 text-zinc-500">Cargando estadísticas...</div>
          )}

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-400 rounded-xl p-4 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && stats && (
            <>
              {/* ── Sección 1: Tres podios de temporada ── */}
              <section>
                <SectionTitle>Podios de temporada {season}</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                  {/* Podio: Win Rate */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-4 text-center">
                      Win Rate
                    </p>
                    {stats.topPerformers.byWinRate.length === 0 ? (
                      <p className="text-zinc-600 text-sm text-center py-4">Sin datos suficientes<br /><span className="text-xs">(mín. 3 partidos)</span></p>
                    ) : (
                      <div className="space-y-2">
                        {stats.topPerformers.byWinRate.map((entry, i) => (
                          <div
                            key={`wr-${entry.player}`}
                            className={`flex items-center justify-between rounded-xl px-3 py-2 ${i === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-zinc-800/60'}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg leading-none">{MEDAL[i]}</span>
                              <span className={`font-semibold text-sm ${i === 0 ? 'text-white' : 'text-zinc-300'}`}>
                                {entry.player}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className={`font-bold tabular-nums text-sm ${i === 0 ? 'text-yellow-400' : 'text-zinc-300'}`}>
                                {entry.value}%
                              </span>
                              {entry.wins !== undefined && entry.played !== undefined && (
                                <p className="text-zinc-600 text-xs">{entry.wins}V/{entry.played}PJ</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Podio: Victorias */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-4 text-center">
                      Victorias
                    </p>
                    {stats.topPerformers.byWins.length === 0 ? (
                      <p className="text-zinc-600 text-sm text-center py-4">Sin datos</p>
                    ) : (
                      <div className="space-y-2">
                        {stats.topPerformers.byWins.map((entry, i) => (
                          <div
                            key={`wins-${entry.player}`}
                            className={`flex items-center justify-between rounded-xl px-3 py-2 ${i === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-zinc-800/60'}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg leading-none">{MEDAL[i]}</span>
                              <span className={`font-semibold text-sm ${i === 0 ? 'text-white' : 'text-zinc-300'}`}>
                                {entry.player}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className={`font-bold tabular-nums text-sm ${i === 0 ? 'text-yellow-400' : 'text-zinc-300'}`}>
                                {entry.value}V
                              </span>
                              {entry.played !== undefined && (
                                <p className="text-zinc-600 text-xs">{entry.played} PJ</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Podio: ELO de temporada */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-4 text-center">
                      ELO de temporada
                    </p>
                    {stats.topPerformers.bySeasonalElo.length === 0 ? (
                      <p className="text-zinc-600 text-sm text-center py-4">Sin datos</p>
                    ) : (
                      <div className="space-y-2">
                        {stats.topPerformers.bySeasonalElo.map((entry, i) => (
                          <div
                            key={`elo-${entry.player}`}
                            className={`flex items-center justify-between rounded-xl px-3 py-2 ${i === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-zinc-800/60'}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg leading-none">{MEDAL[i]}</span>
                              <span className={`font-semibold text-sm ${i === 0 ? 'text-white' : 'text-zinc-300'}`}>
                                {entry.player}
                              </span>
                            </div>
                            <span className={`font-bold tabular-nums text-sm ${i === 0 ? 'text-yellow-400' : 'text-zinc-300'}`}>
                              {entry.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-zinc-700 text-xs text-center mt-3">ELO al último partido jugado</p>
                  </div>

                </div>
              </section>

              {/* ── Sección 2: Resumen de temporada ── */}
              <section>
                <SectionTitle>Resumen de temporada {season}</SectionTitle>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatChip label="Partidos" value={stats.totalMatches} />
                  <StatChip
                    label="% Empates"
                    value={`${stats.results.drawPercentage.toFixed(0)}%`}
                    sub={`${stats.results.draws} empate${stats.results.draws !== 1 ? 's' : ''}`}
                  />
                  <StatChip
                    label="Balance competitivo"
                    value={`${(stats.results.competitiveBalance * 100).toFixed(0)}%`}
                    sub="Mayor = más parejo"
                  />
                  <StatChip
                    label="Victoria más amplia"
                    value={`+${stats.goals.maxGoalDifference}`}
                    sub="diferencia de goles"
                  />
                </div>
              </section>

              {/* ── Sección 3: Líderes de racha ── */}
              <section>
                <SectionTitle>Líderes de racha</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
                      Racha ganadora más larga
                    </p>
                    {stats.streaks.longestWinStreak.streak > 0 ? (
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold text-lg">
                          {stats.streaks.longestWinStreak.player}
                        </span>
                        <span className="bg-green-900/60 text-green-400 text-sm font-bold px-3 py-1 rounded-full">
                          🔥 {stats.streaks.longestWinStreak.streak} victorias
                        </span>
                      </div>
                    ) : (
                      <p className="text-zinc-600 text-sm">Sin datos</p>
                    )}
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
                      Racha perdedora más larga
                    </p>
                    {stats.streaks.longestLossStreak.streak > 0 ? (
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold text-lg">
                          {stats.streaks.longestLossStreak.player}
                        </span>
                        <span className="bg-red-900/60 text-red-400 text-sm font-bold px-3 py-1 rounded-full">
                          💀 {stats.streaks.longestLossStreak.streak} derrotas
                        </span>
                      </div>
                    ) : (
                      <p className="text-zinc-600 text-sm">Sin datos</p>
                    )}
                  </div>
                </div>
              </section>

              {/* ── Sección 4: Mejores y peores duplas ── */}
              <section>
                <SectionTitle>Duplas</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Best duos */}
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
                      Mejores duplas
                    </p>
                    {stats.synergies.bestDuos.length === 0 ? (
                      <p className="text-zinc-600 text-sm">Sin datos</p>
                    ) : (
                      <div className="space-y-2">
                        {stats.synergies.bestDuos.slice(0, 3).map((duo, i) => (
                          <div
                            key={`best-${duo.players.join('-')}`}
                            className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-zinc-600 text-sm font-medium w-4">
                                {i + 1}
                              </span>
                              <span className="text-white text-sm font-medium">
                                {duo.players.join(' + ')}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-green-400 font-bold text-sm">
                                {duo.winRate.toFixed(0)}%
                              </span>
                              <span className="text-zinc-600 text-xs ml-2">
                                {duo.matches} PJ
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Worst duo */}
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
                      Peor dupla
                    </p>
                    {stats.synergies.worstDuos.length === 0 ? (
                      <p className="text-zinc-600 text-sm">Sin datos</p>
                    ) : (
                      <div className="space-y-2">
                        {stats.synergies.worstDuos.slice(0, 1).map((duo) => (
                          <div
                            key={`worst-${duo.players.join('-')}`}
                            className="flex items-center justify-between bg-zinc-900 border border-red-900/40 rounded-lg px-4 py-3"
                          >
                            <span className="text-white text-sm font-medium">
                              {duo.players.join(' + ')}
                            </span>
                            <div className="text-right">
                              <span className="text-red-400 font-bold text-sm">
                                {duo.winRate.toFixed(0)}%
                              </span>
                              <span className="text-zinc-600 text-xs ml-2">
                                {duo.matches} PJ
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* ── Sección 5: Distribución ELO ── */}
              <section>
                <SectionTitle>Distribución ELO</SectionTitle>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4 text-xs text-zinc-500">
                    <span>Promedio: {stats.elo.averageElo.toFixed(0)}</span>
                    <span>
                      Rango: {stats.elo.eloRange.min} – {stats.elo.eloRange.max}
                    </span>
                  </div>
                  {stats.elo.distribution.length === 0 ? (
                    <p className="text-zinc-600 text-sm text-center py-6">Sin datos</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={stats.elo.distribution}
                        margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
                      >
                        <XAxis
                          dataKey="range"
                          tick={{ fill: '#71717a', fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fill: '#71717a', fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: '#18181b',
                            border: '1px solid #3f3f46',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: 12,
                          }}
                          formatter={(value: number | undefined) => [`${value ?? 0} jugadores`, 'Cantidad']}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {stats.elo.distribution.map((entry, index) => (
                            <Cell
                              key={`elo-cell-${index}`}
                              fill={eloBarColor(entry.range)}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                  <div className="flex gap-4 mt-3 text-xs text-zinc-500 flex-wrap">
                    <span>
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" />
                      {'≥1050'}
                    </span>
                    <span>
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1" />
                      1000–1049
                    </span>
                    <span>
                      <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1" />
                      950–999
                    </span>
                    <span>
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" />
                      {'<950'}
                    </span>
                  </div>
                </div>
              </section>

              {/* ── Sección 6: Distribución de resultados (diferencia de goles) ── */}
              <section>
                <SectionTitle>Distribución de resultados</SectionTitle>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4 text-xs text-zinc-500">
                    <span>Diferencia media: {stats.goals.averageGoalDifference.toFixed(1)}</span>
                    <span>
                      Partidos ajustados (≤1): {stats.goals.closestMatches} ·{' '}
                      Goleadas (≥5): {stats.goals.blowouts}
                    </span>
                  </div>
                  {stats.goals.resultDistribution.length === 0 ? (
                    <p className="text-zinc-600 text-sm text-center py-6">Sin datos</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={stats.goals.resultDistribution}
                        margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
                      >
                        <XAxis
                          dataKey="difference"
                          tick={{ fill: '#71717a', fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                          label={{
                            value: 'Diferencia de goles',
                            position: 'insideBottom',
                            offset: -4,
                            fill: '#52525b',
                            fontSize: 10,
                          }}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fill: '#71717a', fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: '#18181b',
                            border: '1px solid #3f3f46',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: 12,
                          }}
                          formatter={(value: number | undefined) => [`${value ?? 0} partidos`, 'Cantidad']}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </section>

              {/* ── Sección 7: Asistencia ── */}
              <section>
                <SectionTitle>Asistencia</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                      Mayor asistencia
                    </p>
                    <p className="text-white font-semibold">
                      {stats.attendance.highestAttendance.players.join(', ') || 'N/A'}
                    </p>
                    <p className="text-green-400 text-xl font-bold mt-1">
                      {stats.attendance.highestAttendance.rate.toFixed(0)}%
                    </p>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                      Menor asistencia
                    </p>
                    <p className="text-white font-semibold">
                      {stats.attendance.lowestAttendance.players.join(', ') || 'N/A'}
                    </p>
                    <p className="text-red-400 text-xl font-bold mt-1">
                      {stats.attendance.lowestAttendance.rate.toFixed(0)}%
                    </p>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                      Promedio general
                    </p>
                    <p className="text-zinc-400 text-sm mt-1">
                      {stats.attendance.activePlayers} jugadores activos (≥50%)
                    </p>
                    <p className="text-white text-xl font-bold mt-1">
                      {stats.attendance.averageAttendance.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
