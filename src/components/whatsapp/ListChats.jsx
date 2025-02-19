import { faCommentMedical, faImage, faNoteSticky, faVideo, faCheck, faPhone, faMicrophone, faBan, faMapPin, faThumbTack, faSearch, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";
import Utils from "../config/Utils";
import Icon from "../base/Icon";
import socket from "../config/Socket";
import { useRef, useState,useEffect } from "react";
import { useTitleContext } from "../config/TitleContext";
import { saveProfilUrl,getProfilUrl } from "../config/indexedDBUtils";

export default function ListChats({ listChat, setParrent, sessionId }) {
    const [selected, setSelected] = useState({});
    const { updateName, updateImage, updateUserId } = useTitleContext();
    const [isFocused, setIsFocused] = useState(false);
    const [pencarian, setPencarian] = useState("")
    const [filteredChats, setFilteredChats] = useState(listChat);
    const [profilUrl,setProfilUrl] = useState({})
    const formatMessage = (message) => {
        if (!message) return "";
        return message.replace(/\*(.*?)\*/g, "<b>$1</b>").replace(/_(.*?)_/g, "<i>$1</i>");
    };
    const getMessageStatusIcon = (chat) => {
        if (chat.fromMe) {
            if (chat.ack === 2) {
                return <Icon.unRead />;
            } else if (chat.ack === 1) {
                return <FontAwesomeIcon icon={faCheck} />;
            } else if (chat.ack === 3) {
                return <Icon.Read />;
            }
        }
        return null;
    };
    const handleClick = (userId, name, imageUrl) => {
        updateName(name)
        updateImage(imageUrl)
        updateUserId(userId)
        setSelected({ [userId]: true });
        socket.emit("showChats", { userId, sessionId })
        
    }
    const focusInput = () => {
        setIsFocused(true);
    };
    const blurInput = () => {
        setPencarian("")
        setIsFocused(false);
       
    };
    useEffect(() => {
        if (pencarian !== "") {
            setFilteredChats(
                listChat.filter(chat => 
                    chat.name.toLowerCase().includes(pencarian.toLowerCase()) || 
                    (chat.body && chat.body.toLowerCase().includes(pencarian.toLowerCase()))
                )
            );
        } else {
            setFilteredChats(listChat);
        }
    }, [pencarian, listChat]);
    useEffect(() => {
        const fetchProfileUrls = async () => {
            const profilUrls = await Promise.all(
                listChat.map(async (chat, index) => {
                    const imgUrl = await getProfilUrl(chat.chatId);
                    if (imgUrl) {
                        return { id: chat.chatId, imgUrl };
                    } else {
                        setTimeout(() => {
                            
                            socket.emit("getcontact", { chatId: chat.chatId, sessionId });

                        }, index * 200);
                        return { id: chat.id, imgUrl: null };
                    }
                })
            );
    
            const profilObj = {};
            profilUrls.forEach(({ id, imgUrl }) => {
                if (imgUrl) {
                    profilObj[id] = imgUrl;
                }
            });
    
            setProfilUrl(profilObj);
        };
    
        if (listChat.length > 0) {
            fetchProfileUrls();
        }
        const updateProfilPic = async (response)=>{
            if(response.event === "getcontact"){
                
                await saveProfilUrl(response.data.chatId,response.data.imageUrl)
            }
        }
        socket.on("waClient",updateProfilPic)
    }, [listChat]);
    
    return (
        <div className="">
            <div className="flex flex-col max-h-screen p-2">
                <div className="mb-3">
                    <div className="flex text-white p-3 justify-between">
                        <p className="text-2xl font-bold">Chat</p>
                        <p onClick={setParrent} className="cursor-pointer">
                            <FontAwesomeIcon icon={faCommentMedical} className="text-2xl" /></p>
                    </div>
                    <div className="flex bg-gray-700 w-full px-4 py-3 rounded-xl mb-3">
                        {!isFocused && (
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="text-gray-400 text-xl cursor-pointer"
                                onClick={focusInput}
                            />
                        )}
                        {isFocused && (
                            <FontAwesomeIcon
                                icon={faArrowLeft}
                                className="text-white text-xl cursor-pointer"
                                onClick={blurInput}
                            />
                        )}
                        <input
                            type="text"
                            value={pencarian}
                            onChange={(e) => setPencarian(e.target.value)}
                            className="text-white ms-4 w-full bg-gray-700 focus:outline-none"
                            placeholder="Cari"
                            onFocus={() => setIsFocused(true)}
                            onBlur={blurInput} 
                        />


                    </div>
                </div>
                <div className="flex-1 flex flex-col overflow-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-800">
                    <AnimatePresence exitBeforeEnter>
                        {filteredChats.length > 0 && filteredChats.map((chat, index) => {
                            let message;
                            let icon = null;
                            const imageUrl = profilUrl[chat.chatId];
                            const isSelected = selected[chat.chatId] === true;
                           
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
                                <motion.div
                                    key={chat.chatId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    layoutId={chat.chatId}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    onClick={() => handleClick(chat.chatId, chat.name, imageUrl)}
                                    className={`flex p-3 ${isSelected && "bg-gray-700"} cursor-pointer items-center border-b border-gray-700 hover:bg-gray-700`}
                                >
                                    <img src={imageUrl} className="w-12 h-12 rounded-full object-cover" />
                                    <div className="flex flex-col text-white w-full ms-4">
                                        <div className="flex justify-between text-md">
                                            <p>{chat.name} {chat.pinned && ""}</p>
                                            <p className="text-sm">{Utils.formatDate(chat.timestamp)}</p>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-400">
                                            <p className="flex space-x-1 items-center overflow-hidden text-ellipsis whitespace-nowrap">
                                                {getMessageStatusIcon(chat)} {icon}
                                                <span dangerouslySetInnerHTML={{ __html: formatMessage(message) }} />
                                            </p>
                                            {chat.unread > 0 ? (
                                                <p className="text-xs bg-emerald-500 text-black rounded-full flex justify-center items-center w-6 h-6">
                                                    {chat.unread}
                                                </p>
                                            ) : chat.pinned && <FontAwesomeIcon icon={faThumbTack} />}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

            </div>
        </div>

    )
}