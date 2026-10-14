// The endpoint to get the mics
// const mic_api = "http://127.0.0.1:8000"
const mic_api = `http://${window.location.hostname}:8000`


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

export async function fetchShowData() {
    try{
        const response = await fetch(mic_api + "/shows");
        if(!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }

        const dataObj = await response.json();
        return dataObj;
        //return dataObj.shows;
    } catch (error) {
        console.error('API error: ', error)
    }
}

export async function postShowConfiguration(jsonObj) {
  const response = await fetch(mic_api + "/shows", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jsonObj),
  });

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `Saving shows failed (${response.status}): ${errorBody}`
    );
  }

  return response.json();
}

export async function postActiveShow(showNumber) {
  const response = await fetch(mic_api + "/activate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      activateshow: Number(showNumber),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `Activating show failed (${response.status}): ${errorBody}`
    );
  }

  return response.json();
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