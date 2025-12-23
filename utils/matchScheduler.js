const MatchScheduler = {
  checkScheduledMatches() {
    const data = DataManager.getData();
    const now = new Date();
    
    data.leagues.forEach(league => {
      league.matches.forEach(match => {
        if (match.scheduledDate && !match.played && !match.live) {
          const scheduledTime = new Date(match.scheduledDate);
          if (now >= scheduledTime) {
            MatchSimulator.startLiveMatch(league.id, match.matchId);
          }
        }
      });
    });
  },

  startScheduler() {
    setInterval(() => {
      this.checkScheduledMatches();
    }, 30000);
    
    this.checkScheduledMatches();
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    MatchScheduler.startScheduler();
  });
}