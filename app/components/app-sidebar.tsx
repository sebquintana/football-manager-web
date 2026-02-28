"use client"

import type * as React from "react"
import { Trophy, Users, Target, Calendar, BarChart3, BarChart2, Zap, Shield } from "lucide-react"
import { useUser, SignInButton, UserButton } from "@clerk/nextjs"

import { NavMain } from "@/components/nav-main"
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from "@/components/ui/sidebar"

const publicNav = [
  { title: "Dashboard", url: "/", icon: BarChart3, isActive: true },
  { title: "Ranking", url: "/ranking", icon: Trophy },
  { title: "Estadísticas", url: "/statistics", icon: BarChart2 },
  { title: "Jugadores", url: "/players", icon: Users },
  { title: "Equipos", url: "/teams", icon: Target },
  { title: "Partidos", url: "/matches", icon: Calendar },
]

const adminNav = [
  { title: "Cargar Resultado", url: "/match", icon: Zap },
  { title: "Admin Jugadores", url: "/admin/players", icon: Shield },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoaded } = useUser()
  const isAdmin = isLoaded && (user?.publicMetadata as { role?: string })?.role === 'admin'

  const navItems = isAdmin ? [...publicNav, ...adminNav] : publicNav

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="pt-14">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="pb-4 px-2">
        {isLoaded && (
          user ? (
            <div className="flex items-center gap-2 px-2">
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="w-full text-left text-sm text-zinc-400 hover:text-white px-2 py-2 rounded-lg hover:bg-zinc-800 transition-colors">
                Iniciar sesión
              </button>
            </SignInButton>
          )
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
