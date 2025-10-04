// The endpoint to get the mics
const mic_api = "http://192.168.1.158:5001"

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