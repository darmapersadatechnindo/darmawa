import { useEffect, useState, useRef } from "react";
import socket from "../../components/config/Socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faBullhorn, faClock, faImage, faNoteSticky, faVideo, faCheck, faPhoneSlash, faMicrophone, faPhone } from "@fortawesome/free-solid-svg-icons";
import Icon from "../../components/base/Icon";
import RightChat from "./RightChat";
import _ from "lodash";
import WhatsApp from "../../components/config/WhatsApp";
import Utils from '../../components/config/Utils'

export default function LeftChat({ sessionId, listChat }) {

    const [chatId, setChatId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState({});
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    
    useEffect(() => {
        
    }, [sessionId, listChat])

    const formatMessage = (message) => {
        if (!message) return "";
        return message.replace(/\*(.*?)\*/g, "<b>$1</b>").replace(/_(.*?)_/g, "<i>$1</i>");
    };


    const handleSelectChat = async (chatId,name,image,isGroup) => {
        const result = await WhatsApp.sendSeen(sessionId,chatId,isGroup);
        setTimeout(async () => {
            await WhatsApp.listChat(sessionId)
        }, 500);
        setChatId(chatId);
        setName(name)
        setImage(image)
        setSelected({ [chatId]: true });
        
    };


    
    const filteredChats = (listChat || []).filter(
        (chat) =>
            chat.contact?.formattedName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (chat.lastMessage?.body?.toLowerCase() || "").includes(searchTerm.toLowerCase())
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
                        const isSelected = selected[chat.id._serialized] === true;
                        let profilPic
                        if (chat.isGroup) {
                            profilPic = chat.contact.profilePicThumbObj?.eurl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_vKQqeh6KEcMZJl6M3kxxCybMxDvZErbrfQ&s"
                        } else {
                            profilPic = chat.contact.profilePicThumbObj?.eurl || "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
                        }
                        
                        let message;
                        let icon = null;
                        let read = null;
                        
                        if (chat.lastMessage?.fromMe, chat.lastMessage?.ack) {
                            switch (chat.lastMessage?.ack) {
                                case 1: read = <FontAwesomeIcon icon={faCheck} />; break;
                                case 2: read = <Icon.unRead />; break;
                                case 3: read = <Icon.Read />; break;
                                default: break;
                            }
                        }

                        switch (chat.lastMessage?.type) {
                            case "image":
                                icon = <FontAwesomeIcon icon={faImage} className="me-1" />;
                                message = chat.lastMessage.caption || "Foto";
                                break;
                            case "sticker":
                                icon = <FontAwesomeIcon icon={faNoteSticky} className="me-1" />;
                                message = chat.lastMessage.caption || "Stiker";
                                break;
                            case "video":
                                icon = <FontAwesomeIcon icon={faVideo} className="me-1" />;
                                message = chat.lastMessage.caption || "Video";
                                break;
                            case "ptv":
                                icon = <FontAwesomeIcon icon={faVideo} className="me-1" />;
                                message = chat.lastMessage.caption || "Video pendek";
                                break;
                            case "chat":
                                message = chat.lastMessage.body;
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
                                onClick={() => handleSelectChat(chat.id._serialized,chat.contact.formattedName,profilPic,chat.isGroup)}
                            >
                                <img src={profilPic} className="w-9 h-9 me-2 rounded-full object-cover" />
                                <div className="w-full flex flex-col">
                                    <div className="flex justify-between">
                                        <p className="font-bold">{chat.contact.formattedName}</p>
                                        <p className={`text-xs ${chat.unreadCount > 0 ? "text-green-500" : "text-gray-600"}`}>
                                            {Utils.formatDate(chat.lastMessage?.timestamp)}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-500 flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                                            {chat.lastMessage?.fromMe && (<span className="me-1">{read}</span>)} {icon}
                                            <span dangerouslySetInnerHTML={{ __html: formatMessage(message)}} />
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
                    <p className="text-gray-500 text-center">Sedang memuat list chat</p>
                )}
            </div>

            {chatId && <RightChat
                chatId={chatId}
                sessionId={sessionId}
                names={name}
                image={image}
                />}
        </div>
    );
}
