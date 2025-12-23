const DataManager = {
  initializeData() {
    const existingData = localStorage.getItem('ligasVirtualesMX');
    if (existingData) {
      return JSON.parse(existingData);
    }

    const data = {
      year: 2025,
      season: 'Clausura',
      currentMatchday: 1,
      leagues: [],
      teams: []
    };

    const leagueNames = [
      'Liga MX',
      'Liga Expansión MX',
      'Liga Premier MX',
      'Liga TDP MX',
      'Liga Balompié MX',
      'Liga ANBMX'
    ];

    for (let i = 1; i <= 6; i++) {
      const league = {
        id: `league${i}`,
        name: leagueNames[i - 1],
        level: i,
        logoUrl: '',
        teams: [],
        matches: [],
        standings: [],
        playoffs: null
      };

      for (let j = 1; j <= 20; j++) {
        const teamId = `team_${i}_${j}`;
        const team = {
          id: teamId,
          name: `Equipo ${i}.${j}`,
          leagueId: league.id,
          titles: Math.floor(Math.random() * 5),
          logoUrl: '',
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0
        };
        league.teams.push(teamId);
        data.teams.push(team);
      }

      this.generateMatchSchedule(league, data.teams);
      data.leagues.push(league);
    }

    localStorage.setItem('ligasVirtualesMX', JSON.stringify(data));
    return data;
  },

  generateMatchSchedule(league, allTeams) {
    const teams = league.teams;
    league.matches = [];
    
    for (let matchday = 1; matchday <= 19; matchday++) {
      const matches = [];
      const shuffled = [...teams].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < shuffled.length; i += 2) {
        matches.push({
          matchId: `${league.id}_md${matchday}_m${i/2 + 1}`,
          matchday,
          homeTeamId: shuffled[i],
          awayTeamId: shuffled[i + 1],
          played: false,
          live: false,
          homeScore: null,
          awayScore: null,
          scheduledDate: null,
          events: []
        });
      }
      league.matches.push(...matches);
    }
  },

  getData() {
    return JSON.parse(localStorage.getItem('ligasVirtualesMX'));
  },

  saveData(data) {
    localStorage.setItem('ligasVirtualesMX', JSON.stringify(data));
  },

  getCurrentSeason() {
    const data = this.getData();
    return `${data.season} ${data.year}`;
  }
};