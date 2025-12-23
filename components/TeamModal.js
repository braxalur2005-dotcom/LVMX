function TeamModal({ team, onClose }) {
  try {
    const data = DataManager.getData();
    const league = data.leagues.find(l => l.id === team.leagueId);
    
    const teamMatches = league.matches.filter(m => 
      (m.homeTeamId === team.id || m.awayTeamId === team.id) && m.played
    ).slice(-5);

    const getTeamName = (teamId) => {
      const t = data.teams.find(t => t.id === teamId);
      return t ? t.name : 'Desconocido';
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
        data-name="team-modal"
        data-file="components/TeamModal.js"
      >
        <div 
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b flex justify-between items-center">
            <div className="flex items-center gap-4">
              {team.logoUrl ? (
                <img src={team.logoUrl} alt={team.name} className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <div className="w-16 h-16 bg-[var(--secondary-color)] rounded-xl flex items-center justify-center">
                  <div className="icon-shield text-3xl text-white"></div>
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">{team.name}</h2>
                <p className="text-gray-600">{team.titles} títulos</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <div className="icon-x text-2xl"></div>
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[var(--primary-color)]">{team.played}</div>
                <div className="text-sm text-gray-600">Partidos</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{team.won}</div>
                <div className="text-sm text-gray-600">Ganados</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{team.drawn}</div>
                <div className="text-sm text-gray-600">Empates</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{team.lost}</div>
                <div className="text-sm text-gray-600">Perdidos</div>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-3">Últimos Resultados</h3>
            <div className="space-y-2">
              {teamMatches.map((match, idx) => (
                <div key={idx} className="border rounded-lg p-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>{getTeamName(match.homeTeamId)}</span>
                    <span className="font-bold">{match.homeScore} - {match.awayScore}</span>
                    <span>{getTeamName(match.awayTeamId)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('TeamModal error:', error);
    return null;
  }
}