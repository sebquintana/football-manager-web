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
import { Bell, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
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
                <BreadcrumbLink href="#" className="text-white/70">
                  Football Manager
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-white/50" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">
                  Dashboard
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2 px-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notificaciones"
            className="text-white hover:bg-white/10"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-auto">
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            {/* Main Season Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center shadow-2xl">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-full shadow-lg">
                  <Trophy className="h-16 w-16 text-white" />
                </div>
              </div>
              <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Temporada 2025
              </h1>
              <p className="text-xl text-white/70 font-medium">
                ¡Bienvenido a la nueva temporada de Football Manager!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
