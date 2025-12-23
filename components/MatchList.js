function MatchList({ league, type }) {
  try {
    const [data, setData] = React.useState(DataManager.getData());
    const [selectedMatchday, setSelectedMatchday] = React.useState(1);
    
    React.useEffect(() => {
      const interval = setInterval(() => {
        setData(DataManager.getData());
      }, 5000);
      return () => clearInterval(interval);
    }, []);

    let matches = [];
    if (type === 'upcoming' || type === 'results') {
      const currentLeague = data.leagues.find(l => l.id === league.id);
      if (currentLeague) {
        const dayMatches = currentLeague.matches.filter(m => m.matchday === selectedMatchday);
        if (type === 'results') {
          matches = dayMatches.filter(m => m.played);
        } else {
          matches = dayMatches;
        }
      }
    }

    const getTeam = (teamId) => {
      return data.teams.find(t => t.id === teamId);
    };

    const matchdays = Array.from({ length: 19 }, (_, i) => i + 1);

    return (
      <div data-name="match-list" data-file="components/MatchList.js">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {type === 'upcoming' ? 'Enfrentamientos' : 'Resultados'}
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Jornada:</label>
            <select
              value={selectedMatchday}
              onChange={(e) => setSelectedMatchday(parseInt(e.target.value))}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-gray-900"
            >
              {matchdays.map(day => (
                <option key={day} value={day}>Jornada {day}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-4">
          {matches.map((match, idx) => {
            const homeTeam = getTeam(match.homeTeamId);
            const awayTeam = getTeam(match.awayTeamId);
            return (
              <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <span className="font-semibold">{homeTeam?.name}</span>
                    {homeTeam?.logoUrl ? (
                      <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-8 h-8 rounded object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <div className="icon-shield text-sm text-gray-600"></div>
                      </div>
                    )}
                  </div>
                  <div className="px-6 font-bold text-xl">
                    {match.played ? `${match.homeScore} - ${match.awayScore}` : 'vs'}
                  </div>
                  <div className="flex items-center gap-3 flex-1">
                    {awayTeam?.logoUrl ? (
                      <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-8 h-8 rounded object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <div className="icon-shield text-sm text-gray-600"></div>
                      </div>
                    )}
                    <span className="font-semibold">{awayTeam?.name}</span>
                  </div>
                </div>
                {!match.played && match.scheduledDate && (
                  <div className="text-center text-sm text-gray-500 mt-2">
                    {new Date(match.scheduledDate).toLocaleString('es-MX', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
                {match.live && (
                  <div className="text-center mt-2">
                    <a 
                      href={`live-match.html?leagueId=${league.id}&matchId=${match.matchId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                    >
                      🔴 Ver Partido en Vivo
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  } catch (error) {
    console.error('MatchList error:', error);
    return null;
  }
}
