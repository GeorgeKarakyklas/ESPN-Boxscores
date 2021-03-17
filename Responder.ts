import fetch from 'node-fetch';

export class Boxscore {
    homeTeam: string;
    awayTeam: string;
    homeScore: string;
    awayScore: string;

    constructor(homeTeam: string, awayTeam: string, homeScore: string, awayScore: string) {
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.homeScore = homeScore;
        this.awayScore = awayScore;
    }

    public formatBoxscore() {
        return `${this.awayTeam} ${this.awayScore} | ${this.homeScore} ${this.homeTeam}`;
    }
}

export const validLeagueOptions = ["nba", "wnba", "nba-g-league", "mens-college-basketball", "womens-college-basketball"]

export async function getScoreResponse(league: string, date: string, teams: string[]) {
    const request = `http://site.api.espn.com/apis/site/v2/sports/basketball/${league}/scoreboard?lang=en&region=us&limit=1000&dates=${date}`;
    var ourEvent;
    try {
        let response = await fetch(request);
        let data = await response.json();
        for (var event of data.events){
            if (teams.indexOf(event.competitions[0].competitors[0].team.displayName) !== -1 && teams.indexOf(event.competitions[0].competitors[1].team.displayName) !== -1) {
                ourEvent = event;
            }
        }
        if (ourEvent.status.type.completed) {
            let homeTeam = ourEvent.competitions[0].competitors[0].team.displayName;
            let awayTeam = ourEvent.competitions[0].competitors[1].team.displayName;
            let homeScore = ourEvent.competitions[0].competitors[0].score;
            let awayScore = ourEvent.competitions[0].competitors[1].score;
            let result = new Boxscore(homeTeam, awayTeam, homeScore, awayScore);
            console.log(result.formatBoxscore());
            return result.formatBoxscore();
        } else {
            console.log("Game has not finished!");
            return [0];
        }
    } catch (e) {
        console.log(Error);
        return [0];
    }
}

// //Examples
// getScoreResponse("wnba", "20201006", ["Las Vegas Aces", "Seattle Storm"])
// getScoreResponse("mens-college-basketball", "20210312", ["UConn Huskies", "Creighton Bluejays"])
// getScoreResponse("nba", "20210316", ["Los Angeles Lakers", "Minnesota Timberwolves"])