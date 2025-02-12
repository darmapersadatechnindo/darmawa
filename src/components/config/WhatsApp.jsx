import axios from "axios";
import { getMedia } from "./indexedDBUtils";

//const baseUrl = "http://103.79.131.45:3000/api";
const baseUrl = "http://185.250.38.224:8000/api";
const secretKey = "DarmaPersadaTechnindo";

const WhatsApp = {
    getToken: async (sessionId) => {
        const response = await axios.post(`${baseUrl}/${sessionId}/${secretKey}/generate-token`);
        return response.data;
    },
    getStatus: async (sessionId) => {
        const response = await axios.get(`${baseUrl}/${sessionId}/status-session`);
        return response.data;
    },
    startSession: async (sessionId) => {
        const payload = {
            webhook: "",
            waitQrCode: true
        };

        const response = await axios.post(`${baseUrl}/${sessionId}/start-session`, payload, {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            }
        });

        return response.data;
    },
    listChat: async (sessionId) => {
        const response = await axios.post(`${baseUrl}/${sessionId}/list-chats`);
        return response.data;
    },
    hostDevice: async (sessionId) => {
        const response = await axios.get(`${baseUrl}/${sessionId}/host-device`);
        return response.data;
    },
    profilPic: async (sessionId, phone) => {
        const response = await axios.get(`${baseUrl}/${sessionId}/profile-pic/${phone}`);
        return response.data;
    },
    logout: async (sessionId) => {
        const response = await axios.post(`${baseUrl}/${sessionId}/logout-session`);
        return response.data;
    },
    loadMessage: async (sessionId, phone) => {
        const response = await axios.get(`${baseUrl}/${phone}/all-messages-in-chat/${sessionId}?isGroup=false&includeMe=true&includeNotifications=true`,{
            headers: {
                "accept": "*/*"
              },
        });
        return response.data;
    },
    getMedia: async (sessionId,messageId) => {
        const response = await axios.get(`${baseUrl}/${sessionId}/get-media-by-message/${messageId}`,{
            headers: {
                "accept": "*/*"
              },
        });
        return response.data;
    },
    sendSeen : async (sessionId, chatId, isGroup) => {
        try {
            const response = await axios.post(`${baseUrl}/${sessionId}/send-seen`, 
                {
                    phone: chatId,
                    isGroup: isGroup
                }, 
                {
                    headers: {
                        "accept": "*/*",
                        "Content-Type": "application/json"
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error sending seen status:", error);
            return null;
        }
    },
    sendMessage : async (sessionId, chatId, content) => {
        try {
            const response = await axios.post(`${baseUrl}/${sessionId}/send-message`, 
                {
                    phone: chatId,
                    isGroup: false,
                    isNewsletter:false,
                    isLid:false,
                    message:content
                }, 
                {
                    headers: {
                        "accept": "*/*",
                        "Content-Type": "application/json"
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error sending seen status:", error);
            return null;
        }
    },  
};

export default WhatsApp;
