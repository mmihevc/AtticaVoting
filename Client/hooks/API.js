import axios from 'axios';

export async function sendPostRequest(location, requestBody) {
    try {
        return await axios.post("/api/"+location, requestBody)
    }
    catch(error) {
        return null;
    }
}

export async function sendGetRequest() {
    let res = await axios.get("/api/candidates");
    return res.data;
}
