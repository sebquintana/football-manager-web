export default function Home() {
  return (
    <main style={{
      maxWidth: 480,
      margin: '48px auto',
      padding: 24,
      background: 'white',
      borderRadius: 12,
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', color: '#0f172a' }}>
        Football Manager
      </h1>
      <a href="/ranking" style={{ color: '#2563EB' }}>Ver Ranking</a>
      <a href="/players" style={{ color: '#0ea5e9' }}>Ver Jugadores</a>
      <a href="/teams" style={{ color: '#16a34a' }}>Generar Equipos</a>
      <a href="/matches" style={{ color: '#6b7280' }}>Ver Partidos</a>
      <a href="/match" style={{ color: '#db2777' }}>Cargar Resultado</a>
    </main>
  );
}
