// The endpoint to get the mics
const mic_api = "http://localhost:5001"

export async function fetchMicData() {
    try{
        const response = await fetch(mic_api + "/mics");
        if(!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }

        const dataObj = await response.json();
        return dataObj.mics;
    } catch (error) {
        console.error('API error: ', error)
    }
}

export async function startMicData() {
    try{
        const response = await fetch(mic_api + "/start");
        if(!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }
        return true;
    } catch (error) {
        console.error('API error: ', error)
    }
}

export async function postMicCheckStatus(jsonObj) {
    const response = await fetch(mic_api + "/mics", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(jsonObj),
    });
    if (!response.ok) {
        console.error('API response was not okay');
        return false;
    }

    return response.json();
}

export async function clearMicCheckStatus() {
    const response = await fetch(mic_api + "/clearmiccheck", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: null,
    });
        if (!response.ok) {
        console.error('API response was not okay');
        return false;
    }

    return response.json();
}