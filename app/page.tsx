export default function Home() {
  return (
    <main className="card">
      <h1>Football Manager</h1>
      <a href="/ranking" style={{ color: '#2563EB' }}>Ver Ranking</a>
      <a href="/players" style={{ color: '#0ea5e9' }}>Ver Jugadores</a>
      <a href="/teams" style={{ color: '#16a34a' }}>Generar Equipos</a>
      <a href="/matches" style={{ color: '#6b7280' }}>Ver Partidos</a>
      <a href="/match" style={{ color: '#db2777' }}>Cargar Resultado</a>
    </main>
  );
}
