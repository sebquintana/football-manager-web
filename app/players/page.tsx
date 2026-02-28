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
import { Bell, ChevronRight } from "lucide-react";
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
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
                <BreadcrumbPage className="text-white text-sm font-medium">Jugadores</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2 px-4">
          <Button variant="ghost" size="icon" aria-label="Notificaciones" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 bg-black overflow-auto">
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-6">Jugadores</h1>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              {loading ? (
                <div className="text-center py-12 text-zinc-500">Cargando...</div>
              ) : error ? (
                <div className="text-center py-12 text-red-400">{error}</div>
              ) : (
                <div>
                  {players.map((player, index) => (
                    <Link
                      key={player.id}
                      href={`/players/${encodeURIComponent(player.name)}`}
                      className={`flex items-center justify-between px-5 py-4 hover:bg-zinc-800 transition-colors ${
                        index !== players.length - 1 ? 'border-b border-zinc-800' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-600 text-sm w-6 text-right tabular-nums">{index + 1}</span>
                        <span className="text-white font-medium">{player.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-zinc-600" />
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
