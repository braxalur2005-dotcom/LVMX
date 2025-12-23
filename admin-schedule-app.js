function AdminScheduleApp() {
  try {
    const [data, setData] = React.useState(DataManager.getData());
    const [selectedLeague, setSelectedLeague] = React.useState('league1');
    const [matches, setMatches] = React.useState([]);
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
      const league = data.leagues.find(l => l.id === selectedLeague);
      if (league) {
        const jornada1 = league.matches.filter(m => m.matchday === 1);
        setMatches(jornada1.map(m => ({ ...m })));
      }
    }, [selectedLeague]);

    const handleTeamChange = (matchIndex, field, value) => {
      const newMatches = [...matches];
      newMatches[matchIndex][field] = value;
      setMatches(newMatches);
    };

    const handleSave = () => {
      const newData = DataManager.getData();
      const league = newData.leagues.find(l => l.id === selectedLeague);
      
      league.matches = [];
      for (let matchday = 1; matchday <= 19; matchday++) {
        const dayMatches = matches.map(m => ({
          ...m,
          matchday,
          played: false,
          homeScore: null,
          awayScore: null
        }));
        league.matches.push(...dayMatches);
      }
      
      DataManager.saveData(newData);
      setData(newData);
      setMessage('Calendario actualizado correctamente');
      setTimeout(() => setMessage(''), 3000);
    };

    const league = data.leagues.find(l => l.id === selectedLeague);
    const teams = league ? league.teams.map(id => data.teams.find(t => t.id === id)) : [];

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Gestión de Calendario</h1>
              <p className="text-gray-600 mt-2">Configura los enfrentamientos de la Jornada 1</p>
            </div>
            <a href="admin.html" className="text-[var(--primary-color)] hover:underline">← Volver</a>
          </div>

          {message && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <label className="block text-gray-700 mb-2 font-semibold">Seleccionar Liga</label>
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              {data.leagues.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Enfrentamientos Jornada 1</h2>
            <div className="space-y-4">
              {matches.map((match, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <select
                      value={match.homeTeamId}
                      onChange={(e) => handleTeamChange(idx, 'homeTeamId', e.target.value)}
                      className="px-3 py-2 border rounded"
                    >
                      {teams.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <div className="text-center font-bold">VS</div>
                    <select
                      value={match.awayTeamId}
                      onChange={(e) => handleTeamChange(idx, 'awayTeamId', e.target.value)}
                      className="px-3 py-2 border rounded"
                    >
                      {teams.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleSave}
              className="mt-6 w-full px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg font-semibold hover:bg-[var(--secondary-color)]"
            >
              Guardar Calendario
            </button>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('AdminScheduleApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminScheduleApp />);