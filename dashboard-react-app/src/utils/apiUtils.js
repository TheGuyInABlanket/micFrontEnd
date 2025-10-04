// The endpoint to get the mics
const mic_api = "http://192.168.1.178:8000/test"

export async function fetchMicData() {
    try{
        const response = await fetch(mic_api);
        if(!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }

        const dataObj = await response.json();
        return dataObj;
    } catch (error) {
        console.error('API error: ', error)
    }
}