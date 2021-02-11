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
    try {
        let res = await axios.get("/api/candidates");
        return res.data;
    } catch(error) {
        return null;
    }

}
