import { faBan, faCheck, faFileAlt, faPaperclip, faPaperPlane, faPhone, faRefresh, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import socket from "../../components/config/Socket";
import Icon from "../../components/base/Icon";
import Modal from '../../components/base/Moda'
import WhatsApp from "../../components/config/WhatsApp";
import Utils from "../../components/config/Utils";
import { saveMedia, getMedia } from "../../components/config/indexedDBUtils";

export default function RightChat({ chatId, sessionId, names, image, chats }) {

    const chatEndRef = useRef(null);
    const [pesan, setPesan] = useState("")
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(false)
    const [listChat, setListChat] = useState(chats || [])
    const handleSenText = async () => {
        socket.emit("sendText", { chatId, message: pesan, sessionId })
        setPesan("")
    }

    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        // **Tampilkan preview sesuai tipe file**
        if (selectedFile.type.startsWith("image/")) {
            setFilePreview(URL.createObjectURL(selectedFile));
        } else if (selectedFile.type.startsWith("video/")) {
            setFilePreview(URL.createObjectURL(selectedFile));
        } else if (selectedFile.type.startsWith("audio/")) {
            setFilePreview(null); // Tidak ada pratinjau untuk audio
        } else {
            setFilePreview(null); // Tidak ada pratinjau untuk dokumen lain
        }
        setPreview(true)
    };

    // **Fungsi menghapus file yang dipilih**
    const clearFile = () => {
        setFile(null);
        setFilePreview(null);
    };




    const handleSendMessage = () => {
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64Data = reader.result.split(",")[1];
                const mediaData = {
                    chatId,
                    sessionId,
                    file: {
                        data: base64Data,
                        mimetype: file.type,
                        filename: file.name,
                    },
                    caption: pesan,
                };

                socket.emit("sendMedia", mediaData);
                clearFile();
                setPesan("");
            };
        }

        setPreview(false)
    };
    useEffect(() => {
        setListChat(chats || []);
    }, [chats]);
    useEffect(() => {
        const fetchChatData = async () => {
            try {
                if (!chats || chats.length === 0) return;

                const chatData = await Promise.all(
                    chats.map(async (chat, index) => {
                        let mediaUrl = null;

                        try {
                            if (chat.hasMedia) {
                                // ✅ Cek media di IndexedDB
                                const blob = await getMedia(chat.id._serialized);
                                if (blob) {
                                    mediaUrl = URL.createObjectURL(blob); // ✅ Convert Blob ke Object URL
                                } else {
                                    setTimeout(() => {
                                        socket.emit("downloadMedia", { messageId: chat.id._serialized, sessionId });
                                    }, index * 200);
                                }
                            }
                        } catch (mediaError) {
                            console.error("Error fetching media:", mediaError);
                        }

                        return {
                            id: chat.id?._serialized || "",
                            fromMe: chat.fromMe || false,
                            mediaUrl,
                            caption: chat._data?.caption || "",
                            type: chat.type || "chat",
                            links: chat.links || [],
                            matchedText: chat._data?.matchedText || "",
                            thumbnail: chat._data?.thumbnail || null,
                            timestamp: chat.timestamp || Date.now(),
                            title: chat._data?.title || "",
                            description: chat._data?.description || "",
                            body: chat.body || "",
                            ack: chat._data?.ack || 0,
                        };
                    })
                );

                setListChat(chatData);
            } catch (error) {
                console.error("Error in fetchChatData:", error);
            }
        };

        fetchChatData();
    }, [chatId, chats])
    return (
        <div className="w-2/3 bg-white flex flex-col shadow-md max-h-[600px]">
            <div className="flex p-3 items-center">
                <img src={image} className="h-10 w-10 rounded-full object-cover" />
                <div className="ms-3">
                    <p className="font-bold">{names}</p>
                </div>
            </div>
            <div className="flex-1 bg-gray-100 text-sm p-4 overflow-auto no-scrollbar ">

                {listChat.length > 0 &&
                    listChat.map((msg, index) => (
                        <div
                            key={index}
                            ref={index === chats.length - 1 ? chatEndRef : null}
                            className={`flex ${msg.fromMe ? "justify-end" : "justify-start"} mb-1`}>
                            <div className={`${msg.fromMe ? "bg-green-100" : "bg-white"} p-1 px-2 rounded-lg w-auto flex flex-col  max-w-[400px] `}>
                                <div>
                                    <div className="max-w-[400px]">
                                        {msg.type === "image" && (
                                            <div className="flex flex-col">
                                                {!msg.mediaUrl ? (
                                                    <div className={`flex flex-col justify-center ${msg.fromMe ? "bg-green-200" : "bg-gray-100"} p-2 mb-2 rounded-md`}>
                                                        <FontAwesomeIcon icon={faRefresh} className="animate-spin mb-2" />
                                                        <p className="italic">Download media</p>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={msg.mediaUrl}
                                                        alt="Media"
                                                        className="w-full h-auto rounded-lg mb-2 cursor-pointer"
                                                        onClick={() => Utils.openMedia(msg.mediaUrl)}
                                                    />
                                                )}
                                                {msg.caption && (
                                                    <span dangerouslySetInnerHTML={{ __html: Utils.formatChat(msg.caption, msg) }} />
                                                )}

                                            </div>
                                        )}
                                        {msg.type === "sticker" && (
                                            <div>
                                                {!msg.mediaUrl ? (
                                                    <div className={`flex flex-col justify-center ${msg.fromMe ? "bg-green-200" : "bg-gray-100"} p-2 mb-2 rounded-md`}>
                                                        <FontAwesomeIcon icon={faRefresh} className="animate-spin mb-2" />
                                                        <p className="italic">Download media</p>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={msg.mediaUrl}
                                                        alt="Media"
                                                        className="w-full h-32 rounded-lg mb-2 cursor-pointer"
                                                    />
                                                )}

                                            </div>

                                        )}
                                        {msg.type === "video" && (
                                            <div>
                                                {!msg.mediaUrl ? (
                                                    <div className={`flex flex-col justify-center ${msg.fromMe ? "bg-green-200" : "bg-gray-100"} p-2 mb-2 rounded-md`}>
                                                        <FontAwesomeIcon icon={faRefresh} className="animate-spin mb-2" />
                                                        <p className="italic">Download media</p>
                                                    </div>
                                                ) : (
                                                    <video
                                                        controls
                                                        src={msg.mediaUrl}
                                                        className="w-full max-h-64 rounded-lg mb-2"
                                                        onClick={() => Utils.openMedia(msg.mediaUrl)}
                                                    />
                                                )}
                                            </div>

                                        )}
                                        {msg.type === "audio" && (
                                            <audio
                                                controls
                                                src={msg.mediaUrl}
                                                className="w-full mb-2"
                                                onClick={() => Utils.openMedia(msg.mediaUrl)}
                                            />
                                        )}
                                        {msg.type === "document" && (
                                            <div className="cursor-pointer " onClick={() => Utils.openMedia(msg.mediaUrl)}>
                                                {msg.mimetype === "application/pdf" ? (
                                                    <div className="flex mb-2 items-center space-x-3 text-sm p-2 bg-green-200 rounded-md">
                                                        <iframe
                                                            src={msg.mediaUrl}
                                                            className="w-full h-50 rounded-lg"
                                                            title="Preview PDF"
                                                        ></iframe>
                                                    </div>

                                                ) : (
                                                    <div className="flex mb-2 items-center space-x-3 text-sm p-2 bg-green-200 rounded-md">
                                                        <FontAwesomeIcon icon={faFileAlt} className="text-2xl text-blue-500" />
                                                        <div>
                                                            <p className="text-sm">{msg.caption}</p>
                                                            <p className="text-xs text-gray-400">{Utils.formatFileSize(msg.size)}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                        )}
                                    </div>
                                </div>
                                {/* Tampilkan teks pesan */}
                                {msg.links.length > 0 && (
                                    <a href={msg.matchedText} target="_blank">
                                        <div className="bg-green-200 text-sm rounded-lg mb-2 max-w-[400px]">
                                            {msg.thumbnail && <p className="text-xs">
                                                <div
                                                    className="w-full h-[200px] rounded-tl-lg rounded-tr-lg bg-cover bg-center"
                                                    style={{ backgroundImage: `url(data:image/jpeg;base64,${msg.thumbnail})` }}
                                                ></div>
                                            </p>}
                                            <div className="px-3 py-2">
                                                {msg.title ? <p className="text-xs m-0">
                                                    {msg.title}
                                                </p> : <p className="text-xs m-0">
                                                    {msg.matchedText}
                                                </p>}
                                                {msg.description && <p className="text-[10px] text-gray-500 m-0">
                                                    {msg.description}
                                                </p>}
                                            </div>
                                        </div>
                                    </a>
                                )}

                                {/* <p>{formatMessage(msg.body)}</p> */}
                                {msg.type === "chat" && (
                                    <span dangerouslySetInnerHTML={{ __html: Utils.formatChat(msg.body, msg) }} />
                                )}
                                {msg.type === "revoked" && (
                                    <div className="flex text-sm mb-2 items-center">
                                        <FontAwesomeIcon icon={faBan} className="text-gray-600 me-2" />
                                        <p>Pesan ini telah dihapus</p>
                                    </div>
                                )}
                                {msg.type === "call_log" && (
                                    <div className="bg-gray-200 flex text-sm mb-2 rounded-lg p-3 max-w-[400px] items-center">
                                        <div className="w-9 h-9 bg-gray-100 me-3 rounded-full flex justify-center items-center">
                                            <FontAwesomeIcon icon={faPhone} className="text-blue-600" />
                                        </div>
                                        <p>Log Panggilan</p>
                                    </div>
                                )}
                                <div className={`flex items-center ${msg.fromMe ? "justify-end" : "justify-start"}`}>
                                    <p className={`text-xs ${msg.fromMe ? "text-start" : "text-end w-full"} text-gray-500`}>
                                        {Utils.formatDate(msg.timestamp)}
                                    </p>
                                    {msg.fromMe && (
                                        <p className="text-xs ms-2">
                                            {msg.ack == 1 && <FontAwesomeIcon icon={faCheck} />}
                                            {msg.ack == 2 && <Icon.unRead />}
                                            {msg.ack == 3 && <Icon.Read />}
                                        </p>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}
            </div>
            <div className="flex p-4 items-center space-x-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                />
                <div className="cursor-pointer" onClick={() => fileInputRef.current.click()}>
                    <FontAwesomeIcon icon={faPaperclip} className="text-2xl" />
                </div>
                <div className="w-full">
                    <input
                        type="text"
                        placeholder="Pencarian Chat ..."
                        value={pesan}
                        onChange={(e) => setPesan(e.target.value)}
                        className="w-full bg-gray-50 px-3 py-2 border rounded-lg focus:outline-none border-gray-100" />
                </div>
                <div className="cursor-pointer" onClick={() => handleSenText()}>
                    <FontAwesomeIcon icon={faPaperPlane} className="text-3xl text-blue-500" />
                </div>
            </div>
            {file && <Modal isOpen={preview} >
                <div>
                    <div className="mb-2 relative">
                        <button
                            className="absolute top-2 right-2 text-red-500"
                            onClick={clearFile}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        {file.type.startsWith("image/") && (
                            <img src={filePreview} alt="Preview" className="max-h-50 mx-auto rounded-lg" />
                        )}

                        {file.type.startsWith("video/") && (
                            <video controls src={filePreview} className="max-h-50 mx-auto rounded-lg" />
                        )}

                        {file.type.startsWith("audio/") && (
                            <p className="text-sm text-gray-700">Audio: {file.name}</p>
                        )}

                        {!file.type.startsWith("image/") &&
                            !file.type.startsWith("video/") &&
                            !file.type.startsWith("audio/") && (
                                <p className="text-sm text-gray-700">Dokumen: {file.name}</p>
                            )}
                    </div>
                    <div className="flex space-x-5 mt-4 items-center bg-gray-50 p-3 rounded-lg">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Tmbahkan Keterangan disini..."
                                value={pesan}
                                onChange={(e) => setPesan(e.target.value)}
                                className="w-full bg-white px-3 py-2 border rounded-lg focus:outline-none border-gray-200" />
                        </div>
                        <div className="cursor-pointer" onClick={() => handleSendMessage()}>
                            <FontAwesomeIcon icon={faPaperPlane} className="text-3xl text-blue-500" />
                        </div>
                    </div>
                </div>
            </Modal>}
        </div>
    );
}
