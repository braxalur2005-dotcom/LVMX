function AdminLeagueApp() {
  try {
    const [leagueId, setLeagueId] = React.useState(null);
    const [league, setLeague] = React.useState(null);

    React.useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        setLeagueId(id);
        const data = DataManager.getData();
        const foundLeague = data.leagues.find(l => l.id === id);
        setLeague(foundLeague);
      }
    }, []);

    if (!league) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <a href="admin.html" className="text-[var(--primary-color)] hover:underline mb-4 inline-block">
              ← Volver al Panel de Admin
            </a>
            <h1 className="text-4xl font-bold text-gray-900">Admin - {league.name}</h1>
            <p className="text-gray-600 mt-2">Gestión de Liguilla</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <PlayoffBracket league={league} isAdmin={true} />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('AdminLeagueApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminLeagueApp />);