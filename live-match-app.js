function LiveMatchApp() {
  try {
    const [match, setMatch] = React.useState(null);
    const [homeTeam, setHomeTeam] = React.useState(null);
    const [awayTeam, setAwayTeam] = React.useState(null);

    React.useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const leagueId = params.get('leagueId');
      const matchId = params.get('matchId');
      
      if (!leagueId || !matchId) return;
      
      const updateMatch = () => {
        const updated = MatchSimulator.updateLiveMatch(leagueId, matchId);
        if (updated) {
          setMatch(updated);
          const data = DataManager.getData();
          setHomeTeam(data.teams.find(t => t.id === updated.homeTeamId));
          setAwayTeam(data.teams.find(t => t.id === updated.awayTeamId));
        }
      };
      
      updateMatch();
      const interval = setInterval(updateMatch, 1000);
      return () => clearInterval(interval);
    }, []);

    if (!match || !match.live) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="icon-circle-alert text-6xl mb-4"></div>
            <h1 className="text-2xl font-bold">Partido no disponible</h1>
          </div>
        </div>
      );
    }

    const liveData = match.liveData;
    const displayedEvents = liveData.events.filter(e => e.minute <= liveData.currentMinute).reverse();

    const getEventText = (event) => {
      if (event.type === 'goal') return '⚽ GOL!';
      if (event.type === 'yellow_card') return '🟨 Tarjeta Amarilla';
      if (event.type === 'red_card') return '🟥 Tarjeta Roja';
      if (event.type === 'corner') return '🚩 Tiro de Esquina';
      if (event.type === 'foul') return '❌ Falta';
      if (event.type === 'shot') return event.onTarget ? '🎯 Tiro a Portería' : '↗️ Tiro Fuera';
      return '';
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 bg-opacity-80 rounded-2xl shadow-2xl overflow-hidden mb-6">
            <div className="bg-red-600 px-6 py-3 flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="font-bold text-lg">PARTIDO EN VIVO</span>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="text-5xl font-bold mb-2">
                  {liveData.period === 'halftime' ? 'MEDIO TIEMPO' : `${liveData.currentMinute}'`}
                  {liveData.period === 'second_half' && liveData.currentMinute > 90 && (
                    <span className="text-3xl text-yellow-400"> +{liveData.currentMinute - 90}'</span>
                  )}
                </div>
                <div className="text-gray-400 text-sm">
                  {liveData.period === 'first_half' && 'Primer Tiempo'}
                  {liveData.period === 'halftime' && 'Descanso'}
                  {liveData.period === 'second_half' && 'Segundo Tiempo'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 items-center mb-8">
                <div className="text-center">
                  {homeTeam?.logoUrl ? (
                    <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-24 h-24 mx-auto mb-4 rounded-xl object-cover" />
                  ) : (
                    <div className="w-24 h-24 mx-auto mb-4 bg-white bg-opacity-10 rounded-xl flex items-center justify-center">
                      <div className="icon-shield text-4xl text-white"></div>
                    </div>
                  )}
                  <h2 className="text-xl font-bold">{homeTeam?.name}</h2>
                </div>

                <div className="text-center">
                  <div className="text-6xl font-bold text-[var(--primary-color)]">
                    {liveData.homeScore} - {liveData.awayScore}
                  </div>
                </div>

                <div className="text-center">
                  {awayTeam?.logoUrl ? (
                    <img src={awayTeam.logoUrl} alt={awayTeam.name} className="w-24 h-24 mx-auto mb-4 rounded-xl object-cover" />
                  ) : (
                    <div className="w-24 h-24 mx-auto mb-4 bg-white bg-opacity-10 rounded-xl flex items-center justify-center">
                      <div className="icon-shield text-4xl text-white"></div>
                    </div>
                  )}
                  <h2 className="text-xl font-bold">{awayTeam?.name}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 bg-opacity-80 rounded-2xl shadow-2xl p-6">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <div className="icon-activity text-xl text-[var(--primary-color)]"></div>
              Momentos Destacados
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {displayedEvents.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  Aún no hay eventos destacados
                </div>
              ) : (
                displayedEvents.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 bg-gray-700 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-colors">
                    <div className="font-bold text-[var(--primary-color)] text-lg min-w-[50px]">
                      {event.minute}'
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{getEventText(event)}</div>
                      <div className="text-sm text-gray-300">
                        {event.team === 'home' ? homeTeam?.name : awayTeam?.name}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('LiveMatchApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LiveMatchApp />);