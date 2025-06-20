import "./globals.css"
import type { ReactNode } from "react"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-background min-h-screen">{children}</body>
    </html>
  )
}
