import { AppSidebar } from "@/components/app-sidebar";
import { FootballDashboard } from "@/components/football-dashboard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />

        {/* Main content area with proper spacing */}
        <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64 transition-all duration-300">
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
              <div className="relative hidden md:block">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  className="pl-8 w-64 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <main className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <FootballDashboard />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
