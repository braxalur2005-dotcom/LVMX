function StandingsTable({ league }) {
  try {
    const data = DataManager.getData();
    const teams = league.standings.map(id => data.teams.find(t => t.id === id));

    return (
      <div data-name="standings-table" data-file="components/StandingsTable.js">
        <h2 className="text-2xl font-bold mb-6">Tabla de Posiciones</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Equipo</th>
                <th className="px-4 py-3 text-center">PJ</th>
                <th className="px-4 py-3 text-center">G</th>
                <th className="px-4 py-3 text-center">E</th>
                <th className="px-4 py-3 text-center">P</th>
                <th className="px-4 py-3 text-center">GF</th>
                <th className="px-4 py-3 text-center">GC</th>
                <th className="px-4 py-3 text-center">DIF</th>
                <th className="px-4 py-3 text-center">PTS</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, idx) => (
                <tr key={team.id} className={`border-b hover:bg-gray-50 ${idx < 8 ? 'bg-green-50' : idx === 18 ? 'bg-yellow-50' : idx === 19 ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3 font-bold">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {team.logoUrl ? (
                        <img src={team.logoUrl} alt={team.name} className="w-6 h-6 rounded object-cover" />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                          <div className="icon-shield text-xs text-gray-600"></div>
                        </div>
                      )}
                      <span>{team.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{team.played}</td>
                  <td className="px-4 py-3 text-center">{team.won}</td>
                  <td className="px-4 py-3 text-center">{team.drawn}</td>
                  <td className="px-4 py-3 text-center">{team.lost}</td>
                  <td className="px-4 py-3 text-center">{team.goalsFor}</td>
                  <td className="px-4 py-3 text-center">{team.goalsAgainst}</td>
                  <td className="px-4 py-3 text-center">{team.goalsFor - team.goalsAgainst}</td>
                  <td className="px-4 py-3 text-center font-bold">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border"></div>
            <span>Clasificados a Liguilla</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-50 border"></div>
            <span>Playoff de Descenso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border"></div>
            <span>Desciende</span>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('StandingsTable error:', error);
    return null;
  }
}
