function TeamList({ league, onTeamClick }) {
  try {
    const data = DataManager.getData();
    const teams = league.teams.map(id => data.teams.find(t => t.id === id));

    return (
      <div data-name="team-list" data-file="components/TeamList.js">
        <h2 className="text-2xl font-bold mb-6">Equipos de la Liga</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teams.map(team => (
            <div
              key={team.id}
              onClick={() => onTeamClick(team)}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white"
            >
              <div className="flex items-center gap-3 mb-3">
                {team.logoUrl ? (
                  <img src={team.logoUrl} alt={team.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-[var(--secondary-color)] rounded-lg flex items-center justify-center">
                    <div className="icon-shield text-xl text-white"></div>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900">{team.name}</h3>
                  <p className="text-sm text-gray-600">{team.titles} títulos</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>PJ: {team.played} | PTS: {team.points}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('TeamList error:', error);
    return null;
  }
}