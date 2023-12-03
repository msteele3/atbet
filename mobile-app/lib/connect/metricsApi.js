
const MetricsAPI = class {
    baseURL = "https://mkscv9urgj.execute-api.us-east-2.amazonaws.com/api";
    reportEndpoint = "/report";
    apiKey = "jrdbGBoXnZ2Bed4Xk7xEk94Abv9zUV3d8l7p9wW8";

    constructor() {};

    reportTimerMetric = async(page, elapsed_time) => {
        try {
            const payload = {
                method: "POST",
                headers: {
                    'x-api-key': this.apiKey,
                },
                body: JSON.stringify({
                    type: 'timer',
                    page: page,
                    elapsed_time: elapsed_time,
                }),
            };
            const url = this.baseURL + this.reportEndpoint;
            console.log(`reportTimerMetric: querying ${url} with payload ${payload.body}`)
            const resp = await fetch(url, payload);
            if (resp.ok) {
                const respBody = await resp.json();
                console.log(respBody);
            } else {
                console.error("/report request failed: ", resp);
                try {
                    const respBody = await resp.json();
                    console.error(respBody);
                } catch (e) {}
            }
        } catch (e) {
            console.error("error occurred during reportTimerMetric: " + e.message, e, e.stack);
        }
    }

    reportFeatureMetric = async(feature, instance, used) => {
        try {
            const payload = {
                method: "POST",
                headers: {
                    'x-api-key': this.apiKey,
                },
                body: JSON.stringify({
                    type: 'feature',
                    feature: feature,
                    instance: instance,
                    used: used,
                }),
            };
            const url = this.baseURL + this.reportEndpoint;
            console.log(`reportFeatureMetric: querying ${url} with payload ${payload.body}`)
            const resp = await fetch(url, payload);
            if (resp.ok) {
                const respBody = await resp.json();
                console.log(respBody);
            } else {
                console.error("/report request failed: ", resp);
                try {
                    const respBody = await resp.json();
                    console.error(respBody);
                } catch (e) {}
            }
        } catch (e) {
            console.error("error occurred during reportFeatureMetric: " + e.message, e, e.stack);
        }
    }

};
export default MetricsAPI;
