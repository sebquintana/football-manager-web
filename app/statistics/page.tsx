'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  TrendingUp,
  Users,
  Target,
  Trophy,
  Flame,
  UserCheck,
  BarChart3,
  Calendar,
  Award,
  Zap,
  ChevronDown,
  ChevronRight,
  Bell,
} from "lucide-react"

interface AttendanceStats {
  totalMatches: number
  totalPlayerSpots: number
  totalAttendances: number
  attendanceRate: number
  averagePlayersPerMatch: number
}

interface ELOStats {
  average: number
  median: number
  min: number
  max: number
  standardDeviation: number
  distribution: {
    range: string
    count: number
    percentage: number
  }[]
}

interface GoalStats {
  totalGoals: number
  averageGoalsPerMatch: number
  averageGoalsPerPlayer: number
  topScorers: {
    playerName: string
    goals: number
  }[]
}

interface ResultStats {
  totalMatches: number
  wins: number
  draws: number
  losses: number
  winRate: number
  drawRate: number
  lossRate: number
}

interface StreakStats {
  longestWinStreak: {
    playerName: string
    streak: number
  }[]
  longestLossStreak: {
    playerName: string
    streak: number
  }[]
  currentStreaks: {
    playerName: string
    type: 'win' | 'loss'
    streak: number
  }[]
}

interface SynergyStats {
  bestSynergies: {
    players: string[]
    synergyScore: number
    matchesPlayed: number
  }[]
  worstSynergies: {
    players: string[]
    synergyScore: number
    matchesPlayed: number
  }[]
  averageSynergyScore: number
}

