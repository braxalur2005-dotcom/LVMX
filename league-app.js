function LeagueApp() {
  try {
    const [leagueId, setLeagueId] = React.useState(null);
    const [league, setLeague] = React.useState(null);
    const [activeTab, setActiveTab] = React.useState('fixtures');
    const [selectedTeam, setSelectedTeam] = React.useState(null);

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

    const tabs = [
      { id: 'fixtures', label: 'Enfrentamientos', icon: 'calendar' },
      { id: 'results', label: 'Resultados', icon: 'list' },
      { id: 'standings', label: 'Tabla de Posiciones', icon: 'trophy' },
      { id: 'playoffs', label: 'Liguilla', icon: 'zap' },
      { id: 'teams', label: 'Equipos', icon: 'users' }
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <a href="index.html" className="text-[var(--primary-color)] hover:underline mb-4 inline-block">
              ← Volver a Inicio
            </a>
            <h1 className="text-4xl font-bold text-gray-900">{league.name}</h1>
            <p className="text-gray-600 mt-2">Temporada {DataManager.getCurrentSeason()}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg mb-6">
            <div className="flex overflow-x-auto border-b">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className={`icon-${tab.icon} text-lg`}></div>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            {activeTab === 'fixtures' && <MatchList league={league} type="upcoming" />}
            {activeTab === 'results' && <MatchList league={league} type="results" />}
            {activeTab === 'standings' && <StandingsTable league={league} />}
            {activeTab === 'playoffs' && <PlayoffBracket league={league} />}
            {activeTab === 'teams' && <TeamList league={league} onTeamClick={setSelectedTeam} />}
          </div>
        </main>
        {selectedTeam && <TeamModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />}
      </div>
    );
  } catch (error) {
    console.error('LeagueApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LeagueApp />);