"use client"

import type * as React from "react"
import { Trophy, Users, Target, Calendar, BarChart3, Zap } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar"

const data = {
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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="pt-14">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