interface GeneralStatistics {
  attendance: AttendanceStats
  elo: ELOStats
  goals: GoalStats
  results: ResultStats
  streaks: StreakStats
  synergies: SynergyStats
}

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<GeneralStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    attendance: true,
    elo: false,
    goals: false,
    results: false,
    streaks: false,
    synergies: false
  })

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/statistics/general`)
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      setStatistics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="flex flex-col h-full -m-4">
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80 border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-2 px-4 flex-1">
          <SidebarTrigger className="-ml-1 text-white" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-white/20" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/" className="text-white/70">
                  Football Manager
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-white/50" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">Estadísticas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2 px-4">
          <Button variant="ghost" size="icon" aria-label="Notificaciones" className="text-white hover:bg-white/10">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-auto">
        <div className="p-6 space-y-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-white/70">Cargando estadísticas...</p>
          </div>
        </div>
      ) : error ? (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardHeader>
            <CardTitle className="text-red-400">Error al cargar estadísticas</CardTitle>
            <CardDescription className="text-red-300">{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : !statistics ? (
        <Card>
          <CardHeader>
            <CardTitle>No hay datos disponibles</CardTitle>
            <CardDescription>No se encontraron estadísticas para mostrar.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>

      {/* Attendance Statistics */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('attendance')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCheck className="h-6 w-6 text-green-600" />
              <CardTitle>Asistencia</CardTitle>
            </div>
            {expandedSections.attendance ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </div>
          <CardDescription>
            Estadísticas de participación en partidos
          </CardDescription>
        </CardHeader>
        {expandedSections.attendance && (
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">
                {statistics.attendance.totalMatches || 0}
              </div>
              <div className="text-sm text-gray-600">Partidos Totales</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">
                {(statistics.attendance.attendanceRate || 0).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Tasa de Asistencia</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">
                {(statistics.attendance.averagePlayersPerMatch || 0).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Promedio de Jugadores</div>
            </div>
            
            <div className="md:col-span-3 mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Asistencias: {statistics.attendance.totalAttendances || 0}</span>
                <span>Espacios Totales: {statistics.attendance.totalPlayerSpots || 0}</span>
              </div>
              <Progress 
                value={statistics.attendance.attendanceRate || 0} 
                className="h-2"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* ELO Statistics */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('elo')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6 text-yellow-600" />
              <CardTitle>Distribución ELO</CardTitle>
            </div>
            {expandedSections.elo ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </div>
          <CardDescription>
            Análisis de la distribución de puntuaciones ELO
          </CardDescription>
        </CardHeader>
        {expandedSections.elo && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xl font-bold text-orange-700">
                  {(statistics.elo.average || 0).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Promedio</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-700">
                  {(statistics.elo.median || 0).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Mediana</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-700">
                  {(statistics.elo.max || 0).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Máximo</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-700">
                  {(statistics.elo.min || 0).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Mínimo</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Distribución por Rangos</h4>
              {(statistics.elo.distribution || []).map((range, index) => (
                <div key={`elo-range-${range.range}-${index}`} className="flex items-center gap-3">
                  <div className="w-20 text-sm font-medium text-gray-600">
                    {range.range}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{range.count || 0} jugadores</span>
                      <span>{(range.percentage || 0).toFixed(1)}%</span>
                    </div>
                    <Progress value={range.percentage || 0} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Goals Statistics */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('goals')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-red-600" />
              <CardTitle>Estadísticas de Goles</CardTitle>
            </div>
            {expandedSections.goals ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </div>
          <CardDescription>
            Análisis de goles y máximos goleadores
          </CardDescription>
        </CardHeader>
        {expandedSections.goals && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <Target className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-700">
                  {statistics.goals.totalGoals || 0}
                </div>
                <div className="text-sm text-gray-600">Goles Totales</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-700">
                  {(statistics.goals.averageGoalsPerMatch || 0).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Promedio por Partido</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Users className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-700">
                  {(statistics.goals.averageGoalsPerPlayer || 0).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Promedio por Jugador</div>
              </div>
            </div>

            {(statistics.goals.topScorers || []).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Máximos Goleadores</h4>
                <div className="space-y-2">
                  {(statistics.goals.topScorers || []).map((scorer, index) => (
                    <div key={`top-scorer-${scorer.playerName}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                        <span className="font-medium">{scorer.playerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-red-500" />
                        <span className="font-bold text-red-600">{scorer.goals || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Results Statistics */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('results')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-blue-600" />
              <CardTitle>Resultados de Partidos</CardTitle>
            </div>
            {expandedSections.results ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </div>
          <CardDescription>
            Análisis de victorias, empates y derrotas
          </CardDescription>
        </CardHeader>
        {expandedSections.results && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">
                  {statistics.results.totalMatches || 0}
                </div>
                <div className="text-sm text-gray-600">Partidos Totales</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {statistics.results.wins || 0}
                </div>
                <div className="text-sm text-gray-600">Victorias</div>
                <div className="text-xs text-green-600 font-medium">
                  {(statistics.results.winRate || 0).toFixed(1)}%
                </div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">
                  {statistics.results.draws || 0}
                </div>
                <div className="text-sm text-gray-600">Empates</div>
                <div className="text-xs text-yellow-600 font-medium">
                  {(statistics.results.drawRate || 0).toFixed(1)}%
                </div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-700">
                  {statistics.results.losses || 0}
                </div>
                <div className="text-sm text-gray-600">Derrotas</div>
                <div className="text-xs text-red-600 font-medium">
                  {(statistics.results.lossRate || 0).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Distribución de Resultados</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-16 text-sm font-medium text-green-600">Victorias</div>
                  <div className="flex-1">
                    <Progress value={statistics.results.winRate || 0} className="h-3 bg-green-100" />
                  </div>
                  <div className="w-12 text-sm text-gray-600">{(statistics.results.winRate || 0).toFixed(1)}%</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 text-sm font-medium text-yellow-600">Empates</div>
                  <div className="flex-1">
                    <Progress value={statistics.results.drawRate || 0} className="h-3 bg-yellow-100" />
                  </div>
                  <div className="w-12 text-sm text-gray-600">{(statistics.results.drawRate || 0).toFixed(1)}%</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 text-sm font-medium text-red-600">Derrotas</div>
                  <div className="flex-1">
                    <Progress value={statistics.results.lossRate || 0} className="h-3 bg-red-100" />
                  </div>
                  <div className="w-12 text-sm text-gray-600">{(statistics.results.lossRate || 0).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Streaks Statistics */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('streaks')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="h-6 w-6 text-orange-600" />
              <CardTitle>Rachas de Jugadores</CardTitle>
            </div>
            {expandedSections.streaks ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </div>
          <CardDescription>
            Mejores y peores rachas de victorias y derrotas
          </CardDescription>
        </CardHeader>
        {expandedSections.streaks && (
          <CardContent className="space-y-6">
            {/* Current Streaks */}
            {(statistics.streaks.currentStreaks || []).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Rachas Actuales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(statistics.streaks.currentStreaks || []).map((streak, index) => (
                    <div 
                      key={`current-streak-${streak.playerName}-${streak.type}-${index}`} 
                      className={`p-3 rounded-lg border-l-4 ${
                        streak.type === 'win' 
                          ? 'bg-green-50 border-green-500' 
                          : 'bg-red-50 border-red-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{streak.playerName}</span>
                        <Badge 
                          variant={streak.type === 'win' ? 'default' : 'destructive'}
                          className="flex items-center gap-1"
                        >
                          <Flame className="h-3 w-3" />
                          {streak.streak || 0} {streak.type === 'win' ? 'victorias' : 'derrotas'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Longest Win Streaks */}
            {(statistics.streaks.longestWinStreak || []).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-green-500" />
                  Mejores Rachas de Victorias
                </h4>
                <div className="space-y-2">
                  {(statistics.streaks.longestWinStreak || []).map((streak, index) => (
                    <div key={`win-streak-${streak.playerName}-${index}`} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-green-100">
                          #{index + 1}
                        </Badge>
                        <span className="font-medium">{streak.playerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-green-600" />
                        <span className="font-bold text-green-700">{streak.streak || 0} victorias</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Longest Loss Streaks */}
            {(statistics.streaks.longestLossStreak || []).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                  Peores Rachas de Derrotas
                </h4>
                <div className="space-y-2">
                  {(statistics.streaks.longestLossStreak || []).map((streak, index) => (
                    <div key={`loss-streak-${streak.playerName}-${index}`} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-red-100">
                          #{index + 1}
                        </Badge>
                        <span className="font-medium">{streak.playerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-red-600" />
                        <span className="font-bold text-red-700">{streak.streak || 0} derrotas</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Synergies Statistics */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('synergies')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-purple-600" />
              <CardTitle>Sinergias de Equipos</CardTitle>
            </div>
            {expandedSections.synergies ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </div>
          <CardDescription>
            Análisis de compatibilidad entre jugadores
          </CardDescription>
        </CardHeader>
        {expandedSections.synergies && (
          <CardContent className="space-y-6">
            {/* Average Synergy Score */}
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">
                {(statistics.synergies.averageSynergyScore || 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Puntuación Promedio de Sinergia</div>
            </div>

            {/* Best Synergies */}
            {(statistics.synergies.bestSynergies || []).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-green-500" />
                  Mejores Sinergias
                </h4>
                <div className="space-y-3">
                  {(statistics.synergies.bestSynergies || []).map((synergy, index) => (
                    <div key={`best-synergy-${synergy.players?.join('-')}-${index}`} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-100">
                            #{index + 1}
                          </Badge>
                          <span className="font-bold text-green-700">
                            {(synergy.synergyScore || 0).toFixed(2)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {synergy.matchesPlayed || 0} partidos
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {(synergy.players || []).join(' + ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Worst Synergies */}
            {(statistics.synergies.worstSynergies || []).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                  Sinergias a Mejorar
                </h4>
                <div className="space-y-3">
                  {(statistics.synergies.worstSynergies || []).map((synergy, index) => (
                    <div key={`worst-synergy-${synergy.players?.join('-')}-${index}`} className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-red-100">
                            #{index + 1}
                          </Badge>
                          <span className="font-bold text-red-700">
                            {(synergy.synergyScore || 0).toFixed(2)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {synergy.matchesPlayed || 0} partidos
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {(synergy.players || []).join(' + ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
        </>
      )}
        </div>
      </main>
    </div>
  )
}
