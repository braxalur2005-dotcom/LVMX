function AdminTeamsApp() {
  try {
    const [data, setData] = React.useState(DataManager.getData());
    const [selectedLeague, setSelectedLeague] = React.useState('all');
    const [editingTeam, setEditingTeam] = React.useState(null);
    const [message, setMessage] = React.useState('');

    const filteredTeams = selectedLeague === 'all' 
      ? data.teams 
      : data.teams.filter(t => t.leagueId === selectedLeague);

    const handleSaveTeam = (updatedTeam) => {
      const newData = DataManager.getData();
      const teamIndex = newData.teams.findIndex(t => t.id === updatedTeam.id);
      if (teamIndex !== -1) {
        newData.teams[teamIndex] = updatedTeam;
        DataManager.saveData(newData);
        setData(newData);
        setEditingTeam(null);
        setMessage('Equipo actualizado correctamente');
        setTimeout(() => setMessage(''), 3000);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Gestión de Equipos</h1>
              <p className="text-gray-600 mt-2">Edita información de los equipos</p>
            </div>
            <a href="admin.html" className="text-[var(--primary-color)] hover:underline">
              ← Volver al Panel
            </a>
          </div>

          {message && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <label className="block text-gray-700 mb-2 font-semibold">Filtrar por Liga</label>
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            >
              <option value="all">Todas las Ligas</option>
              {data.leagues.map(league => (
                <option key={league.id} value={league.id}>{league.name}</option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTeams.map(team => (
              <div key={team.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-3 mb-3">
                  {team.logoUrl ? (
                    <img src={team.logoUrl} alt={team.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-[var(--secondary-color)] rounded-lg flex items-center justify-center">
                      <div className="icon-shield text-xl text-white"></div>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-600">{team.titles} títulos</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingTeam(team)}
                  className="w-full px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-colors"
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        </main>

        {editingTeam && (
          <TeamEditModal
            team={editingTeam}
            onSave={handleSaveTeam}
            onClose={() => setEditingTeam(null)}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error('AdminTeamsApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminTeamsApp />);