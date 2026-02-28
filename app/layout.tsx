import "./globals.css"
import type { ReactNode } from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const clerkAppearance = {
  variables: {
    colorBackground: '#09090b',
    colorInputBackground: '#27272a',
    colorInputText: '#ffffff',
    colorText: '#ffffff',
    colorTextSecondary: '#a1a1aa',
    colorPrimary: '#3b82f6',
    colorNeutral: '#ffffff',
    colorDanger: '#f87171',
    borderRadius: '0.75rem',
    fontFamily: 'inherit',
  },
  elements: {
    card: 'bg-zinc-900 border border-zinc-800 shadow-2xl',
    headerTitle: 'text-white',
    headerSubtitle: 'text-zinc-400',
    socialButtonsBlockButton: 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700',
    dividerLine: 'bg-zinc-700',
    dividerText: 'text-zinc-500',
    formFieldLabel: 'text-zinc-300',
    formFieldInput: 'bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500',
    footerActionLink: 'text-blue-400 hover:text-blue-300',
    identityPreviewText: 'text-zinc-300',
    identityPreviewEditButton: 'text-blue-400',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="es" className="dark">
        <body className="bg-background min-h-screen">
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-1 flex-col">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
