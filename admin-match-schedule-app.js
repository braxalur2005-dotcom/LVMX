function AdminMatchScheduleApp() {
  try {
    const [data, setData] = React.useState(DataManager.getData());
    const [selectedLeague, setSelectedLeague] = React.useState('league1');
    const [selectedMatchday, setSelectedMatchday] = React.useState(1);
    const [message, setMessage] = React.useState('');

    const league = data.leagues.find(l => l.id === selectedLeague);
    const matches = league ? league.matches.filter(m => m.matchday === selectedMatchday) : [];
    const matchdayOptions = Array.from({length: 19}, (_, i) => i + 1);

    const handleDateTimeChange = (matchId, dateTime) => {
      const newData = DataManager.getData();
      const leagueData = newData.leagues.find(l => l.id === selectedLeague);
      const match = leagueData.matches.find(m => m.matchId === matchId);
      match.scheduledDate = dateTime;
      DataManager.saveData(newData);
      setData(newData);
      setMessage('Horario actualizado');
      setTimeout(() => setMessage(''), 2000);
    };

    const handleStartMatch = (matchId) => {
      const started = MatchSimulator.startLiveMatch(selectedLeague, matchId);
      if (started) {
        setData(DataManager.getData());
        setMessage('Partido iniciado');
        setTimeout(() => setMessage(''), 2000);
      }
    };

    const getTeam = (teamId) => data.teams.find(t => t.id === teamId);

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-900">Programar Partidos</h1>
            <a href="admin.html" className="text-[var(--primary-color)] hover:underline">← Volver</a>
          </div>

          {message && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Liga</label>
                <select value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  {data.leagues.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Jornada</label>
                <select value={selectedMatchday} onChange={(e) => setSelectedMatchday(parseInt(e.target.value))} className="w-full px-4 py-2 border rounded-lg">
                  {matchdayOptions.map((day) => (
                    <option key={`matchday-${day}`} value={day}>Jornada {day}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {matches.map((match, index) => {
              const homeTeam = getTeam(match.homeTeamId);
              const awayTeam = getTeam(match.awayTeamId);
              return (
                <div key={`match-${selectedLeague}-${selectedMatchday}-${index}`} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="font-semibold">{homeTeam?.name}</span>
                      <span className="text-gray-500">vs</span>
                      <span className="font-semibold">{awayTeam?.name}</span>
                    </div>
                    {match.live && <span className="text-red-600 font-bold">🔴 EN VIVO</span>}
                    {match.played && <span className="text-green-600 font-bold">✓ Jugado</span>}
                  </div>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">Fecha y Hora</label>
                      <input
                        type="datetime-local"
                        value={match.scheduledDate || ''}
                        onChange={(e) => handleDateTimeChange(match.matchId, e.target.value)}
                        min="2025-01-01T09:00"
                        max="2025-12-31T22:30"
                        disabled={match.played || match.live}
                        className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
                      />
                    </div>
                    {!match.played && !match.live && (
                      <button onClick={() => handleStartMatch(match.matchId)} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Iniciar Ahora
                      </button>
                    )}
                    {match.live && (
                      <a href={`live-match.html?leagueId=${selectedLeague}&matchId=${match.matchId}`} target="_blank" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Ver Partido
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('AdminMatchScheduleApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminMatchScheduleApp />);