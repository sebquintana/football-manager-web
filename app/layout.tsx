import "./globals.css";
import { ReactNode } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="min-h-screen font-sans">
        <header className="bg-gray-900 text-gray-100 mb-6">
          <nav className="container mx-auto flex flex-wrap gap-6 justify-center py-4 text-sm font-semibold">
            <a href="/" className="hover:text-blue-400 transition-colors">Inicio</a>
            <a href="/ranking" className="hover:text-blue-400 transition-colors">Ranking</a>
            <a href="/players" className="hover:text-blue-400 transition-colors">Jugadores</a>
            <a href="/teams" className="hover:text-blue-400 transition-colors">Equipos</a>
            <a href="/matches" className="hover:text-blue-400 transition-colors">Partidos</a>
            <a href="/match" className="hover:text-blue-400 transition-colors">Cargar Resultado</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
