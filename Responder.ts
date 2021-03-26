const fetch = require("node-fetch");

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
        return [`${this.awayTeam} ${this.awayScore} | ${this.homeScore} ${this.homeTeam}`];
    }
}

export const validLeagueOptions = ["nba", "wnba", "nba-g-league", "mens-college-basketball", "womens-college-basketball"];

export const validTeamStats = ["rebounds", "avgRebounds", "assists", "fieldGoalsAttempted", "fieldGoaldsMade", "fieldGoalPct", "freeThrowPct", "freeThrowsAttempted", "freeThrowsMade", "threePointPct", "threePointFieldGoalsAttempted", "threePointFieldGoalsMade", "avgPoints", "avgAssists", "threePointFieldGoalPct"]

export const validStatLeaders = ["points leaders", "rebounds leaders", "assists leaders"]

export async function getResponse(query: string, params?: string[]) {
    var ourEvent;
    var ourStat;
    var ourLeader;
    if (!params) {
        console.log(`${query}: ${["Parameters were not provided."]}`);
        return ["Parameters were not provided."];
    } else {
        if (validLeagueOptions.indexOf(params[0]) > -1){
            const dateFormat = new RegExp('[1-9][0-9][0-9][0-9](0[1-9]|1[0-2])([0-2][0-9]|3[0-1])');
            if (dateFormat.test(params[1]) && params[1].length == 8){
                const request = `http://site.api.espn.com/apis/site/v2/sports/basketball/${params[0]}/scoreboard?lang=en&region=us&limit=1000&dates=${params[1]}`;
                if (!params[2] && !params[3]) {
                    console.log(`${query}: ${["Insufficient number of teams provided."]}`);
                    return ["Insufficient number of teams provided."];
                } else {
                    try {
                        let response = await fetch(request);
                        let data = await response.json();
                        for (var event of data.events){
                            if (params[2] == event.competitions[0].competitors[1].team.displayName && params[3] == event.competitions[0].competitors[0].team.displayName) {
                                ourEvent = event;
                            }
                        }
                        if (!ourEvent){
                            console.log(`${query}: ${["Event was not found."]}`);
                            return ["Event was not found."]
                        } else {
                            let homeTeam = ourEvent.competitions[0].competitors[0].team.displayName;
                            let awayTeam = ourEvent.competitions[0].competitors[1].team.displayName;
                            if (ourEvent.status.type.completed) {
                                if (!params[4]){
                                    let homeScore = ourEvent.competitions[0].competitors[0].score;
                                    let awayScore = ourEvent.competitions[0].competitors[1].score;
                                    let result = new Boxscore(homeTeam, awayTeam, homeScore, awayScore);
                                    console.log(`${query}: ${result.formatBoxscore()}`);
                                    return result.formatBoxscore();
                                } else {
                                    if (validTeamStats.indexOf(params[4]) > -1){
                                        for (var stat of ourEvent.competitions[0].competitors[0].statistics){
                                            if (stat.name == params[4]){
                                                ourStat = stat;
                                            }
                                        }
                                        let homeStat = ourStat.displayValue;
                                        let unit = ourStat.abbreviation
                                        for (var stat of ourEvent.competitions[0].competitors[1].statistics){
                                            if (stat.name == params[4]){
                                                ourStat = stat;
                                            }
                                        }
                                        let awayStat = ourStat.displayValue;
                                        let result = new Boxscore(homeTeam, awayTeam, `${homeStat} ${unit}`, `${awayStat} ${unit}`);
                                        console.log(`${query}: ${result.formatBoxscore()}`);
                                        return result.formatBoxscore();
                                    } else if (validStatLeaders.indexOf(params[4]) > -1){
                                        let leaderStat = params[4].split(" ")[0];
                                        for (var leader of ourEvent.competitions[0].competitors[0].leaders){
                                            if (leader.name == leaderStat){
                                                ourLeader = leader;
                                            }
                                        }
                                        let homePlayerStat = ourLeader.leaders[0].value;
                                        let homePlayer = ourLeader.leaders[0].athlete.displayName;
                                        let unit = ourLeader.displayName;
                                        for (var leader of ourEvent.competitions[0].competitors[1].leaders){
                                            if (leader.name == leaderStat){
                                                ourLeader = leader;
                                            }
                                        }
                                        let awayPlayerStat = ourLeader.leaders[0].value;
                                        let awayPlayer = ourLeader.leaders[0].athlete.displayName;
                                        let result = new Boxscore(`${homePlayer}(${homeTeam})`, `${awayPlayer}(${awayTeam})`, `${homePlayerStat.toString()} ${unit}`, `${awayPlayerStat.toString()} ${unit}`);
                                        console.log(`${query}: ${result.formatBoxscore()}`);
                                        return result.formatBoxscore();
                                    } else {
                                        console.log(`${query}: ${["Invalid statistics arguement."]}`);
                                        return ["Invalid statistics arguement."];
                                    }
                                }
                            } else {
                                console.log(`${query}: ${["Game still in progress."]}`);
                                return ["Game still in progress."];
                            }
                        }
                    } catch (e) {
                        console.log(`${query}: ${["Error while fetching data."]}`);
                        return ["Error while fetching data."];
                    }
                }
            } else {
                console.log(`${query}: ${["Invalid date format."]}`);
                return ["Invalid date format."];
            }
        } else {
            console.log(`${query}: ${["Invalid league arguement."]}`);
            return ["Invalid league arguement."];
        }
    }
} 


// //Examples
// getResponse("Test 1")
// getResponse("Test 2", ['jnba'])
// getResponse("Test 3", ['wnba', '202011265'])
// getResponse("Test 4", ['wnba', '20201326'])
// getResponse("Test 5", ['wnba', '20201006'])
// getResponse("Test 6", ['wnba', '20201026', "Las Vegas Aces", "Seattle Storm"])
// getResponse("Test 7", ["wnba", "20201006", "Las Vegas Aces", "Seattle Storm"])
// getResponse("Test 8", ["nba", "20210325", "Portland Trail Blazers", "Miami Heat"])
// getResponse("Test 9", ["wnba", "20201006", "Las Vegas Aces", "Seattle Storm", "statistic"])
// getResponse("Test 10", ["wnba", "20201006", "Las Vegas Aces", "Seattle Storm", "fieldGoalPct"])
// getResponse("Test 11", ["wnba", "20201006", "Las Vegas Aces", "Seattle Storm", "assists leaders"])
// getResponse("Test 12", ["mens-college-basketball", "20210312", "UConn Huskies", "Creighton Bluejays"])
// getResponse("Test 13", ["nba", "20210316", "Minnesota Timberwolves", "Los Angeles Lakers"])
// getResponse("Test 14", ["nba", "20210324", "Atlanta Hawks", "Sacramento Kings"])
