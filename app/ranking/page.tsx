'use client';

import { useEffect, useState } from 'react';
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

type Player = {
  name: string;
  elo: number;
};

const medals = ['🥇', '🥈', '🥉'];

export default function RankingPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      try {
        const res = await fetch(`${apiUrl}/players/ranking`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error('Error fetching ranking', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
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
                <BreadcrumbPage className="text-white text-sm font-medium">Ranking</BreadcrumbPage>
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
            <h1 className="text-3xl font-bold text-white tracking-tight mb-6">Ranking</h1>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              {loading ? (
                <div className="text-center py-12 text-zinc-500">Cargando...</div>
              ) : (
                <div>
                  {players.map((player, index) => (
                    <div
                      key={player.name}
                      className={`flex items-center justify-between px-5 py-4 ${
                        index !== players.length - 1 ? 'border-b border-zinc-800' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xl w-7 text-center">
                          {index < 3 ? medals[index] : (
                            <span className="text-zinc-600 text-sm font-medium">{index + 1}</span>
                          )}
                        </span>
                        <span className={`font-semibold ${index === 0 ? 'text-white text-lg' : 'text-zinc-200'}`}>
                          {player.name}
                        </span>
                      </div>
                      <span className={`font-bold tabular-nums ${
                        index === 0 ? 'text-blue-400 text-xl' : 'text-zinc-300 text-base'
                      }`}>
                        {player.elo}
                      </span>
                    </div>
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
