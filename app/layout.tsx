import Link from "next/link";
import "./globals.css";
import { ReactNode } from "react";
import "./styles/navbar.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <header className="navbar-header">
          <nav className="navbar-nav">
            <Link href="/" className="navbar-link">
              Inicio
            </Link>
            <Link href="/ranking" className="navbar-link">
              Ranking
            </Link>
            <Link href="/players" className="navbar-link">
              Jugadores
            </Link>
            <Link href="/teams" className="navbar-link">
              Equipos
            </Link>
            <Link href="/matches" className="navbar-link">
              Partidos
            </Link>
            <Link href="/match" className="navbar-link">
              Cargar Resultado
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
