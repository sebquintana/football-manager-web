'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Player {
  id: string;
  name: string;
}

export default function PlayersPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch(`${apiUrl}/players`);
        const data: Player[] = await res.json();
        data.sort((a, b) => a.name.localeCompare(b.name));
        setPlayers(data);
      } catch (err) {
        setError('No se pudieron obtener los jugadores.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="flex flex-col h-full -m-4">
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80 border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-2 px-4 flex-1">
          <SidebarTrigger className="-ml-1 text-white" />
          <Separator
            orientation="vertical"
            className="mr-2 h-4 bg-white/20"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/" className="text-white/70">
                  Football Manager
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-white/50" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">
                  Jugadores
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-auto">
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-6 shadow-2xl">
              <div className="flex items-center justify-center gap-3">
                <div className="text-4xl">👥</div>
                <h1 className="text-4xl font-bold text-white">
                  Jugadores
                </h1>
              </div>
            </div>

            {/* Players List */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-white/70">Cargando...</div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-400">{error}</div>
                </div>
              ) : (
                <div className="grid gap-3">
                  {players.map((player, index) => (
                    <Link
                      key={player.id}
                      href={`/players/${encodeURIComponent(player.name)}`}
                      className="group"
                    >
                      <div className="bg-slate-700/40 border border-slate-600/30 rounded-xl p-4 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:bg-slate-600/40 hover:border-blue-500/50">
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-medium text-blue-400 min-w-[3rem] text-center">
                            {index + 1}.
                          </div>
                          <div className="text-lg font-medium text-white/90 group-hover:text-white transition-colors">
                            {player.name}
                          </div>
                          <div className="ml-auto text-blue-400/60 group-hover:text-blue-400 transition-colors">
                            →
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
