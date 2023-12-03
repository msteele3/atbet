
const StatsAPI = class {
    baseURL = "https://mkscv9urgj.execute-api.us-east-2.amazonaws.com/api";
    teamsEndpoint = "/teams";
    statsEndpoint = "/stats";
    apiKey = "jrdbGBoXnZ2Bed4Xk7xEk94Abv9zUV3d8l7p9wW8";

    constructor() {};

    getTeams = async () => {
        let teams = [];
        try {
            const payload = {
                method: "GET",
                headers: {
                    'x-api-key': this.apiKey,
                }
            };
            const resp = await fetch(this.baseURL + this.teamsEndpoint, payload);
            if (resp.ok) {
                const respBody = await resp.json();
                console.log(respBody);
                teams = respBody.teams;
            } else {
                console.log("/teams request failed: ", resp);
            }
        } catch (e) {
            console.error("error occurred during getTeams: " + e.message, e, e.stack);
        }
        return teams;
    };

    getStats = async (team1, team2) => {
        let stats = {};
        try {
            const payload = {
                method: "GET",
                headers: {
                    'x-api-key': this.apiKey,
                }
            };
            const team1_encoded = encodeURIComponent(team1)
            const team2_encoded = encodeURIComponent(team2)
            url = `${this.baseURL}${this.statsEndpoint}?team1=${team1_encoded}&team2=${team2_encoded}`
            console.log("getStats: querying url: " + url)
            const resp = await fetch(url, payload);
            if (resp.ok) {
                const respBody = await resp.json();
                console.log(respBody);
                stats = respBody.stats;
            } else {
                console.error("/stats request failed: ", resp);
                try {
                    const respBody = await resp.json();
                    console.error(respBody);
                } catch (e) {}
            }
        } catch (e) {
            console.error("error occurred during getStats: " + e.message, e, e.stack);
        }
        return stats;
    }
};
export default StatsAPI;
