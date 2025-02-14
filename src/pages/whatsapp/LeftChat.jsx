import { useEffect, useState, useRef } from "react";
import socket from "../../components/config/Socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faBullhorn, faImage, faNoteSticky, faVideo, faCheck, faPhone, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import Icon from "../../components/base/Icon";
import RightChat from "./RightChat";
import Utils from '../../components/config/Utils';
import { saveMedia, getMedia } from "../../components/config/indexedDBUtils";

export default function LeftChat({ sessionId, listChat }) {
    const [chatId, setChatId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState({});
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [chats,setChats] = useState([])
    const requestedContacts = useRef(new Set());
    const base64ToArrayBuffer = (base64) => {
        const binaryString = atob(base64); // Decode base64 ke binary string
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };
    useEffect(() => {
        listChat.forEach((chat, index) => {
            if (!chat.imageUrl && !requestedContacts.current.has(chat.chatId)) {
                requestedContacts.current.add(chat.chatId);
                setTimeout(() => {
                    socket.emit("getcontact", { chatId: chat.chatId, sessionId });
                }, index * 200);
            }
        });
    }, [sessionId, listChat]);

    const formatMessage = (message) => {
        if (!message) return "";
        return message.replace(/\*(.*?)\*/g, "<b>$1</b>").replace(/_(.*?)_/g, "<i>$1</i>");
    };

    const handleSelectChat = (chatId, name, image) => {
        setChatId(chatId);
        setName(name);
        setImage(image);
        setSelected({ [chatId]: true });
        socket.emit("showChats", { userId: chatId, sessionId });
    };
    
    const filteredChats = (listChat || []).filter(
        (chat) =>
            chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (chat.body?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
    useEffect(() => {
        if (chatId !== "" && sessionId !== "") {
            const showMessage = async (response) => {
                
                if (response.event === chatId) {
                    console.log(response)
                    const listMessage = response.data
                    const chatData = await Promise.all(listMessage.map(async (chat, index) => {
                        let mediaUrl = null;
                        if (chat.hasMedia) {
                            const mediaBlob = await getMedia(chat.id._serialized);
                            if (mediaBlob instanceof Blob) {
                                mediaUrl =  URL.createObjectURL(mediaBlob);

                            } else {
                                socket.emit("downloadMedia", { messageId: chat.id._serialized, sessionId });
                            }
                        }
                        return {
                            id:chat.id._serialized,
                            fromMe: chat.fromMe,
                            mediaUrl,
                            caption: chat._data.caption,
                            type: chat.type,
                            links: chat.links,
                            matchedText: chat._data.matchedText,
                            thumbnail: chat._data.thumbnail,
                            timestamp: chat.timestamp,
                            title: chat._data.title,
                            description: chat._data.description,
                            body: chat.body,
                            ack: chat._data.ack,
                        };
                    }))
                    setChats(chatData)
                }
                if (response.event === "downloadMedia") {
                    const { messageId, media } = response.data;
                    
                    const mediaArrayBuffer = base64ToArrayBuffer(media.data);
                    const mediaBlob = new Blob([mediaArrayBuffer], { type: media.mimetype });
                    await saveMedia(messageId, mediaBlob, media.mimetype);
            
                    setChats((prevChats) =>
                        prevChats.map((chat) => {
                            if (chat.id === messageId) {
                                if (chat.mediaUrl) {
                                    URL.revokeObjectURL(chat.mediaUrl); // Hapus URL lama
                                }
                                return { ...chat, mediaUrl: URL.createObjectURL(mediaBlob) };
                            }
                            return chat;
                        })
                    );
                }
            }
            socket.on("showChats", showMessage);
            socket.on("downloadMedia", showMessage);
            return () => {
                socket.off("showChats", showMessage);
                socket.off("downloadMedia", showMessage);
            };
        }

    }, [chatId, sessionId])
    useEffect(()=>{
        const waClient = (response)=>{
            if(response.event === "message_create"){
                const userId = response.data.message.to;
                if(chatId === userId){
                    setTimeout(() => {
                        socket.emit("showChats", { userId, sessionId });
                    }, 500);
                }
            }
            if(response.event === "message"){
                const userId = response.data.message.from;
                if(chatId === userId){
                    setTimeout(() => {
                        socket.emit("showChats", { userId, sessionId });
                    }, 500);
                }
            }
            if(response.event === "chat_removed"){
                setChatId("")
            }
            if(response.event === "message_ack"){
                const userId = response.data.message.to;
                if(chatId === userId){
                    setTimeout(() => {
                        socket.emit("showChats", { userId, sessionId });
                    }, 500);
                }
            }
        }
        socket.on("waClient", waClient);
        return () => {
            socket.off("waClient", waClient);
        };
    },[chatId, sessionId])
    return (
        <div className="flex mt-3 space-x-4">
            <div 
                className="lg:w-1/3 w-full bg-white p-2 flex flex-col max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-900">
                {sessionId !== "" && (
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Pencarian Chat ..."
                        className="w-full bg-gray-200 px-3 py-2 border rounded-lg focus:outline-none border-gray-300 mb-4"
                    />
                )}

                {filteredChats.length > 0 && sessionId !== "" ? (
                    filteredChats.map((chat, index) => {
                        const isSelected = selected[chat.chatId] === true;

                        let message;
                        let icon = null;
                        let read = null;

                        if (chat.fromMe) {
                            switch (chat.ack) {
                                case 1: read = <FontAwesomeIcon icon={faCheck} />; break;
                                case 2: read = <Icon.unRead />; break;
                                case 3: read = <Icon.Read />; break;
                                default: break;
                            }
                        }

                        switch (chat.type) {
                            case "image":
                                icon = <FontAwesomeIcon icon={faImage} className="me-1" />;
                                message = chat.caption || "Foto";
                                break;
                            case "sticker":
                                icon = <FontAwesomeIcon icon={faNoteSticky} className="me-1" />;
                                message = chat.caption || "Stiker";
                                break;
                            case "video":
                                icon = <FontAwesomeIcon icon={faVideo} className="me-1" />;
                                message = chat.caption || "Video";
                                break;
                            case "chat":
                                message = chat.body;
                                break;
                            case "revoked":
                                icon = <FontAwesomeIcon icon={faBan} className="me-1" />;
                                message = "Pesan telah dihapus";
                                break;
                            case "call_log":
                                icon = <FontAwesomeIcon icon={faPhone} className="me-1" />;
                                message = "Log Panggilan";
                                break;
                            case "ptt":
                                icon = <FontAwesomeIcon icon={faMicrophone} className="text-blue-500 me-1" />;
                                message = "Pesan suara";
                                break;
                            case "interactive":
                                icon = <FontAwesomeIcon icon={faBullhorn} className="me-1" />;
                                break;
                            default:
                                break;
                        }

                        return (
                            <div
                                key={index}
                                className={`flex ${isSelected ? "bg-gray-100" : "bg-white"} items-center text-sm cursor-pointer hover:bg-gray-50 p-4 border-b-2 border-gray-100`}
                                onClick={() => handleSelectChat(chat.chatId, chat.name, chat.imageUrl)}
                            >
                                <img src={chat.imageUrl} className="w-9 h-9 me-2 rounded-full object-cover" />
                                <div className="w-full flex flex-col">
                                    <div className="flex justify-between">
                                        <p className="font-bold">{chat.name}</p>
                                        <p className={`text-xs ${chat.unread > 0 ? "text-green-500" : "text-gray-600"}`}>
                                            {Utils.formatDate(chat.timestamp)}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-500 flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                                            {chat.fromMe && (<span className="me-1">{read}</span>)} {icon}
                                            <span dangerouslySetInnerHTML={{ __html: formatMessage(message) }} />
                                        </p>
                                        {chat.unread > 0 && (
                                            <p className="text-xs bg-green-500 text-white rounded-full flex justify-center items-center w-6 h-6">
                                                {chat.unread}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500 text-center">Sedang memuat list chat</p>
                )}
            </div>

            {chatId && <RightChat chatId={chatId} sessionId={sessionId} names={name} image={image} chats={chats} />}
        </div>
    );
}
