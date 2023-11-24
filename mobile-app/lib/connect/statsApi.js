
const StatsAPI = class {
    baseURL = "https://mkscv9urgj.execute-api.us-east-2.amazonaws.com/api";
    teamsEndpoint = "/teams";
    compareEndpoint = "/compare";
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
};
export default StatsAPI;
