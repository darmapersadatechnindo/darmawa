import { useEffect, useState } from "react"
import { useTitleContext } from "../components/config/TitleContext";
import socket from "../components/config/Socket";
import ListChats from "../components/whatsapp/ListChats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faClose, faFile } from "@fortawesome/free-solid-svg-icons";
import ListMessage from "../components/whatsapp/ListMessage";
import ChatInput from "../components/whatsapp/ChatInput";
import Icon from "../components/base/Icon";
export default function Chat() {
    const [listDevice, setListDevice] = useState([])
    const [selected, setSelected] = useState({});
    const [listChat, setListChat] = useState([])
    const [file, setFile] = useState(null);
    const [listMessage, setListMessage] = useState([])
    const { updateTitle, updateSubtitle, name, image, userId,updateUserId } = useTitleContext();
    const [preview, setPreview] = useState(false)
    const [sessionId, setSessionId] = useState("")
    const [filePreview, setFilePreview] = useState(null);
    const [pesan, setPesan] = useState("")
    useEffect(() => {
        updateTitle("WhatsApp");
        updateSubtitle("Chat");
        socket.emit("getDevice")
    }, [])
    useEffect(() => {
        const handleWaClients = (response) => {
            console.log(response);
            if (response.event === "showDevice") {
                const connectedDevices = response.data.filter(device => device.status === "CONNECTED");
                setListDevice(connectedDevices);
            }
            if (response.event === "chats") {
                setListChat(response.data);
            }
            if (response.event === "message_create") {
                const message = response.data.message
                console.log(message)
                setTimeout(() => {
                    if (message._data.id.fromMe && message._data.to === userId) {
                        socket.emit("showChats", { userId: message._data.to, sessionId })
                    }
                    if (!message._data.id.fromMe && message._data.from === userId) {
                        socket.emit("showChats", { userId: message._data.from, sessionId })
                    }
                    socket.emit("chats", sessionId)
                }, 500);
            }
            if (response.event === "message") {
                const message = response.data
                setTimeout(() => {
                    if (message._data.from === userId) {
                        socket.emit("showChats", { userId: message._data.from, sessionId })
                    }
                    socket.emit("chats", sessionId)
                }, 500);
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
                console.log(response)
                if(response.data.chat.id._serialized === userId){
                    updateUserId("")
                }
                socket.emit("chats", sessionId)
            }
        };
        const handleConsole = async (response) => {
            setListMessage(response.data)

        };

        socket.on("showChats", handleConsole);
        socket.on("waClient", handleWaClients);
        if (sessionId !== "") {
            socket.emit("chats", sessionId)
        }
        return () => {
            socket.off("waClient", handleWaClients);
            socket.off("showChats", handleConsole);
        };
    }, [sessionId]);
    const handleSelectSessionId = (userId) => {
        setSessionId(userId)
        setSelected({ [userId]: true });
    }
    if (listDevice.length === 0) {
        return (
            <div className="mt-24 flex flex-col justify-center items-center">
                <FontAwesomeIcon icon={faBan} className="text-9xl text-red-600" />
                <p className="text-4xl font-bold mt-4">Tidak ada device terhubung</p>
            </div>
        )
    }
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
    const handleKeyDown = () => {

    }
    const resetFile = () => {
        setPreview(false)
        setFile(null);
        setFilePreview(null);
    }
    const sendMessage = () => {
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64Data = reader.result.split(",")[1];
                const mediaData = {
                    chatId: userId,
                    sessionId,
                    file: {
                        data: base64Data,
                        mimetype: file.type,
                        filename: file.name,
                    },
                    caption: pesan,
                };
                socket.emit("showChats", { userId, sessionId })
                setTimeout(() => {
                    socket.emit("showChats", { userId, sessionId })
                }, 500);
                setFile(null);
                setFilePreview(null);
                setPesan("");
            };
        }
        setPreview(false)
    }
    return (
        <div className="flex space-x-4">
            <div className="flex space-y-4 flex-col text-sm w-20 p-2 rounded-full h-[640px] overflow-hidden bg-white">
                {listDevice.length > 0 && listDevice.map((device, index) => {
                    const isSelected = selected[device.sessionId] === true
                    return (
                        <div key={index} className={`${isSelected && "bg-blue-500 p-0.5 rounded-full"}`}>
                            <img
                                key={index} src={device.image}
                                className={`w-10 h-10 rounded-full object-cover mx-auto cursor-pointer`}
                                onClick={() => handleSelectSessionId(device.sessionId)} />
                        </div>

                    )
                })}
            </div>
            <div className="flex flex-col text-sm w-[550px] rounded-lg h-[640px] overflow-hidden bg-white">
                {sessionId !== "" && <ListChats sessionId={sessionId} listChat={listChat} />}

            </div>
            <div className="flex flex-col w-full">
                {userId &&
                    <div className="flex h-[640px] flex-col border-l border-gray-100">
                        <div className="p-4 bg-white flex items-center text-gray-900">
                            <img src={image} className="ms-3 w-10 h-10 rounded-full object-cover me-5" />
                            <p className="text-xl">{name}</p>
                        </div>
                        <div className="flex-1 bg-gray-200 overflow-auto no-scrollbar p-6">
                            {preview ? <div className="flex flex-col w-full h-full bg-gray-50">
                                <div className="flex-1 flex flex-col p-5">
                                    <div className="flex justify-end cursor-pointer" onClick={resetFile}>
                                        <FontAwesomeIcon icon={faClose} className="text-xl text-gray-700" />
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
                                <div className="p-2 bg-gray-300 flex items-center">
                                    <textarea
                                        className="w-full px-3 py-2 bg-gray-50 rounded-lg text-gray-800 focus:outline-none resize-none"
                                        placeholder="Masukan keterangan disini...."
                                        value={pesan}
                                        onChange={(e) => setPesan(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        rows={1}
                                    />
                                    <div onClick={sendMessage}>
                                        <Icon.send className="w-16 h-12 text-green-500 cursor-pointer" />
                                    </div>
                                </div>
                            </div> : listMessage.length > 0 && <ListMessage listMessage={listMessage} chatId={userId} sessionId={sessionId} />}

                        </div>
                        {!preview && <ChatInput sessionId={sessionId} handleFileSelect={handleFileSelect} />}
                    </div>
                }
            </div>

        </div>
    )
}