function AdminLeaguesApp() {
  try {
    const [data, setData] = React.useState(DataManager.getData());
    const [editingLeague, setEditingLeague] = React.useState(null);
    const [message, setMessage] = React.useState('');

    const handleSaveLeague = (updatedLeague) => {
      const newData = DataManager.getData();
      const leagueIndex = newData.leagues.findIndex(l => l.id === updatedLeague.id);
      if (leagueIndex !== -1) {
        newData.leagues[leagueIndex] = updatedLeague;
        DataManager.saveData(newData);
        setData(newData);
        setEditingLeague(null);
        setMessage('Liga actualizada correctamente');
        setTimeout(() => setMessage(''), 3000);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Gestión de Ligas</h1>
              <p className="text-gray-600 mt-2">Edita nombres y logos de las ligas</p>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.leagues.map(league => (
              <div key={league.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  {league.logoUrl ? (
                    <img src={league.logoUrl} alt={league.name} className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-[var(--secondary-color)] rounded-lg flex items-center justify-center">
                      <div className="icon-trophy text-2xl text-white"></div>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">{league.name}</h3>
                    <p className="text-sm text-gray-600">Nivel {league.level}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingLeague(league)}
                  className="w-full px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)]"
                >
                  Editar Liga
                </button>
              </div>
            ))}
          </div>
        </main>

        {editingLeague && (
          <LeagueEditModal
            league={editingLeague}
            onSave={handleSaveLeague}
            onClose={() => setEditingLeague(null)}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error('AdminLeaguesApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminLeaguesApp />);