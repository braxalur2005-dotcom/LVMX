function AdminControls() {
  try {
    const [data, setData] = React.useState(DataManager.getData());
    const [message, setMessage] = React.useState('');

    const handleSimulateMatchday = () => {
      if (data.currentMatchday > 19) {
        setMessage('Todas las jornadas han sido completadas');
        return;
      }
      
      const matches = Simulator.simulateMatchday(data.currentMatchday);
      setData(DataManager.getData());
      setMessage(`Jornada ${data.currentMatchday - 1} simulada: ${matches} partidos completados`);
    };

    const handleChangeSeason = (e) => {
      const newData = DataManager.getData();
      newData.season = e.target.value;
      DataManager.saveData(newData);
      setData(newData);
      setMessage('Temporada actualizada');
    };

    const handleChangeYear = (e) => {
      const newData = DataManager.getData();
      newData.year = parseInt(e.target.value);
      DataManager.saveData(newData);
      setData(newData);
      setMessage('Año actualizado');
    };

    const handleResetData = () => {
      if (confirm('¿Estás seguro de reiniciar todos los datos? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('ligasVirtualesMX');
        setData(DataManager.initializeData());
        setMessage('Sistema reiniciado correctamente');
      }
    };

    return (
      <div className="space-y-6" data-name="admin-controls" data-file="components/AdminControls.js">
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Configuración de Temporada</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Temporada</label>
              <select
                value={data.season}
                onChange={handleChangeSeason}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Clausura">Clausura</option>
                <option value="Apertura">Apertura</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Año</label>
              <input
                type="number"
                value={data.year}
                onChange={handleChangeYear}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Simulación de Jornadas</h2>
          <p className="text-gray-600 mb-4">Jornada actual: {data.currentMatchday} de 19</p>
          <button
            onClick={handleSimulateMatchday}
            disabled={data.currentMatchday > 19}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Simular Jornada {data.currentMatchday}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Gestión de Ligas</h2>
          <p className="text-gray-600 mb-4">Edita nombres y logos de las ligas</p>
          <a
            href="admin-leagues.html"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg font-semibold hover:bg-[var(--secondary-color)] transition-colors"
          >
            <div className="icon-trophy text-xl"></div>
            Gestionar Ligas
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Gestión de Equipos</h2>
          <p className="text-gray-600 mb-4">Edita nombres, escudos y títulos de los equipos</p>
          <a
            href="admin-teams.html"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg font-semibold hover:bg-[var(--secondary-color)] transition-colors"
          >
            <div className="icon-users text-xl"></div>
            Gestionar Equipos
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Gestión de Calendario</h2>
          <p className="text-gray-600 mb-4">Configura los enfrentamientos de la temporada</p>
          <a
            href="admin-schedule.html"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg font-semibold hover:bg-[var(--secondary-color)] transition-colors"
          >
            <div className="icon-calendar text-xl"></div>
            Gestionar Calendario
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Programación de Partidos</h2>
          <p className="text-gray-600 mb-4">Configura fechas, horarios e inicia partidos en vivo</p>
          <a
            href="admin-match-schedule.html"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg font-semibold hover:bg-[var(--secondary-color)] transition-colors"
          >
            <div className="icon-clock text-xl"></div>
            Programar Partidos
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Gestión de Liguillas</h2>
          <p className="text-gray-600 mb-4">Simula las fases eliminatorias de cada liga</p>
          <div className="grid md:grid-cols-3 gap-4">
            {data.leagues.map((league, idx) => (
              <a
                key={league.id}
                href={`admin-league.html?id=${league.id}`}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow text-center"
              >
                <div className="font-bold text-lg mb-2">{league.name}</div>
                <div className="text-sm text-gray-600">
                  {league.playoffs ? 'Liguilla Disponible' : 'Pendiente'}
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Zona de Peligro</h2>
          <button onClick={handleResetData} className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">
            Reiniciar Todo el Sistema
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AdminControls error:', error);
    return null;
  }
}