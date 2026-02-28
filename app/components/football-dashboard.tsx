"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  Users,
  Target,
  Calendar,
  ArrowRight,
  Clock,
  Star,
  Award,
} from "lucide-react";
import Link from "next/link";

const recentActivity = [
  {
    id: "1",
    title: "Nuevo Jugador Registrado",
    description: "Juan Pérez se unió al equipo",
    time: "Hoy, 2:45 PM",
    type: "player",
    amount: "+1",
  },
  {
    id: "2",
    title: "Partido Completado",
    description: "Real Madrid vs Barcelona",
    time: "Hoy, 9:00 AM",
    type: "match",
    amount: "3-2",
  },
  {
    id: "3",
    title: "Ranking Actualizado",
    description: "Nuevas posiciones disponibles",
    time: "Ayer",
    type: "ranking",
    amount: "↑2",
  },
  {
    id: "4",
    title: "Equipo Generado",
    description: "Nuevos equipos balanceados",
    time: "Ayer",
    type: "team",
    amount: "+4",
  },
];

const upcomingEvents = [
  {
    title: "Próximo Partido",
    description: "Final de temporada programada",
    progress: 75,
    target: "Este Domingo",
    status: "in-progress",
  },
  {
    title: "Registro de Jugadores",
    description: "Período de inscripciones abiertas",
    progress: 45,
    target: "15 días restantes",
    status: "pending",
  },
  {
    title: "Actualización de Rankings",
    description: "Cálculo automático semanal",
    progress: 90,
    target: "Próximo Lunes",
    status: "in-progress",
  },
];

export function FootballDashboard() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Football Manager
          </h2>
          <p className="text-muted-foreground">Gestiona tu liga de fútbol</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/10 border-white/20 text-white hover:bg-white/20"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Ver Trofeos
          </Button>
        </div>
      </div>

      {/* Main Stats Card */}
      <Card className="dashboard-gradient border-0 text-white shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Liga Activa</p>
              <h3 className="text-5xl font-bold mt-2">Temporada 2024</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <Trophy className="h-12 w-12 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Quick Stats */}
        <Card className="card-glass border-white/10 shadow-xl lg:col-span-1 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Estadísticas Rápidas</CardTitle>
            <CardDescription>Resumen de tu liga</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-muted-foreground">
                    Jugadores
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-muted-foreground">Equipos</span>
                </div>
                <p className="text-2xl font-bold text-white">6</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-muted-foreground">
                    Partidos
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">15</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">
                    Completados
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Progreso de Temporada
                </span>
                <Badge
                  variant="secondary"
                  className="bg-green-500/20 text-green-400 border-green-500/30"
                >
                  80% Completado
                </Badge>
              </div>
              <Progress value={80} className="h-2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 pt-2">
              <Button
                asChild
                className="w-full justify-between bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                <a href="/ranking">
                  Ver Ranking Completo
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Link href="/players">
                  Gestionar Jugadores
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-glass border-white/10 shadow-xl lg:col-span-1 xl:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Actividad Reciente</CardTitle>
                <CardDescription>
                  Últimas actualizaciones de la liga
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-white/20 text-white">
                {recentActivity.length} eventos
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex-shrink-0">
                  {activity.type === "player" && (
                    <Users className="h-5 w-5 text-blue-400" />
                  )}
                  {activity.type === "match" && (
                    <Calendar className="h-5 w-5 text-green-400" />
                  )}
                  {activity.type === "ranking" && (
                    <Trophy className="h-5 w-5 text-yellow-400" />
                  )}
                  {activity.type === "team" && (
                    <Target className="h-5 w-5 text-purple-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </span>
                    <span className="text-sm font-medium text-white">
                      {activity.amount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <Button
              asChild
              variant="ghost"
              className="w-full text-white hover:bg-white/10"
            >
              <a href="/matches">
                Ver Toda la Actividad
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="card-glass border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Próximos Eventos
          </CardTitle>
          <CardDescription>
            Actividades programadas y en progreso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          event.status === "in-progress"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          event.status === "in-progress"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {event.status === "in-progress"
                          ? "En Progreso"
                          : "Pendiente"}
                      </Badge>
                      <Star className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        {event.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="text-white font-medium">
                          {event.progress}%
                        </span>
                      </div>
                      <Progress value={event.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {event.target}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Ver Detalles
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add a placeholder card for better visual balance */}
            <Card className="bg-white/5 border-white/10 border-dashed">
              <CardContent className="p-4 flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto bg-white/10 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white/50" />
                  </div>
                  <p className="text-sm text-white/70">Agregar Evento</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/50 hover:text-white hover:bg-white/10"
                  >
                    <span className="text-lg">+</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
