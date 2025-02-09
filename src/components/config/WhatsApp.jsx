import SupabaseClient from "./SupabaseClient";

const baseUrl = "http://con5.tokojapri.com:3000/api"
const secretKey = "ServerWhatsAppJapri2025"


const WA = {
    getToken: async (sessionId) => {
        const requestOptions = {
            method: "POST",
            redirect: "follow"
        };
        const response = await fetch(`${baseUrl}/${sessionId}/${secretKey}/generate-token`, requestOptions);

        return response.json();
    },
    getStatus: async (sessionId) => {

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        const response = await fetch(`${baseUrl}/${sessionId}/status-session`, requestOptions);
        return response.json();
    },
    startSession: async (sessionId) => {

        const myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "webhook": "",
            "waitQrCode": false
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const response = await fetch(`${baseUrl}/${sessionId}/start-session`, requestOptions);
        return response.json();
    },
    listChat: async (sessionId) => {

        const requestOptions = {
            method: "POST",
            redirect: "follow"
        };
        const response = await fetch(`${baseUrl}/${sessionId}/list-chats`, requestOptions);
        return response.json();
    },

}
export default WA;