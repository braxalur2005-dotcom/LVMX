const Simulator = {
  simulateScore() {
    const weights = [30, 25, 20, 12, 8, 3, 1, 1];
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (let score = 0; score < weights.length; score++) {
      cumulative += weights[score];
      if (random <= cumulative) return score;
    }
    return 0;
  },

  simulateMatchday(matchday) {
    const data = DataManager.getData();
    let simulatedMatches = 0;

    data.leagues.forEach(league => {
      const matches = league.matches.filter(m => m.matchday === matchday && !m.played);
      
      matches.forEach(match => {
        match.homeScore = this.simulateScore();
        match.awayScore = this.simulateScore();
        match.played = true;
        simulatedMatches++;

        const homeTeam = data.teams.find(t => t.id === match.homeTeamId);
        const awayTeam = data.teams.find(t => t.id === match.awayTeamId);

        homeTeam.played++;
        awayTeam.played++;
        homeTeam.goalsFor += match.homeScore;
        homeTeam.goalsAgainst += match.awayScore;
        awayTeam.goalsFor += match.awayScore;
        awayTeam.goalsAgainst += match.homeScore;

        if (match.homeScore > match.awayScore) {
          homeTeam.won++;
          homeTeam.points += 3;
          awayTeam.lost++;
        } else if (match.homeScore < match.awayScore) {
          awayTeam.won++;
          awayTeam.points += 3;
          homeTeam.lost++;
        } else {
          homeTeam.drawn++;
          awayTeam.drawn++;
          homeTeam.points++;
          awayTeam.points++;
        }
      });

      this.updateStandings(league, data.teams);
      
      if (matchday === 19) {
        this.generatePlayoffs(league, data.teams);
        this.handlePromotionRelegation(data, league);
      }
    });

    data.currentMatchday = matchday + 1;
    DataManager.saveData(data);
    return simulatedMatches;
  },

  updateStandings(league, allTeams) {
    const teams = league.teams.map(id => allTeams.find(t => t.id === id));
    teams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.goalsFor - a.goalsAgainst;
      const diffB = b.goalsFor - b.goalsAgainst;
      if (diffB !== diffA) return diffB - diffA;
      return b.goalsFor - a.goalsFor;
    });
    league.standings = teams.map(t => t.id);
  },

  generatePlayoffs(league, allTeams) {
    const top8 = league.standings.slice(0, 8);
    league.playoffs = {
      quarterfinals: [
        { home: top8[0], away: top8[7], homeScore: null, awayScore: null, played: false },
        { home: top8[1], away: top8[6], homeScore: null, awayScore: null, played: false },
        { home: top8[2], away: top8[5], homeScore: null, awayScore: null, played: false },
        { home: top8[3], away: top8[4], homeScore: null, awayScore: null, played: false }
      ],
      semifinals: [],
      final: null,
      champion: null
    };
  },

  simulatePlayoffRound(leagueId, round) {
    const data = DataManager.getData();
    const league = data.leagues.find(l => l.id === leagueId);
    
    if (!league.playoffs) {
      return { success: false, message: 'La liguilla aún no ha sido generada' };
    }

    if (round === 'quarterfinals') {
      league.playoffs.quarterfinals.forEach(match => {
        if (!match.played) {
          match.homeScore = this.simulateScore();
          match.awayScore = this.simulateScore();
          match.played = true;
        }
      });
      
      const allPlayed = league.playoffs.quarterfinals.every(m => m.played);
      if (allPlayed) {
        league.playoffs.semifinals = [
          { 
            home: this.getWinner(league.playoffs.quarterfinals[0]),
            away: this.getWinner(league.playoffs.quarterfinals[1]),
            homeScore: null,
            awayScore: null,
            played: false
          },
          { 
            home: this.getWinner(league.playoffs.quarterfinals[2]),
            away: this.getWinner(league.playoffs.quarterfinals[3]),
            homeScore: null,
            awayScore: null,
            played: false
          }
        ];
      }
      
      DataManager.saveData(data);
      return { success: true, message: 'Cuartos de final simulados' };
    }

    if (round === 'semifinals') {
      if (league.playoffs.semifinals.length === 0) {
        return { success: false, message: 'Debes simular los cuartos de final primero' };
      }

      league.playoffs.semifinals.forEach(match => {
        if (!match.played) {
          match.homeScore = this.simulateScore();
          match.awayScore = this.simulateScore();
          match.played = true;
        }
      });

      const allPlayed = league.playoffs.semifinals.every(m => m.played);
      if (allPlayed) {
        league.playoffs.final = {
          home: this.getWinner(league.playoffs.semifinals[0]),
          away: this.getWinner(league.playoffs.semifinals[1]),
          homeScore: null,
          awayScore: null,
          played: false
        };
      }

      DataManager.saveData(data);
      return { success: true, message: 'Semifinales simuladas' };
    }

    if (round === 'final') {
      if (!league.playoffs.final) {
        return { success: false, message: 'Debes simular las semifinales primero' };
      }

      if (!league.playoffs.final.played) {
        league.playoffs.final.homeScore = this.simulateScore();
        league.playoffs.final.awayScore = this.simulateScore();
        league.playoffs.final.played = true;
        league.playoffs.champion = this.getWinner(league.playoffs.final);
        
        const champion = data.teams.find(t => t.id === league.playoffs.champion);
        if (champion) {
          champion.titles++;
        }
      }

      DataManager.saveData(data);
      return { success: true, message: 'Final simulada - ¡Campeón definido!' };
    }

    return { success: false, message: 'Ronda no válida' };
  },

  getWinner(match) {
    if (match.homeScore > match.awayScore) {
      return match.home;
    } else if (match.awayScore > match.homeScore) {
      return match.away;
    } else {
      return Math.random() > 0.5 ? match.home : match.away;
    }
  },

  handlePromotionRelegation(data, league) {
    if (league.level === 6) return;
    
    const relegated = league.standings[19];
    const playoffTeam = league.standings[18];
    
    console.log(`Liga ${league.level}: Equipo relegado - ${relegated}, Playoff - ${playoffTeam}`);
  }
};