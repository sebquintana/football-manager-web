"use client"

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

interface PageHeaderProps {
  title: string;
  showSearch?: boolean;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
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
              <BreadcrumbPage className="text-white text-sm font-medium">
                {title}
              </BreadcrumbPage>
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
  );
}
