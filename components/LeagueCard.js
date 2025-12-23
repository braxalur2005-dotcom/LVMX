function LeagueCard({ league, index }) {
  try {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500'
    ];

    return (
      <a
        href={`league.html?id=${league.id}`}
        className="league-card"
        data-name="league-card"
        data-file="components/LeagueCard.js"
      >
        <div className={`w-16 h-16 ${colors[index]} rounded-xl flex items-center justify-center mb-4`}>
          <div className="icon-trophy text-3xl text-white"></div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{league.name}</h3>
        <p className="text-gray-600 mb-4">{league.teams.length} equipos</p>
        <div className="flex items-center text-[var(--primary-color)] font-semibold">
          Ver Liga
          <div className="icon-arrow-right ml-2"></div>
        </div>
      </a>
    );
  } catch (error) {
    console.error('LeagueCard error:', error);
    return null;
  }
}