import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        <header
          style={{
            background: "#1f2937",
            padding: "12px 16px",
            marginBottom: 24,
          }}
        >
          <nav
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              color: "white",
              fontWeight: 600,
            }}
          >
            <a href="/" style={{ color: "inherit" }}>
              Inicio
            </a>
            <a href="/ranking" style={{ color: "inherit" }}>
              Ranking
            </a>
            <a href="/players" style={{ color: "inherit" }}>
              Jugadores
            </a>
            <a href="/teams" style={{ color: "inherit" }}>
              Equipos
            </a>
            <a href="/matches" style={{ color: "inherit" }}>
              Partidos
            </a>
            <a href="/match" style={{ color: "inherit" }}>
              Cargar Resultado
            </a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
