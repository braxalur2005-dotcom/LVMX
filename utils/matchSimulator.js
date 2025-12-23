const MatchSimulator = {
  generateMatchEvents(homeTeam, awayTeam) {
    const events = [];
    let homeScore = 0;
    let awayScore = 0;
    
    for (let minute = 1; minute <= 90; minute++) {
      const eventChance = Math.random() * 100;
      
      if (eventChance < 3) {
        const isHome = Math.random() > 0.5;
        if (isHome) homeScore++;
        else awayScore++;
        events.push({
          minute,
          type: 'goal',
          team: isHome ? 'home' : 'away',
          teamId: isHome ? homeTeam : awayTeam
        });
      } else if (eventChance < 8) {
        events.push({
          minute,
          type: 'yellow_card',
          team: Math.random() > 0.5 ? 'home' : 'away'
        });
      } else if (eventChance < 9) {
        events.push({
          minute,
          type: 'red_card',
          team: Math.random() > 0.5 ? 'home' : 'away'
        });
      } else if (eventChance < 15) {
        events.push({
          minute,
          type: 'corner',
          team: Math.random() > 0.5 ? 'home' : 'away'
        });
      } else if (eventChance < 25) {
        events.push({
          minute,
          type: 'foul',
          team: Math.random() > 0.5 ? 'home' : 'away'
        });
      } else if (eventChance < 30) {
        events.push({
          minute,
          type: 'shot',
          team: Math.random() > 0.5 ? 'home' : 'away',
          onTarget: Math.random() > 0.5
        });
      }
    }
    
    const yellowCards = events.filter(e => e.type === 'yellow_card').length;
    const redCards = events.filter(e => e.type === 'red_card').length;
    const fouls = events.filter(e => e.type === 'foul').length;
    
    let injuryTime = 0;
    if (yellowCards > 3) injuryTime += 1;
    if (redCards > 0) injuryTime += redCards * 2;
    if (fouls > 10) injuryTime += 2;
    
    return { events, homeScore, awayScore, injuryTime };
  },

  startLiveMatch(leagueId, matchId) {
    const data = DataManager.getData();
    const league = data.leagues.find(l => l.id === leagueId);
    const match = league.matches.find(m => m.matchId === matchId);
    
    if (!match || match.played) return null;
    
    const result = this.generateMatchEvents(match.homeTeamId, match.awayTeamId);
    
    match.live = true;
    match.liveData = {
      currentMinute: 0,
      period: 'first_half',
      events: result.events,
      homeScore: 0,
      awayScore: 0,
      finalHomeScore: result.homeScore,
      finalAwayScore: result.awayScore,
      injuryTime: result.injuryTime,
      startTime: Date.now()
    };
    
    DataManager.saveData(data);
    return match;
  },

  updateLiveMatch(leagueId, matchId) {
    const data = DataManager.getData();
    const league = data.leagues.find(l => l.id === leagueId);
    const match = league.matches.find(m => m.matchId === matchId);
    
    if (!match || !match.live) return null;
    
    const elapsed = (Date.now() - match.liveData.startTime) / 1000;
    let currentMinute = Math.floor(elapsed / 1.33);
    
    if (currentMinute >= 45 && currentMinute < 48 && match.liveData.period === 'first_half') {
      match.liveData.period = 'halftime';
      match.liveData.currentMinute = 45;
    } else if (currentMinute >= 48 && match.liveData.period === 'halftime') {
      match.liveData.period = 'second_half';
      match.liveData.currentMinute = 45;
    } else if (currentMinute >= 93 + match.liveData.injuryTime) {
      this.endMatch(leagueId, matchId);
      return match;
    } else if (match.liveData.period === 'second_half') {
      match.liveData.currentMinute = Math.min(45 + Math.floor((elapsed - 63.84) / 1.33), 90 + match.liveData.injuryTime);
    } else if (match.liveData.period === 'first_half') {
      match.liveData.currentMinute = currentMinute;
    }
    
    const eventsUpToNow = match.liveData.events.filter(e => e.minute <= match.liveData.currentMinute);
    const goals = eventsUpToNow.filter(e => e.type === 'goal');
    match.liveData.homeScore = goals.filter(e => e.team === 'home').length;
    match.liveData.awayScore = goals.filter(e => e.team === 'away').length;
    
    DataManager.saveData(data);
    return match;
  },

  endMatch(leagueId, matchId) {
    const data = DataManager.getData();
    const league = data.leagues.find(l => l.id === leagueId);
    const match = league.matches.find(m => m.matchId === matchId);
    
    if (!match) return;
    
    match.live = false;
    match.played = true;
    match.homeScore = match.liveData.finalHomeScore;
    match.awayScore = match.liveData.finalAwayScore;
    
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
    
    Simulator.updateStandings(league, data.teams);
    DataManager.saveData(data);
  }
};