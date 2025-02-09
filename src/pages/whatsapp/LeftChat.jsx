import { useEffect, useState, useRef } from "react";
import socket from "../../components/config/Socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faBullhorn, faClock, faImage, faNoteSticky, faVideo, faCheck } from "@fortawesome/free-solid-svg-icons";
import Icon from "../../components/base/Icon";
import RightChat from "./RightChat";

export default function LeftChat({ sessionId }) {
    const [listChat, setListChat] = useState([]);
    const profilPic = useRef(new Map());
    const [chatId, setChatId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState({});
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    
    const formatDate = (timestamp) => {
        const now = new Date();
        const timestampDate = new Date(timestamp * 1000);
        const today = new Date(now.setHours(0, 0, 0, 0));
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
    
        const dd = timestampDate.getDate().toString().padStart(2, "0");
        const mm = (timestampDate.getMonth() + 1).toString().padStart(2, "0");
        const yy = timestampDate.getFullYear().toString().slice(-2);
    
        if (timestampDate.toDateString() === new Date().toDateString()) {
            return timestampDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
        }
        if (timestampDate.toDateString() === yesterday.toDateString()) {
            return "Kemarin";
        }
        return `${dd}/${mm}/${yy}`;
    };
    

    const formatMessage = (message) => {
        if (!message) return "";
        return message.replace(/\*(.*?)\*/g, "<b>$1</b>").replace(/_(.*?)_/g, "<i>$1</i>");
    };

    useEffect(() => {
        const handleSocketEvent = async (data) => {
            
            if (data.event === "chats") {
                
                setListChat(data.data);

                data.data.forEach((chat) => {
                    if (!profilPic.current.has(chat.id)) {
                        socket.emit("profilPic", { userId: chat.id, sessionId });
                        profilPic.current.set(chat.id, null);
                    }
                });
            }

            if (data.event === "profilPic") {
                profilPic.current.set(data.data.userId, data.data.profilPic);
                setListChat((prevChats) => [...prevChats]);
            }

            if (data.event === "sendSeen") {
                setTimeout(() => socket.emit("chats", sessionId), 500);
            }
        };

        socket.on("waClient", handleSocketEvent);
        return () => socket.off("waClient", handleSocketEvent);
    }, [sessionId,listChat]);

    const handleSelectChat = (chatId) => {
        socket.emit("sendSeen", { chatId, sessionId });
        setChatId(chatId);
        setSelected({ [chatId]: true }); 
        setIsFirstLoad(true)
    };
    useEffect(()=>{

    },[])
    const filteredChats = listChat.filter(
        (chat) =>
            chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (chat.message?.toLowerCase() || "").includes(searchTerm.toLowerCase()) // Perbaikan: Cegah error jika `message` null
    );
    return (
        <div className="flex mt-3 space-x-4">
            <div className="lg:w-1/3 w-full bg-white p-2 flex flex-col max-h-[620px] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-900">
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
                        const isSelected = selected[chat.id] === true;
                        const profilePicUrl = profilPic.current.get(chat.id) || "default-avatar.png";
                        let message = chat.message || "";
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

                        switch (chat.Type) {
                            case "image":
                                icon = <FontAwesomeIcon icon={faImage} className="me-1" />;
                                message = chat.message || "Foto";
                                break;
                            case "sticker":
                                icon = <FontAwesomeIcon icon={faNoteSticky} className="me-1" />;
                                message = "Stiker";
                                break;
                            case "video":
                                icon = <FontAwesomeIcon icon={faVideo} className="me-1" />;
                                message = chat.message || "Video";
                                break;
                            case "chat":
                                break;
                            case "revoked":
                                icon = <FontAwesomeIcon icon={faBan} />;
                                message = "Pesan telah dihapus";
                                break;
                            case "notification_template":
                                icon = <FontAwesomeIcon icon={faClock} />;
                                message = `${chat.name} Menggunakan timer default untuk pesan`;
                                break;
                            case "interactive":
                                icon = <FontAwesomeIcon icon={faBullhorn} />;
                                break;
                            default:
                                break;
                        }

                        return (
                            <div
                                key={index}
                                className={`flex ${isSelected ? "bg-gray-100" : "bg-white"} items-center text-sm cursor-pointer hover:bg-gray-50 p-4 border-b-2 border-gray-100`}
                                onClick={() => handleSelectChat(chat.id)}
                            >
                                <img src={profilePicUrl} className="w-9 h-9 me-2 rounded-full" />
                                <div className="w-full flex flex-col">
                                    <div className="flex justify-between">
                                        <p className="font-bold">{chat.name}</p>
                                        <p className={`text-xs ${chat.unreadCount > 0 ? "text-green-500" : "text-gray-600"}`}>
                                            {formatDate(chat.timestamp)}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-500 flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                                            {chat.fromMe && (<span className="me-1">{read}</span>)} {icon}
                                            <span dangerouslySetInnerHTML={{ __html: formatMessage(message) }} />
                                        </p>
                                        {chat.unreadCount > 0 && (
                                            <p className="text-xs bg-green-500 text-white rounded-full flex justify-center items-center w-6 h-6">
                                                {chat.unreadCount}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500 text-center">Tidak ada hasil ditemukan</p>
                )}
            </div>

            {chatId && <RightChat 
                chatId={chatId} 
                sessionId={sessionId} 
                isFirstLoad={isFirstLoad} 
                setIsFirstLoad={setIsFirstLoad} />}
        </div>
    );
}
