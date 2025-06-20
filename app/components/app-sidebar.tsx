"use client"

import type * as React from "react"
import { Trophy, Users, Target, Calendar, BarChart3, Settings, HelpCircle, Shield, Zap, TrendingUp } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Manager",
    email: "manager@football.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  teams: [
    {
      name: "Liga Principal",
      logo: Trophy,
      plan: "Temporada 2024",
    },
    {
      name: "Copa Nacional",
      logo: Shield,
      plan: "Activa",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: BarChart3,
      isActive: true,
    },
    {
      title: "Ranking",
      url: "/ranking",
      icon: Trophy,
    },
    {
      title: "Jugadores",
      url: "/players",
      icon: Users,
    },
    {
      title: "Equipos",
      url: "/teams",
      icon: Target,
    },
    {
      title: "Partidos",
      url: "/matches",
      icon: Calendar,
    },
    {
      title: "Cargar Resultado",
      url: "/match",
      icon: Zap,
    },
  ],
  projects: [
    {
      name: "Estadísticas",
      url: "#",
      icon: TrendingUp,
    },
    {
      name: "Configuración",
      url: "#",
      icon: Settings,
    },
    {
      name: "Ayuda",
      url: "#",
      icon: HelpCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
