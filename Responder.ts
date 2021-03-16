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

export const baseURLforRequests = 'http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard/'

export async function getScoreResponse(gameId: string) {
        const request = baseURLforRequests.concat(gameId);
        try {
                let response = await fetch(request);
                let data = await response.json();
                let homeTeam = data.competitions[0].competitors[0].team.displayName;
                let awayTeam = data.competitions[0].competitors[1].team.displayName;
                let homeScore = data.competitions[0].competitors[0].score;
                let awayScore = data.competitions[0].competitors[1].score;
                if (data.competitions[0].status.type.name == "STATUS_FINAL") {
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
