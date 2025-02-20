import { faAddressBook, faCog, faCommentDots, faCommentMedical, faImage, faNoteSticky, faVideo, faCheck, faPhone, faMicrophone, faArrowRight, faArrowLeft, faInfo, faInfoCircle, faPaperclip, faBan, faClose, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import socket from "../config/Socket";
import { useEffect, useState } from "react";
import Icon from "../base/Icon";
import ListChats from "../whatsapp/ListChats";
import Contact from "../whatsapp/Contact";
import ListMessage from "../whatsapp/ListMessage";
import { useTitleContext } from "../config/TitleContext";
import Info from "../whatsapp/Info";
import ChatInput from "../whatsapp/ChatInput";

export default function Console() {
    const { name, image, userId, updateUserId } = useTitleContext();
    const { sessionId } = useParams();
    const [user, setUser] = useState({})
    const [listChat, setListChat] = useState([])
    const [listContact, setListContact] = useState([])
    const [parrent, setParrent] = useState("")
    const [chatId, setChatId] = useState("")
    const [listMessage, setListMessage] = useState([])
    const [disconnected, setDisconnected] = useState(false)
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [preview, setPreview] = useState(false);
    const [message, setMessage] = useState("")
    const [pesan, setPesan] = useState("")
    useEffect(() => {
        if (sessionId) {
            document.title = `Console Device ${sessionId}`;
            socket.emit("showDevice", sessionId);
            socket.emit("chats", sessionId)
            socket.emit("status", sessionId);
            setParrent("chat")
        }
    }, [sessionId])
    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;
        setFile(selectedFile);
        if (selectedFile.type.startsWith("image/")) {
            setFilePreview(URL.createObjectURL(selectedFile));
        } else if (selectedFile.type.startsWith("video/")) {
            setFilePreview(URL.createObjectURL(selectedFile));
        } else if (selectedFile.type.startsWith("audio/")) {
            setFilePreview(null);
        } else {
            setFilePreview(null);
        }
        setPreview(true)
    };
    useEffect(() => {
        const handleConsole = async (response) => {
            if (response.event === "showUser") {
                setUser(response.data);
            }
            if (response.event === "chats") {
                setListChat(response.data);
            }
            if (response.event === "message_create") {
                const message = response.data.message
                setTimeout(() => {
                    if (message._data.id.fromMe && message._data.to === userId) {
                        socket.emit("showChats", { userId: message._data.to, sessionId })
                    }
                    if (!message._data.id.fromMe && message._data.from === userId) {
                        socket.emit("showChats", { userId: message._data.from, sessionId })
                    }
                    socket.emit("chats", sessionId)
                }, 1000);
            }
            if (response.event === "message") {
                const message = response.data
                setTimeout(() => {
                    if (message._data.from === userId) {
                        socket.emit("showChats", { userId: message._data.from, sessionId })
                    }
                    socket.emit("chats", sessionId)
                }, 1000);
            }
            if (response.event === "message_ack") {
                const message = response.data.message
                setTimeout(() => {
                    if (message._data.id.fromMe && message._data.to === userId) {
                        socket.emit("showChats", { userId: message._data.to, sessionId })
                    }
                    if (!message._data.id.fromMe && message._data.from === userId) {
                        socket.emit("showChats", { userId: message._data.from, sessionId })
                    }
                    socket.emit("chats", sessionId)
                }, 1000);
            }
            if (response.event === "chat_removed") {
                updateUserId("")
                socket.emit("chats", sessionId)
            }
            if (response.event === "contact") {
                setListContact(response.data)

            }
            if (response.event === "disconnected") {
                setDisconnected(true)
            }
            if (response.event === "status") {
                if (response.data.message === "Not Connected") {
                    setDisconnected(true)
                }
            }
        };

        socket.on("waClient", handleConsole);
        return () => {

            socket.off("waClient", handleConsole);
        };

    }, [userId, sessionId]);

    const handleChat = () => {
        socket.emit("chats", sessionId)
        setParrent("chat")
    }

    const handleContact = () => {
        socket.emit("contact", sessionId)
        setParrent("contact")
    }
    const handleInfo = () => {
        setParrent("info")
    }
    useEffect(() => {
        const handleConsole = async (response) => {
            setChatId(response.event)
            setListMessage(response.data)

        };

        socket.on("showChats", handleConsole);
    }, []);
    if (disconnected) {
        return (
            <div className="flex h-screen w-screen justify-center items-center text-white bg-gray-900">
                <div className="flex flex-col justify-center space-y-2">
                    <FontAwesomeIcon icon={faBan} className="h-32 w-32 mx-auto text-red-700" />
                    <p className="text-2xl">Device Not Connected</p>
                </div>

            </div>
        )
    }
    const sendMessage = () => {
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64Data = reader.result.split(",")[1];
                const mediaData = {
                    chatId:userId,
                    sessionId,
                    file: {
                        data: base64Data,
                        mimetype: file.type,
                        filename: file.name,
                    },
                    caption: pesan,
                };

                socket.emit("sendMedia", mediaData);
                setFile(null);
                setFilePreview(null);
                setPesan("");
            };
        }
        setPreview(false)
    }
    const handleKeyDown = () => {

    }
    const resetFile = () => {
        setPreview(false)
        setFile(null);
        setFilePreview(null);
    }
    return (

        <div className="h-screen w-full bg-gray-900 text-gray-950 flex">
            <div className="h-screen bg-gray-700 px-3 py-6 flex flex-col space-y-4">
                <div
                    className="flex bg-gray-600 rounded-full justify-center items-center w-10 h-10 cursor-pointer"
                    onClick={() => handleChat()}
                >
                    <FontAwesomeIcon icon={faCommentDots} className="text-xl text-white" />
                </div>
                <div
                    className="flex bg-gray-600 rounded-full justify-center items-center w-10 h-10 cursor-pointer"
                    onClick={() => handleContact()}
                >
                    <FontAwesomeIcon icon={faAddressBook} className="text-xl text-white" />
                </div>
                <div className="flex-1">

                </div>
                <div className="flex bg-gray-600 rounded-full justify-center items-center w-10 h-10 cursor-pointer"
                    onClick={() => handleInfo()}>
                    <FontAwesomeIcon icon={faInfo} className="text-xl text-white" />
                </div>
                <div className="flex bg-gray-600 rounded-full justify-center items-center w-10 h-10 cursor-pointer">
                    <img src={user.image} className="w-9 h-9 rounded-full object-cover" />
                </div>
            </div>
            <div className="w-[400px] h-screen bg-gray-800">
                {parrent === "chat" && <ListChats listChat={listChat} setParrent={handleContact} sessionId={sessionId} />}
                {parrent === "contact" && <Contact listContact={listContact} handleChat={handleChat} />}
                {parrent === "info" && <Info />}
            </div>
            {userId && (
                <div className="flex-1 w-full h-screen flex flex-col border-l border-gray-700">
                    <div className="p-4 bg-gray-700 flex items-center text-white">
                        <img src={image} className="ms-3 w-10 h-10 rounded-full object-cover me-5" />
                        <p className="text-xl">{name}</p>
                    </div>
                    <div className="flex-1 bg-gray-900 overflow-auto no-scrollbar p-6">
                        {preview ?
                            <div className="flex flex-col w-full h-full bg-gray-700">
                                <div className="flex-1 flex flex-col p-5">
                                    <div className="flex justify-end cursor-pointer" onClick={resetFile}>
                                        <FontAwesomeIcon icon={faClose} className="text-xl text-white" />
                                    </div>
                                    <div className="flex-1 p-4 flex justify-center items-center">
                                        {file.type.startsWith("image/") && (
                                            <img src={filePreview} alt="Preview" className="max-h-[400px] mx-auto rounded-lg" />
                                        )}

                                        {file.type.startsWith("video/") && (
                                            <video controls src={filePreview} className="max-h-[400px] mx-auto rounded-lg" />
                                        )}

                                        {file.type.startsWith("audio/") && (
                                            <p className="text-sm text-gray-700">Audio: {file.name}</p>
                                        )}

                                        {!file.type.startsWith("image/") && !file.type.startsWith("video/") && !file.type.startsWith("audio/") && (
                                            <div className="flex flex-col justify-center">
                                                <FontAwesomeIcon icon={faFile} className="text-blue-500 w-24 h-24 mx-auto mb-2" />
                                                <p className="text-sm text-white">Dokumen: {file.name}</p>

                                            </div>

                                        )}
                                    </div>
                                </div>
                                <div className="p-2 bg-gray-800 flex items-center">
                                    <textarea
                                        className="w-full px-3 py-2 bg-gray-600 rounded-lg text-white focus:outline-none resize-none"
                                        placeholder="Masukan keterangan disini...."
                                        value={pesan}
                                        onChange={(e) => setPesan(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        rows={1}
                                    />
                                    <div onClick={sendMessage}>
                                        <Icon.send className="w-16 h-12 text-white cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            :
                            <ListMessage chatId={chatId} listMessage={listMessage} sessionId={sessionId} />
                        }

                    </div>
                    {!preview && <ChatInput sessionId={sessionId} handleFileSelect={handleFileSelect} />}

                </div>
            )}

        </div>
    )

}