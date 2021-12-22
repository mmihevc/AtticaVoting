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
        return await axios.get("/api/candidates");
    } catch(error) {
        return null;
    }

}
