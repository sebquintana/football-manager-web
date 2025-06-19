import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header>
          <nav>
            <a href="/">Inicio</a>
            <a href="/ranking">Ranking</a>
            <a href="/players">Jugadores</a>
            <a href="/teams">Equipos</a>
            <a href="/matches">Partidos</a>
            <a href="/match">Cargar Resultado</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
