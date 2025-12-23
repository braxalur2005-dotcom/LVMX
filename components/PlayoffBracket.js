function PlayoffBracket({ league, isAdmin = false }) {
  try {
    const [data, setData] = React.useState(DataManager.getData());
    const [message, setMessage] = React.useState('');
    
    if (!league.playoffs) {
      return (
        <div className="text-center py-12" data-name="playoff-bracket" data-file="components/PlayoffBracket.js">
          <div className="icon-circle-alert text-6xl text-gray-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Liguilla No Disponible</h2>
          <p className="text-gray-600">La liguilla se generará automáticamente después de completar las 19 jornadas</p>
        </div>
      );
    }

    const getTeamName = (teamId) => {
      const team = data.teams.find(t => t.id === teamId);
      return team ? team.name : 'TBD';
    };

    const handleSimulate = (round) => {
      const result = Simulator.simulatePlayoffRound(league.id, round);
      setMessage(result.message);
      setData(DataManager.getData());
      setTimeout(() => setMessage(''), 3000);
    };

    const currentLeague = data.leagues.find(l => l.id === league.id);

    return (
      <div data-name="playoff-bracket" data-file="components/PlayoffBracket.js">
        <h2 className="text-2xl font-bold mb-6">Liguilla - Bracket de Eliminación</h2>
        
        {message && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Cuartos de Final</h3>
              {isAdmin && (
                <button
                  onClick={() => handleSimulate('quarterfinals')}
                  disabled={currentLeague.playoffs.quarterfinals.every(m => m.played)}
                  className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Simular Cuartos
                </button>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {currentLeague.playoffs.quarterfinals.map((match, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                  <div className="text-sm text-gray-600 mb-2">Partido {idx + 1}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{getTeamName(match.home)}</span>
                      {match.played && <span className="font-bold text-lg">{match.homeScore}</span>}
                    </div>
                    {!match.played && <div className="text-center text-gray-500">vs</div>}
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{getTeamName(match.away)}</span>
                      {match.played && <span className="font-bold text-lg">{match.awayScore}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {currentLeague.playoffs.semifinals.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Semifinales</h3>
                {isAdmin && (
                  <button
                    onClick={() => handleSimulate('semifinals')}
                    disabled={currentLeague.playoffs.semifinals.every(m => m.played)}
                    className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Simular Semifinales
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {currentLeague.playoffs.semifinals.map((match, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-blue-50">
                    <div className="text-sm text-gray-600 mb-2">Semifinal {idx + 1}</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{getTeamName(match.home)}</span>
                        {match.played && <span className="font-bold text-lg">{match.homeScore}</span>}
                      </div>
                      {!match.played && <div className="text-center text-gray-500">vs</div>}
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{getTeamName(match.away)}</span>
                        {match.played && <span className="font-bold text-lg">{match.awayScore}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentLeague.playoffs.final && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Final</h3>
                {isAdmin && (
                  <button
                    onClick={() => handleSimulate('final')}
                    disabled={currentLeague.playoffs.final.played}
                    className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Simular Final
                  </button>
                )}
              </div>
              <div className="max-w-md mx-auto border-4 border-yellow-400 rounded-lg p-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
                <div className="text-center mb-4">
                  <div className="icon-trophy text-5xl text-yellow-600 mx-auto mb-2"></div>
                  <div className="text-sm text-gray-600">Gran Final</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{getTeamName(currentLeague.playoffs.final.home)}</span>
                    {currentLeague.playoffs.final.played && (
                      <span className="font-bold text-2xl text-[var(--primary-color)]">{currentLeague.playoffs.final.homeScore}</span>
                    )}
                  </div>
                  {!currentLeague.playoffs.final.played && <div className="text-center text-gray-500 font-semibold">vs</div>}
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{getTeamName(currentLeague.playoffs.final.away)}</span>
                    {currentLeague.playoffs.final.played && (
                      <span className="font-bold text-2xl text-[var(--primary-color)]">{currentLeague.playoffs.final.awayScore}</span>
                    )}
                  </div>
                </div>
                {currentLeague.playoffs.champion && (
                  <div className="mt-6 text-center p-4 bg-yellow-200 rounded-lg">
                    <div className="text-sm text-gray-700 mb-1">🏆 CAMPEÓN 🏆</div>
                    <div className="font-bold text-xl text-gray-900">{getTeamName(currentLeague.playoffs.champion)}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('PlayoffBracket error:', error);
    return null;
  }
}
